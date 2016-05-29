'use strict';

var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function (object) {
    var objValue = get(object, path);
    return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLE1BQU0sUUFBUSxPQUFSLENBQU47SUFDQSxRQUFRLFFBQVEsU0FBUixDQUFSO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLHFCQUFxQixRQUFRLHVCQUFSLENBQXJCO0lBQ0EsMEJBQTBCLFFBQVEsNEJBQVIsQ0FBMUI7SUFDQSxRQUFRLFFBQVEsVUFBUixDQUFSOzs7QUFHSixJQUFJLHlCQUF5QixDQUF6QjtJQUNBLHVCQUF1QixDQUF2Qjs7Ozs7Ozs7OztBQVVKLFNBQVMsbUJBQVQsQ0FBNkIsSUFBN0IsRUFBbUMsUUFBbkMsRUFBNkM7QUFDM0MsTUFBSSxNQUFNLElBQU4sS0FBZSxtQkFBbUIsUUFBbkIsQ0FBZixFQUE2QztBQUMvQyxXQUFPLHdCQUF3QixNQUFNLElBQU4sQ0FBeEIsRUFBcUMsUUFBckMsQ0FBUCxDQUQrQztHQUFqRDtBQUdBLFNBQU8sVUFBUyxNQUFULEVBQWlCO0FBQ3RCLFFBQUksV0FBVyxJQUFJLE1BQUosRUFBWSxJQUFaLENBQVgsQ0FEa0I7QUFFdEIsV0FBTyxRQUFDLEtBQWEsU0FBYixJQUEwQixhQUFhLFFBQWIsR0FDOUIsTUFBTSxNQUFOLEVBQWMsSUFBZCxDQURHLEdBRUgsWUFBWSxRQUFaLEVBQXNCLFFBQXRCLEVBQWdDLFNBQWhDLEVBQTJDLHlCQUF5QixvQkFBekIsQ0FGeEMsQ0FGZTtHQUFqQixDQUpvQztDQUE3Qzs7QUFZQSxPQUFPLE9BQVAsR0FBaUIsbUJBQWpCIiwiZmlsZSI6Il9iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKSxcbiAgICBnZXQgPSByZXF1aXJlKCcuL2dldCcpLFxuICAgIGhhc0luID0gcmVxdWlyZSgnLi9oYXNJbicpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBVTk9SREVSRURfQ09NUEFSRV9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc1Byb3BlcnR5YCB3aGljaCBkb2Vzbid0IGNsb25lIGBzcmNWYWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgaWYgKGlzS2V5KHBhdGgpICYmIGlzU3RyaWN0Q29tcGFyYWJsZShzcmNWYWx1ZSkpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUodG9LZXkocGF0aCksIHNyY1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIG9ialZhbHVlID0gZ2V0KG9iamVjdCwgcGF0aCk7XG4gICAgcmV0dXJuIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9ialZhbHVlID09PSBzcmNWYWx1ZSlcbiAgICAgID8gaGFzSW4ob2JqZWN0LCBwYXRoKVxuICAgICAgOiBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIHVuZGVmaW5lZCwgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyB8IFBBUlRJQUxfQ09NUEFSRV9GTEFHKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlc1Byb3BlcnR5O1xuIl19