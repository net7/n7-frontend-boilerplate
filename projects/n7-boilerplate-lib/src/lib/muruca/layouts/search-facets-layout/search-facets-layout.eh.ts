import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';
import {
  MrSearchService,
  INPUT_STATE_CONTEXT,
  FACET_STATE_CONTEXT,
  FACETS_REQUEST_STATE_CONTEXT,
} from '../../services/search.service';

interface ChangedSubjects {
  [key: string]: Subject<any>;
}

export class SearchFacetsLayoutEH extends EventHandler {
  changed$: ChangedSubjects = {};

  private destroyed$: Subject<boolean> = new Subject();

  private searchService: MrSearchService;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-facets-layout.init':
          this.searchService = payload.searchService;
          // listeners
          this.initChangedListener(this.searchService.getConfig());
          this.initStateListener();
          // init
          this.dataSource.onInit(payload);
          break;

        case 'mr-search-facets-layout.destroy':
          this.destroyed$.next();
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

  initChangedListener({ facets }) {
    facets.sections.forEach((section) => {
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
        ).subscribe(({ id, value }) => {
          this.searchService.setState(INPUT_STATE_CONTEXT, id, value);
        });
      });
    });
  }

  initStateListener() {
    // listener for input updates
    this.searchService.getState$(INPUT_STATE_CONTEXT)
      .pipe(
        takeUntil(this.destroyed$),
        filter(({ lastUpdated }) => this.dataSource.inputsDS[lastUpdated])
      ).subscribe(({ lastUpdated, state }) => {
        const newValue = state[lastUpdated];
        if (newValue === null) {
          this.dataSource.clearInput(lastUpdated);
        } else {
          this.dataSource.updateInputValue(lastUpdated, newValue);
        }
      });

    // listener for facet updates
    this.searchService.getState$(FACET_STATE_CONTEXT)
      .pipe(
        takeUntil(this.destroyed$),
        filter(({ lastUpdated }) => this.dataSource.inputsDS[lastUpdated])
      ).subscribe(({ lastUpdated, state }) => {
        const newData = state[lastUpdated];
        this.dataSource.updateInputData(lastUpdated, newData);
      });

    // listener for facet header updates
    this.searchService.getState$(FACETS_REQUEST_STATE_CONTEXT, 'success')
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(({ inputs }) => {
        const { facets } = inputs;
        Object.keys(facets).forEach((id) => {
          const { total_count: totalCount } = facets[id];
          this.dataSource.updateInputValue(`header-${id}`, totalCount);
        });
      });
  }
}
