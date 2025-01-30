import { DataSource } from '@net7/core';

export class MrImageViewerIiifDS extends DataSource {
  protected transform(data: any): any {
    if (!data) return null;

    const urlParams = new URLSearchParams(window.location.search);
    const parCanvasId = urlParams.get('iiifPageId');
    const parCanvasIndex = urlParams.get('iiifPageIndex');
    const parAnnotationId = urlParams.get('iiifAnnotationId');

    const canvasId = parCanvasId || null;
    const canvasIndex = parCanvasIndex ? parseInt(parCanvasIndex, 10) : 0;
    const annotationId = parAnnotationId || null;

    const { libOptions } = this.options;
    const iiifManifestsList = data['iiif-manifests'];
    const windows = iiifManifestsList.map((manifest) => ({
      manifestId: manifest.manifestUrl,
      canvasId,
      canvasIndex,
      annotationId,
    }));
    return {
      libOptions: {
        ...libOptions,
        windows
      },
    };
  }
}
