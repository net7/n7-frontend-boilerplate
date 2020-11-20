import { CarouselData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class MrSliderDS extends DataSource {
  id: string;

  protected transform(data: any): CarouselData {
    const { slides } = data;
    return {
      slides,
      containerId: `carousel-${this.id}`,
      // classes: 'demo',
      libOptions: {
        count: 1,
        move: 1,
        // touch: true,
        // mode: 'align',
        buttons: true,
        dots: true,
        rewind: true,
        autoplay: 0,
        animation: 500,
        // responsive: {
        //   0: { count: 1.5, buttons: false },
        //   480: { count: 2.5, buttons: false },
        //   768: { count: 3, touch: false },
        //   1440: { count: 4, touch: false },
        // },
      },
    };
  }
}
