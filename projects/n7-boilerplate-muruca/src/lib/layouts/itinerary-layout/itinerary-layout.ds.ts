import { Observable } from 'rxjs';
import { LayoutDataSource, _t } from '@net7/core';
import {
  ConfigurationService,
  CommunicationService,
  MainStateService
} from '@net7/boilerplate-common';

export class MrItineraryLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService

  private configId: string;

  private pageConfig: any;

  public content: string | null;

  public title: string | null;

  public errorTitle = _t('global#layout_error_title');

  public errorDescription = _t('global#layout_error_description');

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    // add translations
    this.pageConfig.sections = this.pageConfig.sections.map((section) => ({
      ...section,
      title: _t(section.title)
    }));
  }

  pageRequest$(id, onError: (err: any) => void): Observable<any> {
    return this.communication.request$('itinerary', {
      onError,
      method: 'GET',
      urlParams: id
    });
  }

  handleResponse(response) {
    this.updateTitle(response);
    this.updateContent(response);
    this.updateMetadata(response);
    this.initSections(response);
    this.updateHeadTitle(response);
  }

  private updateTitle({ title }) {
    this.title = title;
  }

  private updateContent({ content }) {
    this.content = content;
  }

  private updateMetadata(response) {
    this.one('mr-static-metadata').update(response);
  }

  private initSections(response) {
    const { sections } = this.pageConfig;
    sections.forEach(({ id }) => {
      const widgetDataSource = this.getWidgetDataSource(id);
      if (!widgetDataSource) return;
      const responseSection = response.sections[id];
      // set id
      widgetDataSource.id = id;
      // update data
      if (responseSection) {
        this.one(id).update(responseSection);
      }
    });
  }

  private updateHeadTitle({ title: itineraryTitle }) {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle), itineraryTitle].join(' > '));
  }
}
