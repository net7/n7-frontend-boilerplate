import { Data, Router } from '@angular/router';
import { LayoutDataSource, _t } from '@net7/core';
import { Anchor, ItemPreviewData } from '@net7/components';
import * as L from 'leaflet';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfigurationService, CommunicationService, MainStateService } from '@net7/boilerplate-common';
import { MrLayoutStateService } from '../../services/layout-state.service';
import 'leaflet.markercluster';
import { CollectionItem, GetResourceResponse } from './map-layout.types';
import { MrLocaleService } from '../../services/locale.service';

export class MrMapLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private localeService: MrLocaleService;

  private routerData: Data;

  private pageConfig;

  public loading = {
    resourceDetails: true,
    timeline: true,
  };

  public eventHeader: string;

  public eventDescription = '';

  public route;

  public router: Router;

  public mapListener$: Subject<L.Map> = new Subject();

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

  public collectionGalleryData;

  public eventTitle: string;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.localeService = payload.localeService;
    this.route = payload.route;
    this.router = payload.router;

    this.routerData = payload.routerData;
    this.pageConfig = this.configuration.get(this.routerData.configId) || {};
    // overwrite leaflet options with configuration.libOptions
    this.one('mr-map').updateOptions({ libOptions: this.pageConfig.libOptions });

    // update the map
    const { locale } = this.routerData;
    this.communication.request$('map', {
      method: 'GET',
      urlParams: locale ? `?locale=${locale}` : '',
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
    this.eventDescription = _t(this.pageConfig.defaultText);
    this.eventHeader = '';
    this.bibliographyData = undefined;
    this.collectionWitnessData = undefined;
    this.collectionWorksData = undefined;
    this.collectionGalleryData = undefined;
    if (navigate) {
      const href = this.localeService.getLinkByRouteId('map');
      this.router.navigate([href]);
    }
    this.one('mr-year-header').update({
      title: { main: { text: _t(this.pageConfig.title) } },
    });
  }

  updatePageDetails(id) {
    const { locale } = this.routerData;
    this.communication.request$('resource', {
      onError: (e) => console.error(e),
      method: 'POST',
      params: {
        id, type: 'views/places'
      },
      urlParams: locale ? `?locale=${locale}` : '',
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
            id: string;
            link: string;
            title: string;
            type: string;
            routeId?: string;
            slug?: string;
          }): ItemPreviewData => {
            let anchor: Anchor;
            if (witness.routeId) {
              const href = this.localeService
                .getLinkByRouteId(witness.routeId, witness.id, witness.slug);
              anchor = { href };
            } else if (witness.link) {
              anchor = { href: witness.link };
            }
            return {
              anchor,
              title: witness.title,
            };
          }),
          header: witnessData.header
        };
      } else {
        this.collectionWitnessData = undefined;
      }
      if (worksData?.items) {
        this.collectionWorksData = {
          header: worksData.header,
          items: worksData.items.map((item: CollectionItem) => {
            let anchor: Anchor;
            if (item.routeId) {
              const href = this.localeService
                .getLinkByRouteId(item.routeId, item.id, item.slug);
              anchor = { href };
            } else if (item.link) {
              anchor = { href: item.link };
            }
            return {
              anchor,
              image: item.image,
              title: item.title,
              text: item.text,
            };
          })
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
          title: { main: { text: res.title } },
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
