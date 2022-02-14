import { AwFacetInput } from './aw-facet-input';

export class AwFacetInputCheckbox extends AwFacetInput {
  protected transform() {
    const facetId = this.getFacetId();

    return this.data.map(({ label, value }, index) => ({
      type: 'checkbox',
      id: `${this.getId()}-${index}`,
      label,
      payload: {
        facetId,
        source: 'input-checkbox',
        value: `${value}`,
      },
      _meta: { facetId, value: `${value}` },
    }));
  }

  public setActive(facetValue) {
    const { isArray } = this.config.filterConfig;

    this.output.forEach((config) => {
      if (isArray && Array.isArray(facetValue) && facetValue.indexOf(config._meta.value) !== -1) {
        config.checked = true;
      } else if (facetValue === config._meta.value) {
        config.checked = true;
      } else {
        config.checked = false;
      }
    });
  }
}
