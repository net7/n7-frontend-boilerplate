import { ConfigAriannaHomeLayout } from '@net7/boilerplate-arianna';

const config: ConfigAriannaHomeLayout = {
  'top-hero': {
    title: 'Arte,<em>architettura</em> e fotografia nel XXI secolo',
    text: "Consulta il <em>patrimonio completo</em> del polo nazionale per l'arte e l'architettura contemporanee.",
    button: {
      text: 'CERCA NEI TITOLI DELL\'ARCHIVIO'
    },
    // backgroundImage: 'https://i.imgur.com/FgsxSYR.png',
    input: {
      placeholder: 'Cerca nei titoli delle schede'
    },
    fallback: 'La ricerca nel titolo non ha dato nessun risultato,<br>prova a cercare in tutti i campi.',
    classes: 'has-carousel',
  },
  'bottom-hero': {
    title: 'IL MAXXI',
    image: 'https://i.imgur.com/8BgHOBi.png',
    text: "La <em>storia</em> del MAXXI inizia nell'autunno del 1997 quando l'allora Ministero per i beni culturali ottiene dal Ministero della Difesa la cessione di un'ampia area nel quartiene Flaminio di Roma, occupata da officine e padiglioni della ex Caserma Montello, in disuso da tempo, con il fine di creare un nuovo polo mseale nazionale dedicato alle arti contemporanee per la cui progettazione, nel 1998, viene bandito un concorso internazionale di idee in due fasi. Il bando di concorso prevedeva un piano funzionale complesso, con la presenza di vari poli museali: un museo per l'architettura e uno per le arti del XXI secolo, uno spazio per le produzioni sperimentali, la biblioteca, l'auditorium, spazi per eventi dal vivo e infine spazi didattici. ",
    button: {
      text: 'NAVIGA IL PATRIMONIO',
      anchor: {
        href: '/aw/patrimonio'
      }
    }
  },
  'outer-links': {
    title: "Sezioni dell'archivio",
    description: "Questa è la descrizione per le sezioni dell'archivio, anche noti come 'outer links', qui è possibile spiegare più approfonditamente di cosa trattano le sezioni in evidenza in modo da guidare l'utente nel suo percorso di esplorazione.",
    test: [
      {
        image: 'https://picsum.photos/200',
        title: "Accedi all'archivio della Direzione dei lavori pubblici",
        text: 'Il complesso di fondi è costituito dalla documentazione prodotta dalle strutture burocratiche afferenti alla Direzione generale dei lavori pubblici',
        classes: 'is-vertical',
        anchor: {
          href: 'http://www.google.it'
        }
      },
      {
        title: 'Direzione generale delle politiche sociali',
        image: 'https://picsum.photos/200',
        text: 'Strutture burocratiche afferenti alla Direzione generale dei lavori pubblici',
        classes: 'is-vertical',
        anchor: {
          href: 'http://www.google.it'
        }
      },
      {
        title: "Direzione generale dell'organizzazione e del personale",
        image: 'https://picsum.photos/200',
        text: 'Il complesso di fondi è costituito dalla documentazione prodotta dalle strutture burocratiche afferenti alla Direzione generale',
        classes: 'is-vertical',
        anchor: {
          href: 'http://www.google.it'
        }
      }
    ]
  },
  'results-limit': 10,
  'max-item-length': 50,
  'autocomplete-fallback': 'Nessun risultato, prova a\ncambiare la ricerca.',
  'linked-objects-fallback': 'Non sono stati trovati oggetti culturali collegati alle entità selezionate. Prova a cambiare le entità selezionate o resetta la ricerca.'
};

export default config;
