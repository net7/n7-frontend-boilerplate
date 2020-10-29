import {
  Component, Input
} from '@angular/core';
import { MrFormConfig } from '../../interfaces/form.interface';
import { MrFormModel } from '../../models/form.model';

export type MrFormWrapperAccordionData = {
  config: MrFormConfig;
  form?: MrFormModel;
}

@Component({
  selector: 'mr-form-wrapper-accordion',
  templateUrl: './form-wrapper-accordion.html',
})
export class MrFormWrapperAccordionComponent {
  @Input() data: MrFormWrapperAccordionData;

  @Input() emit: (type: string, payload?: any) => void;

  fakeEmit(type, payload?) {
    if (!this.emit) {
      return;
    }
    this.emit(type, payload);
  }

  onReset() {
    this.fakeEmit('reset');
  }

  onSubmit() {
    this.fakeEmit('submit');
  }
}
