import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MrFormInputState, MrFormConfig } from '../interfaces/form.interface';
import { MrInputDS } from '../data-sources/form/input.ds';
import { MrInputEH } from '../event-handlers/form/input.eh';
import { MrInputTextDS } from '../data-sources/form/input-text.ds';
import { MrInputTextEH } from '../event-handlers/form/input-text.eh';

@Injectable()
export class MrFormService {
  private config: MrFormConfig;

  private inputs: {
    [id: string]: {
      ds: any;
      eh: any;
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

  change$: Subject<{
    id: string;
    state: MrFormInputState;
  }> = new Subject();

  load(config: MrFormConfig) {
    this.config = config;

    // init inputs
    this.initInputs();
  }

  input(id: string): {
    setState(state: MrFormInputState): void;
    clear(): void;
    refresh(): void;
  } {
    const input = this.inputs[id];
    if (!input) {
      throw Error(`Input ${id} not found`);
    }

    const { setState, clear, refresh } = input.ds;
    return {
      setState: setState.bind(input.ds),
      clear: clear.bind(input.ds),
      refresh: refresh.bind(input.ds)
    };
  }

  addInputType(type: string, ds: MrInputDS, eh: MrInputEH) {
    if (this.inputTypes[type]) {
      throw Error(`Input type ${type} already exists`);
    }

    this.inputTypes[type] = { ds, eh };
  }

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
        id, type, options, state
      }) => {
        const DSClass = this.inputTypes[type].ds;
        const EHClass = this.inputTypes[type].eh;
        const DSInstance = new DSClass(options || {});
        const EHInstance = new EHClass();
        // set datasource id
        DSInstance.id = id;
        // set state
        if (state) {
          DSInstance.setState(state);
        }
        // attach datasource to eventhandler
        EHInstance.dataSource = DSInstance;
        // save it to input
        this.inputs[id] = {
          ds: DSInstance,
          eh: EHInstance
        };
      });
    });
  }
}
