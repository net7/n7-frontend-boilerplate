import { DataSource } from '@n7-frontend/core';
import tippy from 'tippy.js';

export class AwHomeFacetsWrapperDS extends DataSource {
  private autoComplete = {};

  protected transform({ facetData, lockedFacets }) {
    const headers: any[] = [];
    const inputs: any[] = [];

    // when facet data changes, destroy every tippy and reset autocomplete data.
    Object.keys(this.autoComplete).forEach( id => {
      if (this.autoComplete[id] && this.autoComplete[id].tippy) {
        this.autoComplete[id].tippy.destroy()
      }
    })
    this.autoComplete = {} // reset

    facetData.forEach(facet => {
      /*
       For each facet on back-end, push a header-component
       and a facet-component (search input only) to each array.
       */
      if (Object.keys(lockedFacets).length) {
        if (lockedFacets[facet.type]) {
          // if bubble chart say lock this facet, lock it
          facet.locked = true;
        } else {
          facet.locked = false;
        }
      }

      const headerClasses = [];
      const iconClasses = [facet.icon];
      if (!facet.enabled) { headerClasses.push('is-disabled'); }
      if (facet.configKey) {
        headerClasses.push(`color-${facet.configKey}`);
        iconClasses.push(`color-${facet.configKey}`);
      }
      // make array of headers data
      headers.push({
        iconLeft: iconClasses.join(' '),
        text: facet.label,
        additionalText: facet.count,
        iconRight: facet.enabled ? 'n7-icon-eye' : 'n7-icon-eye-slash',
        classes:
          headerClasses.join(' ') +
          (facet.locked
            ? ' is-blocked'
            : // if every other facet is disabled → Lock this facet
            facetData.every(f => {
              return !f.enabled || f.type === facet.type;
            })
              ? ' is-blocked'
              : ' not-blocked'),
        payload: facet.type.replace(/ /g, '-')
      });
      // make array of inputs data
      inputs.push({
        sections: [
          {
            inputs: [
              {
                type: 'text',
                placeholder: facet['input-placeholder'],
                icon: 'n7-icon-search',
                disabled: !facet.enabled,
                inputPayload: String(facet.type) + '-search',
                iconPayload: String(facet.type) + '-search',
                enterPayload: String(facet.type) + '-search',
                classes: String(facet.type.replace(' ', '-')) + '-search'
              }
            ]
          }
        ]
      });
    });
    // zipping arrays to render widgets with separate data (see home-layout.html)
    const widgetData: any[] = [];
    headers.map((h, i) => {
      widgetData.push({ header: h, input: inputs[i] });
    });
    return widgetData;
  }

  public tippyMaker = (res, id) => {
    id = id.replace(/ /g, '-')
    // create data for this facet
    if (!this.autoComplete[id]) {
      this.autoComplete[id] = {
        tippy: undefined, // tippy data / config
        open: true // show or hide tippy
      };
      const ac = this.autoComplete[id];
      const getContent = () => {
        const contentNode = document.getElementsByClassName(
          'aw-simple-autocomplete__' + id.replace(/-search/, '')
        )[0];
        contentNode.setAttribute('style', 'display: block');
        return contentNode;
      }

      if (!ac.tippy) {
        const target = '.' + id; // target the correct this.autoComplete[id] input class
        ac.tippy = tippy(target, {
          content: getContent(),
          trigger: 'manual',
          interactive: true,
          arrow: false,
          flip: false,
          appendTo: 'parent',
          theme: 'light-border aw-home__facet-tippy',
          placement: 'bottom-start',
          maxWidth: '100%',
        })[1]; // attach tippy to input type text
      }
    }

    const ac = this.autoComplete[id];
    if (res.results.length > 0 && ac.tippy) {
      ac.tippy.show();
    } else {
      ac.tippy.hide();
    }
  }
}
