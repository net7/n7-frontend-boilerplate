import { DataWidgetData } from '@n7-frontend/components';
import { ChartResponseData } from './response.types';

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
export interface ApexChartItem extends CardSectionItem {
  initialData: ChartResponseData;
}
export interface ApexBarChartItem extends ApexChartItem { type: 'apex-bar-chart' }
export interface ApexLineChartItem extends ApexChartItem { type: 'apex-line-chart' }
export interface ApexPieChartItem extends ApexChartItem { type: 'apex-pie-chart' }

export type CardItemTypes = (
  TextItem
  | DataWidgetItem
  | ApexBarChartItem
  | ApexLineChartItem
  | ApexPieChartItem
);
