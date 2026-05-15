import { Injectable } from '@angular/core';
import { ConfigurationService } from '@net7/boilerplate-common';

@Injectable({ providedIn: 'root' })
export class MrCopyProtectionService {
  constructor(private config: ConfigurationService) {}

  init() {
    const { enabled, message } = this.config.get('copyProtection') || {};
    if (!enabled || !message) return;

    document.addEventListener('copy', (e: ClipboardEvent) => {
      const selectedText = window.getSelection()?.toString();
      if (!selectedText) return;
      e.clipboardData.setData('text/plain', selectedText + message);
      e.preventDefault();
    });
  }
}
