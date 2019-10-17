import { DataSource } from '@n7-frontend/core';
import tippy from "tippy.js";

export class AwHomeFacetsWrapperDS extends DataSource {

  private autoComplete = {}

  protected transform(data) {
    var headers: any[] = [];
    var inputs: any[] = [];

    data.forEach(facet => {
      /*
       For each facet on back-end, push a header-component
       and a facet-component (search input only) to each array.
       */

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
        data: [],         // array of suggestions
        tippy: undefined, // tippy data / config
        open: true,       // show or hide tippy
      }
    }
    // bind this autocomplete data to ac
    const ac = this.autoComplete[id]
    // get the template for this facet, and cast from 'Element' to 'HTMLElement'
    // necessary to change style prop
    const template = <HTMLElement>document.getElementsByClassName('aw-simple-autocomplete__' + id.replace('-search', ''))[0]
    template.style.display = 'block'
    if (!ac.tippy) {
      const target = '.' + id; // target the correct facet input class
      ac.tippy = tippy(target, {
        content: template,
        trigger: 'manual',
        interactive: true,
        arrow: false,
        appendTo: 'parent',
        theme: 'light-border',
        placement: 'bottom-start',
        maxWidth: '100%',
        onHidden: () => ac.open = false,
      })[0];
    }

    if (res.totalCount > 0) {
      ac.tippy.show()
    } else {
      ac.tippy.hide()
    }
  }

}