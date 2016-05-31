/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginUtils
 */

'use strict';

var EventConstants = require('./EventConstants');
var ReactErrorUtils = require('./ReactErrorUtils');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Injected dependencies:
 */

/**
 * - `Mount`: [required] Module that can convert between React dom IDs and
 *   actual node references.
 */
var injection = {
  Mount: null,
  injectMount: function injectMount(InjectedMount) {
    injection.Mount = InjectedMount;
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(InjectedMount && InjectedMount.getNode && InjectedMount.getID, 'EventPluginUtils.injection.injectMount(...): Injected Mount ' + 'module is missing getNode or getID.') : undefined;
    }
  }
};

var topLevelTypes = EventConstants.topLevelTypes;

function isEndish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseUp || topLevelType === topLevelTypes.topTouchEnd || topLevelType === topLevelTypes.topTouchCancel;
}

function isMoveish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseMove || topLevelType === topLevelTypes.topTouchMove;
}
function isStartish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseDown || topLevelType === topLevelTypes.topTouchStart;
}

var validateEventDispatches;
if (process.env.NODE_ENV !== 'production') {
  validateEventDispatches = function validateEventDispatches(event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchIDs = event._dispatchIDs;

    var listenersIsArr = Array.isArray(dispatchListeners);
    var idsIsArr = Array.isArray(dispatchIDs);
    var IDsLen = idsIsArr ? dispatchIDs.length : dispatchIDs ? 1 : 0;
    var listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;

    process.env.NODE_ENV !== 'production' ? warning(idsIsArr === listenersIsArr && IDsLen === listenersLen, 'EventPluginUtils: Invalid `event`.') : undefined;
  };
}

/**
 * Dispatch the event to the listener.
 * @param {SyntheticEvent} event SyntheticEvent to handle
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @param {function} listener Application-level callback
 * @param {string} domID DOM id to pass to the callback.
 */
function executeDispatch(event, simulated, listener, domID) {
  var type = event.type || 'unknown-event';
  event.currentTarget = injection.Mount.getNode(domID);
  if (simulated) {
    ReactErrorUtils.invokeGuardedCallbackWithCatch(type, listener, event, domID);
  } else {
    ReactErrorUtils.invokeGuardedCallback(type, listener, event, domID);
  }
  event.currentTarget = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event, simulated) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if (process.env.NODE_ENV !== 'production') {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      executeDispatch(event, simulated, dispatchListeners[i], dispatchIDs[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, simulated, dispatchListeners, dispatchIDs);
  }
  event._dispatchListeners = null;
  event._dispatchIDs = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return {?string} id of the first dispatch execution who's listener returns
 * true, or null if no listener returned true.
 */
function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if (process.env.NODE_ENV !== 'production') {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      if (dispatchListeners[i](event, dispatchIDs[i])) {
        return dispatchIDs[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchIDs)) {
      return dispatchIDs;
    }
  }
  return null;
}

/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */
function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchIDs = null;
  event._dispatchListeners = null;
  return ret;
}

/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */
function executeDirectDispatch(event) {
  if (process.env.NODE_ENV !== 'production') {
    validateEventDispatches(event);
  }
  var dispatchListener = event._dispatchListeners;
  var dispatchID = event._dispatchIDs;
  !!Array.isArray(dispatchListener) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'executeDirectDispatch(...): Invalid `event`.') : invariant(false) : undefined;
  var res = dispatchListener ? dispatchListener(event, dispatchID) : null;
  event._dispatchListeners = null;
  event._dispatchIDs = null;
  return res;
}

/**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */
function hasDispatches(event) {
  return !!event._dispatchListeners;
}

/**
 * General utilities that are useful in creating custom Event Plugins.
 */
var EventPluginUtils = {
  isEndish: isEndish,
  isMoveish: isMoveish,
  isStartish: isStartish,

  executeDirectDispatch: executeDirectDispatch,
  executeDispatchesInOrder: executeDispatchesInOrder,
  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
  hasDispatches: hasDispatches,

  getNode: function getNode(id) {
    return injection.Mount.getNode(id);
  },
  getID: function getID(node) {
    return injection.Mount.getID(node);
  },

  injection: injection
};

module.exports = EventPluginUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0V2ZW50UGx1Z2luVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQXJCO0FBQ0EsSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUF0Qjs7QUFFQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjtBQUNBLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQWQ7Ozs7Ozs7Ozs7QUFVQSxJQUFJLFlBQVk7QUFDZCxTQUFPLElBRE87QUFFZCxlQUFhLHFCQUFVLGFBQVYsRUFBeUI7QUFDcEMsY0FBVSxLQUFWLEdBQWtCLGFBQWxCO0FBQ0EsUUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDLGNBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsUUFBUSxpQkFBaUIsY0FBYyxPQUEvQixJQUEwQyxjQUFjLEtBQWhFLEVBQXVFLGlFQUFpRSxxQ0FBeEksQ0FBeEMsR0FBeU4sU0FBek47QUFDRDtBQUNGO0FBUGEsQ0FBaEI7O0FBVUEsSUFBSSxnQkFBZ0IsZUFBZSxhQUFuQzs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsWUFBbEIsRUFBZ0M7QUFDOUIsU0FBTyxpQkFBaUIsY0FBYyxVQUEvQixJQUE2QyxpQkFBaUIsY0FBYyxXQUE1RSxJQUEyRixpQkFBaUIsY0FBYyxjQUFqSTtBQUNEOztBQUVELFNBQVMsU0FBVCxDQUFtQixZQUFuQixFQUFpQztBQUMvQixTQUFPLGlCQUFpQixjQUFjLFlBQS9CLElBQStDLGlCQUFpQixjQUFjLFlBQXJGO0FBQ0Q7QUFDRCxTQUFTLFVBQVQsQ0FBb0IsWUFBcEIsRUFBa0M7QUFDaEMsU0FBTyxpQkFBaUIsY0FBYyxZQUEvQixJQUErQyxpQkFBaUIsY0FBYyxhQUFyRjtBQUNEOztBQUVELElBQUksdUJBQUo7QUFDQSxJQUFJLFFBQVEs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VUFIUzs7QUFLckIseUJBQXVCLHFCQUxGO0FBTXJCLDRCQUEwQix3QkFOTDtBQU9yQixzQ0FBb0Msa0NBUGY7QUFRckIsaUJBQWUsYUFSTTs7QUFVckIsV0FBUyxpQkFBVSxFQUFWLEVBQWM7QUFDckIsV0FBTyxVQUFVLEtBQVYsQ0FBZ0IsT0FBaEIsQ0FBd0IsRUFBeEIsQ0FBUDtBQUNELEdBWm9CO0FBYXJCLFNBQU8sZUFBVSxJQUFWLEVBQWdCO0FBQ3JCLFdBQU8sVUFBVSxLQUFWLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQVA7QUFDRCxHQWZvQjs7QUFpQnJCLGFBQVc7QUFqQlUsQ0FBdkI7O0FBb0JBLE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiRXZlbnRQbHVnaW5VdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBFdmVudFBsdWdpblV0aWxzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnRDb25zdGFudHMgPSByZXF1aXJlKCcuL0V2ZW50Q29uc3RhbnRzJyk7XG52YXIgUmVhY3RFcnJvclV0aWxzID0gcmVxdWlyZSgnLi9SZWFjdEVycm9yVXRpbHMnKTtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogSW5qZWN0ZWQgZGVwZW5kZW5jaWVzOlxuICovXG5cbi8qKlxuICogLSBgTW91bnRgOiBbcmVxdWlyZWRdIE1vZHVsZSB0aGF0IGNhbiBjb252ZXJ0IGJldHdlZW4gUmVhY3QgZG9tIElEcyBhbmRcbiAqICAgYWN0dWFsIG5vZGUgcmVmZXJlbmNlcy5cbiAqL1xudmFyIGluamVjdGlvbiA9IHtcbiAgTW91bnQ6IG51bGwsXG4gIGluamVjdE1vdW50OiBmdW5jdGlvbiAoSW5qZWN0ZWRNb3VudCkge1xuICAgIGluamVjdGlvbi5Nb3VudCA9IEluamVjdGVkTW91bnQ7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKEluamVjdGVkTW91bnQgJiYgSW5qZWN0ZWRNb3VudC5nZXROb2RlICYmIEluamVjdGVkTW91bnQuZ2V0SUQsICdFdmVudFBsdWdpblV0aWxzLmluamVjdGlvbi5pbmplY3RNb3VudCguLi4pOiBJbmplY3RlZCBNb3VudCAnICsgJ21vZHVsZSBpcyBtaXNzaW5nIGdldE5vZGUgb3IgZ2V0SUQuJykgOiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59O1xuXG52YXIgdG9wTGV2ZWxUeXBlcyA9IEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXM7XG5cbmZ1bmN0aW9uIGlzRW5kaXNoKHRvcExldmVsVHlwZSkge1xuICByZXR1cm4gdG9wTGV2ZWxUeXBlID09PSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlVXAgfHwgdG9wTGV2ZWxUeXBlID09PSB0b3BMZXZlbFR5cGVzLnRvcFRvdWNoRW5kIHx8IHRvcExldmVsVHlwZSA9PT0gdG9wTGV2ZWxUeXBlcy50b3BUb3VjaENhbmNlbDtcbn1cblxuZnVuY3Rpb24gaXNNb3ZlaXNoKHRvcExldmVsVHlwZSkge1xuICByZXR1cm4gdG9wTGV2ZWxUeXBlID09PSB0b3BMZXZlbFR5cGVzLnRvcE1vdXNlTW92ZSB8fCB0b3BMZXZlbFR5cGUgPT09IHRvcExldmVsVHlwZXMudG9wVG91Y2hNb3ZlO1xufVxuZnVuY3Rpb24gaXNTdGFydGlzaCh0b3BMZXZlbFR5cGUpIHtcbiAgcmV0dXJuIHRvcExldmVsVHlwZSA9PT0gdG9wTGV2ZWxUeXBlcy50b3BNb3VzZURvd24gfHwgdG9wTGV2ZWxUeXBlID09PSB0b3BMZXZlbFR5cGVzLnRvcFRvdWNoU3RhcnQ7XG59XG5cbnZhciB2YWxpZGF0ZUV2ZW50RGlzcGF0Y2hlcztcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlRXZlbnREaXNwYXRjaGVzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGRpc3BhdGNoTGlzdGVuZXJzID0gZXZlbnQuX2Rpc3BhdGNoTGlzdGVuZXJzO1xuICAgIHZhciBkaXNwYXRjaElEcyA9IGV2ZW50Ll9kaXNwYXRjaElEcztcblxuICAgIHZhciBsaXN0ZW5lcnNJc0FyciA9IEFycmF5LmlzQXJyYXkoZGlzcGF0Y2hMaXN0ZW5lcnMpO1xuICAgIHZhciBpZHNJc0FyciA9IEFycmF5LmlzQXJyYXkoZGlzcGF0Y2hJRHMpO1xuICAgIHZhciBJRHNMZW4gPSBpZHNJc0FyciA/IGRpc3BhdGNoSURzLmxlbmd0aCA6IGRpc3BhdGNoSURzID8gMSA6IDA7XG4gICAgdmFyIGxpc3RlbmVyc0xlbiA9IGxpc3RlbmVyc0lzQXJyID8gZGlzcGF0Y2hMaXN0ZW5lcnMubGVuZ3RoIDogZGlzcGF0Y2hMaXN0ZW5lcnMgPyAxIDogMDtcblxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGlkc0lzQXJyID09PSBsaXN0ZW5lcnNJc0FyciAmJiBJRHNMZW4gPT09IGxpc3RlbmVyc0xlbiwgJ0V2ZW50UGx1Z2luVXRpbHM6IEludmFsaWQgYGV2ZW50YC4nKSA6IHVuZGVmaW5lZDtcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCB0aGUgZXZlbnQgdG8gdGhlIGxpc3RlbmVyLlxuICogQHBhcmFtIHtTeW50aGV0aWNFdmVudH0gZXZlbnQgU3ludGhldGljRXZlbnQgdG8gaGFuZGxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNpbXVsYXRlZCBJZiB0aGUgZXZlbnQgaXMgc2ltdWxhdGVkIChjaGFuZ2VzIGV4biBiZWhhdmlvcilcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIEFwcGxpY2F0aW9uLWxldmVsIGNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gZG9tSUQgRE9NIGlkIHRvIHBhc3MgdG8gdGhlIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBleGVjdXRlRGlzcGF0Y2goZXZlbnQsIHNpbXVsYXRlZCwgbGlzdGVuZXIsIGRvbUlEKSB7XG4gIHZhciB0eXBlID0gZXZlbnQudHlwZSB8fCAndW5rbm93bi1ldmVudCc7XG4gIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBpbmplY3Rpb24uTW91bnQuZ2V0Tm9kZShkb21JRCk7XG4gIGlmIChzaW11bGF0ZWQpIHtcbiAgICBSZWFjdEVycm9yVXRpbHMuaW52b2tlR3VhcmRlZENhbGxiYWNrV2l0aENhdGNoKHR5cGUsIGxpc3RlbmVyLCBldmVudCwgZG9tSUQpO1xuICB9IGVsc2Uge1xuICAgIFJlYWN0RXJyb3JVdGlscy5pbnZva2VHdWFyZGVkQ2FsbGJhY2sodHlwZSwgbGlzdGVuZXIsIGV2ZW50LCBkb21JRCk7XG4gIH1cbiAgZXZlbnQuY3VycmVudFRhcmdldCA9IG51bGw7XG59XG5cbi8qKlxuICogU3RhbmRhcmQvc2ltcGxlIGl0ZXJhdGlvbiB0aHJvdWdoIGFuIGV2ZW50J3MgY29sbGVjdGVkIGRpc3BhdGNoZXMuXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlcihldmVudCwgc2ltdWxhdGVkKSB7XG4gIHZhciBkaXNwYXRjaExpc3RlbmVycyA9IGV2ZW50Ll9kaXNwYXRjaExpc3RlbmVycztcbiAgdmFyIGRpc3BhdGNoSURzID0gZXZlbnQuX2Rpc3BhdGNoSURzO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhbGlkYXRlRXZlbnREaXNwYXRjaGVzKGV2ZW50KTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShkaXNwYXRjaExpc3RlbmVycykpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BhdGNoTGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIC8vIExpc3RlbmVycyBhbmQgSURzIGFyZSB0d28gcGFyYWxsZWwgYXJyYXlzIHRoYXQgYXJlIGFsd2F5cyBpbiBzeW5jLlxuICAgICAgZXhlY3V0ZURpc3BhdGNoKGV2ZW50LCBzaW11bGF0ZWQsIGRpc3BhdGNoTGlzdGVuZXJzW2ldLCBkaXNwYXRjaElEc1tpXSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRpc3BhdGNoTGlzdGVuZXJzKSB7XG4gICAgZXhlY3V0ZURpc3BhdGNoKGV2ZW50LCBzaW11bGF0ZWQsIGRpc3BhdGNoTGlzdGVuZXJzLCBkaXNwYXRjaElEcyk7XG4gIH1cbiAgZXZlbnQuX2Rpc3BhdGNoTGlzdGVuZXJzID0gbnVsbDtcbiAgZXZlbnQuX2Rpc3BhdGNoSURzID0gbnVsbDtcbn1cblxuLyoqXG4gKiBTdGFuZGFyZC9zaW1wbGUgaXRlcmF0aW9uIHRocm91Z2ggYW4gZXZlbnQncyBjb2xsZWN0ZWQgZGlzcGF0Y2hlcywgYnV0IHN0b3BzXG4gKiBhdCB0aGUgZmlyc3QgZGlzcGF0Y2ggZXhlY3V0aW9uIHJldHVybmluZyB0cnVlLCBhbmQgcmV0dXJucyB0aGF0IGlkLlxuICpcbiAqIEByZXR1cm4gez9zdHJpbmd9IGlkIG9mIHRoZSBmaXJzdCBkaXNwYXRjaCBleGVjdXRpb24gd2hvJ3MgbGlzdGVuZXIgcmV0dXJuc1xuICogdHJ1ZSwgb3IgbnVsbCBpZiBubyBsaXN0ZW5lciByZXR1cm5lZCB0cnVlLlxuICovXG5mdW5jdGlvbiBleGVjdXRlRGlzcGF0Y2hlc0luT3JkZXJTdG9wQXRUcnVlSW1wbChldmVudCkge1xuICB2YXIgZGlzcGF0Y2hMaXN0ZW5lcnMgPSBldmVudC5fZGlzcGF0Y2hMaXN0ZW5lcnM7XG4gIHZhciBkaXNwYXRjaElEcyA9IGV2ZW50Ll9kaXNwYXRjaElEcztcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB2YWxpZGF0ZUV2ZW50RGlzcGF0Y2hlcyhldmVudCk7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkoZGlzcGF0Y2hMaXN0ZW5lcnMpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwYXRjaExpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICAvLyBMaXN0ZW5lcnMgYW5kIElEcyBhcmUgdHdvIHBhcmFsbGVsIGFycmF5cyB0aGF0IGFyZSBhbHdheXMgaW4gc3luYy5cbiAgICAgIGlmIChkaXNwYXRjaExpc3RlbmVyc1tpXShldmVudCwgZGlzcGF0Y2hJRHNbaV0pKSB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaElEc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoZGlzcGF0Y2hMaXN0ZW5lcnMpIHtcbiAgICBpZiAoZGlzcGF0Y2hMaXN0ZW5lcnMoZXZlbnQsIGRpc3BhdGNoSURzKSkge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoSURzO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBAc2VlIGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWVJbXBsXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWUoZXZlbnQpIHtcbiAgdmFyIHJldCA9IGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWVJbXBsKGV2ZW50KTtcbiAgZXZlbnQuX2Rpc3BhdGNoSURzID0gbnVsbDtcbiAgZXZlbnQuX2Rpc3BhdGNoTGlzdGVuZXJzID0gbnVsbDtcbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBFeGVjdXRpb24gb2YgYSBcImRpcmVjdFwiIGRpc3BhdGNoIC0gdGhlcmUgbXVzdCBiZSBhdCBtb3N0IG9uZSBkaXNwYXRjaFxuICogYWNjdW11bGF0ZWQgb24gdGhlIGV2ZW50IG9yIGl0IGlzIGNvbnNpZGVyZWQgYW4gZXJyb3IuIEl0IGRvZXNuJ3QgcmVhbGx5IG1ha2VcbiAqIHNlbnNlIGZvciBhbiBldmVudCB3aXRoIG11bHRpcGxlIGRpc3BhdGNoZXMgKGJ1YmJsZWQpIHRvIGtlZXAgdHJhY2sgb2YgdGhlXG4gKiByZXR1cm4gdmFsdWVzIGF0IGVhY2ggZGlzcGF0Y2ggZXhlY3V0aW9uLCBidXQgaXQgZG9lcyB0ZW5kIHRvIG1ha2Ugc2Vuc2Ugd2hlblxuICogZGVhbGluZyB3aXRoIFwiZGlyZWN0XCIgZGlzcGF0Y2hlcy5cbiAqXG4gKiBAcmV0dXJuIHsqfSBUaGUgcmV0dXJuIHZhbHVlIG9mIGV4ZWN1dGluZyB0aGUgc2luZ2xlIGRpc3BhdGNoLlxuICovXG5mdW5jdGlvbiBleGVjdXRlRGlyZWN0RGlzcGF0Y2goZXZlbnQpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB2YWxpZGF0ZUV2ZW50RGlzcGF0Y2hlcyhldmVudCk7XG4gIH1cbiAgdmFyIGRpc3BhdGNoTGlzdGVuZXIgPSBldmVudC5fZGlzcGF0Y2hMaXN0ZW5lcnM7XG4gIHZhciBkaXNwYXRjaElEID0gZXZlbnQuX2Rpc3BhdGNoSURzO1xuICAhIUFycmF5LmlzQXJyYXkoZGlzcGF0Y2hMaXN0ZW5lcikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnZXhlY3V0ZURpcmVjdERpc3BhdGNoKC4uLik6IEludmFsaWQgYGV2ZW50YC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gIHZhciByZXMgPSBkaXNwYXRjaExpc3RlbmVyID8gZGlzcGF0Y2hMaXN0ZW5lcihldmVudCwgZGlzcGF0Y2hJRCkgOiBudWxsO1xuICBldmVudC5fZGlzcGF0Y2hMaXN0ZW5lcnMgPSBudWxsO1xuICBldmVudC5fZGlzcGF0Y2hJRHMgPSBudWxsO1xuICByZXR1cm4gcmVzO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U3ludGhldGljRXZlbnR9IGV2ZW50XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmZiBudW1iZXIgb2YgZGlzcGF0Y2hlcyBhY2N1bXVsYXRlZCBpcyBncmVhdGVyIHRoYW4gMC5cbiAqL1xuZnVuY3Rpb24gaGFzRGlzcGF0Y2hlcyhldmVudCkge1xuICByZXR1cm4gISFldmVudC5fZGlzcGF0Y2hMaXN0ZW5lcnM7XG59XG5cbi8qKlxuICogR2VuZXJhbCB1dGlsaXRpZXMgdGhhdCBhcmUgdXNlZnVsIGluIGNyZWF0aW5nIGN1c3RvbSBFdmVudCBQbHVnaW5zLlxuICovXG52YXIgRXZlbnRQbHVnaW5VdGlscyA9IHtcbiAgaXNFbmRpc2g6IGlzRW5kaXNoLFxuICBpc01vdmVpc2g6IGlzTW92ZWlzaCxcbiAgaXNTdGFydGlzaDogaXNTdGFydGlzaCxcblxuICBleGVjdXRlRGlyZWN0RGlzcGF0Y2g6IGV4ZWN1dGVEaXJlY3REaXNwYXRjaCxcbiAgZXhlY3V0ZURpc3BhdGNoZXNJbk9yZGVyOiBleGVjdXRlRGlzcGF0Y2hlc0luT3JkZXIsXG4gIGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWU6IGV4ZWN1dGVEaXNwYXRjaGVzSW5PcmRlclN0b3BBdFRydWUsXG4gIGhhc0Rpc3BhdGNoZXM6IGhhc0Rpc3BhdGNoZXMsXG5cbiAgZ2V0Tm9kZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGluamVjdGlvbi5Nb3VudC5nZXROb2RlKGlkKTtcbiAgfSxcbiAgZ2V0SUQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGluamVjdGlvbi5Nb3VudC5nZXRJRChub2RlKTtcbiAgfSxcblxuICBpbmplY3Rpb246IGluamVjdGlvblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFBsdWdpblV0aWxzOyJdfQ==