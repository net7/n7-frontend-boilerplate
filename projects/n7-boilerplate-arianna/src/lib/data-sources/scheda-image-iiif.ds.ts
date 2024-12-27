import { DataSource } from '@net7/core';
import { Subject } from 'rxjs';
import Mirador from 'mirador';

export class AwSchedaImageIiifDS extends DataSource {
  private instance;

  public instanceLoaded$: Subject<any> = new Subject();

  protected transform(data) {
    if (!data) return null;

    const { libOptions } = this.options;
    const iiifManifestsList = data.items;
    const windows = [];

    iiifManifestsList.forEach((manifest) => {
      windows.push({ manifestId: manifest.url });
      if (this.instance) {
        const state = this.instance.store.getState();
        const currentWindowId = state.workspace.windowIds[0];
        this.instance.store.dispatch(
          Mirador.actions.addWindow({
            manifestId: manifest.url
          })
        );
        this.instance.store.dispatch(Mirador.actions.removeWindow(currentWindowId));
      }
    });

    return {
      libOptions: {
        ...libOptions,
        windows
      },
      _setInstance: (viewer) => {
        this.instance = viewer;
        this.onRender();
      }
    };
  }

  private onRender() {
    this.instanceLoaded$.next(this.instance);
  }
}
