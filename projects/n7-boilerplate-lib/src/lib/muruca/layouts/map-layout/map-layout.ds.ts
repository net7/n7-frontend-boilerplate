import { LayoutDataSource, _t } from '@n7-frontend/core';
import { ItemPreviewData } from '@n7-frontend/components';
import { Location } from '@angular/common';
import { Map } from 'leaflet';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import 'leaflet.markercluster';
import { CollectionItem, GetResourceResponse } from './map-layout.types';

export class MrMapLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private configId: string;

  private pageConfig;

  private location: Location;

  public loading = {
    resourceDetails: true,
    timeline: true,
  }

  public defaultDescription = '';

  public eventHeader: string;

  public eventDescription = ''

  public route;

  public mapListener$: Subject<Map> = new Subject();

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

    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId) || {};

    // update the map
    this.communication.request$('map', {
      method: 'GET',
      onError: (e) => console.error(e)
    }).subscribe(({ dataSet }) => {
      if (dataSet) { this.one('mr-map').update(dataSet); }
    });
    this.getWidgetDataSource('mr-map').mapLoaded$
      .pipe(first())
      .subscribe(({ map, markers }) => {
        this.mapListener$.next({ map, markers });
      });
  }

  loadDefaults(navigate: boolean) {
    this.eventDescription = this.defaultDescription;
    this.eventHeader = '';
    this.bibliographyData = undefined;
    this.collectionWitnessData = undefined;
    this.collectionWorksData = undefined;
    this.collectionGalleryData = undefined;
    if (navigate) this.location.go('/map/');
    this.one('mr-year-header').update({
      title: { main: { text: _t(this.pageConfig.title) } },
    });
  }

  updatePageDetails(id) {
    this.communication.request$('resource', {
      onError: (e) => console.error(e),
      method: 'POST',
      params: {
        id, type: 'views/places'
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
        // this.hasMap = true;
        this.one('mr-map').update(placesData);
      } else {
        // this.hasMap = false;
      }
      if (bibData) {
        this.bibliographyData = bibData;
      } else {
        this.bibliographyData = undefined;
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
      } else {
        this.collectionWitnessData = undefined;
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
      } else {
        this.collectionWorksData = undefined;
      }
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
