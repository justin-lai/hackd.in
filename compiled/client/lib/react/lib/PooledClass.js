/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PooledClass
 */

'use strict';

var invariant = require('fbjs/lib/invariant');

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function oneArgumentPooler(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function twoArgumentPooler(a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function threeArgumentPooler(a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler = function fourArgumentPooler(a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var fiveArgumentPooler = function fiveArgumentPooler(a1, a2, a3, a4, a5) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4, a5);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4, a5);
  }
};

var standardReleaser = function standardReleaser(instance) {
  var Klass = this;
  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : invariant(false) : undefined;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances (optional).
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};

module.exports = PooledClass;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1Bvb2xlZENsYXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBWjs7Ozs7Ozs7O0FBU0osSUFBSSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQVUsY0FBVixFQUEwQjtBQUNoRCxNQUFJLFFBQVEsSUFBUixDQUQ0QztBQUVoRCxNQUFJLE1BQU0sWUFBTixDQUFtQixNQUFuQixFQUEyQjtBQUM3QixRQUFJLFdBQVcsTUFBTSxZQUFOLENBQW1CLEdBQW5CLEVBQVgsQ0FEeUI7QUFFN0IsVUFBTSxJQUFOLENBQVcsUUFBWCxFQUFxQixjQUFyQixFQUY2QjtBQUc3QixXQUFPLFFBQVAsQ0FINkI7R0FBL0IsTUFJTztBQUNMLFdBQU8sSUFBSSxLQUFKLENBQVUsY0FBVixDQUFQLENBREs7R0FKUDtDQUZzQjs7QUFXeEIsSUFBSSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0I7QUFDeEMsTUFBSSxRQUFRLElBQVIsQ0FEb0M7QUFFeEMsTUFBSSxNQUFNLFlBQU4sQ0FBbUIsTUFBbkIsRUFBMkI7QUFDN0IsUUFBSSxXQUFXLE1BQU0sWUFBTixDQUFtQixHQUFuQixFQUFYLENBRHlCO0FBRTdCLFVBQU0sSUFBTixDQUFXLFFBQVgsRUFBcUIsRUFBckIsRUFBeUIsRUFBekIsRUFGNkI7QUFHN0IsV0FBTyxRQUFQLENBSDZCO0dBQS9CLE1BSU87QUFDTCxXQUFPLElBQUksS0FBSixDQUFVLEVBQVYsRUFBYyxFQUFkLENBQVAsQ0FESztHQUpQO0NBRnNCOztBQVd4QixJQUFJLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQjtBQUM5QyxNQUFJLFFBQVEsSUFBUixDQUQwQztBQUU5QyxNQUFJLE1BQU0sWUFBTixDQUFtQixNQUFuQixFQUEy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QjtBQUNBLHFCQUFtQixpQkFBbkI7QUFDQSx1QkFBcUIsbUJBQXJCO0FBQ0Esc0JBQW9CLGtCQUFwQjtBQUNBLHNCQUFvQixrQkFBcEI7Q0FORTs7QUFTSixPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiUG9vbGVkQ2xhc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUG9vbGVkQ2xhc3NcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcblxuLyoqXG4gKiBTdGF0aWMgcG9vbGVycy4gU2V2ZXJhbCBjdXN0b20gdmVyc2lvbnMgZm9yIGVhY2ggcG90ZW50aWFsIG51bWJlciBvZlxuICogYXJndW1lbnRzLiBBIGNvbXBsZXRlbHkgZ2VuZXJpYyBwb29sZXIgaXMgZWFzeSB0byBpbXBsZW1lbnQsIGJ1dCB3b3VsZFxuICogcmVxdWlyZSBhY2Nlc3NpbmcgdGhlIGBhcmd1bWVudHNgIG9iamVjdC4gSW4gZWFjaCBvZiB0aGVzZSwgYHRoaXNgIHJlZmVycyB0b1xuICogdGhlIENsYXNzIGl0c2VsZiwgbm90IGFuIGluc3RhbmNlLiBJZiBhbnkgb3RoZXJzIGFyZSBuZWVkZWQsIHNpbXBseSBhZGQgdGhlbVxuICogaGVyZSwgb3IgaW4gdGhlaXIgb3duIGZpbGVzLlxuICovXG52YXIgb25lQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoY29weUZpZWxkc0Zyb20pIHtcbiAgdmFyIEtsYXNzID0gdGhpcztcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBLbGFzcy5pbnN0YW5jZVBvb2wucG9wKCk7XG4gICAgS2xhc3MuY2FsbChpbnN0YW5jZSwgY29weUZpZWxkc0Zyb20pO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEtsYXNzKGNvcHlGaWVsZHNGcm9tKTtcbiAgfVxufTtcblxudmFyIHR3b0FyZ3VtZW50UG9vbGVyID0gZnVuY3Rpb24gKGExLCBhMikge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEtsYXNzKGExLCBhMik7XG4gIH1cbn07XG5cbnZhciB0aHJlZUFyZ3VtZW50UG9vbGVyID0gZnVuY3Rpb24gKGExLCBhMiwgYTMpIHtcbiAgdmFyIEtsYXNzID0gdGhpcztcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBLbGFzcy5pbnN0YW5jZVBvb2wucG9wKCk7XG4gICAgS2xhc3MuY2FsbChpbnN0YW5jZSwgYTEsIGEyLCBhMyk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyLCBhMyk7XG4gIH1cbn07XG5cbnZhciBmb3VyQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoYTEsIGEyLCBhMywgYTQpIHtcbiAgdmFyIEtsYXNzID0gdGhpcztcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBLbGFzcy5pbnN0YW5jZVBvb2wucG9wKCk7XG4gICAgS2xhc3MuY2FsbChpbnN0YW5jZSwgYTEsIGEyLCBhMywgYTQpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEtsYXNzKGExLCBhMiwgYTMsIGE0KTtcbiAgfVxufTtcblxudmFyIGZpdmVBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIChhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgdmFyIEtsYXNzID0gdGhpcztcbiAgaWYgKEtsYXNzLmluc3RhbmNlUG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBLbGFzcy5pbnN0YW5jZVBvb2wucG9wKCk7XG4gICAgS2xhc3MuY2FsbChpbnN0YW5jZSwgYTEsIGEyLCBhMywgYTQsIGE1KTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBLbGFzcyhhMSwgYTIsIGEzLCBhNCwgYTUpO1xuICB9XG59O1xuXG52YXIgc3RhbmRhcmRSZWxlYXNlciA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICAhKGluc3RhbmNlIGluc3RhbmNlb2YgS2xhc3MpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1RyeWluZyB0byByZWxlYXNlIGFuIGluc3RhbmNlIGludG8gYSBwb29sIG9mIGEgZGlmZmVyZW50IHR5cGUuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICBpbnN0YW5jZS5kZXN0cnVjdG9yKCk7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoIDwgS2xhc3MucG9vbFNpemUpIHtcbiAgICBLbGFzcy5pbnN0YW5jZVBvb2wucHVzaChpbnN0YW5jZSk7XG4gIH1cbn07XG5cbnZhciBERUZBVUxUX1BPT0xfU0laRSA9IDEwO1xudmFyIERFRkFVTFRfUE9PTEVSID0gb25lQXJndW1lbnRQb29sZXI7XG5cbi8qKlxuICogQXVnbWVudHMgYENvcHlDb25zdHJ1Y3RvcmAgdG8gYmUgYSBwb29sYWJsZSBjbGFzcywgYXVnbWVudGluZyBvbmx5IHRoZSBjbGFzc1xuICogaXRzZWxmIChzdGF0aWNhbGx5KSBub3QgYWRkaW5nIGFueSBwcm90b3R5cGljYWwgZmllbGRzLiBBbnkgQ29weUNvbnN0cnVjdG9yXG4gKiB5b3UgZ2l2ZSB0aGlzIG1heSBoYXZlIGEgYHBvb2xTaXplYCBwcm9wZXJ0eSwgYW5kIHdpbGwgbG9vayBmb3IgYVxuICogcHJvdG90eXBpY2FsIGBkZXN0cnVjdG9yYCBvbiBpbnN0YW5jZXMgKG9wdGlvbmFsKS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDb3B5Q29uc3RydWN0b3IgQ29uc3RydWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byByZXNldC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHBvb2xlciBDdXN0b21pemFibGUgcG9vbGVyLlxuICovXG52YXIgYWRkUG9vbGluZ1RvID0gZnVuY3Rpb24gKENvcHlDb25zdHJ1Y3RvciwgcG9vbGVyKSB7XG4gIHZhciBOZXdLbGFzcyA9IENvcHlDb25zdHJ1Y3RvcjtcbiAgTmV3S2xhc3MuaW5zdGFuY2VQb29sID0gW107XG4gIE5ld0tsYXNzLmdldFBvb2xlZCA9IHBvb2xlciB8fCBERUZBVUxUX1BPT0xFUjtcbiAgaWYgKCFOZXdLbGFzcy5wb29sU2l6ZSkge1xuICAgIE5ld0tsYXNzLnBvb2xTaXplID0gREVGQVVMVF9QT09MX1NJWkU7XG4gIH1cbiAgTmV3S2xhc3MucmVsZWFzZSA9IHN0YW5kYXJkUmVsZWFzZXI7XG4gIHJldHVybiBOZXdLbGFzcztcbn07XG5cbnZhciBQb29sZWRDbGFzcyA9IHtcbiAgYWRkUG9vbGluZ1RvOiBhZGRQb29saW5nVG8sXG4gIG9uZUFyZ3VtZW50UG9vbGVyOiBvbmVBcmd1bWVudFBvb2xlcixcbiAgdHdvQXJndW1lbnRQb29sZXI6IHR3b0FyZ3VtZW50UG9vbGVyLFxuICB0aHJlZUFyZ3VtZW50UG9vbGVyOiB0aHJlZUFyZ3VtZW50UG9vbGVyLFxuICBmb3VyQXJndW1lbnRQb29sZXI6IGZvdXJBcmd1bWVudFBvb2xlcixcbiAgZml2ZUFyZ3VtZW50UG9vbGVyOiBmaXZlQXJndW1lbnRQb29sZXJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUG9vbGVkQ2xhc3M7Il19