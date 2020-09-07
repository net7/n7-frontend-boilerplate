import { MrInputSchema } from '../interfaces/search.interface';

const hasValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!value;
};

export default {
  stateToQueryParams(state, schemas: { [key: string]: MrInputSchema }) {
    const queryParams = {};

    Object.keys(state).forEach((key) => {
      const schema = schemas[key];
      const { multiple, valueType } = schema;
      const value = state[key];
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
