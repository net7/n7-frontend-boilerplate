import { LayoutDataSource } from '@n7-frontend/core';
import { Observable } from 'rxjs';

export class MrStaticLayoutDS extends LayoutDataSource {
  private communication: any;

  public RENDER_HTML: any;

  onInit(payload) {
    this.communication = payload.communication;
  }

  /**
   * Make a request to serverless based on the url slug
   * Example:
   * - base-url/static/sample-page
   * - base-url/static/another-page
   */
  pageRequest$(slug: string): Observable<any> {
    return this.communication.request$('wp-page', { urlParams: slug });
  }

  /** Renders the HTML fetched by pageRequest$() into the page */
  renderHTML(title, body) {
    this.RENDER_HTML = {
      title,
      body,
    };
  }
}
