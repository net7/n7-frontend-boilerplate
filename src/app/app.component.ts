import { Component } from '@angular/core';
import { ConfigurationService } from 'n7-boilerplate-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'n7-boilerplate';

  constructor(
    private config: ConfigurationService
  ) {
    console.log('component', this.config.get('main'));
  }
}
