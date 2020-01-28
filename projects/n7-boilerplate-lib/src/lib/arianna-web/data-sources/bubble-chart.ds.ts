import { DataSource } from '@n7-frontend/core';
import tippy, { createSingleton } from 'tippy.js';
import helpers from 'n7-boilerplate-lib/lib/common/helpers';
import { Subject, config } from 'rxjs';

export class AwBubbleChartDS extends DataSource {
  public chartData: any = []         // data rendered into the graph
  public draw: any = null;           // exposed component draw function to update the view
  public selected: string[] = []     // list of selected bubbles
  public filters: any[] = []         // list of active filters to show only some TypeOfEntity(s)
  public closedEyes: any[] = []      // array of the activated eye filters 
  public tippyList: any[] = []       // list of tippy instances

  protected transform(data) {
    const { config, smallChartSize } = this.options
    const { fontRendering, transition, shuffle } = config.get('bubble-chart')
    const domain = [], range = []
    const colorConfig = config.get('config-keys')

    Object.keys(colorConfig).forEach(k => {
      domain.push(k.replace(/-/g, ' '))
      range.push(((colorConfig[k] || {}).color || {}).hex)
    })

    const commonParams = {
      containerId: 'bubbleChartContainer',
      setDraw: draw => this.draw = draw,
      colorMatch: { domain, range },
      selected: this.selected,
      sizeRange: [.5, 500],
      fontRendering,
      height: 500,
      width: 500,
      transition,
      shuffle,
    }
    /*
    Two data streams are ouputted.
    The default stream is for the normal visualization,
    "smallView" is used for a compressed view of the same data.
    */
   return {
     ...commonParams,
      anchorData: { href: '/placeholder/' },
      data: this.smartSlice(data),
      smallView: {
        ...commonParams,
        data: this.smartSlice(data, smallChartSize),
      },
    }
  }

  updateChart = res => {
    /*
      Redraws the graph with the incoming data.
      "res" should be Apollo's "response.entitiesData".
      When res is passed as null, the chart is rendered with the previous data.
    */
    if (res === null) {
      res = this.chartData
    } else {
      this.chartData = res
    }
    if (this.filters.length > 0) { // apply filters to the response
      res = this.chartData.filter(el => !this.filters.includes(el.entity.typeOfEntity.replace(/ /g, '-')))
    }
    if (!this.draw) {
      this.update(this.smartSlice(res)) // component self-update
    } else {
      this.output.selected = this.selected;
      this.output.data = this.smartSlice(res);
      this.output.smallView.data = this.smartSlice(res, this.options.smallChartSize);
      this.draw()
    }
  }

  smartSlice = (d, length?) => {
    const l = length ? length : this.options.limit
    if (l && l < d.length) {
      return d.slice(0, l)
    } else {
      return d
    }
  }

  handleBubbleClick = payload => {
    /*
      Toggles the selection of the clicked bubble.
    */
    const id = payload
    if (this.selected.includes(id)) {
      this.selected.splice(this.selected.indexOf(id), 1) // remove selection
    } else {
      this.selected.push(id) // add selection
    }
  }
}