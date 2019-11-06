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
    @ViewChild('bcol', { read: ElementRef, static: false }) bcol: ElementRef
    @ViewChild('bcdiv', { read: ElementRef, static: false }) bcdiv: ElementRef

    ngAfterViewInit() {
        let
            parentWidth = this.bcdiv.nativeElement.clientWidth,
            childWidth = this.bcol.nativeElement.clientWidth,
            liArray = this.bcol.nativeElement.children

        // collapse condition
        if (parentWidth === childWidth) {
            let i = 1;
            while (this.bcdiv.nativeElement.clientWidth === this.bcol.nativeElement.clientWidth && i < liArray.length - 1) {
                if ( i > 1 ) {
                    liArray[i].remove()
                    liArray[1].children[0].innerText = '…'
                } else {
                    liArray[i].children[0].innerText = '…'
                }
                i++
            }
        }
    }

    onClick(payload) {
        if (!this.emit) return;
        this.emit('click', payload);
    }
}
