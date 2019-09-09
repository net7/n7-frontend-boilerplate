import { Component } from '@angular/core';
import { ConfigurationService } from 'n7-boilerplate-lib';
import { EventHandler } from '@n7-frontend/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'n7-boilerplate';
  public currentLayout: string = 'home';
  public useRouter: boolean;

  constructor(
    private config: ConfigurationService
  ) {

    this.useRouter = this.config.get('main').useRouter;
    
    EventHandler.globalEvents$.subscribe(({ type, payload }) => {
      if(type === 'global.navigate' && payload.handler === 'static'){
        this.currentLayout = payload.layout;
      }
    });
  }
}
