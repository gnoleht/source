'use strict';
app.register.controller('exportSettingController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        init('exportSetting', $scope, true, false);
    });

    $scope.initExportSetting = function (grid) {
        $scope.data = {};

        $scope.grid = grid;
        var param = {
            module: grid.settingInfo.module,
            form: grid.settingInfo.form,
            grid: grid.name
        }
        $scope.postData('api/sys/exportData/getByGrid', param, function (data) {
            $scope.listData = data;
        });
    }

    $scope.save = function () {
        if ($scope.data.selectId) {
            $scope.grid.exportTemplateData($scope.data.selectId);
        }

        $("#exportSetting").modal('hide');
    }
}]);


