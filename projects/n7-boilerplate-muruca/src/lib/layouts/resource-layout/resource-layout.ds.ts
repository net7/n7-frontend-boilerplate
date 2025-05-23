import { Data } from '@angular/router';
import { LayoutDataSource, _t } from '@net7/core';
import { Observable } from 'rxjs';
import {
  ConfigurationService, CommunicationService, MainStateService, helpers
} from '@net7/boilerplate-common';
import { MrLocaleService } from '../../services/locale.service';
import linksHelper from '../../helpers/links-helper';

export class MrResourceLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private mainState: MainStateService;

  private localeService: MrLocaleService;

  private routerData: Data;

  private pageConfig: any;

  public tabConfig: any;

  public id: string;

  public tab: string;

  public slug: string;

  public errorTitle = _t('global#layout_error_title');

  public errorDescription = _t('global#layout_error_description');

  public hasContextMenu: () => boolean;

  private tabsContent: any;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.mainState = payload.mainState;
    this.localeService = payload.localeService;
    this.routerData = payload.routerData;
    this.pageConfig = this.configuration.get(this.routerData.configId);

    // tabs config
    const tabs = this.configuration.get('tabs');
    const pageTabs = this.pageConfig.tabs;
    if (tabs && pageTabs) {
      this.tabConfig = tabs[pageTabs];
    }

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
    const { locale } = this.routerData;
    const params = linksHelper.getQueryParams(document.location.search);
    const { top, content } = this.pageConfig.sections;
    const sections = top.concat(content);
    return this.communication.request$('resource', {
      onError,
      method: 'POST',
      params: {
        id,
        type: this.pageConfig.type,
        sections: sections.map((s) => s.id),
      },
      queryParams: params,
      urlParams: locale ? `?locale=${locale}` : '',
    });
  }

  /** Request the configured widgets data in PDF format */
  pdfRequest$(id): Observable<any> {
    const { locale } = this.routerData;
    const params = linksHelper.getQueryParams(document.location.search);
    let sections;
    if (this.tabsContent) {
      const { top } = this.pageConfig.sections;
      sections = top.map((s) => s.id).concat(this.tabsContent);
    } else {
      const { top, content } = this.pageConfig.sections;
      sections = top.concat(content).map((s) => s.id);
    }
    return this.communication.request$('getPdf', {
      onError: (e) => console.error('getPdf', e),
      method: 'POST',
      params: {
        id,
        type: this.pageConfig.type,
        sections
      },
      queryParams: params,
      urlParams: locale ? `?locale=${locale}` : '',
      httpOptions: {
        responseType: 'blob'
      }
    });
  }

  handleResponse(response) {
    this.initSections(response);
    this.setLocaleResourceConfig(response);
    this.updateHeadTitle(response);
  }

  /** Load all the configured widgets */
  private initSections(response) {
    const { top, content } = this.pageConfig.sections;
    const sections = top.concat(content);
    sections.forEach(({
      id, type, tools, options
    }) => {
      // update section datasource
      const widgetDataSource = this.getWidgetDataSource(id);
      if (!widgetDataSource) return;
      const responseSection = response.sections[id];
      // set id
      widgetDataSource.id = id;
      if (type === 'tabs') {
        this.tabConfig = this.tabConfig.map((tab: any) => ({
          id: tab.id,
          label: tab.label,
          hideTab: (responseSection && responseSection.includes(tab.id))
        }));
      }
      // check viewer tools
      if (type === 'viewer') {
        // update image viewer options
        this.one(id).updateOptions({ tools });
      }
      if (type === 'viewer-iiif') {
        // update image viewer iiif options
        const { libOptions } = options;
        this.hasContextMenu = () => !!libOptions['context-menu'];
        this.one(id).updateOptions({ libOptions });
      }

      if (type === 'text-viewer') {
        let url;
        try {
          url = this.communication.getUrl('xmlSearch');
        } catch (e) {
          url = '';
          // do nothing
        }
        const searchApi = {
          url,
          'resource-id': this.id
        };

        options.searchApi = searchApi;
        this.one(id).updateOptions(options);
      }
      // update data
      if (responseSection && !helpers.isEmpty(responseSection)) {
        this.one(id).update(responseSection);
      } else {
        // unload the component without data
        this.one(id).update(undefined);
      }

      // init viewer overlay details
      if (type === 'viewer') {
        const overlayDetailsId = `${id}-overlay-details`;
        const widgetOverlayDetailsDS = this.getWidgetDataSource(overlayDetailsId);
        if (!widgetOverlayDetailsDS) return;
        // set id
        widgetOverlayDetailsDS.id = overlayDetailsId;
      }
      // image viewer tools check
      if (type === 'viewer' && tools) {
        const toolsId = `${id}-tools`;
        // update image viewer tools datasource
        const widgetToolsDataSource = this.getWidgetDataSource(toolsId);
        if (!widgetToolsDataSource) return;
        // set id
        widgetToolsDataSource.id = toolsId;
        // update data
        if (responseSection && !helpers.isEmpty(responseSection)) {
          this.one(toolsId).update(responseSection);
        } else {
          // unload the component without data
          this.one(toolsId).update(undefined);
        }
      }
    });

    // update tabs
    if (this.tabConfig) {
      const tabSection = sections.find(({ type }) => type === 'tabs');
      if (tabSection?.options?.tabsContents) {
        this.tabsContent = tabSection.options.tabsContents;
      }
      this.one(tabSection.id).updateOptions({
        id: this.id,
        root: this.pageConfig.tabs,
        slug: this.slug,
        currentTab: this.tab,
        localeService: this.localeService
      });
      this.one(tabSection.id).update(this.tabConfig);
    }
  }

  // set resource locale config
  // used by language switcher
  private setLocaleResourceConfig(response) {
    if (response?.locale) {
      this.localeService.setResourceConfig(response.locale);
    }
  }

  private updateHeadTitle({ title: resourceTitle }) {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle), resourceTitle].join(' > '));
  }
}
