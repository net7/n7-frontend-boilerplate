import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SearchFacetsConfig } from './search-facets-config';

interface ChangedSubjects {
  [key: string]: Subject<any>;
}

export class SearchFacetsLayoutEH extends EventHandler {
  changed$: ChangedSubjects = {};

  private destroyed$: Subject<boolean> = new Subject();

  private hostEmit$: Subject<any>;

  private guestEmit$: Subject<any>;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-facets-layout.init':
          this.hostEmit$ = payload.hostEmit$;
          this.guestEmit$ = payload.guestEmit$;
          // listeners
          this.listenFacetsReady();
          this.listenToHost();
          this.initChangedListener(payload.data);
          // init
          this.dataSource.onInit(payload);
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

  initChangedListener(data: SearchFacetsConfig) {
    data.sections.forEach((section) => {
      const sources: {
        id: string;
        delay: number;
      }[] = [];

      if (section.header) {
        const { id, delay } = section.header;
        sources.push({ id, delay });
      }
      section.inputs.forEach(({ id, delay }) => {
        sources.push({ id, delay });
      });
      sources.forEach((source) => {
        this.changed$[source.id] = new Subject();
        this.changed$[source.id].pipe(
          debounceTime(source.delay || 1)
        ).subscribe((payload) => {
          this.guestEmit$.next({
            payload,
            type: 'change'
          });
        });
      });
    });
  }

  listenFacetsReady() {
    this.dataSource.ready$.subscribe(() => {
      this.guestEmit$.next({
        type: 'facetsready'
      });
    });
  }

  listenToHost() {
    this.hostEmit$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({ type, payload }) => {
      switch (type) {
        case 'updateinputvalue':
          this.dataSource.updateInputValue(payload.id, payload.value);
          break;

        case 'updateinputdata':
          this.dataSource.updateInputData(payload.id, payload.data);
          break;

        case 'clearinput':
          this.dataSource.clearInput(payload.id);
          break;

        case 'clearinputs':
          this.dataSource.clearInputs();
          break;

        default:
          break;
      }
    });
  }
}
