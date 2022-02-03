import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _t } from '@n7-frontend/core';
import { ConfigurationService, CommunicationService } from '@n7-frontend/boilerplate-common';

export type ModalStatus = 'LOADING' | 'ERROR' | 'SUCCESS' | 'EMPTY' | 'IDLE';

export type ModalState = {
  status: ModalStatus;
  response?: any;
  config?: any;
};

@Injectable()
export class MrResourceModalService {
  state$: Subject<ModalState> = new Subject();

  constructor(
    private configuration: ConfigurationService,
    private communication: CommunicationService,
  ) {
    // default state
    this.state$.next({ status: 'IDLE' });
  }

  open(resourceId: string | number, configId: string) {
    this.state$.next({ status: 'LOADING' });
    const config = this.configuration.get(`resource-modal-${configId}`);
    // add translations
    ['top', 'content'].forEach((type) => {
      config.sections[type] = config.sections[type].map((section) => ({
        ...section,
        title: _t(section.title)
      }));
    });

    this.pageRequest$(resourceId, config, (err) => {
      console.warn(`Error loading resource modal for ${resourceId}`, err.message);
      this.state$.next({ status: 'ERROR' });
    }).subscribe((response) => {
      this.state$.next({ response, config, status: 'SUCCESS', });
    });
  }

  close() {
    this.state$.next({ status: 'IDLE' });
  }

  pageRequest$(id, config, onError: (err: any) => void): Observable<any> {
    const { top, content } = config.sections;
    const sections = top.concat(content);
    return this.communication.request$('resource', {
      onError,
      method: 'POST',
      params: {
        id,
        type: config.type,
        sections: sections.map((s) => s.id),
      }
    });
  }
}
