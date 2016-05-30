'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    this.$target = $(this.options.target).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.3.6';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL2pzL2FmZml4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVNBLENBQUMsVUFBVSxDQUFWLEVBQWE7QUFDWjs7Ozs7QUFLQSxNQUFJLFFBQVEsU0FBUixLQUFRLENBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0QjtBQUN0QyxTQUFLLE9BQUwsR0FBZSxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsTUFBTSxRQUFuQixFQUE2QixPQUE3QixDQUFmOztBQUVBLFNBQUssT0FBTCxHQUFlLEVBQUUsS0FBSyxPQUFMLENBQWEsTUFBZixFQUNaLEVBRFksQ0FDVCwwQkFEUyxFQUNtQixFQUFFLEtBQUYsQ0FBUSxLQUFLLGFBQWIsRUFBNEIsSUFBNUIsQ0FEbkIsRUFFWixFQUZZLENBRVQseUJBRlMsRUFFbUIsRUFBRSxLQUFGLENBQVEsS0FBSywwQkFBYixFQUF5QyxJQUF6QyxDQUZuQixDQUFmOztBQUlBLFNBQUssUUFBTCxHQUFvQixFQUFFLE9BQUYsQ0FBcEI7QUFDQSxTQUFLLE9BQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLLEtBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLLFlBQUwsR0FBb0IsSUFBcEI7O0FBRUEsU0FBSyxhQUFMO0FBQ0QsR0FiRDs7QUFlQSxRQUFNLE9BQU4sR0FBaUIsT0FBakI7O0FBRUEsUUFBTSxLQUFOLEdBQWlCLDhCQUFqQjs7QUFFQSxRQUFNLFFBQU4sR0FBaUI7QUFDZixZQUFRLENBRE87QUFFZixZQUFRO0FBRk8sR0FBakI7O0FBS0EsUUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFVBQVUsWUFBVixFQUF3QixNQUF4QixFQUFnQyxTQUFoQyxFQUEyQyxZQUEzQyxFQUF5RDtBQUNsRixRQUFJLFlBQWUsS0FBSyxPQUFMLENBQWEsU0FBYixFQUFuQjtBQUNBLFFBQUksV0FBZSxLQUFLLFFBQUwsQ0FBYyxNQUFkLEVBQW5CO0FBQ0EsUUFB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RUFBRixDQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLEtBQXpCOzs7OztBQU1BLElBQUUsRUFBRixDQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLFlBQVk7QUFDbEMsTUFBRSxFQUFGLENBQUssS0FBTCxHQUFhLEdBQWI7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUhEOzs7OztBQVNBLElBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQVk7QUFDL0IsTUFBRSxvQkFBRixFQUF3QixJQUF4QixDQUE2QixZQUFZO0FBQ3ZDLFVBQUksT0FBTyxFQUFFLElBQUYsQ0FBWDtBQUNBLFVBQUksT0FBTyxLQUFLLElBQUwsRUFBWDs7QUFFQSxXQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsSUFBZSxFQUE3Qjs7QUFFQSxVQUFJLEtBQUssWUFBTCxJQUFxQixJQUF6QixFQUErQixLQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssWUFBMUI7QUFDL0IsVUFBSSxLQUFLLFNBQUwsSUFBcUIsSUFBekIsRUFBK0IsS0FBSyxNQUFMLENBQVksR0FBWixHQUFxQixLQUFLLFNBQTFCOztBQUUvQixhQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLElBQWxCO0FBQ0QsS0FWRDtBQVdELEdBWkQ7QUFjRCxDQXhKQSxDQXdKQyxNQXhKRCxDQUFEIiwiZmlsZSI6ImFmZml4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFmZml4LmpzIHYzLjMuNlxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb20vamF2YXNjcmlwdC8jYWZmaXhcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxNSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBRkZJWCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQWZmaXggPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBZmZpeC5ERUZBVUxUUywgb3B0aW9ucylcblxuICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy5vcHRpb25zLnRhcmdldClcbiAgICAgIC5vbignc2Nyb2xsLmJzLmFmZml4LmRhdGEtYXBpJywgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpKVxuICAgICAgLm9uKCdjbGljay5icy5hZmZpeC5kYXRhLWFwaScsICAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AsIHRoaXMpKVxuXG4gICAgdGhpcy4kZWxlbWVudCAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5hZmZpeGVkICAgICAgPSBudWxsXG4gICAgdGhpcy51bnBpbiAgICAgICAgPSBudWxsXG4gICAgdGhpcy5waW5uZWRPZmZzZXQgPSBudWxsXG5cbiAgICB0aGlzLmNoZWNrUG9zaXRpb24oKVxuICB9XG5cbiAgQWZmaXguVkVSU0lPTiAgPSAnMy4zLjYnXG5cbiAgQWZmaXguUkVTRVQgICAgPSAnYWZmaXggYWZmaXgtdG9wIGFmZml4LWJvdHRvbSdcblxuICBBZmZpeC5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDAsXG4gICAgdGFyZ2V0OiB3aW5kb3dcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uIChzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICAgICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gdGhpcy4kdGFyZ2V0LmhlaWdodCgpXG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgdGhpcy5hZmZpeGVkID09ICd0b3AnKSByZXR1cm4gc2Nyb2xsVG9wIDwgb2Zmc2V0VG9wID8gJ3RvcCcgOiBmYWxzZVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCA9PSAnYm90dG9tJykge1xuICAgICAgaWYgKG9mZnNldFRvcCAhPSBudWxsKSByZXR1cm4gKHNjcm9sbFRvcCArIHRoaXMudW5waW4gPD0gcG9zaXRpb24udG9wKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICAgIHJldHVybiAoc2Nyb2xsVG9wICsgdGFyZ2V0SGVpZ2h0IDw9IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgfVxuXG4gICAgdmFyIGluaXRpYWxpemluZyAgID0gdGhpcy5hZmZpeGVkID09IG51bGxcbiAgICB2YXIgY29sbGlkZXJUb3AgICAgPSBpbml0aWFsaXppbmcgPyBzY3JvbGxUb3AgOiBwb3NpdGlvbi50b3BcbiAgICB2YXIgY29sbGlkZXJIZWlnaHQgPSBpbml0aWFsaXppbmcgPyB0YXJnZXRIZWlnaHQgOiBoZWlnaHRcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiBzY3JvbGxUb3AgPD0gb2Zmc2V0VG9wKSByZXR1cm4gJ3RvcCdcbiAgICBpZiAob2Zmc2V0Qm90dG9tICE9IG51bGwgJiYgKGNvbGxpZGVyVG9wICsgY29sbGlkZXJIZWlnaHQgPj0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSkgcmV0dXJuICdib3R0b20nXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRQaW5uZWRPZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucGlubmVkT2Zmc2V0KSByZXR1cm4gdGhpcy5waW5uZWRPZmZzZXRcbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKS5hZGRDbGFzcygnYWZmaXgnKVxuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHJldHVybiAodGhpcy5waW5uZWRPZmZzZXQgPSBwb3NpdGlvbi50b3AgLSBzY3JvbGxUb3ApXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dCgkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcyksIDEpXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHJldHVyblxuXG4gICAgdmFyIGhlaWdodCAgICAgICA9IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0ICAgICAgID0gdGhpcy5vcHRpb25zLm9mZnNldFxuICAgIHZhciBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wXG4gICAgdmFyIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b21cbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gTWF0aC5tYXgoJChkb2N1bWVudCkuaGVpZ2h0KCksICQoZG9jdW1lbnQuYm9keSkuaGVpZ2h0KCkpXG5cbiAgICBpZiAodHlwZW9mIG9mZnNldCAhPSAnb2JqZWN0JykgICAgICAgICBvZmZzZXRCb3R0b20gPSBvZmZzZXRUb3AgPSBvZmZzZXRcbiAgICBpZiAodHlwZW9mIG9mZnNldFRvcCA9PSAnZnVuY3Rpb24nKSAgICBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wKHRoaXMuJGVsZW1lbnQpXG4gICAgaWYgKHR5cGVvZiBvZmZzZXRCb3R0b20gPT0gJ2Z1bmN0aW9uJykgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbSh0aGlzLiRlbGVtZW50KVxuXG4gICAgdmFyIGFmZml4ID0gdGhpcy5nZXRTdGF0ZShzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkICE9IGFmZml4KSB7XG4gICAgICBpZiAodGhpcy51bnBpbiAhPSBudWxsKSB0aGlzLiRlbGVtZW50LmNzcygndG9wJywgJycpXG5cbiAgICAgIHZhciBhZmZpeFR5cGUgPSAnYWZmaXgnICsgKGFmZml4ID8gJy0nICsgYWZmaXggOiAnJylcbiAgICAgIHZhciBlICAgICAgICAgPSAkLkV2ZW50KGFmZml4VHlwZSArICcuYnMuYWZmaXgnKVxuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICB0aGlzLmFmZml4ZWQgPSBhZmZpeFxuICAgICAgdGhpcy51bnBpbiA9IGFmZml4ID09ICdib3R0b20nID8gdGhpcy5nZXRQaW5uZWRPZmZzZXQoKSA6IG51bGxcblxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpXG4gICAgICAgIC5hZGRDbGFzcyhhZmZpeFR5cGUpXG4gICAgICAgIC50cmlnZ2VyKGFmZml4VHlwZS5yZXBsYWNlKCdhZmZpeCcsICdhZmZpeGVkJykgKyAnLmJzLmFmZml4JylcbiAgICB9XG5cbiAgICBpZiAoYWZmaXggPT0gJ2JvdHRvbScpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2Zmc2V0KHtcbiAgICAgICAgdG9wOiBzY3JvbGxIZWlnaHQgLSBoZWlnaHQgLSBvZmZzZXRCb3R0b21cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cblxuICAvLyBBRkZJWCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5hZmZpeCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWZmaXgnLCAoZGF0YSA9IG5ldyBBZmZpeCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWZmaXhcblxuICAkLmZuLmFmZml4ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWZmaXguQ29uc3RydWN0b3IgPSBBZmZpeFxuXG5cbiAgLy8gQUZGSVggTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFmZml4Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hZmZpeCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFGRklYIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHNweS5kYXRhKClcblxuICAgICAgZGF0YS5vZmZzZXQgPSBkYXRhLm9mZnNldCB8fCB7fVxuXG4gICAgICBpZiAoZGF0YS5vZmZzZXRCb3R0b20gIT0gbnVsbCkgZGF0YS5vZmZzZXQuYm90dG9tID0gZGF0YS5vZmZzZXRCb3R0b21cbiAgICAgIGlmIChkYXRhLm9mZnNldFRvcCAgICAhPSBudWxsKSBkYXRhLm9mZnNldC50b3AgICAgPSBkYXRhLm9mZnNldFRvcFxuXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCBkYXRhKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcbiJdfQ==