# How the Docs App Works

A developer-focused explanation of the Angular documentation site: its architecture, how pages are built, how routing and SSR work, and how to build and deploy it for GitHub Pages.

---

## Technology stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | 21 |
| Language | TypeScript | ~5.9 |
| Styling | SCSS (component-scoped) | — |
| Testing | Vitest + jsdom | ~4 |
| Build | Angular CLI + esbuild | 21 |
| SSR | Angular SSR + Express | — |
| Hosting | GitHub Pages (static export) | — |
| Package manager | pnpm | 10 |

---

## Directory structure

```
docs-app/
├── src/
│   ├── main.ts                 ← browser entry point
│   ├── main.server.ts          ← SSR entry point
│   ├── server.ts               ← Express server for SSR dev mode
│   ├── styles.scss             ← global CSS variables and resets
│   ├── index.html              ← root HTML shell
│   ├── test-setup.ts           ← Vitest test bootstrap
│   └── app/
│       ├── app.ts              ← root component (loader, scroll lock)
│       ├── app.html            ← root template (header, router-outlet, footer, loader overlay)
│       ├── app.scss            ← root styles (route loader animation)
│       ├── app.routes.ts       ← all page routes
│       ├── app.config.ts       ← browser app bootstrap (provideRouter, etc.)
│       ├── app.config.server.ts← server app bootstrap
│       ├── core/
│       │   ├── seo.service.ts  ← meta tag and title management
│       │   └── theme.service.ts← dark/light mode toggle and persistence
│       ├── layout/
│       │   ├── header.ts       ← top navigation component
│       │   ├── header.html     ← desktop nav, mobile nav, theme toggle
│       │   ├── header.scss     ← header and nav styles
│       │   ├── footer.ts       ← footer component
│       │   ├── footer.html     ← footer template
│       │   └── footer.scss     ← footer styles
│       └── pages/
│           ├── home.*          ← landing page
│           ├── installation.*  ← git-multi-ssh setup page
│           ├── multi-ssh-use-cases.* ← daily workflow examples page
│           ├── aliases.*       ← Git aliases reference
│           ├── commits.*       ← conventional commits guide
│           ├── stories.*       ← real-world stories
│           ├── workflows.*     ← Git workflow patterns
│           ├── branching.*     ← branching strategy
│           └── bytes.*         ← advanced Git concepts
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.json
├── angular.json                ← Angular CLI configuration
├── tsconfig.json               ← root TypeScript config
└── package.json                ← scripts and dependencies
```

---

## Angular 21 architecture patterns used

### Standalone components

Every component in this app uses the Angular 21 standalone pattern — no `NgModule` declarations. Each component declares its own `imports` array:

```ts
@Component({
  selector: 'app-installation',
  imports: [RouterLink],        // only what this component needs
  templateUrl: './installation.html',
  styleUrl: './installation.scss',
})
export class Installation {}
```

This keeps components self-contained and makes it easy to know exactly what each file depends on.

### Signals

State that drives the template is managed with Angular Signals instead of traditional class properties or `BehaviorSubject`. Signals update the DOM fine-grainedly without triggering full change detection cycles.

Example in `app.ts`:
```ts
readonly isRouteLoading = signal(false);
```

In the template:
```html
@if (isRouteLoading()) { ... }
```

### Control flow syntax (@if, @for)

Angular 21 uses the new built-in control flow syntax instead of structural directives:

```html
@if (isRecommended('script')) {
  <article class="recommended">...</article>
} @else {
  <article>...</article>
}

@for (alias of visibleCategories(); track alias.name) {
  <div>{{ alias.name }}</div>
}
```

---

## Routing

All routes are defined in `app.routes.ts` using lazy-loaded components:

```ts
{
  path: 'installation',
  loadComponent: () => import('./pages/installation').then(m => m.Installation),
  title: 'Git Multi-SSH Setup Guide',
}
```

**Lazy loading** means the JavaScript for the installation page is only downloaded when a user navigates to `/installation`. This keeps the initial page load fast.

**Route-based code splitting** is handled automatically by Angular's build system — each `loadComponent` becomes a separate JS chunk in the build output.

The `title` field sets the browser tab title and is used by the SEO service to update `<title>` and Open Graph meta tags.

---

## Route transition loader

When a user navigates to a new page, a full-screen loader overlay appears for at least 2200ms. This is wired in `app.ts`:

```ts
this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
  if (event instanceof NavigationStart) {
    this.loaderShownAt = Date.now();
    this.isRouteLoading.set(true);
  }

  if (event instanceof NavigationEnd || ...) {
    const elapsed = Date.now() - this.loaderShownAt;
    const remaining = Math.max(2200 - elapsed, 0);
    setTimeout(() => this.isRouteLoading.set(false), remaining);
  }
});
```

The `effect()` in the constructor locks body scroll while loading:
```ts
effect(() => {
  document.body.style.overflow = this.isRouteLoading() ? 'hidden' : '';
});
```

The loader itself is an SVG DAG graph animation (CSS keyframes) that traverses a git commit graph — git-themed branding.

---

## Theme service

`core/theme.service.ts` manages dark/light mode:

1. On startup: reads the saved preference from `localStorage` (key: `theme`)
2. Falls back to `prefers-color-scheme` from the OS
3. Applies `data-theme="dark"` or `data-theme="light"` on `<html>`
4. Saves the new preference to `localStorage` when toggled

All colours are CSS custom properties under `:root[data-theme="dark"]` and `:root[data-theme="light"]` in `styles.scss`.

---

## SEO service

`core/seo.service.ts` listens to router navigation events and on each `NavigationEnd`:
1. Reads the route's `title` field
2. Sets `document.title`
3. Updates `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:url">` etc.

This ensures each page has correct meta tags for search engines and social media link previews, even though Angular is a single-page app.

---

## OS detection in installation pages

The `Installation` and `Aliases` components both detect the user's OS at runtime to surface the most relevant setup option first:

```ts
private detectOs(): DetectedOs {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = (
    nav.userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent || ''
  ).toLowerCase();

  if (platform.includes('mac')) return 'macos';
  if (platform.includes('win')) return 'windows';
  if (platform.includes('linux') || platform.includes('x11')) return 'linux';
  return 'unknown';
}
```

`userAgentData` is the modern API (available in Chrome 90+). The code falls back to the older `navigator.platform` for broader compatibility.

---

## Build system

### Development

```bash
cd docs-app
pnpm start                # ng serve — hot reload dev server at localhost:4200
```

Angular CLI starts a Vite-based dev server. Changes to `.ts`, `.html`, or `.scss` files are reflected instantly.

### Production build

```bash
pnpm run build:prod       # ng build --configuration production
```

What happens during build:
1. TypeScript is compiled and type-checked
2. Angular templates are compiled to optimised JavaScript
3. CSS is extracted, minified, and hashed
4. esbuild bundles and tree-shakes the output
5. Each lazy-loaded route becomes a separate `chunk-<hash>.js` file
6. `index.csr.html` and `index.html` are output to `dist/docs-app/browser/`
7. A server bundle is produced at `dist/docs-app/server/` for SSR use

### GitHub Pages build

```bash
pnpm run build:ghpages    # ng build --configuration production --base-href /git-devkit/
```

The `--base-href /git-devkit/` flag tells Angular to prefix all asset URLs with `/git-devkit/`. This is required because GitHub Pages serves the site at `https://username.github.io/git-devkit/` rather than at the root `/`.

Without this flag, the browser would try to load `/chunk-xyz.js` instead of `/git-devkit/chunk-xyz.js` and every asset would 404.

### OG image generation

Before building, the `generate:og` script runs:

```bash
pnpm run generate:og   # node ../scripts/generate-og-images.js
```

This creates Open Graph preview images for social media sharing. The script uses `sharp` (a Node.js image library) to render images for each page. These are output to `public/` and referenced in the SEO meta tags.

---

## Static site output (SSR + outputMode: static)

The `angular.json` build config includes:

```json
"outputMode": "static",
"ssr": {
  "entry": "src/server.ts"
}
```

In static output mode with SSR, Angular pre-renders each known route at build time and outputs a corresponding `.html` file. This means:
- `dist/docs-app/browser/index.html` — home page, pre-rendered
- `dist/docs-app/browser/installation/index.html` — installation page, pre-rendered
- etc.

GitHub Pages serves these as static HTML files. When a user visits a URL, they get the pre-rendered HTML instantly (fast first paint), and then Angular takes over as a client-side app for subsequent navigation (fast routing).

This is the best of both worlds: SEO-friendly, fast initial load, and smooth client-side navigation.

---

## Testing

Tests use **Vitest** with **jsdom**:

```bash
pnpm test               # run tests in watch mode
pnpm run test:coverage  # run once with coverage report
```

Test files sit alongside source files (e.g. `app.spec.ts` next to `app.ts`). The test setup in `src/test-setup.ts` bootstraps Angular's testing environment with jsdom.

Coverage output goes to `coverage/docs-app/` and includes an HTML report at `coverage/docs-app/index.html`.

---

## Deployment to GitHub Pages

After running `pnpm run build:ghpages`:

```bash
cd docs-app
npx gh-pages -d dist/docs-app/browser
```

The `gh-pages` tool:
1. Checks out (or creates) a `gh-pages` branch in the repository
2. Copies all files from `dist/docs-app/browser/` into it
3. Commits with a message like `Updates`
4. Pushes to `origin/gh-pages`

GitHub Pages then automatically serves whatever is on the `gh-pages` branch at `https://sahulkola.github.io/git-devkit/`.

---

## Adding a new page

To add a new content page:

1. Create `src/app/pages/my-page.ts` (component), `my-page.html` (template), `my-page.scss` (styles)
2. Add the route in `app.routes.ts`:
   ```ts
   {
     path: 'my-page',
     loadComponent: () => import('./pages/my-page').then(m => m.MyPage),
     title: 'My Page Title',
   }
   ```
3. Optionally add a nav link in `layout/header.html`
4. The build system picks up the new file automatically — no module registration needed

---

## Key Angular version notes

This app targets Angular 21 which includes:
- Built-in control flow (`@if`, `@for`, `@switch`) — no `*ngIf` or `*ngFor` directives needed
- Standalone components as the default — no `NgModule`
- Signals API stable — reactive state without zone.js overhead
- `takeUntilDestroyed(destroyRef)` — automatic RxJS cleanup without implementing `OnDestroy`
- `@angular/build` with esbuild — significantly faster builds than the webpack-based builder
