import { Component, Input } from '@angular/core';

@Component({
  selector: 'container',
  templateUrl: './container.html',
})

export class ContainerComponent {
  /**
   * When true, enables responsiveness
   * and fills the available space
   */
  @Input() fluid: boolean;

  /**
   * Additional classes for the container element
   */
  @Input() classes: string;
}
