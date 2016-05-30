/**
 * Copyright 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule MetaMatchers
 */

'use strict';

/**
 * This modules adds a jasmine matcher toEqualSpecsIn that can be used to
 * compare the specs in two different "describe" functions and their result.
 * It can be used to test a test.
 */

function getRunnerWithResults(describeFunction) {
  if (describeFunction._cachedRunner) {
    // Cached result of execution. This is a convenience way to test against
    // the same authorative function multiple times.
    return describeFunction._cachedRunner;
  }
  // Patch the current global environment.
  var env = new jasmine.Env();
  // Execute the tests synchronously.
  env.updateInterval = 0;
  var outerGetEnv = jasmine.getEnv;
  jasmine.getEnv = function () {
    return env;
  };
  // TODO: Bring over matchers from the existing environment.
  var runner = env.currentRunner();
  try {
    env.describe('', describeFunction);
    env.execute();
  } finally {
    // Restore the environment.
    jasmine.getEnv = outerGetEnv;
  }
  describeFunction._cachedRunner = runner;
  return runner;
}

function compareSpec(actual, expected) {
  if (actual.results().totalCount !== expected.results().totalCount) {
    return 'Expected ' + expected.results().totalCount + ' expects, ' + 'but got ' + actual.results().totalCount + ':' + actual.getFullName();
  }
  return null;
}

function includesDescription(specs, description, startIndex) {
  for (var i = startIndex; i < specs.length; i++) {
    if (specs[i].description === description) {
      return true;
    }
  }
  return false;
}

function compareSpecs(actualSpecs, expectedSpecs) {
  for (var i = 0; i < actualSpecs.length && i < expectedSpecs.length; i++) {
    var actual = actualSpecs[i];
    var expected = expectedSpecs[i];
    if (actual.description === expected.description) {
      var errorMessage = compareSpec(actual, expected);
      if (errorMessage) {
        return errorMessage;
      }
      continue;
    } else if (includesDescription(actualSpecs, expected.description, i)) {
      return 'Did not expect the spec:' + actualSpecs[i].getFullName();
    } else {
      return 'Expected an equivalent to:' + expectedSpecs[i].getFullName();
    }
  }
  if (i < actualSpecs.length) {
    return 'Did not expect the spec:' + actualSpecs[i].getFullName();
  }
  if (i < expectedSpecs.length) {
    return 'Expected an equivalent to:' + expectedSpecs[i].getFullName();
  }
  return null;
}

function compareDescription(a, b) {
  if (a.description === b.description) {
    return 0;
  }
  return a.description < b.description ? -1 : 1;
}

function compareRunners(actual, expected) {
  return compareSpecs(actual.specs().sort(compareDescription), expected.specs().sort(compareDescription));
}

var MetaMatchers = {
  toEqualSpecsIn: function toEqualSpecsIn(expectedDescribeFunction) {
    var actualDescribeFunction = this.actual;
    if (typeof actualDescribeFunction !== 'function') {
      throw Error('toEqualSpecsIn() should be used on a describe function');
    }
    if (typeof expectedDescribeFunction !== 'function') {
      throw Error('toEqualSpecsIn() should be passed a describe function');
    }
    var actual = getRunnerWithResults(actualDescribeFunction);
    var expected = getRunnerWithResults(expectedDescribeFunction);
    var errorMessage = compareRunners(actual, expected);
    this.message = function () {
      return [errorMessage, 'The specs are equal. Expected them to be different.'];
    };
    return !errorMessage;
  }
};

module.exports = MetaMatchers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL01ldGFNYXRjaGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7OztBQVFBLFNBQVMsb0JBQVQsQ0FBOEIsZ0JBQTlCLEVBQWdEO0FBQzlDLE1BQUksaUJBQWlCLGFBQXJCLEVBQW9DOzs7QUFHbEMsV0FBTyxpQkFBaUIsYUFBeEI7QUFDRDs7QUFFRCxNQUFJLE1BQU0sSUFBSSxRQUFRLEdBQVosRUFBVjs7QUFFQSxNQUFJLGNBQUosR0FBcUIsQ0FBckI7QUFDQSxNQUFJLGNBQWMsUUFBUSxNQUExQjtBQUNBLFVBQVEsTUFBUixHQUFpQixZQUFZO0FBQzNCLFdBQU8sR0FBUDtBQUNELEdBRkQ7O0FBSUEsTUFBSSxTQUFTLElBQUksYUFBSixFQUFiO0FBQ0EsTUFBSTtBQUNGLFFBQUksUUFBSixDQUFhLEVBQWIsRUFBaUIsZ0JBQWpCO0FBQ0EsUUFBSSxPQUFKO0FBQ0QsR0FIRCxTQUdVOztBQUVSLFlBQVEsTUFBUixHQUFpQixXQUFqQjtBQUNEO0FBQ0QsbUJBQWlCLGFBQWpCLEdBQWlDLE1BQWpDO0FBQ0EsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsU0FBUyxXQUFULENBQXFCLE1BQXJCLEVBQTZCLFFBQTdCLEVBQXVDO0FBQ3JDLE1BQUksT0FBTyxPQUFQLEdBQWlCLFVBQWpCLEtBQWdDLFNBQVMsT0FBVCxHQUFtQixVQUF2RCxFQUFtRTtBQUNqRSxXQUFPLGNBQWMsU0FBUyxPQUFULEdBQW1CLFVBQWpDLEdBQThDLFlBQTlDLEdBQTZELFVBQTdELEdBQTBFLE9BQU8sT0FBUCxHQUFpQixVQUEzRixHQUF3RyxHQUF4RyxHQUE4RyxPQUFPLFdBQVAsRUFBckg7QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNEOztBQUVELFNBQVMsbUJBQVQsQ0FBNkIsS0FBN0IsRUFBb0MsV0FBcEMsRUFBaUQsVUFBakQsRUFBNkQ7QUFDM0QsT0FBSyxJQUFJLElBQUksVUFBYixFQUF5QixJQUFJLE1BQU0sTUFBbkMsRUFBMkMsR0FBM0MsRUFBZ0Q7QUFDOUMsUUFBSSxNQUFNLENBQU4sRUFBUyxXQUFULEtBQXlCLFdBQTdCLEVBQTBDO0FBQ3hDLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFTLFlBQVQsQ0FBc0IsV0FBdEIsRUFBbUMsYUFBbkMsRUFBa0Q7QUFDaEQsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFlBQVksTUFBaEIsSUFBMEIsSUFBSSxjQUFjLE1BQTVELEVBQW9FLEdBQXBFLEVBQXlFO0FBQ3ZFLFFBQUksU0FBUyxZQUFZLENBQVosQ0FBYjtBQUNBLFFBQUksV0FBVyxjQUFjLENBQWQsQ0FBZjtBQUNBLFFBQUksT0FBTyxXQUFQLEtBQXVCLFNBQVMsV0FBcEMsRUFBaUQ7QUFDL0MsVUFBSSxlQUFlLFlBQVksTUFBWixFQUFvQixRQUFwQixDQUFuQjtBQUNBLFVBQUksWUFBSixFQUFrQjtBQUNoQixlQUFPLFlBQVA7QUFDRDtBQUNEO0FBQ0QsS0FORCxNQU1PLElBQUksb0JBQW9CLFdBQXBCLEVBQWlDLFNBQVMsV0FBMUMsRUFBdUQsQ0FBdkQsQ0FBSixFQUErRDtBQUNwRSxhQUFPLDZCQUE2QixZQUFZLENBQVosRUFBZSxXQUFmLEVBQXBDO0FBQ0QsS0FGTSxNQUVBO0FBQ0wsYUFBTywrQkFBK0IsY0FBYyxDQUFkLEVBQWlCLFdBQWpCLEVBQXRDO0FBQ0Q7QUFDRjtBQUNELE1BQUksSUFBSSxZQUFZLE1BQXBCLEVBQTRCO0FBQzFCLFdBQU8sNkJBQTZCLFlBQVksQ0FBWixFQUFlLFdBQWYsRUFBcEM7QUFDRDtBQUNELE1BQUksSUFBSSxjQUFjLE1BQXRCLEVBQThCO0FBQzVCLFdBQU8sK0JBQStCLGNBQWMsQ0FBZCxFQUFpQixXQUFqQixFQUF0QztBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBUyxrQkFBVCxDQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQztBQUNoQyxNQUFJLEVBQUUsV0FBRixLQUFrQixFQUFFLFdBQXhCLEVBQXFDO0FBQ25DLFdBQU8sQ0FBUDtBQUNEO0FBQ0QsU0FBTyxFQUFFLFdBQUYsR0FBZ0IsRUFBRSxXQUFsQixHQUFnQyxDQUFDLENBQWpDLEdBQXFDLENBQTVDO0FBQ0Q7O0FBRUQsU0FBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLFFBQWhDLEVBQTBDO0FBQ3hDLFNBQU8sYUFBYSxPQUFPLEtBQVAsR0FBZSxJQUFmLENBQW9CLGtCQUFwQixDQUFiLEVBQXNELFNBQVMsS0FBVCxHQUFpQixJQUFqQixDQUFzQixrQkFBdEIsQ0FBdEQsQ0FBUDtBQUNEOztBQUVELElBQUksZUFBZTtBQUNqQixrQkFBZ0Isd0JBQVUsd0JBQVYsRUFBb0M7QUFDbEQsUUFBSSx5QkFBeUIsS0FBSyxNQUFsQztBQUNBLFFBQUksT0FBTyxzQkFBUCxLQUFrQyxVQUF0QyxFQUFrRDtBQUNoRCxZQUFNLE1BQU0sd0RBQU4sQ0FBTjtBQUNEO0FBQ0QsUUFBSSxPQUFPLHdCQUFQLEtBQW9DLFVBQXhDLEVBQW9EO0FBQ2xELFlBQU0sTUFBTSx1REFBTixDQUFOO0FBQ0Q7QUFDRCxRQUFJLFNBQVMscUJBQXFCLHNCQUFyQixDQUFiO0FBQ0EsUUFBSSxXQUFXLHFCQUFxQix3QkFBckIsQ0FBZjtBQUNBLFFBQUksZUFBZSxlQUFlLE1BQWYsRUFBdUIsUUFBdkIsQ0FBbkI7QUFDQSxTQUFLLE9BQUwsR0FBZSxZQUFZO0FBQ3pCLGFBQU8sQ0FBQyxZQUFELEVBQWUscURBQWYsQ0FBUDtBQUNELEtBRkQ7QUFHQSxXQUFPLENBQUMsWUFBUjtBQUNEO0FBaEJnQixDQUFuQjs7QUFtQkEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6Ik1ldGFNYXRjaGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgTWV0YU1hdGNoZXJzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlcyBhZGRzIGEgamFzbWluZSBtYXRjaGVyIHRvRXF1YWxTcGVjc0luIHRoYXQgY2FuIGJlIHVzZWQgdG9cbiAqIGNvbXBhcmUgdGhlIHNwZWNzIGluIHR3byBkaWZmZXJlbnQgXCJkZXNjcmliZVwiIGZ1bmN0aW9ucyBhbmQgdGhlaXIgcmVzdWx0LlxuICogSXQgY2FuIGJlIHVzZWQgdG8gdGVzdCBhIHRlc3QuXG4gKi9cblxuZnVuY3Rpb24gZ2V0UnVubmVyV2l0aFJlc3VsdHMoZGVzY3JpYmVGdW5jdGlvbikge1xuICBpZiAoZGVzY3JpYmVGdW5jdGlvbi5fY2FjaGVkUnVubmVyKSB7XG4gICAgLy8gQ2FjaGVkIHJlc3VsdCBvZiBleGVjdXRpb24uIFRoaXMgaXMgYSBjb252ZW5pZW5jZSB3YXkgdG8gdGVzdCBhZ2FpbnN0XG4gICAgLy8gdGhlIHNhbWUgYXV0aG9yYXRpdmUgZnVuY3Rpb24gbXVsdGlwbGUgdGltZXMuXG4gICAgcmV0dXJuIGRlc2NyaWJlRnVuY3Rpb24uX2NhY2hlZFJ1bm5lcjtcbiAgfVxuICAvLyBQYXRjaCB0aGUgY3VycmVudCBnbG9iYWwgZW52aXJvbm1lbnQuXG4gIHZhciBlbnYgPSBuZXcgamFzbWluZS5FbnYoKTtcbiAgLy8gRXhlY3V0ZSB0aGUgdGVzdHMgc3luY2hyb25vdXNseS5cbiAgZW52LnVwZGF0ZUludGVydmFsID0gMDtcbiAgdmFyIG91dGVyR2V0RW52ID0gamFzbWluZS5nZXRFbnY7XG4gIGphc21pbmUuZ2V0RW52ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBlbnY7XG4gIH07XG4gIC8vIFRPRE86IEJyaW5nIG92ZXIgbWF0Y2hlcnMgZnJvbSB0aGUgZXhpc3RpbmcgZW52aXJvbm1lbnQuXG4gIHZhciBydW5uZXIgPSBlbnYuY3VycmVudFJ1bm5lcigpO1xuICB0cnkge1xuICAgIGVudi5kZXNjcmliZSgnJywgZGVzY3JpYmVGdW5jdGlvbik7XG4gICAgZW52LmV4ZWN1dGUoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICAvLyBSZXN0b3JlIHRoZSBlbnZpcm9ubWVudC5cbiAgICBqYXNtaW5lLmdldEVudiA9IG91dGVyR2V0RW52O1xuICB9XG4gIGRlc2NyaWJlRnVuY3Rpb24uX2NhY2hlZFJ1bm5lciA9IHJ1bm5lcjtcbiAgcmV0dXJuIHJ1bm5lcjtcbn1cblxuZnVuY3Rpb24gY29tcGFyZVNwZWMoYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoYWN0dWFsLnJlc3VsdHMoKS50b3RhbENvdW50ICE9PSBleHBlY3RlZC5yZXN1bHRzKCkudG90YWxDb3VudCkge1xuICAgIHJldHVybiAnRXhwZWN0ZWQgJyArIGV4cGVjdGVkLnJlc3VsdHMoKS50b3RhbENvdW50ICsgJyBleHBlY3RzLCAnICsgJ2J1dCBnb3QgJyArIGFjdHVhbC5yZXN1bHRzKCkudG90YWxDb3VudCArICc6JyArIGFjdHVhbC5nZXRGdWxsTmFtZSgpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBpbmNsdWRlc0Rlc2NyaXB0aW9uKHNwZWNzLCBkZXNjcmlwdGlvbiwgc3RhcnRJbmRleCkge1xuICBmb3IgKHZhciBpID0gc3RhcnRJbmRleDsgaSA8IHNwZWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHNwZWNzW2ldLmRlc2NyaXB0aW9uID09PSBkZXNjcmlwdGlvbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY29tcGFyZVNwZWNzKGFjdHVhbFNwZWNzLCBleHBlY3RlZFNwZWNzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsU3BlY3MubGVuZ3RoICYmIGkgPCBleHBlY3RlZFNwZWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGFjdHVhbCA9IGFjdHVhbFNwZWNzW2ldO1xuICAgIHZhciBleHBlY3RlZCA9IGV4cGVjdGVkU3BlY3NbaV07XG4gICAgaWYgKGFjdHVhbC5kZXNjcmlwdGlvbiA9PT0gZXhwZWN0ZWQuZGVzY3JpcHRpb24pIHtcbiAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBjb21wYXJlU3BlYyhhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICAgIGlmIChlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSBpZiAoaW5jbHVkZXNEZXNjcmlwdGlvbihhY3R1YWxTcGVjcywgZXhwZWN0ZWQuZGVzY3JpcHRpb24sIGkpKSB7XG4gICAgICByZXR1cm4gJ0RpZCBub3QgZXhwZWN0IHRoZSBzcGVjOicgKyBhY3R1YWxTcGVjc1tpXS5nZXRGdWxsTmFtZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ0V4cGVjdGVkIGFuIGVxdWl2YWxlbnQgdG86JyArIGV4cGVjdGVkU3BlY3NbaV0uZ2V0RnVsbE5hbWUoKTtcbiAgICB9XG4gIH1cbiAgaWYgKGkgPCBhY3R1YWxTcGVjcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJ0RpZCBub3QgZXhwZWN0IHRoZSBzcGVjOicgKyBhY3R1YWxTcGVjc1tpXS5nZXRGdWxsTmFtZSgpO1xuICB9XG4gIGlmIChpIDwgZXhwZWN0ZWRTcGVjcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJ0V4cGVjdGVkIGFuIGVxdWl2YWxlbnQgdG86JyArIGV4cGVjdGVkU3BlY3NbaV0uZ2V0RnVsbE5hbWUoKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gY29tcGFyZURlc2NyaXB0aW9uKGEsIGIpIHtcbiAgaWYgKGEuZGVzY3JpcHRpb24gPT09IGIuZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gYS5kZXNjcmlwdGlvbiA8IGIuZGVzY3JpcHRpb24gPyAtMSA6IDE7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVSdW5uZXJzKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgcmV0dXJuIGNvbXBhcmVTcGVjcyhhY3R1YWwuc3BlY3MoKS5zb3J0KGNvbXBhcmVEZXNjcmlwdGlvbiksIGV4cGVjdGVkLnNwZWNzKCkuc29ydChjb21wYXJlRGVzY3JpcHRpb24pKTtcbn1cblxudmFyIE1ldGFNYXRjaGVycyA9IHtcbiAgdG9FcXVhbFNwZWNzSW46IGZ1bmN0aW9uIChleHBlY3RlZERlc2NyaWJlRnVuY3Rpb24pIHtcbiAgICB2YXIgYWN0dWFsRGVzY3JpYmVGdW5jdGlvbiA9IHRoaXMuYWN0dWFsO1xuICAgIGlmICh0eXBlb2YgYWN0dWFsRGVzY3JpYmVGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgRXJyb3IoJ3RvRXF1YWxTcGVjc0luKCkgc2hvdWxkIGJlIHVzZWQgb24gYSBkZXNjcmliZSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGV4cGVjdGVkRGVzY3JpYmVGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgRXJyb3IoJ3RvRXF1YWxTcGVjc0luKCkgc2hvdWxkIGJlIHBhc3NlZCBhIGRlc2NyaWJlIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHZhciBhY3R1YWwgPSBnZXRSdW5uZXJXaXRoUmVzdWx0cyhhY3R1YWxEZXNjcmliZUZ1bmN0aW9uKTtcbiAgICB2YXIgZXhwZWN0ZWQgPSBnZXRSdW5uZXJXaXRoUmVzdWx0cyhleHBlY3RlZERlc2NyaWJlRnVuY3Rpb24pO1xuICAgIHZhciBlcnJvck1lc3NhZ2UgPSBjb21wYXJlUnVubmVycyhhY3R1YWwsIGV4cGVjdGVkKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gW2Vycm9yTWVzc2FnZSwgJ1RoZSBzcGVjcyBhcmUgZXF1YWwuIEV4cGVjdGVkIHRoZW0gdG8gYmUgZGlmZmVyZW50LiddO1xuICAgIH07XG4gICAgcmV0dXJuICFlcnJvck1lc3NhZ2U7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0YU1hdGNoZXJzOyJdfQ==