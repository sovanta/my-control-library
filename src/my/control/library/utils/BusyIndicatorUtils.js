sap.ui.define(
	["jquery.sap.global", "sap/ui/core/BusyIndicatorUtils", "../library"],
	function(jQuery, CoreBusyIndicatorUtils, library) {
		"use strict";

		var BusyIndicatorType = library.BusyIndicatorType;

		// Static class

		/**
		 * @alias my.control.library.utils.BusyIndicatorUtils
		 * @private
		 */
		var BusyIndicatorUtils = jQuery.extend(true, {}, CoreBusyIndicatorUtils);

		BusyIndicatorUtils.CSS_BASE = "myControlLibrary_IBusyIndicator";

		/**
		 * Returns the HTML content for the busy indicator
		 * styling + animation: LocalBusyIndicator.less
		 *
		 * @param {string} sBusyIndicatorId the actual DOM ID which will be used for
		 *                     the busy indicator content
		 * @param {String} sSize either "Large" or "Medium". Other sizes will be mapped to "Medium"
		 * œparam {my.control.library.BusyIndicatorType} sIndicatorType defines the Type of BusyIndicator that should be rendered
		 * @returns {DOM.element} the element for the busy indicator
		 */
		BusyIndicatorUtils.getElement = function(sBusyIndicatorId, sSize, sIndicatorType) {
			//default size is medium
			var sSizeClass = "sapUiLocalBusyIndicatorSizeMedium";

			if (sSize === "Large") {
				sSizeClass = "sapUiLocalBusyIndicatorSizeBig";
			}

			var oContainer = document.createElement("div");
			oContainer.className =
				"sapUiLocalBusyIndicator " + sSizeClass + " sapUiLocalBusyIndicatorFade " + BusyIndicatorUtils.CSS_BASE;
			oContainer.setAttribute("role", "progressbar");
			oContainer.setAttribute("aria-valuemin", "0");
			oContainer.setAttribute("aria-valuemax", "100");
			oContainer.setAttribute("alt", "");
			oContainer.setAttribute("tabIndex", "0");

			// set title for screen reader
			var oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");
			var sTitle = oResBundle.getText("BUSY_TEXT");
			oContainer.setAttribute("title", sTitle);

			// determine automation size class
			var oAnimation = document.createElement("div");
			oAnimation.className = "sapUiLocalBusyIndicatorAnimation sapUiLocalBusyIndicatorAnimStandard";
			this._addTypeDependantChildren(sBusyIndicatorId, sIndicatorType, oAnimation);

			oContainer.appendChild(oAnimation);

			return oContainer;
		};

		/**
		 * Adds the BusyIndicator to the given control.
		 *
		 * @param {jQuery} $control a jQuery DOM instance to which the busy
		 *                     indicator is added
		 * @param {string} sBusyIndicatorId the actual DOM ID which will be used for
		 *                     the busy indicator content
		 * @param {sap.ui.core.BusyIndicatorSize} sSize either "Auto", "Large", "Medium" or "Small", determines the size of the
		 *                     indicator, default is "Medium"
		 * @param {my.control.library.BusyIndicatorType} sIndicatorType defines the Type of BusyIndicator that should be rendered
		 * @returns {object} a jQuery object for the busy indicator
		 */
		BusyIndicatorUtils.addHTML = function($control, sBusyIndicatorId, sSize, sIndicatorType) {
			var oElement = BusyIndicatorUtils.getElement(sBusyIndicatorId, sSize, sIndicatorType),
				sSizeClass = "sapUiLocalBusyIndicatorAnimation sapUiLocalBusyIndicatorAnimStandard",
				oAnimation = oElement.children[0];

			oElement.id = sBusyIndicatorId;

			var oDomRef = $control.get(0);
			oDomRef.appendChild(oElement);
			oDomRef.className +=
				" sapUiLocalBusy " +
				BusyIndicatorUtils.CSS_BASE +
				"_Type_" +
				sIndicatorType +
				" " +
				BusyIndicatorUtils.CSS_BASE +
				"_Size_" +
				sSize;

			// handle animation size
			if (sSize === sap.ui.core.BusyIndicatorSize.Small) {
				sSizeClass = "sapUiLocalBusyIndicatorAnimation sapUiLocalBusyIndicatorAnimSmall";
			} else if (sSize === sap.ui.core.BusyIndicatorSize.Auto) {
				//set standard animation for width calculation
				oAnimation.className = sSizeClass;
				var iWidth = oAnimation.offsetWidth;

				// We can only determine the actual animation after the browser has
				// calculated the size of the indicator we need to know the pixel-size of
				// 3rem, under which the indicator will animate differently
				if ($control[0].offsetWidth < iWidth) {
					sSizeClass = "sapUiLocalBusyIndicatorAnimation sapUiLocalBusyIndicatorAnimSmall";
				}
			}
			oAnimation.className = sSizeClass;

			//Set the actual DOM Element to 'aria-busy'
			$control.attr("aria-busy", true);

			return jQuery(oElement);
		};

		/**
		 * Adds Child depending on which Busy Indicator Type should be rendered
		 * @param sBusyIndicatorId
		 * @param sIndicatorType
		 * @param oAnimation
		 * @private
		 */
		BusyIndicatorUtils._addTypeDependantChildren = function(sBusyIndicatorId, sIndicatorType, oAnimation) {
			switch (sIndicatorType) {
				case BusyIndicatorType.Spinner:
					var sSvgNS = "http://www.w3.org/2000/svg",
						domOuterDiv = document.createElement("div"),
						svgSpinner = document.createElementNS(sSvgNS, "svg"),
						svgCircle_bg = document.createElementNS(sSvgNS, "circle"),
						svgCircle_fg = document.createElementNS(sSvgNS, "circle");

					svgSpinner.setAttributeNS(null, "class", BusyIndicatorUtils.CSS_BASE + "_innerSpinner");
					svgSpinner.setAttributeNS(null, "viewBox", "0 0 50 50");

					svgCircle_bg.setAttributeNS(null, "class", BusyIndicatorUtils.CSS_BASE + "_innerSpinner_circle_bg");
					svgCircle_bg.setAttributeNS(null, "cx", "50%");
					svgCircle_bg.setAttributeNS(null, "cy", "50%");
					svgCircle_bg.setAttributeNS(null, "r", 20);

					svgCircle_fg.setAttributeNS(null, "class", BusyIndicatorUtils.CSS_BASE + "_innerSpinner_circle_fg");
					svgCircle_fg.setAttributeNS(null, "cx", "50%");
					svgCircle_fg.setAttributeNS(null, "cy", "50%");
					svgCircle_fg.setAttributeNS(null, "r", 20);

					svgSpinner.appendChild(svgCircle_bg);
					svgSpinner.appendChild(svgCircle_fg);
					domOuterDiv.appendChild(svgSpinner);
					oAnimation.appendChild(domOuterDiv);
					break;

				default:
					oAnimation.appendChild(document.createElement("div"));
					oAnimation.appendChild(document.createElement("div"));
					oAnimation.appendChild(document.createElement("div"));
			}
		};

		return BusyIndicatorUtils;
	},
	/* bExport= */ true
);
