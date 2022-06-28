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
  // @Input() data: BehaviorSubject<CardState>;
  @Input() state$: BehaviorSubject<CardState>;

  @Input() stateComponents: CardStateComponents;

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
            this[stateID].clear();
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
