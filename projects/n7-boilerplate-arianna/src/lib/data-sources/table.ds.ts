import { DataSource } from '@net7/core';
import { TABLE_MOCK } from '@net7/components';

export class AwTableDS extends DataSource {
  protected transform() {
    return TABLE_MOCK;
  }
}
