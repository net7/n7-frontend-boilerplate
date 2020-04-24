import { DataSource } from '@n7-frontend/core';

export class MrNavDS extends DataSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected transform(data) {
    const items = [];
    data.nav.forEach((el) => {
      items.push({
        text: el.title,
        anchor: {
          href: `http://localhost:4200/mr/static/${el.id}`,
          target: '_blank',
          payload: el.id
        }
      });
    });
    return {
      items,
    };
  }
}
