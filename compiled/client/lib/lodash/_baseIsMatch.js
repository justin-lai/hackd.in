'use strict';

var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSXNNYXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLGNBQWMsUUFBUSxnQkFBUixDQUFkOzs7QUFHSixJQUFJLHlCQUF5QixDQUF6QjtJQUNBLHVCQUF1QixDQUF2Qjs7Ozs7Ozs7Ozs7O0FBWUosU0FBUyxXQUFULENBQXFCLE1BQXJCLEVBQTZCLE1BQTdCLEVBQXFDLFNBQXJDLEVBQWdELFVBQWhELEVBQTREO0FBQzFELE1BQUksUUFBUSxVQUFVLE1BQVY7TUFDUixTQUFTLEtBQVQ7TUFDQSxlQUFlLENBQUMsVUFBRCxDQUh1Qzs7QUFLMUQsTUFBSSxVQUFVLElBQVYsRUFBZ0I7QUFDbEIsV0FBTyxDQUFDLE1BQUQsQ0FEVztHQUFwQjtBQUdBLFdBQVMsT0FBTyxNQUFQLENBQVQsQ0FSMEQ7QUFTMUQsU0FBTyxPQUFQLEVBQWdCO0FBQ2QsUUFBSSxPQUFPLFVBQVUsS0FBVixDQUFQLENBRFU7QUFFZCxRQUFJLFlBQUMsSUFBZ0IsS0FBSyxDQUFMLENBQWhCLEdBQ0csS0FBSyxDQUFMLE1BQVksT0FBTyxLQUFLLENBQUwsQ0FBUCxDQUFaLEdBQ0EsRUFBRSxLQUFLLENBQUwsS0FBVyxNQUFYLENBQUYsRUFDRjtBQUNKLGFBQU8sS0FBUCxDQURJO0tBSE47R0FGRjtBQVNBLFNBQU8sRUFBRSxLQUFGLEdBQVUsTUFBVixFQUFrQjtBQUN2QixXQUFPLFVBQVUsS0FBVixDQUFQLENBRHVCO0FBRXZCLFFBQUksTUFBTSxLQUFLLENBQUwsQ0FBTjtRQUNBLFdBQVcsT0FBTyxHQUFQLENBQVg7UUFDQSxXQUFXLEtBQUssQ0FBTCxDQUFYLENBSm1COztBQU12QixRQUFJLGdCQUFnQixLQUFLLENBQUwsQ0FBaEIsRUFBeUI7QUFDM0IsVUFBSSxhQUFhLFNBQWIsSUFBMEIsRUFBRSxPQUFPLE1BQVAsQ0FBRixFQUFrQjtBQUM5QyxlQUFPLEtBQVAsQ0FEOEM7T0FBaEQ7S0FERixNQUlPO0FBQ0wsVUFBSSxRQUFRLElBQUksS0FBSixFQUFSLENBREM7QUFFTCxVQUFJLFVBQUosRUFBZ0I7QUFDZCxZQUFJLFNBQVMsV0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEdBQS9CLEVBQW9DLE1BQXBDLEVBQTRDLE1BQTVDLEVBQW9ELEtBQXBELENBQVQsQ0FEVTtPQUFoQjtBQUdBLFVBQUksRUFBRSxXQUFXLFNBQVgsR0FDRSxZQUFZLFFBQVosRUFBc0IsUUFBdEIsRUFBZ0MsVUFBaEMsRUFBNEMseUJBQXlCLG9CQUF6QixFQUErQyxLQUEzRixDQURGLEdBRUUsTUFGRixDQUFGLEVBR0c7QUFDTCxlQUFPLEtBQVAsQ0FESztPQUhQO0tBVEY7R0FORjtBQXVCQSxTQUFPLElBQVAsQ0F6QzBEO0NBQTVEOztBQTRDQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiX2Jhc2VJc01hdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xudmFyIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgPSAxLFxuICAgIFBBUlRJQUxfQ09NUEFSRV9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hdGNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7QXJyYXl9IG1hdGNoRGF0YSBUaGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3MgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gbWF0Y2hEYXRhLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IGluZGV4LFxuICAgICAgbm9DdXN0b21pemVyID0gIWN1c3RvbWl6ZXI7XG5cbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuICFsZW5ndGg7XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIGlmICgobm9DdXN0b21pemVyICYmIGRhdGFbMl0pXG4gICAgICAgICAgPyBkYXRhWzFdICE9PSBvYmplY3RbZGF0YVswXV1cbiAgICAgICAgICA6ICEoZGF0YVswXSBpbiBvYmplY3QpXG4gICAgICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIHZhciBrZXkgPSBkYXRhWzBdLFxuICAgICAgICBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBzcmNWYWx1ZSA9IGRhdGFbMV07XG5cbiAgICBpZiAobm9DdXN0b21pemVyICYmIGRhdGFbMl0pIHtcbiAgICAgIGlmIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhY2sgPSBuZXcgU3RhY2s7XG4gICAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICghKHJlc3VsdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgY3VzdG9taXplciwgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyB8IFBBUlRJQUxfQ09NUEFSRV9GTEFHLCBzdGFjaylcbiAgICAgICAgICAgIDogcmVzdWx0XG4gICAgICAgICAgKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc01hdGNoO1xuIl19