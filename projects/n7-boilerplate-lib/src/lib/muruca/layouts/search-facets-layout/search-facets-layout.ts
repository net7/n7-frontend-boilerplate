import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { SearchFacetsLayoutConfig as config } from './search-facets-layout.config';
import { SearchFacetsConfig } from './search-facets-config';
import { FacetTextDS } from '../../data-sources/facets/facet-text.ds';
import { FacetCheckboxDS } from '../../data-sources/facets/facet-checkbox.ds';
import { FacetSelectDS } from '../../data-sources/facets/facet-select.ds';
import { FacetLinkDS } from '../../data-sources/facets/facet-link.ds';
import { FacetHeaderDS } from '../../data-sources/facets/facet-header.ds';
import { FacetHeaderEH } from '../../event-handlers/facets/facet-header.eh';
import { FacetTextEH } from '../../event-handlers/facets/facet-text.eh';
import { FacetCheckboxEH } from '../../event-handlers/facets/facet-checkbox.eh';
import { FacetSelectEH } from '../../event-handlers/facets/facet-select.eh';
import { FacetLinkEH } from '../../event-handlers/facets/facet-link.eh';

const DATASOURCE_MAP = {
  header: FacetHeaderDS,
  text: FacetTextDS,
  checkbox: FacetCheckboxDS,
  select: FacetSelectDS,
  link: FacetLinkDS,
};

const EVENTHANDLER_MAP = {
  header: FacetHeaderEH,
  text: FacetTextEH,
  checkbox: FacetCheckboxEH,
  select: FacetSelectEH,
  link: FacetLinkEH,
};

@Component({
  selector: 'mr-search-facets-layout',
  templateUrl: './search-facets-layout.html'
})
export class MrSearchFacetsLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  @Input() data: SearchFacetsConfig;

  @Input() guestEmit$: Subject<any>;

  @Input() hostEmit$: Subject<any>;

  constructor() {
    super(config);
  }

  protected initPayload() {
    return {
      data: this.data,
      guestEmit$: this.guestEmit$,
      hostEmit$: this.hostEmit$
    };
  }

  ngOnInit() {
    this.loadWidgets();
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  loadWidgets() {
    this.widgets = [];
    this.data.sections.forEach(({ header, inputs }) => {
      if (header) {
        this.widgets.push({
          id: header.id,
          dataSource: DATASOURCE_MAP.header,
          eventHandler: EVENTHANDLER_MAP.header
        });
      }
      inputs.forEach((input) => {
        this.widgets.push({
          id: input.id,
          dataSource: DATASOURCE_MAP[input.type],
          eventHandler: EVENTHANDLER_MAP[input.type]
        });
      });
    });
  }
}
