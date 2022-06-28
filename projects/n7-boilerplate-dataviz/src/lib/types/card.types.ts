import { IDataSource } from '@net7/core';
import { BehaviorSubject } from 'rxjs';
import { CardItemTypes } from './card-item.types';

/**
 * All possible states of a card item.
 */
// eslint-disable-next-line no-shadow
export enum CardState {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
  Empty = 'empty',
}

export type StateComponent = {
  component: unknown;
  data?: unknown;
}

export interface CardStateComponents {
  loading?: StateComponent;
  error?: StateComponent;
  empty?: StateComponent;
  idle?: StateComponent;
}

export type StateStream = BehaviorSubject<CardState>

export type CardTitle = {
  text: string;
  classes?: string;
};

export type CardActionButton = {
  label: string;
  payload: any;
  icon?: string;
  classes?: string;
};

export type CardActionList = {
  header: {
    icon: {
      open: string;
      close: string;
    };
    label?: string;
  };
  items: CardActionButton[];
  isExpanded?: boolean;
}

export type CardAction = CardActionButton | CardActionList;

export type CardSection = {
  items: CardItemTypes[];
  columns?: number;
  classes?: string;
}

export interface CardWidgets {
  [id: string]: {
    ds: IDataSource;
    emit: (type: string, payload?: any) => void;
  };
}

export interface CardData {
  /** Card id to control it's state */
  id: string;
  header?: {
    sections: CardSection[];
    stateComponents?: CardStateComponents;
  };
  content: {
    sections: CardSection[];
    stateComponents?: CardStateComponents;
  };
  footer?: {
    sections: CardSection[];
    stateComponents?: CardStateComponents;
  };
  classes?: string;
}

export interface CardDataWithWidgets extends CardData {
  widgets: CardWidgets;
  state$: {
    [id: string]: StateStream
  };
  stateComponents: CardStateComponents;
}
