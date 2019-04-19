'use strict';
app.register.controller('newsController', ['$scope', function ($scope) {
    $scope.tinymceOptions.autoresize_max_height = 100;
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
                newsSetting.valuelist = $scope.setting.valuelist;
                newsSetting.listFilter = $scope.setting.listFilter;
            }
        });
        $scope.reloadGrid();
        $scope.refresh = function () {
            $scope.reloadGrid();
        };
        
        $('.advancedDropzonePicture').dropzone({
            url: 'api/pt/news/pictureupload',
            acceptedFiles: 'image/*',
            addedfile: function (file) {
                $scope.data.file = file;
                $scope.$applyAsync(function () {
                    $scope.data.pictureName = file.name;
                    $scope.data.pictureSrc = window.URL.createObjectURL(file);
                });
            },
        });
    });

    $scope.displayFunction = function () {
        $scope.button.copy = false;
    };

    $scope.reloadGrid = function () {
        $scope.postData("api/pt/news/get", null, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
        });
    };

    $scope.cmbCategory = {
        url: "api/pt/newsCategory/getListCategory",
    };

    $scope.configStatus = {
        templateResult: function (data) {
            return data.id && data.text ? $('<span><i class="' + newsSetting.listFilter.newsStatus[data.id].icon + '"></i>&nbsp;' + data.text + '</span>') : null;
        },
        templateSelection: function (data) {
            return data.id && data.text ? $('<span><i class="' + newsSetting.listFilter.newsStatus[data.id].icon + '"></i>&nbsp;' + data.text + '</span>') : null;
        }
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.status = '1';
        $scope.data.type = '1';
        $scope.data.publicationTime = moment().format();
        callModal('modal-detail', true, "txtTitle");
    };

    $scope.edit = function () {
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data) {
            $scope.action = 'edit';
            callModal('modal-detail', true, "txtTitle");
        }
        else {
            showWarning($scope.translation.WRN_SELECT_EDIT);
        }
    };

    $scope.save = function () {
        if (!$scope.checkData()) return;
        var formData = new FormData();
        if ($scope.data.file && $scope.data.file) {
            formData.append("file", $scope.data.file);
        }
        formData.append("data", JSON.stringify($scope.data));
        if ($scope.action == 'add') {
            $scope.postFile("api/pt/news/add", formData, function (data) {
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
                showSuccess($scope.translation.SAVE_SUCCESS);
            })
        }
        else if ($scope.action == 'edit') {
            $scope.postFile("api/pt/news/update", formData, function (data) {
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
                showSuccess($scope.translation.SAVE_SUCCESS);
            })
        }
    };

    $scope.checkData = function () {
        var message = '';
        if (!$scope.data.title) message += $scope.translation.WRN_NOT_NULL_TITLE + '</br>';
        if (!$scope.data.category) message += $scope.translation.WRN_NOT_NULL_CATEGORY + '</br>';
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
        $scope.postData("api/pt/news/delete", { id: $scope.data.id }, function (data) {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
            showSuccess($scope.translation.DELETE_SUCCESS);
        })
    };

}]);



