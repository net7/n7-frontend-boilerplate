import { LayoutDataSource } from '@n7-frontend/core';
import { Observable } from 'rxjs';

export class MrStaticLayoutDS extends LayoutDataSource {
  private communication: any;

  public RENDER_HTML: any;

  onInit(payload) {
    this.communication = payload.communication;
  }

  pageRequest$(): Observable<any> {
    return this.communication.request$('page');
  }

  createHTML(title, content) {
    this.RENDER_HTML = {
      title,
      content,
    };
  }
}
