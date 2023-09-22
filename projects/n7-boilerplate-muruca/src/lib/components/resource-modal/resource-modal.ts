import {
  Component, OnDestroy, OnInit
} from '@angular/core';
import { _t } from '@net7/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { MrLocaleService } from '../../services/locale.service';
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
    private router: Router,
    private modalService: MrResourceModalService,
    private localeService: MrLocaleService,
  ) { }

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

    // on router change close
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(() => !isEmpty(this.widgets)),
      filter((event) => event instanceof NavigationStart),
    ).subscribe(() => {
      this.onClose();
    });
  }

  ngOnDestroy() {
    // reset
    this.onClose();
    this.destroy$.next();
  }

  onClose(target?: { className: string }) {
    if (target && target.className !== 'mr-resource-modal__overlay') {
      return;
    }
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
        this.widgets[id].ds.options = {
          ...(options || {}),
          localeService: this.localeService
        };

        // update data
        if (data) {
          this.widgets[id].ds.update(data);
        }
      });
    }
  }
}
