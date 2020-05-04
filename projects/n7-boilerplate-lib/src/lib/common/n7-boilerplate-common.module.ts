import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { DvComponentsLibModule } from '@n7-frontend/components';

// services
import { ConfigurationService } from './services/configuration.service';
import { LayoutsConfigurationService } from './services/layouts-configuration.service';
import { MainStateService } from './services/main-state.service';
import { CommunicationService } from './services/communication.service';

// layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { Page404LayoutComponent } from './layouts/page404-layout/page404-layout';

// components
import { FacetsWrapperComponent } from './components/facets-wrapper/facets-wrapper';
import { SmartPaginationComponent } from './components/smart-pagination/smart-pagination';

const COMPONENTS = [
  MainLayoutComponent,
  Page404LayoutComponent,
  FacetsWrapperComponent,
  SmartPaginationComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    HttpClientModule,
    DvComponentsLibModule,
  ],
  providers: [],
  entryComponents: COMPONENTS,
  exports: COMPONENTS,
})
export class N7BoilerplateCommonModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: N7BoilerplateCommonModule,
      providers: [
        MainStateService,
        ConfigurationService,
        LayoutsConfigurationService,
        CommunicationService,
        { provide: 'config', useValue: config },
      ],
    };
  }
}
