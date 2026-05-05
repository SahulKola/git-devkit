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
  readonly routeLoaderLine = signal('Rebasing the route...');
  private readonly minLoaderDurationMs = 900;
  private readonly loaderLines = [
    'Rebasing the route...',
    'Staging fresh content...',
    'Fast-forwarding your view...',
    'Resolving tiny UI deltas...',
    'Pushing pixels to HEAD...',
    'Cherry-picking this screen...',
  ];
  private readonly loaderLineIntervalMs = 700;
  private loaderShownAt = 0;
  private lastLoaderLineIndex = -1;
  private hideLoaderTimeout: ReturnType<typeof setTimeout> | undefined;
  private loaderLineInterval: ReturnType<typeof setInterval> | undefined;

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
      if (this.loaderLineInterval) {
        clearInterval(this.loaderLineInterval);
      }
    });
  }

  private initializeRouteLoader(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.hideLoaderTimeout) {
          clearTimeout(this.hideLoaderTimeout);
        }
        this.setNextLoaderLine();
        this.startLoaderLineRotation();
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
          this.stopLoaderLineRotation();
          this.isRouteLoading.set(false);
        }, remaining);
      }
    });
  }

  private startLoaderLineRotation(): void {
    if (this.loaderLineInterval) {
      clearInterval(this.loaderLineInterval);
    }

    this.loaderLineInterval = setInterval(() => {
      this.setNextLoaderLine();
    }, this.loaderLineIntervalMs);
  }

  private stopLoaderLineRotation(): void {
    if (this.loaderLineInterval) {
      clearInterval(this.loaderLineInterval);
      this.loaderLineInterval = undefined;
    }
  }

  private setNextLoaderLine(): void {
    if (this.loaderLines.length === 0) {
      return;
    }

    let nextIndex = this.lastLoaderLineIndex;
    while (nextIndex === this.lastLoaderLineIndex) {
      nextIndex = Math.floor(Math.random() * this.loaderLines.length);
      if (this.loaderLines.length === 1) {
        break;
      }
    }

    this.lastLoaderLineIndex = nextIndex;
    this.routeLoaderLine.set(this.loaderLines[nextIndex]);
  }
}
