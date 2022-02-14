import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DvComponentsLibModule } from '@net7/components';

// services
import { ConfigurationService } from './services/configuration.service';
import { LayoutsConfigurationService } from './services/layouts-configuration.service';
import { MainStateService } from './services/main-state.service';
import { CommunicationService } from './services/communication.service';

// layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { Page404LayoutComponent } from './layouts/page404-layout/page404-layout';

// components
import { SmartPaginationComponent } from './components/smart-pagination/smart-pagination';

const COMPONENTS = [
  MainLayoutComponent,
  Page404LayoutComponent,
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
  exports: COMPONENTS
})
export class N7BoilerplateCommonModule {
  static forRoot(config?: any): ModuleWithProviders<N7BoilerplateCommonModule> {
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
