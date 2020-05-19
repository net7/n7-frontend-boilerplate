import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
// import resourceMock from './resource-layout-mock';

export class MrResourceLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private configId: string;

  private pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId) || {};
    this.doRequest();
  }

  /** Request the configured widgets data */
  doRequest() {
    const { sections } = this.pageConfig;
    if (sections) {
      this.communication.request$('sections', {
        method: 'POST',
        params: sections.map(({ id }) => id)
      }).subscribe((d) => {
        // load sections with the data from serverless
        this.initSections(d);
      });
      // this.initSections(resourceMock); // use mock
    }
  }

  /** Load all the configured widgets */
  initSections(response) {
    const { sections } = this.pageConfig;
    if (sections) {
      sections.forEach(({ id }) => {
        const widgetDataSource = this.getWidgetDataSource(id);
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
}
