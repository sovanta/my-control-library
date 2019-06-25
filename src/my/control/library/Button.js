sap.ui.define(
	["jquery.sap.global", "sap/ui/core/Control", "./IBusyIndicator", "./Interface", "./library"],
	function(jQuery, Control, IBusyIndicator, Interface, library) {
		"use strict";

		var BusyIndicatorType = library.BusyIndicatorType;

		/**
		 * Constructor for a new Button.
		 *
		 * @param {string} [sId] Id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * Enables users to trigger actions.
		 *
		 * @extends sap.ui.core.Control
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @since 0.3.0
		 * @alias my.control.library.Button
		 */

		var Button = Control.extend(
			"my.control.library.Button",
			/** @lends my.control.library.Button.prototype */
			{
				metadata: {
					library: "my.control.library",

					interfaces: ["my.control.library.IBusyIndicator"],

					properties: {
						/**
						 * <code>my.control.library.BusyIndicatorSize</code> Can be used to provide size of the Spinner Type BusyIndicator
						 */
						busyIndicatorSize: {
							type: "my.control.library.BusyIndicatorSize",
							defaultValue: "XtraSmall"
						},

						/**
						 * If the button is enabled
						 */
						enabled: {
							type: "boolean",
							defaultValue: true
						},

						/**
						 * The Icon to display inside the Button
						 */
						icon: {
							type: "sap.ui.core.URI",
							defaultValue: ""
						},

						/**
						 * The text to display inside the Button
						 */
						text: {
							type: "string",
							defaultValue: ""
						},

						/**
						 * Width of the Button
						 */
						width: {
							type: "my.control.library.CSSSize",
							defaultValue: ""
						},

						/**
						 * Defines the Button Type
						 */
						type: {
							type: "my.control.library.ButtonType",
							defaultValue: library.ButtonType.Filled
						},

						/**
						 * Defines the Button Shape
						 */
						shape: {
							type: "my.control.library.ButtonShape",
							defaultValue: library.ButtonShape.Regular
						},

						/**
						 * Defines the Button Semantic Type
						 */
						semanticType: {
							type: "my.control.library.ButtonSemanticType",
							defaultValue: library.ButtonSemanticType.Basic
						},

						/**
						 * Predefined Size of the Button.
						 */
						size: {
							type: "my.control.library.ButtonSize",
							defaultValue: library.ButtonSize.Big
						},

						/**
						 * Defines the Button Design
						 */
						design: {
							type: "my.control.library.ControlDesign",
							defaultValue: library.ControlDesign.Default
						}
					},
					aggregations: {},

					events: {
						/**
						 * Event is fired when the user clicks on the control.
						 */
						press: {}
					}
				},
				/**
				 * CSS classes map.
				 * @type {Object}
				 * @private
				 */
				CSS_CLASSES: {
					CSS_BASE: "myControlLibrary_Button",
					CSS_BUSY: "myControlLibrary_Button_busy",
					CSS_TEXT: "myControlLibrary_Button_text",
					CSS_NO_TEXT: "myControlLibrary_Button_no_text",
					CSS_ICON_CONTAINER: "myControlLibrary_Button_icon_container",
					CSS_ICON: "myControlLibrary_Button_icon",
					CSS_NO_ICON: "myControlLibrary_Button_no_icon",
					CSS_TYPE_FILLED: "myControlLibrary_Button_type_filled",
					CSS_TYPE_GHOST: "myControlLibrary_Button_type_ghost",
					CSS_SEMANTIC_TYPE_BASIC: "myControlLibrary_Button_semantic_type_basic",
					CSS_SEMANTIC_TYPE_HIGHLIGHT: "myControlLibrary_Button_semantic_type_highlight",
					CSS_SEMANTIC_TYPE_SALES: "myControlLibrary_Button_semantic_type_sales",
					CSS_SIZE_BIG: "myControlLibrary_Button_size_big",
					CSS_SIZE_SMALL: "myControlLibrary_Button_size_small",
					CSS_SHAPE_REGULAR: "myControlLibrary_Button_shape_regular",
					CSS_SHAPE_CIRCLE: "myControlLibrary_Button_shape_circle",
					CSS_SHAPE_SQUARE: "myControlLibrary_Button_shape_square",
					CSS_DESIGN_INVERTED: "myControlLibrary_Button_inverted"
				},

				ICON_CONTAINER_ID: "iconContainer",

				/**
				 * Init called while creation of an new Instance of this Control
				 */
				init: function() {
					if (Control.prototype.init) {
						Control.prototype.init.apply(this, arguments);
					}

					//Set Initial Classes
					this.setType(this.getType());
					this.setSemanticType(this.getSemanticType());
					this.setSize(this.getSize());
					this.setShape(this.getShape());

					this.addStyleClass(this.CSS_CLASSES.CSS_BASE);
				},

				/**
				 * Attach of the pseudo Click Event to fire Control press Event
				 * @param oEvent
				 */
				onclick: function(oEvent) {
					//mark event for controls that need to know it was already handled (e.g. ListItems)
					oEvent.setMarked();

					if (this.getEnabled()) {
						this.firePress();
					}
				},

				renderer: function(oRm, oButton) {
					var sText = oButton.getText();
					var sIcon = oButton.getIcon();
					var sIconContainerId = oButton.ICON_CONTAINER_ID;

					oRm.write("<button");
					oRm.writeControlData(oButton);
					oRm.writeClasses();
					oRm.addStyle("width", oButton.getWidth());
					oRm.writeStyles();

					if (oButton.getEnabled() === false) {
						oRm.write("disabled");
					}

					oRm.write(">");

					oRm.write("<div");
					oRm.writeAttributeEscaped("id", oButton.getId() + "-" + sIconContainerId);
					oRm.addClass(oButton.CSS_CLASSES.CSS_ICON_CONTAINER);

					if (!oButton._getRenderText() || !sText) {
						oRm.addClass(oButton.CSS_CLASSES.CSS_NO_TEXT);
					}

					if (!sIcon) {
						oRm.addClass(oButton.CSS_CLASSES.CSS_NO_ICON);
					}

					oRm.writeClasses();
					oRm.write(">");

					if (sIcon && sIcon.length > 0) {
						oRm.writeIcon(oButton.getIcon(), [oButton.CSS_CLASSES.CSS_ICON]);
					}

					oRm.write("</div>");

					if (sText && sText.length > 0 && oButton._getRenderText()) {
						oRm.write("<span");
						oRm.addClass(oButton.CSS_CLASSES.CSS_TEXT);
						oRm.writeClasses();
						oRm.write(">");

						oRm.writeEscaped(oButton.getText(), false);

						oRm.write("</span>");
					}

					oRm.write("</button>");
				},

				/**
				 * Setter for property <code>type</code>
				 * @param sType
				 * @returns {library.Button}
				 */
				setType: function(sType) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_TYPE_FILLED, sType === library.ButtonType.Filled);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_TYPE_GHOST, sType === library.ButtonType.Ghost);

					this.setProperty("type", sType, true);

					return this;
				},

				/**
				 * Setter for property <code>semanticType</code>
				 * @param sSemanticType
				 * @returns {my.control.library.Button}
				 */
				setSemanticType: function(sSemanticType) {
					this.toggleStyleClass(
						this.CSS_CLASSES.CSS_SEMANTIC_TYPE_BASIC,
						sSemanticType === library.ButtonSemanticType.Basic
					);
					this.toggleStyleClass(
						this.CSS_CLASSES.CSS_SEMANTIC_TYPE_HIGHLIGHT,
						sSemanticType === library.ButtonSemanticType.Highlight
					);
					this.toggleStyleClass(
						this.CSS_CLASSES.CSS_SEMANTIC_TYPE_SALES,
						sSemanticType === library.ButtonSemanticType.Sales
					);

					this.setProperty("semanticType", sSemanticType, true);

					return this;
				},

				/**
				 * Setter for property <code>size</code>
				 * @param sSize
				 * @returns {my.control.library.Button}
				 */
				setSize: function(sSize) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SIZE_BIG, sSize === library.ButtonSize.Big);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SIZE_SMALL, sSize === library.ButtonSize.Small);

					this.setProperty("size", sSize, true);
					return this;
				},

				/**
				 * Setter for property <code>shape</code>
				 * @param sShape
				 * @returns {my.control.library.Button}
				 */
				setShape: function(sShape) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SHAPE_REGULAR, sShape === library.ButtonShape.Regular);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SHAPE_CIRCLE, sShape === library.ButtonShape.Circle);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SHAPE_SQUARE, sShape === library.ButtonShape.Square);

					this.setProperty("shape", sShape);

					return this;
				},

				/**
				 * Setter for property <code>design</code>
				 * @param sDesign
				 * @returns {my.control.library.Button}
				 */
				setDesign: function(sDesign) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_DESIGN_INVERTED, sDesign === library.ControlDesign.Inverted);

					this.setProperty("design", sDesign, true);

					return this;
				},

				/**
				 * Descide if Text should be rendered or not. Currently depends on Shape
				 * @returns {boolean}
				 * @private
				 */
				_getRenderText: function() {
					var sShape = this.getShape();

					return sShape === library.ButtonShape.Regular;
				},

				/**
				 * Handle Internal Busy Classes
				 * @param bBusy
				 * @private
				 */
				_handleBusyClasses: function(bBusy) {
					var fnSetBusyClass = function() {
						//Set Custom Busy Class - since we will use standardBusyIndicator Classes only in Icon Container
						this.toggleStyleClass(this.CSS_CLASSES.CSS_BUSY, bBusy);
					}.bind(this);

					if (bBusy) {
						if (this.getBusyIndicatorDelay() <= 0) {
							fnSetBusyClass.call(this);
						} else {
							this._busyClassDelayedCallId = setTimeout(fnSetBusyClass, this.getBusyIndicatorDelay());
						}
					} else {
						fnSetBusyClass.call(this);

						//If there is a pending delayed call we clear it
						if (this._busyClassDelayedCallId) {
							clearTimeout(this._busyClassDelayedCallId);
							delete this._busyClassDelayedCallId;
						}
					}
				}
			}
		);

		Interface.defineOverrideMethod(Button, "setBusy", function(bBusy, sBusySection) {
			var aArguments = Array.prototype.slice.call(arguments);
			aArguments.push(this.ICON_CONTAINER_ID);
			aArguments.push(BusyIndicatorType.Spinner);

			this._handleBusyClasses(bBusy);

			return IBusyIndicator.prototype.setBusy.apply(this, aArguments);
		});

		return Interface.apply(Button);
	},
	/* bExport= */ true
);
