import { LayoutDataSource } from '@n7-frontend/core';
import { ItemPreviewData, TimelineData } from '@n7-frontend/components';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';
import 'leaflet.markercluster';

// demo page: http://localhost:4200/timeline/2992/missione-venezia

export class MrTimelineLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private route: ActivatedRoute;

  private location: Location;

  private loadedResourceDetails = false;

  public defaultDescription = '';

  public eventHeader: string;

  public eventDescription = ''

  public timelineData: TimelineData;

  public hasMap = false;

  public timelineListener$: Subject<any> = new Subject()

  public bibliographyMock: ItemPreviewData[] = [
    { title: 'M.J.L. Hocker, Bibliotheca Heilsbronnensis sive Catalogus librorum omnium..., Nkirnberg 1731, 56 n. 68 ' },
    { title: 'J.C. Irmischer, Handschriften-Katalog der Kgl. Universitàtsbibliothek Erlangen, Frankfurt a. M.-Erlangen 1852, 191-192 n. 686 ' },
    { title: 'H. Flischer, Die lateinischen Papierhandschriften der Universitàtsbibliothek Erlangen, Erlangen 1936, 371 ' },
    { title: 'A. Sottili, I codici del Petrarca nella Germania Occidentale, in «IMU», X (1967), pp. 486-487 ' },
    { title: 'F. Petrarca, Senile V 2, a cura di M. Berté, Firenze 1998, pp. 38-39 ' },
    { title: 'H. Fischer, Die lateinischen Papierhandschriften der Universitàtsbibliothek Erlangen, Erlangen 1936, 371 ' },
  ];

  public connectedMapsMock: ItemPreviewData[] = [
    { title: 'Kunyu Wanguo Quantu', text: 'Complete Map of all mountains and seas', image: '/assets/mocks/paper.png' }
  ]

  public images: string[] = [
    'https://i.imgur.com/WM3EG9d.png',
    'https://i.imgur.com/ZDQmlnX.png',
    'https://i.imgur.com/HhKxoZb.png',
    'https://i.imgur.com/c3tonAj.png',
    'https://i.imgur.com/Ef7izGP.png',
    'https://i.imgur.com/8Xpzoig.png',
    'https://i.imgur.com/yhF0LCt.png',
    'https://i.imgur.com/bMfHfEh.png',
  ]

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
      this.one('mr-timeline').update(d);
    });
    this.getWidgetDataSource('mr-timeline').timelineLoaded$
      .pipe(first())
      .subscribe((timeline: any) => {
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
    }).subscribe((res) => {
      if (!res || res == null) return;
      const {
        /* eslint-disable */
        'collection-bibliography': bibliographyData,
        'collection-places': placesData,
        'collection-witnesses': witnessData,
        'collection-works': worksData,
        /* eslint-enable */
        header,
        title,
      } = res.sections;
      if (placesData) {
        this.hasMap = true;
        this.one('mr-map').update(placesData);
      } else {
        this.hasMap = false;
      }
      this.eventHeader = header.title;
      this.eventDescription = header.content;
      this.one('mr-year-header').update({
        title: { main: { text: title } },
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
      this.loadedResourceDetails = true;
    });
  }
}
