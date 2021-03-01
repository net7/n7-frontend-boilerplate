import { LayoutDataSource } from '@n7-frontend/core';

export class AwCollectionLayoutDS extends LayoutDataSource {
  private communication;

  onInit(payload) {
    this.communication = payload.communication;
    /**
     * Example query & Component Update
     */
    // this.communication.request$('getCompany', {
    //   onError: (error) => console.error(error)
    // }).subscribe(data => {
    //   console.log('-----------: AwCollectionLayoutDS -> onInit -> data', data);
    //   this.one('title').update(data.company_basic_info);
    // });
  }
}
