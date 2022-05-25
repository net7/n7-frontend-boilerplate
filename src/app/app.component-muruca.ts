import { Component } from '@angular/core';

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
export class AppComponent { }
