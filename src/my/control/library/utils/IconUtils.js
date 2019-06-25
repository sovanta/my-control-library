sap.ui.define("my/control/library/utils/IconUtils", ["sap/ui/core/IconPool"], function(IconPool) {
	"use strict";

	/**
	 * Contains utility methods to ease the work with ui5 icons and icon uris
	 *
	 * @class
	 *
	 * @author sovanta AG
	 * @version ${version}
	 *
	 * @constructor
	 * @public
	 * @alias my.control.library.utils.IconUtils
	 */
	var IconUtils = {
		/**
		 * Retrieve Icon Info from collection by icon URI
		 * @param {string} sURI Icon URI (e.g. sap-icon://libraryName/icon-My_Time_1)
		 * @returns {{content: *, family: (string|*)}} icon content and icon collection
		 * @public
		 */
		getIconInfoFromURI: function(sURI) {
			var uri = sURI;
			//Parse uri
			var collection;
			var name;
			var parts = uri.replace("sap-icon://", "").split("/");
			if (parts.length === 1) {
				//Standard UI5 icon
				name = parts[0];
			} else {
				//Custom collection
				collection = parts[0];
				name = parts[1];
			}
			var oIcon = IconPool.getIconInfo(name, collection);
			if (oIcon === undefined) {
				jQuery.error("Invalid Icon URL");
			}
			collection = collection ? collection : "SAP-icons";

			return {
				content: oIcon.content,
				family: collection
			};
		}
	};

	return IconUtils;
});
