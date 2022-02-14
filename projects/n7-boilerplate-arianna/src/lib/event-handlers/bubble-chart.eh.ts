import { EventHandler } from '@net7/core';

export class AwBubbleChartEH extends EventHandler {
  public initialLoad = false;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-bubble-chart.click':
          if (this.dataSource.options.selectable !== false) {
            this.toggleSelection(payload);
          }
          this.emitOuter('lockfilter', this.dataSource.chartData.find((el) => payload === el.entity.id));
          break;
        case 'aw-bubble-chart.d3end': { // end of d3.js draw()
          let filteredChartData;
          // apply filters to the data before adding tooltips
          if (this.dataSource.filters.length > 0) {
            filteredChartData = this.dataSource.chartData.filter((el) => !this.dataSource.filters.includes(el.entity.typeOfEntity.replace(/ /g, '-')));
          } else {
            filteredChartData = this.dataSource.chartData;
          }
          this.emitOuter('d3end', {
            bubbles: this.dataSource.smartSlice(filteredChartData),
            selected: this.dataSource.selected,
          });
        } break;
        default:
          console.warn('unhandled inner event of type', type, 'with payload', payload);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-layout.select': {
          const { id } = payload;
          this.toggleSelection(id);
          const foundBubble = this.dataSource.chartData.find((el) => id === el.entity.id);
          if (foundBubble) {
            this.emitOuter('lockfilter', foundBubble);
          } else {
            console.warn('Unable to determine which bubble was selected.');
          }
        } break;
        case 'aw-home-layout.tagclick':
          this.toggleSelection(payload);
          break;
        case 'aw-home-layout.facetclick':
          if (!this.dataSource.selected.includes(payload)) {
            this.toggleSelection(payload);
          }
          break;
        case 'aw-home-layout.togglefilter':
          this.toggleFilter(payload);
          break;
        case 'aw-home-layout.clearselection':
          this.dataSource.selected = [];
          this.emitOuter('selection', []);
          break;
        case 'aw-entita-layout.filterbubbleresponse':
        case 'aw-home-layout.filterbubbleresponse':
          this.dataSource.updateChart(payload);
          break;
        default:
          break;
      }
    });
  }

  toggleSelection = (id) => {
    /*
      Expects the ID of a bubble.
      Updates the graph with a new request
    */
    this.dataSource.handleBubbleClick(id);
    this.emitOuter('selection', this.dataSource.selected);
  }

  toggleFilter = (f) => {
    /*
      Toggle the clicked eye-filter in the filteres array and
      redraw the graph.
    */
    if (this.dataSource.filters.includes(f)) {
      this.dataSource.filters.splice(this.dataSource.filters.indexOf(f), 1);
    } else {
      this.dataSource.filters.push(f);
    }
    this.dataSource.updateChart(null); // null means "reuse the last response"
  }
}
