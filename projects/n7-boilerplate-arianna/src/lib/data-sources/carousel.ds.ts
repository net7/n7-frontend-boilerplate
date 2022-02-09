import { CarouselData } from '@net7/components';
import { DataSource } from '@net7/core';

type GetSliderResponse = SlideData[];
type SlideData = {
  background: { type: string; value: string | null };
  ctaLabel: string;
  ctaPayload: string;
  metadata: {key: string; value: string}[] | null;
  pretext: string;
  text: string;
  title: string;
}

export class AwCarouselDS extends DataSource {
  protected transform(data: GetSliderResponse): CarouselData {
    const res: CarouselData = {
      containerId: 'carousel-root',
      classes: 'aw-home__carousel-root',
      libOptions: {
        count: 1,
        move: 1,
        // touch: true,
        // mode: 'align',
        buttons: true,
        dots: true,
        rewind: true,
        autoplay: 4000,
        animation: 500,
        // responsive: {
        //   0: { count: 1.5, buttons: false },
        //   480: { count: 2.5, buttons: false },
        //   768: { count: 3, touch: false },
        //   1440: { count: 4, touch: false },
        // },
      },
      slides: data.map((slide) => {
        const items = [];
        let action;
        let background;
        if (slide.title) items.push({ title: slide.title });
        if (slide.text) items.push({ text: slide.text });
        if (slide.ctaLabel && slide.ctaPayload) {
          action = {
            text: slide.ctaLabel,
            anchor: {
              href: slide.ctaPayload,
              target: '_blank'
            }
          };
        }
        if (slide.background && slide.background.value) {
          if (slide.background.type === 'color') {
            background = {
              color: slide.background.value
            };
          } else if (slide.background.type === 'image') {
            background = {
              image: slide.background.value
            };
          } else if (slide.background.type === 'video') {
            background = {
              video: slide.background.value
            };
          }
        } else {
          // The background is missing!
          background = {
            color: 'rgba(0, 0, 0, 0)'
          };
        }
        return ({
          items,
          action,
          background
        });
      })
    };
    return res;
  }
}
