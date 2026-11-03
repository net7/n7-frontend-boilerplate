/**
 * MrInputTypeaheadComponent
 *
 * A text input with an inline autocomplete dropdown. Supports two modes:
 *
 * 1. **Static (local) filtering** — provide a fixed list of strings via `data.options`.
 *    No API call is made; suggestions are filtered client-side on every keystroke.
 *
 *    ```ts
 *    {
 *      id: 'my-field',
 *      type: 'typeahead',
 *      data: {
 *        id: 'my-field',
 *        label: 'My Field',
 *        options: ['Apple', 'Banana', 'Cherry'],
 *      }
 *    }
 *    ```
 *
 * 2. **Dynamic (API) autocomplete** — omit `data.options` and provide
 *    `data.communicationKey` instead. The component calls
 *    `CommunicationService.request$(communicationKey, { queryParams: { q } })`
 *    after a 200 ms debounce. The endpoint must return `string[]`.
 *
 *    ```ts
 *    {
 *      id: 'my-field',
 *      type: 'typeahead',
 *      data: {
 *        id: 'my-field',
 *        label: 'My Field',
 *        communicationKey: 'myAutocompleteEndpoint',
 *      }
 *    }
 *    ```
 *
 * Suggestions appear after 2 characters are typed. Tab completes with the first
 * suggestion. Clicking outside dismisses the dropdown.
 */
import {
  Component, ElementRef, HostListener, Input, OnDestroy
} from '@angular/core';
import { CommunicationService } from '@net7/boilerplate-common';

@Component({
  selector: 'mr-input-typeahead',
  templateUrl: './input-typeahead.html',
})
export class MrInputTypeaheadComponent implements OnDestroy {
  @Input() data: any;

  @Input() emit: (type: string, payload?: any) => void;

  suggestions: string[] = [];

  isLoading = false;

  currentQuery = '';

  private timer: any;

  constructor(
    private communication: CommunicationService,
    private el: ElementRef,
  ) {}

  /** Wraps the form emit to intercept change events for autocomplete fetching */
  localEmit = (type: string, payload?: any) => {
    this.emit(type, payload);
    if (type === 'change') {
      this.onValueChange(payload?.value || '');
    }
  };

  /** Wraps the first occurrence of `query` in `text` with a <strong> tag */
  highlight(text: string, query: string): string {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      text.slice(0, idx) +
      '<strong>' + text.slice(idx, idx + query.length) + '</strong>' +
      text.slice(idx + query.length)
    );
  }

  /** Completes with the first suggestion on Tab */
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' && this.suggestions.length > 0) {
      event.preventDefault();
      this.onSelect(this.suggestions[0]);
    }
  }

  /** Selects a suggestion, updates the input and form state */
  onSelect(suggestion: string, event?: MouseEvent) {
    if (event) event.preventDefault();
    this.emit('change', { value: suggestion });
    this.suggestions = [];
    this.isLoading = false;
    const input: HTMLInputElement = this.el.nativeElement.querySelector('input');
    if (input) input.value = suggestion;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.suggestions = [];
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  private onValueChange(value: string) {
    clearTimeout(this.timer);
    this.currentQuery = value;
    if (!value || value.length < 2) {
      this.suggestions = [];
      this.isLoading = false;
      return;
    }
    // Static options: filter locally, no API call needed
    if (Array.isArray(this.data?.options)) {
      const q = value.toLowerCase();
      this.suggestions = (this.data.options as string[])
        .filter((o) => o.toLowerCase().includes(q))
        .slice(0, 20);
      return;
    }
    this.isLoading = true;
    this.timer = setTimeout(() => {
      this.communication.request$(this.data.communicationKey, {
        queryParams: { q: value },
        onError: () => {
          this.isLoading = false;
          this.suggestions = [];
        }
      }).subscribe((res: string[]) => {
        this.isLoading = false;
        this.suggestions = res || [];
      });
    }, 200);
  }
}
