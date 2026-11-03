import { EventHandler } from '@net7/core';
// import { Network } from 'vis-network';
import { MrLocaleService, MrResourceModalService } from '../services';
// import linksHelper from '../helpers/links-helper';

export class MrNetworkResourceEH extends EventHandler {
  private localeService: MrLocaleService;

  private modalService: MrResourceModalService;

  public listen() {
    this.outerEvents$.subscribe(({
      type,
      // payload,
      localeService
    }) => {
      switch (type) {
        case 'mr-resource-layout.init':
          this.localeService = localeService;

          // this.dataSource.networkListener$.subscribe((network: Network) => {
          //   network.on('click', (props) => {
          //     if (props.nodes && props.nodes.length > 0) {
          //       const nodeId = props.nodes[0];
          //       const node = this.dataSource.networkData.nodes.find((n) => n.id === nodeId);

          //       // gestione payload
          //       if (node?.payload) {
          //         let anchor = null;

          //         // Navigazione interna
          //         if (node?.payload?.link?.routeId) {
          //           const routeLink = this.localeService.getLinkByRouteId(
          //             node.payload.link.routeId,
          //             node.payload.link.id,
          //             node.payload.link.slug
          //           );
          //           anchor = {
          //             href: routeLink,
          //             queryParams: node.payload.link.params || null,
          //           };
          //           // link semplice
          //         } else if (node?.payload?.link && typeof node?.payload?.link === 'string') {
          //           anchor = {
          //             href: linksHelper.getRouterLink(node.payload.link),
          //             queryParams: linksHelper.getQueryParams(node.payload.link),
          //           };
          //           // link complesso
          //         } else if (node?.payload?.link && typeof node?.payload?.link === 'object') {
          //           let href = '';
          //           if (node.payload.link.absolute) {
          //             href = `${node.payload.link.absolute}`;
          //           } else if (node.payload.link.relative) {
          //             href = node.payload.link.relative;
          //           }

          //           if (href && node.payload.link.params) {
          //             href = linksHelper.joinQueryParams(href, [node.payload.link.params]);
          //           }

          //           if (href && node.payload.link.query_string) {
          //             href = linksHelper.joinQueryParams(href, [document.location.search]);
          //           }

          //           anchor = {
          //             href,
          //             queryParams: null,
          //           };
          //           // altro
          //         } else if (node.payload.payload) {
          //           anchor = {
          //             payload: {
          //               ...node.payload.payload
          //             }
          //           };
          //         }

          //         if (anchor) {
          //           if (anchor.href) {
          //             window.open(anchor.href, '_blank');
          //           } else if (anchor.payload) {
          //             this.itemPreviewEmit('click', anchor.payload);
          //           }
          //         }
          //       }
          //     }
          //   });
          // });
          break;
        default:
          break;
      }
    });
  }

  public itemPreviewEmit = (type, payload) => {
    if (type === 'click' && payload?.action === 'resource-modal') {
      const { id, type: resourceType } = payload;
      this.modalService.open(id, resourceType);
    }
  };
}
