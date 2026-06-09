import { helpers } from '@net7/boilerplate-common';
import { AwFacetInput } from './aw-facet-input';

export class AwFacetInputText extends AwFacetInput {
  protected transform() {
    const facetId = this.getFacetId();
    const payload = {
      facetId,
      source: 'input-text',
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
        trigger: 'input',
      },
      enterPayload: {
        ...payload,
        trigger: 'enter',
      },
      iconPayload: {
        ...payload,
        trigger: 'icon',
      },
      blurPayload: {
        ...payload,
        trigger: 'blur',
      },
      _meta: { facetId },
    };
  }

  public setActive(facetValue) {
    this.output.value = helpers.unescapeQuotes(facetValue) || null;
  }
}
