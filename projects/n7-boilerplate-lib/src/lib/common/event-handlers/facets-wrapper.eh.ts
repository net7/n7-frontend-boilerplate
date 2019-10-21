import { EventHandler } from '@n7-frontend/core';

export class FacetsWrapperEH extends EventHandler {
  private _facetsChanged: boolean = false;

  public listen() {
    // listen to inner (widget) events
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case 'facets-wrapper.facet':
          const { context } = payload.eventPayload.inputPayload;
          this._facetsChanged = true;

          // update
          this.dataSource.onFacetChange(payload);

          // internal
          if(context === 'internal'){
            // TODO: do internal filter
          // external
          } else {
            const requestParams = this.dataSource.getRequestParams(),
              queryParams = this.dataSource.filtersAsQueryParams(requestParams.filters);

            Object.keys(queryParams).forEach(key => queryParams[key] = queryParams[key] || null);
            
            this.emitGlobal('navigate', {
              handler: 'router',
              path: [],
              queryParams
            });
          }

          break;

        case 'facets-wrapper.facetheader':
          this.dataSource.toggleGroup(payload);
          break;

        default: 
          break;
      }
    });

    // listen to outer events
    EventHandler.globalEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case 'global.queryparams':
          if(!this._facetsChanged){
            this.dataSource.updateFiltersFromQueryParams(payload);
            this.dataSource.updateInputsFromFilters();
          }
          break;

        default: 
          break;
      }
    });
  }
}