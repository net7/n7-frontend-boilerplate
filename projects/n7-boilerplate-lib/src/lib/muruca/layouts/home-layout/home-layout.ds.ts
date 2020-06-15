import { LayoutDataSource } from '@n7-frontend/core/dist/layout-data-source';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrHomeLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private configId: string;

  private pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId) || {};

    this.doRequest();

    // update head title
    this.updateHeadTitle();
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

  private updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, pageTitle].join(' > '));
  }
}
