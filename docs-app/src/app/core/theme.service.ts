import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly theme = signal<Theme>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(stored ?? (prefersDark ? 'dark' : 'light'));
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const t = this.theme();
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
      }
    });
  }

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }
}
