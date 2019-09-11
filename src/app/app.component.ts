import { Component } from '@angular/core';
import { ConfigurationService, MainStateService, CommunicationService } from 'n7-boilerplate-lib';
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
    private config: ConfigurationService,
    private mainState: MainStateService,
    private communication: CommunicationService,
  ) {

    this.useRouter = this.config.get('useRouter');

    this.communication.request$('getLastPosts', {
      onError: (error) => console.log('app error', error)
    }).subscribe(posts => {
      console.log('provider', posts);
    });

    // mainState test
    setTimeout(() => {
      this.mainState.update('subnav', ['home', 'about', 'works'].map(page => ({
        text: page.toUpperCase(), 
        payload: {
          source: 'navigate',
          handler: 'router',
          path: [`/${page}`],
          id: page
        },
        _meta: { id: page }
      })));
    });
    
    EventHandler.globalEvents$.subscribe(({ type, payload }) => {
      if(type === 'global.navigate' && payload.handler === 'static'){
        this.currentLayout = payload.layout;
      }
    });
  }
}
