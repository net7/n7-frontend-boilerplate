import { DataSource } from '@n7-frontend/core';
import { HEADER_MOCK } from '@n7-frontend/components';

export class HeaderDS extends DataSource {
  protected transform(data) {
    return HEADER_MOCK;
  }
}
