import { DataSource } from '@n7-frontend/core';
import tippy from 'tippy.js';

export class AwHomeFacetsWrapperDS extends DataSource {
  private autoComplete = {}; // autocomplete data for each facet
  public lockedFacets = {}   // locked means that the eye cannot be closed
  public lastData = {}       // store the last response so the component can be rendered again with the same data
  public closedEyes = []     // list of closed eyes
  public openTippy = ''      // tipe of entity of the currently open tippy

  protected transform(data) {
    this.lastData = data
    const headers: any[] = [];
    const inputs: any[] = [];
    const facetData = data
    const lockedFacets = this.lockedFacets // locked means that the eye cannot be closed
    const closedEyes = this.closedEyes     // list of closed eyes


    console.log('lockedFacets', this.lockedFacets)
    console.log('closedEyes', this.closedEyes)
    // when facet data changes, destroy every tippy and reset autocomplete data.
    Object.keys(this.autoComplete).forEach(id => {
      if (this.autoComplete[id] && this.autoComplete[id].tippy) {
        this.autoComplete[id].tippy.destroy() // destroy
      }
    })
    this.autoComplete = {} // reset data

    facetData.forEach((facet, j) => {
      /*
       For each facet on back-end, push a header-component
       and a facet-component (search input only) to each array.
       ---//---
       # LOGIC:
       Each facet can be "locked" or "enabled".
       if a facet is locked, it means that it cannot be enabled or disabled.
       if a facet is enabled or disabled it means that the filter is active or inactive.

       there are 2 ways that a facet can be "locked"
         1. When a bubble of the same type is selected in the chart
         2. When that facet is the only enabled facet

       The first case is managed by pushing the selected bubble's ID to the corresponding array
       of lockedFacets.
       The second case is managed by pushing a "LOCK_LAST" string to the lockedFacets array of the last
       enabled facet.
      */
      Object.keys(lockedFacets).forEach(key => {
        // clear all locked facets arrays from "LOCK_LAST" values (reset all locks)
        let index = lockedFacets[key].indexOf('LOCK_LAST')
        if (index >= 0) {
          lockedFacets[key].splice(index, 1)
        }
      })
      if (closedEyes) {
        if (closedEyes.length == facetData.length - 1) {
          let lastFacet = facetData.find(f => !closedEyes.includes(f.type.replace(/ /g, '-')))
          if (lastFacet) {
            if (closedEyes[lastFacet.type]) {
              lockedFacets[lastFacet.type].push('LOCK_LAST')
            } else {
              lockedFacets[lastFacet.type] = ['LOCK_LAST']
            }
          }
        }
        if (closedEyes.includes(facet.type.replace(/ /g, '-'))) { // check if the eyes are open
          facet.enabled = false;
        } else {
          facet.enabled = true;
        }
      }
      if (Object.keys(lockedFacets).length) { // check if bubble chart wants to lock this facet
        if (lockedFacets[facet.type] && lockedFacets[facet.type].length > 0) {
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
            : ' not-blocked'),
        payload: facet.locked === true ? null : facet.type.replace(/ /g, '-')
      });
      // make array of inputs data
      inputs.push({
        sections: [
          {
            inputs: [
              {
                id: `${facet.type.replace(/ /g, '-')}-${j}`,
                type: 'text',
                placeholder: facet['input-placeholder'],
                icon: 'n7-icon-search',
                disabled: !facet.enabled,
                inputPayload: String(facet.type.replace(/ /g, '-')) + '-search',
                iconPayload: String(facet.type.replace(/ /g, '-')) + '-search',
                enterPayload: String(facet.type.replace(/ /g, '-')) + '-search',
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
    /*
      Builds or updates Tippy for the input in use (id)
    */
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
          'aw-simple-autocomplete__template'
        )[0];
        contentNode.setAttribute('style', 'display: block');
        return contentNode;
      }

      if (!ac.tippy) {
        const target = document.getElementsByClassName(id)[1]; // target the correct this.autoComplete[id] input class
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
        }); // attach tippy to input type text
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