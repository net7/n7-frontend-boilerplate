import { FacetInput } from './facet-input';

export class FacetInputText extends FacetInput {

  protected transform() {
    const facetId = this.getFacetId();
    const payload = {
      facetId,
      source: 'input-text'
    };

    return {
      type: 'text',
      id: this.getId(),
      label: this.config.label,
      disabled: this.config.disabled,
      placeholder: this.config.placeholder,
      icon: this.config.icon,
      inputPayload: {
        ...payload,
        trigger: 'input'
      },
      enterPayload: {
        ...payload,
        trigger: 'enter'
      },
      iconPayload: {
        ...payload,
        trigger: 'icon'
      },
      _meta: { facetId }
    };
  }

  public setActive(facetValue) {
    this.output.value = facetValue || null;
  }
}
