import { DataSource } from '@n7-frontend/core';
import { ImageViewerData } from '@n7-frontend/components';
import { PdfViewerData } from '../components';

type ExternalUrlData = {
  url: string;
}

type DigitalObjectData = {
  type: string;
  data: ImageViewerData | PdfViewerData | ExternalUrlData;
}
export class AwSchedaDigitalObjectsDS extends DataSource {
  protected transform(digitalObjects): DigitalObjectData[] {
    const result = [];
    digitalObjects.forEach((digitalObject, index) => {
      if (digitalObject.type === 'images') {
        const tileSources = this.getTileSources(digitalObject.items);

        result.push({
          type: digitalObject.type,
          hasNavigation: !!tileSources.length,
          data: {
            images: [],
            viewerId: `scheda-layout-viewer-${index}`,
            libOptions: {
              tileSources,
              sequenceMode: true,
              showReferenceStrip: true,
              autoHideControls: false,
              showNavigator: false,
            },
            _setViewer: () => {
              // do nothing
              // this.instance = viewer;
            },
          }
        });
      } else if (['pdf', 'external'].includes(digitalObject.type)) {
        const { type, url } = digitalObject;
        result.push({ type, data: { url } });
      }
    });
    return result;
  }

  // public hasInstance() {
  //   return !!this.instance;
  // }

  // public updateImages(data) {
  //   if (!this.instance) return;

  //   // reset
  //   this.instance.world.removeAll();

  //   setTimeout(() => {
  //     const images = this.getTileSources(data.items);
  //     this.hasNavigation = Array.isArray(data.items) && data.items.length > 1;
  //     this.instance.open(images);
  //   });
  // }

  private getTileSources(images) {
    return images.map(({ type, url }) => {
      if (type !== 'image') {
        // FIXME: togliere replace
        return url.replace('FIF', 'Deepzoom').replace('.tif', '.tif.dzi');
      }
      return { type, url };
    });
  }
}
