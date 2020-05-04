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
      title: 'L\'archivio',
      text: 'Il progetto Unus sufficit orbis presenta infromazioni e dati relativi al lavoro e la vita del gesuita Matteo Ricci: le sue mappe che ha creato e le persone con cui ha collaborato.',
      button: {
        title: '',
        text: 'Vai alle opere',
        anchor: {
          href: '/button-url',
          target: '_blank'
        }
      },
      image: 'https://i.imgur.com/VHTbVbm.png'
    });
  }
}
