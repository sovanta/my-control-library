sap.ui.define(
	[
		"jquery.sap.global",
		"sap/m/ListItemBase",
		"sap/ui/core/Icon",
		"./CounterBadge",
		"./CheckBox",
		"./RadioButton",
		"./library"
	],
	function(jQuery, ListItemBase, Icon, CounterBadge, CheckBox, RadioButton, library) {
		"use strict";
		/**
		 * Constructor for a new ListItem.
		 *
		 * @param {string} [sId] Id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 *
		 * @extends sap.m.ListItemBase
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @since 0.5.0
		 * @alias my.control.library.ListItem
		 */

		var ListItem = ListItemBase.extend(
			"my.control.library.ListItem",
			/** @lends my.control.library.ListItem.prototype */
			{
				metadata: {
					library: "my.control.library",
					properties: {
						/**
						 * Active status
						 */
						enabled: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Shows title in bold at the upper left corner
						 */
						title: {
							type: "string",
							defaultValue: null
						},
						/**
						 * Shows description below title
						 */
						description: {
							type: "string",
							defaultValue: null
						},
						/**
						 * Shows value upper right corner
						 */
						value: {
							type: "string",
							defaultValue: null
						},
						/**
						 * Shows information below value
						 */
						info: {
							type: "string",
							defaultValue: null
						},
						/**
						 * Highlight below value
						 */
						highlightText: {
							type: "string",
							defaultValue: null
						},
						/**
						 * Highlight  (None, Success, Warning, Error, Default company color) for left border color
						 */
						highlight: {
							type: "my.control.library.Highlight",
							defaultValue: "None"
						},
						/**
						 * Highlight state (None, Success, Warning, Error, Default company color) for icon and text
						 */
						highlightState: {
							type: "my.control.library.Highlight",
							defaultValue: "None"
						},
						/**
						 * Icon value below value
						 */
						iconSrc: {
							type: "sap.ui.core.URI",
							defaultValue: null
						},
						/**
						 * Allow to interact with the favorite icon
						 */
						allowFavor: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Turns icon into favorite action
						 */
						isFavorite: {
							type: "boolean",
							defaultValue: false
						},
						/**
						 * Show Favorite Icon
						 */
						showFavorite: {
							type: "boolean",
							defaultValue: false
						},
						/**
						 * When set to false text will not be displayed in multiline,
						 * instead it will be shown with (...) at the end
						 */
						wrapDescription: {
							type: "boolean",
							defaultValue: true
						}
					},
					aggregations: {
						/**
						 * Show any control in the left side
						 */
						preControl: {
							type: "sap.ui.core.Control",
							multiple: false
						},
						/**
						 * Can be set from outside to provide an custom count indicator.
						 * Counter Property will be ignored when this aggregation is set
						 */
						customCounter: {
							type: "my.control.library.CounterBadge",
							multiple: false
						},
						/**
						 * The icon control of the ListItem
						 */
						_icon: {
							type: "sap.ui.core.Icon",
							multiple: false,
							visibility: "hidden"
						},
						/**
						 * The favorite icon of the ListItem
						 */
						_favoriteIcon: {
							type: "sap.ui.core.Icon",
							multiple: false,
							visibility: "hidden"
						},
						/**
						 * The CounterBadge control of the ListItem
						 */
						_counter: {
							type: "sap.ui.core.Icon",
							multiple: false,
							visibility: "hidden"
						}
					},
					events: {
						/**
						 * Favorite icon is clicked
						 * */
						favoriteChange: {
							parameters: {
								isFavorite: {
									type: "boolean"
								}
							}
						},
						/**
						 * Icon is pressed
						 */
						iconPress: {
							parameters: {
								/**
								 * pressed icon
								 */
								icon: {}
							}
						}
					}
				},
				renderer: "my.control.library.ListItemRenderer",

				// icon URI configuration
				DetailIconURI: "sap-icon://myControlLibrary/edit",
				DeleteIconURI: "sap-icon://myControlLibrary/close",
				NavigationIconURI: "sap-icon://myControlLibrary/chevron-light-right",
				FavoriteIconUri: "sap-icon://myControlLibrary/favorite-filled",
				UnFavoriteIconUri: "sap-icon://myControlLibrary/favorite-outline",

				/**
				 * CSS classes map.
				 * @type {Object}
				 * @private
				 */
				CSS_CLASSES_LISTITEM: {
					CSS_BASE: "myControlLibrary_ListItem",
					CSS_HIGHLIGHT_BAR: "myControlLibrary_ListItem_highlightBar",
					CSS_CONTAINER: "myControlLibrary_ListItem_container",
					CSS_PRE_CONTROL: "myControlLibrary_ListItem_preControl",
					CSS_BODY: "myControlLibrary_ListItem_body",
					CSS_TITLE: "myControlLibrary_ListItem_title",
					CSS_DESCRIPTION: "myControlLibrary_ListItem_description",
					CSS_DESCRIPTION_NO_WRAP: "myControlLibrary_ListItem_description-noWrap",
					CSS_VALUE: "myControlLibrary_ListItem_value",
					CSS_INFO: "myControlLibrary_ListItem_info",
					CSS_HIGHLIGHT_TEXT: "myControlLibrary_ListItem_highlightText",
					CSS_ICON: "myControlLibrary_ListItem_icon",
					CSS_FAVORITE_ICON: "myControlLibrary_ListItem_favoriteIcon",
					CSS_FAVORITE_ICON_FAVORITE: "myControlLibrary_ListItem_favoriteIcon-favorite",
					CSS_COUNTER: "myControlLibrary_ListItem_counter",

					// Highlight
					CSS_HIGHLIGHT_NONE: "myControlLibrary_ListItem_Highlight_None",
					CSS_HIGHLIGHT_DEFAULT: "myControlLibrary_ListItem_Highlight_Default",
					CSS_HIGHLIGHT_ERROR: "myControlLibrary_ListItem_Highlight_Error",
					CSS_HIGHLIGHT_SUCCESS: "myControlLibrary_ListItem_Highlight_Success",
					CSS_HIGHLIGHT_WARNING: "myControlLibrary_ListItem_Highlight_Warning",

					// Highlight States
					CSS_HIGHLIGHT_STATE_NONE: "myControlLibrary_ListItem_Highlight_State_None",
					CSS_HIGHLIGHT_STATE_DEFAULT: "myControlLibrary_ListItem_Highlight_State_Default",
					CSS_HIGHLIGHT_STATE_ERROR: "myControlLibrary_ListItem_Highlight_State_Error",
					CSS_HIGHLIGHT_STATE_SUCCESS: "myControlLibrary_ListItem_Highlight_State_Success",
					CSS_HIGHLIGHT_STATE_WARNING: "myControlLibrary_ListItem_Highlight_State_Warning"
				},

				/**
				 * Init called while creation of an new Instance of this Control
				 * @access public
				 */
				init: function() {
					ListItemBase.prototype.init.apply(this, arguments);
					this.addStyleClass(this.CSS_CLASSES_LISTITEM.CSS_BASE);
					// init private members
					this._favoriteIcon = null;
				},

				exit: function() {
					var oCounter = this.getAggregation("_counter");
					var oFavoriteIcon = this.getAggregation("_favoriteIcon");

					if (oCounter) {
						oCounter.destroy();
					}

					if (oFavoriteIcon) {
						oFavoriteIcon.destroy();
					}
				},

				/**
				 * Setter for the <code>HighlightState</code> property
				 * @access public
				 * @param sState {string}
				 * @returns {my.control.library.ListItem} Control instance for method chaining
				 */
				setHighlightState: function(sState) {
					this.toggleStyleClass(this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_STATE_NONE, sState === library.Highlight.None);
					this.toggleStyleClass(
						this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_STATE_DEFAULT,
						sState === library.Highlight.Default
					);
					this.toggleStyleClass(
						this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_STATE_ERROR,
						sState === library.Highlight.Error
					);
					this.toggleStyleClass(
						this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_STATE_SUCCESS,
						sState === library.Highlight.Success
					);
					this.toggleStyleClass(
						this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_STATE_WARNING,
						sState === library.Highlight.Warning
					);

					this.setProperty("highlightState", sState);
					return this;
				},

				/**
				 * Setter for the <code>Highlight</code> property
				 * @access public
				 * @param sState {string}
				 * @returns {my.control.library.ListItem} Control instance for method chaining
				 */
				setHighlight: function(sState) {
					this.toggleStyleClass(this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_NONE, sState === library.Highlight.None);
					this.toggleStyleClass(this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_DEFAULT, sState === library.Highlight.Default);
					this.toggleStyleClass(this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_ERROR, sState === library.Highlight.Error);
					this.toggleStyleClass(this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_SUCCESS, sState === library.Highlight.Success);
					this.toggleStyleClass(this.CSS_CLASSES_LISTITEM.CSS_HIGHLIGHT_WARNING, sState === library.Highlight.Warning);

					this.setProperty("highlightState", sState);
					this.setProperty("highlight", sState);
					return this;
				},

				/**
				 * Setter for the <code>iconSrc</code> property
				 * @access public
				 * @param sIconSrc {string}
				 * @returns {my.control.library.ListItem} Control instance for method chaining
				 */
				setIconSrc: function(sIconSrc) {
					let oIcon = this.getAggregation("_icon");
					if (!oIcon) {
						oIcon = new Icon({
							src: sIconSrc,
							press: function(oEvent) {
								this.fireIconPress({ icon: oEvent.getSource() });
							}.bind(this)
						});
						this.setAggregation("_icon", oIcon);
					} else {
						oIcon.setSrc(sIconSrc);
					}
					this.setProperty("iconSrc", sIconSrc);
					return this;
				},

				/**
				 * Setter for the <code>isFavorite</code> property
				 * @access public
				 * @param sIconSrc {string}
				 * @returns {my.control.library.ListItem} Control instance for method chaining
				 */
				setIsFavorite: function(bIsFavorite) {
					var oFavoriteIcon = this._getFavoriteIcon(),
						bIsFavorite = !!bIsFavorite;
					oFavoriteIcon.toggleStyleClass(this.CSS_CLASSES_LISTITEM.CSS_FAVORITE_ICON_FAVORITE, bIsFavorite);
					if (bIsFavorite) {
						oFavoriteIcon.setSrc(this.FavoriteIconUri);
					} else {
						oFavoriteIcon.setSrc(this.UnFavoriteIconUri);
					}
					this.setProperty("isFavorite", bIsFavorite);
					return this;
				},

				/**
				 * Returns RadioButton control when mode is one of Single Selection type
				 * @return {my.control.library.RadioButton}
				 * @public
				 */
				getSingleSelectControl: function() {
					if (this._oSingleSelectControl) {
						return this._oSingleSelectControl;
					}
					this._oSingleSelectControl = new RadioButton({
						id: this.getId() + "-selectSingle",
						groupName: this.getListProperty("id") + "_selectGroup",
						activeHandling: false,
						selected: this.getSelected()
					})
						.setParent(this, null, true)
						.setTabIndex(-1)
						.attachSelect(function(oEvent) {
							var bSelected = oEvent.getParameter("selected");
							this.setSelected(bSelected);
							this.informList("Select", bSelected);
						}, this);
					return this._oSingleSelectControl;
				},

				/**
				 * Returns CheckBox control when mode is MultiSelection
				 * @return {my.control.library.CheckBox}
				 * @public
				 */
				getMultiSelectControl: function() {
					if (this._oMultiSelectControl) {
						return this._oMultiSelectControl;
					}
					this._oMultiSelectControl = new CheckBox({
						id: this.getId() + "-selectMulti",
						activeHandling: false,
						selected: this.getSelected()
					})
						.setParent(this, null, true)
						.setTabIndex(-1)
						.attachSelect(function(oEvent) {
							var bSelected = oEvent.getParameter("selected");
							this.setSelected(bSelected);
							this.informList("Select", bSelected);
						}, this);
					return this._oMultiSelectControl;
				},

				//*************************************//
				//              PRIVATE                //
				//*************************************//

				/**
				 * Returns CounterBadge control
				 * @return {my.control.library.CounterBadge}
				 * @private
				 */
				_getCounter: function(iCounter) {
					if (!this.getAggregation("_counter")) {
						var oCounter = new CounterBadge({ notificationCount: iCounter });
						this.setAggregation("_counter", oCounter);
					}
					return this.getAggregation("_counter");
				},

				/**
				 * Returns FavoriteIcon control
				 * @returns {sap.ui.core.Icon}
				 * @private
				 */
				_getFavoriteIcon: function() {
					if (!this._favoriteIcon) {
						this._favoriteIcon = new Icon({
							src: this.UnFavoriteIconUri
						}).addStyleClass(this.CSS_CLASSES_LISTITEM.CSS_FAVORITE_ICON);
						this._favoriteIcon.attachPress(this._iconFavoritePress, this);
						this.setAggregation("_favoriteIcon", this._favoriteIcon);
					}
					return this.getAggregation("_favoriteIcon");
				},
				/**
				 * Handles FavoriteIcon Press Event
				 * @param oEvent {object}
				 * @access private
				 */
				_iconFavoritePress: function(oEvent) {
					if (this.getAllowFavor()) {
						var oSource = oEvent.getSource();
						// set property and toggle style class
						this.setIsFavorite(!this.getIsFavorite());
						this.fireFavoriteChange({ isFavorite: this.getIsFavorite() });
					}
				}
			}
		);

		return ListItem;
	},
	/* bExport= */ true
);
