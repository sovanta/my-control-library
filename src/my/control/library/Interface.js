//Sovanta Versioning Ignore
sap.ui.define(
	["sap/ui/base/Object", "./library"],
	function(BaseObject, library) {
		"use strict";

		/**
		 * Constructor for a new <code>my.control.library.Interface</code>.
		 *
		 * @class
		 * The <code>Interface</code> control: Interface class.
		 * Can be used to create Interfaces which can be implemented by other Controls.
		 *
		 * @extends sap.ui.base.Object
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @interface
		 * @constructor
		 * @public
		 * @alias my.control.library.Interface
		 */
		var Interface = BaseObject.extend("my.control.library.Interface", {
			/* =========================================================== */
			/* meta data definition                                        */
			/* =========================================================== */

			metadata: {
				library: "my.control.library",
				publicMethods: ["apply", "defineOverrideMethod", "defineAbstractMethod", "defineFinalMethod"]
			}
		});

		/* =========================================================== */
		/* constants                                                   */
		/* =========================================================== */

		Interface.METHOD = {
			OVERRIDE: "override",
			ABSTRACT: "abstract",
			FINAL: "final"
		};

		/* =========================================================== */
		/* public methods                                              */
		/* =========================================================== */

		/**
		 * Applies all interfaces that are extending <code>my.control.library.Interface</code>
		 *
		 * @param {sap.ui.base.Object} oControl - Target control the interfaces should applied to
		 * @param {object} mParameters - (OPTIONAL) A map with several parameters
		 * >> ideas for the future: object.conflictHandler, etc.
		 * @return {sap.ui.base.Object} Target control with applied inerfaces
		 * @public
		 */
		Interface.apply = function(oControl, mParameters) {
			var sErrorMsg, Interface;

			// helper function to transform a string to a valid class contructor
			var fnStringToClass = function(sClass) {
				var aArr = sClass.split("."),
					fn = window || this;
				for (var i = 0, len = aArr.length; i < len; i++) {
					fn = fn[aArr[i]];
				}
				if (typeof fn !== "function") {
					throw new Error("Class " + sClass + " not found.");
				}
				return fn;
			};

			// 1. collect interface metadata
			var aInterfaces = oControl
				.getMetadata()
				.getInterfaces()
				.map(function(sInterface) {
					// ensure class is loaded and available
					jQuery.sap.require(sInterface);

					// transform interface name string to real class contructor
					Interface = fnStringToClass(sInterface);

					// return interface metadata
					return {
						name: sInterface,
						proto: Interface.prototype,
						isInterface: Interface.prototype instanceof my.control.library.Interface
					};
				})
				.filter(function(oInterface) {
					return oInterface.isInterface;
				});

			// 2. apply interface methods to control
			aInterfaces.forEach(
				function(oInterface) {
					// a) loop at all methods
					Object.keys(oInterface.proto)
						.filter(function(sKey) {
							// ensure method is not inherited from my.control.library.Interface
							return Object.keys(my.control.library.Interface.prototype).indexOf(sKey) === -1;
						})
						.forEach(
							function(sKey) {
								// I. check if method is abstract
								if (oInterface.proto[sKey].prototype[this.METHOD.ABSTRACT] === true) {
									// ensure that abstract method is implemented in target control
									if (typeof oControl.prototype[sKey] !== "function") {
										sErrorMsg =
											"The function " +
											sKey +
											" of interface " +
											oInterface.name +
											" is an abstract function which needs to be implemented by subclasses.";
										jQuery.sap.log.error(sErrorMsg);
										throw new Error(sErrorMsg);
									} else {
										// all fine >> continue with next method
										return undefined;
									}
								}

								// II. check if method is final
								if (oInterface.proto[sKey].prototype[this.METHOD.FINAL] === true) {
									// check if final method is implemented by overriding method in target control
									if (
										typeof oControl.prototype[sKey] === "function" &&
										Object.getPrototypeOf(oControl.prototype)[sKey] === undefined
									) {
										sErrorMsg =
											"The function " +
											sKey +
											" of interface " +
											oInterface.name +
											" is a final function which can't be implemented or overridden by subclasses.";
										jQuery.sap.log.error(sErrorMsg);
										throw new Error(sErrorMsg);
									}
									// else: all fine >> fallsthrough (add final method)
								}

								// III. check if method will override an existing method
								if (
									typeof oControl.prototype[sKey] === "function" &&
									Object.getPrototypeOf(oControl.prototype)[sKey] === undefined
								) {
									// CASE 1: check if method was declared in target control the first time or overrides an inherited method
									// check if method was overwritten by purpose
									if (oControl.prototype[sKey].prototype[this.METHOD.OVERRIDE] === true) {
										// all fine >> continue with next method
										return undefined;
									} else {
										sErrorMsg =
											"The function " +
											sKey +
											" of interface " +
											oInterface.name +
											" is already declared by subclass and can't be overwritten. Please use Interface.defineOverrideMethod( oImplementingControl, '" +
											sKey +
											"', function(){...}) to override inherted implementation.";
										jQuery.sap.log.error(sErrorMsg);
										throw new Error(sErrorMsg);
									}
								} else if (
									typeof oControl.prototype[sKey] === "function" &&
									Object.getPrototypeOf(oControl.prototype)[sKey] !== undefined
								) {
									// CASE 2: method is already inherited by an extended control but was not overwritten by target control
									// check if method was overwritten by purpose
									if (oControl.prototype[sKey].prototype[this.METHOD.OVERRIDE] === true) {
										// all fine >> continue with next method
										return undefined;
									} else {
										// apply method to target control
										oControl.prototype[sKey] = oInterface.proto[sKey];
									}
								} else {
									// CASE 3: method was neither declared nor overwritten by target control
									// apply method to target control
									oControl.prototype[sKey] = oInterface.proto[sKey];
								}
							}.bind(this)
						);
				}.bind(this)
			);

			// 3. return final control
			return oControl;
		};

		/**
		 * Defines an overriding method in a target control or an interface.
		 *
		 * @param {sap.ui.base.Object} oControl - Target control the override method should added to.
		 * @param {string} sFunctionName - Name of the override method.
		 * @param {function} fnFunction - Function object of override method.
		 * @public
		 */
		Interface.defineOverrideMethod = function(oControl, sFunctioName, fnFunction) {
			oControl.prototype[sFunctioName] = fnFunction;
			oControl.prototype[sFunctioName].prototype[this.METHOD.OVERRIDE] = true;
		};

		/**
		 * Defines an abstract method in an interface.
		 *
		 * @param {my.control.library.Interface} oInterface - Interface the abstract method should added to.
		 * @param {string} sFunctionName - Name of the abstract method.
		 * @param {function} fnFunction - Function object of abstract method.
		 * @public
		 */
		Interface.defineAbstractMethod = function(oInterface, sFunctioName, fnFunction) {
			oInterface.prototype[sFunctioName] = fnFunction;
			oInterface.prototype[sFunctioName].prototype[this.METHOD.ABSTRACT] = true;
		};

		/**
		 * Defines a final method in an interface.
		 *
		 * @param {my.control.library.Interface} oInterface - Interface the final method should added to.
		 * @param {string} sFunctionName - Name of the final method.
		 * @param {function} fnFunction - Function object of final method.
		 * @public
		 */
		Interface.defineFinalMethod = function(oInterface, sFunctioName, fnFunction) {
			oInterface.prototype[sFunctioName] = fnFunction;
			oInterface.prototype[sFunctioName].prototype[this.METHOD.FINAL] = true;
		};

		return Interface;
	},
	/* bExport= */ true
);
