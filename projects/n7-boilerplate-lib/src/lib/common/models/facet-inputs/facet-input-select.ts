import { FacetInput } from './facet-input';

export class FacetInputSelect extends FacetInput {
  protected transform() {
    const facetId = this.getFacetId();

    return {
      type: 'select',
      id: this.getId(),
      label: this.config.label,
      disabled: this.config.disabled,
      options: this.data ? this.data.map(({ value, label }) => ({
        // normalize value
        value: `${value}`,
        label,
      })) : [],
      payload: {
        facetId,
        source: 'input-select',
      },
      _meta: { facetId },
    };
  }

  public setActive(facetValue) {
    this.output.options
      .filter((option) => option.value === facetValue)
      .forEach((option) => { option.selected = true; });
  }
}
