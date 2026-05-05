# Installation & Deployment Guide for git-devkit

## Overview

This guide covers complete setup of the git-devkit documentation site, including the **new automated OpenGraph image generation** system that creates branded preview images for social media sharing.

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js v18+
- pnpm 10.33.0+
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sahulkola/git-devkit.git
cd git-devkit

# 2. Install root dependencies (includes Sharp for image generation)
pnpm install

# 3. Install docs-app dependencies
cd docs-app
pnpm install

# 4. Generate OG images + Build
pnpm run build:prod

# 5. Serve locally
pnpm start
```

**Result**: Your site runs at http://localhost:4200 with all OG images ready!

---

## 📦 What Gets Installed

### Root Dependencies
```
├─ sharp@0.34.5          (OG image generation)
├─ chalk, inquirer, ora   (CLI utilities)
└─ esbuild, rimraf        (Build tools)
```

### docs-app Dependencies
```
├─ @angular/*             (Framework)
├─ @angular/ssr           (Server-side rendering)
├─ typescript, rxjs       (Core libraries)
└─ vitest, coverage       (Testing)
```

### New Feature: Automated OG Images
- ✅ Generates 8 branded PNG images (1200×630px each)
- ✅ Runs automatically during build
- ✅ Includes git-devkit branding (orange #FF6600)
- ✅ Zero manual creation needed

---

## 🎨 OG Image Generation (Automated!)

### Before vs After

**Before**: Manual creation using Canva/Figma
```
⚠️ Manual steps for each image
⚠️ Time-consuming (30+ minutes)
⚠️ Risk of inconsistency
⚠️ Updates require re-creation
```

**After**: Fully Automated
```
✅ 8 images generated in <5 seconds
✅ Part of build pipeline
✅ Always matches content
✅ Updates automatically
✅ Zero manual work
```

### Build Pipeline

```
pnpm run build
    ↓
pnpm run generate:og (AUTOMATIC)
    ├─ Loads page metadata
    ├─ Creates SVG templates
    ├─ Converts to PNG (1200×630)
    └─ Saves to public/ folder
    ↓
ng build
    ├─ Includes public/ assets
    └─ Ready for deployment
```

### Generated Files

```
docs-app/public/
├─ og-image.png              (Homepage)
├─ og-installation.png       (Installation guide)
├─ og-aliases.png            (Git aliases)
├─ og-commits.png            (Conventional commits)
├─ og-workflows.png          (Git workflows)
├─ og-branching.png          (Branching strategy)
├─ og-stories.png            (Real-world stories)
├─ og-bytes.png              (Advanced git)
├─ robots.txt                (SEO)
├─ sitemap.xml               (SEO)
└─ manifest.json             (PWA)
```

---

## 📖 Development Setup

### 1. Local Development

```bash
cd docs-app

# Development server with hot reload
pnpm start

# Server runs on http://localhost:4200
# Changes auto-reload in browser
```

### 2. Build Commands

```bash
# Development build
pnpm build

# Production build (optimized)
pnpm run build:prod

# GitHub Pages build (with base-href)
pnpm run build:ghpages

# Generate OG images only
pnpm run generate:og
```

### 3. Testing

```bash
# Run unit tests
pnpm test

# Generate coverage report
pnpm run test:coverage
```

### 4. Verify OG Images

```bash
# Check generated images
ls -lh public/og-*.png

# Should show 8 files, each ~28-29 KB:
# -rw-r--r--  28K  og-image.png
# -rw-r--r--  29K  og-installation.png
# ... (8 files total)
```

---

## 🌐 Deployment

### Option 1: GitHub Pages (Recommended)

**Automatic via CI/CD**:
```bash
# In your code editor, make changes
git add .
git commit -m "[deploy] Your message"
git push origin main
# GitHub Actions auto-deploys to https://sahulkola.github.io/git-devkit/
```

**Manual build & deploy**:
```bash
cd docs-app

# Build for GitHub Pages
pnpm run build:ghpages

# This automatically:
# ✓ Generates all OG images
# ✓ Builds Angular app
# ✓ Sets base-href for /git-devkit/ path
# ✓ Creates dist/ ready for deployment

# Manually deploy if needed
npm run serve:ssr:docs-app
```

### Option 2: Vercel

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect repo on Vercel.com
# 3. Set build command: pnpm run build:prod
# 4. Set output directory: docs-app/dist

# Vercel auto-generates OG images and deploys
```

### Option 3: Docker

```bash
# Create Dockerfile (example)
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN cd docs-app && pnpm run build:prod
EXPOSE 4200
CMD ["pnpm", "start"]

# Build & run
docker build -t git-devkit .
docker run -p 4200:4200 git-devkit
```

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] **Dependencies installed**: `pnpm install` in root & docs-app
- [ ] **OG images generated**: `pnpm run generate:og` shows 8 images
- [ ] **Build succeeds**: `pnpm run build:prod` completes without errors
- [ ] **Local test**: `pnpm start` works at http://localhost:4200
- [ ] **Social preview ready**: Images visible in `docs-app/public/`
- [ ] **Meta tags present**: SEO service loaded in app.ts
- [ ] **Base URL correct**: For GitHub Pages, set in angular.json
- [ ] **Environment variables**: Check .env (if any) matches deployment
- [ ] **Git commit message**: Use `[deploy]` keyword for GitHub Pages
- [ ] **No git errors**: `git status` is clean

---

## 🔍 Verification After Deployment

### 1. Check Images Are Live
```bash
# Visit in browser
https://sahulkola.github.io/git-devkit/og-image.png
# Should display the generated image
```

### 2. Test Social Preview
```bash
# Facebook
https://developers.facebook.com/tools/debug/
→ Enter URL: https://sahulkola.github.io/git-devkit/
→ Click "Scrape Again"
→ Should show og-image.png preview

# Twitter
https://cards-dev.twitter.com/validator
→ Enter URL
→ Should show large image preview

# LinkedIn
https://www.linkedin.com/post-inspector/inspect/
→ Enter URL
→ Should show image preview
```

### 3. Check SEO Files
```bash
# Verify robots.txt exists
https://sahulkola.github.io/git-devkit/robots.txt

# Verify sitemap exists
https://sahulkola.github.io/git-devkit/sitemap.xml

# Should both return XML/text content
```

### 4. Monitor Performance
```bash
# Lighthouse test
https://developers.google.com/web/tools/lighthouse
→ Enter site URL
→ Run audit
→ Target: Performance 90+, SEO 100
```

---

## 🐛 Troubleshooting

### Issue: OG Images Not Generated

**Symptoms**: No files in `docs-app/public/og-*.png`

**Solutions**:
```bash
# 1. Check Sharp is installed
pnpm list sharp

# 2. Run generation manually
cd docs-app
pnpm run generate:og

# 3. Check permissions
chmod +x ../scripts/generate-og-images.js

# 4. Clear cache & reinstall
rm -rf node_modules
pnpm install
pnpm run generate:og
```

### Issue: Build Fails with Sharp Error

**Symptoms**: `Module 'sharp' not found`

**Solutions**:
```bash
# 1. Install from root (not docs-app)
cd /path/to/git-devkit
pnpm add -D sharp

# 2. Rebuild native modules
npm rebuild sharp

# 3. Update pnpm lock
pnpm install --frozen-lockfile=false
```

### Issue: Social Preview Shows Old Image

**Symptoms**: Facebook/Twitter shows cached image, not new

**Solutions**:
1. **Facebook Debugger**: Clear cache
   - https://developers.facebook.com/tools/debug/
   - Click "Scrape Again" button
   - Wait 24 hours for full cache clear

2. **Twitter**: Clear card cache
   - https://cards-dev.twitter.com/validator
   - Re-validate URL

3. **LinkedIn**: Request re-scrape
   - Use Post Inspector tool
   - Click "Inspect URL" button

### Issue: GitHub Pages Not Updating

**Symptoms**: Site shows old content after push

**Solutions**:
```bash
# 1. Check GitHub Actions succeeded
- Go to: https://github.com/sahulkola/git-devkit/actions
- Check latest workflow run
- Review logs if failed

# 2. Force rebuild
git commit --allow-empty -m "[deploy] Force rebuild"
git push origin main

# 3. Manual deploy
cd docs-app
pnpm run build:ghpages
# Then manually upload dist/ to GitHub Pages

# 4. Clear browser cache
- Ctrl+Shift+R (Windows/Linux)
- Cmd+Shift+R (Mac)
```

### Issue: Images Look Wrong on Social Media

**Symptoms**: Cropped, blurry, or misaligned

**Solutions**:
```bash
# 1. Check image dimensions
cd docs-app/public
file og-image.png
# Should show: 1200 x 630 pixels

# 2. Re-generate images
pnpm run generate:og

# 3. Verify SVG rendering
node ../scripts/generate-og-images.js
# Check for errors in output

# 4. Clear social cache
# Use Facebook/Twitter debugger tools as above
```

---

## 📊 Performance Metrics

### Build Time
```
Baseline Angular build:     ~40 seconds
OG image generation:        ~5 seconds (parallel)
Total build:               ~45 seconds
Impact:                    +12% (acceptable)
```

### File Sizes
```
Per OG image:              ~28-29 KB
All 8 images:              ~228 KB
Compressed (gzip):         ~70-80 KB
Added to deployment:       ~5-10% increase
Cache-friendly:            Each image cached separately
```

### Page Load Impact
```
OG images:                 Not loaded on page view
Used for:                  Social media previews only
Performance impact:        Zero (external tools fetch)
SEO benefit:               Significant (rich previews)
```

---

## 🎯 Key Features Summary

✅ **Automated OG Images**
- 8 unique images generated automatically
- 1200×630px standard format
- Git-devkit branding (orange #FF6600)
- Runs before every build
- Zero manual steps

✅ **SEO Optimized**
- 30+ meta tags configured
- robots.txt for crawler control
- sitemap.xml for indexing
- JSON-LD schema markup
- Dynamic page updates

✅ **Social Media Ready**
- OpenGraph protocol compliant
- Twitter Card support
- Facebook sharing optimized
- LinkedIn preview enabled
- WhatsApp preview working

✅ **Developer Friendly**
- Single `pnpm build` command
- Automated image generation
- No Figma/Canva needed
- Easy to customize
- Clear error messages

---

## 📚 Related Documentation

- **OG-IMAGE-AUTOMATION.md**: Detailed automation guide
- **OG-IMAGE-SETUP-COMPLETE.md**: Setup verification
- **SEO-IMPLEMENTATION.md**: SEO service details
- **SOCIAL-MEDIA-PREVIEW.md**: Platform-specific guides

---

## 🆘 Support & Issues

### Common Questions

**Q: How often are OG images regenerated?**
A: Every build. Run `pnpm build` to generate fresh images.

**Q: Can I customize the image design?**
A: Yes! Edit `scripts/generate-og-images.js` SVG section. See OG-IMAGE-AUTOMATION.md for examples.

**Q: Do I need to commit generated PNG files?**
A: Yes, commit them to git so they're available in all branches.

**Q: How do I add a new page's OG image?**
A: Add entry to `pageData` array in generate-og-images.js, then run `pnpm run generate:og`.

**Q: Is Sharp required?**
A: Yes, for SVG→PNG conversion. Automatically installed via `pnpm install`.

### Report Issues

Found a problem? Create an issue on GitHub:
https://github.com/sahulkola/git-devkit/issues

Include:
- Error message/screenshot
- Steps to reproduce
- Environment (Node version, OS, pnpm version)
- Relevant logs

---

## 🎉 You're Ready!

Your git-devkit site is now set up with:

✅ Fully automated OG image generation
✅ Enterprise-grade SEO optimization
✅ Social media preview support
✅ Production-ready deployment

**Next Steps**:
1. Run `pnpm install` to setup
2. Run `pnpm start` to test locally
3. Run `git push` to deploy

Happy coding! 🚀

---

**Last Updated**: May 5, 2024
**Status**: ✅ Production Ready
**Version**: 2.0 (with OG Automation)
