sap.ui.define(["sap/ui/core/UIComponent", "my/control/library/mockserver/MockServer"], function(UIComponent, MockServer) {
	"use strict";

	var mockServerConfig = {
		SampleNameSpace: "ListNavigation",
		bLocalMockdata: false,
		bLocalMetadata: false
	};

	var Component = UIComponent.extend("my.control.library.sample.ListNavigation.Component", {
		metadata: {
			rootView: "my.control.library.sample.ListNavigation.Page",
			dependencies: {
				libs: ["sap.m", "sap.ui.unified", "sap.ui.layout", "my.control.library"]
			},
			config: {
				sample: {
					stretch: true,
					files: ["Page.view.xml", "Page.controller.js"]
				}
			}
		},
		init: function() {
			if (window.__localSample) {
				var element = document.getElementById("sap-ui-theme-my.control.library");
				element.parentNode.removeChild(element);
				jQuery.sap.require("sap.ui.thirdparty.less");
			}

			this.modulePath = mockServerConfig.bLocalMockdata ? "sample.ListNavigation.localService" : "mockserver";
			MockServer.init(mockServerConfig);

			UIComponent.prototype.init.apply(this, arguments);
		},
		createContent: function() {
			var oRootView = UIComponent.prototype.createContent.apply(this, arguments);
			if (window.__localSample) {
				var oViewContentPage = oRootView.getContent()[0];
				var oApp = new sap.m.App({
					pages: [oViewContentPage]
				});
				oRootView.removeAllContent();
				oRootView.addContent(oApp);
			}
			oRootView.addStyleClass("sapUiSizeCompact");
			return oRootView;
		}
	});

	return Component;
});
