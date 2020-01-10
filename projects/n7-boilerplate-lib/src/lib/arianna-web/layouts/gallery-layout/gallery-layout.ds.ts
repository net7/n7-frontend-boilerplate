import { LayoutDataSource } from '@n7-frontend/core';

export class AwGalleryLayoutDS extends LayoutDataSource {
  private communication;
  onInit(payload) {
    this.communication = payload.communication;
    // EXAMPLE QUERY & COMPONENT UPDATE
    // this.communication.request$('getCompany', {
    //   onError: (error) => console.error(error)
    // }).subscribe(data => {
    //   console.log('-----------: GalleryLayoutDS -> onInit -> data', data);
    //   this.one('title').update(data.company_basic_info);
    // });
  }
}