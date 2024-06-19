import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { NavigationStart } from '@angular/router';

export class MainLayoutEH extends EventHandler {
  private destroyed$: Subject<void> = new Subject();

  private route: any;

  private router: any;

  private mainState: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'main-layout.init':
          this.dataSource.onInit(payload);
          this.mainState = payload.mainState;
          this.route = payload.route;
          this.router = payload.router;

          this._listenRouterChanges();
          this._listenMainStateChanges();
          break;

        case 'main-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      // header events
      if (type.indexOf('header') === 0) {
        this.mainState.update('headerEvents', { type, payload });
      }
      // footer events
      if (type.indexOf('footer') === 0) {
        this.mainState.update('footerEvents', { type, payload });
      }
    });

    // listen to global events
    EventHandler.globalEvents$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(({ type, payload }) => {
      switch (type) {
        case 'global.navigate':
          this.dataSource.onNavigate(payload);
          break;

        default:
          break;
      }
    });
  }

  private _listenRouterChanges() {
    this.route.queryParams.pipe(
      filter((params) => {
        if (Object.keys(params).length) return true;
        return false;
      }),
    ).subscribe((params) => {
      this.emitGlobal('queryparams', params);
    });
    // router changed
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
    ).subscribe(() => {
      this.emitOuter('routerchange');
      this.dataSource.onRouterChanged();
    });
  }

  private _listenMainStateChanges() {
    this.mainState.addCustom('currentNav', new Subject());
    this.mainState.getCustom$('currentNav').subscribe((val) => {
      this.emitOuter('currentnavchange', val);
    });
  }
}
