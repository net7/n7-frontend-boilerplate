import {
  Component, Input, OnInit, OnDestroy
} from '@angular/core';
import { MrFormModel } from '../../models/form.model';

export type MrFormWrapperAccordionData = {
  form: MrFormModel;
}

@Component({
  selector: 'mr-form-wrapper-accordion',
  templateUrl: './form-wrapper-accordion.html',
})
export class MrFormWrapperAccordionComponent implements OnInit, OnDestroy {
  @Input() data: MrFormWrapperAccordionData;

  @Input() emit: (type: string, payload?: any) => void;

  ngOnInit() {
    this.fakeEmit('init');
  }

  ngOnDestroy() {
    this.fakeEmit('destroy');
  }

  fakeEmit = (type, payload?) => {
    if (!this.emit) {
      return;
    }
    this.emit(type, payload);
  };

  onReset() {
    this.fakeEmit('reset');
  }

  onSubmit() {
    this.fakeEmit('submit');
  }
}
