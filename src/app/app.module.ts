import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { N7BoilerplateCommonModule } from 'n7-boilerplate-lib';
import mainConfig from './config/main.config';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    N7BoilerplateCommonModule.forRoot(mainConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
