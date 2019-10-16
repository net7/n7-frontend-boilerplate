interface IFacetInputData {
  value: string | number,
  label: string,
  count: number,
  options?: any
}

export abstract class FacetInput {
  static counter: number = 0;

  private id: string;
  protected config: any;
  protected inputConfig: any;
  protected data: IFacetInputData[];

  constructor(config){
    this.config = config;
    this._setId();
    
    FacetInput.counter++;
  }

  public abstract setInputConfig(): void;
  public abstract setActive(facetValue: any): void;
  
  public getId = () => this.id;
  public getData = () => this.data;
  public getConfig = () => this.config;
  public getFacetId = () => this.config.facetId;
  public getType = () => this.config.type;
  public getInputConfig = () => this.inputConfig;
  
  public setData = (newData: IFacetInputData[]) => this.data = newData;
  private _setId() {
    this.id = `facet-input-${this.getType()}-${FacetInput.counter}`;
  };
}