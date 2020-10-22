import {
  Component, OnInit, OnDestroy, ViewChildren, ComponentFactoryResolver, QueryList
} from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout';
import { LayoutsConfigurationService } from '../../../common/services/layouts-configuration.service';
import { MrFormService } from '../../services/form.service';
import { MrAdvancedSearchLayoutConfig as config } from './advanced-search-layout.config';

@Component({
  selector: 'mr-advanced-search-layout',
  templateUrl: './advanced-search-layout.html',
})
export class MrAdvancedSearchLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
  @ViewChildren('inputHost') inputHosts: QueryList<Component>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formService: MrFormService,
    layoutsConfiguration: LayoutsConfigurationService,
  ) {
    super(layoutsConfiguration.get('MrAdvancedSearchLayoutConfig') || config);
  }

  protected initPayload() {
    return {};
  }

  ngOnInit() {
    setTimeout(() => {
      // console.log('hosts', this.inputHosts.toArray());
    }, 5000);
    // const componentFactory = this.componentFactoryResolver
    //   .resolveComponentFactory(InputTextComponent);
    // const { viewContainerRef } = this.inputHost;
    // const componentRef = viewContainerRef.createComponent<InputTextComponent>(componentFactory);
    // componentRef.instance.data = {
    //   id: 'input-text-1',
    //   label: 'SEARCH LABEL',
    //   placeholder: 'Search',
    //   icon: 'n7-icon-search',
    //   inputPayload: 'search-input',
    //   enterPayload: 'search-enter',
    //   iconPayload: 'search-icon',
    // };
    /* this.formService.load({
      sections: [{
        id: 'section-1',
        inputs: [{
          id: 'input-1',
          type: 'text',
          data: {} as InputTextData,
          state: {
            value: 'hola!',
            // disabled: true,
            // hidden: false
          }
        }]
      }]
    });

    this.formService.input('input-1').setState({ hidden: true });

    console.log('form state', this.formService.getFormState()); */
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
