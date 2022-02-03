import { InputSelectData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class SelectItemDS extends DataSource {
  protected transform(data: InputSelectData): InputSelectData {
    return data;
  }
}
