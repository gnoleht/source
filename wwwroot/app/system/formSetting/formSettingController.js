'use strict';
app.register.controller('formSettingController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        init('formSetting', $scope, true, false);
    });

    $scope.initFormSetting = function (setting, grid) {
        $scope.$applyAsync(function () {
            $scope.grid = grid;
            $scope.setting = setting;

            $scope.columns = angular.copy(setting.columns);
            if ($scope.columns == null) $scope.columns = [];

            $scope.hiddenColumns = angular.copy(setting.hiddenColumns);
            if ($scope.hiddenColumns == null) $scope.hiddenColumns = [];

            // sắp xếp theo name (tên)
            $scope.hiddenColumns.sort(function (a, b) {
                var nameA = a.name.toUpperCase(); // bỏ qua hoa thường
                var nameB = b.name.toUpperCase(); // bỏ qua hoa thường
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                // name trùng nhau
                return 0;
            });
        });
    }

    $scope.updateColumn = function (item, isShow) {
        if (item.hideable == false) return;

        if (isShow) {
            $scope.hiddenColumns.push(item);
            $scope.columns = $scope.columns.filter(x => x.id != item.id);
        }
        else {
            $scope.columns.push(item);
            $scope.hiddenColumns = $scope.hiddenColumns.filter(x => x.id != item.id);
        }

        $scope.column = null;
        $scope.isShow = false;

        // sắp xếp theo name (tên)
        $scope.hiddenColumns.sort(function (a, b) {
            var nameA = a.name.toUpperCase(); // bỏ qua hoa thường
            var nameB = b.name.toUpperCase(); // bỏ qua hoa thường
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            // name trùng nhau
            return 0;
        });
    };

    $scope.buttonUpdateColumn = function () {
        if ($scope.column) $scope.updateColumn($scope.column, $scope.isShow);
    };

    $scope.selectColumn = function (id, column, isShow, parent) {
        $scope.column = column;
        $scope.isShow = isShow;

        if ($scope.column && parent)
            $scope.column.parent = parent;

        $(".item-selected").removeClass('item-selected');
        var eId = "column_" + id;
        $("p[id = '" + eId + "'").addClass("item-selected");

        if (isShow) $("#txtWidth").attr("disabled", null);
        else $("#txtWidth").attr("disabled", true);
    }

    $scope.save = function () {
        $scope.grid.setColumns($scope.columns);
        $scope.setting.columns = $scope.columns;
        $scope.setting.hiddenColumns = $scope.hiddenColumns;

        $scope.grid.saveSetting();
        $("#formSetting").modal('hide');
    }

    $scope.defaultGridColumnSetting = function () {
        $scope.grid.defaultSetting();
    };

    $scope.upColumn = function () {
        if (!$scope.column || !$scope.isShow) return;

        var colIndex = -1;
        if ($scope.column.parent) {
            $.each($scope.columns, function (index, column) {
                if (column.id == $scope.column.parent) {
                    var childCol = null;
                    $.each(column.children, function (childIndex, childColumn) {
                        if (childColumn.id == $scope.column.id) {
                            colIndex = childIndex;
                            childCol = childColumn;
                            return false;
                        }
                    });

                    if (colIndex > 0) {
                        column.children.splice(colIndex, 1);
                        column.children.splice(colIndex - 1, 0, childCol);
                    }

                    return false;
                }
            });
        }
        else {
            $.each($scope.columns, function (index, column) {
                if (column.id == $scope.column.id) {
                    colIndex = index;
                    return false;
                }
            });

            if (colIndex > 0) {
                $scope.columns.splice(colIndex, 1);
                $scope.columns.splice(colIndex - 1, 0, $scope.column);
            }
        }
    };

    $scope.downColumn = function () {
        if (!$scope.column || !$scope.isShow) return;

        if ($scope.column.parent) {
            $.each($scope.columns, function (index, column) {
                if (column.id == $scope.column.parent) {
                    var childCol = null;
                    $.each(column.children, function (childIndex, childColumn) {
                        if (childColumn.id == $scope.column.id) {
                            colIndex = childIndex;
                            childCol = childColumn;
                            return false;
                        }
                    });

                    if (colIndex < column.children.length - 1) {
                        column.children.splice(colIndex, 1);
                        column.children.splice(colIndex +1, 0, childCol);
                    }

                    return false;
                }
            });
        }
        else {
            var colIndex = -1;
            $.each($scope.columns, function (index, column) {
                if (column.id == $scope.column.id) {
                    colIndex = index;
                    return false;
                }
            });

            if (colIndex < $scope.columns.length - 1) {
                $scope.columns.splice(colIndex, 1);
                $scope.columns.splice(colIndex + 1, 0, $scope.column);
            }
        }
    };
}]);


