// import { ParallelTextViewerData } from '@net7/components';
import { _t, DataSource } from '@net7/core';

interface OpenDiv {
  id: string;
  element: HTMLElement;
  idealTop: number;
  height: number;
}

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
    // Traduce labels legenda
    if (this.options?.legend) {
      data.legend = this.options.legend.map((item: any) => ({
        ...item,
        label: _t(item.label),
        description: _t(item.description),
      }));
    }
    // Traduzione labels 
    if (this.options?.labels) {
      if (!data.labels) data.labels = {};
      Object.keys(this.options.labels).forEach((key) => {
        data.labels[key] = _t(this.options.labels[key]);
      });
    }
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


  /**
   * Attacca click listener ai .pericope-heading generati dall'ODD.
   * Chiamato ad ogni pb-end-update per coprire i cambi pagina.
   */
  private attachAccordionToggleListeners(view: Element) {
    if (!view.shadowRoot) return;
    view.shadowRoot.querySelectorAll('.pericope-heading').forEach((heading: HTMLElement) => {
      if ((heading as any).__accordionAttached) return;
      // Nasconde il chevron se la pericope non ha commento
      const parentGroup = heading.closest('.pericope-group');
      if (!parentGroup || !parentGroup.querySelector('.postilla-comment')) {
        heading.style.cursor = 'default';
        heading.classList.add('no-toggle');
        (heading as any).__accordionAttached = true;
        return;
      }
      heading.addEventListener('click', () => {
        const pericope = heading.closest('.pericope-group');
        if (!pericope) return;
        const comment = pericope.querySelector('.postilla-comment') as HTMLElement;
        if (!comment) return;

        const isOpen = comment.classList.contains('expanded');
        if (isOpen) {
          comment.classList.remove('expanded');
          heading.classList.remove('open');
        } else {
          // Collassa tutti gli altri
          view.shadowRoot.querySelectorAll('.postilla-comment').forEach((c: HTMLElement) => {
            c.classList.remove('expanded');
          });
          view.shadowRoot.querySelectorAll('.pericope-heading').forEach((h: HTMLElement) => {
            h.classList.remove('open');
          });
          comment.classList.add('expanded');
          heading.classList.add('open');
          setTimeout(() => {
            comment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
      (heading as any).__accordionAttached = true;
    });
  }

  // --- Stack management per view ---

  private getOpenDivs(view: Element): OpenDiv[] {
    if (!(view as any).__openDivs) {
      (view as any).__openDivs = [];
    }
    return (view as any).__openDivs;
  }

  private getActiveId(view: Element): string | null {
    return (view as any).__activeId || null;
  }

  private setActiveId(view: Element, id: string | null) {
    (view as any).__activeId = id;
  }

  private addToStack(view: Element, id: string, element: HTMLElement, idealTop: number) {
    const stack = this.getOpenDivs(view);
    // Se già presente, aggiorna idealTop
    const existing = stack.find((d) => d.id === id);
    if (existing) {
      existing.idealTop = idealTop;
      return;
    }
    stack.push({ id, element, idealTop, height: 0 });
  }

  private removeFromStack(view: Element, id: string) {
    const stack = this.getOpenDivs(view);
    const idx = stack.findIndex((d) => d.id === id);
    if (idx !== -1) {
      stack.splice(idx, 1);
    }
  }

  private findInStack(view: Element, id: string): OpenDiv | undefined {
    return this.getOpenDivs(view).find((d) => d.id === id);
  }

  /**
   * Stila il dropdown select dei pannelli (dentro pb-panel shadow DOM).
   */
  private stylePanelDropdown(view: Element) {
    const panel = view.closest('._pb_panel')?.parentElement;
    if (!panel || !(panel as any).shadowRoot) return;
    const sr = (panel as any).shadowRoot;
    if (sr.querySelector('#panel-dropdown-style')) return;
    const style = document.createElement('style');
    style.id = 'panel-dropdown-style';
    style.textContent = `
      select.dropdown {
        appearance: none;
        -webkit-appearance: none;
        background: white;
        border: 1px solid #adb5bd;
        border-radius: 6px;
        padding: 2px 36px 2px 16px;
        font-size: 14px;
        margin-top: 2px;
        font-weight: 500;
        color: #2c3e6b;
        cursor: pointer;
        outline: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
      }
      select.dropdown:hover {
        border-color: #2c3e6b;
      }
    `;
    sr.appendChild(style);
  }

  private prepareViewContainer(view: Element) {
    if (!view.shadowRoot || (view as any).__containerPrepared) return;
    const content = view.shadowRoot.getElementById('content');
    if (content) {
      content.style.position = 'relative';
    }
    // Inietta stili per le colonne laterali (dentro il shadow DOM)
    if (!view.shadowRoot.querySelector('#column-styles')) {
      const style = document.createElement('style');
      style.id = 'column-styles';
      style.textContent = `
        .mediation-fonte a,
        .mediation-fonte a:link,
        .mediation-fonte a:visited {
          color: #3b5998 !important;
          text-decoration: none !important;
        }
        .mediation-fonte a:hover {
          text-decoration: underline !important;
        }
        .tei-interp5 {
          display: block;
        }
        .tei-interp5 + .tei-interp5 {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #dee2e6;
        }
        .tei-app:has(.tei-interp5) > .app-head {
          display: block;
          padding-bottom: 12px;
          border-bottom: 1px solid #dee2e6;
          margin-bottom: 12px;
        }
      `;
      view.shadowRoot.appendChild(style);
    }
    (view as any).__containerPrepared = true;
  }

  /**
   * Ricalcola le posizioni di tutti i div aperti in una view.
   * Il div attivo sta alla sua posizione ideale,
   * quelli sopra si impilano verso l'alto, quelli sotto verso il basso.
   */
  private layoutOpenDivs(view: Element) {
    const stack = this.getOpenDivs(view);
    if (!stack.length) return;

    const gap = 8;
    const activeId = this.getActiveId(view);

    // Ordina per posizione ideale (ordine nel testo)
    stack.sort((a, b) => a.idealTop - b.idealTop);

    // Misura altezze attuali
    stack.forEach((div) => {
      div.height = div.element.getBoundingClientRect().height || 0;
    });

    // Trova l'indice del div attivo
    const activeIdx = stack.findIndex((d) => d.id === activeId);
    const finalTops: number[] = new Array(stack.length);

    if (activeIdx === -1) {
      // Nessun attivo
      let nextTop = 0;
      stack.forEach((div, i) => {
        finalTops[i] = Math.max(div.idealTop, nextTop);
        nextTop = finalTops[i] + div.height + gap;
      });
    } else {
      // Attivo alla sua posizione ideale
      finalTops[activeIdx] = stack[activeIdx].idealTop;

      // Div SOPRA l'attivo: dal più vicino all'attivo verso l'alto
      for (let i = activeIdx - 1; i >= 0; i--) {
        const maxBottom = finalTops[i + 1];
        finalTops[i] = Math.min(stack[i].idealTop, maxBottom - stack[i].height - gap);
        finalTops[i] = Math.max(finalTops[i], 0); // clamp a 0, può sovrapporre se clustered
      }

      // Div SOTTO l'attivo: dal più vicino all'attivo verso il basso
      for (let i = activeIdx + 1; i < stack.length; i++) {
        const minTop = finalTops[i - 1] + stack[i - 1].height + gap;
        finalTops[i] = Math.max(stack[i].idealTop, minTop);
      }
    }

    // Applica posizioni
    stack.forEach((div, i) => {
      div.element.style.position = 'absolute';
      div.element.style.top = `${finalTops[i]}px`;
      div.element.style.left = '0';
      div.element.style.right = '0';
    });
  }

  /**
   * Applica stili attivo/dimmed ai div aperti nella view.
   */
  private applyActiveStyles(view: Element) {
    const stack = this.getOpenDivs(view);
    const activeId = this.getActiveId(view);
    stack.forEach((div) => {
      if (div.id === activeId) {
        div.element.style.opacity = '1';
        div.element.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        div.element.style.zIndex = '20';
      } else {
        div.element.style.opacity = '0.7';
        div.element.style.boxShadow = 'none';
        div.element.style.zIndex = '10';
      }
    });
  }

  /**
   * Determina se un .tei-app è un div autorità (ha .quote-container).
   */
  private isAuthorityDiv(element: HTMLElement): boolean {
    return !!element.querySelector('.quote-container');
  }

  /**
   * Determina se un .tei-app è un div termine notevole (ha .editorial-note — unico dei termini).
   */
  private isTermDiv(element: HTMLElement): boolean {
    return !!element.querySelector('.editorial-note');
  }

  /**
   * Determina se un div termine è multi-sintagma (ha wrapper .tei-entry2.sintagma-block).
   */
  private isMultiSintagmaDiv(element: HTMLElement): boolean {
    return !!element.querySelector('.tei-entry2.sintagma-block');
  }

  /**
   * Determina se un .tei-app è un div citazione biblica.
   */
  private isBiblicalDiv(element: HTMLElement): boolean {
    const strong = element.querySelector('strong');
    return strong?.textContent?.includes('Fonte biblica') || false;
  }

  /**
   * Determina se un .tei-app è un div collassabile (autorità, termine o biblica).
   */
  private isCollapsibleDiv(element: HTMLElement): boolean {
    return this.isAuthorityDiv(element) || this.isTermDiv(element) || this.isBiblicalDiv(element);
  }

  /**
   * Restituisce i selettori degli elementi da nascondere nel collasso.
   */
  private getHideSelectors(element: HTMLElement): string[] {
    if (this.isAuthorityDiv(element)) {
      return ['.quote-source', '.quote-incipit', '.quote-desinit', '.quote-mediation'];
    }
    if (this.isTermDiv(element)) {
      return ['.editorial-note', 'a[href*="mrc_term"]'];
    }
    if (this.isBiblicalDiv(element)) {
      return ['span[style*="white-space"]'];
    }
    return [];
  }

  /**
   * Nasconde testi secondari nei termini (status Sreznevskij, label Commento).
   */
  private collapseTermExtras(element: HTMLElement) {
    // Multi-sintagma: nasconde i wrapper .tei-entry2.sintagma-block e aggiunge badge
    if (this.isMultiSintagmaDiv(element)) {
      const sintagmi = element.querySelectorAll('.tei-entry2.sintagma-block');
      sintagmi.forEach((s: HTMLElement) => {
        s.style.display = 'none';
      });
      // Badge conteggio
      if (!element.querySelector('.sintagma-badge')) {
        const count = sintagmi.length;
        const badge = document.createElement('span');
        badge.className = 'sintagma-badge';
        badge.setAttribute('style',
          'font-size:11px;color:#6c757d;border:1px solid #adb5bd;border-radius:4px;'
          + 'padding:1px 6px;margin-left:8px;display:inline-block;'
        );
        badge.textContent = `CONTIENE ${count} SINTAGM${count === 1 ? 'A' : 'I'}`;
        const lemmaBlock = element.querySelector('.lemma-block');
        const firstStrong = lemmaBlock?.querySelector('strong');
        if (firstStrong && firstStrong.nextSibling) {
          // Inserisce dopo il testo "Voce: lemma (cat)" che segue il primo <strong>
          const voceTextEnd = firstStrong.parentNode;
          voceTextEnd.insertBefore(badge, firstStrong.nextSibling.nextSibling);
        } else if (lemmaBlock) {
          lemmaBlock.prepend(badge);
        }
      } else {
        (element.querySelector('.sintagma-badge') as HTMLElement).style.display = 'inline-block';
      }
    }

    // Nasconde extra in tutti i container
    const containers = element.querySelectorAll('.app-head, .lemma-block, .sintagma-block');
    containers.forEach((container) => {
      const children = Array.from(container.childNodes);
      children.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim() || '';
          if (text.startsWith('Presente') || text.startsWith('Assente')) {
            (node as any).__origText = node.textContent;
            node.textContent = '';
          }
        }
        if (node.nodeName === 'BR') {
          (node as HTMLElement).style.display = 'none';
          (node as any).__hiddenByCollapse = true;
        }
        if (node.nodeName === 'STRONG' && node.textContent?.includes('Commento')) {
          (node as HTMLElement).style.display = 'none';
          (node as any).__hiddenByCollapse = true;
        }
      });
    });
  }

  /**
   * Ripristina i testi secondari nei termini.
   */
  private expandTermExtras(element: HTMLElement) {
    // Multi-sintagma: mostra i wrapper .tei-entry2.sintagma-block e nasconde il badge
    if (this.isMultiSintagmaDiv(element)) {
      element.querySelectorAll('.tei-entry2.sintagma-block').forEach((s: HTMLElement) => {
        s.style.display = '';
      });
      const badge = element.querySelector('.sintagma-badge') as HTMLElement;
      if (badge) badge.style.display = 'none';
    }

    const containers = element.querySelectorAll('.app-head, .lemma-block, .sintagma-block');
    containers.forEach((container) => {
      const children = Array.from(container.childNodes);
      children.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && (node as any).__origText) {
          node.textContent = (node as any).__origText;
          delete (node as any).__origText;
        }
        if ((node as any).__hiddenByCollapse) {
          (node as HTMLElement).style.display = '';
          delete (node as any).__hiddenByCollapse;
        }
      });
    });
  }

  /**
   * Collassa un div (autorità o termine): nasconde contenuto lungo, tiene summary.
   */
  private collapseDiv(element: HTMLElement) {
    if (!this.isCollapsibleDiv(element) || (element as any).__collapsed) return;

    // Nasconde gli elementi principali
    this.getHideSelectors(element).forEach((sel) => {
      element.querySelectorAll(sel).forEach((el: HTMLElement) => {
        el.style.display = 'none';
      });
    });

    // Extra per termini: nasconde Sreznevskij, label Commento, <br>
    if (this.isTermDiv(element)) {
      this.collapseTermExtras(element);
    }

    // Extra per bibliche: nasconde i <br> tra il titolo e il testo
    if (this.isBiblicalDiv(element)) {
      Array.from(element.childNodes).forEach((node) => {
        if (node.nodeName === 'BR') {
          (node as HTMLElement).style.display = 'none';
          (node as any).__hiddenByCollapse = true;
        }
      });
    }

    // Tasto toggle
    this.ensureCollapseToggle(element);
    const toggle = element.querySelector('.collapse-toggle') as HTMLElement;
    if (toggle) {
      toggle.textContent = '∨';
      toggle.style.display = 'inline-block';
    }

    (element as any).__collapsed = true;
  }

  /**
   * Espande un div (autorità o termine): mostra tutto il contenuto.
   */
  private expandDiv(element: HTMLElement) {
    if (!this.isCollapsibleDiv(element)) return;
    if ((element as any).__collapsed === false) return;

    // Mostra gli elementi principali
    this.getHideSelectors(element).forEach((sel) => {
      element.querySelectorAll(sel).forEach((el: HTMLElement) => {
        el.style.display = '';
      });
    });

    // Extra per termini: ripristina Sreznevskij, label Commento, <br>
    if (this.isTermDiv(element)) {
      this.expandTermExtras(element);
    }

    // Extra per bibliche: ripristina i <br>
    if (this.isBiblicalDiv(element)) {
      Array.from(element.childNodes).forEach((node) => {
        if ((node as any).__hiddenByCollapse) {
          (node as HTMLElement).style.display = '';
          delete (node as any).__hiddenByCollapse;
        }
      });
    }

    // Tasto toggle
    this.ensureCollapseToggle(element);
    const toggle = element.querySelector('.collapse-toggle') as HTMLElement;
    if (toggle) {
      toggle.textContent = '∧';
      toggle.style.display = 'inline-block';
    }

    (element as any).__collapsed = false;
  }

  /**
   * Crea il tasto toggle espandi/collassa se non esiste.
   */
  private ensureCollapseToggle(element: HTMLElement) {
    if (!this.isCollapsibleDiv(element)) return;
    if (element.querySelector('.collapse-toggle')) return;

    // Posiziona la X di chiusura in alto a destra
    const closeBtn = element.querySelector('paper-icon-button.close_app') as HTMLElement;
    if (closeBtn) {
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '4px';
      closeBtn.style.right = '4px';
      closeBtn.style.zIndex = '5';
    }

    // Crea il chevron accanto alla X
    const toggle = document.createElement('span');
    toggle.className = 'collapse-toggle';
    toggle.setAttribute('style',
      'position:absolute;top:8px;right:25px;cursor:pointer;font-size:18px;color:#6c757d;'
      + 'user-select:none;z-index:5;width:32px;height:32px;display:flex;'
      + 'align-items:center;justify-content:center;'
    );
    toggle.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.onCollapseToggleClick(element);
    });
    element.appendChild(toggle);
  }

  /**
   * Handler click sul tasto espandi/collassa.
   */
  private onCollapseToggleClick(element: HTMLElement) {
    const parentView = (element.getRootNode() as any)?.host as Element;
    if (!parentView) return;
    const isCollapsed = (element as any).__collapsed;

    if (isCollapsed) {
      // Espandi → riattiva il div
      const stack = this.getOpenDivs(parentView);
      const divEntry = stack.find((d) => d.element === element);
      if (divEntry) {
        this.setActiveId(parentView, divEntry.id);
        this.updateDivCollapse(parentView);
        requestAnimationFrame(() => {
          this.layoutOpenDivs(parentView);
          this.applyActiveStyles(parentView);
        });
      }
    } else {
      // Collassa manualmente
      this.collapseDiv(element);
      requestAnimationFrame(() => {
        this.layoutOpenDivs(parentView);
      });
    }
  }

  /**
   * Aggiorna collasso/espansione di tutti i div in base allo stato attivo.
   */
  private updateDivCollapse(view: Element) {
    const stack = this.getOpenDivs(view);
    const activeId = this.getActiveId(view);
    stack.forEach((div) => {
      if (div.id === activeId) {
        this.expandDiv(div.element);
      } else {
        this.collapseDiv(div.element);
      }
    });
  }

  // --- Fine stack management ---

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
    const hasOpenDivs = this.getOpenDivs(view).length > 0;
    el.style.display = hasOpenDivs ? 'none' : 'flex';
  }

  setupViewClickListeners() {
    const attachListeners = () => {
      setTimeout(() => {
        const views = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]');

        views.forEach((view) => {
          if (view.id === 'transcription-view') {
            return;
          }

          // Accordion commentary (postille collassabili)
          if (this.options?.accordionCommentary) {
            this.attachAccordionToggleListeners(view);
          }

          // Funzionalità avanzate colonne (attive solo se enableColumnFeatures è true)
          if (this.options?.enableColumnFeatures) {
            // Resetta i flag se il contenuto è stato ricreato da TEI Publisher
            if (view.shadowRoot) {
              const hasAccordion = view.shadowRoot.querySelector('.authority-accordion');
              if (!hasAccordion && (view as any).__authoritiesWrapped) {
                (view as any).__authoritiesWrapped = false;
              }
              const hasPlaceholder = view.shadowRoot.querySelector('.column-placeholder');
              if (!hasPlaceholder && (view as any).__placeholderInjected) {
                (view as any).__placeholderInjected = false;
                (view as any).__placeholderEl = null;
              }
              if (!hasAccordion || !hasPlaceholder) {
                (view as any).__openDivs = [];
                (view as any).__activeId = null;
                (view as any).__containerPrepared = false;
              }
            }
            // Stila il dropdown select del pannello
            this.stylePanelDropdown(view);
            // Prepara il container per absolute positioning
            this.prepareViewContainer(view);
            // Wrappa autorità full-text in accordion collassabile
            this.wrapFullTextAuthorities(view);
            // Inietta placeholder nella view laterale
            this.injectPlaceholder(view);
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
      const parentAppItem = closeButton.closest('.tei-app') as HTMLElement;
      if (parentAppItem) {
        const parentView = (parentAppItem.getRootNode() as any)?.host as Element;
        const appId = parentAppItem.id || parentAppItem.getAttribute('data-from');
        // Rimuove dallo stack e nasconde
        parentAppItem.style.display = 'none';
        parentAppItem.style.position = '';
        parentAppItem.style.top = '';
        parentAppItem.style.left = '';
        parentAppItem.style.right = '';
        parentAppItem.style.transform = '';
        if (parentView && appId) {
          this.removeFromStack(parentView, appId);
          // Se era l'attivo, imposta l'ultimo rimasto come attivo
          const stack = this.getOpenDivs(parentView);
          if (this.getActiveId(parentView) === appId) {
            this.setActiveId(parentView, stack.length ? stack[stack.length - 1].id : null);
          }
          this.layoutOpenDivs(parentView);
          this.applyActiveStyles(parentView);
          this.checkPlaceholder(parentView);
        }
        this.resetHighlights();
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

      // Posizione elemento cliccato (relativa al viewport)
      const clickedElementRect = (target as HTMLElement).getBoundingClientRect();

      const clickedView = clickPath.find((el: any) => el.id && el.id.endsWith('-view'));
      const clickedViewId = clickedView ? clickedView.id : null;

      const allViews = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]');

      let teiAppElement: HTMLElement = null;
      let targetView: Element = null;

      allViews.forEach((view) => {
        if (view.id === clickedViewId) return;
        if (!view.shadowRoot) return;

        const found = view.shadowRoot.querySelector(`[id="${appId}"]`)
          || view.shadowRoot.querySelector(`.tei-app[data-from="${appId}"]`)
          || view.shadowRoot.querySelector(`.tei-app[data-to="${appId}"]`);
        if (found && !teiAppElement) {
          const appElement = found.closest('.tei-app') || (found.classList.contains('tei-app') ? found : null);
          if (appElement) {
            teiAppElement = appElement as HTMLElement;
            targetView = view;
          }
        }
      });

      if (teiAppElement && targetView) {
        const divId = teiAppElement.id || teiAppElement.getAttribute('data-from') || appId;
        const existingInStack = this.findInStack(targetView, divId);

        // Gestione cit annidate (seg-outer-inner)
        const nestedCits = (target as HTMLElement).querySelectorAll('span.quote');
        const isOuterCit = nestedCits.length > 0;
        const segOuterInner = (target as HTMLElement).querySelectorAll('.seg-outer-inner');
        const segPartF = (target as HTMLElement).querySelectorAll('.seg-part-f');

        if (existingInStack) {
          // Div già aperto → riattiva: aggiorna idealTop e ricalcola layout
          const contentEl = targetView.shadowRoot.getElementById('content');
          const viewEl = targetView.shadowRoot.getElementById('view');
          const scrollContainer = viewEl || contentEl || targetView;
          const contentRect = contentEl ? contentEl.getBoundingClientRect() : targetView.getBoundingClientRect();
          const scrollTop = (scrollContainer as HTMLElement).scrollTop || 0;
          existingInStack.idealTop = clickedElementRect.top - contentRect.top + scrollTop;
          this.setActiveId(targetView, divId);
          this.updateDivCollapse(targetView);
          requestAnimationFrame(() => {
            this.layoutOpenDivs(targetView);
            this.applyActiveStyles(targetView);
          });
        } else {
          // Calcola posizione ideale relativa al container #content della view
          const contentEl = targetView.shadowRoot.getElementById('content');
          const viewEl = targetView.shadowRoot.getElementById('view');
          const scrollContainer = viewEl || contentEl || targetView;
          const contentRect = contentEl ? contentEl.getBoundingClientRect() : targetView.getBoundingClientRect();
          const scrollTop = (scrollContainer as HTMLElement).scrollTop || 0;
          const idealTop = clickedElementRect.top - contentRect.top + scrollTop;

          // Mostra il div
          teiAppElement.style.display = 'block';

          // Aggiunge allo stack
          this.addToStack(targetView, divId, teiAppElement, idealTop);
          this.setActiveId(targetView, divId);
          this.hidePlaceholder(targetView);
          this.updateDivCollapse(targetView);

          // Layout e stili dopo che il browser ha renderizzato (per misurare le altezze)
          requestAnimationFrame(() => {
            this.layoutOpenDivs(targetView);
            this.applyActiveStyles(targetView);

            // Gestione seg per cit annidate
            if (isOuterCit) {
              segOuterInner.forEach((el) => {
                (el as HTMLElement).style.backgroundColor = 'white';
              });
              segPartF.forEach((el) => {
                (el as HTMLElement).style.backgroundColor = 'white';
              });
            } else {
              segOuterInner.forEach((el) => {
                (el as HTMLElement).style.backgroundColor = '';
              });
            }
          });
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
    } else if (target && target.getAttribute('type') === 'commentary' && this.options?.accordionCommentary) {
      const commentaryKey = target.getAttribute('key');
      if (!commentaryKey) return;

      // Cerca nelle view laterali (non transcription-view) il pb-highlight corrispondente
      const allViews = document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]');
      allViews.forEach((view) => {
        if (view.id === 'transcription-view' || !view.shadowRoot) return;
        const highlighted = view.shadowRoot.querySelector(`pb-highlight[key="${commentaryKey}"]`);
        if (!highlighted) return;

        const pericope = highlighted.closest('.pericope-group');
        if (!pericope) return;

        // Collassa tutti i commenti e resetta gli heading
        view.shadowRoot.querySelectorAll('.postilla-comment').forEach((comment: HTMLElement) => {
          comment.classList.remove('expanded');
        });
        view.shadowRoot.querySelectorAll('.pericope-heading').forEach((h: HTMLElement) => {
          h.classList.remove('open');
        });

        // Espande il commento della pericope corrispondente
        const comment = pericope.querySelector('.postilla-comment') as HTMLElement;
        const heading = pericope.querySelector('.pericope-heading') as HTMLElement;
        if (comment) {
          comment.classList.add('expanded');
          if (heading) heading.classList.add('open');
          setTimeout(() => {
            comment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    } else if (target && target.getAttribute('type') === 'parallel_anchor') {
      const sectionId = target.getAttribute('key');
      if (sectionId) {
        document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]').forEach((view: any) => {
          view.gotoId(sectionId);
        });
      }
    } else if (target && target.getAttribute('type') === 'source_ref') {
      // Cross-panel scroll per citazioni fonti antiche (leoantico).
      // Click su una citazione nel testo → scrolla alla fonte corrispondente nel pannello fonti.
      const sourceKey = target.getAttribute('key');
      if (sourceKey) {
        const clickedView = clickPath.find((el) => el.id && el.id.endsWith('-view'));
        const clickedViewId = clickedView ? clickedView.id : null;

        document.querySelectorAll('.n7-parallel-text-viewer [id$="-view"]').forEach((view: any) => {
          if (view.id === clickedViewId) return;
          if (!view.shadowRoot) return;

          const fonteHighlight = view.shadowRoot.querySelector(`pb-highlight[key="${sourceKey}"]`);
          if (fonteHighlight) {
            fonteHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
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
