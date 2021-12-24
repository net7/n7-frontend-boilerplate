import { CardData, CardDataWithWidgets } from '../types/card.types';
import {
  TextItemDS,
  DataWidgetItemDS,
  ApexChartItemDS,
  TableItemDS,
  InnerTitleItemDS,
  SelectItemDS,
  MapItemDS,
} from '../data-sources';
import { CardEH } from '../event-handlers';

const DATASOURCE_MAP = {
  text: TextItemDS,
  table: TableItemDS,
  select: SelectItemDS,
  map: MapItemDS,
  'inner-title': InnerTitleItemDS,
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

  public getCards(): CardDataWithWidgets[] {
    const { cards } = this.config;
    const cardsWithWidgets = [] as CardDataWithWidgets[];
    // initialize items
    if (cards && !this.itemsInitialized) {
      const { widgets } = this.layout.lb;
      this.itemsInitialized = true;
      cards.forEach(({ header, content, footer }, index) => {
        const cardWidgets = {};
        const cardSections = content.sections
          .concat(header?.sections || [])
          .concat(footer?.sections || []);

        cardSections.forEach(({ items }) => {
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
        cardsWithWidgets[index] = {
          ...cards[index],
          widgets: cardWidgets
        };
      });
    }

    return cardsWithWidgets;
  }

  private addLayoutWidgets() {
    const { cards } = this.config;
    if (cards) {
      this.layout.widgets = [];
      cards.forEach(({ header, content, footer }) => {
        const cardSections = content.sections
          .concat(header?.sections || [])
          .concat(footer?.sections || []);

        cardSections.forEach(({ items }) => {
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
