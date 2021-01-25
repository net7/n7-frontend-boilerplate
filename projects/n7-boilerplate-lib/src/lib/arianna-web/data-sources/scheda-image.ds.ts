import { DataSource } from '@n7-frontend/core';
import { ImageViewerData } from '@n7-frontend/components';
import { interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';

export class AwSchedaImageDS extends DataSource {
  private instance;

  protected transform(data): ImageViewerData {
    const tileSources = this.getTileSources(data.items);

    return {
      images: [],
      viewerId: data.id,
      libOptions: {
        tileSources,
        sequenceMode: true,
        showReferenceStrip: true,
        autoHideControls: false,
        showNavigator: false,
      },
      _setViewer: (viewer) => {
        this.instance = viewer;
      }
    };
  }

  public hasInstance() {
    return !!this.instance;
  }

  public updateImages(data) {
    if (!this.instance) return;

    // container exists check
    interval(10).pipe(
      filter(() => !!document.getElementById(this.output.viewerId)),
      first()
    ).subscribe(() => {
      // reset
      this.instance.world.removeAll();
      setTimeout(() => {
        const images = this.getTileSources(data.items);
        this.instance.open(images);
      });
    });
  }

  public reset() {
    if (!this.instance) return;
    this.instance.world.removeAll();
  }

  private getTileSources(images) {
    return images.map(({ type, url }) => {
      if (type === 'images-simple') {
        return {
          url,
          type: 'image'
        };
      }
      // FIXME: togliere replace
      return url.replace('FIF', 'Deepzoom').replace('.tif', '.tif.dzi');
    });
  }
}
