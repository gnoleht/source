'use strict';
app.register.controller('myBonusController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;

        $("#btnSprintSetting").hide();
    };

    $scope.$on('$routeChangeSuccess', function () {
        $scope.setting.valuelist.projects = [];
        $scope.setting.valuelist.sprints = [];

        if ($scope.grid != null) {
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            // load data
            $scope.loadData();
        }

        $scope.grid.onClick.subscribe(function (e, args) {
            if ($(e.target).hasClass("toggle")) {
                var item = $scope.grid.dataView.getItem(args.row);
                if (item) {
                    if (!item.isCollapsed) {
                        item.isCollapsed = true;
                    } else {
                        item.isCollapsed = false;
                    }
                    $scope.grid.dataView.updateItem(item.id, item);
                }
                e.stopImmediatePropagation();
            }
            else {
                if ($(e.target).hasClass("addChild")) {
                }
            }
        });

        // resize
        $(window).resize(function (e) {
            var width = $("#myBonus .white_box").width();
            var height = $("#myBonus .white_box").height();

            var heightSelectContent = $("#selectContent").height();

            $('#grvKPI').height(height - heightSelectContent);
            $('#grvKPI').width(width);
            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });
        $(window).resize();


        // refresh
        $scope.refresh = function () {
            $scope.sprintId = null;
            $scope.projectId = null;
            $("#inputSearch").val('');
            $scope.setting.valuelist.sprints = [];
            // load data
            $scope.loadData();

        }

        // search
        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            // load data
            $scope.sprintId = null;
            $scope.projectId = null;
            $scope.loadData();
        };
    });

    $scope.onload = function () { }

    // load data
    $scope.loadData = function () {
        var searchValue = $("#inputSearch").val();
        $scope.postNoAsync(myBonusSetting.grid.url + '?projectId=' + $scope.projectId + '&sprintId=' + $scope.sprintId + '&searchValue=' + searchValue, null, function (response) {
            $.each(response.data, function (index, item) {
                if (item.hasChild) item.isCollapsed = false;
            });
            $scope.grid.setData(response.data);
            $scope.setting.valuelist.projects = response.projects;
        });
    }

    // change project
    $scope.changeSelectProject = function (value) {
        $scope.sprintId = null;
        if (value) {
            $scope.postNoAsync('api/pm/myBonus/GetSprintByProject?projectId=' + value, null, function (response) {
                if (response) {
                    $scope.setting.valuelist.sprints = response.data;
                }
            });
        }
    }

    // change project
    $scope.changeSelectSprint = function (value) {
        if (value && $scope.projectId) {
            // load data
            $scope.loadData();
        }
    }

    // display title
    $scope.displayTitle = function () {
        toogleProduct(true);
        toogleProject(true);
    };

}]);