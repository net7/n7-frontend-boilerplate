import { DataSource } from '@n7-frontend/core';
import { ADVANCED_AUTOCOMPLETE_MOCK } from '@n7-frontend/components';

export class AwHomeAutocompleteDS extends DataSource {

  protected transform(data){
    return ADVANCED_AUTOCOMPLETE_MOCK;
    // return data;
  }
}