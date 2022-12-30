import { CommunicationService } from '@net7/boilerplate-common';
import { LayoutDataSource } from '@net7/core';

export class DvExampleLayoutDS extends LayoutDataSource {
  private communication: CommunicationService;

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
  };

  onInit(payload) {
    this.communication = payload.communication;
    this.one('dv-datepicker-wrapper').update(this.datePickerExternalData);

    // communication test
    // get
    this.communication.request$('posts').subscribe((response) => {
      console.log('GET: posts------------>', response);
    });
    // this.communication.request$('firstPost').subscribe((response) => {
    //   console.log('GET: firstPost------------>', response);
    // });
    // this.communication.request$('firstPost', {
    //   method: 'DELETE'
    // }).subscribe((response) => {
    //   console.log('GET: firstPost------------>', response);
    // });

    // // post
    // this.communication.request$<object, object>('firstPost', {
    //   method: 'PATCH',
    //   params: {
    //     title: 'new title',
    //   }
    // }).subscribe((response) => {
    //   console.log('POST: posts------------>', response);
    // });

    // // dynamic
    // this.communication.request$<object, object>('posts', {
    //   method: 'PATCH',
    //   urlParams: '/2',
    //   params: {
    //     title: 'new title',
    //   }
    // }).subscribe((response) => {
    //   console.log('POST: dynamic------------>', response);
    // });
  }
}
