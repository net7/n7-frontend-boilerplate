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
import { ApolloProvider } from './services/communication-providers/apollo/apollo.provider';

// layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

const COMPONENTS = [
  MainLayoutComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    HttpClientModule,
    DvComponentsLibModule
  ],
  providers: [],
  exports: COMPONENTS
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
        ApolloProvider, 
        { provide: 'config', useValue: config }
      ]
    }
  }
}
