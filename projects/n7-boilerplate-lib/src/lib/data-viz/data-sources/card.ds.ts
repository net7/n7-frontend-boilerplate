import { DataSource } from '@n7-frontend/core';
import { CardData } from '../components/card/card.types';

export class CardDS extends DataSource {
  protected transform(data: CardData): CardData {
    return data;
  }
}
