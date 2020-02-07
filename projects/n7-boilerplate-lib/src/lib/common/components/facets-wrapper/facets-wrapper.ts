import { Component, Input } from '@angular/core';

@Component({
  selector: 'n7-facets-wrapper',
  templateUrl: './facets-wrapper.html',
})
export class FacetsWrapperComponent {
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
