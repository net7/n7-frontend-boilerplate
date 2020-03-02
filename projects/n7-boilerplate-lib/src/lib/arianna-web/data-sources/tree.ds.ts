import { DataSource } from '@n7-frontend/core';
import helpers from '../../common/helpers';

export class AwTreeDS extends DataSource {
  static dataCache: any = {};

  private basePath: string;

  private rootId: string;

  private currentId: string;

  private activeId: string;

  protected transform(tree): any {
    if (!tree) {
      return null;
    }
    return tree;
  }

  public load(data) {
    const { tree, basePath } = data;
    this.rootId = tree.id;
    this.basePath = basePath;
    // save in cache
    if (!AwTreeDS.dataCache[this.rootId]) {
      AwTreeDS.dataCache[this.rootId] = { flatIds: [], flatData: {} };
      this._normalize(tree);
    }
  }

  public build(id) {
    const path = this._getTreePath(id);
    const oldPath = this._getTreePath(this.currentId);
    const oldPathIndex = oldPath.indexOf(id);

    if (oldPathIndex > 0) {
      path.splice(oldPathIndex);
      this.currentId = null;
    } else if (this.currentId === id) {
      const idIndex = path.indexOf(this.currentId);
      path.splice(idIndex);
      this.currentId = null;
    } else {
      this.currentId = id;
    }

    const tree: any = this._getTree(path);
    this.update(tree);
  }

  public setActive(id) {
    this.activeId = id;
  }

  public highlightActive() {
    const control = (items) => {
      items.forEach((item) => {
        const founded = item.meta === this.activeId;
        const hasActive = item.classes.indexOf('is-active') !== -1;

        // clear is-active
        if (hasActive && !founded) {
          const currentClasses = item.classes.split(' ');
          currentClasses.splice(currentClasses.indexOf('is-active'), 1);
          item.classes = currentClasses.join(' ');
        }

        if (founded) {
          const currentClasses = item.classes.split(' ');
          if (currentClasses.indexOf('is-active') === -1) {
            currentClasses.push('is-active');
          }
          item.classes = currentClasses.join(' ');
        }

        if (Array.isArray(item.items) && item.items.length) {
          control(item.items);
        }
      });
    };
    control(this.output.items);
  }

  private _getCachedData = () => AwTreeDS.dataCache[this.rootId]

  private _normalize = ({
    id, label, icon, img, branches,
  }) => {
    const hasBranches = !!(Array.isArray(branches) && branches.length);
    this._getCachedData().flatData[id] = {
      id, label, icon, img, hasBranches,
    };
    if (hasBranches) {
      branches.forEach((data) => {
        this._getCachedData().flatIds.push([id, data.id]);
        this._normalize(data);
      });
    }
  }

  private _getParent = (id) => this._getCachedData().flatIds
    .filter(([, childId]) => childId === id)
    .map(([parentId]) => parentId)[0] || null

  private _getTreePath = (id) => {
    const ids = [id];
    let currentId = id;
    while (currentId) {
      const parentId = this._getParent(currentId);
      if (parentId) {
        ids.push(parentId);
      }
      currentId = parentId;
    }
    return ids.reverse();
  }

  private _getTree = (path) => {
    const tree = {};
    let counter = 0;

    const loadItems = (id, source) => {
      counter += 1;
      const nextParent = path[counter];
      source.items = [];

      this._getCachedData().flatIds
        .filter(([parentId]) => parentId === id)
        .forEach(([, childId], index) => {
          const inPath = childId === nextParent;
          const item = this._getTreeItem(childId, inPath);
          source.items.push(item);
          if (inPath) {
            loadItems(childId, source.items[index]);
          }
        });
    };

    // init
    loadItems(path[0], tree);
    return tree;
  }

  private _getTreeItem = (id, inPath) => {
    const {
      label, icon, img, hasBranches,
    } = this._getCachedData().flatData[id];
    const defaultIcon = inPath ? 'n7-icon-angle-down' : 'n7-icon-angle-right';
    const classes = [];
    if (inPath) {
      classes.push('is-expanded');
    }
    if (this.activeId === id) {
      classes.push('is-active');
    }
    return {
      classes: classes.join(' '),
      text: label || null,
      img: img || null,
      icon: icon || null,
      toggle: hasBranches ? {
        icon: icon || defaultIcon,
        payload: {
          source: 'toggle',
          id,
        },
      } : null,
      meta: id,
      anchor: {
        href: `${this.basePath}/${id}/${helpers.slugify(label)}`,
      },
    };
  }
}
