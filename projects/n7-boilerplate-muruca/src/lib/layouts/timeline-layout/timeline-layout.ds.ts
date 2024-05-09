import { LayoutDataSource, _t } from '@net7/core';
import { Anchor, ItemPreviewData, TimelineData } from '@net7/components';
import { Timeline } from 'vis-timeline';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  ConfigurationService,
  CommunicationService,
  MainStateService,
} from '@net7/boilerplate-common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MrLayoutStateService } from '../../services/layout-state.service';
import 'leaflet.markercluster';
import { GetResourceResponse } from './timeline-layout.types';
import { MrLocaleService } from '../../services/locale.service';
import linksHelper from '../../helpers/links-helper';

// demo page: http://localhost:4200/timeline/2992/missione-venezia

export class MrTimelineLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private router: Router;

  private configId: string;

  private pageConfig;

  private localeService: MrLocaleService;

  private location: Location;

  public loading = {
    resourceDetails: true,
    timeline: true,
  };

  public defaultDescription = '';

  public eventHeader: string;

  public eventDescription = '';

  public timelineData: TimelineData;

  public hasMap = false;

  public route;

  public mapHeader;

  public timelineListener$: Subject<Timeline> = new Subject();

  public bibliographyData: {
    header: { title: string };
    items: {
      payload?: {
        action: string;
        id: number;
        type: string;
      };
      text?: string;
    }[];
  };

  public collectionWorksData: {
    header: { title: string };
    items: ItemPreviewData[];
  };

  public collectionWitnessData: {
    header: { title: string };
    items: ItemPreviewData[];
  };

  public collectionBooksData: {
    header: { title: string };
    items: ItemPreviewData[];
  };

  public collectionData: any;

  public collectionGalleryData;

  public eventTitle: string;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.route = payload.route;
    this.router = payload.router;
    this.localeService = payload.localeService;
    this.location = payload.location;

    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId) || {};

    const locale = this.localeService.getLocale();

    // update the timeline
    this.loading.timeline = true;
    this.communication
      .request$('timeline', {
        method: 'GET',
        urlParams: locale ? `?locale=${locale}` : '',
        onError: (e) => console.error(e),
      })
      .subscribe((d) => {
        this.timelineData = d;
        this.loading.timeline = false;
        this.one('mr-timeline').updateOptions({
          libOptions: this.pageConfig.libOptions,
        });
        this.one('mr-timeline').update(d);
        this.loading.timeline = false;
      });
    this.getWidgetDataSource('mr-timeline')
      .timelineLoaded$.pipe(first())
      .subscribe((timeline: Timeline) => {
        this.timelineListener$.next(timeline);
      });

    // update the description
    this.communication
      .request$('timelineDescription', {
        method: 'GET',
        urlParams: locale ? `?locale=${locale}` : '',
        onError: (e) => console.error(e),
      })
      .subscribe((d) => {
        this.defaultDescription = d.text;
        this.loadDefaults(false);
      });

    // set map header
    this.mapHeader = _t(this.pageConfig.mapHeader);
  }

  loadDefaults(navigate: boolean) {
    const timelineInstance = this.getWidgetDataSource('mr-timeline')
      .timeline as Timeline;
    if (timelineInstance) {
      timelineInstance.setSelection([]);
    }
    this.eventDescription = this.defaultDescription;
    this.eventHeader = '';
    this.hasMap = false;
    this.bibliographyData = undefined;
    this.collectionWitnessData = undefined;
    this.collectionWorksData = undefined;
    this.collectionBooksData = undefined;
    this.collectionGalleryData = undefined;
    this.collectionData = [];
    if (navigate) {
      const href = this.localeService.getLinkByRouteId('timeline');
      this.location.go(href);
    }
    this.one('mr-year-header').update({
      title: { main: { text: _t(this.pageConfig.title) } },
    });
  }

  updatePageDetails(id) {
    const locale = this.localeService.getLocale();
    this.communication
      .request$('resource', {
        onError: (e) => console.error(e),
        method: 'POST',
        urlParams: locale ? `?locale=${locale}` : '',
        params: {
          id,
          type: 'views/time-events',
        },
      })
      .subscribe((res: GetResourceResponse) => {
        // any
        if (!res || res == null) return;

        const {
          /* eslint-disable */
          "collection-bibliography": bibData,
          "collection-places": placesData,
          gallery,
          header,
          /* eslint-enable */
        } = res.sections;

        if (res.sections['collection-bibliography']) {
          delete res.sections['collection-bibliography'];
        }
        if (res.sections['collection-places']) {
          delete res.sections['collection-places'];
        }
        const collections = [];
        Object.keys(res.sections).forEach((collection) => {
          if (String(collection).startsWith('collection-')) {
            if (res.sections[collection].items) {
              collections.push({
                items: res.sections[collection].items.map(
                  (item: {
                    id: string;
                    link: string;
                    title: string;
                    type: string;
                    routeId?: string;
                    params?: object;
                    slug?: string;
                  }): ItemPreviewData => {
                    let anchor: Anchor;
                    if (item.routeId) {
                      const routeLink = this.localeService
                        .getLinkByRouteId(item.routeId, item.id, item.slug);
                      anchor = {
                        href: routeLink,
                        queryParams: item.params || null,
                      };
                    } else if (item.link) {
                      anchor = {
                        href: linksHelper.getRouterLink(item.link),
                        queryParams: linksHelper.getQueryParams(item.link),
                      };
                    }
                    return {
                      title: item.title,
                      anchor
                    };
                  }
                ),
                header: res.sections[collection].header,
              });
            }
            this.collectionData = collections;
          }
        });

        if (gallery) {
          this.collectionGalleryData = gallery;
        } else {
          this.collectionGalleryData = undefined;
        }
        if (header) {
          this.eventDescription = header.content;
          this.eventHeader = res.title;
          this.one('mr-year-header').update({
            title: { main: { text: header.title } },
            actions: {
              buttons: [
                {
                  text: '',
                  icon: 'n7-icon-close',
                  anchor: {
                    payload: 'closebutton',
                  },
                },
              ],
            },
          });
        }
        if (placesData) {
          this.hasMap = true;
          this.one('mr-map').update(placesData);
        } else {
          this.hasMap = false;
        }
        if (bibData) {
          this.bibliographyData = {
            header: bibData.header,
            items: bibData.items.map((item) => ({
              ...item,
              anchor: {
                payload: item.payload,
              },
              classes: 'mr-item-preview-bibliography',
            })),
          };
        } else {
          this.bibliographyData = undefined;
        }
        this.loading.resourceDetails = false;
      });
  }
}
