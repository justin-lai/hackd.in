'use strict';

var convert = require('./convert'),
    func = convert('isInteger', require('../isInteger'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL2lzSW50ZWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBVjtJQUNBLE9BQU8sUUFBUSxXQUFSLEVBQXFCLFFBQVEsY0FBUixDQUFyQixFQUE4QyxRQUFRLGlCQUFSLENBQTlDLENBQVA7O0FBRUosS0FBSyxXQUFMLEdBQW1CLFFBQVEsZUFBUixDQUFuQjtBQUNBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJpc0ludGVnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29udmVydCA9IHJlcXVpcmUoJy4vY29udmVydCcpLFxuICAgIGZ1bmMgPSBjb252ZXJ0KCdpc0ludGVnZXInLCByZXF1aXJlKCcuLi9pc0ludGVnZXInKSwgcmVxdWlyZSgnLi9fZmFsc2VPcHRpb25zJykpO1xuXG5mdW5jLnBsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9wbGFjZWhvbGRlcicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jO1xuIl19