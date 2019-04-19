//check
'use strict';
app.register.controller('resourcePlanningController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
    //page load
    $scope.$on('$routeChangeSuccess', function () {
        $scope.userDetail = null;

        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        var url = $scope.setting.grid.url + '?pjid=' + $scope.params.pjid + '&area=' + $scope.params.area;
        $scope.setting.grid.url = url;

        $scope.postNoAsync('api/pm/member/getListAreaByObjectId?id=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.areas = data;
        });

        $timeout(function () {
            $("#startDate").change(function () {
                if ($scope.data.resource.startDate && $scope.data.resource.endDate) {
                    var thisStartDate = moment($scope.data.resource.startDate);
                    var thisEndDate = moment($scope.data.resource.endDate);

                    if (thisEndDate < thisStartDate) {
                        $scope.$applyAsync(function () {
                            $scope.data.resource.endDate = $scope.data.resource.startDate;
                        });
                    }
                }
            });

            $("#endDate").change(function () {
                if ($scope.data.resource.startDate && $scope.data.resource.endDate) {
                    var thisStartDate = moment($scope.data.resource.startDate);
                    var thisEndDate = moment($scope.data.resource.endDate);

                    if (thisEndDate < thisStartDate) {
                        $scope.$applyAsync(function () {
                            $scope.data.resource.endDate = $scope.data.resource.startDate;
                        });
                    }
                }
            });
        });

        $(window).resize(function () {
            var height = $("#resourcePlanning .white_box").height();
            $("#resourcePlanning #tab-content").height(height - 55);
        });
        $(window).resize();

        $scope.grid.loadData(url);
        setSelectedMenu("pblEstimating");
        $timeout(function () {
            $scope.grid.resizeCanvas();
        });
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

    $scope.add = function () {
        //if ($scope.tab == "resourcePlanning") {
        $scope.action = "add";
        $scope.data = [];
        $scope.data.resource = {};
        $scope.data.resource.projectId = $scope.params.pjid;
        $scope.data.resource.role = resourcePlanningSetting.valuelist.role[0].id;
        $scope.data.resource.costGroup = resourcePlanningSetting.valuelist.costGroup[0].id;
        $scope.data.resource.costPerMonth = resourcePlanningSetting.valuelist.costGroup[0].cost;

        $scope.data.resource.areas = [];
        $scope.data.resource.areas.push($scope.params.area);

        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail-resource');
        $("#name").focus();
        //}
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(resourcePlanningTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = "edit";
            $scope.data = [];
            $scope.data.resource = {};
            $scope.data.resource = $.extend(true, {}, data);
            callModal('modal-detail-resource');
            $("#name").focus();
        }
    };
    $scope.save = function () {
        if (!validateData($scope.data.resource, $scope.setting, $scope.translation)) return;

        if ($scope.action == 'add') {
            $scope.frmFile.set("data", JSON.stringify($scope.data.resource));
            $scope.postFile("api/pm/planDetail/AddResourcePlanning?pjid=" + $scope.params.pjid, $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-resource').modal('hide');

                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });

        }
        else {
            $scope.frmFile.set("data", JSON.stringify($scope.data.resource));
            $scope.postFile("api/pm/planDetail/UpdateResourcePlanning", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-resource').modal('hide');

                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });

        }
        //var resetGrid = $scope.$parent.childScope["costPlanning"];
        //resetGrid.loadDataGrid();
    };
    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError(resourcePlanningTranslation["ERR_DELETE_NULL"]);
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };
    $scope.deleteData = function () {
        $scope.post("api/pm/planDetail/RemoveResourcePlanning", JSON.stringify($scope.data), function () {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
        });
    };
    $scope.ChangeCostGroup = function () {

        var select = $("#costGroup").select2('data');
        var temp = resourcePlanningSetting.valuelist.costGroup.find((element) => element.id == select[0].id);
        $scope.data.resource.costPerMonth = temp.cost;

        // $scope.$apply();

    }

}]);



