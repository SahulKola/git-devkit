import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then(m => m.Home),
    title: 'git-devkit - Complete Git Mastery Toolkit',
  },
  {
    path: 'installation',
    loadComponent: () => import('./pages/installation').then(m => m.Installation),
    title: 'Git Multi-SSH Setup Guide',
  },
  {
    path: 'multi-ssh-use-cases',
    loadComponent: () => import('./pages/multi-ssh-use-cases').then(m => m.MultiSshUseCases),
    title: 'Git Multi-SSH Daily Use Cases',
  },
  {
    path: 'aliases',
    loadComponent: () => import('./pages/aliases').then(m => m.Aliases),
    title: 'Git Aliases - Complete Reference',
  },
  {
    path: 'commits',
    loadComponent: () => import('./pages/commits').then(m => m.Commits),
    title: 'Conventional Commits - Professional Commit Standards',
  },
  {
    path: 'stories',
    loadComponent: () => import('./pages/stories').then(m => m.Stories),
    title: 'Real-World Stories - git-devkit Impact',
  },
  {
    path: 'workflows',
    loadComponent: () => import('./pages/workflows').then(m => m.Workflows),
    title: 'Git Workflows - Feature Branch, GitHub Flow, Gitflow, Trunk',
  },
  {
    path: 'branching',
    loadComponent: () => import('./pages/branching').then(m => m.Branching),
    title: 'Branching Strategy - Naming, Lifecycle, Merge Strategies',
  },
  {
    path: 'bytes',
    loadComponent: () => import('./pages/bytes').then(m => m.Bytes),
    title: 'git-bytes - Advanced Git Concepts',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
