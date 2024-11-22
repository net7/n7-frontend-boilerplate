import { DataSource } from '@net7/core';

export class AwSchedaImageIiifDS extends DataSource {
  protected transform(data) {
    if (!data) return null;

    const { libOptions } = this.options;
    const iiifManifestsList = data.items;
    const windows = iiifManifestsList.map((manifest) => ({
      manifestId: manifest.url,
    }));
    return {
      libOptions: {
        ...libOptions,
        windows
      },
    };
  }
}
