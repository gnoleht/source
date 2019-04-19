'use strict';
app.register.controller('userController', ['$scope', function ($scope) {

    init("user", $scope, true);

    $scope.lDAPLogin = null;
    //init
    $scope.$on('$routeChangeSuccess', function () {
        if ($scope.grid != null) {
            $scope.grid.loadData();
        }
        $scope.getListUser(null);

        $scope.postData("api/sys/user/GetLDAPLogin", null, function (data) {
            $scope.lDAPLogin = data;
        });

    });

    $scope.displayFunction = function () {
        $("#btnChangePass").show();
        $scope.button.editLanguage = true;
        $scope.button.filter = false;
    };

    $scope.getListUser = function (search) {
        $scope.postData("api/sys/user/getListUserForProject", search, function (data) {
            $scope.setting.valuelist.userId = data;
        });

    };

    $scope.cmbUserId = {
        url: "api/sys/user/getListUserForProject",
        allowClear: true,
    };

    $scope.setZoom = function (zoom, el) {

        var transformOrigin = [0, 0];
        el = el || instance.getContainer();
        var p = ["webkit", "moz", "ms", "o"],
            s = "scale(" + zoom + ")",
            oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

        for (var i = 0; i < p.length; i++) {
            el.style[p[i] + "Transform"] = s;
            el.style[p[i] + "TransformOrigin"] = oString;
        }

        el.style["transform"] = s;
        el.style["transformOrigin"] = oString;
    };


}]);
