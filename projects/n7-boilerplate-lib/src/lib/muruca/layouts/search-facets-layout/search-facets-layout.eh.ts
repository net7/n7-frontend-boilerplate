import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchFacetsConfig } from './search-facets-config';

interface ChangedSubjects {
  [key: string]: Subject<any>;
}

export class SearchFacetsLayoutEH extends EventHandler {
  changed$: ChangedSubjects = {};

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-facets-layout.init':
          this.dataSource.onInit(payload);
          this.initChangedListener(payload.data, payload.emit$);
          break;

        case 'mr-search-facets-layout.destroy':
          this.dataSource.onDestroy();
          break;
        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      if (type.indexOf('change')) {
        this.changed$[payload.id].next(payload);
      }
    });
  }

  initChangedListener(data: SearchFacetsConfig, emit$: Subject<any>) {
    data.sections.forEach((section) => {
      section.inputs.forEach((input) => {
        this.changed$[input.id] = new Subject();
        this.changed$[input.id].pipe(
          debounceTime(input.delay || 1)
        ).subscribe((payload) => {
          emit$.next({ type: 'change', payload });
        });
      });
    });
  }
}
