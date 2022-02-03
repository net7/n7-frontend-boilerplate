import { LayoutDataSource } from '@n7-frontend/core';

export class DvExampleLayoutDS extends LayoutDataSource {
    private Items = [
      {
        text: 'Last week',
        payload: 'Last week',
      },
      {
        text: 'Last month',
        payload: 'Last month',
      },
      {
        text: 'Last year',
        payload: 'Last year',
      },
      {
        text: 'Select Date',
        // this payload key is use for visualise the datepicker.
        payload: 'ByDate',
      },
    ];

    private datepickerOptions = {
      dateFormat: 'Y-m-d',
      mode: 'range',
    };

    private datePickerExternalData = {
      select: {
        id: 'dv-select',
        label: 'Last week',
        items: this.Items,
      },
      datepicker: {
        id: 'datepicker',
        libOptions: this.datepickerOptions,
      },
    }

    onInit() {
      this.one('dv-datepicker-wrapper').update(this.datePickerExternalData);
    }
}
