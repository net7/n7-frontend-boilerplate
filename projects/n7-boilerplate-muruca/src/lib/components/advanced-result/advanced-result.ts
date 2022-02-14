import { Component, Input } from '@angular/core';
import { ItemPreviewData, MetadataData } from '@net7/components';

/**
 * A hyperlinked metadata item
 */
export interface LinkedMetadataData extends MetadataData {
  /** href to use on the html element */
  href: string;
  /** list of highlights */
  items: string[];
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

  /** Returns true if there are some highlights to render */
  hasHighlights = (): boolean => this.data
    ?.highlights
    // there is at least one group that has highlights
    ?.some((d) => d.items.length > 0);

  onClick(payload) {
    if (!this.emit) return;
    this.emit('click', payload);
  }
}
