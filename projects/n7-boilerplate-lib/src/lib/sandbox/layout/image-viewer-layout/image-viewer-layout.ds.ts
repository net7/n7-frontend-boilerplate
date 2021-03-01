import { LayoutDataSource } from '@n7-frontend/core';
import { CommunicationService } from '../../../common/services/communication.service';
import { ConfigurationService } from '../../../common/services/configuration.service';

export class SbImageViewerLayoutDS extends LayoutDataSource {
  private communication: CommunicationService;

  private configuration: ConfigurationService;

  onInit({ communication, configuration }) {
    this.communication = communication;
    this.configuration = configuration;

    console.log('communication config', this.configuration.get('communication'));

    this.communication.request$('posts', {
      method: 'GET',
      params: {
        id: 505
      },
      onError: (err) => {
        console.warn('err', err);
      }
    }).subscribe((response) => {
      console.log('response------------>', response);
    });
  }
}
