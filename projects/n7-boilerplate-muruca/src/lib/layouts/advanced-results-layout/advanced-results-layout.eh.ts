import { ActivatedRoute, Router } from '@angular/router';
import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { helpers } from '@net7/boilerplate-common';
import { MrAdvancedResultsLayoutDS } from './advanced-results-layout.ds';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';
import { MrResourceModalService } from '../../services/resource-modal.service';

export class MrAdvancedResultsLayoutEH extends EventHandler {
  protected activatedRoute: ActivatedRoute;

  protected router: Router;

  private layoutState: MrLayoutStateService;

  private modalService: MrResourceModalService;

  protected destroy$: Subject<void> = new Subject();

  protected scrollRefElement: HTMLElement;

  dataSource: MrAdvancedResultsLayoutDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-advanced-results-layout.init':
          this.activatedRoute = payload.activatedRoute;
          this.router = payload.router;
          this.layoutState = payload.layoutState;
          this.modalService = payload.modalService;
          this.dataSource.onInit(payload);

          // listen route changes
          this.listenToRouterChanges();
          // scroll top
          window.scrollTo(0, 0);
          break;

        case 'mr-advanced-results-layout.destroy':
          this.destroy$.next();
          break;
        case 'mr-advanced-results-layout.searchreset':
          if (payload && payload?.action === 'redirect') {
            this.router.navigate([payload.url], {});
          }
          break;
        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'n7-smart-pagination.click':
          this.updateRouter({ page: payload.page });
          break;

        case 'n7-smart-pagination.change':
          this.updateRouter({ limit: payload.value, page: 1 });
          break;

        case 'mr-search-results-title.change':
          this.updateRouter({ sort: payload.value, page: 1 });
          break;

        case 'mr-search-results.openresourcemodal': {
          const { id, type: resourceType } = payload;
          this.modalService.open(id, resourceType);
          break;
        }

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
  }

  /** URL changes */
  protected listenToRouterChanges() {
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.layoutState.set('results', LayoutState.LOADING);
      }),
      switchMap((params) => {
        this.dataSource.updateSearchTags(params);
        return this.dataSource.request$(params, (error) => {
          console.warn('Advanced search error', error);
          this.layoutState.set('results', LayoutState.ERROR);
        });
      })
    ).subscribe((response) => {
      this.dataSource.handleResponse(response);
      this.layoutState.set('results', isEmpty(response.results) ? LayoutState.EMPTY : LayoutState.SUCCESS);
      // scroll to ref element
      if (!this.scrollRefElement) {
        this.scrollRefElement = document.querySelector('.scroll-ref');
      } else if (!helpers.isElementInViewport(this.scrollRefElement)) {
        this.scrollRefElement.scrollIntoView();
      }
    });
  }

  protected updateRouter(queryParams) {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
