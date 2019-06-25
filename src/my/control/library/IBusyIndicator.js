//Sovanta Versioning Ignore
sap.ui.define(
	[
		"jquery.sap.global",
		"my/control/library/Interface",
		"sap/ui/core/Control",
		"my/control/library/utils/BusyIndicatorUtils",
		"./library"
	],
	function(jQuery, Interface, Control, BusyIndicatorUtils, library) {
		"use strict";

		/**
		 * Constructor for a new IBusyIndicator Interface
		 *
		 * @class
		 * The <code>IBusyIndicator</code> Interface: Enables the usage of an Custom BusyIndicator Control as Busy Indication
		 *
		 * @extends my.control.library.Interface
		 *
		 * @author sovanta AG
		 * @version ${version}
		 *
		 * @interface
		 * @constructor
		 * @since 0.3.0
		 * @public
		 * @alias my.control.library.IBusyIndicator
		 */
		var IBusyIndicator = Interface.extend("my.control.library.IBusyIndicator", {});

		var aPreventedEvents = [
				"focusin",
				"focusout",
				"keydown",
				"keypress",
				"keyup",
				"mousedown",
				"touchstart",
				"touchmove",
				"mouseup",
				"touchend",
				"click"
			],
			rForbiddenTags = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|tr)$/i,
			oBusyIndicatorDelegate = {
				onBeforeRendering: function() {
					if (
						this.getBusy() &&
						this.getDomRef() &&
						!this._busyIndicatorDelayedCallId &&
						this.getDomRef("busyIndicator")
					) {
						fnHandleInteraction.call(this, false);
					}
				},
				onAfterRendering: function() {
					if (
						this.getBusy() &&
						this.getDomRef() &&
						!this._busyIndicatorDelayedCallId &&
						!this.getDomRef("busyIndicator")
					) {
						// Also use the BusyIndicatorDelay when a control is initialized
						// with "busy = true". If the delayed call was already initialized
						// skip any further call if the control was re-rendered while
						// the delay is running.
						var iDelay = this.getBusyIndicatorDelay();

						// Only do it via timeout if there is a delay. Otherwise append the
						// BusyIndicator immediately
						if (iDelay) {
							this._busyIndicatorDelayedCallId = jQuery.sap.delayedCall(iDelay, this, fnAppendBusyIndicator);
						} else {
							fnAppendBusyIndicator.call(this);
						}
					}
				}
			};

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

		/**
		 * Set the controls busy state.
		 *
		 * @param {boolean} bBusy The new busy state to be set
		 * @return {sap.ui.core.Control} <code>this</code> to allow method chaining
		 * @public
		 */
		IBusyIndicator.prototype.setBusy = function(
			bBusy,
			sBusySection /* this is an internal parameter to apply partial local busy indicator for a specific section of the control */,
			sBusyIndicatorType
		) {
			//If the new state is already set, we don't need to do anything
			if (!!bBusy == this.getProperty("busy")) {
				return this;
			}

			this._sBusySection = sBusySection;
			this._sBusyIndicatorType = sBusyIndicatorType;

			//No rerendering - should be modeled as a non-invalidating property once we have that
			this.setProperty("busy", bBusy, /*bSuppressInvalidate*/ true);

			if (bBusy) {
				this.addDelegate(oBusyIndicatorDelegate, false, this);
			} else {
				this.removeDelegate(oBusyIndicatorDelegate);
				//If there is a pending delayed call we clear ity
				if (this._busyIndicatorDelayedCallId) {
					jQuery.sap.clearDelayedCall(this._busyIndicatorDelayedCallId);
					delete this._busyIndicatorDelayedCallId;
				}
			}

			//If no domref exists stop here.
			if (!this.getDomRef()) {
				return this;
			}

			if (bBusy) {
				if (this.getBusyIndicatorDelay() <= 0) {
					fnAppendBusyIndicator.call(this);
				} else {
					this._busyIndicatorDelayedCallId = jQuery.sap.delayedCall(
						this.getBusyIndicatorDelay(),
						this,
						fnAppendBusyIndicator
					);
				}
			} else {
				fnRemoveBusyIndicator.call(this);
			}
			return this;
		};

		/**
		 * Cleanup all timers which might have been created by the busy indicator.
		 *
		 * @private
		 */
		IBusyIndicator.prototype._cleanupBusyIndicator = function() {
			//If there is a pending delayed call we clear it
			if (this._busyIndicatorDelayedCallId) {
				jQuery.sap.clearDelayedCall(this._busyIndicatorDelayedCallId);
				delete this._busyIndicatorDelayedCallId;
			}
			fnHandleInteraction.call(this, false);
		};

		/* =========================================================== */
		/* private methods                                             */
		/* =========================================================== */

		/**
		 * Add busy indicator to DOM
		 *
		 * @private
		 */
		function fnAppendBusyIndicator() {
			// Only append if busy state is still set
			if (!this.getBusy()) {
				return;
			}

			var $this = this.$(this._sBusySection);

			//If there is a pending delayed call to append the busy indicator, we can clear it now
			if (this._busyIndicatorDelayedCallId) {
				jQuery.sap.clearDelayedCall(this._busyIndicatorDelayedCallId);
				delete this._busyIndicatorDelayedCallId;
			}

			// if no busy section/control jquery instance could be retrieved -> the control is not part of the dom anymore
			// this might happen in certain scenarios when e.g. a dialog is closed faster than the busyIndicatorDelay
			if (!$this || $this.length === 0) {
				jQuery.sap.log.warning("BusyIndicator could not be rendered. The outer control instance is not valid anymore.");
				return;
			}

			//Check if DOM Element where the busy indicator is supposed to be placed can handle content
			var sTag = $this.get(0) && $this.get(0).tagName;
			if (rForbiddenTags.test(sTag)) {
				jQuery.sap.log.warning("BusyIndicator cannot be placed in elements with tag '" + sTag + "'.");
				return;
			}

			//check if the control has static position, if this is the case we need to change it,
			//because we relay on relative/absolute/fixed positioning
			if ($this.css("position") == "static") {
				this._busyStoredPosition = "static";
				$this.css("position", "relative");
			}

			//Append busy indicator to control DOM
			this._$BusyIndicator = BusyIndicatorUtils.addHTML(
				$this,
				this.getId() + "-busyIndicator",
				this.getBusyIndicatorSize(),
				this._sBusyIndicatorType
			);

			fnHandleInteraction.call(this, true);
		}

		/**
		 * Remove busy indicator from DOM
		 *
		 * @private
		 */
		function fnRemoveBusyIndicator() {
			var $this = this.$(this._sBusySection);

			$this.removeClass("sapUiLocalBusy");
			//Unset the actual DOM Element´s 'aria-busy'
			$this.removeAttr("aria-busy");

			//Reset the position style to its original state
			if (this._busyStoredPosition) {
				$this.css("position", this._busyStoredPosition);
				delete this._busyStoredPosition;
			}
			if (this._$BusyIndicator) {
				fnHandleInteraction.call(this, false);
				//Remove the busy indicator from the DOM
				this._$BusyIndicator.remove();
				delete this._$BusyIndicator;
			}
		}

		/**
		 * Handler which suppresses event bubbling for busy section
		 *
		 * @param {object} oEvent The event on the suppressed DOM
		 * @private
		 */
		function suppressDefaultAndStopPropagation(oEvent) {
			var bTargetIsBusyIndicator = oEvent.target === this._$BusyIndicator.get(0);
			if (bTargetIsBusyIndicator && oEvent.type === "keydown" && oEvent.keyCode === 9) {
				// Special handling for "tab" keydown: redirect to next element before or after busy section
				jQuery.sap.log.debug("Local Busy Indicator Event keydown handled: " + oEvent.type);
				var oBusyTabbable = oEvent.shiftKey ? this.oBusyTabbableBefore : this.oBusyTabbableAfter;
				oBusyTabbable.setAttribute("tabindex", -1);
				// ignore execution of focus handler
				this.bIgnoreBusyFocus = true;
				oBusyTabbable.focus();
				this.bIgnoreBusyFocus = false;
				oBusyTabbable.setAttribute("tabindex", 0);
			} else if (bTargetIsBusyIndicator && (oEvent.type === "mousedown" || oEvent.type === "touchdown")) {
				// Do not "preventDefault" to allow to focus busy indicator
				jQuery.sap.log.debug("Local Busy Indicator click handled on busy area: " + oEvent.target.id);
			} else {
				jQuery.sap.log.debug("Local Busy Indicator Event Suppressed: " + oEvent.type);
				oEvent.preventDefault();
				oEvent.stopImmediatePropagation();
			}
		}

		/**
		 * Captures and redirects focus before it reaches busy section (from both sides)
		 *
		 * @private
		 */
		function redirectBusyFocus() {
			if (!this.bIgnoreBusyFocus) {
				// Redirect focus onto busy indicator (if not already focused)
				this._$BusyIndicator.get(0).focus();
			}
		}

		/**
		 * Create a tabbable span for the busy section of the control with according focus handling.
		 *
		 * @param {function} fnRedirectBusyFocus Focus handling function
		 * @returns {object} The span element's DOM node
		 * @private
		 */
		function createBusyTabbable(fnRedirectBusyFocus) {
			var oBusySpan = document.createElement("span");
			oBusySpan.setAttribute("tabindex", 0);
			oBusySpan.addEventListener("focusin", fnRedirectBusyFocus);
			return oBusySpan;
		}

		/**
		 * Create a tabbable span for the busy section of the control with according focus handling.
		 *
		 * @param {object}
		 * @param {function} fnRedirectBusyFocus Focus handling function
		 * @returns {object} The span element's DOM node
		 */
		function removeBusyTabbable(oBusySpan, fnRedirectBusyFocus) {
			if (oBusySpan.parentNode) {
				oBusySpan.parentNode.removeChild(oBusySpan);
			}
			oBusySpan.removeEventListener("focusin", fnRedirectBusyFocus);
		}

		/**
		 * Register event handler to suppress event within busy section
		 */
		function registerBusyInteractionHandler(oBusySectionDomRef, $BusyIndicatorDomRef, fnHandler) {
			var aSuppressHandler = [];
			for (var i = 0; i < aPreventedEvents.length; i++) {
				// Add event listeners with "useCapture" settings to suppress events before dispatching/bubbling starts
				oBusySectionDomRef.addEventListener(aPreventedEvents[i], fnHandler, {
					capture: true,
					passive: false
				});
				aSuppressHandler.push(
					jQuery.sap._suppressTriggerEvent(aPreventedEvents[i], oBusySectionDomRef, $BusyIndicatorDomRef.get(0))
				);
			}
			//for jQuery triggered events we also need the keydown handler
			$BusyIndicatorDomRef.bind("keydown", fnHandler);
			return aSuppressHandler;
		}

		/**
		 * Deregister event handler to suppress event within busy section
		 */
		function deregisterBusyInteractionHandler(oBusySectionDomRef, $BusyIndicatorDomRef, fnHandler, aSuppressHandler) {
			var i;
			if (oBusySectionDomRef) {
				for (i = 0; i < aPreventedEvents.length; i++) {
					// Remove event listeners with "useCapture" settings
					oBusySectionDomRef.removeEventListener(aPreventedEvents[i], fnHandler, {
						capture: true,
						passive: false
					});
				}
			}
			if (aSuppressHandler) {
				for (i = 0; i < aSuppressHandler.length; i++) {
					// this part should be done even no DOMRef exists
					jQuery.sap._releaseTriggerEvent(aSuppressHandler[i]);
				}
			}
			if ($BusyIndicatorDomRef) {
				$BusyIndicatorDomRef.unbind("keydown", fnHandler);
			}
		}

		/**
		 * Suppress interactions on all DOM elements in the busy section
		 *
		 * @param {Boolean} bBusy New busy state
		 * @private
		 */
		function fnHandleInteraction(bBusy) {
			var oBusySectionDomRef = this.getDomRef(this._sBusySection);

			if (bBusy) {
				if (oBusySectionDomRef) {
					// Those two elements handle the tab chain so it is not possible to tab behind the busy section.
					this.fnRedirectBusyFocus = redirectBusyFocus.bind(this);
					this.oBusyTabbableBefore = createBusyTabbable(this.fnRedirectBusyFocus);
					this.oBusyTabbableAfter = createBusyTabbable(this.fnRedirectBusyFocus);

					oBusySectionDomRef.parentNode.insertBefore(this.oBusyTabbableBefore, oBusySectionDomRef);
					oBusySectionDomRef.parentNode.insertBefore(this.oBusyTabbableAfter, oBusySectionDomRef.nextSibling);

					this._fnSuppressDefaultAndStopPropagationHandler = suppressDefaultAndStopPropagation.bind(this);

					this._aSuppressHandler = registerBusyInteractionHandler(
						oBusySectionDomRef,
						this._$BusyIndicator,
						this._fnSuppressDefaultAndStopPropagationHandler
					);
				} else {
					jQuery.sap.log.warning("fnHandleInteraction called with bBusy true, but no DOMRef exists!");
				}
			} else {
				if (this.oBusyTabbableBefore) {
					removeBusyTabbable(this.oBusyTabbableBefore, this.fnRedirectBusyFocus);
					delete this.oBusyTabbableBefore;
				}
				if (this.oBusyTabbableAfter) {
					removeBusyTabbable(this.oBusyTabbableAfter, this.fnRedirectBusyFocus);
					delete this.oBusyTabbableAfter;
				}
				delete this.fnRedirectBusyFocus;
				//trigger handler deregistration needs to be done even if DomRef is already destroyed
				deregisterBusyInteractionHandler(
					oBusySectionDomRef,
					this._$BusyIndicator,
					this._fnSuppressDefaultAndStopPropagationHandler,
					this._aSuppressHandler
				);
			}
		}

		return IBusyIndicator;
	},
	/* bExport= */ true
);
