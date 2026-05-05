import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('initializes from stored browser theme and persists the value', () => {
    localStorage.setItem('theme', 'light');
    mockMatchMedia(true);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('falls back to dark when browser prefers dark and no stored value exists', () => {
    mockMatchMedia(true);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
  });

  it('falls back to light when browser does not prefer dark and no stored value exists', () => {
    mockMatchMedia(false);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles between dark and light themes', () => {
    localStorage.setItem('theme', 'dark');
    mockMatchMedia(false);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');

    service.toggle();
    TestBed.flushEffects();
    expect(service.theme()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');

    service.toggle();
    TestBed.flushEffects();
    expect(service.theme()).toBe('dark');
  });

  it('does not touch browser APIs on server platform', () => {
    const getItemSpy = vi.spyOn(window.localStorage, 'getItem');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
