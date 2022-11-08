import { Component, Input } from '@angular/core';
import {
  InnerTitleData, InputSelectData, InputTextData, PaginationData
} from '@net7/components';

export type SchedaSearchData = {
  header: InnerTitleData;
  input: InputTextData;
  items: any;
  pagination: PaginationData;
  limitSelect?: InputSelectData;
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
