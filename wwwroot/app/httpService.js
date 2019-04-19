'use strict';
app.factory('httpService', ['$http',  '$q', '$location', function ($http, $q, $location) {

    var httpServiceFactory = {};

    var _language = {};
    httpServiceFactory.setLanguage = function (tranlation) { _language = tranlation };

    var _post = function (url, data, callback, callbackFail) {

        var config = {
            async: true,
            cache: false,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $http.post(url, data, config).then(function (response) {
            if (response != null && response.data != null) {
                if (response.data.isError) {
                    if (_language[response.data.message] == undefined)
                        showError(response.data.message);
                    else
                        showError(_language[response.data.message]);

                    if (callbackFail != undefined)
                        callbackFail(response.data.data);
                }
                else if (callback != undefined)
                    callback(response.data.data);
            }
        }, function (response) {
            console.log(response);
        });

       
        //$.ajax({
        //    url: url,
        //    data: data,
        //    type: "POST",
        //    contentType: "application/json",
        //    success: function (response) {

        //        if (response != null) {
        //            if (response.isError) {
        //                if (_language[response.message] == undefined)
        //                    showError(response.message);
        //                else
        //                    showError(_language[response.message]);

        //                if (callbackFail != undefined)
        //                    callbackFail(response.data);
        //            }
        //            else if (callback != undefined)
        //                callback(response.data);
        //        }
        //    },
        //    fail: function (exp) {
        //        console.log(exp);
        //    }
        //});


    }



    httpServiceFactory.post = _post;

    var _postAsync = function (url, data, callback, callbackFail) {
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            contentType: "application/json",
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (_language[response.message] == undefined)
                            showError(response.message);
                        else
                            showError(_language[response.message]);

                        if (callbackFail != undefined)
                            callbackFail(response.data);
                    }
                    else if (callback != undefined)
                        callback(response.data);
                }
            },
            fail: function (exp) {
                showError(exp);
                console.log(exp);
            },
            async: false
        });
    }
    httpServiceFactory.postAsync = _postAsync;

    var _postNoAsync = function (url, data, callback, callbackFail) {
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            contentType: "application/json",
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (_language[response.message] == undefined)
                            showError(response.message);
                        else
                            showError(_language[response.message]);

                        if (callbackFail != undefined)
                            callbackFail(response.data);
                    }
                    else if (callback != undefined)
                        callback(response.data);
                }
            },
            fail: function (exp) {
                showError(exp);
                console.log(exp);
            },
            async: false
        });
    }
    httpServiceFactory.postNoAsync = _postNoAsync;

    var _postFile = function (url, data, callback, callbackFail) {
        $.ajax({
            url: url,
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                if (response.isError) {
                    if (_language[response.message] == undefined)
                        showError(response.message);
                    else
                        showError(_language[response.message]);

                    if (callbackFail != undefined)
                        callbackFail(response.data);
                }
                else if (callback != undefined)
                    callback(response.data);
            },
             fail: function (exp) {
                console.log(exp);
            }
        });
    }
    httpServiceFactory.postFile = _postFile;


    return httpServiceFactory;
}]);
