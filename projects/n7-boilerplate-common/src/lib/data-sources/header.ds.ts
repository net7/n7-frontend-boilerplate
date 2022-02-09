import { DataSource } from '@net7/core';
import { HeaderData } from '@net7/components';

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
      this.updateItemClass(item, payload);
      if (item.subnav) {
        item.subnav.forEach((subNavItem) => {
          this.updateItemClass(subNavItem, payload);
        });
      }
    });
  }

  public onRouterChange() {
    if (!this.output) {
      return;
    }
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

  private updateItemClass(item, payload) {
    let itemClasses = [];
    if (item.classes) {
      itemClasses = itemClasses.concat(item.classes.split(' '));
    }
    if (item._meta.id === payload && !itemClasses.includes(ACTIVE_CLASS)) {
      itemClasses.push(ACTIVE_CLASS);
    } else if (itemClasses.includes(ACTIVE_CLASS)) {
      itemClasses.splice(itemClasses.indexOf(ACTIVE_CLASS, 1));
    }
    item.classes = itemClasses.join(' ');
  }
}
