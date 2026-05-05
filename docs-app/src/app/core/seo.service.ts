import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  url?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  type?: 'article' | 'website' | 'product';
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private readonly baseUrl = 'https://sahulkola.github.io/git-devkit';
  private readonly defaultImage = 'https://sahulkola.github.io/git-devkit/og-image.png';
  private readonly twitterHandle = '@git_devkit';
  private readonly author = 'Git DevKit';

  // SEO metadata for all pages
  private pageMetadata: { [key: string]: SEOMetadata } = {
    '': {
      title: '🚀 git-devkit | Master Git Like a Pro - The Complete Toolkit',
      description: 'Stop struggling with Git. Master SSH identities, write better commits, implement workflows. 60+ aliases + proven strategies. Free documentation inside.',
      keywords: ['git tutorial', 'git ssh', 'git aliases', 'git workflow', 'git branching', 'git commits', 'git-devkit', 'git productivity'],
      type: 'website',
    },
    'installation': {
      title: '⚡ Installation & Setup | git-devkit - Get Started in 2 Minutes',
      description: 'Quick installation guide for git-devkit. Setup git multi-SSH, configure aliases, enable git superpowers. Works on macOS, Linux, Windows.',
      keywords: ['git installation', 'git setup', 'git multi-ssh', 'git configuration', 'developer setup'],
      type: 'article',
    },
    'aliases': {
      title: '✨ 60+ Git Aliases | Save Hours Monthly with Smart Shortcuts',
      description: 'Complete reference of 60+ productivity aliases for Git. Save keystrokes, automate workflows, boost productivity. Copy-paste ready.',
      keywords: ['git aliases', 'git shortcuts', 'git commands', 'git productivity', 'git automation', 'git cheatsheet'],
      type: 'article',
    },
    'commits': {
      title: '📝 Conventional Commits | Professional Commit Messages That Matter',
      description: 'Master the art of clear commit messages. Conventional Commits standard for readable history, automatic changelogs, and better team collaboration.',
      keywords: ['conventional commits', 'git commit', 'commit messages', 'git standards', 'commit conventions', 'git best practices'],
      type: 'article',
    },
    'stories': {
      title: '💡 Real-World Stories | How Teams Transformed with git-devkit',
      description: 'Discover real developer scenarios and how git-devkit solved their challenges. Learn from actual use cases and team transformations.',
      keywords: ['git use cases', 'developer stories', 'git best practices', 'team workflows', 'git tips and tricks'],
      type: 'article',
    },
    'workflows': {
      title: '🔄 Git Workflows | Feature Branch, GitHub Flow, Gitflow, Trunk Explained',
      description: 'Compare feature branch, GitHub flow, Gitflow, and trunk-based development. Choose the right workflow for your team size and release cycle.',
      keywords: ['git workflow', 'gitflow', 'feature branch', 'github flow', 'trunk based development', 'branching strategy'],
      type: 'article',
    },
    'branching': {
      title: '🌳 Branching Strategy | Naming, Lifecycle, and Merge Strategies',
      description: 'Master branch naming conventions, lifecycle management, and merge strategies. Build scalable branching systems that teams love.',
      keywords: ['git branching', 'branch naming', 'merge strategy', 'branching strategy', 'git workflow', 'git branch management'],
      type: 'article',
    },
    'bytes': {
      title: '🧠 git-bytes | Advanced Git Concepts for Power Users',
      description: 'Dive deep into advanced Git concepts. Rebase workflows, cherry-pick tactics, stash tricks, and advanced debugging techniques.',
      keywords: ['advanced git', 'git rebase', 'git cherry-pick', 'git stash', 'git debugging', 'git internals', 'git expert'],
      type: 'article',
    },
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) {
    this.initializeMetaTags();
    this.listenToRouteChanges();
  }

  private initializeMetaTags(): void {
    // Set default meta tags for all pages
    this.addMetaTag('charset', 'utf-8');
    this.addMetaTag('name', 'viewport', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
    this.addMetaTag('name', 'author', this.author);
    this.addMetaTag('name', 'copyright', `© 2024 ${this.author}. All rights reserved.`);
    this.addMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    this.addMetaTag('name', 'language', 'English');
    this.addMetaTag('name', 'revisit-after', '7 days');
    this.addMetaTag('name', 'distribution', 'global');
    
    // Open Graph defaults
    this.addMetaTag('property', 'og:type', 'website');
    this.addMetaTag('property', 'og:locale', 'en_US');
    
    // Twitter Card defaults
    this.addMetaTag('name', 'twitter:card', 'summary_large_image');
    this.addMetaTag('name', 'twitter:creator', this.twitterHandle);
    this.addMetaTag('name', 'twitter:site', this.twitterHandle);
    
    // Additional SEO meta tags
    this.addMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
    this.addMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'black-translucent');
    this.addMetaTag('name', 'format-detection', 'telephone=no');
  }

  private listenToRouteChanges(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const path = event.urlAfterRedirects.split('?')[0].replace(/^\//, '');
        this.updateMetaTags(path);
      });
  }

  private updateMetaTags(path: string): void {
    const metadata = this.pageMetadata[path] || this.pageMetadata[''];
    this.setPageMetadata(metadata, path);
  }

  private setPageMetadata(metadata: SEOMetadata, path: string): void {
    // Update page title
    this.titleService.setTitle(metadata.title);

    // Update description
    this.updateMetaTag('name', 'description', metadata.description);

    // Update keywords
    if (metadata.keywords && metadata.keywords.length > 0) {
      this.updateMetaTag('name', 'keywords', metadata.keywords.join(', '));
    }

    // Canonical URL
    const canonicalUrl = this.baseUrl + (path ? `/${path}` : '/');
    this.updateCanonicalLink(canonicalUrl);

    // Open Graph tags
    this.updateMetaTag('property', 'og:title', metadata.title);
    this.updateMetaTag('property', 'og:description', metadata.description);
    this.updateMetaTag('property', 'og:url', canonicalUrl);
    this.updateMetaTag('property', 'og:image', metadata.image || this.defaultImage);
    this.updateMetaTag('property', 'og:image:alt', metadata.imageAlt || 'git-devkit logo');
    this.updateMetaTag('property', 'og:site_name', 'git-devkit');
    if (metadata.type) {
      this.updateMetaTag('property', 'og:type', metadata.type);
    }

    // Twitter Card tags
    this.updateMetaTag('name', 'twitter:title', metadata.title);
    this.updateMetaTag('name', 'twitter:description', metadata.description);
    this.updateMetaTag('name', 'twitter:image', metadata.image || this.defaultImage);
    this.updateMetaTag('name', 'twitter:image:alt', metadata.imageAlt || 'git-devkit logo');
    this.updateMetaTag('name', 'twitter:url', canonicalUrl);

    // Article-specific tags
    if (metadata.type === 'article') {
      this.updateMetaTag('property', 'article:author', metadata.author || this.author);
      if (metadata.datePublished) {
        this.updateMetaTag('property', 'article:published_time', metadata.datePublished);
      }
      if (metadata.dateModified) {
        this.updateMetaTag('property', 'article:modified_time', metadata.dateModified);
      }
      this.updateMetaTag('property', 'article:section', this.getTopic(path));
    }

    // Additional SEO tags
    this.updateMetaTag('name', 'theme-color', '#FF6600');
    this.updateMetaTag('name', 'mobile-web-app-capable', 'yes');
  }

  private updateMetaTag(
    type: 'name' | 'property',
    name: string,
    content: string
  ): void {
    const selector = type === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement;

    if (element) {
      element.setAttribute('content', content);
    } else {
      this.metaService.addTag(
        type === 'property'
          ? { property: name, content }
          : { name, content }
      );
    }
  }

  private addMetaTag(
    type: 'name' | 'property' | 'charset',
    nameOrProperty: string,
    content?: string
  ): void {
    if (type === 'charset') {
      this.metaService.addTag({ charset: nameOrProperty });
    } else {
      this.metaService.addTag(
        type === 'property'
          ? { property: nameOrProperty, content: content || '' }
          : { name: nameOrProperty, content: content || '' }
      );
    }
  }

  private updateCanonicalLink(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (link) {
      link.setAttribute('href', url);
    } else {
      const element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', url);
      document.head.appendChild(element);
    }
  }

  private getTopic(path: string): string {
    const topics: { [key: string]: string } = {
      'installation': 'Setup',
      'aliases': 'Git Aliases',
      'commits': 'Commits',
      'stories': 'Real-World Stories',
      'workflows': 'Git Workflows',
      'branching': 'Branching Strategy',
      'bytes': 'Advanced Git',
    };
    return topics[path] || 'Git DevKit';
  }

  // Public methods for dynamic metadata updates
  setMetadata(metadata: SEOMetadata, path?: string): void {
    if (path) {
      this.pageMetadata[path] = metadata;
    }
    this.setPageMetadata(metadata, path || '');
  }

  getMetadata(path: string): SEOMetadata {
    return this.pageMetadata[path] || this.pageMetadata[''];
  }
}
