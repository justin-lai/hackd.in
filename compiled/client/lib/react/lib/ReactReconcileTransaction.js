/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactReconcileTransaction
 * @typechecks static-only
 */

'use strict';

var CallbackQueue = require('./CallbackQueue');
var PooledClass = require('./PooledClass');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactDOMFeatureFlags = require('./ReactDOMFeatureFlags');
var ReactInputSelection = require('./ReactInputSelection');
var Transaction = require('./Transaction');

var assign = require('./Object.assign');

/**
 * Ensures that, when possible, the selection range (currently selected text
 * input) is not disturbed by performing the transaction.
 */
var SELECTION_RESTORATION = {
  /**
   * @return {Selection} Selection information.
   */
  initialize: ReactInputSelection.getSelectionInformation,
  /**
   * @param {Selection} sel Selection information returned from `initialize`.
   */
  close: ReactInputSelection.restoreSelection
};

/**
 * Suppresses events (blur/focus) that could be inadvertently dispatched due to
 * high level DOM manipulations (like temporarily removing a text input from the
 * DOM).
 */
var EVENT_SUPPRESSION = {
  /**
   * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
   * the reconciliation.
   */
  initialize: function initialize() {
    var currentlyEnabled = ReactBrowserEventEmitter.isEnabled();
    ReactBrowserEventEmitter.setEnabled(false);
    return currentlyEnabled;
  },

  /**
   * @param {boolean} previouslyEnabled Enabled status of
   *   `ReactBrowserEventEmitter` before the reconciliation occurred. `close`
   *   restores the previous value.
   */
  close: function close(previouslyEnabled) {
    ReactBrowserEventEmitter.setEnabled(previouslyEnabled);
  }
};

/**
 * Provides a queue for collecting `componentDidMount` and
 * `componentDidUpdate` callbacks during the the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function initialize() {
    this.reactMountReady.reset();
  },

  /**
   * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
   */
  close: function close() {
    this.reactMountReady.notifyAll();
  }
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING];

/**
 * Currently:
 * - The order that these are listed in the transaction is critical:
 * - Suppresses events.
 * - Restores selection range.
 *
 * Future:
 * - Restore document/overflow scroll positions that were unintentionally
 *   modified via DOM insertions above the top viewport boundary.
 * - Implement/integrate with customized constraint based layout system and keep
 *   track of which dimensions must be remeasured.
 *
 * @class ReactReconcileTransaction
 */
function ReactReconcileTransaction(forceHTML) {
  this.reinitializeTransaction();
  // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactTextComponent` checks it in `mountComponent`.`
  this.renderToStaticMarkup = false;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.useCreateElement = !forceHTML && ReactDOMFeatureFlags.useCreateElement;
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap procedures.
   *   TODO: convert to array<TransactionWrapper>
   */
  getTransactionWrappers: function getTransactionWrappers() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function getReactMountReady() {
    return this.reactMountReady;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be reused.
   */
  destructor: function destructor() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;
  }
};

assign(ReactReconcileTransaction.prototype, Transaction.Mixin, Mixin);

PooledClass.addPoolingTo(ReactReconcileTransaction);

module.exports = ReactReconcileTransaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBWUE7O0FBRUEsSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFwQjtBQUNBLElBQUksY0FBYyxRQUFRLGVBQVIsQ0FBbEI7QUFDQSxJQUFJLDJCQUEyQixRQUFRLDRCQUFSLENBQS9CO0FBQ0EsSUFBSSx1QkFBdUIsUUFBUSx3QkFBUixDQUEzQjtBQUNBLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBMUI7QUFDQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQWI7Ozs7OztBQU1BLElBQUksd0JBQXdCOzs7O0FBSTFCLGNBQVksb0JBQW9CLHVCQUpOOzs7O0FBUTFCLFNBQU8sb0JBQW9CO0FBUkQsQ0FBNUI7Ozs7Ozs7QUFnQkEsSUFBSSxvQkFBb0I7Ozs7O0FBS3RCLGNBQVksc0JBQVk7QUFDdEIsUUFBSSxtQkFBbUIseUJBQXlCLFNBQXpCLEVBQXZCO0FBQ0EsNkJBQXlCLFVBQXpCLENBQW9DLEtBQXBDO0FBQ0EsV0FBTyxnQkFBUDtBQUNELEdBVHFCOzs7Ozs7O0FBZ0J0QixTQUFPLGVBQVUsaUJBQVYsRUFBNkI7QUFDbEMsNkJBQXlCLFVBQXpCLENBQW9DLGlCQUFwQztBQUNEO0FBbEJxQixDQUF4Qjs7Ozs7O0FBeUJBLElBQUksd0JBQXdCOzs7O0FBSTFCLGNBQVksc0JBQVk7QUFDdEIsU0FBSyxlQUFMLENBQXFCLEtBQXJCO0FBQ0QsR0FOeUI7Ozs7O0FBVzFCLFNBQU8saUJBQVk7QUFDakIsU0FBSyxlQUFMLENBQXFCLFNBQXJCO0FBQ0Q7QUFieUIsQ0FBNUI7Ozs7Ozs7QUFxQkEsSUFBSSx1QkFBdUIsQ0FBQyxxQkFBRCxFQUF3QixpQkFBeEIsRUFBMkMscUJBQTNDLENBQTNCOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLFNBQVMseUJBQVQsQ0FBbUMsU0FBbkMsRUFBOEM7QUFDNUMsT0FBSyx1QkFBTDs7Ozs7O0FBTUEsT0FBSyxvQkFBTCxHQUE0QixLQUE1QjtBQUNBLE9BQUssZUFBTCxHQUF1QixjQUFjLFNBQWQsQ0FBd0IsSUFBeEIsQ0FBdkI7QUFDQSxPQUFLLGdCQUFMLEdBQXdCLENBQUMsU0FBRCxJQUFjLHFCQUFxQixnQkFBM0Q7QUFDRDs7QUFFRCxJQUFJLFFBQVE7Ozs7Ozs7O0FBUVYsMEJBQXdCLGtDQUFZO0FBQ2xDLFdBQU8sb0JBQVA7QUFDRCxHQVZTOzs7OztBQWVWLHNCQUFvQiw4QkFBWTtBQUM5QixXQUFPLEtBQUssZUFBWjtBQUNELEdBakJTOzs7Ozs7QUF1QlYsY0FBWSxzQkFBWTtBQUN0QixrQkFBYyxPQUFkLENBQXNCLEtBQUssZUFBM0I7QUFDQSxTQUFLLGVBQUwsR0FBdUIsSUFBdkI7QUFDRDtBQTFCUyxDQUFaOztBQTZCQSxPQUFPLDBCQUEwQixTQUFqQyxFQUE0QyxZQUFZLEtBQXhELEVBQStELEtBQS9EOztBQUVBLFlBQVksWUFBWixDQUF5Qix5QkFBekI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLHlCQUFqQiIsImZpbGUiOiJSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb25cbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FsbGJhY2tRdWV1ZSA9IHJlcXVpcmUoJy4vQ2FsbGJhY2tRdWV1ZScpO1xudmFyIFBvb2xlZENsYXNzID0gcmVxdWlyZSgnLi9Qb29sZWRDbGFzcycpO1xudmFyIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyJyk7XG52YXIgUmVhY3RET01GZWF0dXJlRmxhZ3MgPSByZXF1aXJlKCcuL1JlYWN0RE9NRmVhdHVyZUZsYWdzJyk7XG52YXIgUmVhY3RJbnB1dFNlbGVjdGlvbiA9IHJlcXVpcmUoJy4vUmVhY3RJbnB1dFNlbGVjdGlvbicpO1xudmFyIFRyYW5zYWN0aW9uID0gcmVxdWlyZSgnLi9UcmFuc2FjdGlvbicpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0LCB3aGVuIHBvc3NpYmxlLCB0aGUgc2VsZWN0aW9uIHJhbmdlIChjdXJyZW50bHkgc2VsZWN0ZWQgdGV4dFxuICogaW5wdXQpIGlzIG5vdCBkaXN0dXJiZWQgYnkgcGVyZm9ybWluZyB0aGUgdHJhbnNhY3Rpb24uXG4gKi9cbnZhciBTRUxFQ1RJT05fUkVTVE9SQVRJT04gPSB7XG4gIC8qKlxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb259IFNlbGVjdGlvbiBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGluaXRpYWxpemU6IFJlYWN0SW5wdXRTZWxlY3Rpb24uZ2V0U2VsZWN0aW9uSW5mb3JtYXRpb24sXG4gIC8qKlxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbn0gc2VsIFNlbGVjdGlvbiBpbmZvcm1hdGlvbiByZXR1cm5lZCBmcm9tIGBpbml0aWFsaXplYC5cbiAgICovXG4gIGNsb3NlOiBSZWFjdElucHV0U2VsZWN0aW9uLnJlc3RvcmVTZWxlY3Rpb25cbn07XG5cbi8qKlxuICogU3VwcHJlc3NlcyBldmVudHMgKGJsdXIvZm9jdXMpIHRoYXQgY291bGQgYmUgaW5hZHZlcnRlbnRseSBkaXNwYXRjaGVkIGR1ZSB0b1xuICogaGlnaCBsZXZlbCBET00gbWFuaXB1bGF0aW9ucyAobGlrZSB0ZW1wb3JhcmlseSByZW1vdmluZyBhIHRleHQgaW5wdXQgZnJvbSB0aGVcbiAqIERPTSkuXG4gKi9cbnZhciBFVkVOVF9TVVBQUkVTU0lPTiA9IHtcbiAgLyoqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRoZSBlbmFibGVkIHN0YXR1cyBvZiBgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyYCBiZWZvcmVcbiAgICogdGhlIHJlY29uY2lsaWF0aW9uLlxuICAgKi9cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyZW50bHlFbmFibGVkID0gUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLmlzRW5hYmxlZCgpO1xuICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5zZXRFbmFibGVkKGZhbHNlKTtcbiAgICByZXR1cm4gY3VycmVudGx5RW5hYmxlZDtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtib29sZWFufSBwcmV2aW91c2x5RW5hYmxlZCBFbmFibGVkIHN0YXR1cyBvZlxuICAgKiAgIGBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXJgIGJlZm9yZSB0aGUgcmVjb25jaWxpYXRpb24gb2NjdXJyZWQuIGBjbG9zZWBcbiAgICogICByZXN0b3JlcyB0aGUgcHJldmlvdXMgdmFsdWUuXG4gICAqL1xuICBjbG9zZTogZnVuY3Rpb24gKHByZXZpb3VzbHlFbmFibGVkKSB7XG4gICAgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLnNldEVuYWJsZWQocHJldmlvdXNseUVuYWJsZWQpO1xuICB9XG59O1xuXG4vKipcbiAqIFByb3ZpZGVzIGEgcXVldWUgZm9yIGNvbGxlY3RpbmcgYGNvbXBvbmVudERpZE1vdW50YCBhbmRcbiAqIGBjb21wb25lbnREaWRVcGRhdGVgIGNhbGxiYWNrcyBkdXJpbmcgdGhlIHRoZSB0cmFuc2FjdGlvbi5cbiAqL1xudmFyIE9OX0RPTV9SRUFEWV9RVUVVRUlORyA9IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBpbnRlcm5hbCBgb25ET01SZWFkeWAgcXVldWUuXG4gICAqL1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZWFjdE1vdW50UmVhZHkucmVzZXQoKTtcbiAgfSxcblxuICAvKipcbiAgICogQWZ0ZXIgRE9NIGlzIGZsdXNoZWQsIGludm9rZSBhbGwgcmVnaXN0ZXJlZCBgb25ET01SZWFkeWAgY2FsbGJhY2tzLlxuICAgKi9cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlYWN0TW91bnRSZWFkeS5ub3RpZnlBbGwoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBFeGVjdXRlZCB3aXRoaW4gdGhlIHNjb3BlIG9mIHRoZSBgVHJhbnNhY3Rpb25gIGluc3RhbmNlLiBDb25zaWRlciB0aGVzZSBhc1xuICogYmVpbmcgbWVtYmVyIG1ldGhvZHMsIGJ1dCB3aXRoIGFuIGltcGxpZWQgb3JkZXJpbmcgd2hpbGUgYmVpbmcgaXNvbGF0ZWQgZnJvbVxuICogZWFjaCBvdGhlci5cbiAqL1xudmFyIFRSQU5TQUNUSU9OX1dSQVBQRVJTID0gW1NFTEVDVElPTl9SRVNUT1JBVElPTiwgRVZFTlRfU1VQUFJFU1NJT04sIE9OX0RPTV9SRUFEWV9RVUVVRUlOR107XG5cbi8qKlxuICogQ3VycmVudGx5OlxuICogLSBUaGUgb3JkZXIgdGhhdCB0aGVzZSBhcmUgbGlzdGVkIGluIHRoZSB0cmFuc2FjdGlvbiBpcyBjcml0aWNhbDpcbiAqIC0gU3VwcHJlc3NlcyBldmVudHMuXG4gKiAtIFJlc3RvcmVzIHNlbGVjdGlvbiByYW5nZS5cbiAqXG4gKiBGdXR1cmU6XG4gKiAtIFJlc3RvcmUgZG9jdW1lbnQvb3ZlcmZsb3cgc2Nyb2xsIHBvc2l0aW9ucyB0aGF0IHdlcmUgdW5pbnRlbnRpb25hbGx5XG4gKiAgIG1vZGlmaWVkIHZpYSBET00gaW5zZXJ0aW9ucyBhYm92ZSB0aGUgdG9wIHZpZXdwb3J0IGJvdW5kYXJ5LlxuICogLSBJbXBsZW1lbnQvaW50ZWdyYXRlIHdpdGggY3VzdG9taXplZCBjb25zdHJhaW50IGJhc2VkIGxheW91dCBzeXN0ZW0gYW5kIGtlZXBcbiAqICAgdHJhY2sgb2Ygd2hpY2ggZGltZW5zaW9ucyBtdXN0IGJlIHJlbWVhc3VyZWQuXG4gKlxuICogQGNsYXNzIFJlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb25cbiAqL1xuZnVuY3Rpb24gUmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbihmb3JjZUhUTUwpIHtcbiAgdGhpcy5yZWluaXRpYWxpemVUcmFuc2FjdGlvbigpO1xuICAvLyBPbmx5IHNlcnZlci1zaWRlIHJlbmRlcmluZyByZWFsbHkgbmVlZHMgdGhpcyBvcHRpb24gKHNlZVxuICAvLyBgUmVhY3RTZXJ2ZXJSZW5kZXJpbmdgKSwgYnV0IHNlcnZlci1zaWRlIHVzZXNcbiAgLy8gYFJlYWN0U2VydmVyUmVuZGVyaW5nVHJhbnNhY3Rpb25gIGluc3RlYWQuIFRoaXMgb3B0aW9uIGlzIGhlcmUgc28gdGhhdCBpdCdzXG4gIC8vIGFjY2Vzc2libGUgYW5kIGRlZmF1bHRzIHRvIGZhbHNlIHdoZW4gYFJlYWN0RE9NQ29tcG9uZW50YCBhbmRcbiAgLy8gYFJlYWN0VGV4dENvbXBvbmVudGAgY2hlY2tzIGl0IGluIGBtb3VudENvbXBvbmVudGAuYFxuICB0aGlzLnJlbmRlclRvU3RhdGljTWFya3VwID0gZmFsc2U7XG4gIHRoaXMucmVhY3RNb3VudFJlYWR5ID0gQ2FsbGJhY2tRdWV1ZS5nZXRQb29sZWQobnVsbCk7XG4gIHRoaXMudXNlQ3JlYXRlRWxlbWVudCA9ICFmb3JjZUhUTUwgJiYgUmVhY3RET01GZWF0dXJlRmxhZ3MudXNlQ3JlYXRlRWxlbWVudDtcbn1cblxudmFyIE1peGluID0ge1xuICAvKipcbiAgICogQHNlZSBUcmFuc2FjdGlvblxuICAgKiBAYWJzdHJhY3RcbiAgICogQGZpbmFsXG4gICAqIEByZXR1cm4ge2FycmF5PG9iamVjdD59IExpc3Qgb2Ygb3BlcmF0aW9uIHdyYXAgcHJvY2VkdXJlcy5cbiAgICogICBUT0RPOiBjb252ZXJ0IHRvIGFycmF5PFRyYW5zYWN0aW9uV3JhcHBlcj5cbiAgICovXG4gIGdldFRyYW5zYWN0aW9uV3JhcHBlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gVFJBTlNBQ1RJT05fV1JBUFBFUlM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge29iamVjdH0gVGhlIHF1ZXVlIHRvIGNvbGxlY3QgYG9uRE9NUmVhZHlgIGNhbGxiYWNrcyB3aXRoLlxuICAgKi9cbiAgZ2V0UmVhY3RNb3VudFJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhY3RNb3VudFJlYWR5O1xuICB9LFxuXG4gIC8qKlxuICAgKiBgUG9vbGVkQ2xhc3NgIGxvb2tzIGZvciB0aGlzLCBhbmQgd2lsbCBpbnZva2UgdGhpcyBiZWZvcmUgYWxsb3dpbmcgdGhpc1xuICAgKiBpbnN0YW5jZSB0byBiZSByZXVzZWQuXG4gICAqL1xuICBkZXN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgQ2FsbGJhY2tRdWV1ZS5yZWxlYXNlKHRoaXMucmVhY3RNb3VudFJlYWR5KTtcbiAgICB0aGlzLnJlYWN0TW91bnRSZWFkeSA9IG51bGw7XG4gIH1cbn07XG5cbmFzc2lnbihSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9uLnByb3RvdHlwZSwgVHJhbnNhY3Rpb24uTWl4aW4sIE1peGluKTtcblxuUG9vbGVkQ2xhc3MuYWRkUG9vbGluZ1RvKFJlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb247Il19