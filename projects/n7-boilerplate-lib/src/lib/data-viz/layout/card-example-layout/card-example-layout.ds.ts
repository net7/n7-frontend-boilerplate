import { LayoutDataSource } from '@n7-frontend/core';

import { ConfigurationService } from '../../../common/services/configuration.service';

export class DvCardExampleLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private configId: string;

  public pageConfig: any;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    this.initWidgets();
  }

  onDestroy() {
    console.warn('DvCardExampleLayout destroyed!');
  }

  private initWidgets() {
    const { cards } = this.pageConfig;
    if (cards) {
      cards.forEach(({ sections }) => {
        sections.forEach(({ items }) => {
          items.forEach(({ id, initialData }, index) => {
            const ds = this.getWidgetDataSource(id);
            items[index].data$ = ds.out$;
            if (initialData) {
              this.one(id).update(initialData);
            }
          });
        });
      });
    }
  }
}
