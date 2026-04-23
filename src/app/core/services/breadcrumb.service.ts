import { Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  readonly breadcrumbs = signal<BreadcrumbItem[]>([]);
  private visitedTrail: BreadcrumbItem[] = [];
  private readonly sidebarRootUrls = new Set([
    '/ticket-main',
    '/ticket-history',
    '/my-workspace',
    '/control-panel',
    '/dashboard',
    '/user-admin',
    '/notifications',
  ]);

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null)
      )
      .subscribe(() => this.updateTrail());
  }

  private updateTrail(): void {
    const currentUrl = this.normalizeUrl(this.router.url);
    const currentLabel = this.getActiveBreadcrumbLabel(this.router.routerState.snapshot.root);

    if (!currentLabel) {
      this.visitedTrail = [];
      this.breadcrumbs.set([]);
      return;
    }

    if (this.isSidebarRootUrl(currentUrl)) {
      this.visitedTrail = [{
        label: currentLabel,
        url: currentUrl,
        isActive: true,
      }];
      this.breadcrumbs.set(this.visitedTrail);
      return;
    }

    const existingIndex = this.visitedTrail.findIndex((item) => item.url === currentUrl);

    if (existingIndex >= 0) {
      this.visitedTrail = this.visitedTrail.slice(0, existingIndex + 1);
    } else {
      this.visitedTrail.push({
        label: currentLabel,
        url: currentUrl,
        isActive: false,
      });
    }

    this.breadcrumbs.set(
      this.visitedTrail.map((item, index) => ({
        ...item,
        isActive: index === this.visitedTrail.length - 1,
      }))
    );
  }

  private getActiveBreadcrumbLabel(snapshot: ActivatedRouteSnapshot): string | null {
    let current: ActivatedRouteSnapshot | null = snapshot;
    let latestLabel: string | null = null;

    while (current) {
      const breadcrumb = current.data?.['breadcrumb'];
      if (typeof breadcrumb === 'string' && breadcrumb.trim().length > 0) {
        latestLabel = breadcrumb;
      }
      current = current.firstChild ?? null;
    }

    return latestLabel;
  }

  private isSidebarRootUrl(url: string): boolean {
    return this.sidebarRootUrls.has(url);
  }

  private normalizeUrl(url: string): string {
    const cleanUrl = url.split('?')[0].split('#')[0];
    if (cleanUrl.length > 1 && cleanUrl.endsWith('/')) {
      return cleanUrl.slice(0, -1);
    }
    return cleanUrl;
  }
}
