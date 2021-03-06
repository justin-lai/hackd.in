'use strict';

var convert = require('./convert'),
    func = convert('isSafeInteger', require('../isSafeInteger'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL2lzU2FmZUludGVnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQVY7SUFDQSxPQUFPLFFBQVEsZUFBUixFQUF5QixRQUFRLGtCQUFSLENBQXpCLEVBQXNELFFBQVEsaUJBQVIsQ0FBdEQsQ0FBUDs7QUFFSixLQUFLLFdBQUwsR0FBbUIsUUFBUSxlQUFSLENBQW5CO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImlzU2FmZUludGVnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29udmVydCA9IHJlcXVpcmUoJy4vY29udmVydCcpLFxuICAgIGZ1bmMgPSBjb252ZXJ0KCdpc1NhZmVJbnRlZ2VyJywgcmVxdWlyZSgnLi4vaXNTYWZlSW50ZWdlcicpLCByZXF1aXJlKCcuL19mYWxzZU9wdGlvbnMnKSk7XG5cbmZ1bmMucGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL3BsYWNlaG9sZGVyJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmM7XG4iXX0=