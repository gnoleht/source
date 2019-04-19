'use strict';
app.register.controller('stationeryReportController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
            }
        });

        let year = (new Date()).getFullYear();
        $scope.setting.valuelist.year = [];
        for (var i = 0; i < 40; i++) {
            $scope.setting.valuelist.year.push({ id: year - i, text: year - i });
        }

        $scope.reloadGrid();
        if ($scope.grid) {
            $scope.grid.editAction = function (grid, item) { };
        }

        $scope.refresh = function () {
            $scope.changeFilter();
        };
    });

    $scope.displayFunction = function () {
        $scope.button.copy = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.delete = false;
        $scope.button.search = false;
    };

    $scope.loadView = function () {
        var currentTime = new Date();
        $scope.filter = {};
        setTimeout(function () {
            $scope.filter.year = currentTime.getFullYear();
            $scope.filter.month = currentTime.getMonth() + 1;
        });
    };

    $scope.cmbDepartment = {
        url: 'api/pt/stationeryLimit/GetListDepartment',
        allowClear: true
    }

    $scope.reloadGrid = function () {
        $scope.postData("api/pt/stationeryReport/get", {}, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
        });
    };

    $scope.changeFilter = function () {
        $scope.postData("api/pt/stationeryReport/get", $scope.filter, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
        });
    }

    $scope.export = function () {
        var data = $scope.grid.dataView.getItems();
        if (data.length == 0) return;

        var total = 0;
        $.each(data, function (i, item) {
            var listFilter = stationeryReportSetting.listFilter.category[item.category];
            if (listFilter)
                item.category = listFilter.text;
            listFilter = stationeryReportSetting.listFilter.stationeryUnit[item.unit];
            if (listFilter)
                item.unit = listFilter.text;
            total += item.prices;
        });

        data[0].totalPrice = total;
        data[0].month = $scope.filter.month + "/" + $scope.filter.year;
        var departmentName = 'Tất cả';//$scope.translation.ALL;

        if ($scope.filter.department) {
            departmentName = $('#Department').select2('data')[0].text;
        }
        data[0].department = departmentName;

        var param = {
            id: 'Stationery Report Teamplate',
            data: JSON.stringify(data),
            baseRow: '9',
        };

        $scope.postData('api/pt/stationeryReport/export', param, function (data) {
            window.location = 'api/system/ViewFile/' + data.fileId + '/' + data.fileName;
        });
    };
}]);
