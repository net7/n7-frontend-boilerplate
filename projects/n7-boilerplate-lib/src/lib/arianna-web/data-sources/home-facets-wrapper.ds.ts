import { DataSource } from '@n7-frontend/core';
import { FACET_HEADER_MOCK } from '@n7-frontend/components';

export class AwHomeFacetsWrapperDS extends DataSource {

  protected transform(data) {
    return FACET_HEADER_MOCK;
  }
}