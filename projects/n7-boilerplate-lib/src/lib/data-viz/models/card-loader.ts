import { CardData } from '../components/card/card.types';
import {
  TextItemDS,
  DataWidgetItemDS,
} from '../data-sources';
import { CardEH } from '../event-handlers';

const DATASOURCE_MAP = {
  text: TextItemDS,
  'data-widget': DataWidgetItemDS,
};

export class CardLoader {
  private itemsInitialized = false;

  constructor(
    private layout: any,
    private config: {
      cards: CardData[];
    }
  ) {
    this.addLayoutWidgets();
  }

  public getCards() {
    const { cards } = this.config;
    // initialize items
    if (cards && !this.itemsInitialized) {
      const { widgets } = this.layout.lb;
      const { eventHandler: layoutEventHandler } = this.layout.lb;
      this.itemsInitialized = true;
      cards.forEach(({ sections }, index) => {
        const cardWidgets = {};
        sections.forEach(({ items }) => {
          items.forEach(({ id, initialData }) => {
            const { ds } = widgets[id];
            const { eh } = widgets[id];
            const emit = (type: string, payload?: any) => eh.emitInner(type, payload);
            cardWidgets[id] = { ds, emit };
            // with initialData
            if (initialData) {
              ds.update(initialData);
            }
          });
        });

        // add widgets to card
        cards[index].widgets = cardWidgets;

        // add card action emitter
        cards[index].actionEmit = (
          type: string, payload?: any
        ) => layoutEventHandler.emitInner(type, payload);
      });
    }

    return cards;
  }

  private addLayoutWidgets() {
    const { cards } = this.config;
    if (cards) {
      this.layout.widgets = [];
      cards.forEach(({ sections }) => {
        sections.forEach(({ items }) => {
          items.forEach(({
            id, type, options
          }) => {
            this.layout.widgets.push({
              id,
              options,
              dataSource: DATASOURCE_MAP[type],
              eventHandler: CardEH
            });
          });
        });
      });
    }
  }
}
