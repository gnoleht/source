'use strict';
app.register.controller('tableController', ['$scope', '$timeout', function ($scope, $timeout) {
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
            },
        });

        $timeout(function () {
            $("#checkIN").change(function () {
                if ($scope.data.checkIN && $scope.data.checkOUT) {
                    var checkIN = moment($scope.data.checkIN);
                    var checkOUT = moment($scope.data.checkOUT);

                    if (checkIN > checkOUT) {
                        $scope.$applyAsync(function () {
                            $scope.data.checkOUT = $scope.data.checkIN;
                        });
                    }
                }
            });

            $("#checkOUT").change(function () {
                if ($scope.data.checkIN && $scope.data.checkOUT) {
                    var checkIN = moment($scope.data.checkIN);
                    var checkOUT = moment($scope.data.checkOUT);

                    if (checkIN > checkOUT) {
                        $scope.$applyAsync(function () {
                            $scope.data.checkOUT = $scope.data.checkIN;
                        });
                    }
                }
            });

           
        });

        if ($scope.grid) {
            $scope.loadStore();
            $scope.loadZone();
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
            var width = $("#table .white_box").width();
            var height = $("#table .white_box").height();
            var box_control = $("#table .box_filter").height();

            if ($("#table .box_filter").is(":visible")) {
                $('#table dd').height(height - 50 - box_control);
            }
            else {
                $('#table dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });

    //function
    $scope.loadData = function () {
        $scope.postData("api/pos/table/get", { searchValue: $scope.searchValue }, function (data) {
            $scope.grid.setData(data);
            $scope.calcListData();
        });
    };
    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    };
    $scope.loadZone = function () {
        $scope.postData("api/pos/Zone/GetList", null, function (data) {
            $scope.setting.valuelist.zoneId = data;
        });
    };
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.active = true;
        $scope.data.status = '0';
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
            $("#code").prop('disabled', true);
            $('#name').focus();
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
            $scope.postData("api/pos/table/Add", { data: $scope.data }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });

        }
        else {
            $scope.postData("api/pos/table/Update", { data: $scope.data }, function (data) {
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
        $scope.post("api/pos/table/remove", JSON.stringify($scope.data), function (lstDelete) {
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
        $scope.data.active = !$scope.data.active;
    });

    $scope.changeActive = function (e, args) {
        var item = $scope.grid.dataView.getItem(args.row);
        if (item) {
            item.active = item.active ? false : true;
            $scope.postData("api/pos/table/update", { data: JSON.stringify(item) }, function (data) {
                $scope.grid.dataView.updateItem(item.id, item);
                $scope.grid.invalidate();
            });

        }

    };

    $scope.calcListData = function () {
        debugger
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