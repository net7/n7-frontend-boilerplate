/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
import OpenSeadragon from 'openseadragon';
import tippy, { hideAll } from 'tippy.js';

const svgNS = 'http://www.w3.org/2000/svg';

// based on https://github.com/openseadragon/svg-overlay
class Overlay {
  private _viewer;

  private _containerWidth = 0;

  private _containerHeight = 0;

  private _node;

  private _svg;

  constructor(viewer) {
    this._viewer = viewer;

    this._svg = document.createElementNS(svgNS, 'svg');
    this._svg.style.position = 'absolute';
    this._svg.style.left = 0;
    this._svg.style.top = 0;
    this._svg.style.width = '100%';
    this._svg.style.height = '100%';
    this._viewer.canvas.appendChild(this._svg);

    this._node = document.createElementNS(svgNS, 'g');
    this._svg.appendChild(this._node);

    this._viewer.addHandler('animation', () => {
      this.resize();
    });

    this._viewer.addHandler('open', () => {
      this.resize();
    });

    this._viewer.addHandler('rotate', () => {
      this.resize();
    });

    this._viewer.addHandler('flip', () => {
      this.resize();
    });

    this._viewer.addHandler('resize', () => {
      this.resize();
    });

    this.resize();
  }

  node = () => this._node;

  svg = () => this._svg;

  resize = () => {
    if (this._containerWidth !== this._viewer.container.clientWidth) {
      this._containerWidth = this._viewer.container.clientWidth;
      this._svg.setAttribute('width', this._containerWidth);
    }

    if (this._containerHeight !== this._viewer.container.clientHeight) {
      this._containerHeight = this._viewer.container.clientHeight;
      this._svg.setAttribute('height', this._containerHeight);
    }

    const p = this._viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
    const zoom = this._viewer.viewport.getZoom(true);
    const rotation = this._viewer.viewport.getRotation();
    const flipped = this._viewer.viewport.getFlip();
    const containerSizeX = this._viewer.viewport._containerInnerSize.x;
    let scaleX = containerSizeX * zoom;
    const scaleY = scaleX;

    if (flipped) {
      // Makes the x component of the scale negative to flip the svg
      scaleX = -scaleX;
      // Translates svg back into the correct coordinates when the x scale is made negative.
      p.x = -p.x + containerSizeX;
    }

    this._node.setAttribute(
      'transform',
      `translate(${p.x},${p.y}) scale(${scaleX},${scaleY}) rotate(${rotation})`
    );
  };

  onClick = (node, handler) => {
    new OpenSeadragon.MouseTracker({
      element: node,
      clickHandler: handler
    }).setTracking(true);
  };
}

export class MrImageViewerOverlayModel {
  private _viewer;

  private _config;

  private _page = 0;

  private _overlay;

  private _stylesDefaults = {
    highlight_color: 'red',
    highlight_opacity: 0.5,
    border_color: 'gray',
    border_opacity: 1,
    border_width: 2
  };

  constructor(viewer, config) {
    if (this._viewer) return;

    this._viewer = viewer;
    this._config = config;
  }

  public init() {
    // listen viewer change
    this._viewer.addHandler('page', this.onPageChange);
    this._viewer.addHandler('zoom', this.onZoomChange);

    // load first overlay
    this.load();
  }

  public destroy() {
    this._viewer.removeHandler('page', this.onPageChange);
    this._viewer.removeHandler('zoom', this.onZoomChange);
  }

  private onPageChange = ({ page }) => {
    this._page = page;

    // load when image finish loading
    const onTileDrawn = () => {
      this.load();
      this._viewer.removeHandler('tile-drawn', onTileDrawn);
    };
    this._viewer.addHandler('tile-drawn', onTileDrawn);
  };

  private onZoomChange = () => {
    hideAll();
  };

  private load() {
    // clear first
    this.clear();
    // config
    const currentConfig = this._config.overlays[this._page];
    // set overlay
    if (currentConfig?.items) {
      this._overlay = new Overlay(this._viewer);
      currentConfig.items.forEach((itemConfig) => {
        switch (itemConfig.shape) {
          case 'polygon':
          case 'rectangle':
            this.loadPolygon(itemConfig);
            break;
          case 'circle':
            this.loadCircle(itemConfig);
            break;
          default:
            console.warn(`Overlay shape ${itemConfig.shape} does not exists`);
            break;
        }
      });

      // load tooltips
      setTimeout(() => {
        this.loadTooltips();
      }, 1000);
    }
  }

  private loadTooltips() {
    tippy('[data-tippy-content]', {
      showOnCreate: true,
      // trigger: 'click'
    });
  }

  private clear() {
    if (this._overlay) {
      // remove svg overlay
      this._overlay.svg().remove();
      this._overlay = null;

      // hide tooltips
      hideAll();
    }
  }

  private loadPolygon(config) {
    const child = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    child.setAttribute('points', config.coordinates);
    this.loadStyles(child);
    this.loadTooltipContent(child, config);

    this._overlay.node().appendChild(child);
  }

  private loadCircle(config) {
    const child = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const [cx, cy, r] = config.coordinates.split(',');
    child.setAttribute('cx', cx);
    child.setAttribute('cy', cy);
    child.setAttribute('r', r);
    this.loadStyles(child);
    this.loadTooltipContent(child, config);

    this._overlay.node().appendChild(child);
  }

  private loadStyles(child) {
    const currentConfig = this._config.overlays[this._page];
    const styles = {
      ...this._stylesDefaults,
      ...(currentConfig?.styles || {})
    };
    child.setAttribute('fill', styles.highlight_color);
    child.setAttribute('stroke', styles.border_color);
    child.setAttribute('stroke-width', styles.border_width);
    child.setAttribute('style', `fill-opacity: ${styles.highlight_opacity}; stroke-opacity: ${styles.border_opacity};`);
  }

  private loadTooltipContent(child, config) {
    const content = [];
    // title
    if (config?.title) {
      content.push(this.getTooltipTitle(config.title));
    }
    // image
    if (config?.detail_image) {
      content.push(this.getTooltipImage(config.detail_image));
    }
    // description
    if (config?.description) {
      content.push(this.getTooltipDescription(config.description));
    }
    // action
    if (config?.['action-url-url']) {
      content.push(this.getTooltipAction(config['action-url-url']));
    }

    if (content.length) {
      child.setAttribute(
        'data-tippy-content',
        `<div class="tooltip-overlay-wrapper">${content.join('')}</div>`
      );
    }
  }

  private getTooltipTitle(title) {
    return `<div class="tooltip-overlay-title">${title}</div>`;
  }

  private getTooltipImage(src) {
    return `
      <div class="tooltip-overlay-image">
        <img src="${src}" />
      </div>
    `;
  }

  private getTooltipDescription(description) {
    return `<div class="tooltip-overlay-description">${description}</div>`;
  }

  private getTooltipAction(url) {
    return `
      <div class="tooltip-overlay-action">
        <a href="${url}" class="n7-btn">Action!</a>
      </div>
    `;
  }
}
