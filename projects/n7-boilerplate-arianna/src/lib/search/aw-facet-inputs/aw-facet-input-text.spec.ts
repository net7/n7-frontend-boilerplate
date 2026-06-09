import { AwFacetInputText } from './aw-facet-input-text';

describe('AwFacetInputText validation', () => {
  // Mirror of the date facet rule in search-facets.config.ts, itself a
  // mirror of the backend graphql/datasources/date-utils.ts rules.
  const pattern = /^(\d{1,4}|\d{1,4}-\d{2}-\d{2}|\d{7,8})$/;
  const message = 'Formato data non valido';

  const make = (validation?) => {
    const input = new AwFacetInputText({
      type: 'text',
      facetId: 'date-from',
      validation,
      filterConfig: {},
    });
    input.update(); // build the output object that validate() mutates
    return input;
  };

  describe('isValid (pure check)', () => {
    it('accepts a year ([AAA]A)', () => {
      expect(make({ pattern, message }).isValid('1900')).toBe(true);
    });

    it('accepts a full ISO-like date ([AAA]A-MM-GG)', () => {
      expect(make({ pattern, message }).isValid('1999-12-31')).toBe(true);
    });

    it('accepts a 7-8 digit numeric date', () => {
      const input = make({ pattern, message });
      expect(input.isValid('18500101')).toBe(true);
      expect(input.isValid('8500101')).toBe(true);
    });

    it('treats empty / null as valid', () => {
      const input = make({ pattern, message });
      expect(input.isValid('')).toBe(true);
      expect(input.isValid('   ')).toBe(true);
      expect(input.isValid(null)).toBe(true);
    });

    it('rejects malformed input', () => {
      const input = make({ pattern, message });
      expect(input.isValid('1840-0102')).toBe(false);
      expect(input.isValid('18xx')).toBe(false);
      expect(input.isValid('1999-13-31x')).toBe(false);
    });

    it('is always valid when no validation is configured', () => {
      expect(make().isValid('anything')).toBe(true);
    });
  });

  describe('validate (reflects state on the output)', () => {
    it('sets error + message for invalid input', () => {
      const input = make({ pattern, message });
      expect(input.validate('18xx')).toBe(false);
      expect(input.getOutput().error).toBe(true);
      expect(input.getOutput().errorMessage).toBe(message);
    });

    it('clears error + message when the value becomes valid', () => {
      const input = make({ pattern, message });
      input.validate('18xx');
      expect(input.validate('1900')).toBe(true);
      expect(input.getOutput().error).toBe(false);
      expect(input.getOutput().errorMessage).toBeNull();
    });

    it('does not touch the output when no validation is configured', () => {
      const input = make();
      expect(input.validate('18xx')).toBe(true);
      expect(input.getOutput().error).toBeUndefined();
    });
  });
});
