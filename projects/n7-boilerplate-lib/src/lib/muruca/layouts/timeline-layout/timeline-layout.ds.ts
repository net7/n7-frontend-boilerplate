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

  public eventDescription = '<p>In questa sezione, curata da Silvia Rizzo, si trova la vita di Petrarca organizzata anno per anno, e, quando sia possibile, mese per mese o addirittura giorno per giorno. Il lavoro è stato condotto mediante uno spoglio delle opere di Petrarca, delle lettere dei suoi corrispondenti e della principale bibliografia relativa alla sua vita. Non possediamo purtroppo ancora un codice diplomatico petrarchesco ma si è ovviamente tenuto conto dei documenti segnalati e pubblicati. Negli studi più recenti si tende spesso a sottolineare l&#8217;attività di falsificazione di se stesso svolta da Petrarca nella sua opera letteraria e a diffidare di quanto lui stesso ci dice. Ma il punto di partenza di qualsiasi tentativo di fare la biografia di Petrarca resta &#8211; volenti o nolenti &#8211; il molto che ci dice lui stesso: come scrive E. H. Wilkins, <em>Vita del Petrarca</em>, trad. di R. Ceserani, nuova edizione a cura di L. C. Rossi, Milano 2003, p. 3, «Egli è anche grande &#8211; grazie soprattutto alle centinaia di lettere e alle note scritte sui margini delle pagine dei suoi libri, che sono state con tanta devozione studiate &#8211; per il fatto che noi conosciamo le sue esperienze di vita con molta maggiore profondità che non quelle di qualsiasi altro essere umano vissuto prima di lui». Dunque nello stendere questa cronologia ci si è attenuti il più possibile a quanto Petrarca racconta di sé, tranne quando la deviazione dalla realtà sia evidente e comprovata da altre testimonianze o deducibile con un buon grado di sicurezza. In sintesi, questa cronologia accetta il racconto di sé che lui ha voluto tramandare ai posteri.  Com&#8217;è noto, Petrarca in genere non segnava l&#8217;anno in calce alle lettere e molto spesso la data è discussa. Si è sempre cercato di prendere posizione seguendo la proposta che a me appare più convincente, talvolta accennando anche ad altre. Si è dato qualche peso al criterio della posizione di una lettera all&#8217;interno delle raccolte, considerato l&#8217;ordine quasi cronologico che Petrarca stesso dichiara di aver seguito (<em>Fam. </em>24, 13, 4 «preter has enim ultimas veteribus inscriptas illustribus, quas propter similitudinem novitatis sciens unum simul in locum contuli, ac preter primam, que dictata serius prevenit comites et locum prefationis obtinuit, cetera pene omnia quo inciderant scripta sunt ordine») e a cui in linea di massima si è realmente attenuto (quando ci sono patenti scostamenti dall&#8217;ordine cronologico non di rado se ne capisce la causa, come per esempio l&#8217;esigenza di collocare all&#8217;inizio o alla fine dei libri lettere di particolare rilievo).</p>\n<p>I titoletti nella timeline segnalano in breve gli avvenimenti salienti degli anni o dei periodi considerati. Aprendo la scheda l&#8217;utente troverà le notizie organizzate in modo che ogni capoverso corrisponde a una data diversa. Differenti avvenimenti aventi la stessa data hanno ognuno un capoverso. Quando il capoverso non comincia con una data vuol dire che è impossibile fissarla, ma la sua collocazione all&#8217;interno della cronologia indica approssimativamente anteriorità o seriorità rispetto ad altri eventi dello stesso anno o dello stesso periodo. Gli avvenimenti che possono solo essere ricondotti genericamente a un determinato anno sono di norma raggruppati in fondo. La cronologia è collegata alle opere e ai manoscritti via via menzionati e a una mappa che mostra sulla carta geografica le varie località toccate da Petrarca. All&#8217;interno delle singole schede le opere di Petrarca e la bibliografia sono citate in forma abbreviata: le abbreviazioni delle opere sono quelle utilizzate all&#8217;interno del portale; le altre sono sciolte nel campo specifico deputato alla bibliografia.</p>'

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
