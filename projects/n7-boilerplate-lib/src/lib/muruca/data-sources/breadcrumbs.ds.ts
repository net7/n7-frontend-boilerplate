import { DataSource } from '@n7-frontend/core';

export class MrBreadcrumbsDS extends DataSource {
  id: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected transform(data: any): any {
    const bcMock = {
      items: [{
        label: 'Home',
        anchor: { href: '/home' }
      }, {
        label: 'Opere',
        anchor: { href: '/opere' }
      }, {
        label: 'Opere giovanili',
        anchor: { href: '/opere-giovanili' }
      }, {
        label: 'Canzoniere',
        anchor: { href: '/canzoniere' }
      }, {
        label: 'Canzoniere (Rerum vulgarium fragmenta)',
        anchor: { href: '/canzoniere/rerum-vulgarium-fragmenta' }
      }]
    };
    return bcMock;
  }
}
