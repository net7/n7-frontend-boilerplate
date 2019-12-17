import { EventHandler } from '@n7-frontend/core';

export class AwBubbleChartEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-bubble-chart.click':
          this.toggleSelection(payload)
          this.emitOuter('lockfilter', this.dataSource.chartData.find(el => payload == el.entity.id))
          break;
        case 'aw-bubble-chart.d3end': // end of d3.js draw()
          this.dataSource.tippyMaker(this.dataSource.chartData) // make tooltips
          break;
        case 'aw-bubble-chart.bubble-tooltip-goto-click':
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${this.dataSource.focusedBubble}`]
          });
          break;
        case 'aw-bubble-chart.bubble-tooltip-select-click':
          this.toggleSelection(this.dataSource.focusedBubble)
          this.emitOuter('lockfilter', this.dataSource.chartData.find(el => this.dataSource.focusedBubble == el.entity.id))
          break;
        default:
          console.warn('unhandled inner event of type', type, 'with payload', payload)
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-layout.tagclick':
          this.toggleSelection(payload)
          break;
        case 'aw-home-layout.facetclick':
          this.toggleSelection(payload)
          break;
        case 'aw-home-layout.togglefilter':
          this.toggleFilter(payload)
          break;
        case 'aw-home-layout.clearselection':
          this.dataSource.selected = []
          this.emitOuter('selection', [])
          break;
        case 'aw-scheda-layout.filterbubbleresponse':
        case 'aw-entita-layout.filterbubbleresponse':
        case 'aw-home-layout.filterbubbleresponse':
          this.dataSource.updateChart(payload)
          break;
        default:
          break;
      }
    });
  }

  toggleSelection = id => {
    /*
      Expects the ID of a bubble.
      Updates the graph with a new request
    */
    this.dataSource.handleBubbleClick(id)
    this.emitOuter('selection', this.dataSource.selected)
  }

  toggleFilter = f => {
    /*
      Toggle the clicked filter in the filteres array and
      redraw the graph.
    */
    if (this.dataSource.filters.includes(f)) {
      this.dataSource.filters.splice(this.dataSource.filters.indexOf(f), 1)
    } else {
      this.dataSource.filters.push(f)
    }
    this.dataSource.updateChart(null) // null means "keep using the same response"
  }

}