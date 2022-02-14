import { Component, Input } from '@angular/core';

export type CardTextItemData = {
  text: string;
  payload?: any;
  classes?: any;
}

@Component({
  selector: 'dv-card-text-item',
  templateUrl: './card-text-item.html',
})
export class CardTextItemComponent {
    @Input() data: CardTextItemData;

    @Input() emit: (type: string, payload: any) => void;

    onClick(payload) {
      if (!this.emit) return;

      this.emit('click', payload);
    }
}
