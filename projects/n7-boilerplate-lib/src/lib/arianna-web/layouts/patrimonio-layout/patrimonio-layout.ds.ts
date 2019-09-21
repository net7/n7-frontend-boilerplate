import { LayoutDataSource } from '@n7-frontend/core';

export class AwPatrimonioLayoutDS extends LayoutDataSource {
  /**
  * If you are not using these variables (from your-layout.ts), 
  * remove them from here too.
  */
  private communication: any;
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
  onInit({configuration, mainState, router, options, titleService, communication }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.communication = communication;
    this.options = options;

    this.one('aw-patrimonio-sidebar-header').update(null);    
    
    //this.one('aw-tree').update(null);

    this.communication.request$('getTree', {
      onError: (error) => console.log(error),
      params: { treeId: "patrimonioId" },
      // method: 'GET',
      // httpOptions: {}
    }).subscribe((response) => {
      let header = response['label'];
      this.one('aw-tree').update(response);
      this.one('aw-patrimonio-sidebar-header').update(header);
    });
  }
}