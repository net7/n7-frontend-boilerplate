import { MrInputSchema } from '../interfaces/search.interface';

const hasValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!(value || value === 0);
};

export default {
  stateToQueryParams(state, schemas: { [key: string]: MrInputSchema }) {
    const queryParams = {};

    Object.keys(state).forEach((key) => {
      const schema = schemas[key];
      const { multiple, valueType } = schema;
      const value = state[key];
      if (hasValue(value)) {
        let encodedValue;
        switch (valueType) {
          case 'number':
            queryParams[key] = multiple ? value.join(',') : value;
            break;
          case 'string':
            if (Array.isArray(value)) {
              encodedValue = value.map((element) => element.replace(/,/g, '%2c'));
            } else {
              encodedValue = value.replace(/,/g, '%2c');
            }
            queryParams[key] = multiple ? encodedValue.join(',') : encodedValue;
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
  queryParamsToState(queryParams, schemas: { [key: string]: MrInputSchema }) {
    const state = {};

    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      const schema = schemas[key];
      const { multiple, valueType } = schema;
      if (hasValue(value)) {
        if (hasValue(value)) {
          switch (valueType) {
            case 'number':
              state[key] = multiple ? value.split(',').map((v) => +v) : +value;
              break;

            case 'string':
              state[key] = multiple ? value.split(',').map((v) => `${v.replace(/%2c/g, ',')}`) : `${value.replace(/%2c/g, ',')}`;
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
