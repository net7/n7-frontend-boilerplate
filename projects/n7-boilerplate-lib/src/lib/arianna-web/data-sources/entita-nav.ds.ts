import { DataSource } from '@n7-frontend/core';
// import { NAV_MOCK } from '@n7-frontend/components';

export class AwEntitaNavDS extends DataSource {

  protected transform(data){
    return {
      items: [
        {
          text: 'OVERVIEW',
          payload: 'overview',
        },
        {
          text: 'CAMPI',
          payload: 'overview',
        },
        {
          text: 'OGGETTI COLLEGATI',
          payload: 'overview',
        },
        {
          text: 'ENTITA COLLEGATE',
          payload: 'overview',
        },
        {
          text: 'MAXXI',
          payload: 'overview',
        },
        {
          text: 'WIKIPEDIA',
          payload: 'overview',
        },
      ],
      payload: 'entita-nav'
    }
  }
}