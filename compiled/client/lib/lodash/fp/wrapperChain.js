'use strict';

var convert = require('./convert'),
    func = convert('wrapperChain', require('../wrapperChain'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL3dyYXBwZXJDaGFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBVjtJQUNBLE9BQU8sUUFBUSxjQUFSLEVBQXdCLFFBQVEsaUJBQVIsQ0FBeEIsRUFBb0QsUUFBUSxpQkFBUixDQUFwRCxDQUFQOztBQUVKLEtBQUssV0FBTCxHQUFtQixRQUFRLGVBQVIsQ0FBbkI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoid3JhcHBlckNoYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbnZlcnQgPSByZXF1aXJlKCcuL2NvbnZlcnQnKSxcbiAgICBmdW5jID0gY29udmVydCgnd3JhcHBlckNoYWluJywgcmVxdWlyZSgnLi4vd3JhcHBlckNoYWluJyksIHJlcXVpcmUoJy4vX2ZhbHNlT3B0aW9ucycpKTtcblxuZnVuYy5wbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vcGxhY2Vob2xkZXInKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuYztcbiJdfQ==