import { FacetInput } from './facet-input';

export class FacetInputLink extends FacetInput {

  protected transform(){
    const facetId = this.getFacetId();
  
    return this.data.map(({ label, value, counter, hidden, options }) => {
      // normalize value
      value = '' + value;
      options = options || {};

      let classes = [];
      if(options.classes) classes.push(options.classes);
      if(hidden) classes.push('is-hidden');

      return { 
        type: 'link', 
        id: this.getId(), 
        text: label, 
        counter, 
        payload: {
          facetId,
          source: 'input-link',
          value
        },
        icon: options.icon || null,
        classes: classes.join(' '),
        _meta: { facetId, value } 
      };
    });
  }

  public setActive(facetValue){
    const { isArray } = this.config.filterConfig;

    this.output.forEach(config => {
      if(isArray && Array.isArray(facetValue) && facetValue.indexOf(config._meta.value) !== -1){
        config.classes = 'is-active';
      } else if(facetValue === config._meta.value) {
        config.classes = 'is-active';
      } else {
        config.classes = null;
      }
    });
  }
  
}