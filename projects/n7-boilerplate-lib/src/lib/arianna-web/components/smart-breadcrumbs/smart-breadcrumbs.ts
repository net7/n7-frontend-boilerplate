//---------------------------
// BREADCRUMBS.ts
//---------------------------

import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

/**
 * Interface for a single BreadcrumbsComponent's "Item"
 *
 * @property label (required)
 * @property payload (required)
 * @property classes (optional)
 * @property _meta (optional)
 *
 */
export interface ISmartBreadcrumbsItem {
    /**
     * item's label
     */
    label: string;
    /**
     * action click's payload
     */
    payload: any;
    /**
     * additional html classes
     */
    classes?: any;
    /**
     * additional info useful for the component's logic
     */
    _meta?: any;
}

/**
 * Interface for BreadcrumbsComponent's "Data"
 *
 * @property items (required)
 * @property classes (optional)
 *
 */
export interface ISmartBreadcrumbsData {
    /**
     * each item renders a breadcrumb level
     */
    items: ISmartBreadcrumbsItem[];
    /**
     * additional html classes
     */
    classes?: any;
}

@Component({
    selector: 'n7-smart-breadcrumbs',
    templateUrl: './smart-breadcrumbs.html'
})
export class SmartBreadcrumbsComponent implements AfterViewInit {
    @Input() data: ISmartBreadcrumbsData;
    @Input() emit: any;
    @ViewChild('bcol', { read: ElementRef, static:false }) bcol:ElementRef
    @ViewChild('bcdiv', {read: ElementRef, static:false }) bcdiv:ElementRef

    ngAfterViewInit() {
        let parentLength = this.bcdiv.nativeElement.clientWidth
        let childLength = this.bcol.nativeElement.clientWidth
        let liArray = this.bcol.nativeElement.children
        // collapse condition
        if ( parentLength === childLength ) {
            for ( let i = 1; i < liArray.length - 1; i++ ) {
                liArray[i].children[0].innerText = '__'
            }
        }
    }

    onClick(payload) {
        if (!this.emit) return;
        this.emit('click', payload);
    }
}
