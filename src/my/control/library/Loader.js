sap.ui.define(
	["jquery.sap.global", "sap/m/BusyIndicator", "./IBusyIndicator", "./Interface", "./library"],
	function(jQuery, BusyIndicator, IBusyIndicator, Interface, library) {
		"use strict";

		var BusyIndicatorType = library.BusyIndicatorType;

		/**
		 * Constructor for a new Loader.
		 *
		 * @param {string} [sId] Id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * Can be used to display that an certain Area is currently busy.
		 *
		 * @extends sap.m.BusyIndicator
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @since 0.3.0
		 * @alias my.control.library.Loader
		 */

		var Loader = BusyIndicator.extend(
			"my.control.library.Loader",
			/** @lends my.control.library.Loader.prototype */
			{
				metadata: {
					library: "my.control.library",

					interfaces: ["my.control.library.IBusyIndicator"],

					properties: {
						/**
						 * Defines the Loader Design
						 */
						design: {
							type: "my.control.library.ControlDesign",
							defaultValue: library.ControlDesign.Default
						}
					},
					aggregations: {}
				},
				/**
				 * CSS classes map.
				 * @type {Object}
				 * @private
				 */
				CSS_CLASSES: {
					CSS_BASE: "myControlLibrary_Loader",
					CSS_DESIGN_INVERTED: "myControlLibrary_Loader_inverted"
				},

				init: function() {
					this.addStyleClass(this.CSS_CLASSES.CSS_BASE);
				},

				renderer: {},

				/**
				 * Setter for property <code>design</code>
				 * @param sDesign
				 * @returns {my.control.library.Loader}
				 */
				setDesign: function(sDesign) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_DESIGN_INVERTED, sDesign === library.ControlDesign.Inverted);

					this.setProperty("design", sDesign, true);

					return this;
				}
			}
		);

		Interface.defineOverrideMethod(Loader, "setBusy", function(bBusy, sBusySection) {
			var aArguments = Array.prototype.slice.call(arguments);
			aArguments.push(BusyIndicatorType.Loader);

			return IBusyIndicator.prototype.setBusy.apply(this, aArguments);
		});

		return Interface.apply(Loader);
	},
	/* bExport= */ true
);
