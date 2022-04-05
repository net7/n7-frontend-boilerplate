import { DataSource } from '@net7/core';

export class MrItemPreviewsDS extends DataSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected transform(data: string): string {
    return this.mock[this.options.source];
  }

  // ===== MOCK DATA =====
  private mock = {
    resources: [
      {
        image: 'https://i.imgur.com/8bNcgR6.png',
        title: 'Unattributed version',
        text: 'A japanese colored version',
        metadata: [{
          classes: 'metadata',
          items: [
            { label: 'Artista', value: 'Massimo Berruti' },
            { label: 'Tecnica', value: 'Fotografia' },
            { label: 'Galleria', value: 'Galleria Tonelli' },
          ]
        }]
      }, {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'Yudi Shanhai Quantu',
        text: 'Complete Map of all mountains and seas',
      }, {
        image: 'https://i.imgur.com/sLu7u2v.png',
        title: 'Reconstruction of D\'Elia\'s map',
        text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
        metadata: [{
          classes: 'metadata',
          items: [
            { label: 'Artista', value: 'Massimo Berruti' },
            { label: 'Tecnica', value: 'Fotografia' },
            { label: 'Galleria', value: 'Galleria Tonelli' },
          ]
        }]
      }, {
        image: 'https://i.imgur.com/8bNcgR6.png',
        title: 'Unattributed version',
        text: 'A japanese colored version',
      }
    ],
    collections: [
      {
        image: 'https://i.imgur.com/8bNcgR6.png',
        title: 'Unattributed version',
        text: 'A japanese colored version',
      }, {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'Yudi Shanhai Quantu',
        text: 'Complete Map of all mountains and seas',
      }, {
        image: 'https://i.imgur.com/sLu7u2v.png',
        title: 'Reconstruction of D\'Elia\'s map',
        text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
      }
    ],
    search: [
      {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'Yudi Shanhai Quantu',
        text: 'Complete Map of all mountains and seas',
      }, {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'World Map based on Matteo Ricci 1850',
        text: 'Complete Map fo all mountains and seas',
      }, {
        image: '',
        title: 'Reconstruction of D\'Elia\'s map',
        text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
      }, {
        image: '',
        title: 'Unattributed version',
        text: 'A japanese colored version',
      }, {
        image: '',
        title: 'Matteo Ricci\'s way from Macau to Beijing',
        text: 'A japanese colored version',
      }, {
        image: '',
        title: 'The 400-year-old map that shows China as the centre of the world',
        text: 'A japanese colored version',
      }, {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'Yudi Shanhai Quantu',
        text: 'Complete Map of all mountains and seas',
      }, {
        image: 'https://i.imgur.com/52UFqca.png',
        title: 'World Map based on Matteo Ricci 1850',
        text: 'Complete Map fo all mountains and seas',
      }, {
        image: '',
        title: 'Reconstruction of D\'Elia\'s map',
        text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
      }, {
        image: '',
        title: 'Unattributed version',
        text: 'A japanese colored version',
      }, {
        image: '',
        title: 'Matteo Ricci\'s way from Macau to Beijing',
        text: 'A japanese colored version',
      }, {
        image: '',
        title: 'The 400-year-old map that shows China as the centre of the world',
        text: 'A japanese colored version',
      }
    ]
  }
}
