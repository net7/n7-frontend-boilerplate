export default {
  title: 'Ricerca avanzata',
  formConfig: {
    groups: [{
      id: 'group-1',
      sections: ['section-1'],
      classes: 'form-group-1',
      options: {
        label: 'Group 1'
      }
    }, {
      id: 'group-2',
      sections: ['section-2'],
      classes: 'form-group-2',
      options: {
        label: 'Group 2...'
      }
    }],
    sections: [{
      id: 'section-1',
      title: '__Section 1__',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      inputs: [{
        id: 'input-1',
        type: 'text',
        data: {
          id: 'input-1',
          label: 'QUERY',
          placeholder: 'Cerca in tutti i campi...',
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
          checkboxes: [1, 2, 3, 4].map((number) => ({
            label: `check ${number}`,
            payload: number,
          }))
        },
        state: {
          value: [3, 4],
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
            label: 'Italia',
            disabled: false
          }, {
            value: 'germania',
            label: 'Germania',
            disabled: false
          }, {
            value: 'francia',
            label: 'Francia',
            disabled: true
          }]
        },
        state: {
          value: null,
          disabled: true,
          hidden: false
        }
      }]
    }, {
      id: 'section-2',
      inputs: [{
        id: 'input-2',
        type: 'text',
        data: {
          id: 'input-2',
          label: 'AUTHORS',
          placeholder: 'Cerca tra gli autori...',
          icon: 'n7-icon-search',
          inputPayload: 'search-input',
          enterPayload: 'search-enter',
          iconPayload: 'search-icon',
        },
        state: {
          value: 'in attesa del campo padre',
          disabled: true,
          hidden: false
        }
      }, /* {
        id: 'input-3',
        type: 'tag',
        data: {
          label: 'label: ',
          text: 'text',
          icon: 'n7-icon-close',
          payload: {
            value: 'tag value!'
          },
        }
      } */]
    }]
  }
};
