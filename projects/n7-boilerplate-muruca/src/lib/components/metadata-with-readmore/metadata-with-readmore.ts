//---------------------------
// METADATA-VIEWER.ts
//---------------------------

import { Component, Input } from '@angular/core';

/**
 * Interface for MetadataViewerComponent's "items"
 * @property label (optional)
 * @property value (optional)
 */
export interface MetadataViewerItems {
  /**
   * the item's label
   */
  label?: string;
  /**
   * the value for @property label
   */
  value?: string;
  /**
   * the anchorId of the metadata
   */
  anchorId?: string;
}

/**
 * Interface for MetadataViewerComponent's "data"
 *
 * @property title (optional)
 * @property items (optional)
 * @property group (optional)
 * @property classes (optional)
 */
export interface MetadataViewerChildGroups {
  /**
   * component header (if root)
   * or group title
   */
  title?: string;
  /**
   * the metadata items
   */
  items?: MetadataViewerItems[];
  /**
   * the CHILD metadata groups
   */
  group?: MetadataViewerChildGroups[];
  /**
   * additional html classes
   */
  classes?: any;
}

/**
 * Interface for MetadataViewerComponent's "data"
 *
 * @property group (required)
 * @property classes (optional)
 */
export interface MetadataViewerData {
  /**
   * the CHILD metadata groups
   */
  group: MetadataViewerChildGroups[];
  /**
   * additional html classes
   */
  classes?: any;
}

@Component({
  selector: 'mr-metadata-readmore',
  templateUrl: './metadata-with-readmore.html'
})
export class MrMetadataReadmoreComponent {
  @Input() data: MetadataViewerData;

  @Input() emit: any;
}
