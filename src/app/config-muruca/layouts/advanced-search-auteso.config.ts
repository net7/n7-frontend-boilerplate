// Advanced search per Metadata Dynamic Accordion (sls Theatheor/Auteso con mock resource)

import { ConfigMurucaAdvancedSearchLayout } from '@net7/boilerplate-muruca';

const config: ConfigMurucaAdvancedSearchLayout = {
  title: 'Búsqueda avanzada',
  resultsUrl: '/resultados',
  formConfig: {
    submitButton: {
      label: 'advancedsearch#submit',
    },
    resetButton: {
      label: 'advancedsearch#reset',
    },
    groups: [
      {
        id: 'general',
        sections: ['section-0'],
        classes: 'form-group-1',
        options: {
          label: 'advancedsearch#general_data',
          isOpen: true,
          showHeader: true
        }
      },
      {
        id: 'data-biblio',
        sections: ['section-1', 'section-2', 'section-3'],
        classes: 'form-group-1',
        options: {
          label: 'advancedsearch#bibliographical_data',
          isOpen: false,
          showHeader: true
        }
      },
      {
        id: 'data-codicological',
        sections: ['section-4'],
        classes: 'form-group-1',
        options: {
          label: 'advancedsearch#codicological_data',
          isOpen: false,
          showHeader: true
        }
      },
      {
        id: 'writing-process',
        sections: ['section-5', 'section-6'],
        classes: 'form-group-1',
        options: {
          label: 'advancedsearch#writing_process',
          isOpen: false,
          showHeader: true
        }
      }],
    sections: [
      {
        id: 'section-0',
        title: '',
        inputs: [
          {
            id: 'free-search',
            type: 'text',
            data: {
              id: 'free-search',
              label: 'advancedsearch#label_free_search',
              placeholder: '',
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
            id: 'query',
            type: 'text',
            data: {
              id: 'query',
              label: 'advancedsearch#label_title',
              placeholder: '',
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
              label: 'advancedsearch#label_author',
              placeholder: '',
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
        id: 'section-1',
        title: '',
        inputs: [{
          id: 'res_type',
          type: 'select',
          data: {
            id: 'res_type',
            label: 'advancedsearch#type_label',
            payload: '',
            options: [
              {
                value: '',
                label: '---',
                disabled: false
              },
              {
                value: 'auto-sacramental',
                label: 'advancedsearch#auto_sacramental',
                disabled: false
              },
              {
                value: 'comedia',
                label: 'advancedsearch#comedia',
                disabled: false
              },
              {
                value: 'comedia-fragmento',
                label: 'advancedsearch#comedia_fragmento',
                disabled: false
              },
              {
                value: 'dedicatoria',
                label: 'advancedsearch#dedicatoria',
                disabled: false
              },
            ]
          }
        }, {
          id: 'year',
          type: 'text',
          data: {
            id: 'year',
            label: 'advancedsearch#label_date',
            placeholder: '',
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
          id: 'date-range',
          type: 'select',
          data: {
            id: 'date-range',
            label: 'advancedsearch#label_date_range',
            payload: '',
            options: [
              {
                value: '',
                label: '---',
                disabled: false
              },
              {
                value: '-1',
                label: 'advancedsearch#fecha_undefined',
                disabled: false
              },
              {
                value: '<1590',
                label: 'advancedsearch#fecha_before1590',
                disabled: false
              },
              {
                value: '1590-1600',
                label: '1590-1600',
                disabled: false
              },
              {
                value: '1601-1610',
                label: '1601-1610',
                disabled: false
              },
              {
                value: '1611-1620',
                label: '1611-1620',
                disabled: false
              },
              {
                value: '1621-1630',
                label: '1621-1630',
                disabled: false
              },
              {
                value: '1631-1640',
                label: '1631-1640',
                disabled: false
              },
              {
                value: '1641-1650',
                label: '1641-1650',
                disabled: false
              },
              {
                value: '1651-1660',
                label: '1651-1660',
                disabled: false
              },
              {
                value: '>1661',
                label: 'advancedsearch#fecha_after1661',
                disabled: false
              }
            ]
          }
        }, {
          id: 'collocation',
          type: 'text',
          data: {
            id: 'collocation',
            label: 'advancedsearch#label_collocation',
            placeholder: '',
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
          id: 'source',
          type: 'text',
          data: {
            id: 'source',
            label: 'advancedsearch#label_source',
            placeholder: '',
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
        }, /* {
        id: 'signature',
        type: 'text',
        data: {
          id: 'signature',
          label: 'advancedsearch#label_signature',
          placeholder: '',
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
      }, */
        ]
      },
      {
        id: 'section-3',
        title: 'advancedsearch#bibliographical_note_title',
        advancedSection: true,
        inputs: [
          {
            id: 'note',
            type: 'text',
            data: {
              id: 'note',
              label: 'advancedsearch#label_note',
              placeholder: '',
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
            id: 'troupe',
            type: 'select',
            data: {
              id: 'res_type',
              label: 'advancedsearch#troupe_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'individuada',
                  label: 'advancedsearch#certain',
                  disabled: false
                },
                {
                  value: 'nombre probable',
                  label: 'advancedsearch#probable',
                  disabled: false
                },
                {
                  value: 'desconocido',
                  label: 'advancedsearch#unknown',
                  disabled: false
                }
              ]
            }
          },
          {
            id: 'actors',
            type: 'select',
            data: {
              id: 'actors',
              label: 'advancedsearch#actors_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'constan',
                  label: 'advancedsearch#consists',
                  disabled: false
                },
                {
                  value: 'no constan',
                  label: 'advancedsearch#no_consists',
                  disabled: false
                }
              ]
            }
          },
          {
            id: 'old-editions',
            type: 'select',
            data: {
              id: 'old-editions',
              label: 'advancedsearch#old_editions_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'modern-editions',
            type: 'select',
            data: {
              id: 'modern-editions',
              label: 'advancedsearch#modern_editions_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'other-manuscripts',
            type: 'select',
            data: {
              id: 'other-manuscripts',
              label: 'advancedsearch#other_manuscripts_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
        ]
      },
      {
        id: 'section-2',
        title: 'advancedsearch#label_censors',
        advancedSection: true,
        inputs: [
          {
            id: 'censorship',
            type: 'select',
            data: {
              id: 'censorship',
              label: 'advancedsearch#value_censorship_exists_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'true',
                  label: 'advancedsearch#value_censors_exists',
                  disabled: false
                }, {
                  value: 'false',
                  label: 'advancedsearch#value_censors_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'censor',
            type: 'text',
            data: {
              id: 'censor',
              label: 'advancedsearch#label_censor',
              placeholder: '',
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
            id: 'censorship_date',
            type: 'text',
            data: {
              id: 'censor',
              label: 'advancedsearch#label_censorship_date',
              placeholder: '',
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
            id: 'censorship_note',
            type: 'text',
            data: {
              id: 'censor',
              label: 'advancedsearch#label_censorship_note',
              placeholder: '',
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
        ]
      },
      {
        id: 'section-4',
        title: '',
        inputs: [
          {
            id: 'phisical_description',
            type: 'text',
            data: {
              id: 'phisical_description',
              label: 'advancedsearch#label_phisical_description',
              placeholder: '',
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
            id: 'cover_page',
            type: 'select',
            data: {
              id: 'cover_page',
              label: 'advancedsearch#cover_page_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'dramatis_personae',
            type: 'select',
            data: {
              id: 'dramatis_personae',
              label: 'advancedsearch#dramatis_personae_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'ph_desc_signature',
            type: 'select',
            data: {
              id: 'ph_desc_signature',
              label: 'advancedsearch#ph_desc_signature_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'ph_desc_date',
            type: 'select',
            data: {
              id: 'ph_desc_date',
              label: 'advancedsearch#ph_desc_date_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'other_hand',
            type: 'select',
            data: {
              id: 'other_hand',
              label: 'advancedsearch#other_hand_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'analytics_description',
            type: 'text',
            data: {
              id: 'analytics_description',
              label: 'advancedsearch#label_analytics_description',
              placeholder: '',
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
            id: 'manuscript_characteristics',
            type: 'text',
            data: {
              id: 'manuscript_characteristics',
              label: 'advancedsearch#label_manuscript_characteristics',
              placeholder: '',
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
        ]
      },
      {
        id: 'section-5',
        title: 'advancedsearch#writing_process_autograph_title',
        advancedSection: true,
        inputs: [
          {
            id: 'is_draft',
            type: 'select',
            data: {
              id: 'is_draft',
              label: 'advancedsearch#is_draft_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'has_revisions',
            type: 'select',
            data: {
              id: 'has_revisions',
              label: 'advancedsearch#revisions_exists_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'true',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'false',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'first_writing',
            type: 'text',
            data: {
              id: 'first_writing',
              label: 'advancedsearch#label_first_writing',
              placeholder: '',
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
            id: 'revisions',
            type: 'text',
            data: {
              id: 'revisions',
              label: 'advancedsearch#label_revisions',
              placeholder: '',
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
            id: 'is_revision_marginalia',
            type: 'select',
            data: {
              id: 'is_revision_marginalia',
              label: 'advancedsearch#is_revision_marginalia_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          }
        ]
      },
      {
        id: 'section-6',
        title: 'advancedsearch#external_interventions_title',
        advancedSection: true,
        inputs: [
          {
            id: 'external_interventions',
            type: 'select',
            data: {
              id: 'external_interventions',
              label: 'advancedsearch#external_interventions_exists_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'true',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'false',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'external_intervention_text',
            type: 'text',
            data: {
              id: 'external_intervention_text',
              label: 'advancedsearch#external_intervention_description',
              placeholder: '',
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
            id: 'external_intervention_resp',
            type: 'select',
            data: {
              id: 'external_intervention_resp',
              label: 'advancedsearch#external_intervention_resp_label',
              payload: '',
              options: [
                {
                  value: 'external_intervention_*',
                  label: 'todos',
                  disabled: false
                },
                {
                  value: 'external_intervention_company',
                  label: 'advancedsearch#resp_troupe',
                  disabled: false
                }, {
                  value: 'external_intervention_censor',
                  label: 'advancedsearch#resp_censor',
                  disabled: false
                },
                {
                  value: 'external_intervention_other',
                  label: 'advancedsearch#resp_other',
                  disabled: false
                }
              ]
            }
          },
          {
            id: 'is_deleted_fragments',
            type: 'select',
            data: {
              id: 'is_deleted_fragments',
              label: 'advancedsearch#is_deleted_fragments_label',
              payload: '',
              options: [
                {
                  value: '',
                  label: '---',
                  disabled: false
                },
                {
                  value: 'sí',
                  label: 'advancedsearch#value_exists',
                  disabled: false
                }, {
                  value: 'no',
                  label: 'advancedsearch#value_not_exists',
                  disabled: false
                }]
            }
          },
          {
            id: 'deleted_fragments',
            type: 'text',
            data: {
              id: 'deleted_fragments',
              label: 'advancedsearch#label_deleted_fragments',
              placeholder: '',
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
      }
    ]

  }
};

export default config;
