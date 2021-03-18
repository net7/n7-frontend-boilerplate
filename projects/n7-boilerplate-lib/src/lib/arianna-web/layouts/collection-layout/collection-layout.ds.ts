import { InnerTitleData, ItemPreviewData } from '@n7-frontend/components';
import { LayoutDataSource } from '@n7-frontend/core';
import { BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CommunicationService } from '../../../common/services/communication.service';
import { CollectionItem, GetCollectionParams, GetCollectionResponse } from './collection-layout.types';
// import getCollection from './collection-mocks';

export class AwCollectionLayoutDS extends LayoutDataSource {
  private communication: CommunicationService;

  private route;

  public collectionID: string;

  innerTitleData: InnerTitleData = {
    title: { main: { text: 'Articoli recenti' } },
  }

  pageSize = 6;

  currentOffset = 0;

  loadedCollections: BehaviorSubject<ItemPreviewData[] | []>;

  onInit(payload) {
    this.communication = payload.communication;
    this.route = payload.route;
    this.loadedCollections = new BehaviorSubject([]);
  }

  /**
   * After the collection ID has been loaded
   */
  onCollectionID() {
    this.loadMore();
  }

  loadMore() {
    const collection = this.loadedCollections.getValue();
    const params: GetCollectionParams = {
      id: this.collectionID,
      itemPagination: {
        limit: this.pageSize,
        offset: this.currentOffset,
      }
    };
    this.communication.request$('getCollection', {
      onError: (error) => console.error(error),
      params
    }).pipe(
      first((d) => !!d),
      map((d: GetCollectionResponse) => ({
        // map the backend response to the format used by ItemPreviewComponent
        response: d.items.map((item: CollectionItem) => ({
          title: item.title,
          text: item.content,
          classes: 'is-overlay has-image',
          image: item.image,
          color: item.background,
        })),
        totalCount: d.items.length,
      }))
    ).subscribe((data: { response: ItemPreviewData[] }) => {
      this.currentOffset += this.pageSize;
      this.loadedCollections.next([...collection, ...data.response]);
    });
  }
}
