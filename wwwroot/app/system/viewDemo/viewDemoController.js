'use strict';
app.register.controller('viewDemoController', ['$scope', '$location', '$sce', 'authService', 'httpService', function ($scope, $location, $sce, authService, httpService) {
    //init
    init('viewDemo', $scope, httpService);

    //page load
    $scope.$on('$routeChangeSuccess', function () {
        viewDemoSetting.options.scope = $scope;
    });

    $scope.initComplete = function () {
        $scope.gridAction = function (e, args) {
            if ($(e.target).hasClass("toggle")) {
                var item = $scope.dataView.getItem(args.row);
                if (item) {
                    if (!item.isCollapsed) {
                        item.isCollapsed = true;
                    } else
                        item.isCollapsed = false;

                    $scope.dataView.updateItem(item.id, item);
                }

            }
            else if ($(e.target).hasClass("addChild")) {
                var item = $scope.dataView.getItem(args.row);
                if (item) {
                    item.index = args.row;
                    $scope.add(item);
                }
            }
        };

        $scope.grid.onClick.subscribe(function (e, args) {
            $scope.gridAction(e, args);
        });

        $scope.collapseAll();
    };

    //default
    $scope.collapseAll = function () {
        if ($scope.collapseType == 1) {
            var array = $scope.dataView.getItems().filter(function (x) { return (x.root) });
            $scope.dataView.beginUpdate();
            $.each(array, function (index, item) {
                item.isCollapsed = false;
                $scope.dataView.updateItem(item.id, item);
            });

            $scope.dataView.endUpdate();
            $scope.grid.invalidate();
            $scope.collapseType = 0;

            $("#iconView").removeClass("bowtie-toggle-expand-all").addClass("bowtie-toggle-collapse-all");
            $("#iconView").attr('title', viewDemoTranslation.COLLAPSE);
        }
        else {
            var array = $scope.dataView.getItems().filter(function (x) { return x.indent == 0 && x.isCollapsed != true });
            $scope.dataView.beginUpdate();
            $.each(array, function (index, item) {
                item.isCollapsed = true;
                $scope.dataView.updateItem(item.id, item);
            });

            $scope.dataView.endUpdate();
            $scope.grid.invalidate();
            $scope.collapseType = 1;
            $("#iconView").removeClass("bowtie-toggle-collapse-all").addClass("bowtie-toggle-expand-all");
            $("#iconView").attr('title', viewDemoTranslation.EXPAND);

        }
    };

    //function
    $scope.add = function () {
        $scope.action = "add";
        $scope.data = {};
        $("#imgAvatar").attr("src", "img/no_avatar.png");

        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $("#txtName").focus();
    };

    $scope.edit = function () {
        var data = $scope.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = "edit";
            $scope.data = $.extend(true, {}, data);
            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.avatar + "&def=/img/no_avatar.png");
            $scope.defaultData = $.extend(true, {}, $scope.data);

            callModal('modal-detail');
            $("#txtName").focus();
        }
    };

    $scope.save = function () {
        if ($scope.action == 'add') {
            if ($scope.checkValidate())
                return;
            else {
                $scope.frmFile.append("data", JSON.stringify($scope.data));

                httpService.postFile("api/viewDemo/Add", $scope.frmFile, function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail').modal('hide');

                    $scope.dataView.insertItem(0, data);
                    $scope.grid.invalidate();
                });
            }
        }
        else {
            //console.log("update nha");
            if ($scope.checkValidate())
                return;
            else {
                $scope.frmFile.append("data", JSON.stringify($scope.data));

                httpService.postFile("api/viewDemo/Update", $scope.frmFile, function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail').modal('hide');

                    $scope.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                });
            }
        }
    };

    $scope.delete = function () {
        var data = $scope.getCurrentData();

        if (data == null)
            showError(groupTranslation["ERR_DELETE_NULL"]);
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };

    $scope.deleteData = function () {
        httpService.post("api/viewDemo/remove", JSON.stringify($scope.data), function () {
            $scope.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
        });
    };

    //more functions
    $scope.checkValidate = function () {
        var data = $scope.data;
        var varName = data.name;
        if (!varName) {
            $("#txtName").attr("placeholder", viewDemoTranslation.ERROR_NAME + viewDemoTranslation.NAME);
            $("#txtName").focus();
            showError(viewDemoTranslation.ERROR_NAME + viewDemoTranslation.NAME);
            return true;
        }
        else {
            $(".inputName").removeAttr("placeholder");
            return false;
        }
    }

    
}]);



