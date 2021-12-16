import { LayoutDataSource } from '@n7-frontend/core';
import { CardData } from '../../components/card/card.types';
import { CardLoader } from '../../models/card-loader';

export class DvCardExampleLayoutDS extends LayoutDataSource {
  public cardLoader: CardLoader;

  public cards: CardData[];

  onInit(payload) {
    this.cardLoader = payload.cardLoader;
    this.cards = this.cardLoader.getCards();

    // setTimeout(() => {
    //   this.one('item-1').update('<b>Hola</b> <i>mundo</i>!!!');
    //   this.one('item-2').update({
    //     icon: 'n7-icon-earth',
    //     text: '197 <em>Dipendenti</em>',
    //     subtitle: {
    //       text: 'Going down...',
    //       icon: 'n7-icon-caret-down',
    //       value: '-49%',
    //       payload: 'view percent tooltip'
    //     },
    //     payload: 'view earth tooltip',
    //     classes: 'is-negative'
    //   });
    // }, 3000);
  }

  onDestroy() {
    console.warn('DvCardExampleLayout destroyed!');
  }
}
