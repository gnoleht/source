'use strict';

app.register.controller('myTaskListController', ['$scope', '$location', '$window', '$timeout', 'authService', function ($scope, $location, $window, $timeout, authService) {
    //init
    $scope.displayFunction = function () {
        $scope.button.refresh = true;
        $scope.button.copy = false;
        $scope.button.add = false;
        $scope.button.delete = false;
        $scope.button.edit = false;
    };

    $scope.$on('$routeChangeSuccess', function () {
        setSelectedMenu('myTaskList');
        $scope.authService = authService;

        $("#myTaskList").on('click', function () {
            $("#contextMenu_Task").hide();
        });

        if (!$scope.$parent.$parent.taskParams) {
            $scope.$parent.$parent.taskParams = {};
            $scope.$parent.$parent.taskParams.type = "all";
            $scope.type = "all";
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
        $scope.loadProjectMember();
        if ($scope.grid != null) {
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.editAction = function () {
                $scope.edit();
                $scope.$digest();
            };

            $scope.loadData();

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
                };
            });
        }

        // resize
        $(window).resize(function (e) {
            var width = $("#myTaskList .white_box").width();
            var height = $("#myTaskList .white_box").height();

            $('#grvMyTaskList').height(height - 40);
            $('#grvMyTaskList').width(width);
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
                $.each(data, function (key, value) {
                    $scope.project.push(value.id);
                });
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
            $scope.loadProjectMember();
            // show button
            $scope.showButton();
            // load data
            $scope.loadData();
        };

        // show button
        $scope.showButton();

        // search
        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            // load data
            $scope.loadData();
        };
    });

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

    // collapseChild
    $scope.collapseChild = function (e, args) {
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

    // load sprint
    $scope.loadSprint = function () {
        var params = {
            pjid: $scope.project
        };
        $scope.postData('api/pm/myTaskList/GetSprintByProjectId', params, function (data) {
            $scope.setting.valuelist.sprint = data;
            if (!$scope.$parent.$parent.taskParams.sprint) {
                $scope.currentSprint();
            }
            $timeout(function () {
                $("#select-sprint").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>3",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-sprint').selectpicker('refresh');
            });
        });
    };

    // load member
    $scope.loadProjectMember = function () {
        var params = {
            pjid: $scope.project
        };
        $scope.postData('api/pm/myTaskList/GetMemberByProjectId', params, function (data) {
            $scope.setting.valuelist.projectMember = data;
            if (!$scope.$parent.$parent.taskParams.projectMember)
                $scope.projectMember = $scope.authService.user.id;
        });
    };

    // get current sprint
    $scope.currentSprint = function () {
        var params = {
            pjid: $scope.project
        };
        $scope.postData('api/pm/myTaskList/GetCurrentSprintByProjectId', params, function (data) {
            if (data)
                $scope.sprint = data;
        });
    };

    // load data
    $scope.loadData = function () {
        var searchValue = $("#inputSearch").val();
        var params = {
            searchValue: searchValue,
            pjid: $scope.project,
            spr: $scope.sprint,
            type: $scope.type,
            userId: $scope.projectMember
        };

        $scope.postData(myTaskListSetting.grid.url, params, function (response) {
            $.each(response, function (index, item) {
                if (item.hasChild) item.isCollapsed = false;
            });
            $scope.grid.setData(response);
        });
    };

    // change project
    $scope.ChangeProject = function () {
        $scope.$parent.$parent.taskParams.project = $scope.project;
        $scope.loadSprint();
        $scope.loadProjectMember();
        $scope.loadData();
        $scope.defaultSprint = angular.copy($scope.sprint);
        $scope.showButton();
    };

    $scope.ChangeSprint = function () {
        $scope.$parent.$parent.taskParams.sprint = $scope.sprint;
        var result = angular.equals($scope.sprint, $scope.defaultSprint);
        if (!result) {
            $scope.loadData();
            $scope.defaultSprint = angular.copy($scope.sprint);
        }
        $scope.showButton();
    };

    $scope.ChangeMember = function () {
        $scope.$parent.$parent.taskParams.projectMember = $scope.projectMember;
        $scope.loadData();
        $scope.showButton();
    };

    // change task bug
    $scope.ChangeType = function () {
        $scope.$parent.$parent.taskParams.type = $scope.type;
        $scope.loadData();
    };

    // show button
    $scope.showButton = function () {
        if ($scope.project.length == 0 || $scope.sprint.length == 0) {
            $scope.button.add = false;
            $scope.button.delete = false;
            $scope.button.edit = false;
            return;
        }

        if ($scope.projectMember == $scope.authService.user.id) {
            var data = $scope.setting.valuelist.project.filter(function (item) {
                if (item.isApproveSprint)
                    return $scope.project.includes(item.id);
            });

            if (data.length > 0) {
                $scope.button.add = false;
                $scope.button.delete = false;
                $scope.button.edit = false;
            }
            else {
                if ($scope.project.length == 1 && $scope.sprint.length == 1) {
                    $scope.button.add = true;
                    $scope.button.delete = true;
                    $scope.button.edit = true;
                }
                else {
                    $scope.button.add = false;
                    $scope.button.delete = true;
                    $scope.button.edit = true;
                }
            }
        }
        else {
            $scope.button.delete = false;
            $scope.button.edit = false;
            $scope.button.add = false;
        }
    };

    // edit
    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data) {
            if (data.indent == 2) {
                $scope.postNoAsync('api/pm/myTaskList/GetWorkItemById?id=' + data.workItemId, null, function (response) {
                    if (response) {
                        $scope.childScope.workItemForm.dataAction('edit', response);
                        if ($scope.projectMember == $scope.authService.user.id) {
                            $("#btnSaveClose").show();
                        }
                        else {
                            $("#btnSaveClose").hide();
                        }
                    }
                });
            }
        }
        else {
            showError($scope.translation.ERR_SELECT_DATA_EDIT);
        }

    };

    //function
    $scope.add = function () {
        var temp = $("#btnAdd").position();
        var inputSearchWidth = $("#inputSearch").width();
        $("#contextMenu_Task").css({ "top": (temp.top + 40) + "px", "right": (inputSearchWidth + 20) + "px" }).show();

    };

    // add task bug
    $scope.addTaskBug = function (type) {
        var data = {};
        data.type = type;
        data.projectId = $scope.project[0];
        data.sprint = $scope.sprint[0];
        data.assign = $scope.projectMember;
        $scope.childScope.workItemForm.dataAction('add', data);
    };

    // delete
    $scope.delete = function () {
        if ($scope.projectMember == $scope.authService.user.id) {
            var data = $scope.grid.getCurrentData();
            if (data) {
                if (data.indent == 2) {
                    $scope.postNoAsync('api/pm/myTaskList/GetWorkItemById?id=' + data.workItemId, null, function (response) {
                        if (response) {
                            $scope.data = response;
                            $('#modal-confirm').modal();
                        }
                    });
                }
            }
            else {
                showError($scope.translation.ERR_SELECT_DATA_DELETE);
            }
        }
    };

    // delete data
    $scope.deleteData = function () {
        $scope.childScope.workItemForm.dataAction('delete', $scope.data);
    };

    // delete work item
    $scope.deleteWorkItem = function () {
        // load data
        $scope.loadData();
    };

    // save work item
    $scope.saveWorkItem = function (data) {
        // load data
        $scope.loadData();
    };

    // show modal chat
    $scope.showModal = function () {
        callModal("chatModal");
        //$("#chatModal")('show');
    };

}]);