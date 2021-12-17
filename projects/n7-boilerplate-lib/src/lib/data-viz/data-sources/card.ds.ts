import { DataSource } from '@n7-frontend/core';
import { CardData } from '../types/card.types';

export class CardDS extends DataSource {
  protected transform(data: CardData): CardData {
    return data;
  }
}
