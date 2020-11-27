import {
  Component, OnDestroy, OnInit
} from '@angular/core';
import { _t } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalStatus, MrResourceModalService } from '../../services/resource-modal.service';

import {
  MrCollectionDS,
  MrInnerTitleDS,
  MrItemPreviewDS,
  MrMetadataDS,
} from '../../data-sources';

const DATASOURCE_MAP = {
  collection: MrCollectionDS,
  metadata: MrMetadataDS,
  preview: MrItemPreviewDS,
  title: MrInnerTitleDS,
};

@Component({
  selector: 'mr-resource-modal',
  templateUrl: './resource-modal.html',
})
export class MrResourceModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();

  public status: ModalStatus = 'IDLE';

  public config: any;

  public widgets: {
    [id: string]: {
      ds: any;
    };
  } = {};

  public errorTitle = _t('global#layout_error_title');

  public errorDescription = _t('global#layout_error_description');

  constructor(
    private modalService: MrResourceModalService
  ) {}

  ngOnInit() {
    this.modalService.state$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(({ status, config, response }) => {
        this.status = status;
        this.config = config;

        if (status === 'SUCCESS') {
          this.loadWidgets(config, response);
        }
      });
  }

  ngOnDestroy() {
    // reset
    this.onClose();
    this.destroy$.next();
  }

  onClose() {
    this.widgets = {};
    this.modalService.close();
  }

  private loadWidgets(config, response) {
    const { top, content } = config.sections;
    const sections = top.concat(content);
    if (sections) {
      sections.forEach(({ id, type, options }) => {
        const data = response.sections[id];
        this.widgets[id] = {
          ds: new DATASOURCE_MAP[type]()
        };

        // update options
        if (options) {
          this.widgets[id].ds.options = options;
        }

        // update data
        if (data) {
          this.widgets[id].ds.update(data);
        }
      });
    }
  }
}
