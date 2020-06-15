import { DataSource } from '@n7-frontend/core';
import { HeaderData } from '@n7-frontend/components';

const MOBILE_CLASS = 'is-mobile-nav-displayed';

const ACTIVE_CLASS = 'is-active';

export class HeaderDS extends DataSource {
  protected transform(data): HeaderData {
    if (!data) {
      return null;
    }

    return {
      ...data,
      menuToggle: {
        open: {
          payload: 'mobile-open'
        },
        close: {
          payload: 'mobile-close'
        }
      }
    };
  }

  public onCurrentNavChange(payload) {
    this.output.nav.items.forEach((item) => {
      item.classes = item._meta.id === payload ? ACTIVE_CLASS : '';
    });
  }

  public onRouterChange() {
    let { classes } = this.output;
    classes = classes || '';
    classes = classes.split(' ');

    if (classes.includes(MOBILE_CLASS)) {
      classes.splice(classes.indexOf(MOBILE_CLASS), 1);
      this.output.classes = classes.join(' ');
    }
  }

  public onClick(payload) {
    // mobile control
    if (['mobile-open', 'mobile-close'].includes(payload)) {
      let { classes } = this.output;
      classes = classes || '';
      classes = classes.split(' ');

      if (classes.includes(MOBILE_CLASS)) {
        classes.splice(classes.indexOf(MOBILE_CLASS), 1);
      } else {
        classes.push(MOBILE_CLASS);
      }
      this.output.classes = classes.join(' ');
    }
  }
}
