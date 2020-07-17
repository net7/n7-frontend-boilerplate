import { AwSearchLayoutDS } from '../search-layout/search-layout.ds';
import facetsConfig from './gallery-facets.config';

export class AwGalleryLayoutDS extends AwSearchLayoutDS {
  public layoutId = 'aw-gallery-layout';

  public configId = 'gallery-layout';

  public currentNav = 'galleria';

  public headTitle = 'Arianna4View - Galleria';

  public facetsConfig = facetsConfig;

  public paginationList = [12, 24, 48];

  public pageSize = 12; // linked objects page size
}
