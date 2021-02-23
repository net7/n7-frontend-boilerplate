export default {
  title: 'Ricerca avanzata',
  resultsUrl: '/advanced-results',
  formConfig: {
    groups: [
      {
        id: 'group-1',
        sections: ['section-1', 'section-1-2'],
        classes: 'form-group-1',
        options: {
          label: 'Dati bibliografici (gruppo di campi)',
          isOpen: true
        }
      }, {
        id: 'group-2',
        sections: ['section-2'],
        classes: 'form-group-2',
        options: {
          label: 'Processo di composizione'
        }
      },
      {
        id: 'group-3',
        sections: ['section-3'],
        classes: 'form-group-3',
        options: {
          label: 'Contenuto'
        }
      }
    ],
    sections: [
      {
        id: 'section-1',
        title: 'Titolo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        advancedSection: true,
        inputs: [{
          id: 'query',
          type: 'text',
          data: {
            id: 'query',
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
          id: 'author',
          type: 'text',
          data: {
            id: 'author',
            label: 'AUTHOR',
            placeholder: 'Cerca tra gli autori...',
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
            disabled: false,
            hidden: false
          }
        }
        ]
      },
      {
        id: 'section-1-2',
        inputs: [
          {
            id: 'query',
            type: 'text',
            data: {
              id: 'query',
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
            id: 'author',
            type: 'text',
            data: {
              id: 'author',
              label: 'AUTHOR',
              placeholder: 'Cerca tra gli autori...',
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
          }

        ]
      },
      {
        id: 'section-2',
        inputs: [
          {
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
              disabled: false,
              hidden: false
            }
          },
          /* {
            id: 'input-3',
            type: 'tag',
            data: {
              label: 'label: ',
              text: 'text',
              icon: 'n7-icon-close',
              payload: {
                value: 'tag value!'
              }
            }
          } */
        ]
      },
      {
        id: 'section-3',
        title: 'Contenuto',
        inputs: [
          {
            id: 'input-31',
            type: 'text',
            data: {
              id: 'input-31',
              label: 'Trascrizione',
              placeholder: 'Cerca nel testo...',
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
          },
          {
            id: 'select-31',
            type: 'select',
            data: {
              id: 'select-31',
              label: 'Dove cercare',
              payload: 'select-1-payload',
              options: [{
                value: 'note',
                label: 'note',
                disabled: false
              }, {
                value: 'apparato',
                label: 'apparato',
                disabled: false
              }, {
                value: 'tutto',
                label: 'tutto',
                disabled: false
              }]
            },
            state: {
              value: null,
              disabled: false,
              hidden: false
            }
          }
          /* {
            id: 'input-3',
            type: 'tag',
            data: {
              label: 'label: ',
              text: 'text',
              icon: 'n7-icon-close',
              payload: {
                value: 'tag value!'
              }
            }
          } */
        ]
      }
    ]

  }
};
