sap.ui.define(
	["jquery.sap.global", "sap/ui/core/Renderer", "sap/m/ListRenderer"],
	function(jQuery, Renderer, MListRenderer) {
		"use strict";
		/**
		 * List renderer.
		 *
		 * ListRenderer extends the ListRenderer
		 * @namespace
		 * @alias my.control.library.ListRenderer
		 */
		var ListRenderer = Renderer.extend(MListRenderer);
		/**
		 * Override parent function
		 * This hook method is called to render no data field and no data Image
		 *
		 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
		 */
		ListRenderer.renderNoData = function(rm, oControl) {
			if (oControl.getShowNoDataImage()) {
				rm.write("<div");
				rm.writeAttribute("id", oControl.getId("nodata-image"));
				rm.writeAttribute("class", oControl.CSS_CLASSES_LIST.CSS_NO_DATA_WRAP);
				rm.writeClasses();
				rm.write(">");
				rm.renderControl(oControl.getAggregation("_noDataImageContent"));
				rm.write("</div>");
			}
			MListRenderer.renderNoData.apply(this, arguments);

			if (oControl.getShowNoDataContent()) {
				rm.write("<div");
				rm.writeAttribute("id", oControl.getId("nodata-content"));
				rm.writeClasses();
				rm.write(">");
				rm.renderControl(oControl.getNoDataContent());
				rm.write("</div>");
			}
		};
		return ListRenderer;
	} /* bExport= */,
	true
);
