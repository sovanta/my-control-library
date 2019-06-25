sap.ui.define(
	[
		"my/control/library/Button",
		"test/unit/helper/APITest",
		"test/unit/helper/FakeI18nModel",
		"test/unit/helper/Actions",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function(Button, APITest, FakeI18n, Actions) {
		"use strict";

		QUnit.module("my.control.library.Button", {
			before: function() {},
			beforeEach: function() {
				this._oControl = new Button();
			},
			after: function() {},
			afterEach: function() {
				this._oControl.destroy();
			}
		});

		QUnit.test("custom control test", function(assert) {
			//Arrange

			//Assert
			assert.strictEqual(true, false, "Needs to be implemented");

			//Clean
		});

		QUnit.test("Public API - property defaults", function(assert) {
			//Assert
			APITest.testGetters(assert, this._oControl, {
				//define defaultValue overwrites of your .init or constructor here
			});
		});

		QUnit.test("Public API - common methods", function(assert) {
			//Arrange

			//place at "qunit-fixture" div, which will be deleted by QuUnit after every test!
			this._oControl.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges(); //apply rendering

			//Assert

			APITest.testCommonMethods(assert, this._oControl, {});

			//Clean
		});
	}
);
