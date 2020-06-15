import { LayoutDataSource } from '@n7-frontend/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrStaticLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  public html: any;

  onInit(payload) {
    this.communication = payload.communication;
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
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
  
  handleResponse(response: any) {
    const { title, body } = response;
    this.setHtml(title, body);
    this.updateHeadTitle(title);
  }

  setHtml(title, body) {
    this.html = {
      title,
      body,
    };
  }

  updateHeadTitle(pageTitle: string) {
    const appName = this.configuration.get('name');
    this.mainState.update('headTitle', [appName, pageTitle].join(' > '));
  }
}
