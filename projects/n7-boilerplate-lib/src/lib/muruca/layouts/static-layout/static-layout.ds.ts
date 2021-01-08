import { LayoutDataSource, _t } from '@n7-frontend/core';
import { Observable } from 'rxjs';
import { UrlSegment } from '@angular/router';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrStaticLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  public content: string | null;

  public title: string | null;

  public errorTitle = _t('global#layout_error_title');

  public errorDescription = _t('global#layout_error_description');

  onInit(payload) {
    this.communication = payload.communication;
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
  }

  pageRequest$(urlSegments: UrlSegment[], onError: (err: any) => void): Observable<any> {
    if (urlSegments.length > 1) {
      return this.communication.request$('post', {
        onError,
        urlParams: urlSegments[1].path,
      });
    } return this.communication.request$('static', {
      onError,
      urlParams: urlSegments[0].path,
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
