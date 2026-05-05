import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly themeService = inject(ThemeService);
  protected readonly menuOpen = signal(false);
  protected readonly mobileMenuId = 'mobile-primary-nav';
  protected readonly openMobileGroup = signal<string | null>(null);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.openMobileGroup.set(null);
  }

  toggleMobileGroup(group: string): void {
    this.openMobileGroup.update(current => (current === group ? null : group));
  }

  /** Blur the focused nav trigger after clicking a submenu link so the submenu closes. */
  closeActiveNav(): void {
    (document.activeElement as HTMLElement | null)?.blur();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
