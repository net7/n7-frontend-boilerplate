import { DataSource } from '@n7-frontend/core';
import { TABLE_MOCK } from '@n7-frontend/components';

export class AwTableDS extends DataSource {
  protected transform() {
    return TABLE_MOCK;
  }
}
