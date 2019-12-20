import { FacetInput } from './facet-input';

export class FacetInputLink extends FacetInput {
  private facetValue: string | string[];

  protected transform() {
    const facetId = this.getFacetId();

    const results: any[] = this.data.map(({ label, value, counter, hidden, options }) => {
      // normalize value
      value = '' + value;
      options = options || {};

      const classes = [];
      if (options.classes) { classes.push(options.classes); }
      if (hidden) { classes.push('is-hidden'); }
      if (this._isActive(this.facetValue, value)) { classes.push('is-active'); }

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

    // empty state control
    const itemEmpty = results.filter(item => item.id === 'empty')[0];
    if (this.isEmpty) {
      if (itemEmpty) {
        itemEmpty.classes = 'empty-text-link';
      } else {
        const { label } = this.getConfig().emptyState,
          emptyId = 'empty-link';
        results.push({
          type: 'link',
          id: emptyId,
          text: label,
          classes: 'empty-text-link',
          _meta: { facetId: emptyId, value: null }
        });
      }
    } else if (itemEmpty) {
      itemEmpty.classes = 'empty-text-link is-hidden';
    }

    return results;
  }

  public setActive(facetValue) {
    this.output.forEach(config => {
      const isActive = this._isActive(facetValue, config._meta.value);
      let classes = config.classes ? config.classes.split(' ') : [];
      if (!isActive) {
        classes = classes.filter(className => className !== 'is-active');
      } else if (classes.indexOf('is-active') === -1) {
        classes.push('is-active');
      }
      config.classes = classes.join(' ');
    });
  }

  private _isActive(facetValue, value) {
    this.facetValue = facetValue;

    return (
      (Array.isArray(facetValue) && facetValue.indexOf(value) !== -1) ||
      (facetValue === value)
    );
  }
}
