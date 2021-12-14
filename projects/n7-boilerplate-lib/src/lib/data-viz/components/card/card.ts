import { Component, Input } from '@angular/core';

export type CardTitle = {
  text: string;
  classes?: string;
};

export type CardActionList = CardActionButton[];

export type CardActionButton = {
  label: string;
  payload: any;
  icon?: string;
  classes?: string;
};

export type CardAction = CardActionButton | CardActionList;

export type CardSection = {
  items: CardSectionItem[];
  columns: number;
  classes?: string;
}

export interface CardSectionItem {
  id: string;
  type: string;
  classes?: string;
}

export type CardData = {
  sections: CardSection[];
  title?: CardTitle;
  actions?: CardAction[];
  classes?: string;
};

@Component({
  selector: 'dv-card',
  templateUrl: './card.html',
})
export class CardComponent {
    @Input() data: CardData;
}
