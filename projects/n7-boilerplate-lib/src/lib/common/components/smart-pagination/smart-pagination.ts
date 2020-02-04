import { Component, Input } from '@angular/core';

@Component({
  selector: 'n7-smart-pagination',
  templateUrl: './smart-pagination.html',
})

export class SmartPaginationComponent {
  @Input() data: any;
  @Input() emit: any;

  constructor() {
    this.handlePaginationEvent.bind(this);
  }
  
  handlePaginationEvent(type, payload) {
    if (!this.emit) return;
    this.emit('change', payload)
  }
}
