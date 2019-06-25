sap.ui.define(
	"my/control/library/utils/SvgUtils",
	["jquery.sap.global"],
	/* global d3: false */
	function(jQuery) {
		"use strict";

		var SvgUtils = {
			/**
			 * Factory for a function to:
			 * Manipulate a path representing a rectangle (c3 bar chart) to change its height (negative y direction)
			 * @param {number} iAmount change of height (negative is a growing, positive is shrinking)
			 * @returns {boolean|*}
			 */
			pathRectTransitionFactory: function(iAmount) {
				var pathRectTransition = function(d, i, a) {
					// var yValue = a.match(/^(M\w\d+\.?\d*)(\d+).*$/);
					var yValue = a.replace(/^(M\W+\d+\.?\d*,+\d+\.?\d*\WL+\d+\.?\d*,+)(\d+\.?\d*)(.*)$/gi, function(
						match,
						sFirstSub,
						sYValue,
						sLastSub,
						offset,
						originalString
					) {
						var iYValue = +sYValue;
						iYValue += iAmount;
						var sNewString = originalString.replace(new RegExp(sYValue, "gi"), "" + iYValue);
						return sNewString;
					});
					return d3.interpolateString(a, yValue);
				};

				return pathRectTransition;
			},

			/**
			 * Creates a shadow filter node
			 *
			 * @param {string} sId Node id of the filter node
			 * @param {number} dx horizontal offset of the shadow
			 * @param {number} dy vertical offset of the shadow
			 * @param {number} blur blur distance of the shadow
			 * @param {string} color color of the shadow
			 * @returns {d3.selection} a selection containing the filter. This selection is not yet inserted into the DOM
			 */
			defineShadowFilter: function(sId, dx, dy, blur, color) {
				dx = dx || 0;
				dy = dy || 0;
				blur = blur || 0;
				color = color || "#000000";
				/*
                 <filter id="shadow">
                 <feGaussianBlur in="SourceAlpha" stdDeviation="2.2"/>
                 <feOffset dx="12" dy="12" result="offsetblur"/>
                 <feFlood flood-color="rgba(255,0,0,1)"/>
                 <feComposite in2="offsetblur" operator="in"/>
                 <feMerge>
                 <feMergeNode/>
                 <feMergeNode in="SourceGraphic"/>
                 </feMerge>
                 </filter>
                 */
				var oFilter = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "filter"));

				oFilter
					.attr("id", sId)
					.append("feGaussianBlur")
					.attr("in", "SourceAlpha")
					.attr("stdDeviation", blur);

				oFilter
					.append("feOffset")
					.attr("dx", dx)
					.attr("dy", dy)
					.attr("result", "offsetBlur");

				oFilter.append("feFlood").attr("flood-color", color);

				oFilter
					.append("feComposite")
					.attr("in2", "offsetBlur")
					.attr("operator", "in");

				var oMerge = oFilter.append("feMerge");

				oMerge.append("feMergeNode");
				oMerge.append("feMergeNode").attr("in", "SourceGraphic");

				return oFilter;
			},

			/**
			 *
			 * @param {number} angle angle in radians
			 * @param {number} radius radius to position
			 */
			computeCoordinateOnCircle: function(angle, radius) {
				//Correction for coordinate system
				var alpha = angle - Math.PI / 2;

				var translateX = Math.cos(alpha) * radius;
				var translateY = Math.sin(alpha) * radius;

				return {
					x: translateX,
					y: translateY
				};
			},

			/**
			 * Converts a angle defined in radians [0..2PI] to degrees
			 * @param {number} radians
			 * @returns {number}
			 */
			radiansToDegrees: function(radians) {
				return (radians * 180) / Math.PI;
			},

			/**
			 * Converts a angle defined in degrees to radians [0..2PI]
			 * @param {number} degree
			 * @returns {number}
			 */
			degreesToRadians: function(degree) {
				return (degree * Math.PI) / 180;
			},

			/**
			 * Converts the corners of a bar path (sharp corners) to arcs. The algorithm is specific for a rectangle path starting at the lower left and going clockwise
			 * @param {string} sPath the svg path+d argument describing the path
			 * @param {string} radius the radius of the round corners
			 * @param {boolean} bEndOnly Only round the ending corner
			 * @param {boolean} bFitIntoRoundArcs build "negative" arcs to fit into arcs of the underlying bar (used in stacked environment)
			 * @return {string}
			 */
			pathsCornersToArcs: function(sPath, radius, bEndOnly, bFitIntoRoundArcs) {
				if (sPath.indexOf("A") > 0) {
					//This path already has a arc in it. Our method would not produce usable results
					return sPath;
				}

				var sDirectionOfRectangle;
				var aEndCorners;

				var arcParameter = function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
					return ["A", rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y].join(" ");
				};

				//This is the way the bar path is built in c3.js:7834
				// var path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' ' + 'L' + points[1][indexX] + ',' + points[1][indexY] + ' ' + 'L' + points[2][indexX] + ',' + points[2][indexY] + ' ' + 'L' + points[3][indexX] + ',' + points[3][indexY] + ' ' + 'z';

				// Split apart the path, handing concatenated letters and numbers
				var pathParts = sPath.split(/[,\s]/).reduce(function(parts, part) {
					var match = part.match("([a-zA-Z])(.+)");
					if (match) {
						parts.push(match[1]);
						parts.push(match[2]);
					} else {
						parts.push(part);
					}

					return parts;
				}, []);

				var oSemanticBarCoordinates;

				var angleOfFirstSide = {
					toX: this.mathAngle(+pathParts[1], +pathParts[2], +pathParts[4], +pathParts[5]),
					toY: this.mathAngle(+pathParts[4] - +pathParts[1], +pathParts[5] - +pathParts[2], 1, 0)
				};

				jQuery.sap.log.debug("=====================================");
				jQuery.sap.log.debug("angle to X: " + angleOfFirstSide.toX);
				jQuery.sap.log.debug("angle to Y: " + angleOfFirstSide.toY);
				jQuery.sap.log.debug("=====================================");

				//downwards
				if (angleOfFirstSide.toX === -90) {
					//goes counter clockwise starting on top left
					sDirectionOfRectangle = "Down";
					aEndCorners = ["bottomRight", "bottomLeft"];
					oSemanticBarCoordinates = {
						corners: {
							topLeft: {
								x: +pathParts[1],
								y: +pathParts[2]
							},
							bottomLeft: {
								x: +pathParts[4],
								y: +pathParts[5]
							},
							bottomRight: {
								x: +pathParts[7],
								y: +pathParts[8]
							},
							topRight: {
								x: +pathParts[10],
								y: +pathParts[11]
							}
						}
					};
				}
				//upwards
				if (angleOfFirstSide.toX === 90) {
					sDirectionOfRectangle = "Up";
					aEndCorners = ["topRight", "topLeft"];
					oSemanticBarCoordinates = {
						corners: {
							bottomLeft: {
								x: +pathParts[1],
								y: +pathParts[2]
							},
							topLeft: {
								x: +pathParts[4],
								y: +pathParts[5]
							},
							topRight: {
								x: +pathParts[7],
								y: +pathParts[8]
							},
							bottomRight: {
								x: +pathParts[10],
								y: +pathParts[11]
							}
						}
					};
				}

				//to right
				if (angleOfFirstSide.toX === 180) {
					sDirectionOfRectangle = "Right";
					aEndCorners = ["topRight", "bottomRight"];
					oSemanticBarCoordinates = {
						corners: {
							topLeft: {
								x: +pathParts[1],
								y: +pathParts[2]
							},
							topRight: {
								x: +pathParts[4],
								y: +pathParts[5]
							},
							bottomRight: {
								x: +pathParts[7],
								y: +pathParts[8]
							},
							bottomLeft: {
								x: +pathParts[10],
								y: +pathParts[11]
							}
						}
					};
				}

				//to left
				if (angleOfFirstSide.toX === 0) {
					sDirectionOfRectangle = "Left";
					aEndCorners = ["topLeft", "bottomLeft"];
					oSemanticBarCoordinates = {
						corners: {
							topRight: {
								x: +pathParts[1],
								y: +pathParts[2]
							},
							topLeft: {
								x: +pathParts[4],
								y: +pathParts[5]
							},
							bottomLeft: {
								x: +pathParts[7],
								y: +pathParts[8]
							},
							bottomRight: {
								x: +pathParts[10],
								y: +pathParts[11]
							}
						}
					};
				}

				jQuery.sap.log.debug("Rectangle DIRECTION: " + sDirectionOfRectangle);

				var plusRadius = +radius;
				var minusRadius = -radius;

				oSemanticBarCoordinates.cutCorners = {
					bottomLeft: {
						x: oSemanticBarCoordinates.corners.bottomLeft.x + plusRadius,
						y: oSemanticBarCoordinates.corners.bottomLeft.y + minusRadius
					},
					topLeft: {
						x: oSemanticBarCoordinates.corners.topLeft.x + plusRadius,
						y: oSemanticBarCoordinates.corners.topLeft.y + plusRadius
					},
					topRight: {
						x: oSemanticBarCoordinates.corners.topRight.x + minusRadius,
						y: oSemanticBarCoordinates.corners.topRight.y + plusRadius
					},
					bottomRight: {
						x: oSemanticBarCoordinates.corners.bottomRight.x + minusRadius,
						y: oSemanticBarCoordinates.corners.bottomRight.y + minusRadius
					}
				};

				/**
				 * Returns the path subArray for the defined corner.
				 * @param {string} sCornerName corner name
				 */
				function getPathForCorner(sCornerName) {
					var aPathPart = [];
					var sCutCornersKey = "cutCorners";
					var bRoundThisCorner = !bEndOnly || aEndCorners.indexOf(sCornerName) !== -1;
					if (!bRoundThisCorner && !bFitIntoRoundArcs) {
						sCutCornersKey = "corners";
					}

					var iVerticalModificator = sDirectionOfRectangle === "Left" || sDirectionOfRectangle === "Right" ? 0 : 1;
					var iHorizontalModificator = sDirectionOfRectangle === "Up" || sDirectionOfRectangle === "Down" ? 0 : 1;

					var iBottomExpansionLength = bFitIntoRoundArcs && !bRoundThisCorner ? radius : 0;
					switch (sCornerName) {
						case "topLeft":
							aPathPart.splice(
								0,
								0,
								oSemanticBarCoordinates.corners[sCornerName].x,
								oSemanticBarCoordinates[sCutCornersKey][sCornerName].y -
									iVerticalModificator * 2 * iBottomExpansionLength
							);
							break;
						case "bottomRight":
							aPathPart.splice(
								0,
								0,
								oSemanticBarCoordinates.corners[sCornerName].x,
								oSemanticBarCoordinates[sCutCornersKey][sCornerName].y +
									iVerticalModificator * 2 * iBottomExpansionLength
							);
							break;
						case "topRight":
							aPathPart.splice(
								0,
								0,
								oSemanticBarCoordinates[sCutCornersKey][sCornerName].x +
									iHorizontalModificator * 2 * iBottomExpansionLength,
								oSemanticBarCoordinates.corners[sCornerName].y
							);
							break;
						case "bottomLeft":
							aPathPart.splice(
								0,
								0,
								oSemanticBarCoordinates[sCutCornersKey][sCornerName].x -
									iHorizontalModificator * 2 * iBottomExpansionLength,
								oSemanticBarCoordinates.corners[sCornerName].y
							);
							break;
					}

					if (bRoundThisCorner) {
						//add arc
						switch (sCornerName) {
							case "topLeft":
							case "bottomRight":
								aPathPart.splice(
									2,
									0,
									arcParameter(
										radius,
										radius,
										0,
										0,
										1,
										oSemanticBarCoordinates[sCutCornersKey][sCornerName].x,
										oSemanticBarCoordinates.corners[sCornerName].y
									)
								);
								break;
							case "topRight":
							case "bottomLeft":
								aPathPart.splice(
									2,
									0,
									arcParameter(
										radius,
										radius,
										0,
										0,
										1,
										oSemanticBarCoordinates.corners[sCornerName].x,
										oSemanticBarCoordinates[sCutCornersKey][sCornerName].y
									)
								);
								break;
						}
					} else if (bFitIntoRoundArcs) {
						switch (sCornerName) {
							case "topLeft":
								aPathPart.splice(
									2,
									0,
									arcParameter(
										radius,
										radius,
										0,
										0,
										0,
										oSemanticBarCoordinates[sCutCornersKey][sCornerName].x -
											iHorizontalModificator * 2 * iBottomExpansionLength,
										oSemanticBarCoordinates.corners[sCornerName].y
									)
								);
								break;
							case "bottomRight":
								aPathPart.splice(
									2,
									0,
									arcParameter(
										radius,
										radius,
										0,
										0,
										0,
										oSemanticBarCoordinates[sCutCornersKey][sCornerName].x +
											iHorizontalModificator * 2 * iBottomExpansionLength,
										oSemanticBarCoordinates.corners[sCornerName].y
									)
								);
								break;
							case "topRight":
								aPathPart.splice(
									2,
									0,
									arcParameter(
										radius,
										radius,
										0,
										0,
										0,
										oSemanticBarCoordinates.corners[sCornerName].x,
										oSemanticBarCoordinates[sCutCornersKey][sCornerName].y - iVerticalModificator * 2 * radius
									)
								);
								break;
							case "bottomLeft":
								aPathPart.splice(
									2,
									0,
									arcParameter(
										radius,
										radius,
										0,
										0,
										0,
										oSemanticBarCoordinates.corners[sCornerName].x,
										oSemanticBarCoordinates[sCutCornersKey][sCornerName].y + iVerticalModificator * 2 * radius
									)
								);
								break;
						}
					}

					return aPathPart;
				}

				var aGeneratedPath;

				if (!bEndOnly || aEndCorners.indexOf("bottomLeft") !== -1) {
					aGeneratedPath = [
						"M",
						oSemanticBarCoordinates.corners.bottomLeft.x,
						oSemanticBarCoordinates.cutCorners.bottomLeft.y,
						"L"
					];
				} else {
					aGeneratedPath = [
						"M",
						oSemanticBarCoordinates.corners.bottomLeft.x,
						oSemanticBarCoordinates.corners.bottomLeft.y,
						"L"
					];
				}
				aGeneratedPath = aGeneratedPath.concat(getPathForCorner("topLeft"));
				aGeneratedPath.splice(aGeneratedPath.length, 0, "L");
				aGeneratedPath = aGeneratedPath.concat(getPathForCorner("topRight"));
				aGeneratedPath.splice(aGeneratedPath.length, 0, "L");
				aGeneratedPath = aGeneratedPath.concat(getPathForCorner("bottomRight"));
				aGeneratedPath.splice(aGeneratedPath.length, 0, "L");
				aGeneratedPath = aGeneratedPath.concat(getPathForCorner("bottomLeft"));
				aGeneratedPath.splice(aGeneratedPath.length, 0, "z");

				return aGeneratedPath.join(" ");
			},

			/**
			 * Polyfill for Math.hypot
			 * @returns the square root of the sum of squares of its arguments, that is
			 */
			mathHypot: function() {
				if (Math.hypot) {
					return Math.hypot.apply(Math, arguments);
				}
				var y = 0,
					i = arguments.length;
				while (i--) {
					y += arguments[i] * arguments[i];
				}
				return Math.sqrt(y);
			},

			/**
			 * Returns the Angle of the vector defined
			 * @param {number} x1
			 * @param {number} y1
			 * @param {number} x2
			 * @param {number} y2
			 *
			 * @returns {number} the angle in degrees
			 */
			mathAngle: function(x1, y1, x2, y2) {
				var oVector = new Vector(x1 - x2, y1 - y2);
				var angles = oVector.toAngles();
				var angle = this.radiansToDegrees(angles.beta);
				return angle;
			},

			/**
			 * Decide which of 2 colors is better readable on a specific background color.
			 *
			 * @param {string} sBackgroundHex Background color (in hex representation) to which the other to will be set in contrast
			 * @param {string} sForegroundVariant1 foreground (text) color (in hex representation) option 1
			 * @param {string} sForegroundVariant2 foreground (text) color (in hex representation) option 2
			 * @returns {string} Either sForegroundVariant1 or sForegroundVariant2. Based on which has the higher contrast to sBackgroundHex
			 */
			getReadableTextColor: function(sBackgroundHex, sForegroundVariant1, sForegroundVariant2) {
				var vContrastValue1 = this.getContrast(sForegroundVariant1, sBackgroundHex);
				var vContrastValue2 = this.getContrast(sForegroundVariant2, sBackgroundHex);

				return vContrastValue1 > vContrastValue2 ? sForegroundVariant1 : sForegroundVariant2;
			},

			/**
			 * Returns the contrast value of 2 colors
			 * @param {string} sForegroundColor1 color (in hex representation)
			 * @param {string} sBaseColor2 The base (typically background) color (in hex representation)
			 * @returns {float} contrast value. a higher value means better contrast
			 */
			getContrast: function(sForegroundColor1, sBaseColor2) {
				sForegroundColor1 =
					sForegroundColor1.indexOf("#") === 0
						? sForegroundColor1.substr(1, sForegroundColor1.length)
						: sForegroundColor1;
				sBaseColor2 = sBaseColor2.indexOf("#") === 0 ? sBaseColor2.substr(1, sBaseColor2.length) : sBaseColor2;

				function padHexColor(sHex) {
					if (sHex.length === 6) {
						return sHex;
					}
					if (sHex.length === 3) {
						var r = sHex.substr(0, 1);
						var g = sHex.substr(1, 1);
						var b = sHex.substr(2, 1);

						return "" + r + r + g + g + b + b;
					}
					return "";
				}
				sForegroundColor1 = padHexColor(sForegroundColor1);
				sBaseColor2 = padHexColor(sBaseColor2);

				var oColor1 = {
					r: parseInt(sForegroundColor1.substr(0, 2), 16),
					g: parseInt(sForegroundColor1.substr(2, 2), 16),
					b: parseInt(sForegroundColor1.substr(4, 2), 16)
				};
				var oColor2 = {
					r: parseInt(sBaseColor2.substr(0, 2), 16),
					g: parseInt(sBaseColor2.substr(2, 2), 16),
					b: parseInt(sBaseColor2.substr(4, 2), 16)
				};

				var fColor1Luminance = this.getLuminance(oColor1.r, oColor1.g, oColor1.b);
				var fColor2Luminance = this.getLuminance(oColor2.r, oColor2.g, oColor2.b);

				return Math.abs((fColor1Luminance - fColor2Luminance) / fColor2Luminance);
			},

			/**
			 * Get Luminance value of rgb color representation
			 * @param {int} r red value in range [0..255]
			 * @param {int} g green value in range [0..255]
			 * @param {int} b blue value in range [0..255]
			 */
			getLuminance: function(r, g, b) {
				var a = [r, g, b].map(function(v) {
					v /= 255;
					return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
				});
				return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
			}
		};

		function Vector(x, y, z) {
			this.x = x || 0;
			this.y = y || 0;
			this.z = z || 0;
		}

		// ### Instance Methods
		// The methods `add()`, `subtract()`, `multiply()`, and `divide()` can all
		// take either a vector or a number as an argument.
		Vector.prototype = {
			negative: function() {
				return new Vector(-this.x, -this.y, -this.z);
			},
			add: function(v) {
				if (v instanceof Vector) {
					return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
				} else {
					return new Vector(this.x + v, this.y + v, this.z + v);
				}
			},
			subtract: function(v) {
				if (v instanceof Vector) {
					return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
				} else {
					return new Vector(this.x - v, this.y - v, this.z - v);
				}
			},
			multiply: function(v) {
				if (v instanceof Vector) {
					return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
				} else {
					return new Vector(this.x * v, this.y * v, this.z * v);
				}
			},
			divide: function(v) {
				if (v instanceof Vector) {
					return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
				} else {
					return new Vector(this.x / v, this.y / v, this.z / v);
				}
			},
			equals: function(v) {
				return this.x == v.x && this.y == v.y && this.z == v.z;
			},
			dot: function(v) {
				return this.x * v.x + this.y * v.y + this.z * v.z;
			},
			cross: function(v) {
				return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
			},
			length: function() {
				return Math.sqrt(this.dot(this));
			},
			unit: function() {
				return this.divide(this.length());
			},
			min: function() {
				return Math.min(Math.min(this.x, this.y), this.z);
			},
			max: function() {
				return Math.max(Math.max(this.x, this.y), this.z);
			},
			toAngles: function() {
				return {
					theta: Math.atan2(this.z, this.x),
					phi: Math.asin(this.y / this.length()),
					beta: -Math.atan2(-this.y, this.x)
				};
			},
			angleTo: function(a) {
				return Math.acos(this.dot(a) / (this.length() * a.length()));
			},
			toArray: function(n) {
				return [this.x, this.y, this.z].slice(0, n || 3);
			},
			clone: function() {
				return new Vector(this.x, this.y, this.z);
			},
			init: function(x, y, z) {
				this.x = x;
				this.y = y;
				this.z = z;
				return this;
			}
		};

		// ### Static Methods
		// `Vector.randomDirection()` returns a vector with a length of 1 and a
		// statistically uniform direction. `Vector.lerp()` performs linear
		// interpolation between two vectors.
		Vector.negative = function(a, b) {
			b.x = -a.x;
			b.y = -a.y;
			b.z = -a.z;
			return b;
		};
		Vector.add = function(a, b, c) {
			if (b instanceof Vector) {
				c.x = a.x + b.x;
				c.y = a.y + b.y;
				c.z = a.z + b.z;
			} else {
				c.x = a.x + b;
				c.y = a.y + b;
				c.z = a.z + b;
			}
			return c;
		};
		Vector.subtract = function(a, b, c) {
			if (b instanceof Vector) {
				c.x = a.x - b.x;
				c.y = a.y - b.y;
				c.z = a.z - b.z;
			} else {
				c.x = a.x - b;
				c.y = a.y - b;
				c.z = a.z - b;
			}
			return c;
		};
		Vector.multiply = function(a, b, c) {
			if (b instanceof Vector) {
				c.x = a.x * b.x;
				c.y = a.y * b.y;
				c.z = a.z * b.z;
			} else {
				c.x = a.x * b;
				c.y = a.y * b;
				c.z = a.z * b;
			}
			return c;
		};
		Vector.divide = function(a, b, c) {
			if (b instanceof Vector) {
				c.x = a.x / b.x;
				c.y = a.y / b.y;
				c.z = a.z / b.z;
			} else {
				c.x = a.x / b;
				c.y = a.y / b;
				c.z = a.z / b;
			}
			return c;
		};
		Vector.cross = function(a, b, c) {
			c.x = a.y * b.z - a.z * b.y;
			c.y = a.z * b.x - a.x * b.z;
			c.z = a.x * b.y - a.y * b.x;
			return c;
		};
		Vector.unit = function(a, b) {
			var length = a.length();
			b.x = a.x / length;
			b.y = a.y / length;
			b.z = a.z / length;
			return b;
		};
		Vector.fromAngles = function(theta, phi) {
			return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
		};
		Vector.randomDirection = function() {
			return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
		};
		Vector.min = function(a, b) {
			return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
		};
		Vector.max = function(a, b) {
			return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
		};
		Vector.lerp = function(a, b, fraction) {
			return b
				.subtract(a)
				.multiply(fraction)
				.add(a);
		};
		Vector.fromArray = function(a) {
			return new Vector(a[0], a[1], a[2]);
		};
		Vector.angleBetween = function(a, b) {
			return a.angleTo(b);
		};

		return SvgUtils;
	}
);
