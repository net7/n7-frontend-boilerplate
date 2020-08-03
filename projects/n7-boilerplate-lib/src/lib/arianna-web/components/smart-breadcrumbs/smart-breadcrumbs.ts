//---------------------------
// BREADCRUMBS.ts
//---------------------------

import {
  Component, Input, ViewChild, ElementRef, AfterViewInit,
} from '@angular/core';
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
export interface SmartBreadcrumbsItem {
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
export interface SmartBreadcrumbsData {
  /**
   * each item renders a breadcrumb level
   */
  items: SmartBreadcrumbsItem[];
  /**
   * additional html classes
   */
  classes?: any;
}

@Component({
  selector: 'n7-smart-breadcrumbs',
  templateUrl: './smart-breadcrumbs.html',
})

export class SmartBreadcrumbsComponent implements AfterViewInit {
  @Input() data: SmartBreadcrumbsData;

  @Input() emit: any;

  @ViewChild('bcol', { read: ElementRef }) bcol: ElementRef

  @ViewChild('bcdiv', { read: ElementRef }) bcdiv: ElementRef

  ngAfterViewInit() {
    if (this.bcdiv && this.bcol) {
      let { parentWidth, childWidth } = this.getWidths(this.bcdiv, this.bcol);
      const liArray = this.bcol.nativeElement.children;
      if (parentWidth === childWidth) { // collapse condition
        let i = 1; // Skip element in position 0
        while (parentWidth === childWidth && i < liArray.length - 1) { // Skip last element
          const tippyData = document.createElement('ol'); // initialize tippy data
          tippyData.className = 'n7-smart-breadcrumbs__tippy-content';
          tippyData.appendChild(liArray[i].cloneNode(true)); // add <li> to tippy data (<ol>)
          liArray[i].children[0].innerText = '…'; // convert to ellipsis
          liArray[i].className = 'n7-breadcrumbs__item-ellipsis'; // set class to list item
          this.tippyBuilder(liArray[i].children[0], tippyData); // append tooltip to ellipsis
          i += 1;
          // update widths
          ({ parentWidth, childWidth } = this.getWidths(this.bcdiv, this.bcol));
        }
      }
    }
  }

  onClick(payload) {
    if (!this.emit) return;
    this.emit('click', payload);
  }

  /**
   * Builds tippy data for a node.
   */
  tippyBuilder = (node, content) => tippy(node, {
    content,
    interactive: true,
    arrow: true,
    theme: 'light-border no-padding',
    appendTo: document.body, // silence tippy interactive warning
  });

  getWidths = (parent: ElementRef, child: ElementRef) => {
    const pw = parent.nativeElement.clientWidth;
    const cw = child.nativeElement.clientWidth;
    const pp = this.getSidePadding(parent.nativeElement);
    return { parentWidth: pw - pp, childWidth: cw };
  }

  getSidePadding = (node) => (
    // returns an integer representing the sum of left and right paddings
    (+window.getComputedStyle(node, null).getPropertyValue('padding-left').match(/\d+/)[0])
    + (+window.getComputedStyle(node, null).getPropertyValue('padding-right').match(/\d+/)[0])
  )
}
