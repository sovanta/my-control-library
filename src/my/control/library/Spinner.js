sap.ui.define(
	["./Loader", "sap/ui/core/theming/Parameters", "./IBusyIndicator", "./Interface", "./library"],
	function(Loader, Parameters, IBusyIndicator, Interface, library) {
		"use strict";

		var BusyIndicatorType = library.BusyIndicatorType;
		var BusyIndicatorSize = library.BusyIndicatorSize;

		/**
		 * Constructor for a new Spinner.
		 *
		 * @param {string} [sId] Id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * Can be used to display that an certain Area is currently busy.
		 *
		 * @extends my.control.library.Loader
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @since 0.3.0
		 * @alias my.control.library.Spinner
		 */

		var Spinner = Loader.extend(
			"my.control.library.Spinner",
			/** @lends my.control.library.Spinner.prototype */
			{
				metadata: {
					library: "my.control.library",

					interfaces: ["my.control.library.IBusyIndicator"],

					properties: {
						/**
						 * <code>my.control.library.BusyIndicatorSize</code> Can be used to provide size of the Spinner Type BusyIndicator
						 */
						busyIndicatorSize: { type: "my.control.library.BusyIndicatorSize", defaultValue: "Medium" }
					},

					aggregations: {}
				},
				/**
				 * CSS classes map.
				 * @type {Object}
				 * @private
				 */
				CSS_CLASSES: {
					CSS_BASE: "myControlLibrary_Spinner",
					CSS_DESIGN_INVERTED: "myControlLibrary_Spinner_inverted",
					CSS_INDICATORSIZE_XTRA_SMALL: "myControlLibrary_Spinner_busyIndicatorsize_xtra_small"
				},

				renderer: {},

				onAfterRendering: function() {
					var sBusyIndicatorSize = this.getBusyIndicatorSize();

					if (sBusyIndicatorSize !== BusyIndicatorSize.Auto) {
						var sCssSizeParameter = "myControlLibrary_IBusyIndicator_Spinner_fs_",
							sSize = Parameters.get(sCssSizeParameter + sBusyIndicatorSize);

						if (sSize) {
							var oDomRef = this.getDomRef();

							if (oDomRef) {
								oDomRef.style.fontSize = sSize;
							}
						}
					}
				},

				/**
				 * Setter for Property <code>busyIndicatorSize</code>
				 */
				setBusyIndicatorSize: function(sSize) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_INDICATORSIZE_XTRA_SMALL, sSize === BusyIndicatorSize.XtraSmall);

					Loader.prototype.setBusyIndicatorSize.apply(this, arguments);
				}
			}
		);

		Interface.defineOverrideMethod(Spinner, "setBusy", function(bBusy, sBusySection) {
			var aArguments = Array.prototype.slice.call(arguments);
			aArguments.push(BusyIndicatorType.Spinner);

			return IBusyIndicator.prototype.setBusy.apply(this, aArguments);
		});

		return Interface.apply(Spinner);
	},
	/* bExport= */ true
);
