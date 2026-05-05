import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { Installation } from './installation';
import { Commits } from './commits';
import { Stories } from './stories';
import { Workflows } from './workflows';
import { Branching } from './branching';
import { Bytes } from './bytes';
import { Aliases } from './aliases';

describe('Pages', () => {
  it('creates all simple page components', async () => {
    const components = [Home, Installation, Commits, Stories, Workflows, Branching, Bytes];

    for (const component of components) {
      await TestBed.configureTestingModule({
        imports: [component],
        providers: [provideRouter([])],
      }).compileComponents();

      const fixture = TestBed.createComponent(component);
      fixture.detectChanges();

      expect(fixture.componentInstance).toBeTruthy();
      TestBed.resetTestingModule();
    }
  });

  it('exposes alias shortcut and category datasets', async () => {
    await TestBed.configureTestingModule({
      imports: [Aliases],
    }).compileComponents();

    const fixture = TestBed.createComponent(Aliases);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    const topShortcuts = component.topShortcuts();
    const categories = component.categories();

    expect(topShortcuts.length).toBe(10);
    expect(topShortcuts[0].command).toBe('git s');

    expect(categories.length).toBeGreaterThan(5);
    expect(categories[0].name).toBe('Shorthand');
    expect(categories.some((category: any) => category.name === 'Rebase & Advanced')).toBe(true);
    expect(categories.some((category: any) => category.aliases.some((alias: any) => alias.command === 'git publish'))).toBe(true);
  });
});
