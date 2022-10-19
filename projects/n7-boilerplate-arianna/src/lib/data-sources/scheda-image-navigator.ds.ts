import { DataSource } from '@net7/core';
import { SchedaImageNavigatorData } from '../components/scheda-image-navigator/scheda-image-navigator';

export class AwSchedaImageNavigatorDS extends DataSource {
  private instance;

  private current;

  private total;

  protected transform(instance): SchedaImageNavigatorData {
    this.instance = instance;
    this.current = 1;
    this.total = this.instance.referenceStrip?.panels?.length;

    // check images total > 1
    if (!this.total) return null;

    const { buttonText } = (this.options || {});

    // listen viewer
    this.listenViewer();

    return {
      input: {
        id: 'scheda-image-navigator-input',
        type: 'number',
        label: this.getLabel(),
        min: 1,
        max: this.total,
        value: this.current,
        inputPayload: 'input',
        enterPayload: 'enter'
      },
      button: {
        label: buttonText,
        // disabled: true,
      }
    };
  }

  public onChange({ inputPayload, value }) {
    if (inputPayload === 'input') {
      let formattedValue = value;
      if (formattedValue) {
        formattedValue = +formattedValue;
        if (formattedValue > this.total) {
          formattedValue = this.total;
        }
        if (formattedValue < 1) {
          formattedValue = 1;
        }
      }
      this.current = formattedValue || null;

      // force input value
      this.output.input.value = this.current;
    } else if (inputPayload === 'enter') {
      this.onSubmit();
    }
  }

  public onSubmit() {
    if (this.instance && this.current) {
      this.instance.goToPage(this.current - 1);

      // update label
      this.updateLabel();
    }
  }

  private updateLabel() {
    const { input } = this.output;
    input.label = this.getLabel();
  }

  private getLabel() {
    const { label } = this.options;
    return label
      .replace('{current}', this.current)
      .replace('{total}', this.total);
  }

  private listenViewer() {
    this.instance.addHandler('page', (event) => {
      const { page } = event;
      if ((page + 1) !== this.current) {
        // trigger change manually
        this.onChange({
          inputPayload: 'input',
          value: page + 1
        });

        // update label
        this.updateLabel();
      }
    });
  }
}
