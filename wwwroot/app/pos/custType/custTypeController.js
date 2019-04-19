'use strict';
app.register.controller('custTypeController', ['$scope', function ($scope) {
    $scope.searchValue = "";
    $scope.listData = [];

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

        $(window).resize(function () {
            var width = $("#custType .white_box").width();
            var height = $("#custType .white_box").height();
            var box_control = $("#custType .box_filter").height();

            if ($("#custType .box_filter").is(":visible")) {
                $('#custType dd').height(height - 50 - box_control);
            }
            else {
                $('#custType dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });

    //function
    $scope.loadData = function () {
        $scope.postData("api/pos/custType/get", { searchValue: $scope.searchValue }, function (data) {
            $scope.listData = data;
            $scope.grid.setData(data);
            $scope.calcListData();
        });
    }
    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    }
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.active = true;
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

            callModal('modal-detail');
            $("#code").prop('disabled', false);
            $('#code').focus();
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        if ($scope.action == 'add') {
            $scope.postData("api/pos/custType/Add", { data: $scope.data }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });

        }
        else {
            $scope.postData("api/pos/custType/Update", { data: $scope.data }, function (data) {
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
        $scope.post("api/pos/custType/remove", JSON.stringify($scope.data), function (lstDelete) {
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

    $(".switch").click(function () {
        $(this).toggleClass("change");

        var value = ($(".switch input").val() == 'true');
        $(".switch input").val(!value);
        $scope.data.active = !value;
    });

    $scope.changeActive = function (e, args) {
        var item = $scope.grid.dataView.getItem(args.row);
        if (item) {
            item.active = item.active ? false : true;
            $scope.postData("api/pos/custType/update", { data: JSON.stringify(item) }, function (data) {
                $scope.grid.dataView.updateItem(item.id, item);
                $scope.grid.invalidate();
            });

        }

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
}]);