import { LayoutDataSource } from '@n7-frontend/core';

export class AwPatrimonioLayoutDS extends LayoutDataSource {
  /**
  * If you are not using these variables (from your-layout.ts), 
  * remove them from here too.
  */
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected titleService: any;

  public options: any;
  public pageTitle: string;

  /**
  * If you are not using these variables (from your-layout.ts), 
  * remove them from onInit() parameters and inside the function.
  */
  onInit({ configuration, mainState, router, options, titleService }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.options = options;

    /*
    * For an example of header update, or mainState update, check
    * main-layout.ds.ts
    */
  }
}