/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule reactComponentExpect
 * @nolint
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ReactInstanceMap = require('./ReactInstanceMap');
var ReactTestUtils = require('./ReactTestUtils');

var assign = require('./Object.assign');
var invariant = require('fbjs/lib/invariant');

function reactComponentExpect(instance) {
  if (instance instanceof reactComponentExpectInternal) {
    return instance;
  }

  if (!(this instanceof reactComponentExpect)) {
    return new reactComponentExpect(instance);
  }

  expect(instance).not.toBeNull();
  expect(instance).not.toBeUndefined();

  !ReactTestUtils.isCompositeComponent(instance) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'reactComponentExpect(...): instance must be a composite component') : invariant(false) : undefined;
  var internalInstance = ReactInstanceMap.get(instance);

  expect(typeof internalInstance === 'undefined' ? 'undefined' : _typeof(internalInstance)).toBe('object');
  expect(_typeof(internalInstance.constructor)).toBe('function');
  expect(ReactTestUtils.isElement(internalInstance)).toBe(false);

  return new reactComponentExpectInternal(internalInstance);
}

function reactComponentExpectInternal(internalInstance) {
  this._instance = internalInstance;
}

assign(reactComponentExpectInternal.prototype, {
  // Getters -------------------------------------------------------------------

  /**
   * @instance: Retrieves the backing instance.
   */
  instance: function instance() {
    return this._instance.getPublicInstance();
  },

  /**
   * There are two types of components in the world.
   * - A component created via React.createClass() - Has a single child
   *   subComponent - the return value from the .render() function. This
   *   function @subComponent expects that this._instance is component created
   *   with React.createClass().
   * - A primitive DOM component - which has many renderedChildren, each of
   *   which may have a name that is unique with respect to its siblings. This
   *   method will fail if this._instance is a primitive component.
   *
   * TL;DR: An instance may have a subComponent (this._renderedComponent) or
   * renderedChildren, but never both. Neither will actually show up until you
   * render the component (simply instantiating is not enough).
   */
  expectRenderedChild: function expectRenderedChild() {
    this.toBeCompositeComponent();
    var child = this._instance._renderedComponent;
    // TODO: Hide ReactEmptyComponent instances here?
    return new reactComponentExpectInternal(child);
  },

  /**
   * The nth child of a DOMish component instance that is not falsy.
   */
  expectRenderedChildAt: function expectRenderedChildAt(childIndex) {
    // Currently only dom components have arrays of children, but that will
    // change soon.
    this.toBeDOMComponent();
    var renderedChildren = this._instance._renderedChildren || {};
    for (var name in renderedChildren) {
      if (!renderedChildren.hasOwnProperty(name)) {
        continue;
      }
      if (renderedChildren[name]) {
        if (renderedChildren[name]._mountIndex === childIndex) {
          return new reactComponentExpectInternal(renderedChildren[name]);
        }
      }
    }
    throw new Error('Child:' + childIndex + ' is not found');
  },

  toBeDOMComponentWithChildCount: function toBeDOMComponentWithChildCount(count) {
    this.toBeDOMComponent();
    var renderedChildren = this._instance._renderedChildren;
    expect(renderedChildren).toBeTruthy();
    expect(Object.keys(renderedChildren).length).toBe(count);
    return this;
  },

  toBeDOMComponentWithNoChildren: function toBeDOMComponentWithNoChildren() {
    this.toBeDOMComponent();
    expect(this._instance._renderedChildren).toBeFalsy();
    return this;
  },

  // Matchers ------------------------------------------------------------------

  toBeComponentOfType: function toBeComponentOfType(constructor) {
    expect(this._instance._currentElement.type === constructor).toBe(true);
    return this;
  },

  /**
   * A component that is created with React.createClass. Just duck typing
   * here.
   */
  toBeCompositeComponent: function toBeCompositeComponent() {
    expect(_typeof(this.instance()) === 'object' && typeof this.instance().render === 'function').toBe(true);
    return this;
  },

  toBeCompositeComponentWithType: function toBeCompositeComponentWithType(constructor) {
    this.toBeCompositeComponent();
    expect(this._instance._currentElement.type === constructor).toBe(true);
    return this;
  },

  toBeTextComponentWithValue: function toBeTextComponentWithValue(val) {
    var elementType = _typeof(this._instance._currentElement);
    expect(elementType === 'string' || elementType === 'number').toBe(true);
    expect(this._instance._stringText).toBe(val);
    return this;
  },

  toBeEmptyComponent: function toBeEmptyComponent() {
    var element = this._instance._currentElement;
    return element === null || element === false;
  },

  toBePresent: function toBePresent() {
    expect(this.instance()).toBeTruthy();
    return this;
  },

  /**
   * A terminal type of component representing some virtual dom node. Just duck
   * typing here.
   */
  toBeDOMComponent: function toBeDOMComponent() {
    expect(ReactTestUtils.isDOMComponent(this.instance())).toBe(true);
    return this;
  },

  /**
   * @deprecated
   * @see toBeComponentOfType
   */
  toBeDOMComponentWithTag: function toBeDOMComponentWithTag(tag) {
    this.toBeDOMComponent();
    expect(this.instance().tagName).toBe(tag.toUpperCase());
    return this;
  },

  /**
   * Check that internal state values are equal to a state of expected values.
   */
  scalarStateEqual: function scalarStateEqual(stateNameToExpectedValue) {
    expect(this.instance()).toBeTruthy();
    for (var stateName in stateNameToExpectedValue) {
      if (!stateNameToExpectedValue.hasOwnProperty(stateName)) {
        continue;
      }
      expect(this.instance().state[stateName]).toEqual(stateNameToExpectedValue[stateName]);
    }
    return this;
  },

  /**
   * Check a set of props are equal to a set of expected values - only works
   * with scalars.
   */
  scalarPropsEqual: function scalarPropsEqual(propNameToExpectedValue) {
    expect(this.instance()).toBeTruthy();
    for (var propName in propNameToExpectedValue) {
      if (!propNameToExpectedValue.hasOwnProperty(propName)) {
        continue;
      }
      expect(this.instance().props[propName]).toEqual(propNameToExpectedValue[propName]);
    }
    return this;
  },

  /**
   * Check a set of props are equal to a set of expected values - only works
   * with scalars.
   */
  scalarContextEqual: function scalarContextEqual(contextNameToExpectedValue) {
    expect(this.instance()).toBeTruthy();
    for (var contextName in contextNameToExpectedValue) {
      if (!contextNameToExpectedValue.hasOwnProperty(contextName)) {
        continue;
      }
      expect(this.instance().context[contextName]).toEqual(contextNameToExpectedValue[contextName]);
    }
    return this;
  }
});

module.exports = reactComponentExpect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3JlYWN0Q29tcG9uZW50RXhwZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOzs7O0FBRUEsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjtBQUNKLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBakI7O0FBRUosSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBVDtBQUNKLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQVo7O0FBRUosU0FBUyxvQkFBVCxDQUE4QixRQUE5QixFQUF3QztBQUN0QyxNQUFJLG9CQUFvQiw0QkFBcEIsRUFBa0Q7QUFDcEQsV0FBTyxRQUFQLENBRG9EO0dBQXREOztBQUlBLE1BQUksRUFBRSxnQkFBZ0Isb0JBQWhCLENBQUYsRUFBeUM7QUFDM0MsV0FBTyxJQUFJLG9CQUFKLENBQXlCLFFBQXpCLENBQVAsQ0FEMkM7R0FBN0M7O0FBSUEsU0FBTyxRQUFQLEVBQWlCLEdBQWpCLENBQXFCLFFBQXJCLEdBVHNDO0FBVXRDLFNBQU8sUUFBUCxFQUFpQixHQUFqQixDQUFxQixhQUFyQixHQVZzQzs7QUFZdEMsR0FBQyxlQUFlLG9CQUFmLENBQW9DLFFBQXBDLENBQUQsR0FBaUQsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsbUVBQWpCLENBQXhDLEdBQWdJLFVBQVUsS0FBVixDQUFoSSxHQUFtSixTQUFwTSxDQVpzQztBQWF0QyxNQUFJLG1CQUFtQixpQkFBaUIsR0FBakIsQ0FBcUIsUUFBckIsQ0FBbkIsQ0Fia0M7O0FBZXRDLGdCQUFjLDBFQUFkLEVBQWdDLElBQWhDLENBQXFDLFFBQXJDLEVBZnNDO0FBZ0J0QyxpQkFBYyxpQkFBaUIsV0FBakIsQ0FBZCxFQUE0QyxJQUE1QyxDQUFpRCxVQUFqRCxFQWhCc0M7QUFpQnRDLFNBQU8sZUFBZSxTQUFmLENBQXlCLGdCQUF6QixDQUFQLEVBQW1E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QVAsRUFBeUMsT0FBekMsQ0FBaUQseUJBQXlCLFNBQXpCLENBQWpELEVBSjhDO0tBQWhEO0FBTUEsV0FBTyxJQUFQLENBUm9EO0dBQXBDOzs7Ozs7QUFlbEIsb0JBQWtCLDBCQUFVLHVCQUFWLEVBQW1DO0FBQ25ELFdBQU8sS0FBSyxRQUFMLEVBQVAsRUFBd0IsVUFBeEIsR0FEbUQ7QUFFbkQsU0FBSyxJQUFJLFFBQUosSUFBZ0IsdUJBQXJCLEVBQThDO0FBQzVDLFVBQUksQ0FBQyx3QkFBd0IsY0FBeEIsQ0FBdUMsUUFBdkMsQ0FBRCxFQUFtRDtBQUNyRCxpQkFEcUQ7T0FBdkQ7QUFHQSxhQUFPLEtBQUssUUFBTCxHQUFnQixLQUFoQixDQUFzQixRQUF0QixDQUFQLEVBQXdDLE9BQXhDLENBQWdELHdCQUF3QixRQUF4QixDQUFoRCxFQUo0QztLQUE5QztBQU1BLFdBQU8sSUFBUCxDQVJtRDtHQUFuQzs7Ozs7O0FBZWxCLHNCQUFvQiw0QkFBVSwwQkFBVixFQUFzQztBQUN4RCxXQUFPLEtBQUssUUFBTCxFQUFQLEVBQXdCLFVBQXhCLEdBRHdEO0FBRXhELFNBQUssSUFBSSxXQUFKLElBQW1CLDBCQUF4QixFQUFvRDtBQUNsRCxVQUFJLENBQUMsMkJBQTJCLGNBQTNCLENBQTBDLFdBQTFDLENBQUQsRUFBeUQ7QUFDM0QsaUJBRDJEO09BQTdEO0FBR0EsYUFBTyxLQUFLLFFBQUwsR0FBZ0IsT0FBaEIsQ0FBd0IsV0FBeEIsQ0FBUCxFQUE2QyxPQUE3QyxDQUFxRCwyQkFBMkIsV0FBM0IsQ0FBckQsRUFKa0Q7S0FBcEQ7QUFNQSxXQUFPLElBQVAsQ0FSd0Q7R0FBdEM7Q0E3SnRCOztBQXlLQSxPQUFPLE9BQVAsR0FBaUIsb0JBQWpCIiwiZmlsZSI6InJlYWN0Q29tcG9uZW50RXhwZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIHJlYWN0Q29tcG9uZW50RXhwZWN0XG4gKiBAbm9saW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RJbnN0YW5jZU1hcCA9IHJlcXVpcmUoJy4vUmVhY3RJbnN0YW5jZU1hcCcpO1xudmFyIFJlYWN0VGVzdFV0aWxzID0gcmVxdWlyZSgnLi9SZWFjdFRlc3RVdGlscycpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbmZ1bmN0aW9uIHJlYWN0Q29tcG9uZW50RXhwZWN0KGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIHJlYWN0Q29tcG9uZW50RXhwZWN0SW50ZXJuYWwpIHtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgcmVhY3RDb21wb25lbnRFeHBlY3QpKSB7XG4gICAgcmV0dXJuIG5ldyByZWFjdENvbXBvbmVudEV4cGVjdChpbnN0YW5jZSk7XG4gIH1cblxuICBleHBlY3QoaW5zdGFuY2UpLm5vdC50b0JlTnVsbCgpO1xuICBleHBlY3QoaW5zdGFuY2UpLm5vdC50b0JlVW5kZWZpbmVkKCk7XG5cbiAgIVJlYWN0VGVzdFV0aWxzLmlzQ29tcG9zaXRlQ29tcG9uZW50KGluc3RhbmNlKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdyZWFjdENvbXBvbmVudEV4cGVjdCguLi4pOiBpbnN0YW5jZSBtdXN0IGJlIGEgY29tcG9zaXRlIGNvbXBvbmVudCcpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgdmFyIGludGVybmFsSW5zdGFuY2UgPSBSZWFjdEluc3RhbmNlTWFwLmdldChpbnN0YW5jZSk7XG5cbiAgZXhwZWN0KHR5cGVvZiBpbnRlcm5hbEluc3RhbmNlKS50b0JlKCdvYmplY3QnKTtcbiAgZXhwZWN0KHR5cGVvZiBpbnRlcm5hbEluc3RhbmNlLmNvbnN0cnVjdG9yKS50b0JlKCdmdW5jdGlvbicpO1xuICBleHBlY3QoUmVhY3RUZXN0VXRpbHMuaXNFbGVtZW50KGludGVybmFsSW5zdGFuY2UpKS50b0JlKGZhbHNlKTtcblxuICByZXR1cm4gbmV3IHJlYWN0Q29tcG9uZW50RXhwZWN0SW50ZXJuYWwoaW50ZXJuYWxJbnN0YW5jZSk7XG59XG5cbmZ1bmN0aW9uIHJlYWN0Q29tcG9uZW50RXhwZWN0SW50ZXJuYWwoaW50ZXJuYWxJbnN0YW5jZSkge1xuICB0aGlzLl9pbnN0YW5jZSA9IGludGVybmFsSW5zdGFuY2U7XG59XG5cbmFzc2lnbihyZWFjdENvbXBvbmVudEV4cGVjdEludGVybmFsLnByb3RvdHlwZSwge1xuICAvLyBHZXR0ZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQGluc3RhbmNlOiBSZXRyaWV2ZXMgdGhlIGJhY2tpbmcgaW5zdGFuY2UuXG4gICAqL1xuICBpbnN0YW5jZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZS5nZXRQdWJsaWNJbnN0YW5jZSgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGVyZSBhcmUgdHdvIHR5cGVzIG9mIGNvbXBvbmVudHMgaW4gdGhlIHdvcmxkLlxuICAgKiAtIEEgY29tcG9uZW50IGNyZWF0ZWQgdmlhIFJlYWN0LmNyZWF0ZUNsYXNzKCkgLSBIYXMgYSBzaW5nbGUgY2hpbGRcbiAgICogICBzdWJDb21wb25lbnQgLSB0aGUgcmV0dXJuIHZhbHVlIGZyb20gdGhlIC5yZW5kZXIoKSBmdW5jdGlvbi4gVGhpc1xuICAgKiAgIGZ1bmN0aW9uIEBzdWJDb21wb25lbnQgZXhwZWN0cyB0aGF0IHRoaXMuX2luc3RhbmNlIGlzIGNvbXBvbmVudCBjcmVhdGVkXG4gICAqICAgd2l0aCBSZWFjdC5jcmVhdGVDbGFzcygpLlxuICAgKiAtIEEgcHJpbWl0aXZlIERPTSBjb21wb25lbnQgLSB3aGljaCBoYXMgbWFueSByZW5kZXJlZENoaWxkcmVuLCBlYWNoIG9mXG4gICAqICAgd2hpY2ggbWF5IGhhdmUgYSBuYW1lIHRoYXQgaXMgdW5pcXVlIHdpdGggcmVzcGVjdCB0byBpdHMgc2libGluZ3MuIFRoaXNcbiAgICogICBtZXRob2Qgd2lsbCBmYWlsIGlmIHRoaXMuX2luc3RhbmNlIGlzIGEgcHJpbWl0aXZlIGNvbXBvbmVudC5cbiAgICpcbiAgICogVEw7RFI6IEFuIGluc3RhbmNlIG1heSBoYXZlIGEgc3ViQ29tcG9uZW50ICh0aGlzLl9yZW5kZXJlZENvbXBvbmVudCkgb3JcbiAgICogcmVuZGVyZWRDaGlsZHJlbiwgYnV0IG5ldmVyIGJvdGguIE5laXRoZXIgd2lsbCBhY3R1YWxseSBzaG93IHVwIHVudGlsIHlvdVxuICAgKiByZW5kZXIgdGhlIGNvbXBvbmVudCAoc2ltcGx5IGluc3RhbnRpYXRpbmcgaXMgbm90IGVub3VnaCkuXG4gICAqL1xuICBleHBlY3RSZW5kZXJlZENoaWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50b0JlQ29tcG9zaXRlQ29tcG9uZW50KCk7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5faW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50O1xuICAgIC8vIFRPRE86IEhpZGUgUmVhY3RFbXB0eUNvbXBvbmVudCBpbnN0YW5jZXMgaGVyZT9cbiAgICByZXR1cm4gbmV3IHJlYWN0Q29tcG9uZW50RXhwZWN0SW50ZXJuYWwoY2hpbGQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgbnRoIGNoaWxkIG9mIGEgRE9NaXNoIGNvbXBvbmVudCBpbnN0YW5jZSB0aGF0IGlzIG5vdCBmYWxzeS5cbiAgICovXG4gIGV4cGVjdFJlbmRlcmVkQ2hpbGRBdDogZnVuY3Rpb24gKGNoaWxkSW5kZXgpIHtcbiAgICAvLyBDdXJyZW50bHkgb25seSBkb20gY29tcG9uZW50cyBoYXZlIGFycmF5cyBvZiBjaGlsZHJlbiwgYnV0IHRoYXQgd2lsbFxuICAgIC8vIGNoYW5nZSBzb29uLlxuICAgIHRoaXMudG9CZURPTUNvbXBvbmVudCgpO1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5faW5zdGFuY2UuX3JlbmRlcmVkQ2hpbGRyZW4gfHwge307XG4gICAgZm9yICh2YXIgbmFtZSBpbiByZW5kZXJlZENoaWxkcmVuKSB7XG4gICAgICBpZiAoIXJlbmRlcmVkQ2hpbGRyZW4uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAocmVuZGVyZWRDaGlsZHJlbltuYW1lXSkge1xuICAgICAgICBpZiAocmVuZGVyZWRDaGlsZHJlbltuYW1lXS5fbW91bnRJbmRleCA9PT0gY2hpbGRJbmRleCkge1xuICAgICAgICAgIHJldHVybiBuZXcgcmVhY3RDb21wb25lbnRFeHBlY3RJbnRlcm5hbChyZW5kZXJlZENoaWxkcmVuW25hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NoaWxkOicgKyBjaGlsZEluZGV4ICsgJyBpcyBub3QgZm91bmQnKTtcbiAgfSxcblxuICB0b0JlRE9NQ29tcG9uZW50V2l0aENoaWxkQ291bnQ6IGZ1bmN0aW9uIChjb3VudCkge1xuICAgIHRoaXMudG9CZURPTUNvbXBvbmVudCgpO1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5faW5zdGFuY2UuX3JlbmRlcmVkQ2hpbGRyZW47XG4gICAgZXhwZWN0KHJlbmRlcmVkQ2hpbGRyZW4pLnRvQmVUcnV0aHkoKTtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMocmVuZGVyZWRDaGlsZHJlbikubGVuZ3RoKS50b0JlKGNvdW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0b0JlRE9NQ29tcG9uZW50V2l0aE5vQ2hpbGRyZW46IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRvQmVET01Db21wb25lbnQoKTtcbiAgICBleHBlY3QodGhpcy5faW5zdGFuY2UuX3JlbmRlcmVkQ2hpbGRyZW4pLnRvQmVGYWxzeSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8vIE1hdGNoZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHRvQmVDb21wb25lbnRPZlR5cGU6IGZ1bmN0aW9uIChjb25zdHJ1Y3Rvcikge1xuICAgIGV4cGVjdCh0aGlzLl9pbnN0YW5jZS5fY3VycmVudEVsZW1lbnQudHlwZSA9PT0gY29uc3RydWN0b3IpLnRvQmUodHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEEgY29tcG9uZW50IHRoYXQgaXMgY3JlYXRlZCB3aXRoIFJlYWN0LmNyZWF0ZUNsYXNzLiBKdXN0IGR1Y2sgdHlwaW5nXG4gICAqIGhlcmUuXG4gICAqL1xuICB0b0JlQ29tcG9zaXRlQ29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgZXhwZWN0KHR5cGVvZiB0aGlzLmluc3RhbmNlKCkgPT09ICdvYmplY3QnICYmIHR5cGVvZiB0aGlzLmluc3RhbmNlKCkucmVuZGVyID09PSAnZnVuY3Rpb24nKS50b0JlKHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHRvQmVDb21wb3NpdGVDb21wb25lbnRXaXRoVHlwZTogZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XG4gICAgdGhpcy50b0JlQ29tcG9zaXRlQ29tcG9uZW50KCk7XG4gICAgZXhwZWN0KHRoaXMuX2luc3RhbmNlLl9jdXJyZW50RWxlbWVudC50eXBlID09PSBjb25zdHJ1Y3RvcikudG9CZSh0cnVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0b0JlVGV4dENvbXBvbmVudFdpdGhWYWx1ZTogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhciBlbGVtZW50VHlwZSA9IHR5cGVvZiB0aGlzLl9pbnN0YW5jZS5fY3VycmVudEVsZW1lbnQ7XG4gICAgZXhwZWN0KGVsZW1lbnRUeXBlID09PSAnc3RyaW5nJyB8fCBlbGVtZW50VHlwZSA9PT0gJ251bWJlcicpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHRoaXMuX2luc3RhbmNlLl9zdHJpbmdUZXh0KS50b0JlKHZhbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdG9CZUVtcHR5Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9pbnN0YW5jZS5fY3VycmVudEVsZW1lbnQ7XG4gICAgcmV0dXJuIGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gZmFsc2U7XG4gIH0sXG5cbiAgdG9CZVByZXNlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QodGhpcy5pbnN0YW5jZSgpKS50b0JlVHJ1dGh5KCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEEgdGVybWluYWwgdHlwZSBvZiBjb21wb25lbnQgcmVwcmVzZW50aW5nIHNvbWUgdmlydHVhbCBkb20gbm9kZS4gSnVzdCBkdWNrXG4gICAqIHR5cGluZyBoZXJlLlxuICAgKi9cbiAgdG9CZURPTUNvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgIGV4cGVjdChSZWFjdFRlc3RVdGlscy5pc0RPTUNvbXBvbmVudCh0aGlzLmluc3RhbmNlKCkpKS50b0JlKHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAc2VlIHRvQmVDb21wb25lbnRPZlR5cGVcbiAgICovXG4gIHRvQmVET01Db21wb25lbnRXaXRoVGFnOiBmdW5jdGlvbiAodGFnKSB7XG4gICAgdGhpcy50b0JlRE9NQ29tcG9uZW50KCk7XG4gICAgZXhwZWN0KHRoaXMuaW5zdGFuY2UoKS50YWdOYW1lKS50b0JlKHRhZy50b1VwcGVyQ2FzZSgpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgdGhhdCBpbnRlcm5hbCBzdGF0ZSB2YWx1ZXMgYXJlIGVxdWFsIHRvIGEgc3RhdGUgb2YgZXhwZWN0ZWQgdmFsdWVzLlxuICAgKi9cbiAgc2NhbGFyU3RhdGVFcXVhbDogZnVuY3Rpb24gKHN0YXRlTmFtZVRvRXhwZWN0ZWRWYWx1ZSkge1xuICAgIGV4cGVjdCh0aGlzLmluc3RhbmNlKCkpLnRvQmVUcnV0aHkoKTtcbiAgICBmb3IgKHZhciBzdGF0ZU5hbWUgaW4gc3RhdGVOYW1lVG9FeHBlY3RlZFZhbHVlKSB7XG4gICAgICBpZiAoIXN0YXRlTmFtZVRvRXhwZWN0ZWRWYWx1ZS5oYXNPd25Qcm9wZXJ0eShzdGF0ZU5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZXhwZWN0KHRoaXMuaW5zdGFuY2UoKS5zdGF0ZVtzdGF0ZU5hbWVdKS50b0VxdWFsKHN0YXRlTmFtZVRvRXhwZWN0ZWRWYWx1ZVtzdGF0ZU5hbWVdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGEgc2V0IG9mIHByb3BzIGFyZSBlcXVhbCB0byBhIHNldCBvZiBleHBlY3RlZCB2YWx1ZXMgLSBvbmx5IHdvcmtzXG4gICAqIHdpdGggc2NhbGFycy5cbiAgICovXG4gIHNjYWxhclByb3BzRXF1YWw6IGZ1bmN0aW9uIChwcm9wTmFtZVRvRXhwZWN0ZWRWYWx1ZSkge1xuICAgIGV4cGVjdCh0aGlzLmluc3RhbmNlKCkpLnRvQmVUcnV0aHkoKTtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wTmFtZVRvRXhwZWN0ZWRWYWx1ZSkge1xuICAgICAgaWYgKCFwcm9wTmFtZVRvRXhwZWN0ZWRWYWx1ZS5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBleHBlY3QodGhpcy5pbnN0YW5jZSgpLnByb3BzW3Byb3BOYW1lXSkudG9FcXVhbChwcm9wTmFtZVRvRXhwZWN0ZWRWYWx1ZVtwcm9wTmFtZV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgYSBzZXQgb2YgcHJvcHMgYXJlIGVxdWFsIHRvIGEgc2V0IG9mIGV4cGVjdGVkIHZhbHVlcyAtIG9ubHkgd29ya3NcbiAgICogd2l0aCBzY2FsYXJzLlxuICAgKi9cbiAgc2NhbGFyQ29udGV4dEVxdWFsOiBmdW5jdGlvbiAoY29udGV4dE5hbWVUb0V4cGVjdGVkVmFsdWUpIHtcbiAgICBleHBlY3QodGhpcy5pbnN0YW5jZSgpKS50b0JlVHJ1dGh5KCk7XG4gICAgZm9yICh2YXIgY29udGV4dE5hbWUgaW4gY29udGV4dE5hbWVUb0V4cGVjdGVkVmFsdWUpIHtcbiAgICAgIGlmICghY29udGV4dE5hbWVUb0V4cGVjdGVkVmFsdWUuaGFzT3duUHJvcGVydHkoY29udGV4dE5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZXhwZWN0KHRoaXMuaW5zdGFuY2UoKS5jb250ZXh0W2NvbnRleHROYW1lXSkudG9FcXVhbChjb250ZXh0TmFtZVRvRXhwZWN0ZWRWYWx1ZVtjb250ZXh0TmFtZV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVhY3RDb21wb25lbnRFeHBlY3Q7Il19