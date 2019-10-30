define([
    "SamplesampleView/services/dataService",
    "knockout",
    "plugins/dialog",
    "jquery",
    "durandal/app",
    "i18next"
], function(dataService, ko, dialog, $, app, i18n, logger) {
    "use strict";
    var SampleDirectoryDialogVM = function() {
        /**
         * Determines if dialog is in a loading state.
         * @type {knockout.observable.<boolean>}
         * @public
         */
        this.bSampleDirectoryLoading = ko.observable(false);
        /**
         * The search string to pass to the directory
         * @type {string}
         * @public
         */
        this.sSearchString = "";
        /**
         * The type to search for
         * @type {string}
         * @public
         */
        this.sType = "";
        /**
         * The sample code to pass to the directory
         * @type {number}
         * @public
         */
        this.fSampleIdd = 0;
        /**
         * The person id to pass to the directory
         * @type {number}
         * @public
         */
        this.fPersonId = 0;
        /**
         * The indicator to pass to the directory
         * @type {number}
         * @public
         */
        this.iInd = 0;
    };

    /**
     * Event handler function on closing Sample Directory dialog.
     * @returns {undefined} Nothing.
     */
    SampleDirectoryDialogVM.prototype.onCloseDialog = function() {
        var divFrame = $("#SampleDirectory-iframe").get(0);
        divFrame.contentWindow.document.open();
        divFrame.contentWindow.document.write("");
        divFrame.contentWindow.document.close();
        dialog.close(this);
    };

    /**
     * Event handler function for when a result is selected in the Sample Directory
     * @param {object} thisVm - Reference to this viewmodel
     * @param {object} jqueryObj - jqueryEvent object which triggers this event
     * @param {object} oProvider - An object containing a selected result
     * @returns {undefined} Nothing
     */
    SampleDirectoryDialogVM.prototype.onProviderSelected = function(thisVm, jqueryObj, oProvider) {
        var sReturnData = JSON.stringify(oProvider); //Need to deep copy this - otherwise there'll be issues when we clear the iframe
        var divFrame = $("#SampleDirectory-iframe").get(0);
        divFrame.contentWindow.document.open();
        divFrame.contentWindow.document.write("");
        divFrame.contentWindow.document.close();
        dialog.close(this, JSON.parse(sReturnData));
    };

    /**
     * Removes the spinner of Sample Directory Dialog
     * @returns {undefined} Nothing
     * @public
     */
    SampleDirectoryDialogVM.prototype.frameCompositionComplete = function() {
        this.bSampleDirectoryLoading(false);
    };

    /**
     * Called from durandal when this view model is attached to the view
     * @returns {undefined} Nothing
     * @public
     */
    SampleDirectoryDialogVM.prototype.attached = function() {
        var self = this;
        /**
         * Populate iframe DiscernObjectFactory.
         * @param {object} iframeWindow - iframeWindow to get DiscernObjectFactory populated.
         * @param {object} parentWindow - parent window that contains the iframe.
         * @returns {undefined} Nothing.
         */
        function populateIframeDiscernObjectFactory(iframeWindow, parentWindow) {
            if (iframeWindow.external === null || typeof iframeWindow.external === "undefined") {
                iframeWindow.external = { DiscernObjectFactory: parentWindow.external.DiscernObjectFactory };
            }
            else {
                iframeWindow.external.DiscernObjectFactory = parentWindow.external.DiscernObjectFactory;
            }
        }

        dataService.getSearchHTML(this.sSearchString, this.fSampleCd1,  this.fPersonId, this.sType, this.iInd)
            .then(function(dialogContent) {
                var divFrame = $("body #SampleDirectory-iframe").get(0);
                divFrame.contentWindow.document.open();

                // Writes reply to document
                divFrame.contentWindow.document.write(dialogContent);
                divFrame.contentWindow.document.close();
            })
            .fail(function() {
                var sErrorMessage = i18n.t("app:modules.sampleView.SampleDirectory.SampleDirectoryLoadError");
                var sErrorTitle = i18n.t("app:modules.sampleView.SampleDirectory.header");
                app.showMessage(sErrorMessage, sErrorTitle, [ i18n.t("app:modules.sampleView.SampleDirectory.okLabel") ]).then(function() {
                    dialog.close(self);
                });
            });
    };

    /**
     * Runs automatically when the view model reaches the active stage of its lifecycle.
     * @param {object} activationData - data needed to retrieve Sample directory MPage wrapper content.
     * @returns {undefined} Nothing
     * @public
     */
    SampleDirectoryDialogVM.prototype.activate = function(activationData) {
        if (activationData) {
            this.bSampleDirectoryLoading(true);
            this.sSearchString = activationData.sSearchString;
            this.fMedicalServiceCd = activationData.fMedicalServiceCd;
            this.sPracticeSiteType = activationData.sPracticeSiteType;
            this.fPatientId = activationData.fPatientId;
            this.iExternalInd = activationData.iExternalInd; 
        }
    };

    return SampleDirectoryDialogVM;
});
