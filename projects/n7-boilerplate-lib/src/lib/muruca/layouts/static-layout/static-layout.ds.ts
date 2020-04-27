import { LayoutDataSource } from '@n7-frontend/core';
import { Observable } from 'rxjs';

export class MrStaticLayoutDS extends LayoutDataSource {
  private communication: any;

  public RENDER_HTML: any;

  onInit(payload) {
    this.communication = payload.communication;
  }

  pageRequest$(): Observable<any> {
    // TODO: chanege whit var in url
    const configUrl = this.communication.rest.providerConfig.config.page;
    const getPageNum = window.location.href.match(/([^/]*)\/*$/)[1];
    this.communication.rest.providerConfig.config.page = configUrl + getPageNum;
    return this.communication.request$('page');
  }

  renderHTML(title, body) {
    this.RENDER_HTML = {
      title,
      body,
    };
  }
}
