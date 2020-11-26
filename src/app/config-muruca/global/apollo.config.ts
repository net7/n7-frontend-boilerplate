export default {
  dummyRequest: {
    queryName: 'dummyRequest',
    queryBody: `
      {
        dummyRequest(__PARAMS__) {
          id,
          title
        }
      }
    `
  },
};
