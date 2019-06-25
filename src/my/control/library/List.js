sap.ui.define(
	["jquery.sap.global", "sap/m/List", "./GrowingEnablement", "./library"],
	function(jQuery, MList, GrowingEnablement, library) {
		"use strict";
		/**
		 * Constructor for a new List.
		 *
		 * @param {string} [sId] Id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 *
		 * @extends sap.m.List
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @since 0.5.0
		 * @alias my.control.library.List
		 */

		var List = MList.extend(
			"my.control.library.List",
			/** @lends my.control.library.List.prototype */
			{
				metadata: {
					library: "my.control.library",

					properties: {
						/**
						 * Render icon or image when there is no data
						 */
						noDataImage: {
							type: "sap.ui.core.URI",
							defaultValue: ""
						},
						/**
						 * Show or hide no data image
						 */
						showNoDataImage: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Display/Hide Aggregation noDataContent
						 */
						showNoDataContent: {
							type: "boolean",
							defaultValue: false
						},
						/**
						 * Defines which item separator style will be used
						 */
						showSeparators: {
							type: "my.control.library.ListSeparators",
							group: "Appearance",
							defaultValue: "None"
						},
						/**
						 * Defines background type (Default, Alternate)
						 */
						backgroundDesign: {
							type: "my.control.library.ListBackgroundDesign",
							defaultValue: "Default"
						}
					},
					aggregations: {
						/**
						 * Control shown when there is no data
						 */
						noDataContent: {
							type: "sap.ui.core.Control",
							multiple: false
						},
						/**
						 * Control: Image or icon depending on the noDataImage URI
						 */
						_noDataImageContent: {
							type: "sap.ui.core.Control",
							multiple: false,
							visibility: "hidden"
						}
					}
				},
				renderer: "my.control.library.ListRenderer",

				/**
				 * CSS classes map.
				 * @type {Object}
				 * @private
				 */
				CSS_CLASSES_LIST: {
					CSS_BASE: "myControlLibrary_List",
					CSS_NO_DATA_WRAP: "myControlLibrary_List_noDataWrap",
					CSS_NO_DATA_IMAGE: "myControlLibrary_List_noDataWrap_image",
					CSS_NO_DATA_CONTENT: "myControlLibrary_List_noDataContent",
					CSS_BACKGROUND_ALTERNATE: "myControlLibrary_List_alternateBackground"
				},

				/**
				 * Init called while creation of an new Instance of this Control
				 * @access public
				 */
				init: function() {
					if (MList.prototype.init) {
						MList.prototype.init.apply(this, arguments);
					}

					this.addStyleClass(this.CSS_CLASSES_LIST.CSS_BASE);
				},

				/**
				 * Setter for <code>NoDataContent</code> property
				 * @access public
				 * @param oControl
				 * @returns {my.control.library.List} Control instance for method chaining
				 */
				setNoDataContent: function(oControl) {
					if (oControl) {
						oControl.addStyleClass(this.CSS_CLASSES_LIST.CSS_NO_DATA_CONTENT);
					}
					this.setAggregation("noDataContent", oControl);
					return this;
				},

				/**
				 * Setter for <code>NoDataImage</code> property
				 * @access public
				 * @param sUri {string}
				 * @returns {my.control.library.List} Control instance for method chaining
				 */
				setNoDataImage: function(sUri) {
					var regIcon = new RegExp(/sap-icon:\/\//g),
						isIcon = regIcon.test(sUri),
						oControl = null;
					if (isIcon) {
						oControl = new sap.ui.core.Icon({ src: sUri });
					} else {
						oControl = new sap.m.Image({
							src: sUri,
							width: "75%"
						});
					}
					oControl.addStyleClass(this.CSS_CLASSES_LIST.CSS_NO_DATA_IMAGE);
					this.setAggregation("_noDataImageContent", oControl);
					this.setProperty("noDataImage", sUri);
					return this;
				},

				/**
				 * Setter for <code>alternateBackground</code> property
				 * @access public
				 * @param sValue
				 * @returns {my.control.library.List} Control instance for method chaining
				 */
				setBackgroundDesign: function(sValue) {
					this.toggleStyleClass(
						this.CSS_CLASSES_LIST.CSS_BACKGROUND_ALTERNATE,
						sValue === library.ListBackgroundDesign.Alternate
					);
					this.setProperty("backgroundDesign", sValue);
					return this;
				},

				/**
				 * Setter for Growing Behaviour of the List
				 * @param bGrowing
				 * @returns {my.control.library.List} Control instance for method chaining
				 */
				setGrowing: function(bGrowing) {
					MList.prototype.setGrowing.apply(this, arguments);
					//If GrowingEnablement is set replace it with Library Control
					if (this._oGrowingDelegate) {
						this._oGrowingDelegate.destroy();
						this._oGrowingDelegate = new GrowingEnablement(this);
					}
					return this;
				}
			}
		);

		return List;
	},
	/* bExport= */ true
);
