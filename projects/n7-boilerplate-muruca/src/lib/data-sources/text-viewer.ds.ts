import { TextViewerData } from '@net7/components';
import { DataSource } from '@net7/core';

export class MrTextViewerDS extends DataSource {
  id: string;

  protected transform(data: TextViewerData): TextViewerData {
    const { enableClickOnEntities } = this.options || {};

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
      document.addEventListener('pb-start-update', function _listener() {
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
        }, 500);

        document.removeEventListener('pb-start-update', _listener, true);
      }, true);
    }

    if (enableClickOnEntities) {
      document.addEventListener('pb-end-update', (ev: any) => {
        this.scrollElementsIntoView(ev.detail, 'chapter', '#view1');
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
    if (this.output.toggleColumn === false) {
      const target = payload.path.find(({ tagName }) => tagName === 'PB-HIGHLIGHT');
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
    document.addEventListener('pb-start-update', function _listener() {
      document.removeEventListener('pb-start-update', _listener, true);
    }, true);
  }

  changeView(view, refresh) {
    setTimeout((v, r) => {
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
    }, 600, view, refresh);
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
      }

      const container = document.querySelector(`.n7-text-viewer ${view}`);
      if (element) {
        container.scrollTop = element.offsetTop;
      }
    }, 600);
  }
}
