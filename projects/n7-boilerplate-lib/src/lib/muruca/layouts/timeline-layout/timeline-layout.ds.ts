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

  public images: string[] = [
    'https://i.imgur.com/WM3EG9d.png',
    'https://i.imgur.com/ZDQmlnX.png',
    'https://i.imgur.com/HhKxoZb.png',
    'https://i.imgur.com/c3tonAj.png',
    'https://i.imgur.com/Ef7izGP.png',
    'https://i.imgur.com/8Xpzoig.png',
    'https://i.imgur.com/yhF0LCt.png',
    'https://i.imgur.com/bMfHfEh.png',
  ]

  public eventTitle: string;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.one('mr-timeline').update({});
    this.one('mr-map').update({});
    this.communication.request$('timeline', {
      method: 'GET',
      onError: (e) => console.error(e)
    }).subscribe((d) => {
      console.log(d);
    });
    // this.mainState = payload.mainState;
    // this.layoutState = payload.layoutState;
    // this.configId = payload.configId;
    // this.pageConfig = this.configuration.get(this.configId) || {};
  }
}
