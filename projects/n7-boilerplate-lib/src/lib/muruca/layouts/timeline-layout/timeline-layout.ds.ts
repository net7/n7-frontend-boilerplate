import { LayoutDataSource } from '@n7-frontend/core';
import { InnerTitleData } from '@n7-frontend/components';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrLayoutStateService } from '../../services/layout-state.service';

export class MrTimelineLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private configId: string;

  private pageConfig;

  public yearHeader: InnerTitleData = {
    title: { main: { text: '1316' } },
    actions: {
      buttons: [{
        text: '',
        icon: 'n7-icon-cross',
        anchor: {
          payload: 'close-event'
        }
      }]
    }
  };

  public eventTitle: string;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.one('mr-timeline').update({});
    // this.mainState = payload.mainState;
    // this.layoutState = payload.layoutState;
    // this.configId = payload.configId;
    // this.pageConfig = this.configuration.get(this.configId) || {};
  }
}
