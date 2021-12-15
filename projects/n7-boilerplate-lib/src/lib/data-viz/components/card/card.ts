import { Component, Input } from '@angular/core';
import { CardData } from './card.types';

@Component({
  selector: 'dv-card',
  templateUrl: './card.html',
})
export class CardComponent {
    @Input() data: CardData;
}
