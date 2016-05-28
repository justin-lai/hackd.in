/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticTouchEvent
 * @typechecks static-only
 */

'use strict';

var SyntheticUIEvent = require('./SyntheticUIEvent');

var getEventModifierState = require('./getEventModifierState');

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

module.exports = SyntheticTouchEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1N5bnRoZXRpY1RvdWNoRXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7O0FBRUEsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjs7QUFFSixJQUFJLHdCQUF3QixRQUFRLHlCQUFSLENBQXhCOzs7Ozs7QUFNSixJQUFJLHNCQUFzQjtBQUN4QixXQUFTLElBQVQ7QUFDQSxpQkFBZSxJQUFmO0FBQ0Esa0JBQWdCLElBQWhCO0FBQ0EsVUFBUSxJQUFSO0FBQ0EsV0FBUyxJQUFUO0FBQ0EsV0FBUyxJQUFUO0FBQ0EsWUFBVSxJQUFWO0FBQ0Esb0JBQWtCLHFCQUFsQjtDQVJFOzs7Ozs7OztBQWlCSixTQUFTLG1CQUFULENBQTZCLGNBQTdCLEVBQTZDLGNBQTdDLEVBQTZELFdBQTdELEVBQTBFLGlCQUExRSxFQUE2RjtBQUMzRixtQkFBaUIsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEIsY0FBNUIsRUFBNEMsY0FBNUMsRUFBNEQsV0FBNUQsRUFBeUUsaUJBQXpFLEVBRDJGO0NBQTdGOztBQUlBLGlCQUFpQixZQUFqQixDQUE4QixtQkFBOUIsRUFBbUQsbUJBQW5EOztBQUVBLE9BQU8sT0FBUCxHQUFpQixtQkFBakIiLCJmaWxlIjoiU3ludGhldGljVG91Y2hFdmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBTeW50aGV0aWNUb3VjaEV2ZW50XG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFN5bnRoZXRpY1VJRXZlbnQgPSByZXF1aXJlKCcuL1N5bnRoZXRpY1VJRXZlbnQnKTtcblxudmFyIGdldEV2ZW50TW9kaWZpZXJTdGF0ZSA9IHJlcXVpcmUoJy4vZ2V0RXZlbnRNb2RpZmllclN0YXRlJyk7XG5cbi8qKlxuICogQGludGVyZmFjZSBUb3VjaEV2ZW50XG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL3RvdWNoLWV2ZW50cy9cbiAqL1xudmFyIFRvdWNoRXZlbnRJbnRlcmZhY2UgPSB7XG4gIHRvdWNoZXM6IG51bGwsXG4gIHRhcmdldFRvdWNoZXM6IG51bGwsXG4gIGNoYW5nZWRUb3VjaGVzOiBudWxsLFxuICBhbHRLZXk6IG51bGwsXG4gIG1ldGFLZXk6IG51bGwsXG4gIGN0cmxLZXk6IG51bGwsXG4gIHNoaWZ0S2V5OiBudWxsLFxuICBnZXRNb2RpZmllclN0YXRlOiBnZXRFdmVudE1vZGlmaWVyU3RhdGVcbn07XG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IGRpc3BhdGNoQ29uZmlnIENvbmZpZ3VyYXRpb24gdXNlZCB0byBkaXNwYXRjaCB0aGlzIGV2ZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGRpc3BhdGNoTWFya2VyIE1hcmtlciBpZGVudGlmeWluZyB0aGUgZXZlbnQgdGFyZ2V0LlxuICogQHBhcmFtIHtvYmplY3R9IG5hdGl2ZUV2ZW50IE5hdGl2ZSBicm93c2VyIGV2ZW50LlxuICogQGV4dGVuZHMge1N5bnRoZXRpY1VJRXZlbnR9XG4gKi9cbmZ1bmN0aW9uIFN5bnRoZXRpY1RvdWNoRXZlbnQoZGlzcGF0Y2hDb25maWcsIGRpc3BhdGNoTWFya2VyLCBuYXRpdmVFdmVudCwgbmF0aXZlRXZlbnRUYXJnZXQpIHtcbiAgU3ludGhldGljVUlFdmVudC5jYWxsKHRoaXMsIGRpc3BhdGNoQ29uZmlnLCBkaXNwYXRjaE1hcmtlciwgbmF0aXZlRXZlbnQsIG5hdGl2ZUV2ZW50VGFyZ2V0KTtcbn1cblxuU3ludGhldGljVUlFdmVudC5hdWdtZW50Q2xhc3MoU3ludGhldGljVG91Y2hFdmVudCwgVG91Y2hFdmVudEludGVyZmFjZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ludGhldGljVG91Y2hFdmVudDsiXX0=