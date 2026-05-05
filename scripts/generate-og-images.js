#!/usr/bin/env node

/**
 * OpenGraph Image Generator Script
 * Automatically generates dynamic OG images for all pages with git-devkit branding
 * Runs at build time to create PNG images in the public folder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../docs-app/public');
const TEMP_DIR = path.join(__dirname, '../.temp');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Page data for OG image generation
const pageData = [
  {
    name: 'og-image',
    title: 'git-devkit',
    subtitle: 'Professional Git Toolkit',
    description: 'Complete Toolkit for Developers',
    features: '60+ Aliases | Multi-SSH | Workflows | Commits',
  },
  {
    name: 'og-installation',
    title: 'Installation Guide',
    subtitle: 'Get Started in 2 Minutes',
    description: 'Setup git-devkit on macOS, Linux, Windows',
    features: 'Quick Setup | All Platforms Supported',
  },
  {
    name: 'og-aliases',
    title: '60+ Git Aliases',
    subtitle: 'Save Hours Monthly',
    description: 'Complete Reference of Productivity Shortcuts',
    features: 'Copy-Paste Ready | Boost Productivity',
  },
  {
    name: 'og-commits',
    title: 'Conventional Commits',
    subtitle: 'Professional Messages',
    description: 'Master the art of Clear Commit Standards',
    features: 'Better History | Auto Changelogs',
  },
  {
    name: 'og-workflows',
    title: 'Git Workflows',
    subtitle: 'Feature Branch & GitFlow',
    description: 'Compare strategies for teams of any size',
    features: 'GitHub Flow | Gitflow | Trunk-Based',
  },
  {
    name: 'og-branching',
    title: 'Branching Strategy',
    subtitle: 'Naming & Lifecycle',
    description: 'Build scalable branching systems',
    features: 'Naming Conventions | Merge Strategies',
  },
  {
    name: 'og-stories',
    title: 'Real-World Stories',
    subtitle: 'Team Transformations',
    description: 'Learn from actual git-devkit use cases',
    features: 'Developer Stories | Best Practices',
  },
  {
    name: 'og-bytes',
    title: 'Advanced Git',
    subtitle: 'Power User Concepts',
    description: 'Rebase, cherry-pick, stash & debugging',
    features: 'Expert Techniques | Git Internals',
  },
];

/**
 * Generate SVG with git-devkit branding
 */
/**
 * Escape special XML characters
 */
function escapeXML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSVG(data) {
  const title = escapeXML(data.title);
  const subtitle = escapeXML(data.subtitle);
  const description = escapeXML(data.description);
  const features = escapeXML(data.features);

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Background: Dark gradient to Orange -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF6600;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8533;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- Orange accent line top -->
  <rect width="1200" height="4" fill="url(#accentGradient)"/>
  
  <!-- Decorative git icon (left side) -->
  <g opacity="0.15" transform="translate(100, 120)">
    <!-- Git branch visualization -->
    <line x1="50" y1="10" x2="50" y2="140" stroke="#FF6600" stroke-width="3" stroke-linecap="round"/>
    <circle cx="30" cy="50" r="8" fill="#FF6600"/>
    <line x1="50" y1="50" x2="30" y2="50" stroke="#FF6600" stroke-width="3" stroke-linecap="round"/>
    <circle cx="70" cy="100" r="8" fill="#FF6600"/>
    <line x1="50" y1="100" x2="70" y2="100" stroke="#FF6600" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="20" r="8" fill="#FF6600"/>
    <circle cx="50" cy="140" r="8" fill="#FF6600"/>
  </g>
  
  <!-- Main content area -->
  <g>
    <!-- Main title -->
    <text x="600" y="140" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
          fill="white" text-anchor="middle" dominant-baseline="middle">
      ${title}
    </text>
    
    <!-- Subtitle -->
    <text x="600" y="220" font-family="Arial, sans-serif" font-size="48" font-weight="300"
          fill="white" text-anchor="middle" dominant-baseline="middle">
      ${subtitle}
    </text>
    
    <!-- Orange accent line -->
    <rect x="300" y="250" width="600" height="3" fill="url(#accentGradient)"/>
    
    <!-- Description -->
    <text x="600" y="310" font-family="Arial, sans-serif" font-size="32" font-weight="normal"
          fill="#CCCCCC" text-anchor="middle" dominant-baseline="middle">
      ${description}
    </text>
    
    <!-- Features -->
    <text x="600" y="400" font-family="Arial, sans-serif" font-size="24" font-weight="normal"
          fill="#FF6600" text-anchor="middle" dominant-baseline="middle">
      ${features}
    </text>
    
    <!-- git-devkit branding (bottom right) -->
    <text x="1050" y="580" font-family="Arial, sans-serif" font-size="18" font-weight="bold"
          fill="#FF6600" text-anchor="end" dominant-baseline="middle">
      git-devkit
    </text>
    
    <!-- Decorative elements -->
    <circle cx="120" cy="550" r="6" fill="#FF6600" opacity="0.6"/>
    <circle cx="180" cy="560" r="5" fill="#FF6600" opacity="0.5"/>
    <circle cx="240" cy="545" r="4" fill="#FF6600" opacity="0.4"/>
  </g>
  
  <!-- Bottom accent line -->
  <rect y="626" width="1200" height="4" fill="url(#accentGradient)"/>
</svg>`;

  return svgContent;
}

/**
 * Convert SVG to PNG and save
 */
async function generateImage(data) {
  try {
    const svgContent = generateSVG(data);
    const svgPath = path.join(TEMP_DIR, `${data.name}.svg`);
    const pngPath = path.join(OUTPUT_DIR, `${data.name}.png`);

    // Write SVG temporarily
    fs.writeFileSync(svgPath, svgContent);

    // Convert SVG to PNG using sharp
    await sharp(svgPath)
      .png({ quality: 90, progressive: true })
      .resize(1200, 630, { fit: 'fill', position: 'center' })
      .toFile(pngPath);

    // Clean up SVG
    fs.unlinkSync(svgPath);

    console.log(`Generated: ${data.name}.png (1200x630px)`);
    return true;
  } catch (error) {
    console.error(`Error generating ${data.name}:`, error.message);
    return false;
  }
}

/**
 * Main function to generate all OG images
 */
async function generateAllImages() {
  console.log('\nGenerating OpenGraph images with git-devkit branding...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const page of pageData) {
    const success = await generateImage(page);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log(`\nGeneration Summary:`);
  console.log(`   Generated: ${successCount} images`);
  if (failureCount > 0) {
    console.log(`   Failed: ${failureCount} images`);
  }
  console.log(`\nLocation: ${OUTPUT_DIR}`);
  console.log('\nImages are ready to use.\n');

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR) && fs.readdirSync(TEMP_DIR).length === 0) {
    fs.rmdirSync(TEMP_DIR);
  }
}

// Run the generator
generateAllImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
