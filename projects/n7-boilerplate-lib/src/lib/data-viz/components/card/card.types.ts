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

type ItemTypes = TextItem;

export type CardSection = {
  items: ItemTypes[];
  columns?: number;
  classes?: string;
}

export interface CardSectionItem {
  id: string;
  type: string;
  classes?: string;
}

export interface TextItem extends CardSectionItem {
  type: 'text';
  initialData: string;
}

export type CardData = {
  sections: CardSection[];
  title?: CardTitle;
  actions?: CardAction[];
  classes?: string;
};
