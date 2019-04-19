'use strict';
app.register.controller('vehicleTypesController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        // valuelist
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                });
            }
        });

        $scope.setting.valuelist.category = $scope.setting.valuelist.vehicleCategory;
        // get locaiton
        $scope.getLocaiton();
        // get viewer
        $scope.getViewers();
        // get arrangers
        $scope.getArrangers();
        // get Approves
        $scope.getApproves();

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
        $scope.postData('api/pt/vehicleTypes/Get', params, function (data) {
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
            isActive: true,
            category: '1'
        };
        $scope.postData('api/pt/vehicleTypes/GetDefaultRole', null, function (data) {
            $scope.data.approves = [];
            $scope.data.approves.push(data.approve);
            $('#select-approves').selectpicker('val', $scope.data.approves);

            $scope.data.arrangers = [];
            $scope.data.arrangers.push(data.arranger);
            $('#select-arrangers').selectpicker('val', $scope.data.arrangers);
        });

        callModal('modal-detail');
        $('#select-viewers').selectpicker('val', []);
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
            $('#select-approves').selectpicker('val', data.approves);
            $('#select-arrangers').selectpicker('val', data.arrangers);
            $('#select-viewers').selectpicker('val', data.viewers);
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
            $('#select-approves').selectpicker('val', data.approves);
            $('#select-viewers').selectpicker('val', data.viewers);
            $('#select-arrangers').selectpicker('val', data.arrangers);
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
        $scope.postData("api/pt/vehicleTypes/Delete", params, function (data) {
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
            $scope.postData("api/pt/vehicleTypes/Add", params, function (data) {
                if (data) {
                    $scope.grid.dataView.insertItem(0, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
        else {
            $scope.postData("api/pt/vehicleTypes/Update", params, function (data) {
                if (data) {
                    $scope.grid.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
    };

    // get viewers
    $scope.getViewers = function () {
        var params = {
            objectId: 'PORTAL'
        };
        $scope.postData('api/pt/vehicleTypes/getViewers', params, function (data) {
            if (data) $scope.setting.valuelist.viewers = data;
            $timeout(function () {
                $("#select-viewers").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-viewers').selectpicker('refresh');
            });
        });
    };

    // get arrangers
    $scope.getArrangers = function () {
        var params = {
            objectId: 'PORTAL'
        };
        $scope.postData('api/pt/vehicleTypes/getArrangers', params, function (data) {
            if (data) $scope.setting.valuelist.arrangers = data;
            $timeout(function () {
                $("#select-arrangers").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-arrangers').selectpicker('refresh');
            });
        });
    };

    // get Approves
    $scope.getApproves = function () {
        var params = {
            objectId: 'PORTAL'
        };
        $scope.postData('api/pt/vehicleTypes/getApproves', params, function (data) {
            if (data) $scope.setting.valuelist.approves = data;
            $timeout(function () {
                $("#select-approves").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-approves').selectpicker('refresh');
            });
        });
    };

    // get locaiton
    $scope.getLocaiton = function () {
        $scope.postData('api/pt/location/get', null, function (data) {
            if (data) {
                var _data = data.map(function (item) {
                    return { id: item.id, text: item.name };
                });
                $scope.setting.valuelist.location = _data;
            }
        });
    };
}]);