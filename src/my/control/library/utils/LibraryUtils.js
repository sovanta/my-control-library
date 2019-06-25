sap.ui.define(["sap/ui/base/Object", "sap/ui/core/IconPool"], function(Object, IconPool) {
	"use strict";

	/**
	 * Contains methods to ease working with and defining a library
	 *
	 * @class
	 *
	 * @author sovanta AG
	 * @version ${version}
	 *
	 * @constructor
	 * @public
	 * @alias my.control.library.utils.LibraryUtils
	 */
	var LibraryUtils = Object.extend(
		"my.control.library.utils.LibraryUtils",
		/** @lends my.control.library.utils.LibraryUtils.prototype */
		{
			/**
			 * Registers a array fontConfigs with the icon pool
			 * @param {Array} aFontConfig
			 * @public
			 */
			registerFontGlyphs: function(aFontConfig) {
				jQuery.each(aFontConfig, function(i, oFontConfigDefinition) {
					IconPool.addIcon(oFontConfigDefinition.name, oFontConfigDefinition.namespace, {
						fontFamily: oFontConfigDefinition.fontFamily,
						content: oFontConfigDefinition.code,
						overWrite: true
					});
				});
			},

			/**
			 * Inserts a style tag with a font-face
			 * @param {string} sLibName name of the library
			 * @param {string} sFontName name of the font
			 * @param {string} sAssetsPath Path to the font
			 * @param {boolean} [bExternResource] by default the sAssetspath is relative to the library/asset folder. set this to true to disable this behaviour
			 * @param {boolean} [bDisableOverwrite] disable overwritten already defined font-families
			 * @param {boolean} [aCustomFormats] custom Formats to be loaded
			 * @public
			 */
			loadFont: function(sLibName, sFontName, sAssetsPath, bExternResource, bDisableOverwrite, aCustomFormats) {
				var sFontPath;
				var sFontFace = "";
				var mFontWeights = {
					Light: "300",
					Regular: "400",
					SemiBold: "600",
					Bold: "700"
				};
				var aFormats = [
					{
						Ending: "ttf",
						Format: "truetype"
					},
					{
						Ending: "woff",
						Format: "woff"
					},
					{
						Ending: "otf",
						Format: "opentype"
					}
				];

				bExternResource = !!bExternResource;
				bDisableOverwrite = !!bDisableOverwrite;

				if (aCustomFormats && Array.isArray(aCustomFormats)) {
					aFormats = aCustomFormats;
				}

				if (bExternResource) {
					sFontPath = sAssetsPath;
				} else {
					var sLibraryAssetsPath = jQuery.sap.getModulePath(sLibName, "/") + "assets/";

					if (typeof sAssetsPath === "string") {
						sFontPath = sLibraryAssetsPath + sAssetsPath;
					} else {
						for (var type in sAssetsPath) {
							if (sAssetsPath.hasOwnProperty(type)) {
								sAssetsPath[type] = sLibraryAssetsPath + sAssetsPath[type];
							}
						}
					}
				}

				var sStyleId = "font-family-load-" + sFontName;

				if (typeof sAssetsPath === "string") {
					sFontFace = "@font-face {" + "font-family: '" + sFontName + "';" + "src: ";

					aFormats.forEach(function(oFormat, iIndex, aArray) {
						sFontFace += "url('" + sFontPath + "." + oFormat.Ending + "') format('" + oFormat.Format + "')";

						if (iIndex < aArray.length - 1) {
							sFontFace += ",";
						} else {
							sFontFace += ";";
						}
					});

					sFontFace += "font-weight: normal;" + "font-style: normal;" + "}";
				} else {
					for (var property in sAssetsPath) {
						if (sAssetsPath.hasOwnProperty(property)) {
							sFontFace += "@font-face {" + "font-family: '" + sFontName + "';" + "src: ";

							aFormats.forEach(function(oFormat, iIndex, aArray) {
								sFontFace +=
									"url('" + sAssetsPath[property] + "." + oFormat.Ending + "') format('" + oFormat.Format + "')";

								if (iIndex < aArray.length - 1) {
									sFontFace += ",";
								} else {
									sFontFace += ";";
								}
							});

							sFontFace += "font-weight: " + mFontWeights[property] + ";" + "font-style: normal;" + "}";
						}
					}
				}

				if (!bDisableOverwrite || jQuery("#" + sStyleId).length === 0) {
					jQuery("head").append('<style type="text/css" id="' + sStyleId + '">' + sFontFace + "</style>");
				}
			},

			/**
			 * Set the base font of all library controls
			 * @param sFontName
			 * @public
			 */
			setLibraryBaseFont: function(sFontName) {
				//set openSans as Standard font
				var sStandardFont =
					"[class*='myControlLibrary'] * {" +
					"-moz-osx-font-smoothing: grayscale;" +
					"-webkit-font-smoothing: antialiased;" +
					"font-smoothing: antialiased;" +
					"font-family: " +
					sFontName +
					";} ";

				var sSpecialLabelBehaviour =
					".myControlLibrary_label {" +
					"-moz-osx-font-smoothing: grayscale;" +
					"-webkit-font-smoothing: antialiased;" +
					"font-smoothing: antialiased;" +
					"font-family: " +
					sFontName +
					";}";

				sStandardFont += sSpecialLabelBehaviour;

				jQuery("head").append('<style type="text/css">' + sStandardFont + "</style>");
			},

			/**
			 *
			 * Processes a folder with a icon font in it. There has to be at least a *.svg and a *.ttf/*.woff file in this folder
			 * This method extracts glyph names and unicodes out of the SVG file and registers the icons in the IconPool
			 *
			 * After running this method you can use these icons like any icon in ui5 by referencing them by their registered URI
			 *
			 * IMPORTANT: this will make a SYNCHRONOUS HTTP Request and therefore block script execution until it is returned
			 * @param {string} sFolderPath Folder where teh font files are located at
			 * @param sFontName Name of the fontFiles without file ending (e.g. files are named myControlLibrary.svg, myControlLibrary.woff => sFontName = myControlLibrary)
			 * @param {string} [sNamespace] optional namespace under which the fonts will be registered under. so you can later use the icon as sap-icon://<namespace>/<iconname>. if this paramtere is omitted, the namespace of the library is used (myControlLibrary)
			 * @param {int} iTimeout Set a timeout for the request. (in milliseconds)
			 * @public
			 */
			processIconSvgFile: function(sFolderPath, sFontName, sNamespace, iTimeout) {
				sNamespace = sNamespace || "myControlLibrary";
				sFolderPath =
					sFolderPath.substr(sFolderPath.length - 1, 1) === "/"
						? sFolderPath.substr(0, sFolderPath.length - 1)
						: sFolderPath;

				/**
				 * Evaluate an XPath expression aExpression against a given DOM node
				 * or Document object (aNode)
				 *
				 * @param {object} oNode Node to start searching from
				 * @param {string} sExpr xPath epxression string
				 * @return {Array} returns all found nodes as an array
				 */
				function evaluateXPath(oNode, sExpr) {
					var nsResolver = oNode.createNSResolver(
						oNode.ownerDocument == null ? oNode.documentElement : oNode.ownerDocument.documentElement
					);
					var result = oNode.evaluate(sExpr, oNode, nsResolver, 0, null);
					var found = [];
					var res = result.iterateNext();
					while (res) {
						found.push(res);
						res = result.iterateNext();
					}
					return found;
				}

				jQuery.get({
					async: false,
					url: sFolderPath + "/" + sFontName + ".svg",
					dataType: "xml",
					timeout: iTimeout,
					mimeType: "image/svg+xml",
					success: function(oXMLDoc, sStatus) {
						if (oXMLDoc) {
							var aResult = evaluateXPath(oXMLDoc, "//*[@unicode]");

							var aGlyphDefinitions = [];
							aResult.forEach(function(oGlyph) {
								var sD = oGlyph.getAttribute("d");
								var sUnicode = oGlyph.getAttribute("unicode");
								var sGlyphName = oGlyph.getAttribute("glyph-name");

								if (sD && sD.trim() && sUnicode && sGlyphName) {
									aGlyphDefinitions.push({
										namespace: sNamespace,
										fontFamily: sFontName,
										name: sGlyphName,
										code: sUnicode.charCodeAt().toString(16)
									});
								}
							});

							if (aGlyphDefinitions.length) {
								this.registerFontGlyphs(aGlyphDefinitions);
								this.loadFont(sNamespace, sFontName, sFolderPath + "/" + sFontName, true, false);
							}
						}
					}.bind(this)
				});
			}
		}
	);
	return LibraryUtils;
});
