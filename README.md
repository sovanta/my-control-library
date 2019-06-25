# Demo UI5 Library

This is the Demo UI5 Library. You can use this Library like any other UI5 Standard or Custom Library.

  1. [Git flow](#git-flow)
  2. [Usage](#usage)
  3. [Authors](#authors)


## Git flow
If you start to develop an Control or do an fix for an existing Control, make sure that you work on the correct feature Branch for that Control.

1. Check if the feature Branch **feature/`{LibraryName}`_`{ControlName}`** (e.g. feature/myControlLibrary_Button) exists. 
 - If so checkout. And merge the corresponding develop Branch inside this feature Branch to be sure all new changes are available.
 - If not create that Branch and make sure to use the correct develop Branch from which you will branch.
2. Make your Development or fix on that Branch.
3. If you've finished your Development Merge that Branch back into the development Branch.

## Usage

To use this Library you have checkout the correct master Branch

Your're also able to consume the Library via NPM. Therefor just run the following command or update your package.json:
```sh
npm install sovanta/my-control-library#master
```

And you have to initialize it in your UI5 Bootstrap. This Library doesn't have an own Theme included. 
So you have to load an Theme which contains Styling for this Library.

```sh
<script id="sap-ui-bootstrap"
            src="resources/sap-ui-core.js"
            data-sap-ui-libs="sap.m, my.control.library"
            data-sap-ui-theme="{THEME_NAME}"
            data-sap-ui-compatVersion="edge"
            data-sap-ui-resourceroots='{
                    "sov.comp.projectName": "",
                    "my.control.library": "{PATH_TO_LIB}"
                }'>
```

## Authors

* **Deniz Cakici** <deniz.cakici@sovanta.com>
* **Sebastian Mahr** <sebastian.mahr@sovanta.com>
* **Daniel Barthel** <daniel.barthel@sovanta.com>
