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
    if (data.response && data.response.entitiesData) {
      this.chartData = data.response.entitiesData
    }
    return {
      containerId: 'bubbleChartContainer',
      width: 500,
      height: 500,
      transition: 750,
      sizeRange: [.5, 500],
      selected: this.selected,
      colorMatch: {
        domain: ['persona', 'luogo', 'organizzazione', 'cosa notevole'],
        range: ['#4d8df3', '#f2d04c', '#c99245', '#6cb286']
      },
      data: this.chartData,
      setDraw: draw => this.draw = draw
    }
  }

  updateChart = res => {
    /*
      Redraws the graph with the incoming data.
      "res" should be Apollo's "response.entitiesData"
    */
    if (res) {
      this.chartData = res
    } else if (res === null) {
      res = this.chartData
    }
    if (this.filters.length > 0) { // apply filters to the response before redrawing the graph
      res = this.chartData.filter(el => !this.filters.includes(el.entity.typeOfEntity.replace(/ /g, '-')))
    }
    if (!this.draw) {
      this.update(res) // component self-update
    } else {
      this.output.data = res;
      this.output.selected = this.selected;
      this.draw()
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
      let el = document.getElementById(b.entity.id).parentElement // selects a <g> element
      this.tippyList.push( // add this tippy to the array of instances
        tippy(el, {
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