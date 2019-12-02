import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractLayout } from '../../../common/models/abstract-layout'
import { DvHomeLayoutConfig as config } from './home-layout.config';

@Component({
    selector: 'dv-home-layout',
    templateUrl: './home-layout.html'
})
export class DvHomeLayoutComponent extends AbstractLayout implements OnInit, OnDestroy {
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