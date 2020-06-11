import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';

export class MrHomeLayoutDS extends LayoutDataSource {
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

  doRequest() {
    const { sections } = this.pageConfig;
    if (sections) {
      this.communication.request$('home', {
        method: 'POST',
        params: sections.map(({ id }) => id)
      }).subscribe((response) => {
        this.initSections(response);
      });
    }
  }

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
