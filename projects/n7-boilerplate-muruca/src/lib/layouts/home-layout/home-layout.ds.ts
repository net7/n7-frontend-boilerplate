import { LayoutDataSource, _t } from '@net7/core';
import { Data } from '@angular/router';
import { isEmpty } from 'lodash';
import { ConfigurationService, CommunicationService, MainStateService } from '@net7/boilerplate-common';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';

export class MrHomeLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private layoutState: MrLayoutStateService;

  private routeData: Data;

  private pageConfig;

  public errorTitle = _t('global#layout_error_title');

  public errorDescription = _t('global#layout_error_description');

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.mainState = payload.mainState;
    this.layoutState = payload.layoutState;
    this.routeData = payload.routeData;
    this.pageConfig = this.configuration.get(this.routeData.configId) || {};

    this.doRequest();

    // update head title
    this.updateHeadTitle();
  }

  doRequest() {
    const { sections } = this.pageConfig;
    const { configId, locale } = this.routeData;
    if (!isEmpty(sections)) {
      this.layoutState.set('content', LayoutState.LOADING);
      this.communication.request$('home', {
        method: 'POST',
        params: sections.map(({ id }) => id),
        urlParams: locale ? `?locale=${locale}` : '',
        onError: (err) => {
          console.warn(`Error loading ${configId} sections`, err.message);
          this.layoutState.set('content', LayoutState.ERROR);
        }
      }).subscribe((response) => {
        this.layoutState.set('content', LayoutState.SUCCESS);
        this.initSections(response);
      });
    } else {
      console.warn(`There are no sections configured for ${configId} layout`);
    }
  }

  initSections(response) {
    const { sections } = this.pageConfig;

    if (sections) {
      sections.forEach(({ id }) => {
        const widgetDataSource = this.getWidgetDataSource(id);
        const responseData = response[id];
        // set id
        widgetDataSource.id = id;
        // update data
        if (responseData) {
          this.one(id).update(responseData);
        }
      });
    }
  }

  private updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, pageTitle].join(' > '));
  }
}
