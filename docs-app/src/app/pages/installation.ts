import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type DetectedOs = 'macos' | 'windows' | 'linux' | 'unknown';

@Component({
  selector: 'app-installation',
  imports: [RouterLink],
  templateUrl: './installation.html',
  styleUrl: './installation.scss',
})
export class Installation {
  protected readonly detectedOs = signal<DetectedOs>(this.detectOs());

  protected readonly osSummary = computed(() => {
    const currentOs = this.detectedOs();

    if (currentOs === 'windows') {
      return {
        label: 'Windows',
        recommendedOption: 'Option A',
        recommendationReason: 'npm works reliably in PowerShell, Git Bash, and Command Prompt.',
      };
    }

    if (currentOs === 'macos') {
      return {
        label: 'macOS',
        recommendedOption: 'Option B',
        recommendationReason: 'The shell bootstrap is fastest on macOS terminals.',
      };
    }

    if (currentOs === 'linux') {
      return {
        label: 'Linux',
        recommendedOption: 'Option B',
        recommendationReason: 'The shell bootstrap is usually the quickest Linux path.',
      };
    }

    return {
      label: 'Unknown OS',
      recommendedOption: 'Option A',
      recommendationReason: 'npm is the safest cross-platform default when OS detection is unavailable.',
    };
  });

  protected isRecommended(option: 'npm' | 'script' | 'manual'): boolean {
    const currentOs = this.detectedOs();

    if (option === 'npm') {
      return currentOs === 'windows' || currentOs === 'unknown';
    }

    if (option === 'script') {
      return currentOs === 'macos' || currentOs === 'linux';
    }

    return false;
  }

  private detectOs(): DetectedOs {
    if (typeof navigator === 'undefined') {
      return 'unknown';
    }

    const navigatorWithUaData = navigator as Navigator & { userAgentData?: { platform?: string } };
    const userAgentPlatform = (
      navigatorWithUaData.userAgentData?.platform ||
      navigator.platform ||
      navigator.userAgent ||
      ''
    ).toLowerCase();

    if (userAgentPlatform.includes('mac')) {
      return 'macos';
    }

    if (userAgentPlatform.includes('win')) {
      return 'windows';
    }

    if (userAgentPlatform.includes('linux') || userAgentPlatform.includes('x11')) {
      return 'linux';
    }

    return 'unknown';
  }
}
