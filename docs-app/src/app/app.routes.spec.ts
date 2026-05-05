import { routes } from './app.routes';
import { Home } from './pages/home';
import { Installation } from './pages/installation';
import { Aliases } from './pages/aliases';
import { Commits } from './pages/commits';
import { Stories } from './pages/stories';
import { Workflows } from './pages/workflows';
import { Branching } from './pages/branching';
import { Bytes } from './pages/bytes';

describe('routes', () => {
  it('defines all expected route paths and fallback redirect', () => {
    const paths = routes.map((route) => route.path);

    expect(paths).toEqual([
      '',
      'installation',
      'aliases',
      'commits',
      'stories',
      'workflows',
      'branching',
      'bytes',
      '**',
    ]);

    const fallback = routes.at(-1);
    expect(fallback?.redirectTo).toBe('');
  });

  it('lazily loads each page component', async () => {
    await expect(routes[0].loadComponent?.()).resolves.toBe(Home);
    await expect(routes[1].loadComponent?.()).resolves.toBe(Installation);
    await expect(routes[2].loadComponent?.()).resolves.toBe(Aliases);
    await expect(routes[3].loadComponent?.()).resolves.toBe(Commits);
    await expect(routes[4].loadComponent?.()).resolves.toBe(Stories);
    await expect(routes[5].loadComponent?.()).resolves.toBe(Workflows);
    await expect(routes[6].loadComponent?.()).resolves.toBe(Branching);
    await expect(routes[7].loadComponent?.()).resolves.toBe(Bytes);
  });

  it('contains stable route titles for SEO and navigation', () => {
    const titles = routes.slice(0, 8).map((route) => route.title);

    expect(titles).toEqual([
      'git-devkit - Complete Git Mastery Toolkit',
      'Git Multi-SSH Setup Guide',
      'Git Aliases - Complete Reference',
      'Conventional Commits - Professional Commit Standards',
      'Real-World Stories - git-devkit Impact',
      'Git Workflows - Feature Branch, GitHub Flow, Gitflow, Trunk',
      'Branching Strategy - Naming, Lifecycle, Merge Strategies',
      'git-bytes - Advanced Git Concepts',
    ]);
  });
});
