import { Component, Input } from '@angular/core';
import { MrMetadataDynamicDS } from '../../data-sources/metadata-dynamic.ds';

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

  public obtainData(section: any) {
    const metadataDynamicDS = new MrMetadataDynamicDS();
    return metadataDynamicDS.prepareMeta(section);
  }
}
