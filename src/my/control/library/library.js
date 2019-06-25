sap.ui.define(
	["jquery.sap.global", "sap/ui/base/DataType", "./utils/LibraryUtils", "sap/ui/core/library"],
	function(jQuery, DataType, LibraryUtils) {
		"use strict";

		/****************************/
		/* ******* Variables ****** */
		/****************************/

		var oLibUtils = new LibraryUtils();

		//Library custom glyphs (icons)
		var aFontConfig = [{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Add","code":"e900"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Arrow-Backward","code":"e901"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Arrow-Forward","code":"e902"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Attachement","code":"e903"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Bug","code":"e904"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Calendar","code":"e905"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Camera","code":"e906"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Campaigns","code":"e907"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Card","code":"e908"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Checkmark","code":"e909"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Chevron-Add","code":"e90a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Chevron-Down","code":"e90b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Chevron-Up","code":"e90c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Cloud-Download","code":"e90d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Cloud-Upload","code":"e90e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Collapse-Down","code":"e90f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Collapse-Left","code":"e910"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Collapse-Right","code":"e911"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Collapse-Up","code":"e912"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Colorbucket","code":"e913"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Company","code":"e914"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Curriculum","code":"e915"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Customers","code":"e916"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Dashboard","code":"e917"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Delete","code":"e918"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Diagramm","code":"e919"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Divider","code":"e91a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Blank-File","code":"e91b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Draft","code":"e91c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Excel","code":"e91d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Illustrator","code":"e91e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Notes","code":"e91f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-PDF","code":"e920"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Photoshop","code":"e921"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Powerpoint","code":"e922"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Proposal","code":"e923"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Received","code":"e924"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Requested","code":"e925"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Sketch","code":"e926"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Word","code":"e927"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Document-Zip-File","code":"e928"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Download-Active","code":"e929"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Download-Normal","code":"e92a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Drag","code":"e92b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Edit","code":"e92c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Enhancement","code":"e92d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Exlemationmark","code":"e92e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Favorite-Empty","code":"e92f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Favorite-Filled","code":"e930"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Filter","code":"e931"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Folder","code":"e932"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Fullscreen","code":"e933"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Gallery-Grid","code":"e934"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Gallery-Single","code":"e935"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Garage","code":"e936"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"GPS","code":"e937"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Headline","code":"e938"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"iFrame","code":"e939"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Image","code":"e93a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Information-Normal","code":"e93b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Information-Round","code":"e93c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Invitation","code":"e93d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Lecture","code":"e93e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Link","code":"e93f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"List","code":"e940"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Location-Marker","code":"e941"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Lock-Closed","code":"e942"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Lock-Open","code":"e943"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Mail","code":"e944"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Mandatory","code":"e945"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Map-Layers","code":"e946"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Menu","code":"e947"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Milestone","code":"e948"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Mobile","code":"e949"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"More","code":"e94a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Move","code":"e94b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Notebook","code":"e94c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Notification-Added","code":"e94d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Notification-Removed","code":"e94e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Notification-Update","code":"e94f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Number","code":"e950"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Open","code":"e951"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Oval-","code":"e952"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Paper-Plane","code":"e953"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Payments-Euro","code":"e954"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Person","code":"e955"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Phone","code":"e956"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Pin","code":"e957"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Print","code":"e958"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Profile","code":"e959"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Projects","code":"e95a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Questionmark","code":"e95b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Rectangle","code":"e95c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Redo","code":"e95d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Reminder","code":"e95e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Remove","code":"e95f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Replace","code":"e960"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Resize","code":"e961"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Rich-Text","code":"e962"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Search","code":"e963"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Section","code":"e964"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Settings","code":"e965"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Share","code":"e966"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Slack","code":"e967"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Sort","code":"e968"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Sync","code":"e969"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Text-Center-Align","code":"e96a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Text-Left-Align","code":"e96b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Text-Right-Align","code":"e96c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Textarea-Expander","code":"e96d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Textedit","code":"e96e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Time","code":"e96f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"To-Do´s","code":"e970"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Today","code":"e971"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Transfer-Requested","code":"e972"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Transfer-Send","code":"e973"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Transfer-Success","code":"e974"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Undo","code":"e975"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Upload","code":"e976"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Airplay","code":"e977"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Backward","code":"e978"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Exit-Fullscreen","code":"e979"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Fast-Backward","code":"e97a"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Fast-Forward","code":"e97b"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Forward","code":"e97c"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Pause","code":"e97d"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-Play","code":"e97e"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video-Player-RePlay","code":"e97f"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Video","code":"e980"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Warning-Dot","code":"e981"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Warning","code":"e982"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"World","code":"e983"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Close-Circle","code":"e984"},{"namespace":"myControlLibrary","fontFamily":"myControlLibrary","name":"Close-Normal","code":"e985"}];

		/**********************************/
		/* ******* Function Calls ****** */
		/*********************************/

		oLibUtils.registerFontGlyphs(aFontConfig);

		oLibUtils.loadFont("my.control.library", "myControlLibrary", "iconFont/myControlLibrary/myControlLibrary", false, true);

		oLibUtils.loadFont("my.control.library", "openSans", {
			Light: "font/openSans/openSans-Light",
			Regular: "font/openSans/openSans-Regular",
			SemiBold: "font/openSans/openSans-SemiBold",
			Bold: "font/openSans/openSans-Bold"
		});
		oLibUtils.setLibraryBaseFont("openSans");

		/*************************************/
		/* **** Library Initialization ***** */
		/*************************************/
		/**
		 * SAPUI5 library with controls
		 *
		 * @namespace
		 * @name my.control.library
		 * @author sovanta AG
		 * @version ${version}
		 * @public
		 */
		sap.ui.getCore().initLibrary({
			name: "my.control.library",
			version: "${version}",
			dependencies: ["sap.ui.core", "sap.m", "sap.ui.unified"],
			types: [
				"my.control.library.CSSSize",
				"my.control.library.ControlDesign",
				"my.control.library.ButtonType",
				"my.control.library.ButtonShape",
				"my.control.library.ButtonSemanticType",
				"my.control.library.ButtonSize",
				"my.control.library.BusyIndicatorType",
				"my.control.library.BusyIndicatorSize",
				"my.control.library.ToastState",
				"my.control.library.ToastCloseIconMode",
				"my.control.library.BadgeType",
				"my.control.library.BadgeShape",
				"my.control.library.BadgeSize",
				"my.control.library.BadgeIconPosition",
				"my.control.library.ListSeparators",
				"my.control.library.Highlight",
				"my.control.library.ListBackgroundDesign",
				"my.control.library.CardType",
				"my.control.library.CardSize",
				"my.control.library.CardImageFit",
				"my.control.library.CardItemShape",
				"my.control.library.CardItemSize",
				"my.control.library.TooltipPosition",
				"my.control.library.SortOrder"
			],
			interfaces: ["my.control.library.Interface", "my.control.library.IAggregationMapper", "my.control.library.IBusyIndicator"],
			controls: [ "my.control.library.Badge","my.control.library.Button","my.control.library.Cube","my.control.library.IAggregationMapper","my.control.library.IBusyIndicator","my.control.library.Interface","my.control.library.List","my.control.library.ListItem","my.control.library.Loader","my.control.library.Spinner" ],
			elements: []
		});

		/*************************************/
		/* ******* Method Definition  ****** */
		/*************************************/

		/*************************************/
		/* ******* Library Definition ****** */
		/*************************************/

		/**
		 * @classdesc A string type that represents CSS size values.
		 *
		 * The CSS specifications calls this the <code>'&lt;length&gt; type'</code>.
		 * Allowed values are CSS sizes like "1px" or "2em" or "50%". The special values <code>auto</code>
		 * and <code>inherit</code> are also accepted as well as mathematical expressions using the CSS3
		 * <code>calc(<i>expression</i>)</code> operator.
		 *
		 * Note that CSS does not allow all these values for every CSS property representing a size.
		 * E.g. <code>padding-left</code> doesn't allow the value <code>auto</code>. So even if a value is
		 * accepted by <code>sap.ui.core.CSSSize</code>, it still might have no effect in a specific context.
		 * In other words: UI5 controls usually don't extend the range of allowed values in CSS.
		 *
		 *
		 * <b>Units</b>
		 *
		 * Valid font-relative units are <code>em, ex</code>, <code>rem</code> and <code>vh, vw</code>. Supported absolute units
		 * are <code>cm, mm, in, pc, pt</code> and <code>px</code>. Other units are not supported yet.
		 *
		 *
		 * <b>Mathematical Expressions</b>
		 *
		 * Expressions inside the <code>calc()</code> operator are only roughly checked for validity.
		 * Not every value that this type accepts might be a valid expression in the sense of the CSS spec.
		 * But vice versa, any expression that is valid according to the spec should be accepted by this type.
		 * The current implementation is based on the
		 * {@link http://dev.w3.org/csswg/css-values-3/#calc-syntax CSS3 Draft specification from 22 April 2015}.
		 *
		 * Noteworthy details:
		 * <ul>
		 * <li>whitespace is mandatory around a '-' or '+' operator and optional otherwise</li>
		 * <li>parentheses are accepted but not checked for being balanced (a limitation of regexp based checks)</li>
		 * <li>semantic constraints like type restrictions are not checked</li>
		 * </ul>
		 *
		 * @final
		 * @namespace
		 * @public
		 * @ui5-metamodel This simple type also will be described in the UI5 (legacy) designtime metamodel
		 */
		my.control.library.CSSSize = DataType.createType(
			"my.control.library.CSSSize",
			{
				isValid: function(vValue) {
					return new RegExp(
						"^(auto|inherit|[-+]?(0*|([0-9]+|[0-9]*.[0-9]+)([vV][wW]|[vV][hH]|[rR][eE][mM]|[eE][mM]|[eE][xX]|[pP][xX]|[cC][mM]|[mM][mM]|[iI][nN]|[pP][tT]|[pP][cC]|%))|calc(s*((s*)*[-+]?(([0-9]+|[0-9]*.[0-9]+)([vV][wW]|[vV][hH]|[rR][eE][mM]|[eE][mM]|[eE][xX]|[pP][xX]|[cC][mM]|[mM][mM]|[iI][nN]|[pP][tT]|[pP][cC]|%)?)(s*()s*)*(s[-+]s|[*/])s*((s*)*([-+]?(([0-9]+|[0-9]*.[0-9]+)([vV][wW]|[vV][hH]|[rR][eE][mM]|[eE][mM]|[eE][xX]|[pP][xX]|[cC][mM]|[mM][mM]|[iI][nN]|[pP][tT]|[pP][cC]|%)?)))*s*()s*)*))$"
					).test(vValue);
				}
			},
			DataType.getType("string")
		);

		/**
		 * Control Design can be used to provide different Stylings for an Control within the same Theme. E.g. Design for Dark Backgrounds
		 * @enum {string}
		 * @type {{Default: string, Inverted: string}}
		 * @public
		 */
		my.control.library.ControlDesign = {
			/**
			 * Default Design of the Control
			 * @public
			 */
			Default: "Default",

			/**
			 * Inverted Design of the Control
			 * @public
			 */
			Inverted: "Inverted"
		};

		/**
		 * Button Type can be used to switch between different Button Type Designs
		 * @enum {string}
		 * @type {{Filled: string, Ghost: string}}
		 * @public
		 */
		my.control.library.ButtonType = {
			/**
			 * Filled Type Design of the Control
			 * @public
			 */
			Filled: "Filled",

			/**
			 * Ghost Type Design of the Control
			 * @public
			 */
			Ghost: "Ghost"
		};

		/**
		 * Button Shape can be used the switch between different Button Shapes
		 * @enum {string}
		 * @type {{Regular: string, Circle: string, Square: string}}
		 * @public
		 */
		my.control.library.ButtonShape = {
			/**
			 * Regular Shape Design of the Control
			 * @public
			 */
			Regular: "Regular",

			/**
			 * Circle Shape Design of the Control
			 * @public
			 */
			Circle: "Circle",

			/**
			 * Square Shape Design of the Control
			 * @public
			 */
			Square: "Square"
		};

		/**
		 * Button SemanticType can be used to Stlye the Button Control for different Semantic meanings
		 * @enum {string}
		 * @type {{Basic: string, Highlight: string, Sales: string}}
		 * @public
		 */
		my.control.library.ButtonSemanticType = {
			/**
			 * Basic Semantic Type of the Control
			 * @public
			 */
			Basic: "Basic",

			/**
			 * Highlight Semantic Type of the Control
			 * @public
			 */
			Highlight: "Highlight",

			/**
			 * Sales Semantic Type of the Control
			 * @public
			 */
			Sales: "Sales"
		};

		/**
		 * Predefined size of a Button
		 * @enum {string}
		 * @type {{Big: string, Small: string}}
		 * @public
		 */
		my.control.library.ButtonSize = {
			/**
			 * Big Button Style
			 * @public
			 */
			Big: "Big",

			/**
			 * Small Button Style
			 * @public
			 */
			Small: "Small"
		};

		/**
		 * BusyIndicator Type that should be used
		 * @enum {string}
		 * @type {{Loader: string, Spinner: string}}
		 * @public
		 */
		my.control.library.BusyIndicatorType = {
			/**
			 * Loader Style
			 * @public
			 */
			Loader: "Loader",

			/**
			 * Spinner Style
			 * @public
			 */
			Spinner: "Spinner"
		};

		/**
		 * Configuration options for the BusyIndicator size
		 * @enum {string}
		 * @type {{Auto: string, XtraSmall: string, Small: string, Medium: string, Large: string}}
		 * @public
		 */
		my.control.library.BusyIndicatorSize = {
			/**
			 * Type: automatic size detection
			 * @public
			 */
			Auto: "Auto",

			/**
			 * Type: extra small size
			 * @public
			 */
			XtraSmall: "XtraSmall",

			/**
			 * Type: small size
			 * @public
			 */
			Small: "Small",

			/**
			 * Type: Medium size
			 * @public
			 */
			Medium: "Medium",

			/**
			 * Type: Large size
			 * @public
			 */
			Large: "Large"
		};

		/**
		 * Defines the State of an Toast/BusyIndicator
		 * @enum {string}
		 * @type {{None: string, Default: string, Success: string, Warning: string, Error: string}}
		 * @public
		 */
		my.control.library.ToastState = {
			/**
			 * None State
			 * @public
			 */
			None: "None",

			/**
			 * Success State
			 * @public
			 */
			Success: "Success",

			/**
			 * Warning State
			 * @public
			 */
			Warning: "Warning",

			/**
			 * Error State
			 * @public
			 */
			Error: "Error"
		};

		/**
		 * Defines the Hide Icon Mode for an Toast.
		 * @enum {string}
		 * @type {{Auto: string, Visible: string, Hidden: string}}
		 * @public
		 */
		my.control.library.ToastCloseIconMode = {
			/**
			 * Auto State. Show Close icon depending on 'autoClose' Property
			 * @public
			 */
			Auto: "Auto",

			/**
			 * Visible State. Close Icon is visible independent from 'autoClose' Property
			 * @public
			 */
			Visible: "Visible",

			/**
			 * Hidden State. Close Icon is hidden independent from 'autoClose' Property.
			 * Take Care when atoHide is set to false and Hidden mode is used the user can't remove the Toast with any Userinteraction.
			 * @public
			 */
			Hidden: "Hidden"
		};

		/**
		 * Sets the Badge Type
		 * @enum {string}
		 * @type {{Light: string, Bold: string}}
		 * @public
		 */
		my.control.library.BadgeType = {
			/**
			 * Light Type
			 * @public
			 */
			Light: "Light",
			/**
			 * Bold Design: Border and Content filled
			 * @public
			 */
			Bold: "Bold"
		};

		/**
		 * Sets the Badge Shape
		 * @enum {string}
		 * @type {{Circle: string, Square: string}}
		 * @public
		 */
		my.control.library.BadgeShape = {
			/**
			 * Circle (Default)
			 * @public
			 */
			Circle: "Circle",
			/**
			 * Square
			 * @public
			 */
			Square: "Square"
		};

		/**
		 * Sets the Badge Size
		 * @enum {string}
		 * @type {{Small: string, Medium: string, Large: string}}
		 * @public
		 */
		my.control.library.BadgeSize = {
			/**
			 * Small
			 * @public
			 */
			Small: "Small",
			/**
			 * Medium
			 * @public
			 */
			Medium: "Medium",
			/**
			 * Large
			 * @public
			 */
			Large: "Large"
		};

		/**
		 * Badge Icon Position (small additional icon placed at the border of the Badge)
		 * @enum {string}
		 * @type {{TopLeft: string, TopRight: string, BottomRight: string, BottomLeft: string}}
		 * @public
		 */
		my.control.library.BadgeIconPosition = {
			/**
			 * Top Left Corner
			 * @public
			 */
			TopLeft: "TopLeft",
			/**
			 * Top Right Corner
			 * @public
			 */
			TopRight: "TopRight",
			/**
			 * Bottom Right Corner
			 * @public
			 */
			BottomRight: "BottomRight",
			/**
			 * Bottom Left Corner
			 * @public
			 */
			BottomLeft: "BottomLeft"
		};

		/**
		 *  Available Types of Cards
		 * @enum {string}
		 * @public
		 */
		my.control.library.CardType = {
			/**
			 * Default Type
			 * @public
			 */
			Default: "Default",

			/**
			 * Create Type (e.g. Add new Item scenario)
			 * @public
			 */
			Create: "Create"
		};
		/**
		 *  Available Sizes for an Card Control
		 * @enum {string}
		 * @public
		 */
		my.control.library.CardSize = {
			/**
			 * Large Card
			 * @public
			 */
			Large: "Large",

			/**
			 * Medium Card
			 * @public
			 */
			Medium: "Medium",

			/**
			 * Small Card (e.g. Phone scenario)
			 * @public
			 */
			Small: "Small"
		};

		/**
		 * Defines the Image Fit Style of the inner Badge Control.
		 * @type {{Fill: string, Contain: string, Cover: string, ScaleDown: string, None: string}}
		 * @enum {string}
		 * @public
		 */
		my.control.library.CardImageFit = {
			/**
			 * The replaced content is sized to fill the element's content box. If necessary, the object will be stretched or squished to fit
			 * @public
			 */
			Fill: "Fill",
			/**
			 * The replaced content is scaled to maintain its aspect ratio while fitting within the element's content box
			 * @public
			 */
			Contain: "Contain",
			/**
			 * The replaced content is sized to maintain its aspect ratio while filling the element's entire content box. The object will be clipped to fit
			 * @public
			 */
			Cover: "Cover",
			/**
			 * The content is sized as if none or contain were specified (would result in a smaller concrete object size)
			 * @public
			 */
			ScaleDown: "ScaleDown",
			/**
			 * The replaced content is not resized
			 * @public
			 */
			None: "None"
		};

		/**
		 * CardItem Shape can be used the switch between different CardItem Shapes
		 * @enum {string}
		 * @type {{Circle: string}}
		 * @public
		 */
		my.control.library.CardItemShape = {
			/**
			 * Circle Shape Design of the Control
			 * @public
			 */
			Circle: "Circle"
		};

		/**
		 * Predefined size of a CardItem
		 * @enum {string}
		 * @type {{Small: string}}
		 * @public
		 */
		my.control.library.CardItemSize = {
			/**
			 * Small CardItem Size
			 * @public
			 */
			Small: "Small"
		};

		/**
		 * Defines ListSeprators from sap.m.ListSeparators
		 *
		 * @enum {string}
		 * @public
		 */
		my.control.library.ListSeparators = sap.m.ListSeparators;
		/**
		 * Tile Style List Separator
		 * @type {string}
		 * @public
		 */
		my.control.library.ListSeparators["Tile"] = "Tile";

		/**
		 * Sets the Highlight state for Icon, Text or HighlightBar
		 * @enum {string}
		 * @type {{None: string, Error: string, Success: string, Default: string, Warning: string}}
		 * @public
		 */
		my.control.library.Highlight = {
			/**
			 * None, default value
			 * @public
			 */
			None: "None",
			/**
			 * Item error
			 * @public
			 */
			Error: "Error",
			/**
			 * Item success
			 * @public
			 */
			Success: "Success",
			/**
			 * Default company color
			 * @public
			 */
			Default: "Default",
			/**
			 * Item Warning
			 * @public
			 */
			Warning: "Warning"
		};

		/**
		 * Sets the List Background Design
		 * @enum {string}
		 * @type {{Default: string, Alternate: string}}
		 * @public
		 */
		my.control.library.ListBackgroundDesign = {
			/**
			 * Colored Background
			 * @public
			 */
			Default: "Default",
			/**
			 * Transparent Background
			 * @public
			 */
			Alternate: "Alternate"
		};

		/**
		 * Defines the position/direction a tooltip opens to.
		 * @enum {string}
		 * @type {{Top: string, TopLeft: string, TopRight: string, Bottom: string, BottomLeft: string, BottomRight: string, Left: string, Right: string}}
		 * @public
		 */
		my.control.library.TooltipPosition = {
			/**
			 * Centered on top of the anchor point
			 * @public
			 */
			Top: "TopCenter",
			/**
			 * On Top and Left of the anchor point
			 * @public
			 */
			TopLeft: "TopLeft",
			/**
			 * On Top and Right of the anchor point
			 * @public
			 */
			TopRight: "TopRight",
			/**
			 * Centered below of the anchor point
			 * @public
			 */
			Bottom: "BottomCenter",
			/**
			 * Below and Left of the anchor point
			 * @public
			 */
			BottomLeft: "BottomLeft",
			/**
			 * Below and Right of the anchor point
			 * @public
			 */
			BottomRight: "BottomRight",
			/**
			 * Left of the anchor point
			 * @public
			 */
			Left: "MiddleLeft",
			/**
			 * Right of the anchor point
			 * @public
			 */
			Right: "MiddleRight"
		};

		/**
		 * Defines the Sort Order for the SortableColumnHeader
		 * @enum {string}
		 * @type {{None: string, Ascending: string, Descending: string}}
		 * @public
		 */
		my.control.library.SortOrder = {
			/**
			 * No Sort order
			 * @public
			 */
			None: "None",
			/**
			 * Ascending Sort order
			 * @public
			 */
			Ascending: "Ascending",
			/**
			 * Descending Sort order
			 * @public
			 */
			Descending: "Descending"
		};

		return my.control.library;
	},
	false
);
