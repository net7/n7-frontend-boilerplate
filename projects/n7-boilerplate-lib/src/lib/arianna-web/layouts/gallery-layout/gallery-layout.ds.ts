import { LayoutDataSource } from '@n7-frontend/core';

export class AwGalleryLayoutDS extends LayoutDataSource {
  private communication;
  private pageTitle: string = 'Galleria'
  private sidebarIsSticky: boolean = true
  public orderByLabel = 'Ordina per';
  public orderByOptions: any = [
    {
      value: 'label_ASC',
      label: 'Ordine alfabetico (A→Z)'
    },
    {
      value: 'label_DESC',
      label: 'Ordine alfabetico (Z→A)'
    }
  ];
  public totalCount: number = 12
  public resultsTitle: string = 'Risultati'

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