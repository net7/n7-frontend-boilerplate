import { DataSource } from '@n7-frontend/core';

export class AwHomeHeroPatrimonioDS extends DataSource {

  protected transform(data) {
    const HERO_PATRIMONIO_DATA = {
      title: "IL MAXXI",
      backgroundImage: "https://www.solidbackgrounds.com/images/2560x1440/2560x1440-gray-solid-color-background.jpg",
      image: "https://i.imgur.com/8BgHOBi.png",
      text: "La storia del MAXXI inizia nell'autunno del 1997 quando l'allora Ministero per i beni culturali ottiene dal Ministero della Difesa la cessione di un'ampia area nel quartiene Flaminio di Roma, occupata da officine e padiglioni della ex Caserma Montello, in disuso da tempo, con il fine di creare un nuovo polo mseale nazionale dedicato alle arti contemporanee per la cui progettazione, nel 1998, viene bandito un concorso internazionale di idee in due fasi. Il bando di concorso prevedeva un piano funzionale complesso, con la presenza di vari poli museali: un museo per l'architettura e uno per le arti del XXI secolo, uno spazio per le produzioni sperimentali, la biblioteca, l'auditorium, spazi per eventi dal vivo e infine spazi didattici.",
      button: {
        text: "NAVIGA IL PATRIMONIO",
        payload: "naviga-patrimonio"
      }
    };
    return HERO_PATRIMONIO_DATA;
  }
}