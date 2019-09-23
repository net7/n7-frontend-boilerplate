import { EventHandler } from '@n7-frontend/core';

export class AwTreeEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {   
      if(typeof payload.source != "undefined" && payload.source == "toggle"){
        this.dataSource.updateTree( null, payload.parents );
      }
    });

     this.outerEvents$.subscribe(({ type, payload }) => {   
        if( type == 'aw-sidebar-header.click'){
            this.dataSource.toggleSidebar();
          }
      }); 
  }

}