import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

export class AwEntitaLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private configuration: any;
  private route: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-entita-layout.init':
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          let paramId = this.route.snapshot.params.id || ""
          this.listenRoute();
          this.loadNavigation(paramId);
          break;

        case 'aw-entita-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });
  }

  private listenRoute() {
    /**
     * Listens to routing events of this layout.
     */
    // get URL parameters with angular's paramMap
    this.route.paramMap.subscribe(params => {
      // look for id
      if (params.get('id')) {
        // get item from response with id === id and return as promise
        this.dataSource.loadItem(params.get('id')).subscribe((response) => {
          if (response) {
            // navigate to: "basepath + :id"
            this.emitGlobal('navigate', { path: [this.configuration.get("paths").entitaBasePath + response.entity.id], handler: 'router' });
            // this.dataSource.loadContent(response); // FIX: LOOP
          }
        });
      } else {
        this.dataSource.loadItem();
      }
    });
  }

  private loadNavigation(selectedItem) {
    /**
     * Fetches the content for this page, based on the URL.
     * 
     * @param selectItem - item to get from the communication provider
     */
    this.dataSource.getNavigation('entita').subscribe((response) => {
      if (response) {
        console.log('got a reponse')
        this.dataSource.updateWidgets(response);
      }
      if (selectedItem) {
        console.log('navigating to selected item: ' + selectedItem)
        this.emitOuter('selectItem', selectedItem);
      }
    });
  }

}