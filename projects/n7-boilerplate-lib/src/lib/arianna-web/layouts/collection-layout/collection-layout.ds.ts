import { InnerTitleData, ItemPreviewData } from '@n7-frontend/components';
import { LayoutDataSource } from '@n7-frontend/core';
import { BehaviorSubject } from 'rxjs';
import getCollection from './collection-mocks';

export class AwCollectionLayoutDS extends LayoutDataSource {
  private communication;

  innerTitleData: InnerTitleData = {
    title: { main: { text: 'Articoli recenti' } },
  }

  pageSize = 6;

  currentOffset = 0;

  loadedCollections: BehaviorSubject<ItemPreviewData[]>;

  onInit(payload) {
    this.communication = payload.communication;
    getCollection({ limit: this.pageSize, offset: this.currentOffset })
      .subscribe((d) => {
        this.currentOffset += this.pageSize;
        this.loadedCollections = new BehaviorSubject(d.results);
      });
  }

  loadMore() {
    const collection = this.loadedCollections.getValue();
    getCollection({ limit: this.pageSize, offset: this.currentOffset }).subscribe((d) => {
      this.currentOffset += this.pageSize;
      this.loadedCollections.next([...collection, ...d.results]);
    });
  }
}
