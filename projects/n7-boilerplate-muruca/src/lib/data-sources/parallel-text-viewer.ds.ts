import { ParallelTextViewerData } from '@net7/components';
import { DataSource } from '@net7/core';

export class MrParallelTextViewerDS extends DataSource {
  id: string;

  protected transform(data: ParallelTextViewerData): ParallelTextViewerData {
    if (!data) return null;

    /*
    if (this.options.facsimileOptions && data.facsimile) {
      if (!data.facsimile.options) {
        data.facsimile.options = {};
      }
      Object.keys(this.options.facsimileOptions).forEach((key) => {
        data.facsimile.options[key] = this.options.facsimileOptions[key];
      });
    } */
    if (this.options) {
    // Gestione delle libOptions
      if (this.options.libOptions) {
        if (!data.libOptions || typeof data.libOptions !== 'object') {
          data.libOptions = {};
        }
        Object.keys(this.options.libOptions).forEach((key) => {
          if (!data.libOptions[key] || typeof data.libOptions[key] !== 'object') {
            data.libOptions[key] = {};
          }
          Object.keys(this.options.libOptions[key]).forEach((subKey) => {
            data.libOptions[key][subKey] = this.options.libOptions[key][subKey];
          });
        });
        // Debug libOptions
      /*       console.log(' DEBUG libOptions:', {
        'this.options.libOptions': this.options.libOptions,
        'data.libOptions': data.libOptions,
        'data.libOptions.pbPage': data.libOptions.pbPage,
        'urlIgnore': data.libOptions.pbPage?.urlIgnore
      }); */
      }
      // Gestione della grid
      if (this.options.grid) {
        data.grid = this.options.grid;
      }
      // Gestione dei panels
      if (this.options.panels) {
        this.options.panels.forEach((panelProperties) => {
          const panelIndex = data.panels.findIndex(
            (panel) => panel.id === panelProperties.id
          );

          if (panelIndex !== -1) {
            data.panels[panelIndex] = {
              ...data.panels[panelIndex],
              ...panelProperties
            };
          }
        });
      }
    }
    const {
      enableClickOnEntities, toggleColumn,
      // searchId,
      // searchApi
    } = this.options || {};
    data.toggleColumn = toggleColumn;
    // force tei publisher endpoint value
    document.addEventListener(
      'pb-page-ready',
      (ev: CustomEvent) => {
        const { detail } = ev;
        detail.endpoint = data.endpoint;
      },
      { once: true }
    );

    // const params = new URLSearchParams(document.location.search);
    // const id = params.get('id');

    this.setupViewClickListeners();

    /*     if (data.docs[0]?.view === 'page' && id) {
      data.docs[0].view = 'div';
      document.addEventListener(
        'pb-end-update',
        () => {
          setTimeout(() => {
            document.dispatchEvent(
              new CustomEvent('pb-toggle', {
                detail: {
                  properties: {
                    view: 'page',
                  },
                  action: 'refresh',
                  key: 'transcription',
                },
              })
            );
            document.dispatchEvent(
              new CustomEvent('pb-toggle', {
                detail: {
                  properties: {
                    view: 'single',
                  },
                  action: 'refresh',
                  key: 'addChannel',
                },
              })
            );
            document.dispatchEvent(
              new CustomEvent('pb-toggle', {
                detail: {
                  properties: {
                    view: 'single',
                    id: '',
                  },
                  action: 'refresh',
                  key: 'index',
                },
              })
            );
          }, 500);
        },
        { once: true }
      );
    } */

    if (enableClickOnEntities) {
      document.addEventListener('pb-end-update', (ev: any) => {
        this.scrollElementsIntoView(ev.detail, 'chapter', '#view1');
      });
    }

    /*     if (params.get('hq')) {
      if (searchApi) {
        const xmlQueryUrl = `${searchApi.url
        }?resource-id=${searchApi['resource-id']
        }&searchId=${searchId
        }&xml=${data.docs[0]?.xml
        }&${params.toString()}`;
        data.docs[0].url = xmlQueryUrl;
        data.docs[0].rootPath = 'api/mrcparts';
      }
      document.addEventListener('pb-end-update', (ev: any) => {
        this.scrollElementsIntoView(ev.detail, 'hq', '#view0');
      });
    } */
    return data;
  }

  displayIndex() {
    if (this.output.toggleColumn) {
      this.output.toggleColumn = false;
    } else {
      this.output.toggleColumn = true;
    }
  }

  setupViewClickListeners() {
    const attachListeners = () => {
      setTimeout(() => {
        const views = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]');

        views.forEach((view) => {
          if (view.id === 'transcription-view') {
            return;
          }

          if (view.shadowRoot) {
            if ((view as any).__clickListenerAttached) {
              return;
            }

            const clickListener = (event: Event) => {
              this.onClick(event);
            };

            // Salva il riferimento e marca come attaccato
            (view as any).__clickListener = clickListener;
            (view as any).__clickListenerAttached = true;

            // Attacca il listener in capture phase per catturare tutti i click
            view.shadowRoot.addEventListener('click', clickListener, true);
          }
        });
      }, 100);
    };

    // Attacca al primo caricamento
    document.addEventListener('pb-end-update', attachListeners);

    setTimeout(attachListeners, 500);
  }

  onClick(payload) {
    // console.log('🔵 onClick chiamato!', payload);
    let target = null;
    const clickPath = payload.path || payload.composedPath();
    // console.log('🔵 clickPath:', clickPath);

    // chiusura apparato con tasto
    const closeButton = clickPath.find((el) => el.className
      && typeof el.className === 'string'
      && el.className.includes('close_app'));

    if (closeButton) {
    //  console.log('Click rilevato sul bottone di chiusura:', closeButton);

      const parentAppItem = closeButton.closest('.tei-app');
      if (parentAppItem && parentAppItem.style) {
        //    console.log('Chiusura dell\'elemento tei-app');
        parentAppItem.style.display = 'none';
        (parentAppItem as HTMLElement).style.transform = '';
        payload.stopPropagation();
        return;
      }
    }

    // Chiusura note con tasto
    const closeNoteButton = clickPath.find((el) => el.className
      && typeof el.className === 'string'
      && el.className.includes('close_note'));

    if (closeNoteButton) {
    //  console.log('Click rilevato sul bottone di chiusura nota:', closeNoteButton);

      const parentNoteItem = closeNoteButton.closest('.note-item');
      if (parentNoteItem && parentNoteItem.style) {
        //    console.log('Chiusura dell\'elemento note-item');
        parentNoteItem.style.display = 'none';
        (parentNoteItem as HTMLElement).style.transform = '';
        payload.stopPropagation();
        return;
      }
    }

    if (payload.path) {
      target = payload.path.find(
        ({ tagName }) => tagName === 'PB-HIGHLIGHT'
      );
    } else {
      target = payload.composedPath().find(
        ({ tagName }) => tagName === 'PB-HIGHLIGHT'
      );
    }

    if (target && target.getAttribute('type') === 'app_lem') {
      const appId = target.getAttribute('key');
      // console.log('appId:', appId);

      // Posizione elemento cliccato
      const clickedElementPosition = (target as HTMLElement).getBoundingClientRect().top;

      const apparatusView = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]');
      // console.log('Numero di view trovate:', apparatusView.length);

      let anchorElement = null;
      let teiAppElement = null;

      apparatusView.forEach((view) => {
        if (view.shadowRoot) {
          const found = view.shadowRoot.querySelector(`[id="${appId}"]`);
          if (found) {
            if (!anchorElement) {
              anchorElement = found;
            }

            const appElement = found.closest('.tei-app');
            if (appElement && !teiAppElement) {
              teiAppElement = appElement;
            }
          }
        }
      });

      if (teiAppElement) {
        const isVisible = (teiAppElement as HTMLElement).style.display === 'block';

        if (isVisible) {
          (teiAppElement as HTMLElement).style.display = 'none';
          (teiAppElement as HTMLElement).style.transform = '';
        } else {
          (teiAppElement as HTMLElement).style.display = 'block';

          // posizione attuale
          const elementPosition = teiAppElement.getBoundingClientRect().top;

          // differenza
          const positionDifference = clickedElementPosition - elementPosition;

          // spostamento
          (teiAppElement as HTMLElement).style.transform = `translateY(${positionDifference}px)`;
        }
      } else {
        console.warn('teiAppElement non trovato!');
      }
    } else if (target && target.getAttribute('type') === 'note_line') {
      const noteId = target.getAttribute('key');
      // console.log('noteId', noteId);

      const clickedElementPosition = (target as HTMLElement).getBoundingClientRect().top;

      const apparatusView = document.querySelector('.n7-text-viewer #apparato-view');

      const anchorElement = apparatusView
        ?.shadowRoot
        ?.querySelector(`#${noteId}`);

      const teiNoteElement = anchorElement
        ? anchorElement.closest('.note-item')
        : null;
      if (teiNoteElement) {
        // Verifica se è visibile
        const isVisible = (teiNoteElement as HTMLElement).style.display === 'block';

        if (isVisible) {
          (teiNoteElement as HTMLElement).style.display = 'none';

          (teiNoteElement as HTMLElement).style.transform = '';
        } else {
          (teiNoteElement as HTMLElement).style.display = 'block';

          // posizione attuale
          const elementPosition = teiNoteElement.getBoundingClientRect().top;

          // differenza
          const positionDifference = clickedElementPosition - elementPosition;

          // spostamento
          (teiNoteElement as HTMLElement).style.transform = `translateY(${positionDifference}px)`;
        }
      }
    } else if (target && this.output.toggleColumn === false) {
      if (
        target.__key
        && (target.className.includes('person')
          || target.className.includes('place'))
      ) {
        this.output.toggleColumn = true;
        this.scrollElementsIntoView(target, 'entity', '#text-viewer-index');
      }
    } else this.output.toggleColumn = false;
  }

  viewListenerUpdate() {
    document.addEventListener(
      'pb-start-update',
      function _listener() {
        document.removeEventListener('pb-start-update', _listener, true);
      },
      true
    );
  }

  changeView(view, refresh) {
    setTimeout(
      (v, r) => {
        // console.log(`TEST CHANGE VIEW: ${view}`);
        document.dispatchEvent(
          new CustomEvent('pb-toggle', {
            detail: {
              properties: {
                view: v,
              },
              action: r ? 'refresh' : '',
              key: 'transcription',
            },
          })
        );
      },
      600,
      view,
      refresh
    );
  }

  scrollElementsIntoView(target, type, view) {
    setTimeout(() => {
      let element: any;
      if (type === 'chapter') {
        if (
          document
            .querySelector('.n7-text-viewer #view0')
            .shadowRoot.querySelector('pb-highlight')
        ) {
          const highlight = document
            .querySelector('.n7-text-viewer #view0')
            .shadowRoot.querySelectorAll('pb-highlight');

          const highlightId = highlight[highlight.length - 1].id; // s.x

          const fragmentNumber = highlightId.replace('.', '\\.');

          element = document
            .querySelector(view)
            .shadowRoot.querySelector(`#${fragmentNumber}`);
        }
      } else if (type === 'entity') {
        const key = target.__key;
        element = document
          .querySelector(`.n7-text-viewer ${view}`)
          .shadowRoot.querySelector(`#${key}`);
      } else if (type === 'hq') {
        element = document
          .querySelector(`.n7-text-viewer ${view}`)
          .shadowRoot.querySelector('.tei-em');
      }

      const container = document.querySelector(`.n7-text-viewer ${view}`);
      if (element) {
        container.scrollTop = element.offsetTop;
      }
    }, 600);
  }
}
