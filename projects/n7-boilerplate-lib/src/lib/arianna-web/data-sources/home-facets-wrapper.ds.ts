import { DataSource } from '@n7-frontend/core';
import tippy from "tippy.js";

export class AwHomeFacetsWrapperDS extends DataSource {

  private autoComplete = {}

  protected transform({facetData, lockedFacets}) {
    var headers: any[] = [];
    var inputs: any[] = [];

    facetData.forEach(facet => {
      /*
       For each facet on back-end, push a header-component
       and a facet-component (search input only) to each array.
       */
      if (lockedFacets[facet.type.id.replace('toe-', '')]) {
        // if bubble chart say lock this facet, lock it
        facet.locked = true
      } else {
        facet.locked = false
      }
      let headerClasses = [];
      let iconClasses = [facet.icon];
      if (!facet.enabled) headerClasses.push('is-disabled');
      if (facet.type.configKey) {
        headerClasses.push(`color-${facet.type.configKey}`);
        iconClasses.push(`color-${facet.type.configKey}`);
      }
      // make array of headers data
      headers.push({
        iconLeft: iconClasses.join(' '),
        text: facet.label,
        additionalText: facet.count,
        iconRight: (facet.enabled ? 'n7-icon-eye' : 'n7-icon-eye-slash'),
        classes: headerClasses.join(' ') + (facet.locked ? ' is-blocked' : ' not-blocked'),
        payload: facet.type.id,
      });
      // make array of inputs data
      inputs.push({
        sections: [{
          inputs: [{
            type: 'text',
            placeholder: facet['input-placeholder'],
            icon: 'n7-icon-search',
            disabled: !facet.enabled,
            inputPayload: String(facet.type.id) + '-search',
            iconPayload: String(facet.type.id) + '-search',
            enterPayload: String(facet.type.id) + '-search',
            classes: String(facet.type.id) + '-search',
          }]
        }]
      });
    });
    // zipping arrays to render widgets with separate data (see home-layout.html)
    var widgetData: any[] = []
    headers.map((h, i) => {
      widgetData.push({ header: h, input: inputs[i] })
    });
    return widgetData
  }

  public tippyMaker = (res, id) => {
    // create data for this facet
    if (!this.autoComplete[id]) {
      this.autoComplete[id] = {
        // data: [],         // array of suggestions
        template: undefined,
        tippy: undefined, // tippy data / config
        open: true,       // show or hide tippy
      }
      const ac = this.autoComplete[id]
      if (!ac.tippy) {
        const target = '.' + id; // target the correct this.autoComplete[id] input class
        ac.tippy = tippy(target, {
          content: '<span>Loading results</span>',
          trigger: 'manual',
          interactive: true,
          arrow: false,
          flip: false,
          appendTo: 'parent',
          theme: 'light-border aw-home__facet-tippy',
          placement: 'bottom-start',
          maxWidth: '100%',
          onHidden: () => {
            ac.open = false;
          },
          onShow: () => {
            let node = document.getElementsByClassName('aw-simple-autocomplete__' + id.replace('-search', ''))[0]
            // after I use this node, it becomes undefined
            if (node) { // if I have the node, don't try to get it again
              node.setAttribute('style', 'display: block');
              ac.tippy.setContent(node);
            }
          },
        })[0];
      }
    }

    let ac = this.autoComplete[id]
    if (res.totalCount > 0) {
      ac.tippy.show()
    } else {
      ac.tippy.hide()
    }
  }
}