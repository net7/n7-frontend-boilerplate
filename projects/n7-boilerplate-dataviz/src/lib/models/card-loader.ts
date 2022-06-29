import { BehaviorSubject, forkJoin } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import {
  CardData, CardDataWithWidgets, CardState
} from '../types/card.types';
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

  /**
   * Holds the state of all the internal widgets and sections
   * of the cards.
   */
  private state$: {
    [id: string]: BehaviorSubject<CardState>
  } = {};

  public getCards(): CardDataWithWidgets[] {
    const { cards } = this.config;
    const cardsWithWidgets = [] as CardDataWithWidgets[];
    // initialize items
    if (cards && !this.itemsInitialized) {
      const { widgets } = this.layout.lb;
      this.itemsInitialized = true;
      cards.forEach(({
        id, header, content, footer
      }, index) => {
        const cardWidgets = {};
        const cardSections = content.sections
          .concat(header?.sections || [])
          .concat(footer?.sections || []);
        const state$ = {
          [id]: new BehaviorSubject(CardState.Idle),
          [`${id}.content`]: new BehaviorSubject(CardState.Idle),
          [`${id}.header`]: new BehaviorSubject(CardState.Idle),
          [`${id}.footer`]: new BehaviorSubject(CardState.Idle),
        };
        const cardStateComponents = {};

        cardSections.forEach(({ items }) => {
          items.forEach(({
            id: widgetID, type: itemType, initialData, stateComponents
          }) => {
            const { ds } = widgets[widgetID];
            const { eh } = widgets[widgetID];
            ds.id = widgetID;
            ds.type = itemType;
            const emit = (type: string, payload?: any) => eh.emitInner(type, payload);
            // setup card status stream
            // widgets[id].ds.status$ = new BehaviorSubject<Status>(CardState.Idle);
            state$[widgetID] = new BehaviorSubject(CardState.Idle);
            cardStateComponents[widgetID] = stateComponents;
            cardWidgets[widgetID] = { ds, emit };
            // with initialData
            if (initialData) {
              state$[widgetID].pipe(
                filter((stateID) => stateID === CardState.Success),
                first()
              ).subscribe({
                next: () => ds.update(initialData)
              });
            }
          });
        });

        // add widgets to card
        cardsWithWidgets[index] = {
          ...cards[index],
          widgets: cardWidgets,
          state$,
          stateComponents: cardStateComponents,
        };
        // merge the new states with the existing ones
        this.state$ = {
          ...this.state$,
          ...state$,
        };
      });
    }
    return cardsWithWidgets;
  }

  private updateState(ids: string[], newState: CardState) {
    const updates = forkJoin(ids.map((id) => this.state$[id]));
    ids.forEach((id) => {
      if (this.state$[id]) {
        this.state$[id].next(newState);
      }
    });
    return updates;
  }

  public setState(id: string, newState: CardState) {
    return this.updateState([id], newState);
  }

  public setAllStates(newState: CardState) {
    return this.updateState(Object.keys(this.state$), newState);
  }

  public setSomeStates(ids: string[], newState: CardState) {
    return this.updateState(ids, newState);
  }

  private addLayoutWidgets() {
    const { cards } = this.config;
    if (cards) {
      this.layout.widgets = this.layout.widgets || [];
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
