import { FacetInput } from './facet-input';

export class FacetInputCheckbox extends FacetInput {

  public setInputConfig(){
    const facetId = this.getFacetId();
      
    this.inputConfig = this.data.map(({ label, value }, index) => {
      // normalize value
      value = '' + value;
      return {
        type: 'checkbox', 
        id: this.getId() + '-' + index, 
        label: label, 
        payload: {
          facetId,
          source: 'input-checkbox',
          value
        }, 
        _meta: {
          facetId: facetId,
          value
        } 
      }
    });
  }

  public setActive(facetValue){
    const { isArray } = this.config;

    this.inputConfig.forEach(config => {
      if(isArray && Array.isArray(facetValue) && facetValue.indexOf(config._meta.value) !== -1){
        config.checked = true;
      } else if(facetValue === config._meta.value) {
        config.checked = true;
      } else {
        config.checked = false;
      }
    });
  }
  
}