import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
// import { map } from 'rxjs/operators';
// import helpers from '../../../common/helpers';

export class AwMapLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  private configuration: any;

  private route: any;

  private entityId: string;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-map-layout.init':
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          // this.entityId = this.route.snapshot.params.id || '';
          // this.listenRoute(this.entityId);
          break;

        case 'aw-map-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    // this.outerEvents$.subscribe(({ type, payload }) => {
    //   switch (type) {
    //     default:
    //       break;
    //   }
    // });
  }

  // private listenRoute(selectedItem = '', forceReload = false) {
  //   // listen for "page" query param changes
  //   this.route.queryParams.pipe(
  //     map((params: any) => params.page),
  //   ).subscribe((page) => {
  //     if (this.dataSource.currentPage !== page) {
  //       this.dataSource.currentPage = page;
  //       this.dataSource.handlePageNavigation();
  //     }
  //   });
  //   // get URL parameters with angular's paramMap
  //   this.route.paramMap.subscribe((params) => {
  //     // look for id
  //     if (params.get('id')) {
  //       if (this.dataSource.currentId === params.get('id') && !forceReload) {
  //         if (this.dataSource.selectedTab !== params.get('tab')) {
  //           this.dataSource.handleNavUpdate(params.get('tab'));
  //         }
  //         return;
  //       }
  //       // get item from response with id === id and return as promise
  //       this.dataSource.loadItem(params.get('id'), params.get('slug'), params.get('tab'))
  //         .subscribe((res) => {
  //           if (res) {
  //             this.dataSource.loadContent(res);
  //             // remove the entity of this page
  //             const entities = res.relatedEntities
  //               .filter((entity) => entity.id !== params.get('id'));
  //             this.dataSource.updateWidgets(res);
  //             if (selectedItem) {
  //               this.emitOuter('selectItem', selectedItem);
  //             }
  //             this.emitOuter('filterbubbleresponse', entities);
  //           }
  //         });
  //     } else {
  //       this.dataSource.loadItem();
  //     }
  //   });
  // }
}
