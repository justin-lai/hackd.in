'use strict';

var warning = require('fbjs/lib/warning');
warning(false,
// Require examples in this string must be split to prevent React's
// build tools from mistaking them for real requires.
// Otherwise the build tools will attempt to build a 'react-addons-{addon}' module.
'require' + "('react/addons') is deprecated. " + 'Access using require' + "('react-addons-{addon}') instead.");

module.exports = require('./lib/ReactWithAddons');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvYWRkb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQWQ7QUFDQSxRQUNFLEtBREY7Ozs7QUFLRSxZQUFZLGtDQUFaLEdBQ0Esc0JBREEsR0FDeUIsbUNBTjNCOztBQVNBLE9BQU8sT0FBUCxHQUFpQixRQUFRLHVCQUFSLENBQWpCIiwiZmlsZSI6ImFkZG9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG53YXJuaW5nKFxuICBmYWxzZSxcbiAgLy8gUmVxdWlyZSBleGFtcGxlcyBpbiB0aGlzIHN0cmluZyBtdXN0IGJlIHNwbGl0IHRvIHByZXZlbnQgUmVhY3Qnc1xuICAvLyBidWlsZCB0b29scyBmcm9tIG1pc3Rha2luZyB0aGVtIGZvciByZWFsIHJlcXVpcmVzLlxuICAvLyBPdGhlcndpc2UgdGhlIGJ1aWxkIHRvb2xzIHdpbGwgYXR0ZW1wdCB0byBidWlsZCBhICdyZWFjdC1hZGRvbnMte2FkZG9ufScgbW9kdWxlLlxuICAncmVxdWlyZScgKyBcIigncmVhY3QvYWRkb25zJykgaXMgZGVwcmVjYXRlZC4gXCIgK1xuICAnQWNjZXNzIHVzaW5nIHJlcXVpcmUnICsgXCIoJ3JlYWN0LWFkZG9ucy17YWRkb259JykgaW5zdGVhZC5cIlxuKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFdpdGhBZGRvbnMnKTtcbiJdfQ==