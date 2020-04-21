type QueryParams = {
  [key: string]: string;
}

type StateObject = {
  [key: string]: string | string[];
}

const hasValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!value;
};

export default {
  stateToQueryParams(state: StateObject): QueryParams {
    const queryParams = {} as QueryParams;

    Object.keys(state).forEach((key) => {
      const value = state[key];
      if (hasValue(value)) {
        queryParams[key] = Array.isArray(value) ? value.join(',') : value;
      }
    });
    return queryParams;
  },
  queryParamsToState(queryParams: QueryParams): StateObject {
    const state = {} as StateObject;

    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      if (hasValue(value)) {
        state[key] = value.indexOf(',') !== -1 ? value.split(',') : value;
      }
    });
    return state;
  }
};
