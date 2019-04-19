'use strict';
app.register.controller('importItemController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        init('importItem', $scope, true, false);
    });

    $scope.initImportItem = function (grid) {
        $scope.data = {};
        $scope.currentGrid = grid;
        $scope.data.tableName = grid.tableName;
    }

    $scope.save = function () {
        if ($scope.currentGrid) {
            $scope.frmFile.set("module", $scope.currentGrid.module);
            $scope.frmFile.set("tableName", $scope.currentGrid.tableName);
            $scope.frmFile.set("defaultValues", JSON.stringify($scope.currentGrid.defaultValues));

            $scope.postFile('api/system/importRawData', $scope.frmFile, function () {
                $scope.currentGrid.refreshData();
            });
        }

        $("#importSetting").modal('hide');
    }

    $scope.initJS = function () {
        $("#importItem #imgDropzone").dropzone({
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

                $("#importItem #imgAvatar").attr("src", imageUrl);
            }
        });
    };
}]);



