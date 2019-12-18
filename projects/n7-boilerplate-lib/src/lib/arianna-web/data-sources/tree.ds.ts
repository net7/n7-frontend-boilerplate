import { DataSource } from '@n7-frontend/core';

export class AwTreeDS extends DataSource {
  static dataCache: any = {};
  private rootId: string;
  private currentId: string;

  protected transform(tree) {
    if (!tree) {
      return;
    }
    return tree;
  }

  public load(data) {
    const { tree } = data;
    this.rootId = tree.id;
    // save in cache
    if (!AwTreeDS.dataCache[this.rootId]) {
      AwTreeDS.dataCache[this.rootId] = { flatIds: [], flatData: {} };
      this._normalize(tree);
    }
  }

  public build(id) {
    const path = this._getTreePath(id);
    if (this.currentId === id) {
      const idIndex = path.indexOf(this.currentId);
      path.splice(idIndex);
      this.currentId = null;
    } else {
      this.currentId = id;
    }

    const tree: any = this._getTree(path);
    this.update(tree);
  }

  private _getCachedData = () => {
    return AwTreeDS.dataCache[this.rootId];
  }

  private _normalize = ({ id, label, icon, img, branches }) => {
    const hasBranches = !!(Array.isArray(branches) && branches.length);
    this._getCachedData().flatData[id] = { id, label, icon, img, hasBranches };
    if (hasBranches) {
      branches.forEach(data => {
        this._getCachedData().flatIds.push([id, data.id]);
        this._normalize(data);
      });
    }
  }

  private _getParent = (id) => {
    return this._getCachedData().flatIds
      .filter(([, childId]) => childId === id)
      .map(([parentId]) => parentId)[0] || null;
  }

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
    const { label, icon, img, hasBranches } = this._getCachedData().flatData[id];
    const defaultIcon = inPath ? 'n7-icon-angle-down' : 'n7-icon-angle-right';
    return {
      classes: inPath ? 'is-expanded is-active' : 'is-expanded',
      text: label || null,
      img: img || null,
      icon: icon || null,
      toggle: hasBranches ? {
        icon: icon || defaultIcon,
        payload: {
          source: 'toggle',
          id: id,
        }
      } : null,
      meta: id,
      payload: {
        id,
        source: 'menuitem',
      }
    };
  }
}
