import { InnerTitleData, ItemPreviewData } from '@n7-frontend/components';
import { LayoutDataSource } from '@n7-frontend/core';
import { BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import slugify from 'slugify';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { CollectionItem, GetCollectionParams, GetCollectionResponse } from './collection-layout.types';

export class AwCollectionLayoutDS extends LayoutDataSource {
  private communication: CommunicationService;

  private configuration: ConfigurationService;

  private layoutOptions;

  private route;

  public collectionID: string;

  innerTitleData = new BehaviorSubject<InnerTitleData>({
    title: { main: { text: '' } },
  })

  pageSize = 6;

  currentOffset = 0;

  loadedCollections: BehaviorSubject<ItemPreviewData[] | []>;

  loadMoreButton = new BehaviorSubject(true)

  onInit(payload) {
    this.communication = payload.communication;
    this.route = payload.route;
    this.configuration = payload.configuration;
    this.loadedCollections = new BehaviorSubject([]);
    this.layoutOptions = this.configuration.get('collection-layout');
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
          title: this.stringLimiter(item.title, {
            maxLength: this.layoutOptions.item.title.maxLength,
            char: this.layoutOptions.item.title.char,
          }),
          text: this.stringLimiter(item.content, {
            maxLength: this.layoutOptions.item.description.maxLength,
            char: this.layoutOptions.item.description.char
          }),
          classes: item.image ? 'is-overlay has-image' : 'is-overlay has-image has-watermark',
          image: item.image || this.layoutOptions.watermark,
          color: item.background,
          anchor: {
            href: item.url || this.urlBuilder(item.a4vId, item.title)
          }
        })),
        title: d.title,
        total: d.total,
      }))
    ).subscribe({
      next: (data) => {
        if (data.title) {
          this.setTitle(data.title);
        }
        this.currentOffset += this.pageSize;
        this.loadedCollections.next([...collection, ...data.response]);
        this.loadMoreButton.next(
          data.total > this.loadedCollections.getValue().length
        );
      },
      error: (e) => {
        console.error(e);
        this.loadMoreButton.next(false);
      },
    });
  }

  /**
   * Builds a URL from entity type,
   * entity id, and a slug string.
   *
   * @param type entity type
   * @param id entity ID
   * @param title human-readable title
   * @returns URL string including a slug
   */
  urlBuilder(id, title): string | undefined {
    if (id && title) {
      const titleSlug = slugify(title);
      const basePath = this.configuration.get('paths').schedaBasePath;
      return `/${basePath}/${id}/${titleSlug}`;
    } return undefined;
  }

  stringLimiter(content: string, options: { maxLength: number; char: string }): string {
    let res = content;
    if (options.maxLength) {
      res = content.slice(0, options.maxLength);
      if (options.char && res !== content) {
        res += options.char;
      }
    }
    return res;
  }

  setTitle(title: string): void {
    this.innerTitleData.next({
      title: { main: { text: title } }
    });
  }
}
