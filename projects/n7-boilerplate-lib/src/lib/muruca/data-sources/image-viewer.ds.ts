import { DataSource } from '@n7-frontend/core';

export class MrImageViewerDS extends DataSource {
  id: string;

  viewer: any;

  protected transform(data: any): any {
    const { images, thumbs } = data;
    return {
      images,
      thumbs,
      viewerId: this.id,
      libOptions: {
        /* SHOW GROUP */
        showNavigator: false, // shows the mini-map
        autoHideControls: false,

        /* SHOW BUTTONS */
        showRotationControl: false,
        showSequenceControl: true,
        showHomeControl: true,
        showZoomControl: true,

        /* SEQUENCE */
        sequenceMode: true, // allows having multiple images (as in array of images + zoomed image)
        showReferenceStrip: true, // shows the images array (default: horizontally)

        navigationControlAnchor: 'TOP_RIGHT',
      },
      _setViewer(viewer) {
        this.viewer = viewer;
      }
    };
  }
}
