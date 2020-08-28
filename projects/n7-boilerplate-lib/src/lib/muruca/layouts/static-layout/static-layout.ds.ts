import { LayoutDataSource } from '@n7-frontend/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrStaticLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  public content: string | null;

  public title: string | null;

  onInit(payload) {
    this.communication = payload.communication;
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
  }

  pageRequest$(slug: string, onError: (err: any) => void): Observable<any> {
    return this.communication.request$('static', {
      onError,
      urlParams: slug,
    });
  }

  handleResponse(response: any) {
    this.setHtml(response);
    this.updateHeadTitle(response.title);
  }

  setHtml(response) {
    const { content, title } = response;
    this.title = title;
    this.content = content;
    this.one('mr-static-metadata').update(response);
  }

  updateHeadTitle(pageTitle: string) {
    const appName = this.configuration.get('name');
    this.mainState.update('headTitle', [appName, pageTitle].join(' > '));
  }
}
