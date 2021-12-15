import { LayoutDataSource } from '@n7-frontend/core';

import { ConfigurationService } from '../../../common/services/configuration.service';
import { CardData } from '../../components/card/card.types';
import { CardLoader } from '../../models/card-loader';

export class DvCardExampleLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private configId: string;

  public pageConfig: any;

  public cardLoader: CardLoader;

  public cards: CardData[];

  onInit(payload) {
    this.configuration = payload.configuration;
    this.configId = payload.configId;
    // this.pageConfig = this.configuration.get(this.configId);
    this.cardLoader = payload.cardLoader;
    this.cards = this.cardLoader.getCards();

    // this.initWidgets();
  }

  onDestroy() {
    console.warn('DvCardExampleLayout destroyed!');
  }

  // private initWidgets() {
  //   const { cards } = this.pageConfig;
  //   if (cards) {
  //     cards.forEach(({ sections }) => {
  //       sections.forEach(({ items }) => {
  //         items.forEach(({ id, initialData }, index) => {
  //           items[index].ds = this.getWidgetDataSource(id);
  //           items[index].eh = this.getWidgetEventHandler(id);
  //           if (initialData) {
  //             this.one(id).update(initialData);
  //           }
  //         });
  //       });
  //     });
  //   }
  // }
}
