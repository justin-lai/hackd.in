'use strict';

var convert = require('./convert'),
    func = convert('values', require('../values'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL3ZhbHVlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBVjtJQUNBLE9BQU8sUUFBUSxRQUFSLEVBQWtCLFFBQVEsV0FBUixDQUFsQixFQUF3QyxRQUFRLGlCQUFSLENBQXhDLENBQVA7O0FBRUosS0FBSyxXQUFMLEdBQW1CLFFBQVEsZUFBUixDQUFuQjtBQUNBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJ2YWx1ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29udmVydCA9IHJlcXVpcmUoJy4vY29udmVydCcpLFxuICAgIGZ1bmMgPSBjb252ZXJ0KCd2YWx1ZXMnLCByZXF1aXJlKCcuLi92YWx1ZXMnKSwgcmVxdWlyZSgnLi9fZmFsc2VPcHRpb25zJykpO1xuXG5mdW5jLnBsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9wbGFjZWhvbGRlcicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jO1xuIl19