import { DataSource } from '@n7-frontend/core';
import { MAP_MOCK } from '@n7-frontend/components';

export class AwMapDS extends DataSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected transform = (data) => MAP_MOCK;
}
