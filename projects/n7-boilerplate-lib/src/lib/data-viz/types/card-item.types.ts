import { DataWidgetData, InnerTitleData, TableData } from '@n7-frontend/components';
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
export interface TableItem extends CardSectionItem {
  type: 'table';
  initialData: TableData;
}
export interface InnerTitleItem extends CardSectionItem {
  type: 'inner-title';
  initialData: InnerTitleData;
}
export interface CardChartItem extends CardSectionItem {
  initialData: ChartResponseData;
}
export interface ApexBarChartItem extends CardChartItem { type: 'apex-bar-chart' }
export interface ApexLineChartItem extends CardChartItem { type: 'apex-line-chart' }
export interface ApexPieChartItem extends CardChartItem { type: 'apex-pie-chart' }
export interface ApexRadialBarChartItem extends CardChartItem { type: 'apex-radialbar-chart' }
export interface ApexRadarChartItem extends CardChartItem { type: 'apex-radar-chart' }

export type CardItemTypes = (
  TextItem
  | TableItem
  | DataWidgetItem
  | InnerTitleItem
  | ApexBarChartItem
  | ApexLineChartItem
  | ApexPieChartItem
  | ApexRadialBarChartItem
  | ApexRadarChartItem
);
