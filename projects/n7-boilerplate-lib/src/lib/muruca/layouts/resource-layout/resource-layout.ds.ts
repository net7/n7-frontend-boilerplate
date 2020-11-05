import { LayoutDataSource, _t } from '@n7-frontend/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrResourceLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService

  private configId: string;

  private pageConfig: any;

  public tabConfig: any;

  public id: string;

  public tab: string;

  public slug: string;

  public errorTitle = _t('global#layout_error_title');

  public errorDescription = _t('global#layout_error_description');

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);
    this.tabConfig = this.configuration.get('tabs')[this.pageConfig.tabs];

    // add translations
    ['top', 'content'].forEach((type) => {
      this.pageConfig.sections[type] = this.pageConfig.sections[type].map((section) => ({
        ...section,
        title: _t(section.title)
      }));
    });
  }

  /** Request the configured widgets data */
  pageRequest$(id, onError: (err: any) => void): Observable<any> {
    const { top, content } = this.pageConfig.sections;
    const sections = top.concat(content);
    return this.communication.request$('resource', {
      onError,
      method: 'POST',
      params: {
        id,
        type: this.pageConfig.type,
        sections: sections.map((s) => s.id),
      }
    });
  }

  handleResponse(response) {
    this.initSections(response);
    this.updateHeadTitle(response);
  }

  /** Load all the configured widgets */
  private initSections(response) {
    const { top, content } = this.pageConfig.sections;
    const sections = top.concat(content);
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

    // update tabs
    if (this.tabConfig) {
      const tabSection = sections.find(({ type }) => type === 'tabs');
      this.one(tabSection.id).updateOptions({
        id: this.id,
        root: this.pageConfig.tabs,
        slug: this.slug,
        currentTab: this.tab
      });
      this.one(tabSection.id).update(this.tabConfig);
    }
  }

  private updateHeadTitle({ title: resourceTitle }) {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle), resourceTitle].join(' > '));
  }
}
