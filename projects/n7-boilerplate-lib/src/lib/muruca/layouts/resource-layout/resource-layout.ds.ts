import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrResourceLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService

  private configId: string;

  private pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);
  }

  /** Request the configured widgets data */
  pageRequest$(slug, onError: (err: any) => void): Observable<any> {
    const { sections } = this.pageConfig;
    return this.communication.request$('resource', {
      onError,
      method: 'POST',
      params: {
        slug,
        type: this.pageConfig.type,
        sections: sections.map((s) => s.id),
      }
    });
  }

  handleResponse(response) {
    this.initSections(response);
    // this.initSections(resourceLayoutMock);
    this.updateHeadTitle(response);
  }

  /** Load all the configured widgets */
  private initSections(response) {
    const { sections } = this.pageConfig;
    // console.log({ sections });
    sections.forEach(({ id }) => {
      const widgetDataSource = this.getWidgetDataSource(id);
      if (!widgetDataSource) return;
      const responseSection = response.sections[id];
      // set id
      widgetDataSource.id = id;
      // update data
      if (responseSection) {
        // this.one(id).update(responseSection);
        this.one(id).update(responseSection);
      }
    });
  }

  private updateHeadTitle({ title: resourceTitle }) {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, pageTitle, resourceTitle].join(' > '));
  }
}
