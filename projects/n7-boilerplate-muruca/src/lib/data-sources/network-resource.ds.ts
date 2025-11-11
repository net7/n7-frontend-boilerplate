import { NetworkData } from '@net7/components';
import { DataSource } from '@net7/core';
import { Subject } from 'rxjs';
import { Network } from 'vis-network';

export class MrNetworkResourceDS extends DataSource {
  id: string;

  public legend: Array<{key: string, label: string, color: string}> = [];

  public networkListener$: Subject<Network> = new Subject();

  protected transform(data): NetworkData {
    setTimeout(() => {
      const container = document.getElementById('demo-network');
      if (!container) {
        console.error('Container non trovato');
        return;
      }
      try {
        const { nodes } = data;
        const { edges } = data;
        const networkGroups = data?.groups || {};
        const options = data.libOptions;
        const mergedGroups = {
          ...networkGroups,
          ...(options?.groups || {})
        };

        // legenda
        this.legend = [];
        Object.keys(mergedGroups).forEach((key) => {
          const group = mergedGroups[key];
          this.legend.push({
            key,
            label: group.label || key,
            color: group.color || '#cccccc'
          });
        });

        const libOptions = {
          ...options,
          groups: mergedGroups
        };

        const network = new Network(container, { nodes, edges }, libOptions);
        this.networkListener$.next(network);
      } catch (error) {
        console.error('Errore inizializzazione', error);
      }
    }, 100);
    return data;
  }
}
