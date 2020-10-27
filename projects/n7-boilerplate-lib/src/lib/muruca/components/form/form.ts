import {
  Component, ContentChild, Input, TemplateRef
} from '@angular/core';
import { MrFormModel } from '../../models/form.model';

@Component({
  selector: 'mr-form',
  templateUrl: './form.html',
})
export class MrFormComponent {
  @Input() form: MrFormModel;

  @ContentChild(TemplateRef)
  public templateRef: TemplateRef<any>;
}
