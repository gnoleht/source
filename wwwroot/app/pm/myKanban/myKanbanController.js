'use strict';
app.register.controller('myKanbanController', ['$scope', '$location', '$window', '$timeout', 'authService', function ($scope, $location, $window, $timeout, authService) {
    var preventPopup = false;
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.$on('$routeChangeSuccess', function () {
        setSelectedMenu('myTaskList');
        $scope.authService = authService;

        $.ajax({
            url: '/app/pm/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
                $scope.setting.valuelist.stateKanban.splice(3, 1);
            }
        });

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
        $scope.loadProjectMember();
        $scope.loadData();
        $scope.showButton();

        // search
        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadData();
        };

        //// refresh
        //$scope.refresh = function () {
        //    $("#inputSearch").val('');
        //    $scope.type = "all";
        //    $scope.postNoAsync('api/pm/myTaskList/GetListProject', null, function (data) {
        //        $scope.project = [];
        //        $scope.setting.valuelist.project = data;
        //        $.each(data, function (key, value) {
        //            $scope.project.push(value.id);
        //        });
        //        $timeout(function () {
        //            $("#select-project").selectpicker({
        //                width: "100%",
        //                selectedTextFormat: "count>2",
        //                noneSelectedText: "...",
        //                actionsBox: true,
        //                size: false
        //            });
        //            $('#select-project').selectpicker('refresh');
        //        });
        //    });

        //    $scope.loadSprint();
        //    $scope.loadProjectMember();
        //    $scope.loadData();
        //    $scope.showButton();
        //};
    });

    $scope.refresh = function (callback) {
        $scope.loadData(function () {
            if (!$scope.$$phase) {
                $scope.$digest();
            }

            if (callback)
                callback();
        });
    };

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

    $scope.ChangeType = function () {
        $scope.$parent.$parent.taskParams.type = $scope.type;
        //$scope.loadData();
    };

    $scope.loadData = function (callback) {
        var searchValue = $("#inputSearch").val();
        if (searchValue === undefined) searchValue = null;
        var params = {
            pjid: $scope.project,
            spr: $scope.sprint,
            type: $scope.type,
            userId: $scope.projectMember,
            searchValue: searchValue
        };

        $scope.postData('api/pm/myKanban/get_MyKanban', params, function (data) {
            $scope.dataKanban = data;
            if (callback)
                callback();
        });
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

    //$scope.totalRemaining = function () {
    //    var url = 'api/pm/Sprint/Get_Total_Remaining?pjid=' + $scope.params.pjid + '&spr=' + $scope.params.spr;
    //    $scope.postNoAsync(url, null, function (data) {
    //        $scope.total_Remaining = data;
    //    });
    //}

    $scope.loadKanbanColumn = function (last) {
        if (!last) return;
        $('.column').sortable({
            connectWith: '.column',
            placeholder: "block-placeholder",
            scroll: true,
            cursor: "move",
            remove: function (event, ui) {
                //var block = null;

                //var blockId = ui.item.data("blockid");
                //var indexBlock = $scope.dataKanban.findIndex(x => x.id == blockId);
                //block = $scope.dataKanban[indexBlock];

                //var oldRemnaining = parseInt($("#" + $(this).data("column")).text());
                //var newRemnaining = block.remaining;
                //$("#" + $(this).data("column")).text(oldRemnaining - newRemnaining);
            },
            receive: function (event, ui) {
                if ($scope.projectMember != $scope.authService.user.id) {
                    showWarning($scope.translation.ERR_CHANGE_STATE);
                    ui.sender.sortable("cancel");
                    $scope.refresh(function () {
                        ui.item.remove();
                    });
                    preventPopup = true;
                    return;
                }

                var block = null;
                var blockId = ui.item.data("blockid");
                var indexBlock = $scope.dataKanban.findIndex(x => x.id == blockId);
                block = $scope.dataKanban[indexBlock];

                //if (block.approved) {
                //    showWarning($scope.translation.ERR_APPROVED);
                //    ui.sender.sortable("cancel");

                //    $scope.refresh(function () {
                //        ui.item.remove();
                //    });

                //    preventPopup = true;
                //    return;
                //}

                $scope.blockOld = angular.copy(block);

                //var oldRemnaining = parseInt($("#" + $(this).data("column")).text());
                //var newRemnaining = block.remaining;
                //$("#" + $(this).data("column")).text(oldRemnaining + newRemnaining);

                block.state = $(this).data("column");

                $scope.UpdateOnchange(block, function () {
                    $scope.refresh(function () {
                        ui.item.remove();
                    });
                });

                preventPopup = true;
            },
            cancel: ".btn_kanban"
        }).disableSelection();
    };

    $scope.UpdateOnchange = function (block, callback) {
        //$scope.frmFile.set("data", JSON.stringify(block));
        $scope.postData('api/pj/' + block.type + '/update', { data: JSON.stringify(block) }, function (data) {
            if (callback)
                callback();
        });
    };

    $("#myKanban").on('click', function () {
        $("#contextMenuTB").hide();
    });

    $scope.add = function () {
        var temp = $("#btnAdd").position();
        var inputSearchWidth = $("#inputSearch").width();
        $("#contextMenuTB").css({ "top": (temp.top + 40) + "px", "right": (inputSearchWidth + 20) + "px" }).show();
    };

    $scope.addWorkItemByType = function (typeAdd) {
        $scope.action = 'add';
        $scope.listFileUpload = [];
        $scope.data = {};
        $scope.attachments = [];

        $scope.data.state = 'new';
        $scope.data.priority = '3-Normal';
        $scope.data.risk = 'Medium';
        $scope.data.size = '0';
        $scope.data.reason = 'new';
        $scope.data.version = 'Ver 1.0';

        $scope.parentItem = null;//noparent

        $scope.data.type = typeAdd;
        $scope.data.projectId = $scope.project[0];
        $scope.data.sprint = $scope.sprint[0];
        $scope.data.assign = $scope.projectMember;

        $("#contextMenuTB").hide();
        $scope.childScope.workItemForm.dataAction('add', $scope.data);
    };

    $scope.refresh = function (callback) {
        $scope.loadData(function () {
            if (!$scope.$$phase) {
                $scope.$digest();
            }

            if (callback)
                callback();
        });
    };

    $scope.blockBox = function (value) {
        //if (approved)
        //    return "box_green";

        if (value == "task")
            return "box_yellow";
        else
            return "box_red";
    };

    $scope.editblock = function (blockId) {
        //if ($scope.projectMember != $scope.authService.user.id) {
        //    showWarning($scope.translation.ERR_CHANGE_STATE);
        //    return;
        //}

        if (preventPopup == false || navigator.userAgent.indexOf('Firefox') == -1) {
            var data = null;
            var indexBlock = $scope.dataKanban.findIndex(x => x.id == blockId);
            data = $scope.dataKanban[indexBlock];
            $scope.action = 'edit';
            if (data == null || data == undefined) {
                showError($scope.translation.ERR_SELECT_DATA_EDIT);
            }
            else {
                $scope.indexChild = index;
                $scope.childScope.workItemForm.dataAction('edit', data);
                if ($scope.projectMember != $scope.authService.user.id) {
                    $("#btnSaveClose").hide();
                }
                else {
                    $("#btnSaveClose").show();
                }
            }
        }
        preventPopup = false;
    };

    $scope.saveWorkItem = function () {
        $scope.refresh();
    };

    $scope.priorityStyle = function (item) {
        return "priority_0" + item.priority.substring(0, 1);
    };

    // show button
    $scope.showButton = function () {
        if ($scope.project.length == 0 || $scope.sprint.length == 0) {
            $scope.button.add = false;
            return;
        }

        if ($scope.projectMember == $scope.authService.user.id) {
            var data = $scope.setting.valuelist.project.filter(function (item) {
                if (item.isApproveSprint)
                    return $scope.project.includes(item.id);
            });

            if (data.length > 0)
                $scope.button.add = false;
            else {
                if ($scope.project.length == 1 && $scope.sprint.length == 1) {
                    $scope.button.add = true;
                }
                else {
                    $scope.button.add = false;
                }
            }
        }
        else $scope.button.add = false;
    };
}]);