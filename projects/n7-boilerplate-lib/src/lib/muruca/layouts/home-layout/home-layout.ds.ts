import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';

export class MrHomeLayoutDS extends LayoutDataSource {
  onInit() {
    this.one('mr-resources').updateOptions({ source: 'resources' });
    this.one('mr-collections').updateOptions({ source: 'collections' });
    this.some(['mr-resources', 'mr-collections']).update({});
    this.one('mr-res-header').update({
      title: 'Le mappe',
      subtitle: 'Una selezione di alcune mappe di Totus Mundus.',
      button: {
        text: 'Visita il catalogo',
        link: '/catalogo'
      }
    });
    this.one('mr-coll-header').update({
      title: 'I percorsi',
      subtitle: 'Visita il mondo di Totus Mundus con una serie di percorsi per te.',
      button: {
        text: 'Visita il catalogo',
        link: '/catalogo'
      }
    });
    this.one('mr-hero').update({
      text: 'The Totus Mundus project presents a series of information and data about the jesuit Matteo Ricci, its life, the maps he created and the people he collaborated with',
      button: {
        title: '',
        text: 'Cerca',
        anchor: {
          href: '/button-url',
          target: '_blank'
        }
      },
      image: 'https://i.imgur.com/VHTbVbm.png'
    });
  }
}
