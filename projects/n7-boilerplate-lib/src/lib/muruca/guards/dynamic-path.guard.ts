import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MrMenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root',
})
export class DynamicPathGuard implements CanActivate {
  constructor(
    private menuService: MrMenuService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const { url } = state;
    if (!this.menuService.isDynamicPath(url)) {
      const { notFoundPath } = next.data;
      this.router.navigate([notFoundPath ? `/${notFoundPath}` : '/']);
      return false;
    }
    return true;
  }
}
