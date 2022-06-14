import {
  Button, InnerTitleData, InputSelectData, InputTextData, PaginationData
} from '@net7/components';
import { DataSource } from '@net7/core';
import { helpers } from '@net7/boilerplate-common';
import { ExtendedTreeData } from '../components/extended-tree/extended-tree';
import nodeHelper from '../helpers/node.helper';

type ParentResponse = {
  label: string;
}

type NodesResponse = {
  items: {
    img?: string;
    label: string;
    id: string;
    document_type: string;
    document_classification: string;
  }[];
  totalCount: number;
}

const PAGE_LIMIT = 5;

export class AwExtendedTreeDS extends DataSource {
  protected transform = (
    { parent, nodes }:
    { parent: ParentResponse; nodes: NodesResponse }
  ): ExtendedTreeData => {
    const { totalCount } = nodes;
    const {
      title, params, basePath, lite, configKeys
    } = this.options;
    const page = params.page ? +params.page : 1;
    const limit = params.limit ? +params.limit : 10;
    // header
    const header: InnerTitleData = {
      title: {
        main: {
          text: `${title} <span class="aw-extended-tree__total">(${totalCount})</span>`,
        },
        secondary: {
          text: `In: "${parent.label}"`
        }
      },
      actions: {
        search: {
          placeholder: 'Cerca negli oggetti culturali',
          payload: 'search-input',
          button: null
        },
      }
    };
    // items
    const items = (nodes.items || []).map((item) => ({
      icon: nodeHelper.getNodeIcon(configKeys, item),
      thumbnail: lite ? null : item.img,
      label: item.label,
      anchor: {
        href: `${basePath}/${item.id}/${helpers.slugify(item.label)}`
      }
    }));
    // pagination
    const pagination: PaginationData = this.getPagination(page, totalCount, limit);
    // page input
    const pageInput: InputTextData = {
      id: 'page-input',
      type: 'number',
      // value: page,
      placeholder: 'pag',
      inputPayload: 'page-input-change',
      enterPayload: 'page-input-enter',
    };
    // results limit select
    const limitSelect: InputSelectData = {
      id: 'limit-select',
      label: 'Numero di risultati',
      options: [10, 25, 50].map((size) => ({
        label: `${size}`,
        value: size,
        selected: size === limit
      })),
      payload: 'limit-select',
    };
    return {
      header,
      items,
      pagination,
      pageInput,
      limitSelect,
      loading: false,
    };
  };

  public setLoading(loading: boolean) {
    this.output.loading = loading;
  }

  private getPagination(page, totalCount, limit): PaginationData {
    const pages = Math.ceil(totalCount / limit);

    return {
      links: this.getPaginationLinks(page, pages),
      first: {
        anchor: {
          payload: 1,
        },
        classes: page === 1 ? 'is-disabled' : '',
      },
      prev: {
        anchor: {
          payload: page === 1 ? 1 : page - 1,
        },
        classes: page === 1 ? 'is-disabled' : ''
      },
      next: {
        anchor: {
          payload: page === pages ? pages : page + 1,
        },
        classes: page === pages ? 'is-disabled' : '',
      },
      last: {
        anchor: {
          payload: pages,
        },
        classes: page === pages ? 'is-disabled' : '',
      }
    };
  }

  private getPaginationLinks(page, pages): Button[] {
    let firstItem = 1;
    const links: Button[] = [];
    const limit = PAGE_LIMIT;
    let last = limit;

    if (pages > limit) {
      const steps = Math.floor(limit / 2);
      if (page > steps) {
        firstItem = page - steps;
      }

      if ((page + steps) > pages) {
        firstItem = (pages - limit) + 1;
      }
    } else {
      last = pages;
    }

    let i;
    for (i = 0; i < last; i += 1) {
      const itemPage = firstItem + i;
      links.push({
        text: itemPage,
        classes: itemPage === page ? 'is-disabled' : '',
        anchor: {
          payload: itemPage,
        }
      });
    }

    return links;
  }
}
