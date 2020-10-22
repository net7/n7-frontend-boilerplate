import { Component, Input } from '@angular/core';

@Component({
  selector: 'mr-input-host',
  templateUrl: './input-host.html',
})
export class InputHostComponent {
  @Input() data: any;
}
