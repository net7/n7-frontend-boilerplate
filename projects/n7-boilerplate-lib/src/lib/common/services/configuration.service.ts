import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private defaults: any = {};

  constructor(@Inject('config') private config: any){
    this.set('main', this.config);
  }

  public get = (key) => this.defaults[key];
  public set = (key, value) => this.defaults[key] = value;
}