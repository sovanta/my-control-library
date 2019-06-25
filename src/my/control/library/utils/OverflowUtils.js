sap.ui.define("my/control/library/utils/OverflowUtils", ["jquery.sap.global"], function(jQuery) {
	"use strict";

	/**
	 * Contains utility methods to ease the detection of and working with overflow behaviour in the DOM
	 *
	 * @class
	 *
	 * @author sovanta AG
	 * @version ${version}
	 *
	 * @constructor
	 * @public
	 * @alias my.control.library.utils.OverflowUtils
	 */
	var OverflowUtils = {
		/**
		 * Check a element is in view
		 * @param {Element|jQuery.Element} element Element to check if it is in view
		 * @param {Element|jQuery.Element} container Container of the element to check
		 * @param {boolean} partial if partially in view is satisfiable
		 * @returns {boolean} element is visible
		 * @public
		 */
		checkInViewVertical: function(element, container, partial) {
			container = jQuery(container);
			var contHeight = container.height();

			var elemTop = jQuery(element).offset().top - container.offset().top;
			var elemBottom = elemTop + jQuery(element).height();

			var isTotal = elemTop >= 0 && elemBottom <= contHeight;
			var isPart = ((elemTop < 0 && elemBottom > 0) || (elemTop > 0 && elemTop <= contHeight)) && partial;

			return isTotal || isPart;
		},

		/**
		 * Checks if a element in in view inside a scroll container
		 *
		 * @param {Element|jQuery.Element} element Element to check if it is in view
		 * @param {Element|jQuery.Element} container Container of the element to check
		 * @param {boolean} partial if partially in view is satisfiable
		 * @returns {boolean} element is visible
		 * @public
		 */
		checkInViewVHorizontal: function(element, container, partial) {
			container = jQuery(container);

			var contWidth = container.width();

			var elementLeft = jQuery(element).offset().left - container.offset().left;
			var elementRight = elementLeft + jQuery(element).width();

			var isTotal = elementLeft >= 0 && elementRight <= contWidth;
			var isPart = ((elementLeft < 0 && elementRight > 0) || (elementLeft > 0 && elementLeft <= contWidth)) && partial;

			return isTotal || isPart;
		},

		/**
		 * Checks if a HTML container is vertically scrollable (overflow auto/scroll and long enough content)
		 * @param {Element|jQuery.Element} oContainer Container
		 * @returns {boolean} is scrollable
		 * @public
		 */
		checkContainerIsVerticallyScrollable: function(oContainer) {
			oContainer = jQuery(oContainer);

			return oContainer[0].scrollHeight > oContainer[0].clientHeight;
		},

		/**
		 * Checks if a HTML container is horizontally scrollable (overflow auto/scroll and long enough content)
		 * @param {Element|jQuery.Element} oContainer Container
		 * @returns {boolean} is scrollable
		 * @public
		 */
		checkContainerIsHorizontallyScrollable: function(oContainer) {
			oContainer = jQuery(oContainer);

			return oContainer[0].scrollWidth > oContainer[0].clientWidth;
		}
	};

	return OverflowUtils;
});
