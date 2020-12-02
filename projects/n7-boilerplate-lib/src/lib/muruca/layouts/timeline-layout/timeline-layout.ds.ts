import { LayoutDataSource } from '@n7-frontend/core';
import { InnerTitleData, ItemPreviewData } from '@n7-frontend/components';
import { ActivatedRoute } from '@angular/router';
import * as vis from 'vis-timeline';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';

// demo page: http://localhost:4200/timeline/2992/missione-venezia

export class MrTimelineLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private route: ActivatedRoute;

  private loadedResourceDetails = false;

  public yearHeader: InnerTitleData = {
    title: { main: { text: 'La vita di Petrarca' } },
  };;

  public eventHeader: string;

  public eventDescription = 'Petrarca studia legge (si iscrive all\'università ma non porta a termine gli studi anche se, come vedremo fra poco, avrà comunque una "laurea") ed entra in contatto con autori latini come Cicerone e Virgilio.Per lui il latino è quasi una seconda lingua che usa anche per prendere appunti.Sono quindi tanti e diversi i fattori che influenzano la sua preparazione: un avviamento alla letteratura religiosa, una grande conoscenza della letteratura volgare(cioè stilnovo e letteratura francese), un grande amore per i classici latini: premesse che pongono le basi della sua grande poesia.'

  public timelineListener$: Subject<vis.Timeline> = new Subject()

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
    this.one('mr-map').update({});
    this.communication.request$('timeline', {
      method: 'GET',
      onError: (e) => console.error(e)
    }).subscribe((d) => {
      this.one('mr-timeline').update(d);
    });
    this.getWidgetDataSource('mr-timeline').timelineLoaded$.pipe(first()).subscribe((timeline: vis.Timeline) => {
      this.timelineListener$.next(timeline);
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
      this.eventHeader = res.sections.header.title;
      this.eventDescription = res.sections.header.content;
      this.yearHeader = {
        title: { main: { text: res.title } },
        actions: {
          buttons: [{
            text: '',
            icon: 'n7-icon-close',
            anchor: {
              href: '/timeline'
            }
          }]
        }
      };
      this.loadedResourceDetails = true;
    });
  }
}
