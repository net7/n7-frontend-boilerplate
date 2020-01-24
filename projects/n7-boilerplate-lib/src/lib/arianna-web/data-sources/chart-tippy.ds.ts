import { DataSource } from '@n7-frontend/core';

export class AwChartTippyDS extends DataSource {
  protected transform(data) {
    // ==== DATA ====
    const { id, label, count, isSelected } = data
    const { basePath } = this.options
    // entity id
    // entity label
    // entity count
    // entity isSelected
    // ==============
    const result = {
      anchorData: {
        href: `${basePath}${id}/${label}`
      }
    }
    return result
  }
}