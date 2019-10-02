import { DataSource } from '@n7-frontend/core';
// import { NAV_MOCK } from '@n7-frontend/components';

export class AwEntitaNavDS extends DataSource {

  protected transform(data){
    const navigation: any = {
      items: [
        {
          text: 'OVERVIEW',
          payload: 'overview',
        },
        {
          text: 'CAMPI',
          payload: 'campi',
        },
        {
          text: 'OGGETTI COLLEGATI',
          payload: 'oggetti-collegati',
        },
        {
          text: 'ENTITA COLLEGATE',
          payload: 'entita-collegate',
        },
        {
          text: 'MAXXI',
          payload: 'maxxi',
        },
        {
          text: 'WIKIPEDIA',
          payload: 'wiki',
        },
      ],
      payload: 'entita-nav'
    }
    return navigation
  }
}