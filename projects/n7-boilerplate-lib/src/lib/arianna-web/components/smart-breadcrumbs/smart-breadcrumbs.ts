//---------------------------
// BREADCRUMBS.ts
//---------------------------

import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
    if (this.bcdiv && this.bcol) {
      var parentWidth = this.bcdiv.nativeElement.clientWidth - this.getSidePadding(this.bcdiv.nativeElement)
      var childWidth = this.bcol.nativeElement.clientWidth
      var liArray = this.bcol.nativeElement.children
      console.log({ parentWidth, childWidth })
      if (parentWidth === childWidth) {                                       // collapse condition
        let i = 1                                                           // Skip element in position 0
        while (parentWidth === childWidth && i < liArray.length - 1) {      // Skip last element
          let tippyData = document.createElement('ol')                    // initialize tippy data
          tippyData.className = 'n7-smart-breadcrumbs__tippy-content'
          tippyData.appendChild(liArray[i].cloneNode(true))               // add <li> to tippy data (<ol>)
          liArray[i].children[0].innerText = '…'                          // convert to ellipsis
          liArray[i].className = 'n7-breadcrumbs__item-ellipsis'          // set class to list item
          this.tippyBuilder(liArray[i], tippyData)                        // append tooltip to ellipsis
          // this.data.items[i].classes = 'n7-breadcrumbs__label-ellipsis'   // set class to ellipsis anchor
          i++
          // update widths
          parentWidth = this.bcdiv.nativeElement.clientWidth - this.getSidePadding(this.bcdiv.nativeElement)
          childWidth = this.bcol.nativeElement.clientWidth
        }
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
    tippy(node, {
      content,
      interactive: true,
      arrow: true,
      theme: 'light-border no-padding',
      appendTo: document.body // silence tippy interactive warning
    })
  }

  getSidePadding = node => { // returns an integer representing the sum of left and right paddings
    return (
      (+window.getComputedStyle(node, null).getPropertyValue('padding-left').match(/\d+/)[0])
      + (+window.getComputedStyle(node, null).getPropertyValue('padding-right').match(/\d+/)[0])
    )
  }

}
