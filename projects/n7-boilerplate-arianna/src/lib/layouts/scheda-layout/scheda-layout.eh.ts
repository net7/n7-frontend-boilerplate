import { ActivatedRoute, Router } from '@angular/router';
import { EventHandler } from '@net7/core';
import { clone, isEmpty, isNumber } from 'lodash';
import {
  forkJoin, from, of, ReplaySubject, Subject, timer
} from 'rxjs';
import {
  debounce, filter, first, switchMap
} from 'rxjs/operators';
import { ConfigurationService } from '@net7/boilerplate-common';
import { AwSchedaLayoutDS } from './scheda-layout.ds';

export class AwSchedaLayoutEH extends EventHandler {
  dataSource: AwSchedaLayoutDS;

  private destroyed$: Subject<any> = new Subject();

  private configuration: ConfigurationService;

  private route: ActivatedRoute;

  private router: Router;

  private treeLoaded$: ReplaySubject<void> = new ReplaySubject();

  private extendedTreeChanged$: Subject<{
    key: string;
    value: string | number;
    delay?: number;
  }> = new Subject();

  private pageInputValue: number;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-scheda-layout.init': {
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          this.router = payload.router;
          const paramId = this.route.snapshot.params.id || '';
          if (paramId) {
            this.dataSource.currentId = paramId;
          }
          this.listenRoute();
          this.listenRouteQueryParams();
          this.listenExtendedTree();
          this.loadNavigation(paramId);
          this.emitOuter('viewleaf');
          // scroll top
          window.scrollTo(0, 0);
        } break;

        case 'aw-scheda-layout.destroy':
          this.destroyed$.next();
          this.dataSource.onDestroy();
          break;

        case 'aw-scheda-layout.togglesidebar':
          this.dataSource.collapseSidebar();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-sidebar-header.click':
          this.dataSource.collapseSidebar();
          break;
        case 'aw-scheda-dropdown.click':
          this.dataSource.changeDigitalObject(payload);
          break;
        case 'aw-extended-tree.change': {
          let key: string;
          let delay: number;
          if (payload.inputPayload === 'search-input') {
            key = 'query';
            delay = 1000;
          } else if (payload.inputPayload === 'limit-select') {
            key = 'limit';
          } else if (payload.inputPayload === 'page-input-change') {
            this.pageInputValue = payload.value;
          } else if (payload.inputPayload === 'page-input-enter') {
            key = 'page';
          }

          if (key) {
            this.extendedTreeChanged$.next({
              key,
              delay,
              value: payload.value,
            });
          }
        } break;
        case 'aw-extended-tree.search':
          this.extendedTreeChanged$.next({
            key: 'query',
            value: payload.value
          });
          break;
        case 'aw-extended-tree.click':
          this.extendedTreeChanged$.next({
            key: 'page',
            value: payload
          });
          break;
        case 'aw-extended-tree.pageinputsubmit':
          if (isNumber(this.pageInputValue)) {
            this.extendedTreeChanged$.next({
              key: 'page',
              value: this.pageInputValue
            });
          }
          break;
        default:
          break;
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      if (paramId) {
        if (paramId) {
          this.dataSource.currentId = paramId;
          this.emitOuter('routechanged', paramId);
        }
        this.dataSource.contentIsLoading = true;
        this.dataSource.loadItem(paramId).pipe(
          switchMap((response) => this.parseDigitalObjects$(response))
        ).subscribe((response) => {
          this.dataSource.contentIsLoading = false;
          if (response) {
            this.dataSource.loadContent(response);
            this.dataSource.loadExtendedTree();
            this.checkTreeItems(response);
          }
        });
      }
      // scroll top
      window.scrollTo(0, 0);
    });
  }

  private listenExtendedTree() {
    this.extendedTreeChanged$.pipe(
      filter(({ key, value }) => !(key === 'page' && (!isNumber(+value) || +value < 1))),
      debounce(({ delay }) => timer(delay || 1)),
    ).subscribe(({ key, value }) => {
      const queryParams: {
        [id: string]: string
      } = {};

      if (typeof value === 'string') {
        queryParams[key] = value.trim().length ? value : null;
      } else {
        queryParams[key] = `${value}`;
      }

      // page check
      if (key !== 'page') {
        queryParams.page = '1';
      }

      // reset pageInput value
      this.pageInputValue = null;

      // update url
      this.router.navigate([], {
        queryParams,
        queryParamsHandling: 'merge'
      });
    });
  }

  private listenRouteQueryParams() {
    this.route.queryParams.subscribe((params) => {
      const extendedTreeParams = clone(params);
      // force numeric
      ['page', 'limit'].forEach((key) => {
        if (params[key] && isNumber(+params[key])) {
          extendedTreeParams[key] = +params[key];
        } else {
          delete extendedTreeParams[key];
        }
      });

      this.dataSource.extendedTreeParams = extendedTreeParams;

      // has node response
      if (this.dataSource.lastResponse) {
        this.emitOuter('extendedtreerequest');
        this.dataSource.loadExtendedTree();
      }
    });
  }

  private loadNavigation(selectedItem) {
    this.dataSource.updateNavigation('Caricamento in corso...');
    this.dataSource.getNavigation().subscribe((response) => {
      if (response) {
        this.dataSource.setTree(response);
        this.dataSource.updateNavigation(this.dataSource.getTree().label);
        this.emitOuter('navigationresponse', {
          tree: this.dataSource.getTree(),
          currentItem: selectedItem,
          basePath: this.configuration.get('paths').schedaBasePath,
        });

        // emit signal
        this.treeLoaded$.next();
      }
    });
  }

  private parseDigitalObjects$(response) {
    const iiifManifest$ = {};
    const baseUrls = this.configuration.get('baseUrls') || {};
    const { iiifServer, iipServer } = baseUrls;
    if (Array.isArray(response?.digitalObjects)) {
      response.digitalObjects.forEach((digitalObject) => {
        // iip config url check
        if (iipServer && digitalObject.type === 'images-iip') {
          digitalObject.items.forEach((item) => {
            item.url = `${iipServer}${item.url}`;
          });
        }
        // iiif config url check
        if (iiifServer && digitalObject.type === 'images-iiif') {
          digitalObject.items.forEach((item) => {
            item.url = `${iiifServer}${item.url}`;
          });
        }

        if (digitalObject.type === 'images-iiif') {
          digitalObject.items.forEach(({ url }) => {
            iiifManifest$[url] = from(
              fetch(url)
                .then((data) => {
                  if (!data.ok) {
                    throw Error(data.statusText);
                  }
                  return data.json();
                })
                .catch((err) => {
                  console.warn(`Error loading iiif manifest ${url}`, err);
                  return null;
                })
            );
          });
        }
      });
    }
    if (!isEmpty(iiifManifest$)) {
      return forkJoin(iiifManifest$).pipe(
        switchMap((data: object) => {
          response.digitalObjects.forEach((digitalObject) => {
            if (digitalObject.type === 'images-iiif') {
              digitalObject.items.forEach((itemImages, index) => {
                digitalObject.items[index].iiifImages = this.getManifestImages(
                  data[itemImages.url]
                );
              });
            }
          });
          return of(response);
        })
      );
    }
    return of(response);
  }

  private getManifestImages(manifest) {
    const iiifImages = [];
    if (manifest?.sequences) {
      manifest.sequences.forEach(({ canvases }) => {
        canvases.forEach(({ images }) => {
          images.forEach(({ resource }) => {
            iiifImages.push(resource['@id']);
          });
        });
      });
    }
    return iiifImages;
  }

  private checkTreeItems(response) {
    this.treeLoaded$.pipe(
      first()
    ).subscribe(() => {
      const treeDS = this.dataSource.getWidgetDataSource('aw-tree');
      const { items } = treeDS.output;
      if (!items.length && response.lastAl?.id) {
        this.emitOuter('selectParent', response.lastAl.id);
      }
    });
  }
}
