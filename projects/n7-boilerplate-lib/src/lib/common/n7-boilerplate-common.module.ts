import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { DvComponentsLibModule } from '@n7-frontend/components';

// services
import { ConfigurationService } from './services/configuration.service';
import { MainStateService } from './services/main-state.service';

// layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

const COMPONENTS = [
  MainLayoutComponent
];


@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
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
        { provide: 'config', useValue: config }
      ]
    }
  }
}
