import { EventHandler } from '@n7-frontend/core';
import { MrFormService } from '../../services/form.service';

export abstract class MrInputEH extends EventHandler {
  protected form: MrFormService;
}
