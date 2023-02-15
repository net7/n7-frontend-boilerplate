import { Component, Input } from '@angular/core';

export type GalleryBreadcrumbsTooltipData = {
  items: {
    label: string;
  }[]
}

@Component({
  selector: 'aw-gallery-breadcrumbs-tooltip',
  templateUrl: './gallery-breadcrumbs-tooltip.html'
})
export class GalleryBreadcrumbsTooltipComponent {
  @Input() data: GalleryBreadcrumbsTooltipData;

  title = 'Percorso completo';

  isLast = (index) => this.data?.items.length === (index + 1);

  getLeftMargin = (index) => `${index * 4}px`;
}
