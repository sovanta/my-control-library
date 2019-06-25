sap.ui.define(
	[
		"sap/m/MessageToast",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/json/JSONModel",
		"my/control/library/Button"
	],
	function(MessageToast, Controller, ODataModel, JSONModel, Button) {
		"use strict";

		var PageController = Controller.extend("my.control.library.sample.Button.Page", {
			onInit: function() {
				var oViewModel = new JSONModel({
					text: "Button label",
					icon: "sap-icon://myControlLibrary/Add",
					delay: 100,
					busy: true
				});
				this.getView().setModel(oViewModel, "sample");
			},
			onAfterRendering: function() {
				var view = this.getView();
				view.$().css("background-color", "#f8f8f8");

				var head = $("head");
				var linkToStyling = jQuery.sap.getModulePath("my.control.library.sample.Button") + "/styling.css";
				head.append('<link type="text/css" rel="stylesheet" href="' + linkToStyling + '">');
			},

			onDelayChange: function(oEvent) {
				var sDelay = oEvent.getParameter("value"),
					oModel = this.getView().getModel("sample");

				if (sDelay) {
					oModel.setProperty("/delay", parseInt(sDelay));
				}
			}
		});

		return PageController;
	}
);
