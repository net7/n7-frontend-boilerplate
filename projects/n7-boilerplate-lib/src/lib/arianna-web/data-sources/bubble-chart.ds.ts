import { DataSource } from '@n7-frontend/core';
import tippy, { createSingleton } from 'tippy.js';

export class AwBubbleChartDS extends DataSource {
  public chartData: any = []      // data rendered into the graph
  public draw: any = null;        // exposed component draw function to update the view
  public selected: string[] = []  // list of selected bubbles
  public filters: any[] = []      // list of active filters to show only some TypeOfEntity(s)
  public closedEyes: any[] = []
  public tippyList: any[] = []    // list of tippy instances
  public focusedBubble: string    // id of the focused bubble

  protected transform(data) {
    const { config } = this.options
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
      data: this.smartSlice(data),
      smallView: {
        ...commonParams,
        data: this.smartSlice(data, this.options.smallChartSize),
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

  tippyMaker = bubbles => {
    // flush existing tooltips
    this.tippyList.forEach(t => { if (t) { t.destroy() } })
    this.tippyList = []

    const buildTooltip = bubble => {
      let element = <Element>document.getElementsByClassName('bubble-chart__tippy-template')[0].cloneNode(true)
      let gotoButton = element.getElementsByClassName('aw-bubble-popup-menu__text')[0]
      gotoButton.innerHTML =
        `È collegato a ${bubble.count} entità`
      element.getElementsByClassName('aw-bubble-popup-menu__title')[0].innerHTML =
        `${bubble.entity.label}`
      let selectButton = element.getElementsByClassName('aw-bubble-popup-menu__link')[1]
      if (this.options.simple) {
        if (selectButton) selectButton.remove()
      } else {
        let toggleBubbleText = this.selected.includes(bubble.entity.id) ? `Deseleziona` : `Seleziona`
        selectButton.innerHTML = toggleBubbleText
      }
      // console.log(element)
      return element.innerHTML
    }
    const focusBubble = id => {
      this.focusedBubble = id
    }

    if (this.filters.length > 0) { // apply filters to the data before adding tooltips
      bubbles = bubbles.filter(el => !this.filters.includes(el.entity.typeOfEntity.replace(/ /g, '-')))
    }
    // make new tooltips
    bubbles.forEach(b => {
      let el = document.getElementById(b.entity.id)
      let group = el ? el.parentElement : false // selects a <g> element
      if (group) {
        this.tippyList.push( // add this tippy to the array of instances
          tippy(group, {
            content: buildTooltip(b),
            interactive: true,
            appendTo: document.body, // suppress interactive warning
            arrow: true,
            flip: false,
            theme: 'light-border no-padding',
            placement: 'top',
            delay: [150, 30],
            updateDuration: 400,
            onMount() {
              focusBubble(b.entity.id)
            }
          })
        )
      }
    });

    // createSingleton(this.tippyList, {
    //   interactive: true,
    //   appendTo: document.body, // suppress interactive warning
    //   arrow: true,
    //   flip: false,
    //   theme: 'light-border no-padding',
    //   placement: 'top',
    //   delay: [150, 30],
    //   updateDuration: 400,
    // onTrigger(ref) {
    //   console.log({ref})
    //   console.log('fired')
    // }
    // })
  }
}