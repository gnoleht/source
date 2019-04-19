'use strict';
app.register.controller('moduleController', ['$scope', function ($scope) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        if ($scope.grid != null) {
            $scope.grid.customFilter = function (data) {
                if (data.parent == null)
                    return true;

                var parent = $scope.grid.dataView.getItemById(data.parent);
                if (parent == null) {
                    data.isCollapsed = true;
                    return false;
                }

                if (parent.isCollapsed)
                    data.isCollapsed = true;

                return !parent.isCollapsed;
            };

            $scope.post($scope.setting.grid.url, null, function (data) {
                $.each(data, function (index, item) { item.isCollapsed = item.hasChild; });
                $scope.grid.setData(data);
            });

            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("toggle")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        if (!item.isCollapsed) {
                            item.isCollapsed = true;
                        } else
                            item.isCollapsed = false;

                        $scope.grid.dataView.updateItem(item.id, item);
                    }
                }
                else if ($(e.target).hasClass("addChild")) {
                    var item1 = $scope.grid.dataView.getItem(args.row);
                    if (item1) {
                        item1.index = args.row;
                        $scope.add(item1);
                    }
                }
            });

            $scope.grid.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command == 'collapseAll') {
                    if (!args.grid.isShowAll) {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list-tree";
                        args.grid.updateColumnHeader(args.column.id);
                    }

                    $scope.collapseAll(args.grid);

                }
            });
        }
    });

    //function
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.url = "";
        $scope.data.active = true;

        if (!item) {
            var array = $scope.grid.dataView.getItems().filter(function (x) { return x.parent == null; });
            if (array.length > 0) {
                var order = Math.max.apply(Math, array.map(function (x) { return x.ordering; }));
                $scope.data.ordering = order + 1;
            }
        }
        else {
            $scope.action = 'addChild';
            var childNum = $scope.grid.dataView.getItems().filter(function (x) { return x.parent == item.id; }).length;
            $scope.data.ordering = childNum + 1;
            $scope.data.parent = item.id;
            $scope.data.index = item.index + childNum + 1;
            $scope.data.indent = item.indent + 1;
            $scope.$apply();
        }

        $scope.defaultData = jQuery.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $('#txtId').focus();
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (!data)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = jQuery.extend(true, {}, data);
            $scope.defaultData = $.extend(true, {}, $scope.data);

            callModal('modal-detail');
            $('#txtId').focus();
        }
    };

    $scope.copy = function () {
        if ($scope.grid != null) {
            var data = $scope.grid.getCurrentData();
            if (!data) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }

            $scope.action = 'add';
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            $scope.defaultData = $.extend(true, {}, $scope.data);

            callModal('modal-detail');
            $('#txtId').focus();
        }
    };

    $scope.save = function () {
        if ($scope.action == 'add') {
            $scope.post("api/module/add", JSON.stringify($scope.data), function (data) {
                $scope.parent = null;
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });
        }
        else if ($scope.action == 'addChild') {
            $scope.post('api/module/createChild', JSON.stringify($scope.data), function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                var parentId = data.parent;
                var parentIndex = $scope.grid.dataView.getIdxById(parentId);
                $scope.grid.dataView.insertItem(parentIndex + 1, data);
                $scope.grid.invalidate();
            });
        }
        else if ($scope.action == 'edit') {
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.post("api/module/update", JSON.stringify($scope.data), function (data) {
                $scope.parent = null;
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });
        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (!data)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };

    $scope.deleteData = function () {
        $scope.post("api/module/remove", JSON.stringify($scope.data), function (lstDelete) {
            $.each(lstDelete, function (index, id) { $scope.grid.dataView.deleteItem(id); });
            $scope.grid.invalidate();
        });
    };

    // change active
    $scope.changeActive = function (data) {
        if (data.active) {
            $("#chkActive").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
            data.active = false;
        }
        else {
            $("#chkActive").removeClass().addClass("bowtie-icon bowtie-checkbox");
            data.active = true;
        }
    };

    $scope.collapseAll = function (grid) {
        if (!grid.isShowAll) {
            var array = grid.dataView.getItems().filter(function (x) { return (x.indent == 0 || x.indent == 1) && x.isCollapsed; });
            grid.dataView.beginUpdate();
            $.each(array, function (index, item) {
                item.isCollapsed = false;
                grid.dataView.updateItem(item.id, item);
            });

            grid.dataView.endUpdate();
            grid.invalidate();
            grid.isShowAll = true;
        }
        else {
            var array1 = grid.dataView.getItems().filter(function (x) { return x.indent == 0 && x.isCollapsed != true; });
            grid.dataView.beginUpdate();
            $.each(array1, function (index, item) {
                item.isCollapsed = true;
                grid.dataView.updateItem(item.id, item);
            });

            grid.dataView.endUpdate();
            grid.invalidate();
            grid.isShowAll = false;
        }
    };
}]);