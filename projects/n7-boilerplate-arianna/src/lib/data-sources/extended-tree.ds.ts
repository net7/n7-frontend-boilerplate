import {
  Button, InnerTitleData, InputSelectData, InputTextData, PaginationData
} from '@net7/components';
import { DataSource } from '@net7/core';
import { helpers } from '@net7/boilerplate-common';
import { ExtendedTreeData } from '../components/extended-tree/extended-tree';

type ParentResponse = {
  label: string;
}

type NodesResponse = {
  results: {
    items: {
      thumbnail?: string;
      label: string;
      id: string;
    }[];
  };
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
      title, params, basePath, lite
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
    const items = nodes.results.items.map(({ thumbnail, label, id }) => ({
      icon: 'n7-icon-file3',
      thumbnail: lite ? null : thumbnail,
      label,
      anchor: {
        href: `${basePath}/${id}/${helpers.slugify(label)}`
      }
    }));
    // pagination
    const pagination: PaginationData = this.getPagination(page, totalCount);
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

  private getPagination(page, totalCount): PaginationData {
    const limit = PAGE_LIMIT;
    const pages = Math.round(totalCount / limit);

    return {
      links: this.getPaginationLinks(page, pages, limit),
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

  private getPaginationLinks(page, pages, limit): Button[] {
    let firstItem = 1;
    const links: Button[] = [];
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
