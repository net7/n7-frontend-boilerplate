import { DataSource } from '@n7-frontend/core';

export class AwGalleryResultsDS extends DataSource {
  private GALLERY_RESULTS_MOCK = new Array(12)

  protected transform(data) {
    this.GALLERY_RESULTS_MOCK.fill(
      {
        image: 'https://i.imgur.com/2xY0DWR.png',
        title: 'Costa di Sorrento',
        metadata: [
          {label: 'Artista', value: 'John Davies'},
          {label: 'Fotografia'}
        ]
      }
    )
    return this.GALLERY_RESULTS_MOCK
  }
}