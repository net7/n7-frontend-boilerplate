import { LayoutDataSource } from '@n7-frontend/core';
import { Observable } from 'rxjs';

export class MrStaticLayoutDS extends LayoutDataSource {
  private communication: any;

  public RENDER_HTML: any;

  onInit(payload) {
    this.communication = payload.communication;
  }

  pageRequest$(): Observable<any> {
    const getPageNum = window.location.href.match(/([^/]*)\/*$/)[1];
    return this.communication.request$('page', { urlParams: getPageNum }, 'rest-local');
  }

  renderHTML(title, body) {
    this.RENDER_HTML = {
      title,
      body,
    };
  }
}
