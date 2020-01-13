import { EventHandler } from '@n7-frontend/core';

export class AwGalleryResultsEH extends EventHandler {

    public listen() {
        this.innerEvents$.subscribe(({ type, payload }) => {
            switch (type) {
                case 'aw-gallery-results.change':
                    // TODO: Handle change of pagination size
                    break;
                case 'aw-gallery-results.click':
                    // TODO: Handle click on pagination link
                    if (payload.match(/goto/)) {
                        
                    }
                    console.log({payload})
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