import { LayoutDataSource, _t } from '@n7-frontend/core';
import { ItemPreviewData, TimelineData } from '@n7-frontend/components';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Timeline } from 'vis-timeline';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import 'leaflet.markercluster';
import { CollectionItem, GetResourceResponse } from './timeline-layout.types';

// demo page: http://localhost:4200/timeline/2992/missione-venezia

export class MrTimelineLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private route: ActivatedRoute;

  private location: Location;

  public loading = {
    resourceDetails: true,
    timeline: true,
  }

  public defaultDescription = '';

  public eventHeader: string;

  public eventDescription = ''

  public timelineData: TimelineData;

  public hasMap = false;

  public mapHeader = _t('timeline#mapheader');

  public timelineListener$: Subject<Timeline> = new Subject()

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
  }

  public collectionWorksData: {
    header: { title: string };
    items: ItemPreviewData[];
  }

  public collectionWitnessData: {
    header: { title: string };
    items: ItemPreviewData[];
  };

  public collectionGalleryData;

  public eventTitle: string;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.route = payload.route;
    this.location = payload.location;

    // update the timeline
    this.communication.request$('timeline', {
      method: 'GET',
      onError: (e) => console.error(e)
    }).subscribe((d) => {
      this.timelineData = d;
      this.loading.timeline = false;
      this.one('mr-timeline').update(d);
    });
    this.getWidgetDataSource('mr-timeline').timelineLoaded$
      .pipe(first())
      .subscribe((timeline: Timeline) => {
        this.timelineListener$.next(timeline);
      });

    // update the description
    this.communication.request$('timelineDescription', {
      method: 'GET',
      onError: (e) => console.error(e),
    }).subscribe((d) => {
      this.defaultDescription = d.text;
      this.loadDefaults(false);
    });
  }

  loadDefaults(navigate: boolean) {
    this.eventDescription = this.defaultDescription;
    this.eventHeader = '';
    this.hasMap = false;
    this.bibliographyData = undefined;
    this.collectionWitnessData = undefined;
    this.collectionWorksData = undefined;
    this.collectionGalleryData = undefined;
    if (navigate) this.location.go('/timeline/');
    this.one('mr-year-header').update({
      title: { main: { text: 'La vita di Petrarca' } },
    });
  }

  updatePageDetails(id) {
    this.communication.request$('resource', {
      onError: (e) => console.error(e),
      method: 'POST',
      params: {
        id, type: 'views/time-events'
      }
    }).subscribe((res: GetResourceResponse) => {
      if (!res || res == null) return;
      const {
        /* eslint-disable */
        'collection-bibliography': bibData,
        'collection-places': placesData,
        'collection-witnesses': witnessData,
        'collection-works': worksData,
        gallery,
        header,
        /* eslint-enable */
      } = res.sections;
      if (placesData) {
        this.hasMap = true;
        this.one('mr-map').update(placesData);
      } else {
        this.hasMap = false;
      }
      if (bibData) {
        this.bibliographyData = bibData;
      }
      if (witnessData) {
        this.collectionWitnessData = {
          items: witnessData.items.map((witness: {
            link: string; title: string; type: string;
          }): ItemPreviewData => ({
            title: witness.title,
            anchor: {
              href: witness.link,
            }
          })),
          header: witnessData.header
        };
      }
      if (worksData?.items) {
        this.collectionWorksData = {
          header: worksData.header,
          items: worksData.items.map((item: CollectionItem) => ({
            image: item.image,
            title: item.title,
            anchor: item.link ? {
              href: item.link,
            } : undefined,
            text: item.text,
          }))
        };
      }
      if (gallery) {
        this.collectionGalleryData = gallery;
      }
      if (header) {
        this.eventDescription = header.content;
        this.eventHeader = res.title;
        this.one('mr-year-header').update({
          title: { main: { text: header.title } },
          actions: {
            buttons: [{
              text: '',
              icon: 'n7-icon-close',
              anchor: {
                payload: 'closebutton'
              }
            }]
          }
        });
      }
      this.loading.resourceDetails = false;
    });
  }
}
