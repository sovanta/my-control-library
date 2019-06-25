---------------------------MOCKSERVER----------------------------------------

The mockserver provides multiple 'global' entity sets located in the /mockdata folder. Each example .json-file is defined
according to the Northwind service.

To use the mockserver do the following steps:

1. Create sample for the requested sample
2. Adjust the mockServerConfig in the Component.js:

    var mockServerConfig = {
            SampleNameSpace : "{{SampleNameSpace}}",
            bLocalMockdata : false,
            bLocalMetadata : false
        };

    The SampleNameSpace will be set automatically when creating the sample. The default options
    are 'global' mockdata and metadata (Northwind service). To use local files, change the parameter to 'true' and
    add the required files into the sample folder:
        mockdata in : '/localService/mockdata'
        custom metadata in: '/localService'
    Please be aware, when using local mockdata and global metadata, that the mocked entity sets need to be aligned
    with the Northwind service.

    For convenience, the Northwind metadata are extended with a CustomSet (Property: ID).

3. In the Page.controller of the corresponding sample both a oData and a JSON model are defined. For the oData model no
further adjustments are necessary. For the JSON model, replace 'SampleMockdata' in the module path with the name of the
used entity set.


Questions? Contact <martin.schaumann@sovanta.com>
