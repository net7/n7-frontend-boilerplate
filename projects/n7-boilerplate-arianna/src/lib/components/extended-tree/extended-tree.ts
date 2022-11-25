import { Component, Input } from '@angular/core';
import {
  Anchor, InnerTitleData, InputSelectData, InputTextData, PaginationData
} from '@net7/components';

export type ExtendedTreeData = {
  header: InnerTitleData;
  items: {
    icon: string;
    thumbnail?: string;
    label: string;
    anchor: Anchor;
  }[];
  pagination: PaginationData;
  limitSelect?: InputSelectData;
  pageInput?: InputTextData;
  fallback?: string;
  loading?: boolean;
}

@Component({
  selector: 'aw-extended-tree',
  templateUrl: './extended-tree.html',
})
export class ExtendedTreeComponent {
  @Input() data: ExtendedTreeData;

  @Input() emit: (type: string, payload?: any) => void;

  @Input() lb: any;

  onPageInputSubmit() {
    if (!this.emit) return;

    this.emit('pageinputsubmit');
  }

  onCollapseClick(type) {
    if (type === 'text') return;

    this.lb.dataSource.onSectionCollapse('extended-tree');
  }
}
