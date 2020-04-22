import { DataSource } from '@n7-frontend/core';
import { ImageViewerData } from '@n7-frontend/components';

export class AwSchedaImageDS extends DataSource {
  private instance;

  protected transform(data): ImageViewerData {
    const tileSources = this.getTileSources(data.image);

    return {
      images: [],
      viewerId: 'scheda-layout-viewer',
      libOptions: {
        tileSources,
        sequenceMode: true,
        showReferenceStrip: true,
        autoHideControls: false,
        showNavigator: true,
      },
      _setViewer: (viewer) => {
        this.instance = viewer;
      },
    };
  }

  public hasInstance() {
    return !!this.instance;
  }

  public updateImages(data) {
    if (!this.instance) return;

    const images = this.getTileSources(data.image);
    this.instance.open(images);
  }

  private getTileSources(images) {
    // FIXME: togliere replace
    return images.map((img) => img.replace('FIF', 'Deepzoom').replace('.tif', '.tif.dzi'));
  }
}
