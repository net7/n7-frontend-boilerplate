import { LayoutDataSource } from '@n7-frontend/core';
import { Observable } from 'rxjs';

export class MrStaticLayoutDS extends LayoutDataSource {
  private communication: any;

  public RENDER_HTML: any;

  onInit(payload) {
    this.communication = payload.communication;
  }

  pageRequest$(slug: string): Observable<any> {
    return this.communication.request$('page', { urlParams: slug });
  }

  renderHTML(title, body) {
    this.RENDER_HTML = {
      title,
      body,
    };
  }
}
