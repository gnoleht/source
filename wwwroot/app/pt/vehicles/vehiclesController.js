'use strict';
app.register.controller('vehiclesController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        // getDepartments
        $scope.getDepartments();
        // getVehicleTypes
        $scope.getVehicleTypes();
        // getDriver
        $scope.getDriver();

        if ($scope.grid) {
            // load data
            $scope.loadData();
            // change status
            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("checkWI")) {
                    var data = args.grid.dataView.getItem(args.row);
                    data.isActive = !data.isActive;
                    $scope.action = 'edit';
                    $scope.data = $.extend(true, {}, data);
                    $scope.save();
                }
            });
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
        $scope.postData('api/pt/vehicles/Get', params, function (data) {
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
            if (data.isActive) {
                showWarning($scope.translation.RECORD_IS_BEING_USED);
                return;
            }
            else {
                $scope.data = data;
                $('#modal-confirm').modal();
            }
        }
    };

    // delete data
    $scope.deleteData = function () {
        var params = {
            id: $scope.data.id
        };
        $scope.postData("api/pt/vehicles/Delete", params, function (data) {
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
            $scope.postData("api/pt/vehicles/Add", params, function (data) {
                if (data) {
                    $scope.grid.dataView.insertItem(0, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
        else {
            $scope.postData("api/pt/vehicles/Update", params, function (data) {
                if (data) {
                    $scope.grid.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
    };

    // getDepartments
    $scope.getDepartments = function () {
        $scope.postData('api/sys/company/get', null, function (data) {
            if (data) {
                var dataValueList = data.map(function (item) {
                    return { id: item.id, text: item.name, type: item.type };
                });
                $scope.setting.valuelist.departments = dataValueList;
            }
        });
    };

    // getVehicleTypes
    $scope.getVehicleTypes = function () {
        $scope.postData('api/pt/VehicleTypes/get', null, function (data) {
            if (data) {
                var _data = data.map(function (item) {
                    if (item.isActive)
                        return { id: item.id, text: item.name };
                });
                $scope.setting.valuelist.vehicleType = _data;
            }
        });
    };

    // getDriver
    $scope.getDriver = function () {
        $scope.postData('api/sys/user/get', null, function (data) {
            if (data) {
                var _data = data.map(function (item) {
                    return { id: item.id, text: item.displayName };
                });
                $scope.setting.valuelist.driver = _data;
            }
        });
    };

    // config Department
    $scope.configDepartment = {
        templateResult: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.type === '1')
                    color = '#f98f05';
                else if (nodeOpt.type === '2')
                    color = '#fcd036';
                else if (nodeOpt.type === '3')
                    color = '#00b19d';
                else if (nodeOpt.type === '4')
                    color = '#0e62c7';
                return $('<span style="margin-left: ' + nodeOpt.type * 10 + 'px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        }
        //templateSelection: function (data) {
        //    if (!data.id) return data.text;
        //    if (!data.text) return null;
        //    var nodeOpt = JSON.parse(data.element.attributes.opt.value);
        //    if (nodeOpt !== null) {
        //        var color = '#ff6264';
        //        if (nodeOpt.type === '1')
        //            color = '#f98f05';
        //        else if (nodeOpt.type === '2')
        //            color = '#fcd036';
        //        else if (nodeOpt.type === '3')
        //            color = '#00b19d';
        //        else if (nodeOpt.type === '4')
        //            color = '#0e62c7';
        //        return $('<span style="margin-left: 2px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
        //    }
        //    else return data.text;
        //}
    };
}]);