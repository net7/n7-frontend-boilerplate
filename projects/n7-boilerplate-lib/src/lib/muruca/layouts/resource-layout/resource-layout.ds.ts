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

  /** Current resource, based on url */
  private resource: { id: string; type: string }

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.configId = payload.configId;
  }

  /** Request the configured widgets data */
  pageRequest$({ type, id }): Observable<any> {
    this.resource = { id, type };
    const { sections } = this.configuration.get(type);
    this.pageConfig = { sections };
    return this.communication.request$('resource', {
      method: 'POST',
      params: {
        type,
        id,
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


    const { sections } = this.configuration.get(this.resource.type);
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
