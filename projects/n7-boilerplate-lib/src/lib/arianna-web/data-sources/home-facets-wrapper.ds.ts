import { DataSource } from '@n7-frontend/core';

export class AwHomeFacetsWrapperDS extends DataSource {

  protected transform(data) {
    var headers: any[] = []
    var inputs: any[] = []

    data.forEach(facet => {
      /**
       * For each facet on back-end, push a header-component
       * and a facet-component (search input only) to each array.
       */

      // make array of headers data
      headers.push({
        iconLeft: facet.type.icon,
        text: facet.type.label,
        additionalText: facet.count,
        iconRight: (facet.enabled ? 'n7-icon-eye' : 'n7-icon-eye-slash'),
        classes: (facet.enabled ? '' : 'is-disabled'),
        payload: facet.type.id,
      });
      // make array of inputs data
      inputs.push({
        input: {
          placeholder: 'Search',
          icon: 'n7-icon-search',
          // disable input if faced header is not enabled
          disabled: !facet.enabled,
          payload: String(facet.type.id) + '-search',
        }
      });
    });

    // zipping arrays to render widgets with separate data (see home-layout.html)
    var widgetData: any[] = []
    headers.map( (item, i) => {
      widgetData.push( { header: item, input: inputs[i] } )
    });
    return widgetData
  }

}