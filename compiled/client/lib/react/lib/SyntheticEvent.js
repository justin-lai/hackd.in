/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticEvent
 * @typechecks static-only
 */

'use strict';

var PooledClass = require('./PooledClass');

var assign = require('./Object.assign');
var emptyFunction = require('fbjs/lib/emptyFunction');
var warning = require('fbjs/lib/warning');

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function timeStamp(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 */
function SyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  this.dispatchConfig = dispatchConfig;
  this.dispatchMarker = dispatchMarker;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      if (propName === 'target') {
        this.target = nativeEventTarget;
      } else {
        this[propName] = nativeEvent[propName];
      }
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
}

assign(SyntheticEvent.prototype, {

  preventDefault: function preventDefault() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(event, 'This synthetic event is reused for performance reasons. If you\'re ' + 'seeing this, you\'re calling `preventDefault` on a ' + 'released/nullified synthetic event. This is a no-op. See ' + 'https://fb.me/react-event-pooling for more information.') : undefined;
    }
    if (!event) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function stopPropagation() {
    var event = this.nativeEvent;
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(event, 'This synthetic event is reused for performance reasons. If you\'re ' + 'seeing this, you\'re calling `stopPropagation` on a ' + 'released/nullified synthetic event. This is a no-op. See ' + 'https://fb.me/react-event-pooling for more information.') : undefined;
    }
    if (!event) {
      return;
    }

    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function persist() {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function destructor() {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      this[propName] = null;
    }
    this.dispatchConfig = null;
    this.dispatchMarker = null;
    this.nativeEvent = null;
  }

});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function (Class, Interface) {
  var Super = this;

  var prototype = Object.create(Super.prototype);
  assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = assign({}, Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;

  PooledClass.addPoolingTo(Class, PooledClass.fourArgumentPooler);
};

PooledClass.addPoolingTo(SyntheticEvent, PooledClass.fourArgumentPooler);

module.exports = SyntheticEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1N5bnRoZXRpY0V2ZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksY0FBYyxRQUFRLGVBQVIsQ0FBZDs7QUFFSixJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFUO0FBQ0osSUFBSSxnQkFBZ0IsUUFBUSx3QkFBUixDQUFoQjtBQUNKLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQVY7Ozs7OztBQU1KLElBQUksaUJBQWlCO0FBQ25CLFFBQU0sSUFBTjtBQUNBLFVBQVEsSUFBUjs7QUFFQSxpQkFBZSxjQUFjLGVBQWQ7QUFDZixjQUFZLElBQVo7QUFDQSxXQUFTLElBQVQ7QUFDQSxjQUFZLElBQVo7QUFDQSxhQUFXLG1CQUFVLEtBQVYsRUFBaUI7QUFDMUIsV0FBTyxNQUFNLFNBQU4sSUFBbUIsS0FBSyxHQUFMLEVBQW5CLENBRG1CO0dBQWpCO0FBR1gsb0JBQWtCLElBQWxCO0FBQ0EsYUFBVyxJQUFYO0NBWkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ0osU0FBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDLGNBQXhDLEVBQXdELFdBQXhELEVBQXFFLGlCQUFyRSxFQUF3RjtBQUN0RixPQUFLLGNBQUwsR0FBc0IsY0FBdEIsQ0FEc0Y7QUFFdEYsT0FBSyxjQUFMLEdBQXNCLGNBQXRCLENBRnNGO0FBR3RGLE9BQUssV0FBTCxHQUFtQixXQUFuQixDQUhzRjs7QUFLdEYsTUFBSSxZQUFZLEtBQUssV0FBTCxDQUFpQixTQUFqQixDQUxzRTtBQU10RixPQUFLLElBQUksUUFBSixJQUFnQixTQUFyQixFQUFnQztBQUM5QixRQUFJLENBQUMsVUFBVSxjQUFWLENBQXlCLFFBQXpCLENBQUQsRUFBcUM7QUFDdkMsZUFEdUM7S0FBekM7QUFHQSxRQUFJLFlBQVksVUFBVSxRQUFWLENBQVosQ0FKMEI7QUFLOUIsUUFBSSxTQUFKLEVBQWU7QUFDYixXQUFLLFFBQUws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QU4sQ0FBMUIsQ0FIb0Q7QUFJeEQsU0FBTyxTQUFQLEVBQWtCLE1BQU0sU0FBTixDQUFsQixDQUp3RDtBQUt4RCxRQUFNLFNBQU4sR0FBa0IsU0FBbEIsQ0FMd0Q7QUFNeEQsUUFBTSxTQUFOLENBQWdCLFdBQWhCLEdBQThCLEtBQTlCLENBTndEOztBQVF4RCxRQUFNLFNBQU4sR0FBa0IsT0FBTyxFQUFQLEVBQVcsTUFBTSxTQUFOLEVBQWlCLFNBQTVCLENBQWxCLENBUndEO0FBU3hELFFBQU0sWUFBTixHQUFxQixNQUFNLFlBQU4sQ0FUbUM7O0FBV3hELGNBQVksWUFBWixDQUF5QixLQUF6QixFQUFnQyxZQUFZLGtCQUFaLENBQWhDLENBWHdEO0NBQTVCOztBQWM5QixZQUFZLFlBQVosQ0FBeUIsY0FBekIsRUFBeUMsWUFBWSxrQkFBWixDQUF6Qzs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsY0FBakIiLCJmaWxlIjoiU3ludGhldGljRXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgU3ludGhldGljRXZlbnRcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUG9vbGVkQ2xhc3MgPSByZXF1aXJlKCcuL1Bvb2xlZENsYXNzJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogQGludGVyZmFjZSBFdmVudFxuICogQHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1FdmVudHMvXG4gKi9cbnZhciBFdmVudEludGVyZmFjZSA9IHtcbiAgdHlwZTogbnVsbCxcbiAgdGFyZ2V0OiBudWxsLFxuICAvLyBjdXJyZW50VGFyZ2V0IGlzIHNldCB3aGVuIGRpc3BhdGNoaW5nOyBubyB1c2UgaW4gY29weWluZyBpdCBoZXJlXG4gIGN1cnJlbnRUYXJnZXQ6IGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsLFxuICBldmVudFBoYXNlOiBudWxsLFxuICBidWJibGVzOiBudWxsLFxuICBjYW5jZWxhYmxlOiBudWxsLFxuICB0aW1lU3RhbXA6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHJldHVybiBldmVudC50aW1lU3RhbXAgfHwgRGF0ZS5ub3coKTtcbiAgfSxcbiAgZGVmYXVsdFByZXZlbnRlZDogbnVsbCxcbiAgaXNUcnVzdGVkOiBudWxsXG59O1xuXG4vKipcbiAqIFN5bnRoZXRpYyBldmVudHMgYXJlIGRpc3BhdGNoZWQgYnkgZXZlbnQgcGx1Z2lucywgdHlwaWNhbGx5IGluIHJlc3BvbnNlIHRvIGFcbiAqIHRvcC1sZXZlbCBldmVudCBkZWxlZ2F0aW9uIGhhbmRsZXIuXG4gKlxuICogVGhlc2Ugc3lzdGVtcyBzaG91bGQgZ2VuZXJhbGx5IHVzZSBwb29saW5nIHRvIHJlZHVjZSB0aGUgZnJlcXVlbmN5IG9mIGdhcmJhZ2VcbiAqIGNvbGxlY3Rpb24uIFRoZSBzeXN0ZW0gc2hvdWxkIGNoZWNrIGBpc1BlcnNpc3RlbnRgIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZVxuICogZXZlbnQgc2hvdWxkIGJlIHJlbGVhc2VkIGludG8gdGhlIHBvb2wgYWZ0ZXIgYmVpbmcgZGlzcGF0Y2hlZC4gVXNlcnMgdGhhdFxuICogbmVlZCBhIHBlcnNpc3RlZCBldmVudCBzaG91bGQgaW52b2tlIGBwZXJzaXN0YC5cbiAqXG4gKiBTeW50aGV0aWMgZXZlbnRzIChhbmQgc3ViY2xhc3NlcykgaW1wbGVtZW50IHRoZSBET00gTGV2ZWwgMyBFdmVudHMgQVBJIGJ5XG4gKiBub3JtYWxpemluZyBicm93c2VyIHF1aXJrcy4gU3ViY2xhc3NlcyBkbyBub3QgbmVjZXNzYXJpbHkgaGF2ZSB0byBpbXBsZW1lbnQgYVxuICogRE9NIGludGVyZmFjZTsgY3VzdG9tIGFwcGxpY2F0aW9uLXNwZWNpZmljIGV2ZW50cyBjYW4gYWxzbyBzdWJjbGFzcyB0aGlzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBkaXNwYXRjaENvbmZpZyBDb25maWd1cmF0aW9uIHVzZWQgdG8gZGlzcGF0Y2ggdGhpcyBldmVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXNwYXRjaE1hcmtlciBNYXJrZXIgaWRlbnRpZnlpbmcgdGhlIGV2ZW50IHRhcmdldC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBuYXRpdmVFdmVudCBOYXRpdmUgYnJvd3NlciBldmVudC5cbiAqL1xuZnVuY3Rpb24gU3ludGhldGljRXZlbnQoZGlzcGF0Y2hDb25maWcsIGRpc3BhdGNoTWFya2VyLCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgdGhpcy5kaXNwYXRjaENvbmZpZyA9IGRpc3BhdGNoQ29uZmlnO1xuICB0aGlzLmRpc3BhdGNoTWFya2VyID0gZGlzcGF0Y2hNYXJrZXI7XG4gIHRoaXMubmF0aXZlRXZlbnQgPSBuYXRpdmVFdmVudDtcblxuICB2YXIgSW50ZXJmYWNlID0gdGhpcy5jb25zdHJ1Y3Rvci5JbnRlcmZhY2U7XG4gIGZvciAodmFyIHByb3BOYW1lIGluIEludGVyZmFjZSkge1xuICAgIGlmICghSW50ZXJmYWNlLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHZhciBub3JtYWxpemUgPSBJbnRlcmZhY2VbcHJvcE5hbWVdO1xuICAgIGlmIChub3JtYWxpemUpIHtcbiAgICAgIHRoaXNbcHJvcE5hbWVdID0gbm9ybWFsaXplKG5hdGl2ZUV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByb3BOYW1lID09PSAndGFyZ2V0Jykge1xuICAgICAgICB0aGlzLnRhcmdldCA9IG5hdGl2ZUV2ZW50VGFyZ2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1twcm9wTmFtZV0gPSBuYXRpdmVFdmVudFtwcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFyIGRlZmF1bHRQcmV2ZW50ZWQgPSBuYXRpdmVFdmVudC5kZWZhdWx0UHJldmVudGVkICE9IG51bGwgPyBuYXRpdmVFdmVudC5kZWZhdWx0UHJldmVudGVkIDogbmF0aXZlRXZlbnQucmV0dXJuVmFsdWUgPT09IGZhbHNlO1xuICBpZiAoZGVmYXVsdFByZXZlbnRlZCkge1xuICAgIHRoaXMuaXNEZWZhdWx0UHJldmVudGVkID0gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zRmFsc2U7XG4gIH1cbiAgdGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9IGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZTtcbn1cblxuYXNzaWduKFN5bnRoZXRpY0V2ZW50LnByb3RvdHlwZSwge1xuXG4gIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcbiAgICB2YXIgZXZlbnQgPSB0aGlzLm5hdGl2ZUV2ZW50O1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhldmVudCwgJ1RoaXMgc3ludGhldGljIGV2ZW50IGlzIHJldXNlZCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy4gSWYgeW91XFwncmUgJyArICdzZWVpbmcgdGhpcywgeW91XFwncmUgY2FsbGluZyBgcHJldmVudERlZmF1bHRgIG9uIGEgJyArICdyZWxlYXNlZC9udWxsaWZpZWQgc3ludGhldGljIGV2ZW50LiBUaGlzIGlzIGEgbm8tb3AuIFNlZSAnICsgJ2h0dHBzOi8vZmIubWUvcmVhY3QtZXZlbnQtcG9vbGluZyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nKSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKCFldmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVHJ1ZTtcbiAgfSxcblxuICBzdG9wUHJvcGFnYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnQgPSB0aGlzLm5hdGl2ZUV2ZW50O1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhldmVudCwgJ1RoaXMgc3ludGhldGljIGV2ZW50IGlzIHJldXNlZCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy4gSWYgeW91XFwncmUgJyArICdzZWVpbmcgdGhpcywgeW91XFwncmUgY2FsbGluZyBgc3RvcFByb3BhZ2F0aW9uYCBvbiBhICcgKyAncmVsZWFzZWQvbnVsbGlmaWVkIHN5bnRoZXRpYyBldmVudC4gVGhpcyBpcyBhIG5vLW9wLiBTZWUgJyArICdodHRwczovL2ZiLm1lL3JlYWN0LWV2ZW50LXBvb2xpbmcgZm9yIG1vcmUgaW5mb3JtYXRpb24uJykgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICghZXZlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9IGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBXZSByZWxlYXNlIGFsbCBkaXNwYXRjaGVkIGBTeW50aGV0aWNFdmVudGBzIGFmdGVyIGVhY2ggZXZlbnQgbG9vcCwgYWRkaW5nXG4gICAqIHRoZW0gYmFjayBpbnRvIHRoZSBwb29sLiBUaGlzIGFsbG93cyBhIHdheSB0byBob2xkIG9udG8gYSByZWZlcmVuY2UgdGhhdFxuICAgKiB3b24ndCBiZSBhZGRlZCBiYWNrIGludG8gdGhlIHBvb2wuXG4gICAqL1xuICBwZXJzaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pc1BlcnNpc3RlbnQgPSBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoaXMgZXZlbnQgc2hvdWxkIGJlIHJlbGVhc2VkIGJhY2sgaW50byB0aGUgcG9vbC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGlzIHNob3VsZCBub3QgYmUgcmVsZWFzZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzUGVyc2lzdGVudDogZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlLFxuXG4gIC8qKlxuICAgKiBgUG9vbGVkQ2xhc3NgIGxvb2tzIGZvciBgZGVzdHJ1Y3RvcmAgb24gZWFjaCBpbnN0YW5jZSBpdCByZWxlYXNlcy5cbiAgICovXG4gIGRlc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgSW50ZXJmYWNlID0gdGhpcy5jb25zdHJ1Y3Rvci5JbnRlcmZhY2U7XG4gICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gSW50ZXJmYWNlKSB7XG4gICAgICB0aGlzW3Byb3BOYW1lXSA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuZGlzcGF0Y2hDb25maWcgPSBudWxsO1xuICAgIHRoaXMuZGlzcGF0Y2hNYXJrZXIgPSBudWxsO1xuICAgIHRoaXMubmF0aXZlRXZlbnQgPSBudWxsO1xuICB9XG5cbn0pO1xuXG5TeW50aGV0aWNFdmVudC5JbnRlcmZhY2UgPSBFdmVudEludGVyZmFjZTtcblxuLyoqXG4gKiBIZWxwZXIgdG8gcmVkdWNlIGJvaWxlcnBsYXRlIHdoZW4gY3JlYXRpbmcgc3ViY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBDbGFzc1xuICogQHBhcmFtIHs/b2JqZWN0fSBJbnRlcmZhY2VcbiAqL1xuU3ludGhldGljRXZlbnQuYXVnbWVudENsYXNzID0gZnVuY3Rpb24gKENsYXNzLCBJbnRlcmZhY2UpIHtcbiAgdmFyIFN1cGVyID0gdGhpcztcblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpO1xuICBhc3NpZ24ocHJvdG90eXBlLCBDbGFzcy5wcm90b3R5cGUpO1xuICBDbGFzcy5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gIENsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENsYXNzO1xuXG4gIENsYXNzLkludGVyZmFjZSA9IGFzc2lnbih7fSwgU3VwZXIuSW50ZXJmYWNlLCBJbnRlcmZhY2UpO1xuICBDbGFzcy5hdWdtZW50Q2xhc3MgPSBTdXBlci5hdWdtZW50Q2xhc3M7XG5cbiAgUG9vbGVkQ2xhc3MuYWRkUG9vbGluZ1RvKENsYXNzLCBQb29sZWRDbGFzcy5mb3VyQXJndW1lbnRQb29sZXIpO1xufTtcblxuUG9vbGVkQ2xhc3MuYWRkUG9vbGluZ1RvKFN5bnRoZXRpY0V2ZW50LCBQb29sZWRDbGFzcy5mb3VyQXJndW1lbnRQb29sZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bnRoZXRpY0V2ZW50OyJdfQ==