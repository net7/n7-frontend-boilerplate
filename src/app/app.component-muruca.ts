import { Component } from '@angular/core';
import { ConfigurationService } from '@net7/boilerplate-common';

@Component({
  selector: 'app-root',
  template: `
    <main-layout>
      <router-outlet></router-outlet>
      <mr-resource-modal></mr-resource-modal>
    </main-layout>
  `,
  styleUrls: []
})
export class AppComponent {
  public useRouter = true;

  constructor(
    private configuration: ConfigurationService,
  ) {
    const footer = this.configuration.get('footer');
    footer.columns[2].selects = [{
      id: 'language',
      label: 'Select language',
      options: [
        { value: 'en', label: 'English' },
        { value: 'it', label: 'Italian', selected: true },
        { value: 'de', label: 'German' }
      ],
      payload: 'locale'
    }];
  }
}
