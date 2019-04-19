'use strict';
app.register.controller('stationeryLimitController', ['$scope', function ($scope) {
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
        $scope.reloadGrid();
        $scope.refresh = function () {
            $scope.reloadGrid();
        };
    });

    $scope.displayFunction = function () {
        $scope.button.copy = false;
    };

    $scope.cmbDepartment = {
        url: 'api/pt/stationeryLimit/GetListDepartment',
        //params: {
        //    pjid: $scope.params.pjid
        //}
    };

    $scope.cmbRole = {
        url: 'api/pt/stationeryLimit/GetRolePortal',
    };

    $scope.reloadGrid = function () {
        $scope.postData("api/pt/stationeryLimit/get", null, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
        });
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.postData('api/pt/stationeryLimit/GetDefaultRole', null, function (data) {
            $scope.data.approveRole = data.approveRole;
            $scope.data.orderRole = data.orderRole;
        });
        callModal('modal-limit');
    };

    $scope.edit = function () {
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data) {
            $scope.action = 'edit';
            callModal('modal-limit');
        }
        else {
            showWarning($scope.translation.WRN_SELECT_EDIT);
        }
    };

    $scope.save = function () {
        if (!$scope.checkData()) return;
        if ($scope.action == 'add') {
            $scope.postData("api/pt/stationeryLimit/add", { data: $scope.data }, function (data) {
                $('#modal-limit').modal('hide');
                $scope.reloadGrid();
                showSuccess($scope.translation.SAVE_SUCCESS);
            })
        }
        else if ($scope.action == 'edit') {
            $scope.postData("api/pt/stationeryLimit/update", { data: $scope.data }, function (data) {
                $('#modal-limit').modal('hide');
                $scope.reloadGrid();
                showSuccess($scope.translation.SAVE_SUCCESS);
            })
        }
    };

    $scope.checkData = function () {
        var message = '';
        if (!$scope.data.title) message += $scope.translation.WRN_NOT_NULL_TITLE + "<br/>";
        if (!$scope.data.limit) message += $scope.translation.WRN_NOT_NULL_LIMIT + "<br/>";
        if (!$scope.data.department) message += $scope.translation.WRN_NOT_NULL_DEPARTMENT + "<br/>";
        if (!$scope.data.approveRole) message += $scope.translation.WRN_NOT_NULL_APPROVE_ROLE + "<br/>";
        if (!$scope.data.orderRole) message += $scope.translation.WRN_NOT_NULL_ORDER_ROLE + "<br/>";
        if (message.length > 0) {
            showWarning(message);
            return false;
        };
        return true;
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
        $scope.postData("api/pt/stationeryLimit/delete", { id: $scope.data.id }, function (data) {
            $scope.reloadGrid();
            showSuccess($scope.translation.DELETE_SUCCESS);
        })
    };

}]);



