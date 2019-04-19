'use strict';
app.factory('authService', ['$http', '$q', '$location', 'localStorageService', function ($http, $q, $location, localStorageService) {
    debugger;
    var authServiceFactory = {};

    var _fillAuthData = function () {

        var token = $.cookie('TOKEN');
        if (token == null || localStorage.USERINFO == null || localStorage.USERINFO == "")
            window.location.href = "/login";
        else {
            var userInfo = JSON.parse(localStorage.USERINFO);
            if (authServiceFactory != null && authServiceFactory.user != null && authServiceFactory.user.id != userInfo.id)
                window.location.reload();

            authServiceFactory.user = userInfo;
        }
    }

    authServiceFactory.fillAuthData = _fillAuthData;

    return authServiceFactory;
}]);

app.filter('viewByType', function () {
    return function (str) {
        if (str !== null) {
            var d = new Date(str);
            if (!isNaN(d.valueOf())) {
                return moment(str).format('DD-MM-YYYY');;
            }
        }
        return str;
    }
});