// import { ParallelTextViewerData } from '@net7/components';
import { DataSource } from '@net7/core';

export class MrParallelTextViewerDS extends DataSource {
  id: string;

  // protected transform(data: ParallelTextViewerData): ParallelTextViewerData {
  // ^^^^^^^^^^^^^se va buildare components --- 17-12-2025^^^^^^^^^^^^^^^^^
  protected transform(data: any): any {
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
            const apiPanel = data.panels[panelIndex];
            const merged = { ...apiPanel, ...panelProperties };
            // Se l'API ha inviato un baseurl e la config statica ha uri vuoto popola facsimile.uri con il baseurl dinamico dell'API.
            if (merged.facsimile && !merged.facsimile.uri && apiPanel.baseurl) {
              merged.facsimile = {
                ...merged.facsimile,
                uri: apiPanel.baseurl,
              };
            }
            data.panels[panelIndex] = merged;
          }
        });
      }
    }
    const {
      enableClickOnEntities, toggleColumn,
      searchId,
      searchApi
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

    const params = new URLSearchParams(document.location.search);
    // const id = params.get('id');

    this.setupViewClickListeners();

    // Gestione della sezione di partenza degli XML 
    const startSection = data.startSection || this.options?.startSection;
    if (startSection) {
      const handleFirstLoad = () => {
        document.removeEventListener('pb-end-update', handleFirstLoad);
        setTimeout(() => {
          document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]').forEach((view: any) => {
            view.gotoId(startSection);
          });
        }, 200);
      };
      document.addEventListener('pb-end-update', handleFirstLoad);
    }

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

    /*       if (params.get('hq')) {
      if (searchApi) {
        const xmlQueryUrl = `${searchApi.url
        }?resource-id=${searchApi['resource-id']
        }&searchId=${searchId
        }&xml=${data.docs[0]?.xml
        }&${params.toString()}`;

        data.docs[0].url = xmlQueryUrl;
        data.docs[0].rootPath = 'api/mrcparts';
      }
         */

    if (params.get('hq')) {
      if (searchApi) {
        const mainDoc = data.docs.find((doc) => doc.id === 'mainDoc');

        if (mainDoc) {
          const xmlQueryUrl = `${searchApi.url
          }?resource-id=${searchApi['resource-id']
          }&searchId=${searchId
          }&xml=${mainDoc.xml
          }&${params.toString()}`;

          data.mainDoc.url = xmlQueryUrl;
          data.mainDoc.rootPath = 'api/mrcparts';
        }
      }
      document.addEventListener('pb-end-update', (ev: any) => {
        this.scrollElementsIntoView(ev.detail, 'hq', '#transcription-view');
      });
    }
    return data;
  }

  displayIndex() {
    if (this.output.toggleColumn) {
      this.output.toggleColumn = false;
    } else {
      this.output.toggleColumn = true;
    }
  }

  private wrapFullTextAuthorities(view: Element) {
    if (!view.shadowRoot || (view as any).__authoritiesWrapped) return;
    const content = view.shadowRoot.getElementById('content') || view.shadowRoot;
    const interps = Array.from(content.querySelectorAll('[class^="tei-interp"]'))
      .filter((el) => el.querySelector('.authority-full-entry'));
    if (!interps.length) return;

    // Estrae l'etichetta dal primo authority-header
    const headerEl = interps[0].querySelector('.authority-header');
    const labelText = headerEl?.textContent?.replace(/:$/, '').trim() || 'Fonti';
    const count = interps.length;

    // Crea il wrapper accordion
    const accordion = document.createElement('div');
    accordion.className = 'authority-accordion';
    accordion.setAttribute('style', 'margin-bottom:0.5em;');

    // Header cliccabile
    const header = document.createElement('div');
    header.className = 'authority-accordion__header';
    header.setAttribute('style',
      'display:flex;align-items:center;gap:8px;padding:8px 12px;'
      + 'background:#f0f2f5;cursor:pointer;user-select:none;'
      + 'border-bottom:1px solid #dee2e6;font-family:sans-serif;'
    );
    header.innerHTML = `
      <span style="font-size:12px;font-weight:600;color:#495057;text-transform:uppercase;letter-spacing:0.5px;">${labelText}</span>
      <span style="font-size:11px;color:#6c757d;border:1px solid #adb5bd;border-radius:4px;padding:1px 6px;">CONTIENE ${count} FONT${count === 1 ? 'E' : 'I'}</span>
      <span class="authority-accordion__chevron" style="margin-left:auto;font-size:14px;color:#6c757d;transition:transform 0.2s;">▼</span>
    `;

    // Body collassabile
    const body = document.createElement('div');
    body.className = 'authority-accordion__body';
    body.setAttribute('style', 'display:none;padding:8px 12px;');

    // Sposta gli interp nel body
    interps.forEach((interp) => {
      body.appendChild(interp);
    });

    // Toggle click
    header.addEventListener('click', () => {
      const isOpen = body.style.display !== 'none';
      body.style.display = isOpen ? 'none' : 'block';
      const chevron = header.querySelector('.authority-accordion__chevron') as HTMLElement;
      if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    });

    accordion.appendChild(header);
    accordion.appendChild(body);

    // Inserisce l'accordion all'inizio del content
    const contentDiv = content.querySelector('.content') || content;
    if (contentDiv.parentNode) {
      contentDiv.parentNode.insertBefore(accordion, contentDiv);
    }
    // Nasconde il contenitore originale (ora vuoto degli interp)
    if (contentDiv.querySelector('.tei-TEI') && !contentDiv.querySelector('[class^="tei-interp"]')) {
      const teiDiv = contentDiv.querySelector('.tei-TEI') as HTMLElement;
      if (teiDiv && !teiDiv.children.length) {
        teiDiv.style.display = 'none';
      }
    }

    (view as any).__authoritiesWrapped = true;
  }

  private injectPlaceholder(view: Element) {
    if (!view.shadowRoot || (view as any).__placeholderInjected) return;
    const placeholder = document.createElement('div');
    placeholder.className = 'column-placeholder';
    placeholder.setAttribute('style',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;'
      + 'padding:2em;margin:1em;text-align:center;'
      + 'color:#6c757d;font-family:sans-serif;'
    );
    placeholder.innerHTML = `
      <div style="width:40px;height:40px;border:2px solid #adb5bd;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:0.8em;font-size:18px;color:#adb5bd;">i</div>
      <div style="font-size:14px;">Clicca una voce per aprirne la scheda.</div>
    `;
    const container = view.shadowRoot.getElementById('view') || view.shadowRoot;
    if (container.appendChild) {
      container.appendChild(placeholder);
    }
    (view as any).__placeholderInjected = true;
    (view as any).__placeholderEl = placeholder;
  }

  private hidePlaceholder(view: Element) {
    const el = (view as any).__placeholderEl;
    if (el) el.style.display = 'none';
  }

  private checkPlaceholder(view: Element) {
    if (!view.shadowRoot) return;
    const el = (view as any).__placeholderEl;
    if (!el) return;
    const content = view.shadowRoot.getElementById('view') || view.shadowRoot;
    const hasVisibleApp = Array.from(content.querySelectorAll('.tei-app')).some(
      (app: any) => app.style.display === 'block'
    );
    const hasVisibleNote = Array.from(content.querySelectorAll('.note-item')).some(
      (note: any) => note.style.display === 'block'
    );
    el.style.display = (hasVisibleApp || hasVisibleNote) ? 'none' : 'flex';
  }

  setupViewClickListeners() {
    const attachListeners = () => {
      setTimeout(() => {
        const views = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]');

        views.forEach((view) => {
          if (view.id === 'transcription-view') {
            return;
          }

          // Wrappa autorità full-text in accordion collassabile
          this.wrapFullTextAuthorities(view);
          // Inietta placeholder nella view laterale
          this.injectPlaceholder(view);

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

    // Cross-highlight per termini multi-@ana: quando un pb-highlight con doppia key emette pb-highlight-on 
    //  ri-emette pb-highlight-on per ogni token individuale  così i termini correlati si evidenziano.
    document.addEventListener('pb-highlight-on', (ev: any) => {
      const key = ev.detail?.id;
      const channel = ev.detail?.key;
      if (!key || !channel) return;

      // Chiave composita (multi-@ana "vox2_vox3", ancore paired "v1a1_v1a2"): spezza e ri-emetti per ogni token su highlight-channel.
      if (key.includes('_')) {
        key.split('_').forEach((token: string) => {
          document.dispatchEvent(new CustomEvent('pb-highlight-on', {
            detail: { key: channel, id: token, source: ev.detail.source },
          }));
        });
        return;
      }

      if (ev.detail?.source === 'paired-anchor') return;

      // Token singolo: se corrisponde a un'ancora paired ri-emette con l'id composito del popup per attivarne l'highlight.
      document.querySelectorAll('[id$="-view"]').forEach((view: any) => {
        if (!view.shadowRoot) return;
        const popup = view.shadowRoot.querySelector(`.tei-app[data-from="${key}"]`)
          || view.shadowRoot.querySelector(`.tei-app[data-to="${key}"]`);
        if (popup && popup.id) {
          document.dispatchEvent(new CustomEvent('pb-highlight-on', {
            detail: { key: channel, id: popup.id, source: 'paired-anchor' },
          }));
        }
      });
    });
  }

  onClick(payload) {
    let target = null;
    const clickPath = payload.path || payload.composedPath();

    // chiusura apparato con tasto
    const closeButton = clickPath.find((el) => el.className
      && typeof el.className === 'string'
      && el.className.includes('close_app'));

    if (closeButton) {
      const parentAppItem = closeButton.closest('.tei-app');
      if (parentAppItem && parentAppItem.style) {
        parentAppItem.style.display = 'none';
        (parentAppItem as HTMLElement).style.transform = '';
        this.resetHighlights();
        // Verifica se mostrare il placeholder
        const closedView = clickPath.find((el: any) => el.id && el.id.endsWith('-view'));
        if (closedView) this.checkPlaceholder(closedView);
        payload.stopPropagation();
        return;
      }
    }

    const insideTeiApp = clickPath.find((el) => el.className
      && typeof el.className === 'string'
      && el.className.includes('tei-app'));

    if (insideTeiApp && (insideTeiApp as HTMLElement).style.display === 'block') {
      return;
    }

    // Chiusura note con tasto
    const closeNoteButton = clickPath.find((el) => el.className
      && typeof el.className === 'string'
      && el.className.includes('close_note'));

    if (closeNoteButton) {
      const parentNoteItem = closeNoteButton.closest('.note-item');
      if (parentNoteItem && parentNoteItem.style) {
        parentNoteItem.style.display = 'none';
        (parentNoteItem as HTMLElement).style.transform = '';
        this.resetHighlights();
        // Verifica se mostrare il placeholder
        const closedView = clickPath.find((el: any) => el.id && el.id.endsWith('-view'));
        if (closedView) this.checkPlaceholder(closedView);
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

      // Posizione elemento cliccato
      const clickedElementPosition = (target as HTMLElement).getBoundingClientRect().top;

      const clickedView = clickPath.find((el) => el.id && el.id.endsWith('-view'));
      const clickedViewId = clickedView ? clickedView.id : null;

      const apparatusView = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]');

      let anchorElement = null;
      let teiAppElement = null;

      apparatusView.forEach((view) => {
        // Salta la view in cui è stato fatto il click
        if (view.id === clickedViewId) {
          return;
        }

        if (view.shadowRoot) {
          // Cerca prima per id esatto; se non trovato, cerca popup per ancora apertura (data-from)
          // o ancora di chiusura (data-to)
          const found = view.shadowRoot.querySelector(`[id="${appId}"]`)
            || view.shadowRoot.querySelector(`.tei-app[data-from="${appId}"]`)
            || view.shadowRoot.querySelector(`.tei-app[data-to="${appId}"]`);
          if (found) {
            if (!anchorElement) {
              anchorElement = found;
            }

            const appElement = found.closest('.tei-app') || (found.classList.contains('tei-app') ? found : null);
            if (appElement && !teiAppElement) {
              teiAppElement = appElement;
            }
          }
        }
      });

      if (teiAppElement) {
        const isVisible = (teiAppElement as HTMLElement).style.display === 'block';

        // Determina se il pb-highlight cliccato è una cit esterna (contiene cit annidate).
        const nestedCits = (target as HTMLElement).querySelectorAll('span.quote');
        const isOuterCit = nestedCits.length > 0;
        const segOuterInner = (target as HTMLElement).querySelectorAll('.seg-outer-inner');
        const segPartF = (target as HTMLElement).querySelectorAll('.seg-part-f');

        if (isVisible) {
          (teiAppElement as HTMLElement).style.display = 'none';
          (teiAppElement as HTMLElement).style.transform = '';
          this.resetHighlights();
          // Verifica se mostrare il placeholder nella view che contiene il tei-app
          const parentView = teiAppElement.getRootNode()?.host;
          if (parentView) this.checkPlaceholder(parentView);

          if (isOuterCit) {
            // Pannello esterno chiuso: ripristina il background dei seg annidati
            segOuterInner.forEach((el) => {
              (el as HTMLElement).style.backgroundColor = '';
            });
            segPartF.forEach((el) => {
              (el as HTMLElement).style.backgroundColor = '';
            });
          }
        } else {
          (teiAppElement as HTMLElement).style.display = 'block';
          // Nascondi il placeholder nella view che contiene il tei-app
          const parentView = teiAppElement.getRootNode()?.host;
          if (parentView) this.hidePlaceholder(parentView);

          // posizione attuale
          const elementPosition = teiAppElement.getBoundingClientRect().top;

          // differenza
          const positionDifference = clickedElementPosition - elementPosition;

          // spostamento
          (teiAppElement as HTMLElement).style.transform = `translateY(${positionDifference}px)`;

          if (isOuterCit) {
            // Pannello esterno aperto: dopo che pb-highlight si attiva (giallo),
            // imposta sfondo bianco su seg-outer-inner e seg-part-f
            requestAnimationFrame(() => {
              segOuterInner.forEach((el) => {
                (el as HTMLElement).style.backgroundColor = 'white';
              });
              segPartF.forEach((el) => {
                (el as HTMLElement).style.backgroundColor = 'white';
              });
            });
          } else {
            // Pannello interno aperto: ripristina eventuali soppressioni sui seg interni
            requestAnimationFrame(() => {
              segOuterInner.forEach((el) => {
                (el as HTMLElement).style.backgroundColor = '';
              });
            });
          }
        }
      } else {
        console.warn('teiAppElement non trovato!');
      }
    } else if (target && target.getAttribute('type') === 'note_line') {
      const noteId = target.getAttribute('key');

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
        const noteParentView = (teiNoteElement.getRootNode() as any)?.host;

        if (isVisible) {
          (teiNoteElement as HTMLElement).style.display = 'none';
          (teiNoteElement as HTMLElement).style.transform = '';
          if (noteParentView) this.checkPlaceholder(noteParentView as Element);
        } else {
          (teiNoteElement as HTMLElement).style.display = 'block';
          if (noteParentView) this.hidePlaceholder(noteParentView as Element);

          // posizione attuale
          const elementPosition = teiNoteElement.getBoundingClientRect().top;

          // differenza
          const positionDifference = clickedElementPosition - elementPosition;

          // spostamento
          (teiNoteElement as HTMLElement).style.transform = `translateY(${positionDifference}px)`;
        }
      }
    } else if (target && target.getAttribute('type') === 'parallel_anchor') {
      const sectionId = target.getAttribute('key');
      if (sectionId) {
        document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]').forEach((view: any) => {
          view.gotoId(sectionId);
        });
      }
    } else if (target && target.getAttribute('key') && target.getAttribute('scrollview') !== null) {
      // Per scroll su indice
      const key = target.getAttribute('key');
      if (key) {
        this.scrollToIndexElement(key);
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

  /**
   * Resetta tutti gli highlight attivi del testo 
   */
  private resetHighlights() {
    document.querySelectorAll('[id$="-view"]').forEach((view: any) => {
      if (!view.shadowRoot) return;
      const content = view.shadowRoot.getElementById('view') || view.shadowRoot;

      // console.log('[resetHighlights] processing view:', view.id, '| pb-highlights:', content.querySelectorAll('pb-highlight').length);

      // Rimuove il giallo e re-abilita tutti i pb-highlight
      content.querySelectorAll('pb-highlight').forEach((hl: any) => {
        hl._className = 'highlight-off';
        hl.disabled = false;
      });

      // Rimuove classe 'disable' da qualsiasi elemento (residuo da plain reading view)
      content.querySelectorAll('.disable').forEach((el: Element) => {
        el.classList.remove('disable');
      });

      // Ripristina il background dei seg-outer-inner e seg-part-f (potrebbero essere rimasti 'white')
      content.querySelectorAll('.seg-outer-inner').forEach((el: Element) => {
        (el as HTMLElement).style.backgroundColor = '';
      });
      content.querySelectorAll('.seg-part-f').forEach((el: Element) => {
        (el as HTMLElement).style.backgroundColor = '';
      });
    });
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
            .querySelector('.n7-parallel-text-viewer #transcription-view')
            ?.shadowRoot?.querySelector('pb-highlight')
        ) {
          const highlight = document
            .querySelector('.n7-parallel-text-viewer #transcription-view')
            .shadowRoot.querySelectorAll('pb-highlight');

          const highlightId = highlight[highlight.length - 1].id; // s.x

          const fragmentNumber = highlightId.replace('.', '\\.');

          element = document
            .querySelector(`.n7-parallel-text-viewer ${view}`)
            ?.shadowRoot?.querySelector(`#${fragmentNumber}`);
        }
      } else if (type === 'entity') {
        const key = target.__key;
        element = document
          .querySelector(`.n7-parallel-text-viewer ${view}`)
          ?.shadowRoot?.querySelector(`#${key}`);
      } else if (type === 'hq') {
        element = document
          .querySelector(`.n7-parallel-text-viewer ${view}`)
          ?.shadowRoot?.querySelector('.tei-em');
      }

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 600);
  }

  /**
   * Scrolla all'elemento corrispondente nell'indice
   */
  scrollToIndexElement(key: string) {
    setTimeout(() => {
      const cleanKey = key.replace('#', '');
      const views = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]:not(#transcription-view)');

      Array.from(views).some((view) => {
        const target = view.shadowRoot?.querySelector(`#${cleanKey}`);
        if (target) {
          (target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          return true;
        }
        return false;
      });
    }, 300);
  }
}
