/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 * @providesModule ReactCSSTransitionGroup
 */

'use strict';

var React = require('./React');

var assign = require('./Object.assign');

var ReactTransitionGroup = require('./ReactTransitionGroup');
var ReactCSSTransitionGroupChild = require('./ReactCSSTransitionGroupChild');

function createTransitionTimeoutPropValidator(transitionType) {
  var timeoutPropName = 'transition' + transitionType + 'Timeout';
  var enabledPropName = 'transition' + transitionType;

  return function (props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (props[timeoutPropName] == null) {
        return new Error(timeoutPropName + ' wasn\'t supplied to ReactCSSTransitionGroup: ' + 'this can cause unreliable animations and won\'t be supported in ' + 'a future version of React. See ' + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

        // If the duration isn't a number
      } else if (typeof props[timeoutPropName] !== 'number') {
          return new Error(timeoutPropName + ' must be a number (in milliseconds)');
        }
    }
  };
}

var ReactCSSTransitionGroup = React.createClass({
  displayName: 'ReactCSSTransitionGroup',

  propTypes: {
    transitionName: ReactCSSTransitionGroupChild.propTypes.name,

    transitionAppear: React.PropTypes.bool,
    transitionEnter: React.PropTypes.bool,
    transitionLeave: React.PropTypes.bool,
    transitionAppearTimeout: createTransitionTimeoutPropValidator('Appear'),
    transitionEnterTimeout: createTransitionTimeoutPropValidator('Enter'),
    transitionLeaveTimeout: createTransitionTimeoutPropValidator('Leave')
  },

  getDefaultProps: function getDefaultProps() {
    return {
      transitionAppear: false,
      transitionEnter: true,
      transitionLeave: true
    };
  },

  _wrapChild: function _wrapChild(child) {
    // We need to provide this childFactory so that
    // ReactCSSTransitionGroupChild can receive updates to name, enter, and
    // leave while it is leaving.
    return React.createElement(ReactCSSTransitionGroupChild, {
      name: this.props.transitionName,
      appear: this.props.transitionAppear,
      enter: this.props.transitionEnter,
      leave: this.props.transitionLeave,
      appearTimeout: this.props.transitionAppearTimeout,
      enterTimeout: this.props.transitionEnterTimeout,
      leaveTimeout: this.props.transitionLeaveTimeout
    }, child);
  },

  render: function render() {
    return React.createElement(ReactTransitionGroup, assign({}, this.props, { childFactory: this._wrapChild }));
  }
});

module.exports = ReactCSSTransitionGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjs7QUFFQSxJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFiOztBQUVBLElBQUksdUJBQXVCLFFBQVEsd0JBQVIsQ0FBM0I7QUFDQSxJQUFJLCtCQUErQixRQUFRLGdDQUFSLENBQW5DOztBQUVBLFNBQVMsb0NBQVQsQ0FBOEMsY0FBOUMsRUFBOEQ7QUFDNUQsTUFBSSxrQkFBa0IsZUFBZSxjQUFmLEdBQWdDLFNBQXREO0FBQ0EsTUFBSSxrQkFBa0IsZUFBZSxjQUFyQzs7QUFFQSxTQUFPLFVBQVUsS0FBVixFQUFpQjs7QUFFdEIsUUFBSSxNQUFNLGVBQU4sQ0FBSixFQUE0Qjs7QUFFMUIsVUFBSSxNQUFNLGVBQU4sS0FBMEIsSUFBOUIsRUFBb0M7QUFDbEMsZUFBTyxJQUFJLEtBQUosQ0FBVSxrQkFBa0IsZ0RBQWxCLEdBQXFFLGtFQUFyRSxHQUEwSSxpQ0FBMUksR0FBOEssa0VBQTlLLEdBQW1QLGNBQTdQLENBQVA7OztBQUdELE9BSkQsTUFJTyxJQUFJLE9BQU8sTUFBTSxlQUFOLENBQVAsS0FBa0MsUUFBdEMsRUFBZ0Q7QUFDbkQsaUJBQU8sSUFBSSxLQUFKLENBQVUsa0JBQWtCLHFDQUE1QixDQUFQO0FBQ0Q7QUFDSjtBQUNGLEdBWkQ7QUFhRDs7QUFFRCxJQUFJLDBCQUEwQixNQUFNLFdBQU4sQ0FBa0I7QUFDOUMsZUFBYSx5QkFEaUM7O0FBRzlDLGFBQVc7QUFDVCxvQkFBZ0IsNkJBQTZCLFNBQTdCLENBQXVDLElBRDlDOztBQUdULHNCQUFrQixNQUFNLFNBQU4sQ0FBZ0IsSUFIekI7QUFJVCxxQkFBaUIsTUFBTSxTQUFOLENBQWdCLElBSnhCO0FBS1QscUJBQWlCLE1BQU0sU0FBTixDQUFnQixJQUx4QjtBQU1ULDZCQUF5QixxQ0FBcUMsUUFBckMsQ0FOaEI7QUFPVCw0QkFBd0IscUNBQXFDLE9BQXJDLENBUGY7QUFRVCw0QkFBd0IscUNBQXFDLE9BQXJDO0FBUmYsR0FIbUM7O0FBYzlDLG1CQUFpQiwyQkFBWTtBQUMzQixXQUFPO0FBQ0wsd0JBQWtCLEtBRGI7QUFFTCx1QkFBaUIsSUFGWjtBQUdMLHVCQUFpQjtBQUhaLEtBQVA7QUFLRCxHQXBCNkM7O0FBc0I5QyxjQUFZLG9CQUFVLEtBQVYsRUFBaUI7Ozs7QUFJM0IsV0FBTyxNQUFNLGFBQU4sQ0FBb0IsNEJBQXBCLEVBQWtEO0FBQ3ZELFlBQU0sS0FBSyxLQUFMLENBQVcsY0FEc0M7QUFFdkQsY0FBUSxLQUFLLEtBQUwsQ0FBVyxnQkFGb0M7QUFHdkQsYUFBTyxLQUFLLEtBQUwsQ0FBVyxlQUhxQztBQUl2RCxhQUFPLEtBQUssS0FBTCxDQUFXLGVBSnFDO0FBS3ZELHFCQUFlLEtBQUssS0FBTCxDQUFXLHVCQUw2QjtBQU12RCxvQkFBYyxLQUFLLEtBQUwsQ0FBVyxzQkFOOEI7QUFPdkQsb0JBQWMsS0FBSyxLQUFMLENBQVc7QUFQOEIsS0FBbEQsRUFRSixLQVJJLENBQVA7QUFTRCxHQW5DNkM7O0FBcUM5QyxVQUFRLGtCQUFZO0FBQ2xCLFdBQU8sTUFBTSxhQUFOLENBQW9CLG9CQUFwQixFQUEwQyxPQUFPLEVBQVAsRUFBVyxLQUFLLEtBQWhCLEVBQXVCLEVBQUUsY0FBYyxLQUFLLFVBQXJCLEVBQXZCLENBQTFDLENBQVA7QUFDRDtBQXZDNkMsQ0FBbEIsQ0FBOUI7O0FBMENBLE9BQU8sT0FBUCxHQUFpQix1QkFBakIiLCJmaWxlIjoiUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAdHlwZWNoZWNrc1xuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCcuL1JlYWN0Jyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcblxudmFyIFJlYWN0VHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgnLi9SZWFjdFRyYW5zaXRpb25Hcm91cCcpO1xudmFyIFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwQ2hpbGQgPSByZXF1aXJlKCcuL1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwQ2hpbGQnKTtcblxuZnVuY3Rpb24gY3JlYXRlVHJhbnNpdGlvblRpbWVvdXRQcm9wVmFsaWRhdG9yKHRyYW5zaXRpb25UeXBlKSB7XG4gIHZhciB0aW1lb3V0UHJvcE5hbWUgPSAndHJhbnNpdGlvbicgKyB0cmFuc2l0aW9uVHlwZSArICdUaW1lb3V0JztcbiAgdmFyIGVuYWJsZWRQcm9wTmFtZSA9ICd0cmFuc2l0aW9uJyArIHRyYW5zaXRpb25UeXBlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAvLyBJZiB0aGUgdHJhbnNpdGlvbiBpcyBlbmFibGVkXG4gICAgaWYgKHByb3BzW2VuYWJsZWRQcm9wTmFtZV0pIHtcbiAgICAgIC8vIElmIG5vIHRpbWVvdXQgZHVyYXRpb24gaXMgcHJvdmlkZWRcbiAgICAgIGlmIChwcm9wc1t0aW1lb3V0UHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcih0aW1lb3V0UHJvcE5hbWUgKyAnIHdhc25cXCd0IHN1cHBsaWVkIHRvIFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwOiAnICsgJ3RoaXMgY2FuIGNhdXNlIHVucmVsaWFibGUgYW5pbWF0aW9ucyBhbmQgd29uXFwndCBiZSBzdXBwb3J0ZWQgaW4gJyArICdhIGZ1dHVyZSB2ZXJzaW9uIG9mIFJlYWN0LiBTZWUgJyArICdodHRwczovL2ZiLm1lL3JlYWN0LWFuaW1hdGlvbi10cmFuc2l0aW9uLWdyb3VwLXRpbWVvdXQgZm9yIG1vcmUgJyArICdpbmZvcm1hdGlvbi4nKTtcblxuICAgICAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXNuJ3QgYSBudW1iZXJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHByb3BzW3RpbWVvdXRQcm9wTmFtZV0gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcih0aW1lb3V0UHJvcE5hbWUgKyAnIG11c3QgYmUgYSBudW1iZXIgKGluIG1pbGxpc2Vjb25kcyknKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxudmFyIFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICB0cmFuc2l0aW9uTmFtZTogUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBDaGlsZC5wcm9wVHlwZXMubmFtZSxcblxuICAgIHRyYW5zaXRpb25BcHBlYXI6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIHRyYW5zaXRpb25FbnRlcjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgdHJhbnNpdGlvbkxlYXZlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICB0cmFuc2l0aW9uQXBwZWFyVGltZW91dDogY3JlYXRlVHJhbnNpdGlvblRpbWVvdXRQcm9wVmFsaWRhdG9yKCdBcHBlYXInKSxcbiAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0OiBjcmVhdGVUcmFuc2l0aW9uVGltZW91dFByb3BWYWxpZGF0b3IoJ0VudGVyJyksXG4gICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dDogY3JlYXRlVHJhbnNpdGlvblRpbWVvdXRQcm9wVmFsaWRhdG9yKCdMZWF2ZScpXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zaXRpb25BcHBlYXI6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkVudGVyOiB0cnVlLFxuICAgICAgdHJhbnNpdGlvbkxlYXZlOiB0cnVlXG4gICAgfTtcbiAgfSxcblxuICBfd3JhcENoaWxkOiBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAvLyBXZSBuZWVkIHRvIHByb3ZpZGUgdGhpcyBjaGlsZEZhY3Rvcnkgc28gdGhhdFxuICAgIC8vIFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwQ2hpbGQgY2FuIHJlY2VpdmUgdXBkYXRlcyB0byBuYW1lLCBlbnRlciwgYW5kXG4gICAgLy8gbGVhdmUgd2hpbGUgaXQgaXMgbGVhdmluZy5cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdENTU1RyYW5zaXRpb25Hcm91cENoaWxkLCB7XG4gICAgICBuYW1lOiB0aGlzLnByb3BzLnRyYW5zaXRpb25OYW1lLFxuICAgICAgYXBwZWFyOiB0aGlzLnByb3BzLnRyYW5zaXRpb25BcHBlYXIsXG4gICAgICBlbnRlcjogdGhpcy5wcm9wcy50cmFuc2l0aW9uRW50ZXIsXG4gICAgICBsZWF2ZTogdGhpcy5wcm9wcy50cmFuc2l0aW9uTGVhdmUsXG4gICAgICBhcHBlYXJUaW1lb3V0OiB0aGlzLnByb3BzLnRyYW5zaXRpb25BcHBlYXJUaW1lb3V0LFxuICAgICAgZW50ZXJUaW1lb3V0OiB0aGlzLnByb3BzLnRyYW5zaXRpb25FbnRlclRpbWVvdXQsXG4gICAgICBsZWF2ZVRpbWVvdXQ6IHRoaXMucHJvcHMudHJhbnNpdGlvbkxlYXZlVGltZW91dFxuICAgIH0sIGNoaWxkKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdFRyYW5zaXRpb25Hcm91cCwgYXNzaWduKHt9LCB0aGlzLnByb3BzLCB7IGNoaWxkRmFjdG9yeTogdGhpcy5fd3JhcENoaWxkIH0pKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA7Il19