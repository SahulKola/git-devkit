# Analytics Setup — Google Analytics 4

## Why GA4?

| Feature | GA4 |
|---|---|
| Cost | Free forever |
| Regional / geo breakdown | ✅ Country, city, continent |
| Device & OS breakdown | ✅ Desktop, mobile, tablet |
| Page-view tracking (SPA) | ✅ Custom events per route |
| Real-time dashboard | ✅ Up to 30 min delay |
| Funnel & conversion reports | ✅ |
| Data retention (free) | 2 months (expandable to 14 months) |
| Self-hosting required | No |
| Sign-up required | Google account |

---

## Step 1 — Create a GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com) and sign in with your Google account.
2. Click **Admin** (gear icon, bottom-left).
3. In the **Account** column → **Create Account** → name it `git-devkit`.
4. In the **Property** column → **Create Property** → name it `git-devkit docs`.
   - Set **Reporting time zone** to your local timezone.
   - Set **Currency** to your preference.
5. Choose **Web** as the platform.
6. Enter the site URL: `https://sahulkola.github.io` and stream name `git-devkit`.
7. Click **Create stream**.

You will land on the **Web stream details** page. Copy the **Measurement ID** — it looks like:

```
G-XXXXXXXXXX
```

---

## Step 2 — Add Your Measurement ID to the Code

There are **two** places to update. Both currently contain the placeholder `G-XXXXXXXXXX`.

### 2a. `docs-app/src/index.html`

Find the two occurrences of `G-XXXXXXXXXX` in the GA4 script block and replace them with your real ID:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123DEF4', { send_page_view: false });
</script>
```

### 2b. `docs-app/src/app/core/analytics.service.ts`

Update the `measurementId` constant:

```ts
private readonly measurementId = 'G-ABC123DEF4';
```

---

## Step 3 — Build & Deploy

```bash
# From the project root:
cd docs-app
pnpm run build:ghpages

# Or kick off the full release:
cd ..
npm run release
```

After the GitHub Pages deploy completes (usually 1–3 minutes), visit your site and trigger a few page navigations. Then in GA4 go to **Reports → Realtime** to confirm hits are arriving.

---

## What Is Already Tracked

The `AnalyticsService` (`docs-app/src/app/core/analytics.service.ts`) automatically fires a `page_view` event on every Angular route change including:

| Route | GA4 Page Path |
|---|---|
| Home | `/` |
| Installation | `/installation` |
| Aliases | `/aliases` |
| Commits | `/commits` |
| Workflows | `/workflows` |
| Branching | `/branching` |
| Stories | `/stories` |
| Bytes | `/bytes` |

Each event carries:
- `page_path` — Angular route URL
- `page_location` — full `window.location.href`
- `page_title` — `document.title` at the time of navigation

---

## Tracking Custom Events (Optional)

Inject `AnalyticsService` into any component and call `.event()`:

```ts
import { AnalyticsService } from '../core/analytics.service';

@Component({ ... })
export class InstallationPage {
  private analytics = inject(AnalyticsService);

  onCTAClick(): void {
    this.analytics.event('cta_click', { label: 'install_guide', page: '/installation' });
  }
}
```

Recommended events to add over time:

| User action | Event name | Suggested params |
|---|---|---|
| CTA button click | `cta_click` | `label`, `destination` |
| External link click | `outbound_link` | `url` |
| Code block copy | `copy_code` | `alias`, `page` |
| Theme toggle | `theme_toggle` | `theme` |

---

## Key GA4 Reports to Check

### Geographic / Regional

**Reports → User → User attributes → Demographic details**

- Change dimension to **Country** or **City**.
- See which regions drive the most traffic.

### Pages

**Reports → Engagement → Pages and screens**

- Top pages by views, average engagement time, scroll depth.

### Devices

**Reports → Tech → Overview**

- Browser, OS, device category breakdown.

### Real-time

**Reports → Realtime**

- Live user count, top pages right now, geographic map.

### Acquisition

**Reports → Acquisition → Traffic acquisition**

- Where visitors come from: organic search, direct, referral, social.

---

## Data Retention Settings (Important)

By default GA4 retains event data for only **2 months**. Extend this to 14 months:

1. GA4 → **Admin → Data Settings → Data Retention**.
2. Set **Event data retention** to **14 months**.
3. Click **Save**.

Do this immediately after property creation.

---

## Privacy & GDPR Note

The site does not currently include a cookie consent banner. GA4 uses cookies (`_ga`, `_ga_XXXXXXXX`) by default.

If you want full compliance for EU/EEA visitors:
- Add a consent banner (e.g. [CookieYes free tier](https://www.cookieyes.com/)) before GA4 fires.
- Or enable [GA4 Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent) which models data for non-consenting users.

For a developer docs site with no personal data collection, the risk is low — but noted here for completeness.

---

## Complementary Free Tool — Microsoft Clarity

[Microsoft Clarity](https://clarity.microsoft.com) is a completely free heatmap and session-recording tool that pairs well with GA4:

- Click / scroll heatmaps per page
- Session recordings (full user journey replays)
- "Dead click" and "rage click" detection
- No data sampling

To add Clarity:
1. Sign up at [clarity.microsoft.com](https://clarity.microsoft.com).
2. Create a project → copy the Clarity tracking snippet.
3. Paste it just before `</head>` in `docs-app/src/index.html`.
4. No Angular service needed — Clarity auto-tracks all clicks and navigation.

---

## Summary Checklist

- [ ] Created GA4 property and got Measurement ID (`G-XXXXXXXXXX`)
- [ ] Replaced placeholder in `docs-app/src/index.html` (2 occurrences)
- [ ] Replaced placeholder in `docs-app/src/app/core/analytics.service.ts` (1 occurrence)
- [ ] Built and deployed: `npm run release` or `pnpm run build:ghpages`
- [ ] Verified Realtime report shows live hits
- [ ] Extended data retention to 14 months in GA4 settings
- [ ] (Optional) Added Microsoft Clarity for heatmaps
