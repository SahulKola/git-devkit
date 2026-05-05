import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';
import { routes } from '../app.routes';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('toggles and closes mobile menu state', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance as any;

    expect(component.menuOpen()).toBe(false);
    expect(component.openMobileGroup()).toBeNull();

    component.toggleMenu();
    expect(component.menuOpen()).toBe(true);

    component.toggleMenu();
    expect(component.menuOpen()).toBe(false);

    component.toggleMobileGroup('guides');
    expect(component.openMobileGroup()).toBe('guides');

    component.toggleMobileGroup('guides');
    expect(component.openMobileGroup()).toBeNull();

    component.toggleMobileGroup('aliases');
    expect(component.openMobileGroup()).toBe('aliases');

    component.closeMenu();
    expect(component.menuOpen()).toBe(false);
    expect(component.openMobileGroup()).toBeNull();
  });

  it('blurs the currently focused element when closing active nav', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance as any;
    const button = document.createElement('button');

    document.body.appendChild(button);
    button.focus();

    const blurSpy = vi.spyOn(button, 'blur');

    component.closeActiveNav();

    expect(blurSpy).toHaveBeenCalled();

    button.remove();
  });

  it('closes menu when escape handler is triggered', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance as any;

    component.toggleMenu();
    component.toggleMobileGroup('commands');
    expect(component.menuOpen()).toBe(true);
    expect(component.openMobileGroup()).toBe('commands');

    component.onEscape();

    expect(component.menuOpen()).toBe(false);
    expect(component.openMobileGroup()).toBeNull();
  });

  it('exercises template click bindings and theme conditional rendering', async () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance as any;
    const closeMenuSpy = vi.spyOn(component, 'closeMenu');
    const closeActiveNavSpy = vi.spyOn(component, 'closeActiveNav');
    const toggleMenuSpy = vi.spyOn(component, 'toggleMenu');
    const toggleMobileGroupSpy = vi.spyOn(component, 'toggleMobileGroup');
    const themeToggleSpy = vi.spyOn(component.themeService, 'toggle');

    fixture.detectChanges();

    const query = (selector: string): HTMLElement => {
      const element = fixture.nativeElement.querySelector(selector) as HTMLElement | null;
      if (!element) {
        throw new Error(`Missing element for selector: ${selector}`);
      }
      return element;
    };

    const desktopThemeButton = query('.desktop-nav .theme-toggle');
    const mobileThemeButton = query('.mobile-actions .theme-toggle');
    const initialLabel = desktopThemeButton.getAttribute('aria-label') ?? '';
    expect(initialLabel.includes('light') || initialLabel.includes('dark')).toBe(true);

    desktopThemeButton.click();
    fixture.detectChanges();
    const afterFirstToggle = desktopThemeButton.getAttribute('aria-label') ?? '';
    expect(afterFirstToggle).not.toBe(initialLabel);

    // Toggle back to ensure both conditional branches render.
    desktopThemeButton.click();
    fixture.detectChanges();
    expect(desktopThemeButton.getAttribute('aria-label')).toBe(initialLabel);

    mobileThemeButton.click();
    fixture.detectChanges();

    query('.logo').click();
    fixture.detectChanges();

    query('.desktop-nav a[routerLink="/aliases"]').click();
    query('.desktop-nav a[routerLink="/commits"]').click();
    query('.desktop-nav a[routerLink="/workflows"]').click();
    query('.desktop-nav a[routerLink="/branching"]').click();
    query('.desktop-nav a[routerLink="/stories"]').click();
    query('.desktop-nav a[routerLink="/bytes"]').click();
    fixture.detectChanges();

    query('.hamburger').click();
    fixture.detectChanges();
    expect(component.menuOpen()).toBe(true);

    query('[aria-controls="mob-identity"]').click();
    fixture.detectChanges();
    expect(component.openMobileGroup()).toBe('identity');

    query('[aria-controls="mob-flow"]').click();
    fixture.detectChanges();
    expect(component.openMobileGroup()).toBe('flow');

    query('[aria-controls="mob-learn"]').click();
    fixture.detectChanges();
    expect(component.openMobileGroup()).toBe('learn');

    query('.mobile-nav a[routerLink="/installation"]').click();
    query('.mobile-nav a[routerLink="/aliases"]').click();
    query('.mobile-nav a[routerLink="/commits"]').click();
    query('.mobile-nav a[routerLink="/workflows"]').click();
    query('.mobile-nav a[routerLink="/branching"]').click();
    query('.mobile-nav a[routerLink="/stories"]').click();
    query('.mobile-nav a[routerLink="/bytes"]').click();
    query('.mobile-github a').click();
    fixture.detectChanges();
    await fixture.whenStable();

    component.closeMenu();
    fixture.detectChanges();
    expect(component.menuOpen()).toBe(false);
    expect(component.openMobileGroup()).toBeNull();
    expect(themeToggleSpy).toHaveBeenCalledTimes(3);
    expect(toggleMenuSpy).toHaveBeenCalled();
    expect(toggleMobileGroupSpy).toHaveBeenCalledWith('identity');
    expect(toggleMobileGroupSpy).toHaveBeenCalledWith('flow');
    expect(toggleMobileGroupSpy).toHaveBeenCalledWith('learn');
    expect(closeActiveNavSpy).toHaveBeenCalled();
    expect(closeMenuSpy).toHaveBeenCalled();
  });
});
