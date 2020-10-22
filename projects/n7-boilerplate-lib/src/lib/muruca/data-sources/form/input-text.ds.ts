import { _t } from '@n7-frontend/core';
import { InputTextData } from '@n7-frontend/components';
import { MrInputDS } from './input.ds';

export class MrInputTextDS extends MrInputDS {
  protected state = {
    value: null,
    disabled: false,
    hidden: false,
  };

  protected transform(data: InputTextData): InputTextData {
    return {
      ...data,
      placeholder: _t(data.placeholder)
    };
  }

  refresh() {
    const { value } = this.state;
    this.update({
      ...this.input,
      value
    });

    // fix element update
    const el = document.getElementById(this.id) as HTMLInputElement;
    if (el) {
      el.value = value;
    }

    // FIXME: handle disabled

    // FIXME: handle hidden
  }
}
