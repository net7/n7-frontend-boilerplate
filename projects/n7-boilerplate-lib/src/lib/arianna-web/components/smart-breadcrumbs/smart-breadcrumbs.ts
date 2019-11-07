//---------------------------
// BREADCRUMBS.ts
//---------------------------

import { Component, Input, ViewChild, ElementRef, AfterViewInit, ɵɵresolveBody } from '@angular/core';
import tippy from 'tippy.js';

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
            let tippyData = document.createElement('ol')
            let i = 1
            tippyData.className = 'n7-smart-breadcrumbs__tippy-content'
            while (parentWidth === childWidth && i < liArray.length - 1) {
                if (i > 1) {
                    tippyData.appendChild(liArray[i])
                } else {
                    tippyData.appendChild(liArray[i])
                    liArray[i].children[0].innerText = '…'
                }
                this.tippyBuilder(liArray[i], tippyData)
                i++
                // update widths
                parentWidth = this.bcdiv.nativeElement.clientWidth
                childWidth = this.bcol.nativeElement.clientWidth
            }
        }
    }

    onClick(payload) {
        if (!this.emit) return;
        this.emit('click', payload);
    }

    tippyBuilder = (node, content) => {
        /*
            Builds tippy data for a node.
        */
        document.body.appendChild(content)
        tippy(node, {
            content,
            // allowHTML: true,
            // trigger: 'manual',
            interactive: true,
            arrow: true,
            theme: 'light-border no-padding',
            // placement: 'bottom',
            // maxWidth: 500,
        })
    }

}
