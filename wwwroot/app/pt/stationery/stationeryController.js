'use strict';
app.register.controller('stationeryController', ['$scope', function ($scope) {
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

        $scope.refresh = function () { $scope.reloadGrid(); }

        $scope.reloadGrid();
    });

    $scope.displayFunction = function () {
        $scope.button.copy = false;
    };

    $scope.reloadGrid = function () {
        $scope.postData("api/pt/stationery/get", $scope.params, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
        });
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.permission = {};
        $scope.data.permission.create = $scope.params.methodPermission.create !== null;
        //$.each($scope.methodPermission, function (key, value) {
        //        $scope.data.permission[key] = true;
        //});
        $scope.childScope.stationeryForm.dataAction('add', $scope.data);
    };

    $scope.edit = function () {
        $scope.action = 'edit';
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data) {
            $scope.childScope.stationeryForm.dataAction('edit', $scope.data);
        }
        else {
            showWarning($scope.translation["WRN_SELECT_DATA_EDIT"]);
        }
        
    };

    $scope.setPermission = function (data, permission) {
        $.each($scope.methodPermission, function (method, value) {
            if (value != "99") data[method] = true;
            else data[method] = data.createdBy == $scope.loginInfo.id;
        });
    };

    $scope.delete = function () {
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data == null) {
            showWarning($scope.translation["ERR_SELECT_DATA_DELETE"]);
        }
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        var childScope = $scope.childScope.stationeryForm;
        if (childScope)
            childScope.dataAction('delete', $scope.data);
    };

    $scope.saveStationery = function (data, action) {
        switch (action) {
            case "sendapprove":
                showSuccess($scope.translation.SEND_APPROVE_SUCCESS);
                break;
            case "approve":
                showSuccess($scope.translation.APPROVE_SUCCESS);
                break;
            case "reject":
                showSuccess($scope.translation.SEND_REJECT_SUCCESS);
                break;
            default:
                showSuccess($scope.translation.SAVE_SUCCESS);
        }
        $scope.reloadGrid();
    };
    $scope.deleteStationery = function () {
        $scope.data = null;
        $scope.reloadGrid();
    };
}]);



