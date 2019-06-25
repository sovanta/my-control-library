sap.ui.define(
	[
		"sap/m/MessageToast",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/json/JSONModel",
		"my/control/library/Badge"
	],
	function(MessageToast, Controller, ODataModel, JSONModel, Badge) {
		"use strict";

		var PageController = Controller.extend("my.control.library.sample.Badge.Page", {
			onInit: function() {
				var oModel = new ODataModel("https://services.odata.org/V2/my/control/library/mockdata.svc/", true);
				oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this.getOwnerComponent().setModel(oModel);

				var oModelProducts = new JSONModel(
					jQuery.sap.getModulePath("my.control.library.sample.Badge") + "/localService/mockdata/SampleMockdata.json"
				);
				this.getView().setModel(oModelProducts, "sample");

				this._oLocalModel = new JSONModel({
					enabled: true,
					initials: "FP",
					iconPath: "sap-icon://myControlLibrary/Add",
					imagePath:
						"./" + jQuery.sap.getModulePath("my.control.library.sample.Badge") + "/localService/mockdata/sovanta.png", //Note the beginning of the path. This is necessary to tell the intern parser thi sis a URI and not a Text
					additionalIconColor: "",
					additionalIconBgColor: "",
					showAdditionalIcon: false,
					srcAdditionalIcon: "sap-icon://myControlLibrary/Add"
				});

				this.getView().setModel(this._oLocalModel, "local");
			},

			onAfterRendering: function() {
				var view = this.getView();
				view.$().css("background-color", "#f8f8f8");

				var head = $("head");
				var linkToStyling = jQuery.sap.getModulePath("my.control.library.sample.Badge") + "/styling.css";
				head.append('<link type="text/css" rel="stylesheet" href="' + linkToStyling + '">');
			},

			onTogglePressEvent: function(oEvent) {
				var bState = oEvent.getParameter("state");

				var aBadges = jQuery(".myControlLibrary_Badge").control();
				aBadges.forEach(
					function(oBadge) {
						if (bState && !oBadge.hasListeners("press")) {
							oBadge.attachPress(this.onPress);
						} else {
							oBadge.detachPress(this.onPress);
						}
					}.bind(this)
				);
			},

			onPress: function() {
				MessageToast.show("Badge pressed!", { autoClose: true, duration: 1000 });
			}
		});

		return PageController;
	}
);
