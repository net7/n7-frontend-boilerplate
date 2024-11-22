import { DataSource } from '@net7/core';

export class MrImageViewerIiifDS extends DataSource {
  protected transform(data: any): any {
    if (!data) return null;

    const { libOptions } = this.options;
    const iiifManifestsList = data['iiif-manifests'];
    const windows = iiifManifestsList.map((manifest) => ({
      imageToolsEnabled: (manifest.imageToolsEnabled) ? manifest.imageToolsEnabled : true,
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
