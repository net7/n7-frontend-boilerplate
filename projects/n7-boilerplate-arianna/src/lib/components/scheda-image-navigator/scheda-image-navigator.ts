import { Component, Input } from '@angular/core';
import { InputTextData } from '@net7/components';

export type SchedaImageNavigatorData = {
  input: InputTextData;
  button: {
    label: string;
    disabled?: boolean;
  };
  classes?: string;
}

@Component({
  selector: 'aw-scheda-image-navigator',
  templateUrl: './scheda-image-navigator.html'
})
export class SchedaImageNavigatorComponent {
  @Input() data: SchedaImageNavigatorData;

  @Input() emit: (type: string, payload?: unknown) => void;

  onSubmit() {
    if (!this.emit) return;
    this.emit('submit');
  }
}
