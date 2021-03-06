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

		var PageController = Controller.extend("my.control.library.sample.ListNoDataControl.Page", {
			onInit: function() {
				var oModel = new ODataModel("https://services.odata.org/V2/my/control/library/mockdata.svc/", true);
				oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this.getOwnerComponent().setModel(oModel);

				var oModelProducts = new JSONModel(
					jQuery.sap.getModulePath("my.control.library.sample.ListNoDataControl") +
						"/localService/mockdata/SampleMockdata.json"
				);
				this.getView().setModel(oModelProducts, "sample");
			},
			onAfterRendering: function() {
				var view = this.getView();
				view.$().css("background-color", "#f8f8f8");

				var head = $("head");
				var linkToStyling = jQuery.sap.getModulePath("my.control.library.sample.ListNoDataControl") + "/styling.css";
				head.append('<link type="text/css" rel="stylesheet" href="' + linkToStyling + '">');
			},

			onReload: function() {
				this.getView()
					.getModel("sample")
					.setData([
						{
							text: "Daniel Eckert",
							description: "Description text",
							initial: "DE"
						},
						{
							text: "Anna-Kathrin Bergner",
							description: "Description text",
							initial: "AB"
						},
						{
							text: "Katrin Schmidt",
							description: "Description text",
							initial: "KS"
						},
						{
							text: "Simon Walz",
							description: "Description text",
							initial: "SW"
						},
						{
							text: "Alexander Mahler",
							description: "Description text",
							initial: "AM"
						},
						{
							text: "Sven Burger",
							description: "Description text",
							initial: "SB"
						},
						{
							text: "Kristin Kuester",
							description: "Description text",
							initial: "KK"
						},
						{
							text: "Matthias Meister",
							description: "Description text",
							initial: "MM"
						},
						{
							text: "Kevin Kuefer",
							description: "Description text",
							initial: "KK"
						},
						{
							text: "Simon Walz",
							description: "Description text",
							initial: "SW"
						},
						{
							text: "Katrin Schmidt",
							description: "Description text",
							initial: "KS"
						},
						{
							text: "Simon Walz",
							description: "Description text",
							initial: "SW"
						}
					]);
			}
		});

		return PageController;
	}
);
