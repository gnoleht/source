'use strict';
app.register.controller('settingController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {        
        $scope.loadData();
        setSelectedMenu("function");
    });

    $scope.loadData = function () {
        $scope.postFile("api/sys/setting/GetAllSetting", null, function (data) {
            $scope.listSetting = data;
        });  
    };

    $scope.displayFunction = function () {
        $("#btnSaveSetting").show();
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.saveSetting = function () {
        $scope.frmFile.set("data", JSON.stringify($scope.listSetting));

        $scope.postFile("api/sys/setting/update", $scope.frmFile, function (data) {
            if (data)
                showSuccess($scope.translation.SUCCESS_SAVE);
            else
                showError($scope.translation.ERR_SAVE);
        });        
    };

    $scope.refresh = function () {
        $scope.loadData();
    };
}]);