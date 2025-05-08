import { Component, Input } from '@angular/core';

@Component({
  selector: 'aw-facets-wrapper',
  templateUrl: './aw-facets-wrapper.html',
})
export class AwFacetsWrapperComponent {
  @Input() data: any;

  @Input() emit: any;

  headerEmit(eventType, eventPayload) {
    if (!this.emit) {
      return;
    }
    this.emit('facetheader', { eventType, eventPayload });
  }

  facetEmit(eventType, eventPayload) {
    if (!this.emit) {
      return;
    }
    this.emit('facet', { eventType, eventPayload });
  }
}
