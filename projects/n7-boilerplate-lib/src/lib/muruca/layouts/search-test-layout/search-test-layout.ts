import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
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
        id: 'header-1',
        data: {
          text: 'Sezione I',
          classes: 'first-section'
        }
      },
      inputs: [{
        id: 'fullsearch',
        type: 'text',
        delay: 300,
        data: {
          id: 'fullsearch',
          placeholder: 'Search...',
          inputPayload: 'key-event',
          enterPayload: 'enter-event'
        },
      }]
    }, {
      header: {
        id: 'header-2',
        data: {
          text: 'Sezione II',
          classes: 'second-section'
        }
      },
      inputs: [{
        id: 'hasinternal',
        type: 'checkbox',
        data: {
          checkboxes: [{
            id: 'hasinternal',
            label: 'Filtro interno',
            payload: 'click'
          }]
        },
      }, {
        id: 'internalsearch',
        type: 'text',
        delay: 5000,
        data: {
          id: 'internalsearch',
          placeholder: 'Internal...',
          inputPayload: 'key-event',
          enterPayload: 'enter-event'
        },
      }]
    }]
  };

  emit$: Subject<any> = new Subject();

  constructor() {
    super(config);
  }

  protected initPayload() {
    return {
      emit$: this.emit$
    };
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
