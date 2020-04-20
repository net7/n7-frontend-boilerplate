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
import { FacetGenericEH } from '../../event-handlers/facets/facet-generic.eh';

const DATASOURCE_MAP = {
  text: FacetTextDS,
  checkbox: FacetCheckboxDS,
  select: FacetSelectDS,
  link: FacetLinkDS,
};

@Component({
  selector: 'mr-search-facets-layout',
  templateUrl: './search-facets-layout.html'
})
export class MrSearchFacetsLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  @Input() data: SearchFacetsConfig;

  @Input() emit$: Subject<any>;

  constructor() {
    super(config);
  }

  protected initPayload() {
    return {
      data: this.data,
      emit$: this.emit$
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
    this.data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        this.widgets.push({
          id: input.id,
          dataSource: DATASOURCE_MAP[input.type],
          eventHandler: FacetGenericEH
        });
      });
    });
  }
}
