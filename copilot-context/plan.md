## Plan: Clean Grouped Nav + WCAG AA Upgrade

Refactor navigation into top-level grouped categories with hover/focus reveal behavior, then continue site-wide accessibility upgrades targeting WCAG AA.

### Steps

1. Baseline accessibility foundation:
- Keep a skip link and reliable main landmark in the app shell.
- Maintain high-contrast focus states and reduced-motion support in global styles.

2. Header/nav cleanup:
- Keep desktop nav top-level items minimal: Home, Identity, Craft, Flow, Learn, GitHub.
- Reveal related pages on hover and keyboard focus (focus-within) for each grouped category.
- Ensure mobile keeps grouped sections and clear link labels.

3. Landing page clarity:
- Keep content grouped by the same category model used in navigation.
- Keep call-to-action links concise and predictable.

4. Footer refresh:
- Mirror major docs sections in footer groups.
- Preserve clear external links with explicit labels.

5. Verification:
- Build docs app and check for template/style regressions.
- Keyboard walkthrough: skip link, nav, submenu access, main content, footer.
- Validate contrast and focus visibility in light/dark themes.

### Current status

- Desktop nav converted to grouped hover/focus submenus.
- GitHub nav action visually highlighted with icon.
- Footer link groups refreshed to match current docs sections.

### Notes

- This file is intentionally stored in-repo to avoid dependence on system cache paths.
- Update this plan as structure or priorities change.
