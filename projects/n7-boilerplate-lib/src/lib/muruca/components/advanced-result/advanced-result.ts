import { Component, Input } from '@angular/core';
import { ItemPreviewData, MetadataData } from '@n7-frontend/components';

/**
 * A hyperlinked metadata item
 */
export interface LinkedMetadataData extends MetadataData {
  /** href to use on the html element */
  href: string;
}

/**
 * Data for Muruca's AdvancedResult component.
 */
interface AdvancedResultsData extends ItemPreviewData {
  highlights: LinkedMetadataData[];
}

@Component({
  selector: 'mr-advanced-result',
  templateUrl: './advanced-result.html',
})
export class MrAdvancedResultComponent {
  @Input() data: AdvancedResultsData;

  @Input() emit: any;

  onClick(payload) {
    if (!this.emit) return;
    this.emit('click', payload);
  }
}
