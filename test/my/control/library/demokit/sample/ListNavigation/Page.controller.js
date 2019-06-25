sap.ui.define(
	[
		"sap/m/MessageToast",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/json/JSONModel",
		"my/control/library/List"
	],
	function(MessageToast, Controller, ODataModel, JSONModel, List) {
		"use strict";

		var PageController = Controller.extend("my.control.library.sample.ListNavigation.Page", {
			onInit: function() {
				var oModel = new ODataModel("https://services.odata.org/V2/my/control/library/mockdata.svc/", true);
				oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this.getOwnerComponent().setModel(oModel);

				var oModelProducts = new JSONModel(
					jQuery.sap.getModulePath("my.control.library.sample.ListNavigation") +
						"/localService/mockdata/SampleMockdata.json"
				);
				this.getView().setModel(oModelProducts, "sample");
			},
			onAfterRendering: function() {
				var view = this.getView();
				view.$().css("background-color", "#f8f8f8");

				var head = $("head");
				var linkToStyling = jQuery.sap.getModulePath("my.control.library.sample.ListNavigation") + "/styling.css";
				head.append('<link type="text/css" rel="stylesheet" href="' + linkToStyling + '">');
			},

			onSelectChange: function(oEvent) {
				var mode = oEvent.getParameter("selectedItem").getKey();
				this.getView()
					.byId("list")
					.setShowSeparators(mode);
			}
		});

		return PageController;
	}
);
