sap.ui.define(
	["my/control/library/Interface", "sap/ui/base/ManagedObject", "./library"],
	function(Interface, ManagedObject, library) {
		"use strict";

		/**
		 * Constructor for a new <code>my.control.library.IAggregationMapper</code>.
		 *
		 * @class
		 * The <code>IAggregationMapper</code> control: Enables aggregation mapping for controls nad their subcontrols.
		 *
		 * @extends sap.ui.core.Interface
		 *
		 * @author sovanta AG
		 * @version 1.6.4
		 *
		 * @interface
		 * @constructor
		 * @public
		 * @alias my.control.library.IAggregationMapper
		 */
		var IAggregationMapper = Interface.extend("my.control.library.IAggregationMapper", {
			/* =========================================================== */
			/* meta data definition                                        */
			/* =========================================================== */
			// metadata inheritance, not yet available
			// metadata: {
			//     library: "my.control.library",
			//     publicMethods: [],
			//     properties: {},
			//     aggregations: {},
			//     associations: {},
			//     events: {}
			// },
		});

		/* =========================================================== */
		/* attributes                                                  */
		/* =========================================================== */

		/* =========================================================== */
		/* constants                                                   */
		/* =========================================================== */

		/* =========================================================== */
		/* public methods                                              */
		/* =========================================================== */

		/* =========================================================== */
		/* override methods                                            */
		/* =========================================================== */

		/* =========================================================== */
		/*    begin: forward aggregation methods to child controls     */
		/* =========================================================== */

		/**
		 * Forwards a function call to a managed object based on the aggregation name.
		 * If the name is items, it will be forwarded to the list, otherwise called locally.
		 * @private
		 * @param {string} sFunctionName - The name of the function to be called
		 * @param {string} sMetadataFunctionKey - The Key where the name of the Generated Method can be found in metadata
		 * @param {string} sAggregationName - The name of the aggregation asociated
		 * @returns {any} The return type of the called function
		 */
		IAggregationMapper.prototype._callMethodInManagedObject = function(
			sFunctionName,
			sMetadataFunctionKey,
			sAggregationName
		) {
			var aArgs = Array.prototype.slice.call(arguments);
			var mAggregationMapping = this._getAggregationMappings(sAggregationName);
			var bCancel = false;
			var fnAbort = function() {
				bCancel = true;
			};

			if (mAggregationMapping) {
				// call method hook
				this._aggregationMappingHook.apply(this, [fnAbort].concat(aArgs));
				if (bCancel) {
					// abort method call, if abort function was called in method hook
					return;
				}

				// read mapping
				var sTargetAggregation = mAggregationMapping.aggregation;
				var oTargetControl = mAggregationMapping.control;
				var isTargetRuntimeMethods = mAggregationMapping.runtimeMethods || false;

				// replace target aggregation name
				aArgs[2] = sTargetAggregation;

				var oTargetAggragation = oTargetControl.getMetadata().getAllAggregations()[sTargetAggregation];
				if (!oTargetAggragation) {
					jQuery.sap.log.error(
						"Can not find aggregation : " + sTargetAggregation + " for control with id : " + oTargetControl.getId()
					);
				}

				var sTargetFunctionName;

				// get the Target Function Name
				if (isTargetRuntimeMethods && oTargetAggragation[sMetadataFunctionKey]) {
					sTargetFunctionName = oTargetAggragation[sMetadataFunctionKey];
				} else {
					sTargetFunctionName = sFunctionName;
					if (isTargetRuntimeMethods && !oTargetAggragation[sMetadataFunctionKey]) {
						jQuery.sap.log.error(
							"Can not find generated Function for Metadata Key  : " +
								sMetadataFunctionKey +
								" for control with id : " +
								oTargetControl.getId()
						);
					}
				}

				//get the target function
				var fnTargetFunction = oTargetControl[sTargetFunctionName];

				//Fallback to the generic version
				if (!fnTargetFunction) {
					fnTargetFunction = oTargetControl[sFunctionName];
					isTargetRuntimeMethods = false;
				}

				var aTargetFunctionAgrs = isTargetRuntimeMethods ? aArgs.slice(3) : aArgs.slice(2);

				// call method (of target aggregation) in mapped target control
				return fnTargetFunction.apply(oTargetControl, aTargetFunctionAgrs);
			} else {
				// apply to this control
				return ManagedObject.prototype[sFunctionName].apply(this, aArgs.slice(2));
			}
		};

		/**
		 * Forwards aggregations with the name of items to the internal control.
		 * @overwrite
		 * @public
		 * @returns {my.control.library.IAggregationMapper | object} this pointer for chaining or Control return of respective method
		 */
		[
			// "bind", "unbind" and related aggregation methods must not be mapped!
			// {name: "bindAggregation", returnThis: true, metadataFunctionKey: "_sBind"},
			// {name: "unbindAggregation", returnThis: true, metadataFunctionKey: "_sUnbind"},
			// {name: "getBinding", returnThis: false, metadataFunctionKey: null},
			// {name: "getBindingInfo", returnThis: false, metadataFunctionKey: null},
			// {name: "getBindingPath", returnThis: false, metadataFunctionKey: null}
			{ name: "validateAggregation", returnThis: false, metadataFunctionKey: null },
			{ name: "setAggregation", returnThis: true, metadataFunctionKey: "_sMutator" },
			{ name: "getAggregation", returnThis: false, metadataFunctionKey: "_sGetter" },
			{ name: "indexOfAggregation", returnThis: false, metadataFunctionKey: "_sIndexGetter" },
			{ name: "insertAggregation", returnThis: true, metadataFunctionKey: "_sInsertMutator" },
			{ name: "addAggregation", returnThis: true, metadataFunctionKey: "_sMutator" },
			{ name: "refreshAggregation", returnThis: false, metadataFunctionKey: null },
			{ name: "removeAggregation", returnThis: false, metadataFunctionKey: "_sRemoveMutator" },
			{ name: "removeAllAggregation", returnThis: false, metadataFunctionKey: "_sRemoveAllMutator" },
			{ name: "destroyAggregation", returnThis: true, metadataFunctionKey: "_sDestructor" }
		].forEach(function(oFunction) {
			IAggregationMapper.prototype[oFunction.name] = function() {
				var aArgs = [oFunction.name, oFunction.metadataFunctionKey].concat(Array.prototype.slice.call(arguments));

				// call method (and if mapping was found, call with target aggregation in mapped target control)
				var oReturn = this._callMethodInManagedObject.apply(this, aArgs);

				// return either this or the result of the method call, depending on the called function
				return oFunction.returnThis ? this : oReturn;
			};
		});

		/**
		 * Set the binding context for the internal container AND the current control so that both controls can be used with the context.
		 *
		 * @param {sap.ui.model.Context} oContext The new context
		 * @param {string} sModelName The optional model name
		 * @returns {my.control.library.IAggregationMapper | object} this pointer for chaining
		 * @override
		 * @public
		 */
		IAggregationMapper.prototype.setBindingContext = function(oContext, sModelName) {
			var aArgs = Array.prototype.slice.call(arguments),
				oMapping;

			// pass the model to all mapped controls and also to the local control to allow binding of own properties
			oMapping = this._getAggregationMappings();
			for (var sMappingKey in oMapping) {
				if (oMapping.hasOwnProperty(sMappingKey)) {
					oMapping[sMappingKey].control.setBindingContext(oContext, sModelName);
				}
			}

			return ManagedObject.prototype.setBindingContext.apply(this, aArgs);
		};

		/**
		 * Sets or unsets a model for the given model name for this ManagedObject.
		 *
		 * @param {sap.ui.model.Model} oModel the model to be set or <code>null</code> or <code>undefined</code>
		 * @param {string} [sName] the name of the model or <code>undefined</code>
		 * @return {sap.ui.base.ManagedObject} <code>this</code> to allow method chaining
		 * @override
		 * @public
		 */
		IAggregationMapper.prototype.setModel = function(oModel, sName) {
			var aArgs = Array.prototype.slice.call(arguments),
				oMapping;

			// pass the model to all mapped controls and also to the local control to allow binding of own properties
			oMapping = this._getAggregationMappings();
			for (var sMappingKey in oMapping) {
				if (oMapping.hasOwnProperty(sMappingKey)) {
					oMapping[sMappingKey].control.setModel(oModel, sName);
				}
			}

			return ManagedObject.prototype.setModel.apply(this, aArgs);
		};

		/* =========================================================== */
		/*    end: forward aggregation methods to child controls       */
		/* =========================================================== */

		/* =========================================================== */
		/* private methods                                             */
		/* =========================================================== */

		/**
		 * Defines the MANDATORY aggregation mappings for the composite control
		 * @param {string} sAggregation - name of the target aggregation
		 * @returns {object}
		 *           object.control {sap.ui.base.ManagedObject} target control
		 *           object.aggregation {string} target aggrgation that should be mapped
		 * @abstract
		 * @private
		 */
		Interface.defineAbstractMethod(IAggregationMapper, "_getAggregationMappings", function(sAggregation) {
			// // [sample code]
			// here an example how to map a) a control referenced by a private attribute and b) a control saved as hidden aggregation
			// var oMapping = {
			//     items: { control: this._oMyTargetControl, aggregation: "content", runtimeMethods: false },
			//     tokens: { control: sap.ui.base.ManagedObject.prototype.getAggregation.call(this, "_tokens"), aggregation: "chips", runtimeMethods: true }
			// };
			// if sAggregation is not supplied then return all available mappings
			// return sAggregation ? oMapping[sAggregation] : oMapping;
		});

		/**
		 * Defines the OPTIONAL mapping hook, called everytime an aggregation related method is called.
		 *
		 * @param {function} fnAbort - abort function, if called, mapped method call is cancelled
		 * @param {string} sFunctionName - name of the function that is mapped to another control
		 * @param {any} arguments... - multiple parameters handed over to maaping hook function
		 * @private
		 */
		IAggregationMapper.prototype._aggregationMappingHook = function(fnAbort, sFunctionName) {
			// // [sample code]
			// var aArgs = Array.prototype.slice.call(arguments).slice(3, arguments.length),
			//     sAggregationName;
			// if (sFunctionName === "setAggregation") {
			//     sAggregationName = aArgs[0];
			//     doSomethig();
			// }
		};

		return IAggregationMapper;
	},
	/* bExport= */ true
);
