import { EventHandler } from '@n7-frontend/core';

export class DvNavEH extends EventHandler {
    public listen() {
        this.innerEvents$.subscribe(({ type, payload }) => {
            switch (type) {
                case 'dv-nav.click':
                    this.emitOuter('navclick', payload)
                    break;
                default:
                    console.warn('unhandled event of type', type)
                    break;
            }
        });
    }
}