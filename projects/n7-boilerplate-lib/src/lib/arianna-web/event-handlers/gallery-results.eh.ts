import { EventHandler } from '@n7-frontend/core';

export class AwGalleryResultsEH extends EventHandler {

    public listen() {
        this.innerEvents$.subscribe(({ type, payload }) => {
            switch (type) {
                case 'aw-gallery-results.change':
                    this.emitOuter('change', +payload.value)
                    break;
                case 'aw-gallery-results.click':
                    if (typeof payload == 'string') { // click on pagination
                        if (payload.startsWith('page')) {
                            // pagination routing is handled by the parent layout
                            this.emitOuter('pagination', payload)
                        } else if (payload.startsWith('goto')) {
                            let targetPage = +payload.replace('goto-', '')
                            // kill impossible page navigations
                            if (targetPage > this.dataSource.totalPages) return;
                            else if (targetPage < 1 || targetPage === this.dataSource.currentPage) return;
                            else this.emitOuter('goto', payload)
                        }
                    } else { // click on a linked object
                        this.emitOuter('click', payload);
                    }
                    break;
                default:
                    console.warn('(gallery-results) unhandled inner event of type', type)
                    break;
            }
        });
    /*
        this.outerEvents$.subscribe(event => {
            
        });
    */
    }
}