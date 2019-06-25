sap.ui.define(
	["jquery.sap.global", "sap/m/ListItemBaseRenderer", "sap/ui/core/Renderer"],
	function(jQuery, MListItemBaseRenderer, Renderer) {
		"use strict";
		/**
		 * ListItemRenderer  @namespace
		 */
		var ListItemRenderer = Renderer.extend(MListItemBaseRenderer);
		/**
		 * Renders the HTML for the given control, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 *
		 * @param oRm {sap.ui.core.RenderManager} RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param oLI {my.control.library.ListItem} Object representation of the control that should be rendered
		 */
		ListItemRenderer.renderLIAttributes = function(oRm, oLI) {};

		ListItemRenderer.renderLIContent = function(oRm, oLI) {
			oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_CONTAINER + "'>");
			// PRE CONTROL
			var preControl = oLI.getAggregation("preControl");
			if (preControl) {
				oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_PRE_CONTROL + "'>");
				oRm.renderControl(preControl);
				oRm.write("</div>");
			}
			// BODY LEFT
			oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_BODY + "_left'>");
			oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_TITLE + "'>");
			oRm.write(oLI.getTitle());
			oRm.write("</div>");
			oRm.write(
				"<div class='" +
					oLI.CSS_CLASSES_LISTITEM.CSS_DESCRIPTION +
					(oLI.getWrapDescription() ? "" : " " + oLI.CSS_CLASSES_LISTITEM.CSS_DESCRIPTION_NO_WRAP) +
					"'>"
			);
			oRm.write(oLI.getDescription());
			oRm.write("</div>");
			oRm.write("</div>");
			// BODY RIGHT
			if (oLI.getValue() || oLI.getInfo() || oLI.getHighlightText() || oLI.getIconSrc() || oLI.getShowFavorite()) {
				oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_BODY + "_right'>");
				if (oLI.getValue()) {
					oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_VALUE + "'>");
					oRm.write(oLI.getValue());
					oRm.write("</div>");
				}
				if (oLI.getInfo()) {
					oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_INFO + "'>");
					oRm.write(oLI.getInfo());
					oRm.write("</div>");
				}
				if (oLI.getHighlightText()) {
					oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_TEXT + "'>");
					oRm.write(oLI.getHighlightText());
					oRm.write("</div>");
				}
				var iconSrc = oLI.getIconSrc();
				if (iconSrc.length > 0) {
					var aggregationIcon = oLI.getAggregation("_icon");
					oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_ICON + "'>");
					oRm.renderControl(aggregationIcon);
					oRm.write("</div>");
				}
				var aggregationFavoriteIcon = oLI._getFavoriteIcon();
				if (aggregationFavoriteIcon && oLI.getShowFavorite()) {
					// the main css class is injected in the control
					oRm.write("<div>");
					oRm.renderControl(aggregationFavoriteIcon);
					oRm.write("</div>");
				}
				oRm.write("</div>");
			}
			// CUSTOM COUNTER
			var customCounter = oLI.getAggregation("customCounter");
			if (customCounter) {
				this._renderCounterContent(oRm, oLI, null, customCounter);
			}
			oRm.write("</div>");
		};
		/**
		 * override base function: renderCounterContent
		 *
		 * @access public
		 * @param oRm {sap.ui.core.RenderManager} RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param oLI {my.control.library.ListItem} Object representation of the control that should be rendered
		 * @param iCounter
		 */
		ListItemRenderer.renderCounterContent = function(oRm, oLI, iCounter) {
			// customCounter replaces counter property
			if (!oLI.getAggregation("customCounter")) {
				this._renderCounterContent(oRm, oLI, iCounter, oLI._getCounter(iCounter));
			}
		};

		/**
		 * override function: renderHighlight
		 *
		 * @access public
		 * @param oRm {sap.ui.core.RenderManager} RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param oLI {sap.ui.core.Control} Object representation of the control that should be rendered
		 *
		 */
		ListItemRenderer.renderHighlight = function(oRm, oLI) {
			//left status bar
			oRm.write("<div class='" + oLI.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_BAR + "'/>");
		};

		// --------------- PRIVATE ---------------
		/**
		 * _renderCounterContent
		 *
		 * @access public
		 * @param oRm {sap.ui.core.RenderManager} RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param oLI {my.control.library.ListItem} Object representation of the control that should be rendered
		 * @param iCounter
		 * @param oCounter
		 */
		ListItemRenderer._renderCounterContent = function(oRm, oLI, iCounter, oCounter) {
			oRm.write("<div");
			oRm.writeAttribute("id", oLI.getId() + "-counter");
			oRm.writeAttribute("class", oLI.CSS_CLASSES_LISTITEM.CSS_COUNTER);
			var sAriaLabel = sap.ui
				.getCore()
				.getLibraryResourceBundle("sap.m")
				.getText("LIST_ITEM_COUNTER", iCounter ? iCounter : oCounter.getNotificationCount());
			oRm.writeAttribute("aria-label", sAriaLabel);
			oRm.addClass("sapMLIBCounter");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oCounter);
			oRm.write("</div>");
		};
		return ListItemRenderer;
	} /* bExport= */,
	true
);
