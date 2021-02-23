export default {
  title: 'Ricerca avanzata',
  resultsUrl: '/advanced-results',
  formConfig: {
    submitButton: {
      label: 'advancedsearch#submit',
    },
    resetButton: {
      label: 'advancedsearch#reset',
    },
    groups: [{
      id: 'group-1',
      sections: ['section-1'],
      classes: 'form-group-1',
      options: {
        label: '',
        isOpen: true
      }
    }],
    sections: [{
      id: 'section-1',
      title: 'advancedsearch#section1_title',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      inputs: [{
        id: 'query',
        type: 'text',
        data: {
          id: 'query',
          label: 'advancedsearch#query_label',
          placeholder: 'advancedsearch#query_placeholder',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon',
        },
        state: {
          value: '',
          disabled: false,
          hidden: false
        }
      }, {
        id: 'author',
        type: 'text',
        data: {
          id: 'author',
          label: 'advancedsearch#author_label',
          placeholder: 'advancedsearch#author_placeholder',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon',
        },
        state: {
          value: '',
          disabled: false,
          hidden: false
        }
      }, {
        id: 'checkbox-1',
        type: 'checkbox',
        data: {
          id: 'checkbox-1',
          checkboxes: [{
            label: 'advancedsearch#test_checkbox_1',
            payload: 1,
          }, {
            label: 'advancedsearch#test_checkbox_2',
            payload: 2,
          }]
        },
        state: {
          value: [1],
          disabled: false,
          hidden: false
        }
      }, {
        id: 'select-1',
        type: 'select',
        data: {
          id: 'select-1',
          label: 'Paesi',
          payload: 'select-1-payload',
          options: [{
            value: 'italia',
            label: 'advancedsearch#test_select_italia',
            disabled: false
          }, {
            value: 'germania',
            label: 'advancedsearch#test_select_germania',
            disabled: false
          }, {
            value: 'francia',
            label: 'advancedsearch#test_select_francia',
            disabled: true
          }]
        },
        state: {
          value: null,
          disabled: false,
          hidden: false
        }
      }]
    }]
  }
};
