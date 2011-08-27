/**
 * jQuery Wunderkind plugin - v0.1.1
 * http://wunderkind.hokuten.net/
 *
 * Copyright (c) 2011 David O'Trakoun (http://card.davidosomething.com/)
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
 
(function($){

$.fn.wunderkind = function(options) {
	var defaults = {}
	  , options = $.extend(defaults, options)
	  , old_rel = null;

	/**
	 * if the mouse is over a hotspot, return the hotspot name
	 */
	function getMouseArea(event, picker_div) {
		var mouse_x = event.pageX - picker_div.offset().left
		  , mouse_y = event.pageY - picker_div.offset().top;
		for (var i in options.hotspots) {			
			if (mouse_x >= options.hotspots[i].left && mouse_x <= options.hotspots[i].left + options.hotspots[i].width
				&& mouse_y >= options.hotspots[i].top && mouse_y <= options.hotspots[i].top + options.hotspots[i].height) {
				return options.hotspots[i].name;
				break;
			}
		}
		return false;
	}

	/**
	 * create the div using the placeholder as a bg
	 * return the div object
	 */
	function createPicker(parent) {
		var background = parent.find('img');			
		return $('<div />', {
			'class' : 'wunderkind--picker'
		  , 'css'   : { 'background-image' : 'url(' + background.attr('src') + ')'
					, 'height'			 : options.height
					, 'overflow'         : 'hidden'
					, 'position'         : 'relative'
					, 'width'			 : options.width						
					}
		});
	}
		
	/**
	 * create hotspots
	 */
	function createAreas(picker_div) {
		for (var i in options.hotspots) {
			var a = $('<a />', { 'rel' : options.hotspots[i].name }).addClass('wunderkind--area').css({
					'background' : 'url(' + options.hotspots[i].image + ') no-repeat'
				  , 'cursor'     : 'pointer'
				  , 'display'    : 'block'
				  , 'height'     : options.hotspots[i].height
				  , 'left'       : options.hotspots[i].left				  
				  , 'position'   : 'absolute'
				  , 'rel'        : options.hotspots[i].id
				  , 'top'        : options.hotspots[i].top
				  , 'width'      : options.hotspots[i].width					 
				  , 'z-index'    : 1
			 }).hide();
			if (typeof(options.hotspots[i].onClick) === 'string') {
				a.attr('href', options.hotspots[i].onClick);
			}
			a.appendTo(picker_div);
			if (typeof(options.hotspots[i].onClick) === 'function') {
				a.bind('click', { 'hotspot' : a }, options.hotspots[i].onClick);
			}
		}
		return picker_div;
	}
		
	/**
	 * bind mouse movement within and leaving picker
	 * toggle on states only if a new hotspot (with a new name) is entered
	 */
	function captureAreas(parent) {
		parent.bind('mousemove', function(e) {
			var area = getMouseArea(e, $(this));
			if (area !== false) { // hovered over area
				if (area !== old_rel) { // hovered over new area
					var old_area = $(this).children('a.wunderkind--area[rel="' + old_rel + '"]');
					if (old_rel) old_area.hide();
					$(this).children('a.wunderkind--area[rel="' + area + '"]').fadeIn();
					old_rel = area;
				}
			}
			else if (old_rel !== null) {
				old_rel = null;
				$(this).children('a.wunderkind--area').hide();
			}
		 }).bind('mouseleave', function(e) {
			old_rel = null;
			$(this).children('a.wunderkind--area').hide();
		});
	}

	var init = function() {
		var container = $(this)
		  , picker_div = createPicker(container);
		container.html(picker_div);
		captureAreas(createAreas(picker_div));
	};
	
	this.each(init);
	return this;
}

})(jQuery);