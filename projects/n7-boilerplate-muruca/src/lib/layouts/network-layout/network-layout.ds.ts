import { LayoutDataSource } from '@net7/core';
import { Network } from 'vis-network';
import { Observable, Subject } from 'rxjs';
import {
  ConfigurationService,
  CommunicationService,
/*   helpers */
} from '@net7/boilerplate-common';
import { Data, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  NetworkData
} from '@net7/components';
import 'leaflet.markercluster';
// import { GetResourceResponse } from './network-layouts.types';
import { MrLocaleService } from '../../services/locale.service';
// import { NETWORK_MOCK } from './network-layout-mock';

export class MrNetworkLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private router: Router;

  private configId: string;

  private pageConfig;

  private localeService: MrLocaleService;

  private location: Location;

  public loading = {
    network: false,
  };

  public networkData: NetworkData;

  public legend: Array<{key: string, label: string, color: string}> = [];

  public showLegend: boolean = true;

  public route;

  public networkListener$: Subject<Network> = new Subject();

  private routeData: Data;

  public toggleLegend() {
    this.showLegend = !this.showLegend;
  }

  onInit(payload: any) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.route = payload.route;
    this.router = payload.router;
    this.localeService = payload.localeService;
    this.location = payload.location;
    this.configId = payload.configId;
    this.routeData = payload.routeData;
    this.pageConfig = this.configuration.get(this.configId);

    // update the network
    /*     this.loading.network = true;
    this.communication
      .request$('network', {
        method: 'GET',
        urlParams: locale ? `$?locale=${locale}` : '',
        onError: (e) => console.error(e),
      })
      .subscribe((d) => {
        this.networkData = d;
        this.loading.network = false;
        this.one('mr-network').updateOptions({
          libOptions: this.pageConfig.libOptions,
        });
        this.one('mr-network').update(d);
        this.loading.network = false;
        this.initializeNetwork();
      }); */
  }

  pageRequest$(id, onError: (err: any) => void): Observable<any> {
    const { locale } = this.routeData;
    this.loading.network = true;
    return this.communication.request$('network', {
      onError,
      method: 'GET',
      urlParams: locale ? `${id}?locale=${locale}` : id
    });
  }

  handleResponse(response) {
    this.networkData = response;
    this.loading.network = false;
    this.one('mr-network').updateOptions({
      libOptions: this.pageConfig.libOptions,
    });
    this.one('mr-network').update(response);
    this.loading.network = false;
    this.initializeNetwork();
  }

  public initializeNetwork() {
    setTimeout(() => {
      const container = document.getElementById('demo-network');
      if (!container) {
        console.error('Container non trovato');
        return;
      }
      try {
        const { nodes } = this.networkData;
        const { edges } = this.networkData;
        const networkGroups = this.networkData?.groups || {};
        const options = this.pageConfig.libOptions;
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
  }
}
