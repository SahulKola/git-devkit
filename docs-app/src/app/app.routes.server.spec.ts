import { RenderMode } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  it('defines prerender server routes for static paths and wildcard', () => {
    expect(serverRoutes).toEqual([
      { path: '', renderMode: RenderMode.Prerender },
      { path: 'aliases', renderMode: RenderMode.Prerender },
      { path: 'installation', renderMode: RenderMode.Prerender },
      { path: '**', renderMode: RenderMode.Prerender },
    ]);
  });
});
