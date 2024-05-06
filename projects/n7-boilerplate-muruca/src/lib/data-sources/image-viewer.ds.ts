/* eslint-disable camelcase */
import { DataSource } from '@net7/core';
import { Subject, interval } from 'rxjs';
import { ImageViewerData } from '@net7/components';
import { filter, first } from 'rxjs/operators';
import { MrImageViewerOverlayModel } from '../models/image-viewer-overlay.model';

interface MrImageViewerData extends ImageViewerData {
  thumbs: any[];
}

export class MrImageViewerDS extends DataSource {
  id: string;

  viewer: any;

  overlayModel: MrImageViewerOverlayModel;

  viewerLoaded$: Subject<void> = new Subject();

  overlayEvents$: Subject<{ type: string; payload?: any }> = new Subject();

  protected transform(data: any): MrImageViewerData {
    if (!data) return null;
    const { images, thumbs, overlay_images } = data;
    const { tools } = this.options || {};
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
        showReferenceStrip: tools !== true, // shows the images array (default: horizontally)

        navigationControlAnchor: 'TOP_RIGHT',
      },
      _setViewer: (viewer) => {
        this.viewer = viewer;
        this.viewerLoaded$.next();

        // overlay test
        if (overlay_images) {
          this.loadOverlays(data);
        }
      },
    };
  }

  public changePage(index) {
    this.viewer.goToPage(index); // call to OpenSeadragon APIs
  }

  public overlayCloseClick() {
    this.overlayModel.resetStyles();
  }

  public loadOverlays(data) {
    this.overlayModel = new MrImageViewerOverlayModel({
      viewer: this.viewer,
      config: data,
      overlayEvents$: this.overlayEvents$,
    });
    this.overlayModel.init();
  }

  public updateImages(data) {
    if (!this.viewer) return;
    // container exists check
    interval(10)
      .pipe(
        filter(() => !!document.getElementById(this.output.viewerId)),
        first()
      )
      .subscribe(() => {
        // reset
        this.viewer.world.removeAll();
        setTimeout(() => {
          const images = this.getTileSources(data.items);
          this.viewer.open(images);
          this.onRender();
        });
      });
  }

  private getTileSources(images) {
    const tileSources = [];
    images.forEach(({ type, url, iiifImages }) => {
      if (type === 'images-simple') {
        tileSources.push({
          url,
          type: 'image',
        });
      } else if (type === 'images-iip') {
        // FIXME: togliere replace
        tileSources.push(
          url.replace('FIF', 'Deepzoom').replace('.tif', '.tif.dzi')
        );
      } else if (type === 'images-iiif') {
        iiifImages.forEach((iiifUrl) => {
          tileSources.push(iiifUrl);
        });
      }
    });
    return tileSources;
  }

  private onRender() {
    // emit signal
    this.viewerLoaded$.next(this.viewer);

    // update navigation classes
    const { nextButton } = this.viewer;
    const hasNavigation = !!(nextButton && !nextButton.element?.disabled);
    this.output.classes = hasNavigation
      ? 'has-navigation'
      : 'navigation-hidden';
  }
}
