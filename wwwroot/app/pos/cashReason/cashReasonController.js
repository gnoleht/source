'use strict';
app.register.controller('cashReasonController', ['$scope', function ($scope) {
    $scope.searchValue = "";

    $scope.displayFunction = function () {
        $scope.button.filter = true;
        $scope.button.search = false;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $('#full_text_filter').focus();

    }
    //init
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
                $scope.setting.valuelist.type = $scope.setting.valuelist.typeCashReason;
            },
        });

        if ($scope.grid) {
            //$scope.loadStore();
            $scope.loadData();
        }


        $scope.refresh = function () {
            $scope.loadData();
        };

        $scope.search = function (e, type, click) {
            if (click != 1)
                if (e != null && e.keyCode != 13) return;

            if (type == 1)
                $scope.searchValue = $("#full_text_filter").val();
            else
                $scope.searchValue = $("#inputSearch").val();
            $scope.loadData();
        };

        $scope.loadStore();
        $(window).resize(function () {
            var width = $("#cashReason .white_box").width();
            var height = $("#cashReason .white_box").height();
            var box_control = $("#cashReason .box_filter").height();

            if ($("#cashReason .box_filter").is(":visible")) {
                $('#cashReason dd').height(height - 50 - box_control);
            }
            else {
                $('#cashReason dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });

    //function
    $scope.loadData = function () {
        $scope.postData("api/pos/cashReason/get", { searchValue: $scope.searchValue }, function (data) {
            $scope.grid.setData(data);
            $scope.calcListData();
        });
    }
    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    }
    $scope.add = function (type) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.active = true;
        $scope.data.type = "CR";
        if (type != undefined && type != '')
            $scope.data.type = type;

        $scope.changeType($scope.data.type);
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $("#code").prop('disabled', false);
        $('#code').focus();
    }

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = jQuery.extend(true, {}, data);
            callModal('modal-detail');
            $('#name').focus();
            $("#code").prop('disabled', true);
            $scope.changeType($scope.data.type);
        };
    };

    $scope.copy = function () {
        if ($scope.grid != null) {
            var data = $scope.grid.getCurrentData();
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }

            $scope.action = 'add';
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            $scope.data.code = null;
            $scope.changeType($scope.data.type);
            callModal('modal-detail');
            $("#code").prop('disabled', false);
            $('#code').focus();
        }
    };

    $scope.save = function (flag) {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        if ($scope.action == 'add') {
            $scope.postData("api/pos/cashReason/Add", { data: $scope.data }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();

                if (flag == 1)
                    $scope.add(data.type);
                else
                    $('#modal-detail').modal('hide');
            });

        }
        else {
            $scope.postData("api/pos/cashReason/Update", { data: $scope.data }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });

        }
        $scope.calcListData();
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.post("api/pos/cashReason/remove", JSON.stringify($scope.data), function (lstDelete) {
            if (lstDelete) {
                $scope.grid.dataView.deleteItem($scope.data.id);
                $scope.grid.invalidate();
                $scope.calcListData();
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    $scope.changeActive = function (data) {
        $scope.data.active = !data;
    };
    $scope.calcListData = function () {
        var tempDataView = $scope.grid.getData().getItems();
        if (tempDataView) {
            $scope.total = tempDataView.length;
            $scope.active = tempDataView.filter(x => x.active == true).length;
            $scope.deactive = tempDataView.filter(x => x.active == false).length;
        } else {
            $scope.total = 0;
            $scope.active = 0;
            $scope.deactive = 0;
        }
    };

    $scope.changeType = function (value) {
        $('#radioType input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioType input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.type = value;
    };
}]);