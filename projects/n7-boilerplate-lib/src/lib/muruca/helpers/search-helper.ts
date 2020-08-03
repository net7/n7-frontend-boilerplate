import { InputSchema } from '../interfaces/search.interface';

const hasValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!value;
};

export default {
  stateToQueryParams(state, schemas: { [key: string]: InputSchema }) {
    const queryParams = {};

    Object.keys(state).forEach((key) => {
      const schema = schemas[key];
      const { multiple, valueType } = schema;

      let value = state[key];
      if (valueType === 'string') {
        if (multiple) {
          value = value.map((k) => k.replace(/,/g, '%2C'));
        }
      } // D%27Elia %252C %20 Pasquale
      if (hasValue(value)) {
        switch (valueType) {
          case 'number':
          case 'string':
            queryParams[key] = multiple ? value.join(',') : value;
            break;

          case 'boolean':
            queryParams[key] = multiple ? value.map((v) => +v).join(',') : +value;
            break;

          default:
            break;
        }
      }
    });
    return queryParams;
  },
  queryParamsToState(queryParams, schemas: { [key: string]: InputSchema }) {
    const state = {};

    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      const schema = schemas[key];
      const { multiple, valueType } = schema;
      if (hasValue(value)) {
        if (hasValue(value)) {
          switch (valueType) {
            // http://localhost:4200/maps?sort=sort_ASC&limit=12&authors=D%27Elia%5C%2C%20Pasquale&continents=Asia
            case 'number':
              state[key] = multiple ? value.split(',').map((v) => +v) : +value;
              break;

            case 'string':
              state[key] = multiple ? value.split(',').map((v) => `${v}`) : `${value}`;
              break;

            case 'boolean':
              state[key] = multiple ? value.split(',').map((v) => !!v) : !!value;
              break;

            default:
              break;
          }
        }
      }
    });
    return state;
  }
};
