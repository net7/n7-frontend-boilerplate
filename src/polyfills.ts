/* eslint-disable */

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */

// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

/*
* in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
* with the following flag, it will bypass `zone.js` patch for IE/Edge
*/
// (window as any).__Zone_enable_cross_context_check = true;

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.

/***************************************************************************************************
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
import 'core-js/es7/array';  // Run `npm install --save classlist.js`.

/** IE10 and IE11 requires the following for the Reflect API. */
import 'core-js/es6/reflect';

// node.remove() polyfill for IE 9-11
// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                if (this.parentNode === null) {
                    return;
                }
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// SVGElement.contains() polyfill
// from: https://stackoverflow.com/questions/57606743/ie11-object-doesnt-support-property-or-method-contains
SVGElement.prototype.contains = function contains(node) {
    if (!(0 in arguments)) { throw new TypeError('1 argument is required'); }
    do { if (this === node) return true; } while (node = node && node.parentNode);
    return false;
};
