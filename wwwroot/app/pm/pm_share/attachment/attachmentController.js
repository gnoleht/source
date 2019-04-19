
'use strict';
app.register.controller('attachmentController', ['$scope', '$location', '$sce', 'authService', '$route', '$window', function ($scope, $location, $sce, authService, $route, $window) {

    $scope.onLoad = function () {
        init('attachment', $scope, true);

        $('.advancedDropzoneAttachment').on({
            'click': function (e) {
                e.preventDefault();
                e.stopPropagation();

                var input = $(document.createElement('input'));
                input.attr("type", "file");

                input.on("change", function (e) {
                    var file = this.files[0];
                    var fileType = file["type"];

                    var exits = false;
                    $.each($scope.attachments, function (index, item) {
                        if (item.documentInfo.fileName == file.name) {
                            showError($scope.translation.ERR_EXIST_FILE);
                            exits = true;
                        }
                    });
                    if (!exits) {
                        $scope.listFileUpload.push(file);
                        var itemFile = {};
                        itemFile.documentInfo = {};
                        //itemFile.documentInfo = angular.copy(file);
                        itemFile.documentInfo.fileName = file.name;
                        itemFile.documentInfo.name = file.name.substr(0, file.name.lastIndexOf('.')); //.split('.').slice(0, -1).join(".");
                        itemFile.userInfo = authService.user;
                        itemFile.documentInfo.fileExtension = "." + file.name.split('.').pop();
                        itemFile.documentInfo.version = '0.01';
                        itemFile.documentInfo.type = file.type;
                        if (file.type.includes('image')) {
                            itemFile.url = window.URL.createObjectURL(file);
                        }
                        $scope.attachments.unshift(itemFile);
                        $scope.folders.push($scope.folderId);
                        $('#modalAddFile').modal('hide');
                        $scope.$applyAsync();
                        $scope.$parent.data.changed = true;
                    }
                });

                input.trigger('click');
            }
        });

        //$('.advancedDropzoneAttachment').dropzone({
        //    url: 'data/upload',
        //    maxFiles: 1,
        //    addedfile: function (file) {
        //        var exits = false;
        //        $.each($scope.attachments, function (index, item) {
        //            if (item.documentInfo.fileName == file.name) {
        //                showError($scope.translation.ERR_EXIST_FILE);
        //                exits = true;
        //            }
        //        });
        //        if (!exits) {
        //            $scope.listFileUpload.push(file);
        //            var itemFile = {};
        //            itemFile.documentInfo = {};
        //            //itemFile.documentInfo = angular.copy(file);
        //            itemFile.documentInfo.fileName = file.name;
        //            itemFile.documentInfo.name = file.name.substr(0, file.name.lastIndexOf('.')); //.split('.').slice(0, -1).join(".");
        //            itemFile.userInfo = authService.user;
        //            itemFile.documentInfo.fileExtension = "." + file.name.split('.').pop();
        //            itemFile.documentInfo.version = '0.01';
        //            itemFile.documentInfo.type = file.type;
        //            if (file.type.includes('image')) {
        //                itemFile.url = window.URL.createObjectURL(file);
        //            }
        //            $scope.attachments.unshift(itemFile);
        //            $scope.folders.push($scope.folderId);
        //            $('#modalAddFile').modal('hide');
        //            $scope.$applyAsync();
        //        }
        //    },
        //});

        if ($scope.grid != null) {
            $scope.grid.editAction = function () { };
            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("checkItem")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    item.isCheck = !item.isCheck;
                    $scope.grid.dataView.updateItem(item.id, item);
                }
            });
        }
    };

    $scope.saveAttachment = function () {
        var lstData = $scope.grid.dataView.getItems();
        var selectedData = lstData.filter(x => x.isCheck);
        $.each(selectedData, function (index, item) {
            var hasValue = $scope.attachments.findIndex(x => x.documentId == item.id);
            if (hasValue == -1) {
                var itemFile = {};
                itemFile.documentInfo = item;
                itemFile.userInfo = authService.user;
                $scope.attachments.unshift(itemFile);
                $scope.listFileRelated.push(item.id);
            }
        });
        $scope.$parent.data.changed = true;
        $scope.hideAttachment();
    };



    $scope.loadFolder = function () {
        var url = 'api/pm/document/getFolderAttachment';
        var params = {
            groupName: "document",
            pid: $scope.params.pid,
            pjid: $scope.params.pjid,
            isProduct: ($scope.isProduct && $scope.$parent.action == "add")
        };

        $scope.postData(url, params, function (data) {
            if (data != null) {
                $scope.$applyAsync(function () {
                    $scope.listFolder = data.nodes;
                    setTimeout(function () { $("#tree li:first p:first").click() }, 150);
                });
            }
        });
    };

    $scope.folderChanged = function (oldItem, newItem) {
        if (newItem == null || newItem.tag.parent == null)
            $scope.folderId = null;
        else
            $scope.folderId = newItem.value;

        $scope.loadData();
    };

    $scope.loadData = function () {
        var url = $scope.setting.grid.url;

        if ($scope.folderId)
            url += "?folder=" + $scope.folderId;

        $scope.grid.loadData(url);
    };


    $scope.hideAttachment = function () {
        $('#modalAddFile').modal('hide');
    }
}]);
