import { DataWidgetData } from '@n7-frontend/components';

export interface CardSectionItem {
  id: string;
  type: string;
  options?: object;
  classes?: string;
}

export interface TextItem extends CardSectionItem {
  type: 'text';
  initialData: string;
}
export interface DataWidgetItem extends CardSectionItem {
  type: 'data-widget';
  initialData: DataWidgetData;
}

export type CardItemTypes = (
  TextItem
  | DataWidgetItem
);
