import { LayoutDataSource } from '@net7/core';
import { CardData, CardState } from '../../types/card.types';
import { CardLoader } from '../../models/card-loader';

export class DvCardExampleLayoutDS extends LayoutDataSource {
  public cardLoader: CardLoader;

  public cards: CardData[];

  onInit(payload) {
    this.cardLoader = payload.cardLoader;
    this.cards = this.cardLoader.getCards();
    this.cardLoader.setState('first-card', CardState.Loading);

    setTimeout(() => {
      this.cardLoader.setAllStates(CardState.Success);
      // this.cardLoader.setState('first-card', CardState.Success);
      this.one('item-1').update('<b>Hola</b> <i>mundo</i>!!!');
      // this.one('item-2').update({
      //   icon: 'n7-icon-earth',
      //   text: '197 <em>Dipendenti</em>',
      //   subtitle: {
      //     text: 'Going down...',
      //     icon: 'n7-icon-caret-down',
      //     value: '-49%',
      //     payload: 'view percent tooltip'
      //   },
      //   payload: 'view earth tooltip',
      //   classes: 'is-negative'
      // });
      this.cardLoader.setState('item-2', CardState.Loading);
      // this.getWidgetDataSource('item-2').status$.next('loading');
      // (this.one('item-2') as any).status$.next('loading');
      this.one('item-3').update({
        series: [{
          id: 'serie-1',
          name: 'Serie 1',
          data: [24, 35, 23, 33]
        }],
        categories: ['Fetta A', 'Fetta B', 'Fetta C', 'Fetta D'],
      });
      this.one('item-4').update({
        series: [{
          id: 'serie-desktops',
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148].map((value) => ({
            value,
            metadata: {
              info: `è questo il valore: ${value}`
            }
          })).reverse()
        }],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      });
      this.one('item-5').update({
        series: [{
          id: 'serie-2021',
          name: '2021',
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380].reverse()
        }, {
          id: 'serie-2020',
          name: '2020',
          data: [300, 530, 418, 370, 240, 680, 390, 100, 200, 1280].reverse()
        }],
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
      });
    }, 3000);

    setTimeout(() => {
      this.cardLoader.setState('item-2', CardState.Success);
      this.cardLoader.setSomeStates(['item-4', 'text-3'], CardState.Empty);
    }, 4000);
  }

  onDestroy() {
    console.warn('DvCardExampleLayout destroyed!');
  }
}
