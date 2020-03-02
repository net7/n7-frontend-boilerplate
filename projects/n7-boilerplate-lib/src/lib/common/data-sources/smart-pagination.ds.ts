import { DataSource } from '@n7-frontend/core';

export class SmartPaginationDS extends DataSource {
  protected transform(data) {
    const {
      totalPages, currentPage, pageLimit, sizes,
    } = data;
    const { mode, href, queryParams } = this.options;
    // ===== WARNINGS =====
    if (!['href', 'payload'].includes(mode)) {
      console.warn('(smart-pagination) The "mode" option is incorrect. Please specify "href" or "payload" as the mode option.');
    }

    const {
      links, first, prev, next, last,
    } = this.paginationBuilder(
      totalPages, currentPage, pageLimit,
      mode, href, queryParams,
    );
    return {
      first,
      prev,
      next,
      last,
      links,
      select: sizes ? {
        label: 'Numero di risultati',
        options: sizes.list.map((s) => ({
          text: s,
          selected: s === sizes.active,
        })),
        payload: 'select-size',
      } : null,
    };
  }

  private paginationBuilder = (tp, cp, pl, m, href, qp) => {
    const result = [];
    /*
      tp - total pages
      cp - current page
      pl - page limit
      m - pagination mode (href or payloads)
      href - href for anchor wrapper
      qp - query params for pagination
    */
    let limit = pl;
    if (tp <= limit) {
      limit = tp - 1;
    }
    if (limit) {
      let
        lp: number; // last page
      let fp: number; // first page
      if (cp > Math.floor(limit / 2)) {
        if (tp === 2) {
          lp = tp;
          fp = 1;
          // when currentPage is after half-point
          // (example: [ 14 ][ 15 ][!16!][ 17 ][ 18 ])
        } else if (cp < (tp - Math.floor(limit / 2))) {
          lp = cp / 1 + Math.floor(limit / 2);
          fp = cp / 1 - Math.floor(limit / 2);
        } else {
          lp = tp;
          fp = cp - limit + (tp - cp);
        }
      } else {
        // when currentPage is before half-point
        // (example: [ 1 ][!2!][ 3 ][ 4 ][ 5 ])
        lp = limit + 1;
        fp = 1;
      }
      for (let i = fp; i <= lp; i + 1) {
        result.push({
          text: String(i),
          classes: cp === i ? 'is-active' : '',
          anchor: cp !== i ? this._getPaginationAnchor(i, m, href, qp) : null,
        });
      }
    } else {
      result.push({
        text: '1',
        classes: cp === 1 ? 'is-active' : '',
        anchor: cp !== 1 ? this._getPaginationAnchor(1, m, href, qp) : null,
      });
      for (let i = 1; i < tp; i + 1) {
        result.push({
          text: String(i + 1),
          classes: cp === i + 1 ? 'is-active' : '',
          anchor: cp !== i + 1 ? this._getPaginationAnchor(i + 1, m, href, qp) : null,
        });
      }
    }
    return {
      links: result,
      first: {
        classes: cp === 1 ? 'is-disabled' : '',
        anchor: cp !== 1 ? this._getPaginationAnchor(1, m, href, qp) : null,
      },
      prev: {
        classes: cp === 1 ? 'is-disabled' : '',
        anchor: cp !== 1 ? this._getPaginationAnchor(cp / 1 - 1, m, href, qp) : null,
      },
      next: {
        classes: cp === tp ? 'is-disabled' : '',
        anchor: cp !== tp ? this._getPaginationAnchor(cp / 1 + 1, m, href, qp) : null,
      },
      last: {
        classes: cp === tp ? 'is-disabled' : '',
        anchor: cp !== tp ? this._getPaginationAnchor(tp, m, href, qp) : null,
      },
    };
  }

  private _getPaginationAnchor(page, mode, href, queryParams) {
    switch (mode) {
      case 'payload':
        return {
          payload: { source: 'pagination', page },
        };
      case 'href':
        return {
          href: queryParams ? href : href + page,
          queryParams: queryParams ? {
            ...queryParams,
            page,
          } : null,
        };
      default:
        break;
    }
    return {};
  }
}
