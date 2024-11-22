import { DataSource } from '@net7/core';

export class MrImageViewerIiifDS extends DataSource {
  protected transform(data: any): any {
    if (!data) return null;

    const { libOptions } = this.options;
    const iiifManifestsList = data['iiif-manifests'];
    const windows = iiifManifestsList.map((manifest) => ({
      manifestId: manifest.manifestUrl,
    }));
    return {
      libOptions: {
        ...libOptions,
        windows
      },
    };
  }
}
