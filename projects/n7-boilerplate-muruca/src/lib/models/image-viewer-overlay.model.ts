/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
import OpenSeadragon from 'openseadragon';

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

  private _overlayEvents$;

  private _children = [];

  private _stylesDefaults = {
    highlight_color: 'red',
    highlight_opacity: 0.5,
    border_color: 'gray',
    border_opacity: 1,
    border_width: 2,
  };

  private _selectedStylesDefaults = {
    border_color: 'gray',
    border_opacity: 1,
    border_width: 5,
  };

  constructor({ viewer, config, overlayEvents$ }) {
    if (this._viewer) return;

    this._viewer = viewer;
    this._config = config;
    this._overlayEvents$ = overlayEvents$;
  }

  public init() {
    // listen viewer change
    this._viewer.addHandler('page', this.onPageChange);

    // load first overlay
    this.load();
  }

  public destroy() {
    this._viewer.removeHandler('page', this.onPageChange);
  }

  public resetStyles() {
    this._children.forEach((child) => {
      this.loadStyles(child);
    });
  }

  private onPageChange = ({ page }) => {
    this._page = page;

    // emit signal
    this._overlayEvents$.next({ type: 'pagechange' });

    // load when image finish loading
    const onTileDrawn = () => {
      this.load();
      this._viewer.removeHandler('tile-drawn', onTileDrawn);
    };
    this._viewer.addHandler('tile-drawn', onTileDrawn);
  };

  private load() {
    // clear first
    this.clear();
    // config
    const currentConfig = this._config.overlay_images[this._page];
    // set overlay
    if (currentConfig?.hotspots) {
      this._overlay = new Overlay(this._viewer);
      currentConfig.hotspots.forEach((itemConfig) => {
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
    }
  }

  private clear() {
    if (this._overlay) {
      // remove svg overlay
      this._overlay.svg().remove();
      this._overlay = null;
      this._children = [];
    }
  }

  private loadPolygon(config) {
    const child = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    child.setAttribute('points', config.coordinates);
    this.loadStyles(child);
    child.addEventListener('click', () => {
      this.onClick(child, config);
    });
    this._children.push(child);

    this._overlay.node().appendChild(child);
  }

  private loadCircle(config) {
    const child = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const [cx, cy, r] = config.coordinates.split(',');
    child.setAttribute('cx', cx);
    child.setAttribute('cy', cy);
    child.setAttribute('r', r);
    this.loadStyles(child);
    child.addEventListener('click', () => {
      this.onClick(child, config);
    });
    this._children.push(child);

    this._overlay.node().appendChild(child);
  }

  private onClick(child, config) {
    if (config.action === 'url' && config['action-url-url']) {
      document.location.href = config['action-url-url'];
      return;
    }
    this.setSelected(child);
    this._overlayEvents$.next({
      type: 'click',
      payload: config
    });
  }

  private setSelected(selectedChild) {
    // reset
    this.resetStyles();

    // selected styles
    this.loadStyles(selectedChild, this._selectedStylesDefaults);
  }

  private loadStyles(child, selectedStyles?) {
    const currentConfig = this._config.overlay_images[this._page];
    const styles = {
      ...this._stylesDefaults,
      ...(currentConfig?.style || {})
    };
    child.setAttribute('fill', styles.highlight_color);
    child.setAttribute('stroke', selectedStyles?.border_color || styles.border_color);
    child.setAttribute('stroke-width', selectedStyles?.border_width || styles.border_width);
    child.setAttribute('style', `
      fill-opacity: ${styles.highlight_opacity}; 
      stroke-opacity: ${selectedStyles?.border_opacity || styles.border_opacity};
    `);
  }
}
