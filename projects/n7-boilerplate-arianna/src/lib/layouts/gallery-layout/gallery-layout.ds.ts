import { AwLinkedObjectsDS } from 'dist/n7-boilerplate-arianna';
import { delay, filter } from 'rxjs/operators';
import tippy, { hideAll } from 'tippy.js';
import { AwSearchLayoutDS } from '../search-layout/search-layout.ds';
import facetsConfig from './gallery-facets.config';

export class AwGalleryLayoutDS extends AwSearchLayoutDS {
  public layoutId = 'aw-gallery-layout';

  public configId = 'gallery-layout';

  public currentNav = 'galleria';

  public pageNameDefault = 'Galleria';

  public facetsConfig = facetsConfig;

  public paginationList = [12, 24, 48];

  public pageSize = 12; // linked objects page size

  public disableBreadcrumbsTooltip = false;

  onInit(payload) {
    super.onInit(payload);

    this.disableBreadcrumbsTooltip = !!(
      this.configuration.get(this.configId)?.disableBreadcrumbsTooltip
    );

    // load breadcrumbs tooltips
    if (!this.disableBreadcrumbsTooltip) {
      this.loadTooltips();
    }
  }

  loadTooltips() {
    const linkedObjectsDS: AwLinkedObjectsDS = this.getWidgetDataSource('aw-linked-objects');
    linkedObjectsDS.out$.pipe(
      filter((data) => data),
      delay(1000) // symbolic timeout
    ).subscribe(() => {
      // clear first
      hideAll();

      // load
      tippy('.tooltip-trigger', {
        allowHTML: true,
        interactive: true,
        trigger: 'click',
        theme: 'light-border no-padding',
        placement: 'bottom',
        content(reference) {
          const id = reference.getAttribute('data-template');
          const template = document.getElementById(id);
          return template.innerHTML;
        },
      });
    });
  }
}
