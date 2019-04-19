//check
'use strict';
app.register.controller('projectAreaController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
    //page load
    $scope.$on('$routeChangeSuccess', function () {
        $scope.userDetail = null;
        $scope.loadData();
        setSelectedMenu("member");
    });

    $scope.loadData = function () {
        var url = $scope.setting.grid.url + '?pjid=' + $scope.params.pjid + '&pid=' + $scope.params.pid + '&module=' + $scope.params.module;
        $scope.setting.grid.url = url;
        $scope.grid.loadData(url);
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
            $scope.defaultData = $.extend(true, {}, $scope.data);

            callModal('modal-member-area');
            $("#name").focus();
        }
    };
    $scope.displayTitle = function () {
        if ($scope.params.module == 'pj')
            toogleProject(true);
        else
            toogleProduct(true);
    };

    $scope.add = function () {
        $scope.action = "add";
        $scope.data = {};
        $scope.data.projectId = $scope.params.module == "pj" ? $scope.params.pjid : $scope.params.pid;
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-member-area');
        $("#name").focus();
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(projectAreaTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = "edit";
            $scope.data = {};
            $scope.data = {};
            $scope.data = $.extend(true, {}, data);
            callModal('modal-member-area');
            $("#name").focus();
        }
    };
    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        if ($scope.action == 'add') {
            var param = { data: $scope.data };
            $scope.postData("api/pm/projectArea/Add?pjid=" + $scope.params.pjid, param , function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-member-area').modal('hide');

                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });

        }
        else {
            $scope.postData("api/pm/projectArea/Update", $scope.data, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-member-area').modal('hide');

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
            showError(projectAreaTranslation["ERR_DELETE_NULL"]);
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };
    $scope.deleteData = function () {
        $scope.post("api/pm/projectArea/Remove", JSON.stringify($scope.data), function () {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
        });
    };
    $scope.ChangeCostGroup = function () {
        
        var select = $("#costGroup").select2('data');
        var temp = projectAreaSetting.valuelist.costGroup.find((element) => element.id == select[0].id);
        $scope.data.costPerMonth = temp.cost;

        // $scope.$apply();

    }

}]);



