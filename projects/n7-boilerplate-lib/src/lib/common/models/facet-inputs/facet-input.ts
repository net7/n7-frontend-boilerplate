interface IFacetInputData {
  value: string | number,
  label: string,
  counter: number,
  options?: any
}

export abstract class FacetInput {
  static index: number = 0;

  private id: string;
  protected config: any;
  protected output: any;
  protected data: IFacetInputData[];

  constructor(config){
    this.config = config;
    this._setId();
    
    FacetInput.index++;
  }

  public abstract setActive(facetValue: any): void;
  protected abstract transform(): any;
  
  public update = () => this.output = this.transform();
  public getId = () => this.id;
  public getData = () => this.data;
  public getConfig = () => this.config;
  public getFacetId = () => this.config.facetId;
  public getInputIndex = () => this.config.inputIndex;
  public getSectionIndex = () => this.config.sectionIndex;
  public getType = () => this.config.type;
  public getOutput = () => this.output;
  
  public setData = (newData: IFacetInputData[]) => this.data = newData;
  private _setId() {
    this.id = `facet-input-${this.getType()}-${FacetInput.index}`;
  };
}