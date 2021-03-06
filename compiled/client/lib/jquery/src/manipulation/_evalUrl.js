"use strict";

define(["../ajax"], function (jQuery) {

	jQuery._evalUrl = function (url) {
		return jQuery.ajax({
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	};

	return jQuery._evalUrl;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24vX2V2YWxVcmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsU0FETyxDQUFSLEVBRUcsVUFBVSxNQUFWLEVBQW1COztBQUV0QixRQUFPLFFBQVAsR0FBa0IsVUFBVSxHQUFWLEVBQWdCO0FBQ2pDLFNBQU8sT0FBTyxJQUFQLENBQWE7QUFDbkIsUUFBSyxHQUFMOzs7QUFHQSxTQUFNLEtBQU47QUFDQSxhQUFVLFFBQVY7QUFDQSxVQUFPLEtBQVA7QUFDQSxXQUFRLEtBQVI7QUFDQSxhQUFVLElBQVY7R0FSTSxDQUFQLENBRGlDO0VBQWhCLENBRkk7O0FBZXRCLFFBQU8sT0FBTyxRQUFQLENBZmU7Q0FBbkIsQ0FGSCIsImZpbGUiOiJfZXZhbFVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2FqYXhcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSApIHtcblxualF1ZXJ5Ll9ldmFsVXJsID0gZnVuY3Rpb24oIHVybCApIHtcblx0cmV0dXJuIGpRdWVyeS5hamF4KCB7XG5cdFx0dXJsOiB1cmwsXG5cblx0XHQvLyBNYWtlIHRoaXMgZXhwbGljaXQsIHNpbmNlIHVzZXIgY2FuIG92ZXJyaWRlIHRoaXMgdGhyb3VnaCBhamF4U2V0dXAgKCMxMTI2NClcblx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdGRhdGFUeXBlOiBcInNjcmlwdFwiLFxuXHRcdGFzeW5jOiBmYWxzZSxcblx0XHRnbG9iYWw6IGZhbHNlLFxuXHRcdFwidGhyb3dzXCI6IHRydWVcblx0fSApO1xufTtcblxucmV0dXJuIGpRdWVyeS5fZXZhbFVybDtcblxufSApO1xuIl19