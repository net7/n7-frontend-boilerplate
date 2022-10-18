import { DataSource } from '@net7/core';
import { ImageViewerData } from '@net7/components';
import { interval, Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';

export class AwSchedaImageDS extends DataSource {
  private instance;

  public instanceLoaded$: Subject<any> = new Subject();

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

        this.instanceLoaded$.next(this.instance);

        if (data.hasNavigation$) {
          const { nextButton } = this.instance;
          data.hasNavigation$.next(!!(nextButton && !nextButton.element?.disabled));
        }
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
    const tileSources = [];
    images.forEach(({ type, url, iiifImages }) => {
      if (type === 'images-simple') {
        tileSources.push({
          url,
          type: 'image'
        });
      } else if (type === 'images-iip') {
        // FIXME: togliere replace
        tileSources.push(url.replace('FIF', 'Deepzoom').replace('.tif', '.tif.dzi'));
      } else if (type === 'images-iiif') {
        iiifImages.forEach((iiifUrl) => {
          tileSources.push(iiifUrl);
        });
      }
    });
    return tileSources;
  }
}
