import { TagData, TAG_MOCK } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class SbDummyDS extends DataSource {
  protected transform(): TagData {
    return TAG_MOCK;
  }
}
