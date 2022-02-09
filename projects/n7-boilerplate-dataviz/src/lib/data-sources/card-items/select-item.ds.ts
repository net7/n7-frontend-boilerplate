import { InputSelectData } from '@net7/components';
import { DataSource } from '@net7/core';

export class SelectItemDS extends DataSource {
  protected transform(data: InputSelectData): InputSelectData {
    return data;
  }
}
