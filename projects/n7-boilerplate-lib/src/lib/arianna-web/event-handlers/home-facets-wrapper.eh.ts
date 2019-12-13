import { EventHandler } from '@n7-frontend/core';

export class AwHomeFacetsWrapperEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        // toggle visibility from facet header
        case 'aw-home-facets-wrapper.click':
          if (payload === null) { // interrupt event for locked facets
            break;
          }
          this.emitOuter('click', payload);
          this.handleEyeClick(payload)
          break;
        // change search input text
        case 'aw-home-facets-wrapper.change':
          this.emitOuter('change', payload);
          break;
        // pressed return while typing in search
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
        case 'aw-home-layout.facetswrapperresponse': // incoming autocomplete response
          this.dataSource.tippyMaker(payload.response, payload.facetId.inputPayload);
          break;
        case 'aw-home-layout.lockfilter':
          this.updateFilters(payload)
          break;
        case 'aw-home-layout.tagclick':
          Object.keys(this.dataSource.lockedFacets).forEach(key => {
            if (this.dataSource.lockedFacets[key].includes(payload)) {
              this.dataSource.lockedFacets[key].splice(this.dataSource.lockedFacets[key].indexOf(payload), 1)
            }
          });
          this.dataSource.update(this.dataSource.lastData)
          break;
        default:
          // console.warn('unhandled outer event of type', type)
          break;
      }
    });
  }

  handleEyeClick = type => {
    /*
      Toggles the status of the selected eye, then reloads the component.
    */
    if (this.dataSource.closedEyes) {
      let i = this.dataSource.closedEyes.indexOf(type)
      if (i >= 0) { // if the eye was closed
        this.dataSource.closedEyes.splice(i, 1) // open the eye
      } else { // if the eye was open
        this.dataSource.closedEyes.push(type) // close the eye
      }
    } else {
      this.dataSource.closedEyes = [type]
    }
    this.dataSource.update(this.dataSource.lastData) // reload the component with the same data
  }

  updateFilters = selectedBubble => {
    /*
      Adds (or removes) the ID of the selected bubble from the array of that type of entity.
      Example:
        • Click on bubble "0263a407-d0dd" of type "org"
        • Add "0263a407-d0dd" to array "org".
      Result:
        • lockedFacets = { "org":[ "0263a407-d0dd" ] }
    */
    selectedBubble.entity.id.replace(/ /g, '-') // fix for space in ID
    const { id, typeOfEntity } = selectedBubble.entity // payload is the selected bubble
    if (!this.dataSource.lockedFacets[typeOfEntity]) {
      this.dataSource.lockedFacets[typeOfEntity] = []
    }
    if (this.dataSource.lockedFacets[typeOfEntity].includes(id)) {
      let i = this.dataSource.lockedFacets[typeOfEntity].indexOf(id)
      this.dataSource.lockedFacets[typeOfEntity].splice(i, 1)
    } else {
      this.dataSource.lockedFacets[typeOfEntity].push(id)
    }
    this.dataSource.update(this.dataSource.lastData) // reload the component with the same data
  }
}