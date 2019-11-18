import { EventHandler } from '@n7-frontend/core';

export class AwHomeFacetsWrapperEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        // toggle visibility from facet header
        case 'aw-home-facets-wrapper.click':
          this.emitOuter('click', payload);
          break;
        // change search input text
        case 'aw-home-facets-wrapper.change':
          this.emitOuter('change', payload);
          break;
        // press return while typing in search
        case 'aw-home-facets-wrapper.enter':
          this.emitOuter('enter', payload);
          break;
        default:
          console.warn('unhandled inner event of type:', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-layout.facetswrapperresponse':
          this.dataSource.tippyMaker(payload.response, payload.facetId.inputPayload);
          break;
        case 'aw-home-layout.filterbubbleresponse':
          // console.log({type, payload})
          break;
        default:
          // console.warn('unhandled outer event of type', type)
          // silent ignore
          break;
      }
    });
  }

}
