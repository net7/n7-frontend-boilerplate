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
export interface CardChartItem extends CardSectionItem {
  initialData: ChartResponseData;
}
export interface ApexBarChartItem extends CardChartItem { type: 'apex-bar-chart' }
export interface ApexLineChartItem extends CardChartItem { type: 'apex-line-chart' }
export interface ApexPieChartItem extends CardChartItem { type: 'apex-pie-chart' }
export interface ApexRadialBarChartItem extends CardChartItem { type: 'apex-radialbar-chart' }

export type CardItemTypes = (
  TextItem
  | DataWidgetItem
  | ApexBarChartItem
  | ApexLineChartItem
  | ApexPieChartItem
  | ApexRadialBarChartItem
);
