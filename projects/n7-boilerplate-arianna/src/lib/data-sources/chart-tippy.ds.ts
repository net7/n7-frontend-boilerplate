import { DataSource } from '@n7-frontend/core';
import { helpers } from '@net7/boilerplate-common';

export class AwChartTippyDS extends DataSource {
  protected transform(data) {
    // ====== DATA ======
    const { bubbles, selected } = data;
    const { basePath, selectable } = this.options;
    // ==================
    const templates: any[] = bubbles.map((b) => {
      const { count, entity } = b;
      const {
        id, label, relation, relationName
      } = entity;
      return {
        id,
        selectable,
        title: label,
        text: `È collegato a ${count} risultati`,
        isSelected: selected.includes(id),
        anchorData: {
          href: `${basePath}${id}/${helpers.slugify(label)}`,
        },
        relation: {
          key: relationName,
          value: relation,
        }
      };
    });
    return templates;
  }
}
