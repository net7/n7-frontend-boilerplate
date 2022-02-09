import { InnerTitleData, ItemPreviewData } from '@net7/components';
import { LayoutDataSource } from '@net7/core';
import { BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import slugify from 'slugify';
import { ConfigurationService, CommunicationService } from '@net7/boilerplate-common';
import { CollectionItem, GetCollectionParams, GetCollectionResponse } from './collection-layout.types';

export class AwCollectionLayoutDS extends LayoutDataSource {
  private communication: CommunicationService;

  private configuration: ConfigurationService;

  private layoutOptions;

  private route;

  public collectionID: string;

  private classificationsMap = {
    ff400: 'fondo-fotografico',
    al: 'aggregazione-logica',
    la: 'libro-antico',
    veac301: 'vestimento',
    f400: 'fotografia',
    uasc: 'cartografica',
    dc: 'scheda-dublin-core',
    oa300: 'scheda-oa',
    rmmus: 'materiale-musicale',
    ua: 'unita-archivistica',
    oac300: 'opera-arte-contemporanea',
  }

  innerTitleData = new BehaviorSubject<InnerTitleData>({
    title: { main: { text: '' } },
  })

  collectionDescription = new BehaviorSubject<string>('');

  pageSize = 6;

  /** Necessary to iterate with the loading item placeholder HTML */
  pageSizeList = [];

  currentOffset = 0;

  loadedCollections: BehaviorSubject<ItemPreviewData[] | []>;

  /** Button that loads more content into the layout */
  loadMoreButton = new BehaviorSubject(true);

  /** Controls the loading state of the layout */
  loading = true;

  onInit(payload) {
    this.communication = payload.communication;
    this.route = payload.route;
    this.configuration = payload.configuration;
    this.loadedCollections = new BehaviorSubject([]);
    this.layoutOptions = this.configuration.get('collection-layout');
    this.pageSizeList = new Array(this.pageSize);
  }

  /**
   * After the collection ID has been loaded
   */
  onCollectionID() {
    // reset pagination params
    this.pageSize = 6;
    this.currentOffset = 0;
    // load
    this.loadMore(true);
  }

  loadMore(reload = false) {
    this.loading = true;
    const collection = this.loadedCollections.getValue();
    const params: GetCollectionParams = {
      id: this.collectionID,
      itemPagination: {
        limit: this.pageSize,
        offset: this.currentOffset,
      }
    };
    // check base url config
    const baseUrls = this.configuration.get('baseUrls') || {};
    const baseUrl = baseUrls.portaleMatriceServer || null;
    if (baseUrl) {
      params.baseUrl = baseUrl;
    }
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
          classes: `${item.image ? 'is-overlay has-image' : 'is-overlay has-image has-watermark'} ${this.classMap(item.classification)}`,
          image: item.image || this.layoutOptions.watermark,
          color: item.background,
          anchor: {
            href: item.url || this.urlBuilder(item.a4vId, item.title, item.type)
          },
          classification: item.classification
        })),
        text: d.text,
        title: d.title,
        total: d.total,
      }))
    ).subscribe({
      next: (data) => {
        this.loading = false;
        if (data.title) {
          this.setTitle(this.stringLimiter(data.title, {
            maxLength: this.layoutOptions.header.maxLength,
            char: this.layoutOptions.header.char
          }));
        }
        this.collectionDescription.next(data.text ? this.stringLimiter(data.text, {
          maxLength: this.layoutOptions.description.maxLength,
          char: this.layoutOptions.description.char
        }) : '');
        this.currentOffset += this.pageSize;
        const collectionData = !reload
          ? [...collection, ...data.response]
          : [...data.response];
        this.loadedCollections.next(collectionData);
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
  urlBuilder(id, title, type: string): string | undefined {
    if (id && title) {
      const titleSlug = slugify(title);
      const { schedaBasePath, entitaBasePath } = this.configuration.get('paths');
      const basePath = type === 'entity' ? entitaBasePath : schedaBasePath;
      return `/${basePath}/${id}/${titleSlug}`;
    } return undefined;
  }

  stringLimiter(content: string, options: { maxLength: number; char: string }): string {
    let res = content;
    if (content && options.maxLength) {
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

  /**
   * Convert classification strings to css classes.
   *
   * @param classification a classification string like "a4.oc.ua"
   * @returns a CSS class
   */
  classMap(classification: string): string {
    if (!classification || classification.length < 1) {
      return '';
    }
    const codeMatch = /\.(\w+)$/gi.exec(classification);
    if (codeMatch) {
      const parsedCode = codeMatch[1]?.toLocaleLowerCase();
      const className = this.classificationsMap[parsedCode];
      if (className) {
        return `is-${className}`;
      }
    }
    return `is-${classification.replace('.', '-')}`;
  }
}
