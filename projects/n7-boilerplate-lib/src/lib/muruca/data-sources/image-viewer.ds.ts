import { DataSource } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class MrImageViewerDS extends DataSource {
  id: string;

  viewer: any;

  viewerLoaded$: Subject<void> = new Subject();

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
        sequenceMode: true,

        navigationControlAnchor: 'TOP_RIGHT',
      },
      _setViewer: (viewer) => {
        this.viewer = viewer;
        this.viewerLoaded$.next();
      }
    };
  }

  public handleThumbClick({ thumbindex }) {
    this.viewer.goToPage(thumbindex);
  }
}
