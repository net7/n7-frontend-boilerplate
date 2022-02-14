import { DataSource } from '@net7/core';

export class AwGalleryResultsDS extends DataSource {
  private pagination: any

  protected transform(data) {
    if (!data) return null;
    const { pageSize, currentPage } = this.options;
    // if the data doesn't fit on one page, render the pagination component
    if (data.length > pageSize) {
      this.addPagination(currentPage, Math.ceil(data.length / pageSize), pageSize);
    }
    return {
      res: data.slice(0, pageSize),
      pagination: this.pagination
    };
  }

  public chunks(a, size) {
    const results = [];
    while (a.length) {
      results.push(a.splice(0, size));
    }
    return results;
  }

  public addPagination = (page, totalPages, size) => {
    const sizeOptions = [12, 24, 48];
    this.pagination = {
      first: { payload: `goto-${1}`, classes: page === 1 ? 'is-disabled' : '' },
      prev: { payload: `goto-${page / 1 - 1}`, classes: page === 1 ? 'is-disabled' : '' },
      next: { payload: `goto-${page / 1 + 1}`, classes: page === totalPages ? 'is-disabled' : '' },
      last: { payload: `goto-${totalPages}`, classes: page === totalPages ? 'is-disabled' : '' },
      links: this.makePagination(totalPages, page),
      select: {
        label: 'Numero di risultati',
        options: sizeOptions.map((o) => ({
          text: o,
          selected: o === size,
        })),
        payload: 'select-size'
      },
    };
  }

  public makePagination = (totalPages, currentPage) => {
    /*
      Called by this.unpackData() when this.options.page is defined.
      Returns the data for <n7-pagination> component.
    */
    const result = [];
    let limit = 5 - 1;

    if (totalPages <= limit) {
      limit = totalPages - 1;
    }

    // always push the first page
    if (limit) {
      let lastPage: number; let
        firstPage: number;
      if (currentPage > Math.floor(limit / 2)) {
        if (totalPages === 2) {
          lastPage = totalPages;
          firstPage = 1;
          // when currentPage is after half-point
          // (example: [ 14 ][ 15 ][!16!][ 17 ][ 18 ])
        } else if (currentPage < (totalPages - Math.floor(limit / 2))) {
          lastPage = currentPage / 1 + Math.floor(limit / 2);
          firstPage = currentPage / 1 - Math.floor(limit / 2);
        } else {
          lastPage = totalPages;
          firstPage = currentPage - limit + (totalPages - currentPage);
        }
      } else {
        // when currentPage is before half-point
        // (example: [ 1 ][!2!][ 3 ][ 4 ][ 5 ])
        lastPage = limit + 1;
        firstPage = 1;
      }

      // eslint-disable-next-line no-plusplus
      for (let i = firstPage; i <= lastPage; i++) {
        result.push({
          text: String(i),
          payload: `page-${String(i)}`,
          classes: currentPage === i ? 'is-active' : ''
        });
      }
    } else {
      result.push({
        text: '1',
        payload: 'page-1',
        classes: currentPage === 1 ? 'is-active' : ''
      });
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < totalPages; i++) {
        result.push({ text: String(i + 1), payload: `page-${String(i + 1)}`, classes: currentPage === i + 1 ? 'is-active' : '' });
      }
    }
    return result;
  }
}
