'use strict';
app.register.controller('newsCategoryController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                   
                });
            }
        });
        $scope.reloadGrid();
        $scope.refresh = function () {
            $scope.reloadGrid();
        };
    });

    $scope.displayFunction = function () {
        $scope.button.copy = false;
    };

    $scope.reloadGrid = function () {
        $scope.postData("api/pt/newsCategory/get", null, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
        });
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        callModal('modal-detail');
    };

    $scope.edit = function () {
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data) {
            $scope.action = 'edit';
            callModal('modal-detail');
        }
        else {
            showWarning($scope.translation.WRN_SELECT_EDIT);
        }
    };

    $scope.save = function () {
        if (!$scope.checkData()) return;
        if ($scope.action == 'add') {
            $scope.postData("api/pt/newsCategory/add", { data: $scope.data }, function (data) {
                $('#modal-detail').modal('hide');
                $scope.reloadGrid();
                showSuccess($scope.translation.SAVE_SUCCESS);
            })
        }
        else if ($scope.action == 'edit') {
            $scope.postData("api/pt/newsCategory/update", { data: $scope.data }, function (data) {
                $('#modal-detail').modal('hide');
                $scope.reloadGrid();
                showSuccess($scope.translation.SAVE_SUCCESS);
            })
        }
    };

    $scope.checkData = function () {
        var message = '';
        if (!$scope.data.name) message += $scope.translation.WRN_NOT_NULL_NAME;
        if (message.length > 0) {
            showWarning(message);
            return false;
        };
        return true;
    };

    $scope.delete = function () {
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data == null) {
            showWarning($scope.translation["ERR_SELECT_DATA_DELETE"]);
        }
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postData("api/pt/newsCategory/delete", { id: $scope.data.id }, function (data) {
            $scope.reloadGrid();
            showSuccess($scope.translation.DELETE_SUCCESS);
        })
    };

}]);



