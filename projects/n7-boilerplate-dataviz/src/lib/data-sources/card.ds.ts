import { DataSource } from '@net7/core';
import { CardData } from '../types/card.types';

export class CardDS extends DataSource {
  protected transform(data: CardData): CardData {
    return data;
  }
}
