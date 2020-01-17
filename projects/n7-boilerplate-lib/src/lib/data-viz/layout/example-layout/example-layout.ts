import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout'
import { DvExampleLayoutConfig as config } from './example-layout.config';

@Component({
    selector: 'dv-example-layout',
    templateUrl: './example-layout.html',
})
export class DvExampleLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
    constructor(){
        super(config);
    }

    ngOnInit(){
        this.onInit();
    }

    ngOnDestroy(){
        this.onDestroy();
    }
}