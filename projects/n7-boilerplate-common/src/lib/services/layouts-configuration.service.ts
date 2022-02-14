import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutsConfigurationService {
  private defaults: any = {};

  constructor(@Inject('config') private config: any) {
    if (this.config?.layouts) {
      Object.keys(this.config.layouts).forEach((key) => {
        this.set(key, this.config.layouts[key]);
      });
    }
  }

  public get = (key) => this.defaults[key];

  public set = (key, value) => { this.defaults[key] = value; }
}
