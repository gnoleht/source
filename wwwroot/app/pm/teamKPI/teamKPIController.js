'use strict';
app.register.controller('teamKPIController', ['$scope', '$timeout', function ($scope, $timeout) {
    // display function
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;

        //$("#btnExportKPI").show();
    };

    $scope.$on('$routeChangeSuccess', function () {
        if (!$scope.$parent.$parent.taskParams) {
            $scope.$parent.$parent.taskParams = {};
            $scope.type = "all";
            $scope.$parent.$parent.taskParams.type = "all";
        }
        else {
            $scope.project = $scope.$parent.$parent.taskParams.project;
            $scope.sprint = $scope.$parent.$parent.taskParams.sprint;
            $scope.projectMember = $scope.$parent.$parent.taskParams.projectMember;
            $scope.type = $scope.$parent.$parent.taskParams.type;
        }

        $scope.postNoAsync('api/pm/myTaskList/GetListProject', null, function (data) {
            $scope.setting.valuelist.project = data;
            if (!$scope.$parent.$parent.taskParams.project) {
                $scope.project = [];
                $.each(data, function (key, value) {
                    $scope.project.push(value.id);
                });
            }

            $timeout(function () {
                $("#select-project").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-project').selectpicker('refresh');
            });
        });

        $scope.loadSprint();
        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadData();
        };

        setSelectedMenu('teamKPI');

        if ($scope.grid != null) {
            // load data
            $scope.loadData();

            //custom in filter function, data is rowData, return true to show row, false to hide row
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;
                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.onClick.subscribe(function (e, args) {
                $scope.collapseChild(e, args);
            });

            $scope.grid.isShowAll = true;
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

        // resize
        $(window).resize(function (e) {
            var width = $("#teamKPI .white_box").width();
            var height = $("#teamKPI .white_box").height();
           
            $('#teamKPI #grvKPI').height(height - 40);
            $('#teamKPI #grvKPI').width(width);
            
            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });
        $(window).resize();
        

        // refresh
        $scope.refresh = function () {
            $("#inputSearch").val('');
            $scope.type = "all";
            $scope.postNoAsync('api/pm/myTaskList/GetListProject', null, function (data) {
                $scope.project = [];
                $scope.setting.valuelist.project = data;
                $scope.project.push(data[0].id);
                $timeout(function () {
                    $("#select-project").selectpicker({
                        width: "100%",
                        selectedTextFormat: "count>2",
                        noneSelectedText: "...",
                        actionsBox: true,
                        size: false
                    });
                    $('#select-project').selectpicker('refresh');
                });
            });
            $scope.loadSprint();
            // load data
            $scope.loadData();
        };

        // search
        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            // load data
            $scope.loadData();
        };
    });

    // collapseChild
    $scope.collapseChild = function (e, args) {
        $("#contextMenu").hide();
        if ($(e.target).hasClass("toggle")) {
            var item = $scope.grid.dataView.getItem(args.row);
            if (item) {
                if (!item.isCollapsed) {
                    item.isCollapsed = true;
                    $(e.target).removeClass("fa fa-angle-down").addClass("fa fa-angle-right");
                } else {
                    item.isCollapsed = false;
                    $(e.target).removeClass("fa fa-angle-right").addClass("fa fa-angle-down");
                }
                $scope.grid.dataView.updateItem(item.id, item);
            }
            e.stopImmediatePropagation();
        }
    };

    // collapse all
    $scope.collapseAll = function (grid) {
        var array = grid.dataView.getItems().filter(function (x) { return x.hasChild == true; });
        grid.dataView.beginUpdate();
        $.each(array, function (index, item) {
            item.isCollapsed = grid.isShowAll;
            grid.dataView.updateItem(item.id, item);
        });
        grid.dataView.endUpdate();
        grid.invalidate();
        grid.isShowAll = !grid.isShowAll;
    };

    // load data
    $scope.loadData = function () {
        var searchValue = $("#inputSearch").val();
        var params = {
            searchValue: searchValue,
            pjid: $scope.project,
            spr: $scope.sprint,
            type: $scope.type
        };

        $scope.postData(teamKPISetting.grid.url, params, function (response) {
            if (response) {
                $.each(response, function (index, item) {
                    if (item.hasChild) item.isCollapsed = false;
                });
                $scope.grid.setData(response);
                $scope.grid.invalidate();
            }
        });
    };

    // change project
    $scope.ChangeProject = function () {
        $scope.$parent.$parent.taskParams.project = $scope.project;
        $scope.loadSprint();
        $scope.loadData();
        $scope.defaultSprint = angular.copy($scope.sprint);
    };

    $scope.ChangeSprint = function () {
        $scope.$parent.$parent.taskParams.sprint = $scope.sprint;
        var result = angular.equals($scope.sprint, $scope.defaultSprint);
        if (!result) {
            $scope.loadData();
            $scope.defaultSprint = angular.copy($scope.sprint);
        }
        $('#teamKPI .box_cbb button[data-id=select-sprint]').toggleClass('active');
    };

    // change task bug
    $scope.ChangeType = function () {
        $scope.$parent.$parent.taskParams.type = $scope.type;
        $scope.loadData();
    };

    $scope.loadSprint = function () {
        var params = {
            pjid: $scope.project
        };
        $scope.postData('api/pm/teamKPI/GetListSprintByProjectId', params, function (data) {
            $scope.setting.valuelist.sprint = data;
            if (!$scope.$parent.$parent.taskParams.sprint) {
                $scope.currentSprint();
            }
            $timeout(function () {
                $("#select-sprint").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-sprint').selectpicker('refresh');
            });
        });
    };

    // get current sprint
    $scope.currentSprint = function () {
        var params = {
            pjid: $scope.project
        };
        $scope.postData('api/pm/teamKPI/GetListCurrentSprintByProjectId', params, function (data) {
            if (data)
                $scope.sprint = data;
        });
    };

    $scope.exportExcelKPI = function () {
        var data = $scope.grid.dataView.getItems().filter(x => x.hasChild);
        var param = {
            id: 'KPI Teamplate',
            data: JSON.stringify(data),
            baseRow: '13',
            sprint: $scope.sprint
        };

        $scope.postData('api/pm/teamKPI/export', param, function (data) {
            window.location = 'api/system/ViewFile/' + data.fileId + '/' + data.fileName;
        });
    };
}]);