'use strict';
app.register.controller('roomItemController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        // get RoomLogistics
        $scope.getRoomLogistics();
        // get RoomResources
        $scope.getRoomResources();
        // get approves
        $scope.getRoomApproves();
        // get RoomLogistics
        $scope.getRoomLocaition();

        if ($scope.grid) {
            // load data
            $scope.loadData();
            // change status
            $scope.grid.onClick.subscribe(function (e, args) {
                var data = args.grid.dataView.getItem(args.row);
                if ($(e.target).hasClass("checkIsVideoCanference")) {
                    data.isVideoCanference = !data.isVideoCanference;
                    $scope.action = 'edit';
                    $scope.data = $.extend(true, {}, data);
                    $scope.save();
                }
                else if ($(e.target).hasClass("checkIsActive")) {
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

        // refresh
        $scope.refresh = function () {
            $('#inputSearch').val('');
            // load data
            $scope.loadData();
        };
    });

    // load data
    $scope.loadData = function () {
        var searchValue = $('#inputSearch').val();
        if (!searchValue)
            searchValue = null;
        var params = {
            searchValue: searchValue
        };
        $scope.postData('api/pt/roomItem/Get', params, function (data) {
            if (data) {
                $scope.grid.setData(data);
                $scope.grid.invalidate();
            }
        });
    };

    // add
    $scope.add = function () {
        $('#select-approves').selectpicker('val', '');
        $scope.action = 'add';
        $scope.data = {
            isActive: true,
            isShow: true
        };
        $scope.postData('api/pt/roomItem/GetDefaultRole', null, function (data) {
            $scope.data.approves = [];
            $scope.data.approves.push(data);
            $('#select-approves').selectpicker('val', $scope.data.approves);
        });
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
            $('#select-approves').selectpicker('val', data.approves);
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
        $scope.postData("api/pt/roomItem/Delete", params, function (data) {
            if (data) {
                $scope.grid.dataView.deleteItem($scope.data.id);
                $scope.grid.invalidate();
                showSuccess($scope.translation.SUCCESS_DELETE);
            }
        });
    };

    // save
    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        var params = {
            data: $scope.data
        };
        // add
        if ($scope.action === 'add') {
            $scope.postData("api/pt/roomItem/Add", params, function (data) {
                if (data) {
                    $scope.grid.dataView.insertItem(0, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
        // edit
        else {
            $scope.postData("api/pt/roomItem/Update", params, function (data) {
                if (data) {
                    $scope.grid.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
    };

    // get RoomLogistics
    $scope.getRoomLogistics = function () {
        $scope.postData('api/pt/roomLogistics/GetRoomLogistics', null, function (data) {
            if (data) $scope.setting.valuelist.logistics = data;
        });
    };

    // get RoomResources
    $scope.getRoomResources = function () {
        $scope.postData('api/pt/roomResources/GetRoomResources', null, function (data) {
            if (data) $scope.setting.valuelist.resources = data;
        });
    };

    // get approves
    $scope.getRoomApproves = function () {
        var params = {
            objectId: 'PORTAL'
        };
        $scope.postData('api/pt/roomItem/GetRoomApproves', params, function (data) {
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

    // get RoomLogistics
    $scope.getRoomLocaition = function () {
        $scope.postData('api/sys/Company/get', null, function (data) {
            //var arr = ['0', '1', '2'];
            //var _data = data.filter(function (val) {
            //    return arr.includes(val.type);
            //});
           
            if (data) {
                $.each(data, function (index, value) {
                    value.text = value.name;
                });
                $scope.setting.valuelist.location = data;
            }
        });
    };

    // configLocation
    $scope.configLocation = {
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
        },
        templateSelection: function (data) {
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
                return $('<span style="margin-left: 10px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        }
    };
}]);