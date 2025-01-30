import { Component, Input } from '@angular/core';

@Component({
  selector: 'mr-metadata-dynamic',
  templateUrl: './metadata-dynamic.html'
})
export class MrMetadataDynamicComponent {
  @Input() data: any;

  @Input() emit: (type: string, payload?: any) => void;

  fakeEmit = (type, payload?) => {
    if (!this.emit) {
      return;
    }
    this.emit(type, payload);
  };
}
