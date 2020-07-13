import { EventHandler } from '@n7-frontend/core';
import tippy from 'tippy.js';

export class AwChartTippyEH extends EventHandler {
  private tippyList: any[] = [] // array of tippy instances

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-chart-tippy.select':
          this.emitOuter('select', payload);
          break;
        default:
          console.warn('(chart-tippy) unhandled inner event of type', type);
          break;
      }
    });
    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-layout.d3end':
        case 'aw-entita-layout.d3end':
        case 'aw-scheda-layout.d3end':
          this.dataSource.update(payload); // creating DOM Elements (templates)
          setTimeout(() => { // wait DOM to be ready
            this.tippyMaker(payload.bubbles); // assign templates to the bubbles
          });
          break;
        default:
          break;
      }
    });
  }

  tippyMaker = (bubbles) => {
    /*
      Destroys every existing tooltip,
      then creates a new Tippy instance for each bubble.
    */
    // flush existing tooltips
    this.tippyList.forEach((t) => { if (t) { t.destroy(); } });
    this.tippyList = [];
    // create new tooltips
    bubbles.forEach((b) => { // give a tooltip to each bubble
      const target: Element = document.getElementById(`g_${b.entity.id}`);
      if (target) {
        this.tippyList.push( // add this tippy to the array of instances
          tippy(target, {
            content: document.getElementById(`template__${b.entity.id}`),
            interactive: true,
            appendTo: document.body, // suppress interactive warning
            arrow: true,
            flip: false,
            theme: 'light-border no-padding',
            placement: 'top',
            delay: 150,
            updateDuration: 400,
          }),
        );
      }
    });
  }
}
