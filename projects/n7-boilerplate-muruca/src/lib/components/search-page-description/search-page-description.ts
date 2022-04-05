import { Component, Input } from '@angular/core';

export type SearchPageDescriptionData = {
  text: string;
  link: {
    text: string;
    payload: any;
  };
}

@Component({
  selector: 'mr-search-page-description',
  templateUrl: './search-page-description.html',
})
export class MrSearchPageDescriptionComponent {
  @Input() data: SearchPageDescriptionData;

  @Input() emit: (type: string, payload: any) => void;

  onClick(payload) {
    if (this.emit) {
      this.emit('click', payload);
    }
  }
}
