import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService, MainStateService } from '@net7/boilerplate-common';
import { MrLocaleService } from '@net7/boilerplate-muruca';

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
    private localeService: MrLocaleService,
    private configuration: ConfigurationService,
    private mainState: MainStateService,
    private router: Router,
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

    this.mainState.get$('footerEvents').subscribe(({ type, payload }) => {
      if (type === 'footer.change') {
        const currentLocale = this.localeService.getLocale();
        const { value } = payload;
        if (currentLocale !== value) {
          const href = this.localeService.getLinkByLocale(value);
          this.router.navigate([href]);
        }
      }
    });
  }
}
