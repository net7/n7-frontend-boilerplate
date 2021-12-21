import { CardData } from '../types/card.types';
import {
  TextItemDS,
  DataWidgetItemDS,
  ApexChartItemDS,
  TableItemDS,
} from '../data-sources';
import { CardEH } from '../event-handlers';

const DATASOURCE_MAP = {
  text: TextItemDS,
  table: TableItemDS,
  'data-widget': DataWidgetItemDS,
  'apex-bar-chart': ApexChartItemDS,
  'apex-line-chart': ApexChartItemDS,
  'apex-pie-chart': ApexChartItemDS,
  'apex-radialbar-chart': ApexChartItemDS,
  'apex-radar-chart': ApexChartItemDS,
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
          items.forEach(({ id, type: itemType, initialData }) => {
            const { ds } = widgets[id];
            const { eh } = widgets[id];
            ds.id = id;
            ds.type = itemType;
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

        // add card emitter
        cards[index].cardCustomEmit = (
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
