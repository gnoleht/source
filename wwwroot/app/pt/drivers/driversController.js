'use strict';
app.register.controller('driversController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        // getUser
        $scope.getUser();
        // getVehicleTypes
        $scope.getVehicleTypes();

        if ($scope.grid) {
            // load data
            $scope.loadData();
        }

        // search
        $scope.search = function () {
            // load data
            $scope.loadData();
        };

        // search
        $scope.refresh = function () {
            // load data
            $scope.loadData();
        };

        $(window).resize(function (e) {
            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });

    // load data
    $scope.loadData = function () {
        var searchValue = $('#inputSearch').val();
        if (!searchValue)
            searchValue = null;
        var params = {
            searchValue: searchValue
        };
        $scope.postData('api/pt/drivers/Get', params, function (data) {
            if (data) {
                $scope.grid.setData(data);
                $scope.grid.invalidate();
            }
        });
    };

    // add
    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {
            isActive: true
        };
        callModal('modal-detail');
    };

    // edit
    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (!data)
            showError($scope.translation.ERR_UPDATE_NULL);
        else {
            $scope.action = 'edit';
            $scope.data = $.extend(true, {}, data);
            callModal('modal-detail');
        }
    };

    // copy
    $scope.copy = function () {
        var data = $scope.grid.getCurrentData();
        if (!data)
            showError($scope.translation.ERR_SELECT_DATA_COPY);
        else {
            $scope.action = 'add';
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            callModal('modal-detail');
        }
    };

    // delete
    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (!data)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    // delete data
    $scope.deleteData = function () {
        var params = {
            id: $scope.data.id
        };
        $scope.postData("api/pt/drivers/Delete", params, function (data) {
            if (data) {
                $scope.grid.dataView.deleteItem($scope.data.id);
                $scope.grid.invalidate();
                showSuccess($scope.translation.SUCCESS_DELETE);
            }
        });
    };

    // save data
    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        var params = {
            data: $scope.data
        };

        if ($scope.action === 'add') {
            $scope.postData("api/pt/drivers/Add", params, function (data) {
                if (data) {
                    $scope.grid.dataView.insertItem(0, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
        else {
            $scope.postData("api/pt/drivers/Update", params, function (data) {
                if (data) {
                    $scope.grid.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
    };

    // getVehicleTypes
    $scope.getVehicleTypes = function () {
        $scope.postData('api/pt/VehicleTypes/get', null, function (data) {
            if (data) {
                var _data = data.map(function (item) {
                    if (item.isActive)
                        return { id: item.id, text: item.name };
                });
                $scope.setting.valuelist.vehicleTypes = _data;
            }
        });
    };

    // getUser
    $scope.getUser = function () {
        $scope.postData('api/sys/user/get', null, function (data) {
            if (data) {
                var _data = data.map(function (item) {
                    return { id: item.id, text: item.displayName };
                });
                $scope.setting.valuelist.user = _data;
            }
        });
    };
}]);