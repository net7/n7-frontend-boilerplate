import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { AbstractLayout } from '@n7-frontend/boilerplate-common';
import { SearchFacetsLayoutConfig as config } from './search-facets-layout.config';
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
import { MrSearchService } from '../../services/search.service';
import { FacetLinkMultipleDS } from '../../data-sources/facets/facet-link-multiple.ds';
import { FacetLinkMultipleEH } from '../../event-handlers/facets/facet-link-multiple.eh';
import { FacetMapDS } from '../../data-sources/facets/facet-map.ds';
import { FacetMapEH } from '../../event-handlers/facets/facet-map.eh';
import { FacetHistogramEH } from '../../event-handlers/facets/facet-histogram.eh';
import { FacetHistogramDS } from '../../data-sources/facets/facet-histogram.ds';

const DATASOURCE_MAP = {
  header: FacetHeaderDS,
  text: FacetTextDS,
  checkbox: FacetCheckboxDS,
  select: FacetSelectDS,
  link: FacetLinkDS,
  map: FacetMapDS,
  // if the facet value is an array you MUST include it in the name
  'map-multiple': FacetMapDS,
  'link-multiple': FacetLinkMultipleDS,
  histogram: FacetHistogramDS,
};

const EVENTHANDLER_MAP = {
  header: FacetHeaderEH,
  text: FacetTextEH,
  checkbox: FacetCheckboxEH,
  select: FacetSelectEH,
  link: FacetLinkEH,
  map: FacetMapEH,
  // if the facet value is an array you MUST include it in the name
  'map-multiple': FacetMapEH,
  'link-multiple': FacetLinkMultipleEH,
  histogram: FacetHistogramEH,
};

@Component({
  selector: 'mr-search-facets-layout',
  templateUrl: './search-facets-layout.html'
})
export class MrSearchFacetsLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  @Input() searchService: MrSearchService;

  constructor() {
    super(config);
  }

  protected initPayload() {
    return {
      searchService: this.searchService
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
    const { facets } = this.searchService.getConfig();
    this.widgets = [];
    facets.sections.forEach(({ header, inputs }) => {
      if (header) {
        this.widgets.push({
          id: header.id,
          dataSource: DATASOURCE_MAP.header,
          eventHandler: EVENTHANDLER_MAP.header
        });
      }
      inputs.forEach((input) => {
        let inputType = input.type;
        const { multiple } = input.schema;
        // multiple control
        if (multiple) {
          inputType += '-multiple';
        }
        this.widgets.push({
          id: input.id,
          options: {
            isMultiple: !!multiple,
            libOptions: input.libOptions ?? undefined,
          },
          dataSource: DATASOURCE_MAP[inputType],
          eventHandler: EVENTHANDLER_MAP[inputType]
        });
      });
    });
  }
}
