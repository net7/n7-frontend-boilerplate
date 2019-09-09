import { LayoutBuilder } from '@n7-frontend/core';

export abstract class AbstractLayout {
  protected config: any;
  protected widgets: any[]; 
  public lb: any;
  
  constructor(config: any){
    this.config = config;
    this.widgets = this.config.widgets; 
    this.lb = new LayoutBuilder(this.config.layoutId);
  }

  protected initPayload(): any {};

  protected onInit(){
    // on ready
    this.lb.ready$.subscribe(() => {
      this.lb.eventHandler.emitInner('init', this.initPayload());
    });

    this.lb.init({
      widgetsConfig: this.widgets,
      widgetsDataSources: this.config.widgetsDataSources,
      widgetsEventHandlers: this.config.widgetsEventHandlers,
      dataSource: new this.config.layoutDS(),
      eventHandler: new this.config.layoutEH(),
    });
  }

  protected onDestroy(){
    this.lb.eventHandler.emitInner('destroy');
  }
}