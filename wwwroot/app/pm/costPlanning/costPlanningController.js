//check
'use strict';
app.register.controller('costPlanningController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
    //page load
    $scope.$on('$routeChangeSuccess', function () {
        $scope.userDetail = null;
        $scope.data.abc = true;
        $(window).resize(function () {
            var height = $("#costPlanning .white_box").height();
            $("#costPlanning #tab-content").height(height - 55);
        });
        $(window).resize();

        $scope.loadDataGrid();

        $scope.postNoAsync('api/pm/member/getListAreaByObjectId?id=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.areas = data;
        });

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.postNoAsync("api/pm/PlanDetail/GetCostPlanning" + '?pjid=' + $scope.params.pjid + '&area=' + $scope.params.area + '&searchValue=' + $('#inputSearch').val(), null, function (data) {
                $scope.setting.sum = data.total;
                $scope.grid.setData(data.data);
            });
        };
        $scope.refresh = function () {
            $scope.loadDataGrid();
        };

        setSelectedMenu("pblEstimating");

    });

    $scope.displayFunction = function () {
        $scope.button.copy = false;
    };

    $scope.displayTitle = function () {
        toogleProject(true);
        if ($scope.params.area) {
            toogleArea(true);
        }
    };

    $scope.loadDataGrid = function () {
        $scope.post("api/pm/PlanDetail/GetCostPlanning" + '?pjid=' + $scope.params.pjid + '&area=' + $scope.params.area, null, function (data) {
            $scope.setting.sum = data.total;
            $scope.grid.setData(data.data);
        });
    };

    $scope.add = function () {
        //if ($scope.tab == "costPlanning") {
        $scope.action = "add";
        $scope.data = [];
        $scope.data.cost = {};
        $scope.data.cost.category = "phancung";
        $scope.data.cost.unit = "cai";
        $scope.data.cost.qty = 0;
        $scope.data.cost.price = 0;
        $scope.data.cost.currency = "VNĐ";
        $scope.data.cost.areas = [];
        $scope.data.cost.areas.push($scope.params.area);

        $scope.data.cost.projectId = $scope.params.pjid;

        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail-cost');
        $('#description').focus();
        //}
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data.category != "nhansu") {
            if (data == null)
                showError(costPlanningTranslation["ERR_UPDATE_NULL"]);
            else {
                //if (data.category == "Nhân sự") return;
                if (data.category == "nhansu") {
                    $('#price').attr("readonly");
                };
                $scope.action = "edit";
                $scope.data = [];
                $scope.data.cost = {};
                $scope.data.cost = $.extend(true, {}, data);
                $scope.data.cost.total = $scope.data.cost.qty * parseFloat($scope.data.cost.price);
                callModal('modal-detail-cost');
                $('#description').focus();
            }
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data.cost, $scope.setting, $scope.translation)) return;

        if ($scope.action == 'add') {
            $scope.postData("api/pm/planDetail/AddCostPlanning?pjid=" + $scope.params.pjid, { data: JSON.stringify($scope.data.cost) }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-cost').modal('hide');

                $scope.postNoAsync("api/pm/PlanDetail/GetCostPlanning" + '?pjid=' + $scope.params.pjid, null, function (data) {
                    $scope.setting.sum = data.total;
                });

                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });

        }
        else {
            $scope.frmFile.set("data", JSON.stringify($scope.data.cost));
            $scope.postData("api/pm/planDetail/UpdateCostPlanning", { data: JSON.stringify($scope.data.cost) }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-cost').modal('hide');

                $scope.postNoAsync("api/pm/PlanDetail/GetCostPlanning" + '?pjid=' + $scope.params.pjid, null, function (data) {
                    $scope.setting.sum = data.total;
                });

                $scope.grid.dataView.updateItem(data.id, data);

                $scope.grid.invalidate();
            });

        }

    };
    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError(costPlanningTranslation["ERR_DELETE_NULL"]);
        else if (data.category == "nhansu") {
            showError(costPlanningTranslation["ERR_CANT_DELETE"]);
        }
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };
    $scope.deleteData = function () {
        $scope.post("api/pm/planDetail/RemoveCostPlanning", JSON.stringify($scope.data), function () {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
        });
    };

    $scope.CalcSubTotals = function () {
        //console.log("qty: " + $scope.data.cost.qty);
        //console.log("price: " + $scope.data.cost.price);
        //console.log("total 1: " + $scope.data.cost.total);
        //console.log("qty num: " + Number($scope.data.cost.qty));
        //console.log("price num: " + Number($scope.data.cost.price));
        //$scope.data.cost.total = Number($scope.data.cost.qty) * Number($scope.data.cost.price);
        //console.log("total 2: " + $scope.data.cost.total);

        $scope.$applyAsync(function () { $scope.total = $scope.data.cost.qty * $scope.data.cost.price });
    };

    $scope.ChangeCategory = function () {
        if ($scope.data.cost.category == 'nhansu')
            $scope.data.cost.unit = 'nguoi';
        else if ($scope.data.cost.category == 'phancung')
            $scope.data.cost.unit = 'cai';
        else if ($scope.data.cost.category == 'phanmem')
            $scope.data.cost.unit = 'thang';
        else if ($scope.data.cost.category == 'tiepkhach')
            $scope.data.cost.unit = 'cai';
        else if ($scope.data.cost.category == 'daotao')
            $scope.data.cost.unit = 'thang';
        else if ($scope.data.cost.category == 'thietbi')
            $scope.data.cost.unit = 'cai';
    };
}]);



