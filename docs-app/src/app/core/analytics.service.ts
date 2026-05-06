import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  /**
   * Your GA4 Measurement ID.
   * Replace this value with the one from your GA4 property.
   * Format: G-XXXXXXXXXX
   *
   * See handbook/analytics/SETUP.md for setup instructions.
   */
  private readonly measurementId = 'G-D1EWN5N5HK';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  /**
   * Call once from App constructor.
   * Safe to call on the server — all gtag() calls are guarded by isPlatformBrowser.
   */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.trackRouteChanges();
  }

  private trackRouteChanges(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {
        this.pageView(event.urlAfterRedirects);
      });
  }

  /** Send a page_view hit — called automatically on every route change. */
  pageView(path: string): void {
    if (!this.isReady()) return;
    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      send_to: this.measurementId,
    });
  }

  /**
   * Send a custom event.
   * Usage: analyticsService.event('cta_click', { label: 'install_guide' });
   */
  event(name: string, params?: Record<string, unknown>): void {
    if (!this.isReady()) return;
    window.gtag?.('event', name, { ...params, send_to: this.measurementId });
  }

  private isReady(): boolean {
    return isPlatformBrowser(this.platformId) && typeof window.gtag === 'function';
  }
}
