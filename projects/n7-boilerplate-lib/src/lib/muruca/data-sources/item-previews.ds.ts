import { DataSource } from '@n7-frontend/core';

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
    ]
  }
}
