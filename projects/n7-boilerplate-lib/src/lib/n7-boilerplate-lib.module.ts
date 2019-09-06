import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { DvComponentsLibModule } from '@n7-frontend/components';
import { N7BoilerplateLibComponent } from './n7-boilerplate-lib.component';

// services
import { ConfigurationService } from './services/configuration.service';

// layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

const COMPONENTS = [
  N7BoilerplateLibComponent,
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
export class N7BoilerplateLibModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: N7BoilerplateLibModule,
      providers: [
        ConfigurationService, 
        { provide: 'config', useValue: config }
      ]
    }
  }
}
