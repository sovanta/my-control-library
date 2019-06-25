sap.ui.define('my/control/library/mockserver/MockServer',[
    "sap/ui/core/util/MockServer"
], function (MockServer) {
    "use strict";
    return {

        /*
        * @param {object} mockServerConfig - contains namespace of sample {String} and two {boolean} values indicating where the metadata and mockdata are located
        * True indicates that local files (metadata and/or mockfiles should be used, if set to false, the global available files of the mockserver are applied.
        * */

        init: function (mockServerConfig) {

            var sControlName   = mockServerConfig.SampleNameSpace,
                bLocalMockdata = mockServerConfig.bLocalMockdata,
                bLocalMetadata = mockServerConfig.bLocalMetadata,
                sMockDataPath       = jQuery.sap.getModulePath("my.control.library.mockserver"),
                sMockMetaDataPath   = jQuery.sap.getModulePath("my.control.library.mockserver");

            // create
            var oMockServer = new MockServer({
                rootUri: "https://services.odata.org/V2/my/control/library/mockdata.svc/"
            });

            // configure
            MockServer.config({
                autoRespond: true

            });
            // simulate

            if(bLocalMetadata){
                sMockMetaDataPath = jQuery.sap.getModulePath("my.control.library.sample." + sControlName + "/localService");
            }

            if(bLocalMockdata){
                sMockDataPath = jQuery.sap.getModulePath("my.control.library.sample." + sControlName +  "/localService");
            }



            oMockServer.simulate(

                sMockMetaDataPath + "/metadata.xml",

                {
                    sMockdataBaseUrl: sMockDataPath + "/mockdata",
                    bGenerateMissingMockData: false
                }
            );

            // start
            oMockServer.start();
        }
    };
});