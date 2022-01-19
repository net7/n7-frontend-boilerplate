import { Component, Input } from '@angular/core';
import { CardDataWithWidgets } from '../../types/card.types';

@Component({
  selector: 'dv-card',
  templateUrl: './card.html',
})
export class CardComponent {
    @Input() data: CardDataWithWidgets;

    @Input() emit: (type: string, payload: any) => void;
}
