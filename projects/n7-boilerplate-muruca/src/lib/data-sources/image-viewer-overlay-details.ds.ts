import { ItemPreviewData } from '@net7/components';
import { DataSource } from '@net7/core';

type OverlayDetails = {
  coordinates: string;
  shape: string;
  title: string;
  action: string;
  description: string;
  detail_image_id: string;
  detail_image: string;
  'action-url-url': string;
  'action-url-open-in-window': boolean;
};

export class MrImageViewerOverlayDetailsDS extends DataSource {
  id: string;

  protected transform(data: OverlayDetails): ItemPreviewData {
    if (!data) return null;
    return {
      title: data.title,
      text: data.description,
      image: data.detail_image,
      classes: 'is-vertical'
    };
  }

  public show(data) {
    this.run(data);
  }

  public hide() {
    this.run(null);
  }
}
