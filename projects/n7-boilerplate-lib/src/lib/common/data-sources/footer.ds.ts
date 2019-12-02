import { DataSource } from '@n7-frontend/core';
import { FOOTER_MOCK } from "@n7-frontend/components";

export class FooterDS extends DataSource {
  protected transform(data) {
    return data;
  }
}
