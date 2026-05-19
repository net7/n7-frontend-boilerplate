import { Injectable } from '@angular/core';
import { ConfigurationService } from '@net7/boilerplate-common';

@Injectable({ providedIn: 'root' })
export class MrCopyProtectionService {
  constructor(private config: ConfigurationService) {}

  init() {
    const { enabled, message, htmlMessage } = this.config.get('copyProtection') || {};
    if (!enabled || !message) return;

    document.addEventListener('copy', (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection?.toString()) return;

      e.clipboardData.setData('text/plain', selection.toString() + message);

      if (htmlMessage) {
        const container = document.createElement('div');
        for (let i = 0; i < selection.rangeCount; i++) {
          container.appendChild(selection.getRangeAt(i).cloneContents());
        }
        e.clipboardData.setData('text/html', container.innerHTML + htmlMessage);
      }

      e.preventDefault();
    });
  }
}
