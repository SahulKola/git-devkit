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
        recommendedOption: 'Recommended',
        recommendationReason: 'Use the native PowerShell or CMD bootstrap script for guided setup on Windows.',
      };
    }

    if (currentOs === 'macos') {
      return {
        label: 'macOS',
        recommendedOption: 'Recommended',
        recommendationReason: 'The shell bootstrap is fastest on macOS terminals.',
      };
    }

    if (currentOs === 'linux') {
      return {
        label: 'Linux',
        recommendedOption: 'Recommended',
        recommendationReason: 'The shell bootstrap is usually the quickest Linux path.',
      };
    }

    return {
      label: 'Unknown OS',
      recommendedOption: 'Recommended',
      recommendationReason: 'The native setup script is the safest cross-platform default.',
    };
  });

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
