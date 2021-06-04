import { EventHandler } from '@n7-frontend/core';
import { isEmpty } from 'lodash';
import {
  forkJoin, from, of, Subject
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class AwSchedaLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  private configuration: any;

  private route: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-scheda-layout.init': {
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          const paramId = this.route.snapshot.params.id || '';
          if (paramId) {
            this.dataSource.currentId = paramId;
          }
          this.listenRoute();
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
          if (response) this.dataSource.loadContent(response);
        });
      }
      // scroll top
      window.scrollTo(0, 0);
    });
  }

  private loadNavigation(selectedItem) {
    this.dataSource.updateNavigation('Caricamento in corso...');
    this.dataSource.getNavigation('patrimonio').subscribe((response) => {
      if (response) {
        this.dataSource.setTree(response);
        this.dataSource.updateNavigation(this.dataSource.getTree().label);
        this.emitOuter('navigationresponse', {
          tree: this.dataSource.getTree(),
          currentItem: selectedItem,
          basePath: this.configuration.get('paths').schedaBasePath,
        });
      }
    });
  }

  private parseDigitalObjects$(response) {
    const iiifManifest$ = {};
    if (Array.isArray(response.digitalObjects)) {
      response.digitalObjects.forEach((digitalObject) => {
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
}
