import { Component, DestroyRef, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from './layout/header';
import { Footer } from './layout/footer';
import { SEOService } from './core/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly isRouteLoading = signal(false);
  private readonly minLoaderDurationMs = 2200;
  private loaderShownAt = 0;
  private hideLoaderTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private seoService: SEOService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
    // SEO service is initialized and manages meta tags
    this.initializeRouteLoader();
    this.destroyRef.onDestroy(() => {
      if (this.hideLoaderTimeout) {
        clearTimeout(this.hideLoaderTimeout);
      }
    });
  }

  private initializeRouteLoader(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.hideLoaderTimeout) {
          clearTimeout(this.hideLoaderTimeout);
        }
        this.loaderShownAt = Date.now();
        this.isRouteLoading.set(true);
        return;
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        if (this.hideLoaderTimeout) {
          clearTimeout(this.hideLoaderTimeout);
        }

        const elapsed = Date.now() - this.loaderShownAt;
        const remaining = Math.max(this.minLoaderDurationMs - elapsed, 0);

        // Keep loader visible for at least one full animation cycle.
        this.hideLoaderTimeout = setTimeout(() => {
          this.isRouteLoading.set(false);
        }, remaining);
      }
    });
  }
}
