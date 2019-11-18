import { EventHandler } from '@n7-frontend/core';

export class AwTreeEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if(payload && typeof payload.source != 'undefined'){
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
        switch( type ){
          case 'aw-sidebar-header.click': this.dataSource.toggleSidebar(); break;
          case 'aw-scheda-layout.selectItem':
            this.dataSource.selectTreeItem( payload );
            if (typeof this.dataSource.currentItem !== 'undefined') {
              this.dataSource.updateTree( null, this.dataSource.currentItem.payload.toggle.parents, payload );
            } else {
              console.warn('The object in the URL does not exist.')
              // Maybe navigate to 404 here.
            }
            break;
          case 'aw-scheda-layout.navigationresponse':
            this.dataSource.parseData(payload); break;
          }
      });
  }

}