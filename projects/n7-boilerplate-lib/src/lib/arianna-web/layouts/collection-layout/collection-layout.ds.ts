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

  innerTitleData: InnerTitleData = {
    title: { main: { text: 'Articoli recenti' } },
  }

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
          classes: 'is-overlay has-image',
          image: item.image,
          color: item.background,
          anchor: {
            href: item.url || this.urlBuilder(item.type, item.a4vId, item.title)
          }
        })),
        total: d.total,
      }))
    ).subscribe({
      next: (data) => {
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
  urlBuilder(type, id, title): string {
    const titleSlug = slugify(title);
    return `/${type}/${id}/${titleSlug}`;
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
}
