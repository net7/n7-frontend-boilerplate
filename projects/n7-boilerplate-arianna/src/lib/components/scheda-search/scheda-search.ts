import { Component, Input } from '@angular/core';
import {
  Anchor,
  InnerTitleData, InputSelectData, InputTextData, PaginationData
} from '@net7/components';

export type SchedaSearchData = {
  header: InnerTitleData;
  input: InputTextData;
  items: {
    icon: string;
    thumbnail?: string;
    label: string;
    anchor: Anchor;
    breadcrumbs?: {
      items: {
        label: string;
        anchor: Anchor;
      }[];
    }
  }[];
  pagination: PaginationData;
  limitSelect?: InputSelectData;
  fallback?: string;
  loading?: boolean;
}

@Component({
  selector: 'aw-scheda-search',
  templateUrl: './scheda-search.html',
})
export class SchedaSearchComponent {
  @Input() data: SchedaSearchData;

  @Input() emit: (type: string, payload?: any) => void;
}
