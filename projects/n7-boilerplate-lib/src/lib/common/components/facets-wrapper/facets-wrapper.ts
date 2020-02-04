import { Component, Input } from '@angular/core';

@Component({
  selector: 'n7-facets-wrapper',
  templateUrl: './facets-wrapper.html',
})
export class FacetsWrapperComponent {
  @Input() data: any;
  @Input() emit: any;

  headerEmit(type, payload){
    if(!this.emit) return;
    this.emit('facetheader', { type, payload });
  }

  facetEmit(type, payload){
    if(!this.emit) return;
    this.emit('facet', { type, payload });
  }
}
