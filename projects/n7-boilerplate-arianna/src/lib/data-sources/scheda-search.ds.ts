import { helpers } from '@net7/boilerplate-common';
import {
  Button, InnerTitleData, InputSelectData, InputTextData, PaginationData
} from '@net7/components';
import { DataSource } from '@net7/core';
import { SchedaSearchData } from '../components/scheda-search/scheda-search';
import nodeHelper from '../helpers/node.helper';
import { NodesResponse } from './extended-tree.ds';

const PAGE_LIMIT = 5;

export class AwSchedaSearchDS extends DataSource {
  protected transform = (nodes: NodesResponse): SchedaSearchData => {
    const {
      placeholder, title, params, basePath, lite, configKeys
    } = this.options || {};
    const { totalCount } = nodes || {};
    const page = params.page ? +params.page : 1;
    const limit = params.limit ? +params.limit : 10;

    // header
    const header: InnerTitleData = {
      title: {
        main: {
          text: title || 'Cerca nelle Aggregazioni Logiche',
        }
      }
    };

    // input
    const input: InputTextData = {
      id: 'scheda-search-input',
      placeholder: placeholder || 'Cerca...',
      icon: 'n7-icon-search',
      enterPayload: 'input-enter',
      inputPayload: 'input-change'
    };

    // items
    const items = (nodes?.items || []).map((item) => {
      // breadcrumbs
      const breadcrumbs = {
        items: []
      };
      if (item.breadcrumbs) {
        breadcrumbs.items = item.breadcrumbs.map(({ label, link: href }) => ({
          label,
          anchor: { href },
        }));
      }
      return {
        icon: nodeHelper.getNodeIcon(configKeys, item),
        thumbnail: lite ? null : item.img,
        label: item.label,
        anchor: {
          href: `${basePath}/${item.id}/${helpers.slugify(item.label)}`
        },
        breadcrumbs
      };
    });

    // pagination
    const pagination: PaginationData = nodes?.items?.length
      ? this.getPagination(page, totalCount, limit)
      : null;

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
      input,
      items,
      pagination,
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
