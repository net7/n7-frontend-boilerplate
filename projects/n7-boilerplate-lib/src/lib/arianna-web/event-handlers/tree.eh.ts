import { EventHandler } from '@n7-frontend/core';

export class AwTreeEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if(payload && typeof payload.source != 'undefined'){
        console.log(payload.source);
        switch ( payload.source ) {
          case 'toggle':         this.dataSource.updateTree( null, payload.parents, payload.id ); break;
          case 'ToggleMenuItem': this.dataSource.updateTree( null, payload.parents, payload.id ); //no break, I want to execute also the following instruction
          case 'menuItem':       this.dataSource.selectTreeItem( payload.id );
                                 this.emitOuter('click', payload.id);
                                  break;
        }
      }
    });

     this.outerEvents$.subscribe(({ type, payload }) => {
        if( type == 'aw-sidebar-header.click'){
            this.dataSource.toggleSidebar();
          }
          else if( type == 'aw-scheda-layout.selectItem'){
            this.dataSource.selectTreeItem( payload );
            this.dataSource.updateTree( null, this.dataSource.currentItem.payload.parents, payload );
          }
      });
  }

}