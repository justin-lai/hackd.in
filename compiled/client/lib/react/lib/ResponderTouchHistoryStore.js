/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ResponderTouchHistoryStore
 */

'use strict';

var EventPluginUtils = require('./EventPluginUtils');

var invariant = require('fbjs/lib/invariant');

var isMoveish = EventPluginUtils.isMoveish;
var isStartish = EventPluginUtils.isStartish;
var isEndish = EventPluginUtils.isEndish;

var MAX_TOUCH_BANK = 20;

/**
 * Touch position/time tracking information by touchID. Typically, we'll only
 * see IDs with a range of 1-20 (they are recycled when touches end and then
 * start again). This data is commonly needed by many different interaction
 * logic modules so precomputing it is very helpful to do once.
 * Each touch object in `touchBank` is of the following form:
 * { touchActive: boolean,
 *   startTimeStamp: number,
 *   startPageX: number,
 *   startPageY: number,
 *   currentPageX: number,
 *   currentPageY: number,
 *   currentTimeStamp: number
 * }
 */
var touchHistory = {
  touchBank: [],
  numberActiveTouches: 0,
  // If there is only one active touch, we remember its location. This prevents
  // us having to loop through all of the touches all the time in the most
  // common case.
  indexOfSingleActiveTouch: -1,
  mostRecentTimeStamp: 0
};

var timestampForTouch = function timestampForTouch(touch) {
  // The legacy internal implementation provides "timeStamp", which has been
  // renamed to "timestamp". Let both work for now while we iron it out
  // TODO (evv): rename timeStamp to timestamp in internal code
  return touch.timeStamp || touch.timestamp;
};

/**
 * TODO: Instead of making gestures recompute filtered velocity, we could
 * include a built in velocity computation that can be reused globally.
 * @param {Touch} touch Native touch object.
 */
var initializeTouchData = function initializeTouchData(touch) {
  return {
    touchActive: true,
    startTimeStamp: timestampForTouch(touch),
    startPageX: touch.pageX,
    startPageY: touch.pageY,
    currentPageX: touch.pageX,
    currentPageY: touch.pageY,
    currentTimeStamp: timestampForTouch(touch),
    previousPageX: touch.pageX,
    previousPageY: touch.pageY,
    previousTimeStamp: timestampForTouch(touch)
  };
};

var reinitializeTouchTrack = function reinitializeTouchTrack(touchTrack, touch) {
  touchTrack.touchActive = true;
  touchTrack.startTimeStamp = timestampForTouch(touch);
  touchTrack.startPageX = touch.pageX;
  touchTrack.startPageY = touch.pageY;
  touchTrack.currentPageX = touch.pageX;
  touchTrack.currentPageY = touch.pageY;
  touchTrack.currentTimeStamp = timestampForTouch(touch);
  touchTrack.previousPageX = touch.pageX;
  touchTrack.previousPageY = touch.pageY;
  touchTrack.previousTimeStamp = timestampForTouch(touch);
};

var validateTouch = function validateTouch(touch) {
  var identifier = touch.identifier;
  !(identifier != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Touch object is missing identifier') : invariant(false) : undefined;
  if (identifier > MAX_TOUCH_BANK) {
    console.warn('Touch identifier ' + identifier + ' is greater than maximum ' + 'supported ' + MAX_TOUCH_BANK + ' which causes performance issues ' + 'backfilling array locations for all of the indices.');
  }
};

var recordStartTouchData = function recordStartTouchData(touch) {
  var touchBank = touchHistory.touchBank;
  var identifier = touch.identifier;
  var touchTrack = touchBank[identifier];
  if (process.env.NODE_ENV !== 'production') {
    validateTouch(touch);
  }
  if (touchTrack) {
    reinitializeTouchTrack(touchTrack, touch);
  } else {
    touchBank[touch.identifier] = initializeTouchData(touch);
  }
  touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
};

var recordMoveTouchData = function recordMoveTouchData(touch) {
  var touchBank = touchHistory.touchBank;
  var touchTrack = touchBank[touch.identifier];
  if (process.env.NODE_ENV !== 'production') {
    validateTouch(touch);
    !touchTrack ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Touch data should have been recorded on start') : invariant(false) : undefined;
  }
  touchTrack.touchActive = true;
  touchTrack.previousPageX = touchTrack.currentPageX;
  touchTrack.previousPageY = touchTrack.currentPageY;
  touchTrack.previousTimeStamp = touchTrack.currentTimeStamp;
  touchTrack.currentPageX = touch.pageX;
  touchTrack.currentPageY = touch.pageY;
  touchTrack.currentTimeStamp = timestampForTouch(touch);
  touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
};

var recordEndTouchData = function recordEndTouchData(touch) {
  var touchBank = touchHistory.touchBank;
  var touchTrack = touchBank[touch.identifier];
  if (process.env.NODE_ENV !== 'production') {
    validateTouch(touch);
    !touchTrack ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Touch data should have been recorded on start') : invariant(false) : undefined;
  }
  touchTrack.previousPageX = touchTrack.currentPageX;
  touchTrack.previousPageY = touchTrack.currentPageY;
  touchTrack.previousTimeStamp = touchTrack.currentTimeStamp;
  touchTrack.currentPageX = touch.pageX;
  touchTrack.currentPageY = touch.pageY;
  touchTrack.currentTimeStamp = timestampForTouch(touch);
  touchTrack.touchActive = false;
  touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
};

var ResponderTouchHistoryStore = {
  recordTouchTrack: function recordTouchTrack(topLevelType, nativeEvent) {
    var touchBank = touchHistory.touchBank;
    if (isMoveish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordMoveTouchData);
    } else if (isStartish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordStartTouchData);
      touchHistory.numberActiveTouches = nativeEvent.touches.length;
      if (touchHistory.numberActiveTouches === 1) {
        touchHistory.indexOfSingleActiveTouch = nativeEvent.touches[0].identifier;
      }
    } else if (isEndish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordEndTouchData);
      touchHistory.numberActiveTouches = nativeEvent.touches.length;
      if (touchHistory.numberActiveTouches === 1) {
        for (var i = 0; i < touchBank.length; i++) {
          var touchTrackToCheck = touchBank[i];
          if (touchTrackToCheck != null && touchTrackToCheck.touchActive) {
            touchHistory.indexOfSingleActiveTouch = i;
            break;
          }
        }
        if (process.env.NODE_ENV !== 'production') {
          var activeTouchData = touchBank[touchHistory.indexOfSingleActiveTouch];
          var foundActive = activeTouchData != null && !!activeTouchData.touchActive;
          !foundActive ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot find single active touch') : invariant(false) : undefined;
        }
      }
    }
  },

  touchHistory: touchHistory
};

module.exports = ResponderTouchHistoryStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1Jlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjs7QUFFSixJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFaOztBQUVKLElBQUksWUFBWSxpQkFBaUIsU0FBakI7QUFDaEIsSUFBSSxhQUFhLGlCQUFpQixVQUFqQjtBQUNqQixJQUFJLFdBQVcsaUJBQWlCLFFBQWpCOztBQUVmLElBQUksaUJBQWlCLEVBQWpCOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCSixJQUFJLGVBQWU7QUFDakIsYUFBVyxFQUFYO0FBQ0EsdUJBQXFCLENBQXJCOzs7O0FBSUEsNEJBQTBCLENBQUMsQ0FBRDtBQUMxQix1QkFBcUIsQ0FBckI7Q0FQRTs7QUFVSixJQUFJLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBVSxLQUFWLEVBQWlCOzs7O0FBSXZDLFNBQU8sTUFBTSxTQUFOLElBQW1CLE1BQU0sU0FBTixDQUphO0NBQWpCOzs7Ozs7O0FBWXhCLElBQUksc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFVLEtBQVYsRUFBaUI7QUFDekMsU0FBTztBQUNMLGlCQUFhLElBQWI7QUFDQSxvQkFBZ0Isa0JBQWtCLEtBQWxCLENBQWhCO0FBQ0EsZ0JBQVksTUFBTSxLQUFOO0FBQ1osZ0JBQVksTUFBTSxLQUFOO0FBQ1osa0JBQWMsTUFBTSxLQUFOO0FBQ2Qsa0JBQWMsTUFBTSxLQUFOO0FBQ2Qsc0JBQWtCLGtCQUFrQixLQUFsQixDQUFsQjtBQUNBLG1CQUFlLE1BQU0sS0FBTjtBQUNmLG1CQUFlLE1BQU0sS0FBTjtBQUNmLHVCQUFtQixrQkFBa0IsS0FBbEIsQ0FBbkI7R0FWRixDQUR5QztDQUFqQjs7QUFlMUIsSUFBSSx5QkFBeUIsU0FBekIsc0JBQXlCLENBQVUsVUFBVixFQUFzQixLQUF0QixFQUE2QjtBQUN4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bEIsZ0JBQWMsWUFBZDtDQS9CRTs7QUFrQ0osT0FBTyxPQUFQLEdBQWlCLDBCQUFqQiIsImZpbGUiOiJSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZXNwb25kZXJUb3VjaEhpc3RvcnlTdG9yZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50UGx1Z2luVXRpbHMgPSByZXF1aXJlKCcuL0V2ZW50UGx1Z2luVXRpbHMnKTtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG52YXIgaXNNb3ZlaXNoID0gRXZlbnRQbHVnaW5VdGlscy5pc01vdmVpc2g7XG52YXIgaXNTdGFydGlzaCA9IEV2ZW50UGx1Z2luVXRpbHMuaXNTdGFydGlzaDtcbnZhciBpc0VuZGlzaCA9IEV2ZW50UGx1Z2luVXRpbHMuaXNFbmRpc2g7XG5cbnZhciBNQVhfVE9VQ0hfQkFOSyA9IDIwO1xuXG4vKipcbiAqIFRvdWNoIHBvc2l0aW9uL3RpbWUgdHJhY2tpbmcgaW5mb3JtYXRpb24gYnkgdG91Y2hJRC4gVHlwaWNhbGx5LCB3ZSdsbCBvbmx5XG4gKiBzZWUgSURzIHdpdGggYSByYW5nZSBvZiAxLTIwICh0aGV5IGFyZSByZWN5Y2xlZCB3aGVuIHRvdWNoZXMgZW5kIGFuZCB0aGVuXG4gKiBzdGFydCBhZ2FpbikuIFRoaXMgZGF0YSBpcyBjb21tb25seSBuZWVkZWQgYnkgbWFueSBkaWZmZXJlbnQgaW50ZXJhY3Rpb25cbiAqIGxvZ2ljIG1vZHVsZXMgc28gcHJlY29tcHV0aW5nIGl0IGlzIHZlcnkgaGVscGZ1bCB0byBkbyBvbmNlLlxuICogRWFjaCB0b3VjaCBvYmplY3QgaW4gYHRvdWNoQmFua2AgaXMgb2YgdGhlIGZvbGxvd2luZyBmb3JtOlxuICogeyB0b3VjaEFjdGl2ZTogYm9vbGVhbixcbiAqICAgc3RhcnRUaW1lU3RhbXA6IG51bWJlcixcbiAqICAgc3RhcnRQYWdlWDogbnVtYmVyLFxuICogICBzdGFydFBhZ2VZOiBudW1iZXIsXG4gKiAgIGN1cnJlbnRQYWdlWDogbnVtYmVyLFxuICogICBjdXJyZW50UGFnZVk6IG51bWJlcixcbiAqICAgY3VycmVudFRpbWVTdGFtcDogbnVtYmVyXG4gKiB9XG4gKi9cbnZhciB0b3VjaEhpc3RvcnkgPSB7XG4gIHRvdWNoQmFuazogW10sXG4gIG51bWJlckFjdGl2ZVRvdWNoZXM6IDAsXG4gIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIGFjdGl2ZSB0b3VjaCwgd2UgcmVtZW1iZXIgaXRzIGxvY2F0aW9uLiBUaGlzIHByZXZlbnRzXG4gIC8vIHVzIGhhdmluZyB0byBsb29wIHRocm91Z2ggYWxsIG9mIHRoZSB0b3VjaGVzIGFsbCB0aGUgdGltZSBpbiB0aGUgbW9zdFxuICAvLyBjb21tb24gY2FzZS5cbiAgaW5kZXhPZlNpbmdsZUFjdGl2ZVRvdWNoOiAtMSxcbiAgbW9zdFJlY2VudFRpbWVTdGFtcDogMFxufTtcblxudmFyIHRpbWVzdGFtcEZvclRvdWNoID0gZnVuY3Rpb24gKHRvdWNoKSB7XG4gIC8vIFRoZSBsZWdhY3kgaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gcHJvdmlkZXMgXCJ0aW1lU3RhbXBcIiwgd2hpY2ggaGFzIGJlZW5cbiAgLy8gcmVuYW1lZCB0byBcInRpbWVzdGFtcFwiLiBMZXQgYm90aCB3b3JrIGZvciBub3cgd2hpbGUgd2UgaXJvbiBpdCBvdXRcbiAgLy8gVE9ETyAoZXZ2KTogcmVuYW1lIHRpbWVTdGFtcCB0byB0aW1lc3RhbXAgaW4gaW50ZXJuYWwgY29kZVxuICByZXR1cm4gdG91Y2gudGltZVN0YW1wIHx8IHRvdWNoLnRpbWVzdGFtcDtcbn07XG5cbi8qKlxuICogVE9ETzogSW5zdGVhZCBvZiBtYWtpbmcgZ2VzdHVyZXMgcmVjb21wdXRlIGZpbHRlcmVkIHZlbG9jaXR5LCB3ZSBjb3VsZFxuICogaW5jbHVkZSBhIGJ1aWx0IGluIHZlbG9jaXR5IGNvbXB1dGF0aW9uIHRoYXQgY2FuIGJlIHJldXNlZCBnbG9iYWxseS5cbiAqIEBwYXJhbSB7VG91Y2h9IHRvdWNoIE5hdGl2ZSB0b3VjaCBvYmplY3QuXG4gKi9cbnZhciBpbml0aWFsaXplVG91Y2hEYXRhID0gZnVuY3Rpb24gKHRvdWNoKSB7XG4gIHJldHVybiB7XG4gICAgdG91Y2hBY3RpdmU6IHRydWUsXG4gICAgc3RhcnRUaW1lU3RhbXA6IHRpbWVzdGFtcEZvclRvdWNoKHRvdWNoKSxcbiAgICBzdGFydFBhZ2VYOiB0b3VjaC5wYWdlWCxcbiAgICBzdGFydFBhZ2VZOiB0b3VjaC5wYWdlWSxcbiAgICBjdXJyZW50UGFnZVg6IHRvdWNoLnBhZ2VYLFxuICAgIGN1cnJlbnRQYWdlWTogdG91Y2gucGFnZVksXG4gICAgY3VycmVudFRpbWVTdGFtcDogdGltZXN0YW1wRm9yVG91Y2godG91Y2gpLFxuICAgIHByZXZpb3VzUGFnZVg6IHRvdWNoLnBhZ2VYLFxuICAgIHByZXZpb3VzUGFnZVk6IHRvdWNoLnBhZ2VZLFxuICAgIHByZXZpb3VzVGltZVN0YW1wOiB0aW1lc3RhbXBGb3JUb3VjaCh0b3VjaClcbiAgfTtcbn07XG5cbnZhciByZWluaXRpYWxpemVUb3VjaFRyYWNrID0gZnVuY3Rpb24gKHRvdWNoVHJhY2ssIHRvdWNoKSB7XG4gIHRvdWNoVHJhY2sudG91Y2hBY3RpdmUgPSB0cnVlO1xuICB0b3VjaFRyYWNrLnN0YXJ0VGltZVN0YW1wID0gdGltZXN0YW1wRm9yVG91Y2godG91Y2gpO1xuICB0b3VjaFRyYWNrLnN0YXJ0UGFnZVggPSB0b3VjaC5wYWdlWDtcbiAgdG91Y2hUcmFjay5zdGFydFBhZ2VZID0gdG91Y2gucGFnZVk7XG4gIHRvdWNoVHJhY2suY3VycmVudFBhZ2VYID0gdG91Y2gucGFnZVg7XG4gIHRvdWNoVHJhY2suY3VycmVudFBhZ2VZID0gdG91Y2gucGFnZVk7XG4gIHRvdWNoVHJhY2suY3VycmVudFRpbWVTdGFtcCA9IHRpbWVzdGFtcEZvclRvdWNoKHRvdWNoKTtcbiAgdG91Y2hUcmFjay5wcmV2aW91c1BhZ2VYID0gdG91Y2gucGFnZVg7XG4gIHRvdWNoVHJhY2sucHJldmlvdXNQYWdlWSA9IHRvdWNoLnBhZ2VZO1xuICB0b3VjaFRyYWNrLnByZXZpb3VzVGltZVN0YW1wID0gdGltZXN0YW1wRm9yVG91Y2godG91Y2gpO1xufTtcblxudmFyIHZhbGlkYXRlVG91Y2ggPSBmdW5jdGlvbiAodG91Y2gpIHtcbiAgdmFyIGlkZW50aWZpZXIgPSB0b3VjaC5pZGVudGlmaWVyO1xuICAhKGlkZW50aWZpZXIgIT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVG91Y2ggb2JqZWN0IGlzIG1pc3NpbmcgaWRlbnRpZmllcicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgaWYgKGlkZW50aWZpZXIgPiBNQVhfVE9VQ0hfQkFOSykge1xuICAgIGNvbnNvbGUud2FybignVG91Y2ggaWRlbnRpZmllciAnICsgaWRlbnRpZmllciArICcgaXMgZ3JlYXRlciB0aGFuIG1heGltdW0gJyArICdzdXBwb3J0ZWQgJyArIE1BWF9UT1VDSF9CQU5LICsgJyB3aGljaCBjYXVzZXMgcGVyZm9ybWFuY2UgaXNzdWVzICcgKyAnYmFja2ZpbGxpbmcgYXJyYXkgbG9jYXRpb25zIGZvciBhbGwgb2YgdGhlIGluZGljZXMuJyk7XG4gIH1cbn07XG5cbnZhciByZWNvcmRTdGFydFRvdWNoRGF0YSA9IGZ1bmN0aW9uICh0b3VjaCkge1xuICB2YXIgdG91Y2hCYW5rID0gdG91Y2hIaXN0b3J5LnRvdWNoQmFuaztcbiAgdmFyIGlkZW50aWZpZXIgPSB0b3VjaC5pZGVudGlmaWVyO1xuICB2YXIgdG91Y2hUcmFjayA9IHRvdWNoQmFua1tpZGVudGlmaWVyXTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB2YWxpZGF0ZVRvdWNoKHRvdWNoKTtcbiAgfVxuICBpZiAodG91Y2hUcmFjaykge1xuICAgIHJlaW5pdGlhbGl6ZVRvdWNoVHJhY2sodG91Y2hUcmFjaywgdG91Y2gpO1xuICB9IGVsc2Uge1xuICAgIHRvdWNoQmFua1t0b3VjaC5pZGVudGlmaWVyXSA9IGluaXRpYWxpemVUb3VjaERhdGEodG91Y2gpO1xuICB9XG4gIHRvdWNoSGlzdG9yeS5tb3N0UmVjZW50VGltZVN0YW1wID0gdGltZXN0YW1wRm9yVG91Y2godG91Y2gpO1xufTtcblxudmFyIHJlY29yZE1vdmVUb3VjaERhdGEgPSBmdW5jdGlvbiAodG91Y2gpIHtcbiAgdmFyIHRvdWNoQmFuayA9IHRvdWNoSGlzdG9yeS50b3VjaEJhbms7XG4gIHZhciB0b3VjaFRyYWNrID0gdG91Y2hCYW5rW3RvdWNoLmlkZW50aWZpZXJdO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhbGlkYXRlVG91Y2godG91Y2gpO1xuICAgICF0b3VjaFRyYWNrID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1RvdWNoIGRhdGEgc2hvdWxkIGhhdmUgYmVlbiByZWNvcmRlZCBvbiBzdGFydCcpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgfVxuICB0b3VjaFRyYWNrLnRvdWNoQWN0aXZlID0gdHJ1ZTtcbiAgdG91Y2hUcmFjay5wcmV2aW91c1BhZ2VYID0gdG91Y2hUcmFjay5jdXJyZW50UGFnZVg7XG4gIHRvdWNoVHJhY2sucHJldmlvdXNQYWdlWSA9IHRvdWNoVHJhY2suY3VycmVudFBhZ2VZO1xuICB0b3VjaFRyYWNrLnByZXZpb3VzVGltZVN0YW1wID0gdG91Y2hUcmFjay5jdXJyZW50VGltZVN0YW1wO1xuICB0b3VjaFRyYWNrLmN1cnJlbnRQYWdlWCA9IHRvdWNoLnBhZ2VYO1xuICB0b3VjaFRyYWNrLmN1cnJlbnRQYWdlWSA9IHRvdWNoLnBhZ2VZO1xuICB0b3VjaFRyYWNrLmN1cnJlbnRUaW1lU3RhbXAgPSB0aW1lc3RhbXBGb3JUb3VjaCh0b3VjaCk7XG4gIHRvdWNoSGlzdG9yeS5tb3N0UmVjZW50VGltZVN0YW1wID0gdGltZXN0YW1wRm9yVG91Y2godG91Y2gpO1xufTtcblxudmFyIHJlY29yZEVuZFRvdWNoRGF0YSA9IGZ1bmN0aW9uICh0b3VjaCkge1xuICB2YXIgdG91Y2hCYW5rID0gdG91Y2hIaXN0b3J5LnRvdWNoQmFuaztcbiAgdmFyIHRvdWNoVHJhY2sgPSB0b3VjaEJhbmtbdG91Y2guaWRlbnRpZmllcl07XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdmFsaWRhdGVUb3VjaCh0b3VjaCk7XG4gICAgIXRvdWNoVHJhY2sgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVG91Y2ggZGF0YSBzaG91bGQgaGF2ZSBiZWVuIHJlY29yZGVkIG9uIHN0YXJ0JykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICB9XG4gIHRvdWNoVHJhY2sucHJldmlvdXNQYWdlWCA9IHRvdWNoVHJhY2suY3VycmVudFBhZ2VYO1xuICB0b3VjaFRyYWNrLnByZXZpb3VzUGFnZVkgPSB0b3VjaFRyYWNrLmN1cnJlbnRQYWdlWTtcbiAgdG91Y2hUcmFjay5wcmV2aW91c1RpbWVTdGFtcCA9IHRvdWNoVHJhY2suY3VycmVudFRpbWVTdGFtcDtcbiAgdG91Y2hUcmFjay5jdXJyZW50UGFnZVggPSB0b3VjaC5wYWdlWDtcbiAgdG91Y2hUcmFjay5jdXJyZW50UGFnZVkgPSB0b3VjaC5wYWdlWTtcbiAgdG91Y2hUcmFjay5jdXJyZW50VGltZVN0YW1wID0gdGltZXN0YW1wRm9yVG91Y2godG91Y2gpO1xuICB0b3VjaFRyYWNrLnRvdWNoQWN0aXZlID0gZmFsc2U7XG4gIHRvdWNoSGlzdG9yeS5tb3N0UmVjZW50VGltZVN0YW1wID0gdGltZXN0YW1wRm9yVG91Y2godG91Y2gpO1xufTtcblxudmFyIFJlc3BvbmRlclRvdWNoSGlzdG9yeVN0b3JlID0ge1xuICByZWNvcmRUb3VjaFRyYWNrOiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCBuYXRpdmVFdmVudCkge1xuICAgIHZhciB0b3VjaEJhbmsgPSB0b3VjaEhpc3RvcnkudG91Y2hCYW5rO1xuICAgIGlmIChpc01vdmVpc2godG9wTGV2ZWxUeXBlKSkge1xuICAgICAgbmF0aXZlRXZlbnQuY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChyZWNvcmRNb3ZlVG91Y2hEYXRhKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RhcnRpc2godG9wTGV2ZWxUeXBlKSkge1xuICAgICAgbmF0aXZlRXZlbnQuY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChyZWNvcmRTdGFydFRvdWNoRGF0YSk7XG4gICAgICB0b3VjaEhpc3RvcnkubnVtYmVyQWN0aXZlVG91Y2hlcyA9IG5hdGl2ZUV2ZW50LnRvdWNoZXMubGVuZ3RoO1xuICAgICAgaWYgKHRvdWNoSGlzdG9yeS5udW1iZXJBY3RpdmVUb3VjaGVzID09PSAxKSB7XG4gICAgICAgIHRvdWNoSGlzdG9yeS5pbmRleE9mU2luZ2xlQWN0aXZlVG91Y2ggPSBuYXRpdmVFdmVudC50b3VjaGVzWzBdLmlkZW50aWZpZXI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc0VuZGlzaCh0b3BMZXZlbFR5cGUpKSB7XG4gICAgICBuYXRpdmVFdmVudC5jaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKHJlY29yZEVuZFRvdWNoRGF0YSk7XG4gICAgICB0b3VjaEhpc3RvcnkubnVtYmVyQWN0aXZlVG91Y2hlcyA9IG5hdGl2ZUV2ZW50LnRvdWNoZXMubGVuZ3RoO1xuICAgICAgaWYgKHRvdWNoSGlzdG9yeS5udW1iZXJBY3RpdmVUb3VjaGVzID09PSAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hCYW5rLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHRvdWNoVHJhY2tUb0NoZWNrID0gdG91Y2hCYW5rW2ldO1xuICAgICAgICAgIGlmICh0b3VjaFRyYWNrVG9DaGVjayAhPSBudWxsICYmIHRvdWNoVHJhY2tUb0NoZWNrLnRvdWNoQWN0aXZlKSB7XG4gICAgICAgICAgICB0b3VjaEhpc3RvcnkuaW5kZXhPZlNpbmdsZUFjdGl2ZVRvdWNoID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIHZhciBhY3RpdmVUb3VjaERhdGEgPSB0b3VjaEJhbmtbdG91Y2hIaXN0b3J5LmluZGV4T2ZTaW5nbGVBY3RpdmVUb3VjaF07XG4gICAgICAgICAgdmFyIGZvdW5kQWN0aXZlID0gYWN0aXZlVG91Y2hEYXRhICE9IG51bGwgJiYgISFhY3RpdmVUb3VjaERhdGEudG91Y2hBY3RpdmU7XG4gICAgICAgICAgIWZvdW5kQWN0aXZlID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0Nhbm5vdCBmaW5kIHNpbmdsZSBhY3RpdmUgdG91Y2gnKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdG91Y2hIaXN0b3J5OiB0b3VjaEhpc3Rvcnlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uZGVyVG91Y2hIaXN0b3J5U3RvcmU7Il19