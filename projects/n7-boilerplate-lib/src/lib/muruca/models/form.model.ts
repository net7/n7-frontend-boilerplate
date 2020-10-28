import { Subject, ReplaySubject } from 'rxjs';
import { MrInputTextDS } from '../data-sources/form/input-text.ds';
import { MrInputTextEH } from '../event-handlers/form/input-text.eh';
import { MrInputSelectDS } from '../data-sources/form/input-select.ds';
import { MrInputSelectEH } from '../event-handlers/form/input-select.eh';
import {
  MrChangedParams,
  MrInputDataSource,
  MrFormConfig,
} from '../interfaces/form.interface';

export class MrFormModel {
  public config: MrFormConfig;

  public loaded$: ReplaySubject<boolean> = new ReplaySubject();

  public inputs: {
    [id: string]: {
      ds: any;
      eh: any;
      emit: (t: string, p: any) => Function;
    };
  } = {};

  private inputTypes: {
    [id: string]: {
      ds: any;
      eh: any;
    };
  } = {
    text: {
      ds: MrInputTextDS,
      eh: MrInputTextEH
    },
    select: {
      ds: MrInputSelectDS,
      eh: MrInputSelectEH
    }
  };

  changed$: Subject<MrChangedParams> = new Subject();

  init(config: MrFormConfig) {
    this.config = config;

    // init inputs
    this.initInputs();

    // emit signal
    this.loaded$.next(true);
  }

  getInput = (id: string): MrInputDataSource<any> => this.inputs[id].ds;

  getInputs = (): {
    [id: string]: MrInputDataSource<any>;
  } => {
    const inputs = {};
    Object.keys(this.inputs).forEach((id) => {
      inputs[id] = this.getInput(id);
    });
    return inputs;
  }

  getState() {
    const state = {};
    Object.keys(this.inputs).forEach((key) => {
      state[key] = this.inputs[key].ds.getState();
    });
    return state;
  }

  addInputType(type: string, ds: any, eh: any) {
    if (this.inputTypes[type]) {
      throw Error(`input type ${type} already exists!`);
    }

    this.inputTypes[type] = { ds, eh };
  }

  private initInputs() {
    const { sections } = this.config;
    sections.forEach((section) => {
      section.inputs.forEach(({
        id, type, options, state, data
      }) => {
        const DSClass = this.inputTypes[type].ds;
        const EHClass = this.inputTypes[type].eh;
        const DSInstance = new DSClass(options || {});
        const EHInstance = new EHClass();
        // set datasource id
        DSInstance.id = id;
        // set initial data
        if (data) {
          DSInstance.update(data);
        }
        // set state
        if (state) {
          DSInstance.setState(state);
        }
        // set eventhandler hostid
        EHInstance.hostId = id;
        // attach datasource to eventhandler
        EHInstance.dataSource = DSInstance;
        // attach changed$ to eventhandler
        EHInstance.changed$ = this.changed$;
        // listen to input events
        EHInstance.listen();
        // save it to input
        this.inputs[id] = {
          ds: DSInstance,
          eh: EHInstance,
          emit: (t: string, p: any) => EHInstance.emitInner(t, p)
        };
      });
    });
  }
}
