import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { SearchTestLayoutConfig as config } from './search-test-layout.config';
import { SearchFacetsConfig } from '../search-facets-layout/search-facets-config';

@Component({
  selector: 'mr-search-test-layout',
  templateUrl: './search-test-layout.html'
})
export class MrSearchTestLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  searchConfig: SearchFacetsConfig = {
    classes: 'search-test-facets',
    sections: [{
      header: {
        text: 'Relazione con',
        classes: 'related-class',
      },
      inputs: [{
        id: 'input-text',
        type: 'text',
        data: {
          id: 'input-text',
          placeholder: 'Search...',
          inputPayload: 'key-event',
          enterPayload: 'enter-event'
        },
      }]
    }]
  };

  constructor() {
    super(config);
  }

  protected initPayload() {
    return {};
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
