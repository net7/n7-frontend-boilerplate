import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { MrInputTextDS } from '../data-sources/form/input-text.ds';
import { MrInputTextEH } from '../event-handlers/form/input-text.eh';
import {
  MrFormInputState,
  MrInputDataSource,
  MrFormConfig,
  MrInputEventHandler,
} from '../interfaces/form.interface';

@Injectable()
export class MrFormService {
  private config: MrFormConfig;

  public loaded$: ReplaySubject<boolean> = new ReplaySubject();

  private inputs: {
    [id: string]: {
      ds: MrInputDataSource<any>;
      eh: MrInputEventHandler;
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
    }
  };

  changed$: Subject<{
    id: string;
    state: MrFormInputState<any>;
  }> = new Subject();

  load(config: MrFormConfig) {
    this.config = config;

    // init inputs
    this.initInputs();

    // emit signal
    this.loaded$.next(true);
  }

  input = (id: string) => this.inputs[id];

  getFormState() {
    const formState = {};
    Object.keys(this.inputs).forEach((key) => {
      formState[key] = this.inputs[key].ds.getState();
    });
    return formState;
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
        // attach datasource to eventhandler
        EHInstance.dataSource = DSInstance;
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
