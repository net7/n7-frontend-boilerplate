import { TextViewerData } from '@net7/components';
import { DataSource } from '@net7/core';

export class MrTextViewerDS extends DataSource {
  id: string;

  protected transform(data: TextViewerData): TextViewerData {
    if (!data) return null;
    const {
      enableClickOnEntities, toggleColumn, searchId, searchApi
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
    const id = params.get('id');

    if (data.docs[0]?.view === 'page' && id) {
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
    }

    if (enableClickOnEntities) {
      document.addEventListener('pb-end-update', (ev: any) => {
        this.scrollElementsIntoView(ev.detail, 'chapter', '#view1');
      });
    }

    if (params.get('hq')) {
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

  onClick(payload) {
    let target = null;

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
      console.log('appId', appId);

      // Posizione elemento cliccato
      const clickedElementPosition = (target as HTMLElement).getBoundingClientRect().top;

      const apparatusView = document.querySelector('.n7-text-viewer #apparatus-view0');
      console.log('apparatusView', apparatusView);
      console.log('shadowRoot', apparatusView?.shadowRoot);

      const teiAppElement = apparatusView
        ?.shadowRoot
        ?.querySelector('.tei-body .tei-app');

      if (teiAppElement) {
        console.log('teiAppElement trovato!');

        // posizione attuale
        const elementPosition = teiAppElement.getBoundingClientRect().top;

        // differenza
        const positionDifference = clickedElementPosition - elementPosition;

        // Spostamento
        (teiAppElement as HTMLElement).style.transform = `translateY(${positionDifference}px)`;
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
      /*
      else if (type === 'apparatus') {
        const key = target.getAttribute("key");
        element = document
          .querySelector(`.n7-text-viewer #apparatus-view0`)
          ?.shadowRoot
          ?.querySelector(`#${key}`);
      }
      */

      const container = document.querySelector(`.n7-text-viewer ${view}`);
      if (element) {
        container.scrollTop = element.offsetTop;
      }
    }, 600);
  }
}
