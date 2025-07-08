import { ActivatedRoute, Router } from '@angular/router';
import { EventHandler } from '@net7/core';
import { Network } from 'vis-network';
import { Location } from '@angular/common';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrLocaleService } from '../../services/locale.service';
import linksHelper from '../../helpers/links-helper';

export class MrNetworkLayoutEH extends EventHandler {
  private modalService: MrResourceModalService;

  private route: ActivatedRoute;

  private router: Router;

  private localeService: MrLocaleService;

  private location: Location;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-network-layout.init':
          this.dataSource.onInit(payload);
          this.modalService = payload.modalService;
          this.route = payload.route;
          this.router = payload.router;
          this.localeService = payload.localeService;
          this.location = payload.location;
          // scroll top
          window.scrollTo(0, 0);

          this.dataSource.networkListener$.subscribe((network: Network) => {
            network.on('click', (props) => {
              if (props.nodes && props.nodes.length > 0) {
                const nodeId = props.nodes[0];
                const node = this.dataSource.networkData.nodes.find((n) => n.id === nodeId);

                // gestione payload
                if (node?.payload) {
                  let anchor = null;

                  // Navigazione interna
                  if (node?.payload?.link?.routeId) {
                    const routeLink = this.localeService.getLinkByRouteId(
                      (node.payload.link.routeId).replace(/^mrc_/, ''),
                      node.payload.link.id,
                      node.payload.link.slug
                    );
                    anchor = {
                      href: routeLink,
                      queryParams: node.payload.link.params || null,
                    };
                    // link semplice
                  } else if (node?.payload?.link && typeof node?.payload?.link === 'string') {
                    anchor = {
                      href: linksHelper.getRouterLink(node.payload.link),
                      queryParams: linksHelper.getQueryParams(node.payload.link),
                    };
                    // link complesso
                  } else if (node?.payload?.link && typeof node?.payload?.link === 'object') {
                    let href = '';
                    if (node.payload.link.absolute) {
                      href = `${node.payload.link.absolute}`;
                    } else if (node.payload.link.relative) {
                      href = node.payload.link.relative;
                    }

                    if (href && node.payload.link.params) {
                      href = linksHelper.joinQueryParams(href, [node.payload.link.params]);
                    }

                    if (href && node.payload.link.query_string) {
                      href = linksHelper.joinQueryParams(href, [document.location.search]);
                    }

                    anchor = {
                      href,
                      queryParams: null,
                    };
                    // altro
                  } else if (node.payload.payload) {
                    anchor = {
                      payload: {
                        ...node.payload.payload
                      }
                    };
                  }

                  if (anchor) {
                    if (anchor.href) {
                      window.open(anchor.href, '_blank');
                    } else if (anchor.payload) {
                      this.itemPreviewEmit('click', anchor.payload);
                    }
                  }
                }
              }
            });
          });
          break;
        case 'mr-network-layout.destroy':
          break;
        default:
          console.warn('unhandled inner event of type', type);
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
