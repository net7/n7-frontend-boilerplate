import { DataSource } from '@n7-frontend/core';

export class AwAutocompleteWrapperDS extends DataSource {
  protected transform(data) {
    const { response } = data;

    if (!response) {
      return { suggestion: [], loading: true };
    }

    const suggestion = [];
    const { config } = this.options;
    const maxLength = (config.get('home-layout')['max-item-length'] || 20);
    const fResults = response.results.filter((el) => typeof el.entity === 'object');

    // eslint-disable-next-line consistent-return
    fResults.forEach((el) => {
      if (el.entity.id === 'fallback') { // build and return fallback data
        suggestion.push({
          text: el.entity.label,
          payload: 'fallback-simple-autocomplete',
        });
        return { suggestion };
      }
      const text = this.stringTrim(el.entity.label, maxLength);
      suggestion.push({
        text,
        anchor: {
          payload: el.entity.id,
        },
      });
    });
    return { suggestion };
  }

  /**
   * Given a string, it trims it to the specified length.
   *
   * @param string an input string
   * @param limit character limit
   * @returns the resulting trimmed string
   */
  private stringTrim = (string, limit) => {
    if (string.length > limit) {
      return `${string.slice(0, limit)}…`;
    } return string;
  }
}
