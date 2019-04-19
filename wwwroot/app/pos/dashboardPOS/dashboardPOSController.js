'use strict';
app.register.controller('dashboardPOSController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.dataDashboardTop = null;
    $scope.countInclude = 0;
    $scope.showLoading = false;

    $scope.displayFunction = function () {
        $scope.button.filter = false;
        $scope.button.search = false;
        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.copy = false;
        $scope.button.delete = false;
    };

    //init
    $scope.$on('$routeChangeSuccess', function () {

        $scope.loadStore();
        $scope.loadDashboardTop([]);

        //$.ajax({
        //    url: '/app/pos/valuelist.json',
        //    type: 'get',
        //    dataType: 'json',
        //    async: false,
        //    success: function (data) {
        //        $.each(data, function (key, item) {
        //            $scope.setting.valuelist[key] = buildValueList(item);
        //        });

        //    },
        //});

    });

    $scope.runLoaded = function () {
        $scope.countInclude++;
        if ($scope.countInclude == 6) {
            $scope.showLoading = false;
        }
    };

    $scope.loadDashboardTop = function (listStore) {
        $scope.postData("api/pos/DashboardPOS/get", { listStore: listStore }, function (data) {
            $scope.$applyAsync(function () {
                $scope.dataDashboardTop = data;
            });
        });
    };


    $scope.loadStore = function () {
        $scope.postNoAsync("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    };
    $scope.cmbStoreFilter = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
    };

    $scope.filterByTime = function () {

        $scope.loadDashboardTop($scope.listStoreId);
        $timeout(function () {
            $.each($scope.childScope, function (name, value) {
                $scope.childScope[name].loadData($scope.listStoreId);
            });  
        });
           
    };
}]);