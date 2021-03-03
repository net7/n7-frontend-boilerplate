import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';

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

        default:
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
        this.dataSource.loadItem(paramId).subscribe((response) => {
          this.dataSource.contentIsLoading = false;
          if (response) this.dataSource.loadContent(response);
        });
      }
      // scroll top
      window.scrollTo(0, 0);
    });
  }

  private loadNavigation(selectedItem) {
    this.dataSource.updateNavigation('Loading...');
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
}
