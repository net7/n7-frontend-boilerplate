interface FacetInputData {
  value: string | number;
  label: string;
  counter: number;
  hidden?: boolean;
  options?: any;
}

export abstract class AwFacetInput {
  static index = 0;

  private id: string;

  protected config: any;

  protected output: any;

  protected data: FacetInputData[];

  protected isEmpty = false;

  constructor(config) {
    this.config = config;
    this._setId();

    AwFacetInput.index += 1;
  }

  public abstract setActive(facetValue: any): void;

  protected abstract transform(): any;

  public update = () => { this.output = this.transform(); }

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

  /**
   * Pure validity check against the optional config-driven `validation`.
   * The consumer may supply either a `validator(value) => boolean` function
   * (takes precedence) or a `pattern` (RegExp or string). Empty values are
   * always valid (use `required` for emptiness). Does not mutate the output.
   */
  public isValid(value?): boolean {
    const { validation } = this.config;
    if (!validation) {
      return true;
    }
    const str = value == null ? '' : `${value}`.trim();
    if (str.length === 0) {
      return true;
    }
    if (typeof validation.validator === 'function') {
      return !!validation.validator(str);
    }
    if (validation.pattern) {
      const pattern = validation.pattern instanceof RegExp
        ? validation.pattern
        : new RegExp(validation.pattern);
      return pattern.test(str);
    }
    return true;
  }

  /**
   * Validates the value and reflects the error state on the output (error
   * flag / message) so the facet component can render it accessibly.
   */
  public validate(value?): boolean {
    const { validation } = this.config;
    if (!validation || !this.output) {
      return true;
    }
    const valid = this.isValid(value);
    this.output.error = !valid;
    this.output.errorMessage = valid ? null : validation.message;
    return valid;
  }

  public clear() { return null; }

  public setIsEmpty = (empty: boolean) => {
    this.isEmpty = empty;
  }

  public setData = (newData: FacetInputData[]) => { this.data = newData; }

  private _setId() {
    this.id = `facet-input-${this.getType()}-${AwFacetInput.index}`;
  }
}
