import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import resourceMock from './resource-layout-mock';

export class MrResourceLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private configId: string;

  private pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);
  }

  /** Request the configured widgets data */
  pageRequest$(slug): Observable<any> {
    const { sections } = this.pageConfig;
    return this.communication.request$('resource', {
      method: 'POST',
      params: {
        slug,
        type: this.pageConfig.type,
        sections: sections.map((s) => s.id),
      }
    });
  }

  /** Load all the configured widgets */
  initSections(response) {
    // fake response from local mockup
    // eslint-disable-next-line no-param-reassign
    response = resourceMock;
    // TODO: remove this 👆🏻 line


    const { sections } = this.pageConfig;
    // console.log({ sections });
    sections.forEach(({ id }) => {
      const widgetDataSource = this.getWidgetDataSource(id);
      if (!widgetDataSource) return;
      const responseData = response[id];
      // set id
      widgetDataSource.id = id;
      // update data
      if (responseData) {
        this.one(id).update(responseData);
      }
    });
  }
}
