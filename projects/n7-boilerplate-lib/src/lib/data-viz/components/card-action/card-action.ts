import { Component, Input } from '@angular/core';
import { CardAction } from '../card/card.types';

@Component({
  selector: 'dv-card-action',
  templateUrl: './card-action.html',
})
export class CardActionComponent {
    @Input() data: CardAction;

    @Input() emit: (type: string, payload: any) => void;

    onClick(payload) {
      if (!this.emit) return;

      this.emit('click', payload);
    }

    dropdownToggle() {
      if ('header' in this.data) {
        this.data.isExpanded = !this.data.isExpanded;
      }
    }
}
