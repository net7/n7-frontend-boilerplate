import {
  Component, Input, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CardState, CardStateComponents } from '../../types/card.types';

@Component({
  selector: 'dv-card-state-wrapper',
  templateUrl: './card-state-wrapper.html',
})

export class CardStateWrapperComponent implements OnInit {
  @Input() state$: BehaviorSubject<CardState>;

  @Input() stateComponents: CardStateComponents;

  // Possible card states:

  @ViewChild('loading', { read: ViewContainerRef }) loading: ViewContainerRef;

  @ViewChild('empty', { read: ViewContainerRef }) empty: ViewContainerRef;

  @ViewChild('error', { read: ViewContainerRef }) error: ViewContainerRef;

  @ViewChild('idle', { read: ViewContainerRef }) idle: ViewContainerRef;

  private componentRef = {};

  ngOnInit(): void {
    // Called after the constructor, initializing input properties,
    // and the first call to ngOnChanges.
    this.state$
      // This subscriber must run AFTER the HTML async pipe
      .pipe(delay(0))
      .subscribe({
        next: (stateID) => {
          if (this.stateComponents && this.stateComponents[stateID]) {
            // only clear the state if the view exists
            if (this[stateID]) {
              // this[stateID] will be one of the states declared as @ViewChild
              this[stateID].clear();
            }
            const { component, data } = this.stateComponents[stateID];
            if (component) {
              this.componentRef[stateID] = this[stateID].createComponent(component);
              if (data) {
                this.componentRef[stateID].instance.data = data;
              }
            }
          }
        }
      });
  }
}
