import { NetworkData } from '@net7/components';
import { DataSource } from '@net7/core';

export class MrNetworkDS extends DataSource {
  id: string;

  protected transform(data):NetworkData {
    return data;
  }
}
