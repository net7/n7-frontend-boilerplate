//---------------------------
// SchedaDropdown.ts
//---------------------------

import { Component, Input } from '@angular/core';
import { Icon } from '@net7/components';

export type SchedaDropdownData = {
  header: {
    label: string;
    icon: Icon;
    payload: any;
  };
  items: {
    label: string;
    payload: any;
    selected: false;
    type: string;
  }[];
  classes?: any;
}

@Component({
  selector: 'aw-scheda-dropdown',
  templateUrl: './scheda-dropdown.html',
})
export class SchedaDropdownComponent {
  @Input() data: SchedaDropdownData;

  @Input() emit: (type: string, payload: any) => void;

  onClick(ev: Event, payload) {
    if (!this.emit) {
      return;
    }

    ev.stopImmediatePropagation();

    this.emit('click', payload);
  }
}
