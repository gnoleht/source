'use strict';
app.register.controller('exportDataController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.refresh = function () {
            var searchValue = $("#inputSearch").val();
            var params = { searchValue: searchValue };

            $scope.postDataAsync($scope.setting.grid.url, params, function (data) {
                $scope.grid.dataView.beginUpdate();
                $scope.grid.dataView.setItems(data);
                $scope.grid.dataView.endUpdate();
            });
        };

        if ($scope.grid) $scope.refresh();

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.refresh();
        };
    });

    //function
    $scope.add = function () {
        $scope.action = "add";
        $scope.data = {};
        $scope.data.format = "xlsx";
        $("#imgAvatar").attr("src", "img/no_avatar.png");
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $("#txtName").focus();
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) {
            showError(exportDataTranslation["ERR_UPDATE_NULL"]);
            return;
        }
        debugger;
        $scope.action = "edit";
        $scope.data = $.extend(true, {}, data);
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $("#txtName").focus();
    };

    $scope.initJS = function () {
        var uploadDrz = $("#imgDropzone").dropzone({
            addedfile: function (file) {
                $scope.frmFile.set("file", file);
                var fileExtension = "." + file.name.split('.').pop().toLowerCase();
                $scope.$applyAsync(function () { $scope.data.fileName = file.name.replace(fileExtension, "") });


                var imageUrl = '/images/file.ico';
                if (fileExtension == ".doc" || fileExtension == ".docx" || fileExtension == ".dotx")
                    imageUrl = '/images/ic_word.png';
                else if (fileExtension == ".xls" || fileExtension == ".xlsx" || fileExtension == ".xltx" || fileExtension == ".csv")
                    imageUrl = '/images/ic_excel.png';
                else if (fileExtension == ".ppt" || fileExtension == ".pptx")
                    imageUrl = '/images/ic_ppt.png';
                else if (fileExtension == ".7z" || fileExtension == ".zip" || fileExtension == ".rar")
                    imageUrl = '/images/ic_rar.png';
                else if (fileExtension == ".png" || fileExtension == ".jpg" || fileExtension == ".jpeg"
                    || fileExtension == ".gip" || fileExtension == ".bmp" || fileExtension == ".tif" || fileExtension == ".ico")
                    imageUrl = '/images/ic_img.png';
                else if (fileExtension == ".txt" || fileExtension == ".json" || fileExtension == ".js"
                    || fileExtension == ".html" || fileExtension == ".cs" || fileExtension == ".css")
                    imageUrl = '/images/ic_txt.png';
                else {
                    var fileImageName = fileExtension.replace('.', 'ic_');
                    imageUrl = '/images/' + fileImageName + ".png";
                }

                $("#imgAvatar").attr("src", imageUrl);
            }
        });
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
            $scope.loadexportData($scope.data);
            callModal('modal-detail');
            $("#txtName").focus();
        }
    };

    $scope.save = function () {
        $scope.frmFile.append("data", JSON.stringify($scope.data));

        if ($scope.action == 'add') {
            $scope.postFile("api/sys/exportData/add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
            });
        }
        else {
            $scope.postFile("api/sys/exportData/update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
            });
        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null) {
            showError($scope.translation["ERR_DELETE_NULL"]);
            return;
        }

        $scope.data = data;
        callModal('modal-confirm');
    };

    $scope.deleteData = function () {
        $scope.post("api/sys/exportData/remove", JSON.stringify($scope.data), function () {
            $scope.grid.dataView.deleteItem($scope.data.id);
        });
    };
}]);



