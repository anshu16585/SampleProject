define([
    "referralDetailView/services/dataContext",
    "mpages/script_request",
    "durandal/system",
    "durandal/app",
    "mpages/logger",
    "knockout",
    "i18next",
    "lodash"
], function (dataContext, ScriptRequest, system, app, logger, ko, i18n) {
    "use strict";
    /**
     * Version number of referral case detail.
     * @type {Number}
     * @private
     */
    var m_iVersionNumber = 0;

    /**
    * Updates the referral status of referral case associated with given referral id
    * @param {Number} Id - The value of  id
    * @param {Object} obj1 
    * @param {Object} obj2 
    */
    function CCLRequest1(Id, Obj1, obj2) {
        var self = this;

        /**
         * The service callback to be executed when CCL calls can be resolved.
         * @returns {undefined} Nothing.
         */
        function scriptCallback() {
            m_iVersionNumber++;
        }

        if (!Id || Id <= 0.0) {
            logger.logError("Invalid referral id", Id, "sampleView/services/dataService: CCLRequest1", system.debug());
            return system.defer().reject();
        }

        var oRequestStructure = {};
        var oRequest;

        oRequestStructure = {
            "Request": {
                "Id": Id,
                "Id1": oReferToProvider.CODE,
                "Id2": oReferToFacility.CODE
            }
        }
        oRequestStructure.Request.versionNumber = m_iVersionNumber;
        oRequest = getScriptRequestData("ccl_req1", oRequestStructure, "request");
        return generalScriptCall(oRequest, scriptCallback);
    }
	
	    /**
     * Gets the html to render the referral directory provider search mpage
     * @param {string} 
     * @param {number} 
     * @param {string} 
     * @returns {object} deferred promise
     * @private
     */
    function CCLRequest2(param1, param2, param3, param4, param5) {
        var oDeferred = system.defer(),
            oRequest = {};

        var param1 = param1 ? param1 : "";
        var param2 = param2 ? param2 : 0;
        var param1 = param3 ? param3 : "";
        var param1 = param4 ? param4 : 0;
        var param1 = param5 ? param5 : 0;

        var asParams = [
            "^MINE^",
            param1,
            "^" + param2 + "^",
            "^" + param3 + "^",
            param4,
            param5
        ];
        oRequest = new ScriptRequest();
        oRequest.setProgramName("ccl2");
        oRequest.setParameters(asParams);
        oRequest.setAsync(true);
        oRequest.setExpectsJSON(false);
        dataContext.executeScript(oRequest)
            .done(function (oReply) {
                if (oReply === "") {
                    logger.logError("Response from ccl_req2 - " + asParams + " was not sucessful", oReply, system.debug());
                    oDeferred.reject();
                }
                else {
                    oDeferred.resolve(oReply);
                }
            })
            .fail(function () {
                logger.logError("Failed request for ccl_req2 - " + asParams + " was not sucessful", null, system.debug());
                oDeferred.reject();
            });

        return oDeferred;
    }
   
    var dataService = {
        CCLRequest2: CCLRequest2,
        CCLRequest1: CCLRequest1

    };
    return dataService;
});
