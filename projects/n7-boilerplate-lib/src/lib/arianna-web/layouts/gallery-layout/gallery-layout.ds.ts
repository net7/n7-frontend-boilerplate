import { LayoutDataSource } from '@n7-frontend/core';

export class AwGalleryLayoutDS extends LayoutDataSource {
  private communication;
  private configuration;
  private mainState: any;
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
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
    this.mainState.updateCustom('currentNav', 'galleria');
    this.mainState.update('headTitle', 'Arianna Web > Galleria');
  }
}