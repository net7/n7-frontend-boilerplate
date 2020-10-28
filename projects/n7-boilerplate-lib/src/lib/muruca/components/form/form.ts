import {
  Component, ContentChild, Input, OnInit, TemplateRef
} from '@angular/core';
import { MrFormConfigGroup, MrFormConfigSection } from '../../interfaces/form.interface';
import { MrFormModel } from '../../models/form.model';

@Component({
  selector: 'mr-form',
  templateUrl: './form.html',
})
export class MrFormComponent implements OnInit {
  @Input() form: MrFormModel;

  @Input() group?: MrFormConfigGroup;

  @ContentChild(TemplateRef)
  public templateRef: TemplateRef<any>;

  public sections: MrFormConfigSection[];

  ngOnInit() {
    if (this.group) {
      this.sections = this.form.config.sections
        .filter(({ id }) => this.group.sections.includes(id));
    } else {
      this.sections = this.form.config.sections;
    }
  }
}
