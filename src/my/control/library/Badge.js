sap.ui.define(
	["jquery.sap.global", "sap/ui/core/Control", "sap/ui/core/IconPool", "./utils/MiscUtils", "./library"],
	function(jQuery, Control, IconPool, MiscUtils, library) {
		"use strict";
		/**
		 * Constructor for a new Badge.
		 *
		 * @param {string} [sId] Id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 *
		 * @extends sap.ui.core.Control
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @since 0.4.0
		 * @alias my.control.library.Badge
		 */

		var Badge = Control.extend(
			"my.control.library.Badge",
			/** @lends my.control.library.Badge.prototype */
			{
				metadata: {
					library: "my.control.library",
					properties: {
						/**
						 * If the Badge is enabled
						 */
						enabled: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Content to display inside the Badge. This can either be a image URI, a icon URI or a text.
						 * Value will be evaluated in this order.
						 *
						 */
						content: {
							type: "string",
							defaultValue: ""
						},
						/**
						 * Render border
						 */
						showBorder: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Predefined size of badge. This can be overriden by "radius" property
						 */
						size: {
							type: "my.control.library.BadgeSize",
							defaultValue: library.BadgeSize.Large
						},
						/**
						 * Explicitly set radius. This will override the predefined size set in "size" property
						 */
						radius: {
							type: "float",
							defaultValue: undefined
						},
						/**
						 * Site of the content (image, icon, text). This will override the size set in "size" property
						 */
						contentSize: {
							type: "my.control.library.CSSSize",
							defaultValue: ""
						},
						/**
						 * Predefined Design of Badge
						 */
						type: {
							type: "my.control.library.BadgeType",
							defaultValue: library.BadgeType.Light
						},
						/**
						 * Shape of badge outer contour
						 */
						shape: {
							type: "my.control.library.BadgeShape",
							defaultValue: library.BadgeShape.Circle
						},
						/**
						 * Custom Content (image, icon, text) color of Badge
						 */
						contentColor: {
							type: "sap.ui.core.CSSColor",
							defaultValue: ""
						},
						/**
						 * Custom Border color of Badge
						 */
						borderColor: {
							type: "sap.ui.core.CSSColor",
							defaultValue: ""
						},
						/**
						 * Additional icon (_not_ the central icon in the badge). This icon will be displayed on a corner of
						 * the badge. Use "iconPosition" to define corner.
						 */
						iconSrc: {
							type: "sap.ui.core.URI",
							defaultValue: ""
						},
						/**
						 * Positioning of the corner icon defined with "iconSrc" property
						 */
						iconPosition: {
							type: "my.control.library.BadgeIconPosition",
							defaultValue: library.BadgeIconPosition.TopLeft
						},
						/**
						 * Show/Hide the corner icon
						 */
						showIcon: {
							type: "boolean",
							defaultValue: false
						},
						/**
						 * Color to override the standard icon color for corner icon.
						 * Disabled state handling is currently not supported for the additional icon.
						 */
						iconColor: {
							type: "sap.ui.core.CSSColor",
							defaultValue: ""
						},
						/**
						 * Background-Color to override the standard icon color for corner icon.
						 * Disabled state handling is currently not supported for the additional icon.
						 */
						iconBackgroundColor: {
							type: "sap.ui.core.CSSColor",
							defaultValue: ""
						},
						/**
						 * Background-Color of corner icon when "iconActive" property is set to "true"
						 */
						iconActiveBackgroundColor: {
							type: "sap.ui.core.CSSColor",
							defaultValue: ""
						},
						/**
						 * Color of corner icon when "iconActive" property is set to "true"
						 */
						iconActiveColor: {
							type: "sap.ui.core.CSSColor",
							defaultValue: ""
						},
						/**
						 * Set corner icon to active state (_not_ the click/interaction state of the browser)
						 */
						iconActive: {
							type: "boolean",
							defaultValue: false
						}
					},
					aggregations: {},
					events: {
						/**
						 * Press event. Fired when the Badge is pressed
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
					CSS_BASE: "myControlLibrary_Badge",
					CSS_OUTER_CIRCLE: "myControlLibrary_Badge_outer_circle",
					//class for the content. no matter what kind (icon, image, or text)
					CSS_CONTENT: "myControlLibrary_Badge_content",
					//class for the image badge
					CSS_CONTENT_IMAGE: "myControlLibrary_Badge_content_image",
					CSS_HAS_EVENT_LISTENER: "myControlLibrary_Badge_has_event_listener",
					//enable hover and press styling
					CSS_HIDE_BORDER: "myControlLibrary_Badge_hide_border",
					//Design
					CSS_TYPE_LIGHT: "myControlLibrary_Badge_type_light",
					CSS_TYPE_BOLD: "myControlLibrary_Badge_type_bold",
					//Shape
					CSS_SHAPE_CIRCLE: "myControlLibrary_Badge_shape_circle",
					CSS_SHAPE_SQUARE: "myControlLibrary_Badge_shape_square",
					//sizes:
					CSS_SIZE_S: "myControlLibrary_Badge_size_s",
					CSS_SIZE_M: "myControlLibrary_Badge_size_m",
					CSS_SIZE_L: "myControlLibrary_Badge_size_l",
					CSS_CUSTOM_RADIUS: "myControlLibrary_Badge_custom_radius",
					//Additional icon
					CSS_ADDITIONAL_ICON: "myControlLibrary_Badge_additional_icon",
					CSS_ADDITIONAL_ICON_ACTIVE: "myControlLibrary_Badge_additional_icon_active",
					CSS_ADDITIONAL_ICON_SHOW: "myControlLibrary_Badge_additional_icon_show",
					CSS_ADDITIONAL_ICON_POSITION_TOPLEFT: "myControlLibrary_Badge_additional_icon_position_topleft",
					CSS_ADDITIONAL_ICON_POSITION_TOPRIGHT: "myControlLibrary_Badge_additional_icon_position_topright",
					CSS_ADDITIONAL_ICON_POSITION_BOTTOMRIGHT: "myControlLibrary_Badge_additional_icon_position_bottomright",
					CSS_ADDITIONAL_ICON_POSITION_BOTTOMLEFT: "myControlLibrary_Badge_additional_icon_position_bottomleft"
				},

				init: function() {
					if (Control.prototype.init) {
						Control.prototype.init.apply(this, arguments);
					}
					this.setIconPosition(library.BadgeIconPosition.TopLeft);
					this.addStyleClass(this.CSS_CLASSES.CSS_BASE);
				},

				renderer: function(oRm, oBadge) {
					var sContent = oBadge.getContent(),
						bIsURI = MiscUtils.validateURI(sContent),
						sAdditionalIconSrc = oBadge.getIconSrc(),
						bAdditionalIconIsURI = MiscUtils.validateURI(sAdditionalIconSrc);
					oRm.write("<div");
					oRm.writeControlData(oBadge);
					oRm.writeStyles();
					oRm.writeClasses();

					if (oBadge.getEnabled() === false) {
						oRm.write("disabled");
					}

					oRm.write(">");

					//style tag to override active styling of icon
					oRm.write("<style");
					oRm.writeAttribute("id", oBadge.getId() + "-style");
					oRm.write(">");
					oRm.write(oBadge._getOverrideStyleTagText());
					oRm.write("</style>");
					//end style

					// <start outer circle
					oRm.write("<div");
					oRm.addClass(oBadge.CSS_CLASSES.CSS_OUTER_CIRCLE);
					oRm.writeClasses();
					oRm.write(">");
					if (bIsURI) {
						oRm.writeIcon(sContent, oBadge.CSS_CLASSES.CSS_CONTENT);
					} else {
						oRm.write("<span");
						oRm.addClass(oBadge.CSS_CLASSES.CSS_CONTENT);
						oRm.writeClasses();
						oRm.write(">");
						oRm.writeEscaped(sContent);
						oRm.write("</span>");
					}
					oRm.write("</div>");
					//end outer circle>

					if (bAdditionalIconIsURI) {
						oRm.writeIcon(sAdditionalIconSrc, oBadge.CSS_CLASSES.CSS_ADDITIONAL_ICON);
					}

					oRm.write("</div>");
				},

				onAfterRendering: function() {
					if (Control.prototype.onAfterRendering) {
						Control.prototype.onAfterRendering.apply(this, arguments);
					}
					this._applyAllSetStyles();
				},
				/***************************************************/
				/* Property Setter/Getter                          */
				/***************************************************/

				/**
				 * Setter for property <code>content</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {string} sContent new Value for property <code>content</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */

				setContent: function(sContent) {
					this.setProperty("content", sContent);

					let bIsIMG = !IconPool.isIconURI(sContent);
					let bIsURI = MiscUtils.validateURI(sContent);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_CONTENT_IMAGE, bIsURI && bIsIMG);

					return this;
				},

				/**
				 * Setter for property <code>type</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {my.control.library.BadgeType} sType new Value for property <code>design</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setType: function(sType) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_TYPE_LIGHT, sType === library.BadgeType.Light);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_TYPE_BOLD, sType === library.BadgeType.Bold);
					this.setProperty("type", sType, true);
					return this;
				},
				/**
				 * Setter for property <code>shape</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {my.control.library.BadgeShape} sShape new Value for property <code>shape</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setShape: function(sShape) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SHAPE_CIRCLE, sShape === library.BadgeShape.Circle);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SHAPE_SQUARE, sShape === library.BadgeShape.Square);
					this.setProperty("shape", sShape, true);
					return this;
				},
				/**
				 * Setter for property <code>size</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {my.control.library.BadgeSize} sSize new Value for property <code>size</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setSize: function(sSize) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SIZE_S, sSize === library.BadgeSize.Small);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SIZE_M, sSize === library.BadgeSize.Medium);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_SIZE_L, sSize === library.BadgeSize.Large);
					this.setProperty("size", sSize, true);
					return this;
				},
				/**
				 * Setter for property <code>showBorder</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {boolean} bShowBorder new Value for property <code>showBorder</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setShowBorder: function(bShowBorder) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_HIDE_BORDER, !bShowBorder);
					this.setProperty("showBorder", bShowBorder, true);
					return this;
				},
				/**
				 * Setter for property <code>iconPosition</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {my.control.library.BadgeIconPosition} sIconPosition new Value for property <code>iconPosition</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setIconPosition: function(sIconPosition) {
					this.toggleStyleClass(
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON_POSITION_TOPLEFT,
						sIconPosition === library.BadgeIconPosition.TopLeft
					);
					this.toggleStyleClass(
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON_POSITION_TOPRIGHT,
						sIconPosition === library.BadgeIconPosition.TopRight
					);
					this.toggleStyleClass(
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON_POSITION_BOTTOMRIGHT,
						sIconPosition === library.BadgeIconPosition.BottomRight
					);
					this.toggleStyleClass(
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON_POSITION_BOTTOMLEFT,
						sIconPosition === library.BadgeIconPosition.BottomLeft
					);
					this.setProperty("iconPosition", sIconPosition, true);
					return this;
				},
				/**
				 * Setter for property <code>showIcon</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {boolean} bShowIcon new Value for property <code>showIcon</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setShowIcon: function(bShowIcon) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_ADDITIONAL_ICON_SHOW, bShowIcon);
					this.setProperty("showIcon", bShowIcon, true);
					return this;
				},
				/**
				 * Setter for property <code>radius</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {int} iRadius new Value for property <code>radius</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setRadius: function(iRadius) {
					//undefined radius => remove style
					var iDiameter = iRadius === undefined ? undefined : iRadius * 2;
					var sFontSize = iDiameter === undefined ? "" : iDiameter / 3.5 + "px";
					var sIconFontSize = iDiameter === undefined ? "" : iDiameter / 2.5 + "px";
					var sDiameter = iDiameter === undefined ? "" : iDiameter + "px";
					this._setInlineOverrideStyling("width", sDiameter);
					this._setInlineOverrideStyling("max-width", sDiameter);
					this._setInlineOverrideStyling("height", sDiameter);
					this._setInlineOverrideStyling("max-height", sDiameter);
					//scale content font-size
					this._setInlineOverrideStyling("font-size", sFontSize);
					this._setInlineOverrideStyling("font-size", sIconFontSize, this.CSS_CLASSES.CSS_CONTENT);
					//Additional icon keep proportions
					var fAdditionalIconDiameter = iDiameter / 3;
					this._setInlineOverrideStyling(
						"height",
						iDiameter === undefined ? "" : fAdditionalIconDiameter + "px",
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON
					);
					this._setInlineOverrideStyling(
						"max-height",
						iDiameter === undefined ? "" : fAdditionalIconDiameter + "px",
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON
					);
					this._setInlineOverrideStyling(
						"width",
						iDiameter === undefined ? "" : fAdditionalIconDiameter + "px",
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON
					);
					this._setInlineOverrideStyling(
						"max-width",
						iDiameter === undefined ? "" : fAdditionalIconDiameter + "px",
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON
					);
					this._setInlineOverrideStyling(
						"font-size",
						iDiameter === undefined ? "" : fAdditionalIconDiameter / 1.25 + "px",
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON
					);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_CUSTOM_RADIUS, sDiameter !== "");
					this.setProperty("radius", iRadius, true);
					return this;
				},
				/**
				 * Setter for property <code>contentSize</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {my.control.library.CSSSize} sContentSize new Value for property <code>contentSize</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setContentSize: function(sContentSize) {
					// sContentSize = sContentSize === undefined ? "" : sContentSize;
					this._setInlineOverrideStyling("font-size", sContentSize, this.CSS_CLASSES.CSS_CONTENT);
					this.setProperty("contentSize", sContentSize, true);
					return this;
				},
				/**
				 * Setter for property <code>contentColor</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {sap.ui.core.CSSColor} sContentColor new Value for property <code>contentColor</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setContentColor: function(sContentColor) {
					this._setInlineOverrideStyling("color", sContentColor, this.CSS_CLASSES.CSS_CONTENT);
					this.setProperty("contentColor", sContentColor, true);
					return this;
				},
				/**
				 * Setter for property <code>borderColor</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {sap.ui.core.CSSColor} sBorderColor new Value for property <code>borderColor</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setBorderColor: function(sBorderColor) {
					this._setInlineOverrideStyling("border-color", sBorderColor, this.CSS_CLASSES.CSS_OUTER_CIRCLE);
					this.setProperty("borderColor", sBorderColor, true);
					return this;
				},
				/**
				 * Setter for property <code>iconColor</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {sap.ui.core.CSSColor} sIconColor new Value for property <code>iconColor</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setIconColor: function(sIconColor) {
					if (!this.getEnabled()) {
						jQuery.sap.log.error("Disabled state handling is currently not supported for the additional icon.");
					}

					this._setInlineOverrideStyling("color", sIconColor, this.CSS_CLASSES.CSS_ADDITIONAL_ICON);
					this.setProperty("iconColor", sIconColor, true);
					return this;
				},
				/**
				 * Setter for property <code>iconActiveColor</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {sap.ui.core.CSSColor} sIconActiveColor new Value for property <code>iconActiveColor</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setIconActiveColor: function(sIconActiveColor) {
					this.setProperty("iconActiveColor", sIconActiveColor, true);
					this._updateOverrideStyling();
					return this;
				},
				/**
				 * Setter for property <code>iconBackgroundColor</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {sap.ui.core.CSSColor} sIconBackgroundColor new Value for property <code>iconBackgroundColor</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setIconBackgroundColor: function(sIconBackgroundColor) {
					if (!this.getEnabled()) {
						jQuery.sap.log.error("Disabled state handling is currently not supported for the additional icon.");
					}

					this._setInlineOverrideStyling(
						"background-color",
						sIconBackgroundColor,
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON
					);
					this._setInlineOverrideStyling("border-color", sIconBackgroundColor, this.CSS_CLASSES.CSS_ADDITIONAL_ICON);
					this.setProperty("iconBackgroundColor", sIconBackgroundColor, true);
					return this;
				},
				/**
				 * Setter for property <code>iconActiveBackgroundColor</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {sap.ui.core.CSSColor} sIconActiveBackgroundColor new Value for property <code>iconActiveBackgroundColor</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setIconActiveBackgroundColor: function(sIconActiveBackgroundColor) {
					this.setProperty("iconActiveBackgroundColor", sIconActiveBackgroundColor, true);
					this._updateOverrideStyling();
					return this;
				},
				/**
				 * Setter for property <code>iconActive</code>
				 *
				 * @includeMetadataDescription
				 *
				 * @param {boolean} bIconActive new Value for property <code>iconActive</code>
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				setIconActive: function(bIconActive) {
					this.toggleStyleClass(this.CSS_CLASSES.CSS_ADDITIONAL_ICON_ACTIVE, !!bIconActive);
					this.setProperty("iconActive", bIconActive, true);
					return this;
				},
				/***************************************************/
				/* Event Methods                                   */
				/***************************************************/
				/**
				 * Click handler
				 */
				onclick: function(oEvent) {
					if (this.hasListeners("press") && this.getEnabled()) {
						//mark event for controls that need to know it was already handled (e.g. ListItems)
						oEvent.setMarked();
						this.firePress();
					}
				},
				/**
				 * Attach press handler
				 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
				 * @param {function} fnHandler The function to call, when the event occurs. This function will be called on the
				 * oListener-instance (if present) or in a 'static way'.
				 * @param {object} [oListener] Object on which to call the given function.
				 * @returns {my.control.library.Badge} a reference to <code>this</code> to allow method chaining
				 */
				attachPress: function(oData, fnHandler, oListener) {
					this.attachEvent("press", oData, fnHandler, oListener);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_HAS_EVENT_LISTENER, this.hasListeners("press"));
					return this;
				},
				/**
				 * Detach press handler
				 *
				 * @param {function} fnHandler The function to call, when the event occurs.
				 * @param {object} oListener Object on which the given function had to be called.
				 * @return {sap.ui.core.routing.Targets} <code>this</code> to allow method chaining
				 * @public
				 */
				detachPress: function(fnHandler, oListener) {
					this.detachEvent("press", fnHandler, oListener);
					this.toggleStyleClass(this.CSS_CLASSES.CSS_HAS_EVENT_LISTENER, this.hasListeners("press"));
					return this;
				},
				/***************************************************/
				/* Private Methods                                 */
				/***************************************************/
				/**
				 *
				 * @param {string} sProperty CSS property name
				 * @param {string} sValue CSS value
				 * @param {string} [sSelector] a CSS class to select a child element of this badge
				 * @private
				 */
				_setInlineOverrideStyling: function(sProperty, sValue, sSelector) {
					sValue = sValue || "";
					var $element = sSelector ? this.$().find("." + sSelector) : this.$();
					this._inlineStyleCache = this._inlineStyleCache || {};
					this._inlineStyleCache[sSelector] = this._inlineStyleCache[sSelector] || {};
					this._inlineStyleCache[sSelector][sProperty] = sValue;
					$element.css(sProperty, sValue);
				},
				/**
				 * Updates the style tag of this control to reflect the style for iconActiveColor and iconActiveBackgroundColor
				 * @private
				 */
				_updateOverrideStyling: function() {
					var $styletag = this.$().find("style#" + this.getId() + "-style");
					$styletag.text(this._getOverrideStyleTagText());
				},
				/**
				 * Generates the styletag Text to be written into the style tag
				 * @private
				 * @return {string} the css selector + rules
				 */
				_getOverrideStyleTagText: function() {
					var sCSS =
						"#" +
						this.getId() +
						"." +
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON_ACTIVE +
						" ." +
						this.CSS_CLASSES.CSS_ADDITIONAL_ICON +
						"{";
					sCSS += "color: " + this.getIconActiveColor() + ";";
					sCSS += "background-color: " + this.getIconActiveBackgroundColor() + ";";
					sCSS += "border-color: " + this.getIconActiveBackgroundColor() + ";";
					sCSS += "}";
					return sCSS;
				},
				/**
				 * Apply all cached style settings (e.g. after rerendering)
				 * @private
				 */
				_applyAllSetStyles: function() {
					if (this._inlineStyleCache) {
						for (var sSelector in this._inlineStyleCache) {
							var oStyles = this._inlineStyleCache[sSelector];
							var $element = sSelector === "undefined" ? this.$() : this.$().find("." + sSelector);
							for (var sProperty in oStyles) {
								$element.css(sProperty, oStyles[sProperty]);
							}
						}
					}
				}
			}
		);

		return Badge;
	},
	/* bExport= */ true
);
