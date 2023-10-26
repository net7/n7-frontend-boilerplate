/* eslint-disable camelcase */
import { DataSource } from '@net7/core';
import { Subject } from 'rxjs';
import { MrImageViewerOverlayModel } from '../models/image-viewer-overlay.model';

// FIXME: togliere mock
import mock from '../models/image-viewer-overlay.mock';

export class MrImageViewerDS extends DataSource {
  id: string;

  viewer: any;

  viewerLoaded$: Subject<void> = new Subject();

  overlayEvents$: Subject<{ type: string; payload?: any }> = new Subject();

  protected transform(data: any): any {
    if (!data) return null;
    // const { images, thumbs, overlay_images } = data;
    // FIXME: togliere mock
    const { images, thumbs, overlay_images } = mock;
    // const { tools } = (this.options || {});
    return {
      images,
      thumbs,
      viewerId: this.id,
      hideNavigation: !(data.images.length > 1),
      libOptions: {
        /* SHOW GROUP */
        showNavigator: false, // shows the mini-map
        autoHideControls: false,
        // showNavigationControl: false,

        /* SHOW BUTTONS */
        showRotationControl: false,
        showSequenceControl: true,
        showHomeControl: true,
        showZoomControl: true,

        /* SEQUENCE */
        sequenceMode: true, // allows having multiple images (as in array of images + zoomed image)
        // showReferenceStrip: tools !== true, // shows the images array (default: horizontally)
        showReferenceStrip: true, // shows the images array (default: horizontally)

        navigationControlAnchor: 'TOP_RIGHT',
      },
      _setViewer: (viewer) => {
        this.viewer = viewer;
        this.viewerLoaded$.next();

        // overlay test
        if (overlay_images) {
          // FIXME: togliere mock
          this.loadOverlays(mock);
        }
      }
    };
  }

  public changePage(index) {
    this.viewer.goToPage(index); // call to OpenSeadragon APIs
  }

  public loadOverlays(data) {
    const overlayModel = new MrImageViewerOverlayModel({
      viewer: this.viewer,
      config: data,
      overlayEvents$: this.overlayEvents$
    });
    overlayModel.init();
  }
}
