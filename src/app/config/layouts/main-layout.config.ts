import { MainLayoutConfig } from 'n7-boilerplate-lib';
import { AppLayoutDS } from 'src/app/app-layout.ds';

export default {
  ...MainLayoutConfig,
  layoutDS: AppLayoutDS,
  options: {
    hello: 'world'
  }
}