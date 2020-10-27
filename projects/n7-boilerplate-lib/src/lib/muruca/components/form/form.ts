import {
  Component, Input
} from '@angular/core';
import { MrForm } from '../../models/form';

@Component({
  selector: 'mr-form',
  templateUrl: './form.html',
})
export class MrFormComponent {
  @Input() form: MrForm;
}
