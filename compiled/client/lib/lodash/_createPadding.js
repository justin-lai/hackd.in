'use strict';

var baseRepeat = require('./_baseRepeat'),
    baseToString = require('./_baseToString'),
    castSlice = require('./_castSlice'),
    reHasComplexSymbol = require('./_reHasComplexSymbol'),
    stringSize = require('./_stringSize'),
    stringToArray = require('./_stringToArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil;

/**
 * Creates the padding for `string` based on `length`. The `chars` string
 * is truncated if the number of characters exceeds `length`.
 *
 * @private
 * @param {number} length The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padding for `string`.
 */
function createPadding(length, chars) {
  chars = chars === undefined ? ' ' : baseToString(chars);

  var charsLength = chars.length;
  if (charsLength < 2) {
    return charsLength ? baseRepeat(chars, length) : chars;
  }
  var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
  return reHasComplexSymbol.test(chars) ? castSlice(stringToArray(result), 0, length).join('') : result.slice(0, length);
}

module.exports = createPadding;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVQYWRkaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EscUJBQXFCLFFBQVEsdUJBQVIsQ0FBckI7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7OztBQUdKLElBQUksYUFBYSxLQUFLLElBQUw7Ozs7Ozs7Ozs7O0FBV2pCLFNBQVMsYUFBVCxDQUF1QixNQUF2QixFQUErQixLQUEvQixFQUFzQztBQUNwQyxVQUFRLFVBQVUsU0FBVixHQUFzQixHQUF0QixHQUE0QixhQUFhLEtBQWIsQ0FBNUIsQ0FENEI7O0FBR3BDLE1BQUksY0FBYyxNQUFNLE1BQU4sQ0FIa0I7QUFJcEMsTUFBSSxjQUFjLENBQWQsRUFBaUI7QUFDbkIsV0FBTyxjQUFjLFdBQVcsS0FBWCxFQUFrQixNQUFsQixDQUFkLEdBQTBDLEtBQTFDLENBRFk7R0FBckI7QUFHQSxNQUFJLFNBQVMsV0FBVyxLQUFYLEVBQWtCLFdBQVcsU0FBUyxXQUFXLEtBQVgsQ0FBVCxDQUE3QixDQUFULENBUGdDO0FBUXBDLFNBQU8sbUJBQW1CLElBQW5CLENBQXdCLEtBQXhCLElBQ0gsVUFBVSxjQUFjLE1BQWQsQ0FBVixFQUFpQyxDQUFqQyxFQUFvQyxNQUFwQyxFQUE0QyxJQUE1QyxDQUFpRCxFQUFqRCxDQURHLEdBRUgsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixNQUFoQixDQUZHLENBUjZCO0NBQXRDOztBQWFBLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJfY3JlYXRlUGFkZGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlUmVwZWF0ID0gcmVxdWlyZSgnLi9fYmFzZVJlcGVhdCcpLFxuICAgIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpLFxuICAgIGNhc3RTbGljZSA9IHJlcXVpcmUoJy4vX2Nhc3RTbGljZScpLFxuICAgIHJlSGFzQ29tcGxleFN5bWJvbCA9IHJlcXVpcmUoJy4vX3JlSGFzQ29tcGxleFN5bWJvbCcpLFxuICAgIHN0cmluZ1NpemUgPSByZXF1aXJlKCcuL19zdHJpbmdTaXplJyksXG4gICAgc3RyaW5nVG9BcnJheSA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvQXJyYXknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUNlaWwgPSBNYXRoLmNlaWw7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgcGFkZGluZyBmb3IgYHN0cmluZ2AgYmFzZWQgb24gYGxlbmd0aGAuIFRoZSBgY2hhcnNgIHN0cmluZ1xuICogaXMgdHJ1bmNhdGVkIGlmIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBleGNlZWRzIGBsZW5ndGhgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIFRoZSBwYWRkaW5nIGxlbmd0aC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcnM9JyAnXSBUaGUgc3RyaW5nIHVzZWQgYXMgcGFkZGluZy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHBhZGRpbmcgZm9yIGBzdHJpbmdgLlxuICovXG5mdW5jdGlvbiBjcmVhdGVQYWRkaW5nKGxlbmd0aCwgY2hhcnMpIHtcbiAgY2hhcnMgPSBjaGFycyA9PT0gdW5kZWZpbmVkID8gJyAnIDogYmFzZVRvU3RyaW5nKGNoYXJzKTtcblxuICB2YXIgY2hhcnNMZW5ndGggPSBjaGFycy5sZW5ndGg7XG4gIGlmIChjaGFyc0xlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gY2hhcnNMZW5ndGggPyBiYXNlUmVwZWF0KGNoYXJzLCBsZW5ndGgpIDogY2hhcnM7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IGJhc2VSZXBlYXQoY2hhcnMsIG5hdGl2ZUNlaWwobGVuZ3RoIC8gc3RyaW5nU2l6ZShjaGFycykpKTtcbiAgcmV0dXJuIHJlSGFzQ29tcGxleFN5bWJvbC50ZXN0KGNoYXJzKVxuICAgID8gY2FzdFNsaWNlKHN0cmluZ1RvQXJyYXkocmVzdWx0KSwgMCwgbGVuZ3RoKS5qb2luKCcnKVxuICAgIDogcmVzdWx0LnNsaWNlKDAsIGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUGFkZGluZztcbiJdfQ==