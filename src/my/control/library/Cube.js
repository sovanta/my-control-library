sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/Control",
    "./library"
  ],
  function(jQuery, Control, library) {

    "use strict";
    /**
     * Constructor for a new Cube.
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
     * @since {{SinceVersionPlaceholder}}
     * @alias my.control.library.Cube
     */

    var Cube = Control.extend("my.control.library.Cube",
      /** @lends my.control.library.Cube.prototype */
      {

        metadata: {

          library: "my.control.library",

          properties: {},
          aggregations: {}

        },
        /**
         * CSS classes map.
         * @type {Object}
         * @private
         */
        CSS_CLASSES_CUBE: {
          CSS_BASE: "myControlLibrary_Cube",
          WRAPPER: "cubeWrap",
          CUBE: "cube",
          CUBE_FRONT: "cubeFront",
          CUBE_BACK: "cubeBack",
          CUBE_TOP: "cubeTop",
          CUBE_BOTTOM: "cubeBottom",
          CUBE_LEFT: "cubeLeft",
          CUBE_RIGHT: "cubeRight"
        },

        init: function() {
          this.addStyleClass(this.CSS_CLASSES_CUBE.CSS_BASE);
        },


        renderer: function(oRM, oCube) {
          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CSS_BASE);
          oRM.writeClasses();
          oRM.write(">");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.WRAPPER);
          oRM.writeClasses();
          oRM.write(">");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CUBE);
          oRM.writeClasses();
          oRM.write(">");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CUBE_FRONT);
          oRM.writeClasses();
          oRM.write(">");
          oRM.write("</div>");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CUBE_BACK);
          oRM.writeClasses();
          oRM.write(">");
          oRM.write("</div>");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CUBE_TOP);
          oRM.writeClasses();
          oRM.write(">");
          oRM.write("</div>");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CUBE_BOTTOM);
          oRM.writeClasses();
          oRM.write(">");
          oRM.write("</div>");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CUBE_LEFT);
          oRM.writeClasses();
          oRM.write(">");
          oRM.write("</div>");

          oRM.write("<div");
          oRM.addClass(oCube.CSS_CLASSES_CUBE.CUBE_RIGHT);
          oRM.writeClasses();
          oRM.write(">");
          oRM.write("</div>");


          oRM.write("</div>");
          oRM.write("</div>");
          oRM.write("</div>");
        }

      });

    return Cube;

  }, /* bExport= */ true);
