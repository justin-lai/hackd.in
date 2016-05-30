/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactNativeComponent
 */

'use strict';

var assign = require('./Object.assign');
var invariant = require('fbjs/lib/invariant');

var autoGenerateWrapperClass = null;
var genericComponentClass = null;
// This registry keeps track of wrapper classes around native tags.
var tagToComponentClass = {};
var textComponentClass = null;

var ReactNativeComponentInjection = {
  // This accepts a class that receives the tag string. This is a catch all
  // that can render any kind of tag.
  injectGenericComponentClass: function injectGenericComponentClass(componentClass) {
    genericComponentClass = componentClass;
  },
  // This accepts a text component class that takes the text string to be
  // rendered as props.
  injectTextComponentClass: function injectTextComponentClass(componentClass) {
    textComponentClass = componentClass;
  },
  // This accepts a keyed object with classes as values. Each key represents a
  // tag. That particular tag will use this class instead of the generic one.
  injectComponentClasses: function injectComponentClasses(componentClasses) {
    assign(tagToComponentClass, componentClasses);
  }
};

/**
 * Get a composite component wrapper class for a specific tag.
 *
 * @param {ReactElement} element The tag for which to get the class.
 * @return {function} The React class constructor function.
 */
function getComponentClassForElement(element) {
  if (typeof element.type === 'function') {
    return element.type;
  }
  var tag = element.type;
  var componentClass = tagToComponentClass[tag];
  if (componentClass == null) {
    tagToComponentClass[tag] = componentClass = autoGenerateWrapperClass(tag);
  }
  return componentClass;
}

/**
 * Get a native internal component class for a specific tag.
 *
 * @param {ReactElement} element The element to create.
 * @return {function} The internal class constructor function.
 */
function createInternalComponent(element) {
  !genericComponentClass ? process.env.NODE_ENV !== 'production' ? invariant(false, 'There is no registered component for the tag %s', element.type) : invariant(false) : undefined;
  return new genericComponentClass(element.type, element.props);
}

/**
 * @param {ReactText} text
 * @return {ReactComponent}
 */
function createInstanceForText(text) {
  return new textComponentClass(text);
}

/**
 * @param {ReactComponent} component
 * @return {boolean}
 */
function isTextComponent(component) {
  return component instanceof textComponentClass;
}

var ReactNativeComponent = {
  getComponentClassForElement: getComponentClassForElement,
  createInternalComponent: createInternalComponent,
  createInstanceForText: createInstanceForText,
  isTextComponent: isTextComponent,
  injection: ReactNativeComponentInjection
};

module.exports = ReactNativeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0TmF0aXZlQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBYjtBQUNBLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQWhCOztBQUVBLElBQUksMkJBQTJCLElBQS9CO0FBQ0EsSUFBSSx3QkFBd0IsSUFBNUI7O0FBRUEsSUFBSSxzQkFBc0IsRUFBMUI7QUFDQSxJQUFJLHFCQUFxQixJQUF6Qjs7QUFFQSxJQUFJLGdDQUFnQzs7O0FBR2xDLCtCQUE2QixxQ0FBVSxjQUFWLEVBQTBCO0FBQ3JELDRCQUF3QixjQUF4QjtBQUNELEdBTGlDOzs7QUFRbEMsNEJBQTBCLGtDQUFVLGNBQVYsRUFBMEI7QUFDbEQseUJBQXFCLGNBQXJCO0FBQ0QsR0FWaUM7OztBQWFsQywwQkFBd0IsZ0NBQVUsZ0JBQVYsRUFBNEI7QUFDbEQsV0FBTyxtQkFBUCxFQUE0QixnQkFBNUI7QUFDRDtBQWZpQyxDQUFwQzs7Ozs7Ozs7QUF3QkEsU0FBUywyQkFBVCxDQUFxQyxPQUFyQyxFQUE4QztBQUM1QyxNQUFJLE9BQU8sUUFBUSxJQUFmLEtBQXdCLFVBQTVCLEVBQXdDO0FBQ3RDLFdBQU8sUUFBUSxJQUFmO0FBQ0Q7QUFDRCxNQUFJLE1BQU0sUUFBUSxJQUFsQjtBQUNBLE1BQUksaUJBQWlCLG9CQUFvQixHQUFwQixDQUFyQjtBQUNBLE1BQUksa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCLHdCQUFvQixHQUFwQixJQUEyQixpQkFBaUIseUJBQXlCLEdBQXpCLENBQTVDO0FBQ0Q7QUFDRCxTQUFPLGNBQVA7QUFDRDs7Ozs7Ozs7QUFRRCxTQUFTLHVCQUFULENBQWlDLE9BQWpDLEVBQTBDO0FBQ3hDLEdBQUMscUJBQUQsR0FBeUIsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsaURBQWpCLEVBQW9FLFFBQVEsSUFBNUUsQ0FBeEMsR0FBNEgsVUFBVSxLQUFWLENBQXJKLEdBQXdLLFNBQXhLO0FBQ0EsU0FBTyxJQUFJLHFCQUFKLENBQTBCLFFBQVEsSUFBbEMsRUFBd0MsUUFBUSxLQUFoRCxDQUFQO0FBQ0Q7Ozs7OztBQU1ELFNBQVMscUJBQVQsQ0FBK0IsSUFBL0IsRUFBcUM7QUFDbkMsU0FBTyxJQUFJLGtCQUFKLENBQXVCLElBQXZCLENBQVA7QUFDRDs7Ozs7O0FBTUQsU0FBUyxlQUFULENBQXlCLFNBQXpCLEVBQW9DO0FBQ2xDLFNBQU8scUJBQXFCLGtCQUE1QjtBQUNEOztBQUVELElBQUksdUJBQXVCO0FBQ3pCLCtCQUE2QiwyQkFESjtBQUV6QiwyQkFBeUIsdUJBRkE7QUFHekIseUJBQXVCLHFCQUhFO0FBSXpCLG1CQUFpQixlQUpRO0FBS3pCLGFBQVc7QUFMYyxDQUEzQjs7QUFRQSxPQUFPLE9BQVAsR0FBaUIsb0JBQWpCIiwiZmlsZSI6IlJlYWN0TmF0aXZlQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0TmF0aXZlQ29tcG9uZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbnZhciBhdXRvR2VuZXJhdGVXcmFwcGVyQ2xhc3MgPSBudWxsO1xudmFyIGdlbmVyaWNDb21wb25lbnRDbGFzcyA9IG51bGw7XG4vLyBUaGlzIHJlZ2lzdHJ5IGtlZXBzIHRyYWNrIG9mIHdyYXBwZXIgY2xhc3NlcyBhcm91bmQgbmF0aXZlIHRhZ3MuXG52YXIgdGFnVG9Db21wb25lbnRDbGFzcyA9IHt9O1xudmFyIHRleHRDb21wb25lbnRDbGFzcyA9IG51bGw7XG5cbnZhciBSZWFjdE5hdGl2ZUNvbXBvbmVudEluamVjdGlvbiA9IHtcbiAgLy8gVGhpcyBhY2NlcHRzIGEgY2xhc3MgdGhhdCByZWNlaXZlcyB0aGUgdGFnIHN0cmluZy4gVGhpcyBpcyBhIGNhdGNoIGFsbFxuICAvLyB0aGF0IGNhbiByZW5kZXIgYW55IGtpbmQgb2YgdGFnLlxuICBpbmplY3RHZW5lcmljQ29tcG9uZW50Q2xhc3M6IGZ1bmN0aW9uIChjb21wb25lbnRDbGFzcykge1xuICAgIGdlbmVyaWNDb21wb25lbnRDbGFzcyA9IGNvbXBvbmVudENsYXNzO1xuICB9LFxuICAvLyBUaGlzIGFjY2VwdHMgYSB0ZXh0IGNvbXBvbmVudCBjbGFzcyB0aGF0IHRha2VzIHRoZSB0ZXh0IHN0cmluZyB0byBiZVxuICAvLyByZW5kZXJlZCBhcyBwcm9wcy5cbiAgaW5qZWN0VGV4dENvbXBvbmVudENsYXNzOiBmdW5jdGlvbiAoY29tcG9uZW50Q2xhc3MpIHtcbiAgICB0ZXh0Q29tcG9uZW50Q2xhc3MgPSBjb21wb25lbnRDbGFzcztcbiAgfSxcbiAgLy8gVGhpcyBhY2NlcHRzIGEga2V5ZWQgb2JqZWN0IHdpdGggY2xhc3NlcyBhcyB2YWx1ZXMuIEVhY2gga2V5IHJlcHJlc2VudHMgYVxuICAvLyB0YWcuIFRoYXQgcGFydGljdWxhciB0YWcgd2lsbCB1c2UgdGhpcyBjbGFzcyBpbnN0ZWFkIG9mIHRoZSBnZW5lcmljIG9uZS5cbiAgaW5qZWN0Q29tcG9uZW50Q2xhc3NlczogZnVuY3Rpb24gKGNvbXBvbmVudENsYXNzZXMpIHtcbiAgICBhc3NpZ24odGFnVG9Db21wb25lbnRDbGFzcywgY29tcG9uZW50Q2xhc3Nlcyk7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IGEgY29tcG9zaXRlIGNvbXBvbmVudCB3cmFwcGVyIGNsYXNzIGZvciBhIHNwZWNpZmljIHRhZy5cbiAqXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBUaGUgdGFnIGZvciB3aGljaCB0byBnZXQgdGhlIGNsYXNzLlxuICogQHJldHVybiB7ZnVuY3Rpb259IFRoZSBSZWFjdCBjbGFzcyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcG9uZW50Q2xhc3NGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50LnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZWxlbWVudC50eXBlO1xuICB9XG4gIHZhciB0YWcgPSBlbGVtZW50LnR5cGU7XG4gIHZhciBjb21wb25lbnRDbGFzcyA9IHRhZ1RvQ29tcG9uZW50Q2xhc3NbdGFnXTtcbiAgaWYgKGNvbXBvbmVudENsYXNzID09IG51bGwpIHtcbiAgICB0YWdUb0NvbXBvbmVudENsYXNzW3RhZ10gPSBjb21wb25lbnRDbGFzcyA9IGF1dG9HZW5lcmF0ZVdyYXBwZXJDbGFzcyh0YWcpO1xuICB9XG4gIHJldHVybiBjb21wb25lbnRDbGFzcztcbn1cblxuLyoqXG4gKiBHZXQgYSBuYXRpdmUgaW50ZXJuYWwgY29tcG9uZW50IGNsYXNzIGZvciBhIHNwZWNpZmljIHRhZy5cbiAqXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBjcmVhdGUuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGludGVybmFsIGNsYXNzIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnRlcm5hbENvbXBvbmVudChlbGVtZW50KSB7XG4gICFnZW5lcmljQ29tcG9uZW50Q2xhc3MgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVGhlcmUgaXMgbm8gcmVnaXN0ZXJlZCBjb21wb25lbnQgZm9yIHRoZSB0YWcgJXMnLCBlbGVtZW50LnR5cGUpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIG5ldyBnZW5lcmljQ29tcG9uZW50Q2xhc3MoZWxlbWVudC50eXBlLCBlbGVtZW50LnByb3BzKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1JlYWN0VGV4dH0gdGV4dFxuICogQHJldHVybiB7UmVhY3RDb21wb25lbnR9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlRm9yVGV4dCh0ZXh0KSB7XG4gIHJldHVybiBuZXcgdGV4dENvbXBvbmVudENsYXNzKHRleHQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNvbXBvbmVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNUZXh0Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICByZXR1cm4gY29tcG9uZW50IGluc3RhbmNlb2YgdGV4dENvbXBvbmVudENsYXNzO1xufVxuXG52YXIgUmVhY3ROYXRpdmVDb21wb25lbnQgPSB7XG4gIGdldENvbXBvbmVudENsYXNzRm9yRWxlbWVudDogZ2V0Q29tcG9uZW50Q2xhc3NGb3JFbGVtZW50LFxuICBjcmVhdGVJbnRlcm5hbENvbXBvbmVudDogY3JlYXRlSW50ZXJuYWxDb21wb25lbnQsXG4gIGNyZWF0ZUluc3RhbmNlRm9yVGV4dDogY3JlYXRlSW5zdGFuY2VGb3JUZXh0LFxuICBpc1RleHRDb21wb25lbnQ6IGlzVGV4dENvbXBvbmVudCxcbiAgaW5qZWN0aW9uOiBSZWFjdE5hdGl2ZUNvbXBvbmVudEluamVjdGlvblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdE5hdGl2ZUNvbXBvbmVudDsiXX0=