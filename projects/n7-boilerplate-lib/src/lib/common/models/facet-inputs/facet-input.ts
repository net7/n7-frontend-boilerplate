interface IFacetInputData {
  value: string | number;
  label: string;
  counter: number;
  hidden?: boolean;
  options?: any;
}

export abstract class FacetInput {
  static index = 0;

  private id: string;
  protected config: any;
  protected output: any;
  protected data: IFacetInputData[];
  protected isEmpty = false;

  constructor(config) {
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
  public getContext = () => this.config.filterConfig.context || 'external';
  public getTarget = () => this.config.filterConfig.target || null;
  public getSearchIn = () => this.config.filterConfig.searchIn || null;
  public getType = () => this.config.type;
  public getOutput = () => this.output;

  public setIsEmpty = (empty: boolean) => {
    this.isEmpty = empty;
  }
  public setData = (newData: IFacetInputData[]) => this.data = newData;
  private _setId() {
    this.id = `facet-input-${this.getType()}-${FacetInput.index}`;
  }
}
