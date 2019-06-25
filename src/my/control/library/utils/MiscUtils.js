sap.ui.define("my/control/library/utils/MiscUtils", ["jquery.sap.global"], function(jQuery) {
	"use strict";

	/**
	 * Contains misc utility methods
	 *
	 * @class
	 *
	 * @author sovanta AG
	 * @version ${version}
	 *
	 * @constructor
	 * @public
	 * @alias my.control.library.utils.MiscUtils
	 */
	var MiscUtils = {
		/** Returns a function, that, as long as it continues to be invoked, will not
		 * be triggered. The function will be called after it stops being called for
		 * N milliseconds. If `immediate` is passed, trigger the function on the
		 * leading edge, instead of the trailing.
		 * @public
		 */
		debounce: function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this,
					args = arguments;
				clearTimeout(timeout);
				timeout = setTimeout(function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				}, wait);
				if (immediate && !timeout) func.apply(context, args);
			};
		},

		/**
		 * Gets the absolute top/left coords of a DOM element
		 * @param elem a DOM element
		 * @returns {{top: number, left: number}}
		 * @public
		 */
		getCoordsInDocument: function(elem) {
			// crossbrowser version
			var box = elem.getBoundingClientRect();

			var body = document.body;
			var docEl = document.documentElement;

			var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
			var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

			var clientTop = docEl.clientTop || body.clientTop || 0;
			var clientLeft = docEl.clientLeft || body.clientLeft || 0;

			var top = box.top + scrollTop - clientTop;
			var left = box.left + scrollLeft - clientLeft;

			return { top: Math.round(top), left: Math.round(left) };
		},

		/**
		 * Find a non transparent background-color or background-image in the DOM parent hierarchy
		 * This alos takes into account if the ancestor element is vertically psoitioned behind the Element.
		 * @param jQueryElement The Element that needs the background of a parent
		 *
		 * @param jQueryOriginElement Element that needs the background of its underlying one
		 * @returns {string} a css 'background' (either background-color or background-image)
		 * @public
		 */
		getNonTransparentBackgroundOfAncestor: function(jQueryElement, jQueryOriginElement, bConsiderOverlapping) {
			bConsiderOverlapping = !!bConsiderOverlapping;

			jQueryOriginElement = jQueryOriginElement || jQueryElement;
			// Is current element's background color set?
			var color = jQueryElement.css("background-color");
			var computedStyle = getComputedStyle(jQueryElement.get(0));
			if (!color) {
				color = computedStyle["background-color"];
			}
			var backgroundImage = computedStyle["background-image"];
			var coordsOrigin = this.getCoordsInDocument(jQueryOriginElement.get(0));
			var coordsElement = this.getCoordsInDocument(jQueryElement.get(0));
			var bIsOverlapping = true;
			if (bConsiderOverlapping) {
				//Todo. check if this does what it is supposed to do. Test if the parent really contains (is background provider) the original element
				bIsOverlapping =
					coordsOrigin.top >= coordsElement.top &&
					coordsOrigin.top + jQueryOriginElement.height() < coordsElement.top + jQueryElement.height();
			}

			if (
				(((color !== "rgba(0, 0, 0, 0)" && color !== "transparent") || backgroundImage !== "none") && bIsOverlapping) ||
				jQueryElement.is("body") ||
				jQueryElement.parent().length === 0
			) {
				// if so then return that color
				if (backgroundImage !== "none" && backgroundImage !== "") {
					return backgroundImage;
				} else {
					return color;
				}
			}

			return this.getNonTransparentBackgroundOfAncestor(
				jQueryElement.parent(),
				jQueryOriginElement,
				bConsiderOverlapping
			);
		},

		/**
		 * Try to find a function in controller by name
		 * This is useful to enable a event like XML View binding of functions to properties
		 *
		 * @param {string} sFunctionName name of the method to find
		 * @param {object} oContext the context starting point (typically the control object) to start searching
		 * @returns {function|null} the method or null if not found
		 * @public
		 */
		findMethodInControllerByName: function(sFunctionName, oContext) {
			var oParent = oContext.getParent();
			while (oParent) {
				oParent = oParent.getParent();
				if (oParent instanceof sap.ui.core.mvc.View) {
					return oParent.getController()[sFunctionName];
				}
			}
			return null;
		},

		/**
		 * Test Pattern for a URI. This can either be URL or a local URI for icons etc. This also matches relative paths
		 * @private
		 */
		_vURITestPattern: /^((?:(https|http|sap-icon|data:|\w+)?((:\/\/)|([.\/]){1,2}))+[^.\/]+(?:\.[^.\/]+)?(?:.*)?)$/i,

		/**
		 * Validates if a string is a valid URI.
		 * @param {string} sURI string to test
		 * @returns {boolean} Whther given string is a valid uri
		 * @public
		 */
		validateURI: function(sURI) {
			return this._vURITestPattern.test(sURI);
		}
	};

	return MiscUtils;
});
