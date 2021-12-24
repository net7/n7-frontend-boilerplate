import { DataSource } from '@n7-frontend/core';
import { CardTextItemData } from '../../components/card-text-item/card-text-item';

export class TextItemDS extends DataSource {
  protected transform(data: CardTextItemData): CardTextItemData {
    return data;
  }
}
