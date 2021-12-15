import { DataWidgetData } from '@n7-frontend/components';
import { IDataSource } from '@n7-frontend/core';

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

type ItemTypes = TextItem | DataWidgetItem;

export type CardSection = {
  items: ItemTypes[];
  columns?: number;
  classes?: string;
}

export interface CardSectionItem {
  id: string;
  type: string;
  options?: object;
  classes?: string;
}

export interface CardWidgets {
  [id: string]: {
    ds: IDataSource;
    emit: (type: string, payload?: any) => void;
  };
}

export interface TextItem extends CardSectionItem {
  type: 'text';
  initialData: string;
}
export interface DataWidgetItem extends CardSectionItem {
  type: 'data-widget';
  initialData: DataWidgetData;
}

export type CardData = {
  sections: CardSection[];
  widgets?: CardWidgets;
  title?: CardTitle;
  actions?: CardAction[];
  classes?: string;
};
