'use strict';
app.register.controller('sprintPlanController', ['$scope', '$location', '$window', '$timeout', 'authService', '$route', '$rootScope', function ($scope, $location, $window, $timeout, authService, $route, $rootScope) {
    // register scope
    $scope.lstData = [];
    $scope.lstSprint = [];
    $scope.currentSprint = {};
    $scope.tabNameSetting = 'sprints';
    $scope.workdetails = [];
    $scope.teamCapacity = {};
    $scope.currentProject = {};
    $scope.displayTab = false;
    $scope.approveStatus = 'approved';
    $scope.isApproveSprint = false;

    //display function
    $scope.displayFunction = function () {
        $scope.button.refresh = true;
        //$("#btnSprintSetting").hide();
        //$("#btnExportExcel").show();
    };

    // display title
    $scope.displayTitle = function () {
        toogleProject(true);
        toogleSprint(true);
    };

    //export Excel
    $scope.exportExcel = function () {
        var dataExport = $scope.grid.dataView.getItems();

        var arrColumns = [];
        $.each($scope.setting.grid.columns, function (index, item) {
            arrColumns.push(item.id);
        });

        var url = 'api/pm/sprint/exportExcel';
        var param = {
            name: $scope.title.sprint,
            dataExport: JSON.stringify(dataExport),
            columns: JSON.stringify(arrColumns)
        };

        var fileID = "";
        $scope.postData(url, param, function (data) {
            fileID = "api/system/ViewFile?id=" + data + "&displayName=true";
        });

        window.location.href = fileID;
    };

    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        //get list project member
        $scope.postNoAsync('api/pm/Member/GetList?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.projectMember = data;
        });

        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        if ($scope.menuParams.spr)
            $scope.sprUrl = "&spr=" + $scope.menuParams.spr;
        else
            $scope.sprUrl = '';

        $scope.authService = authService;
        // get project
        $scope.getProject();

        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
            }
        });

        // hide sum task member
        //$("#sprintPlan .team_member .cus a").click(function () {
        //    $("#sprintPlan .team_member,#sprintPlan .sprint_plan").toggleClass("show_hidden_team_member");
        //    $(window).resize();
        //});

        // click collapse sprint
        $("#sprintPlan .sprint_plan dl dt").click(function () {
            $(this).toggleClass("arrow");
        });

        // scroll list sprint
        //SetPerfectScroll("accordion");
        // set data
        if ($scope.grid != null) {
            // get current sprint
            $scope.getCurrentSprint();
            // load data
            $scope.loadData();
            // load list sprint
            $scope.loadListSrpint();
            // sum task list
            $scope.sumTaskSprint();
            // set data for grid
            $scope.grid.setData($scope.lstData);
            $scope.grid.invalidate();

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
                };
            });
        }

        // show/hide button Approval
        $scope.checkApproved();

        // set html
        $scope.setHtml();

        // refresh
        $scope.refresh = function () {
            // get project
            $scope.getProject();
            // get current sprint
            $scope.getCurrentSprint();
            // show/hide button Approval
            $scope.checkApproved();
            // set html
            $scope.setHtml();
            // load data
            $scope.loadData();
            // load list sprint
            $scope.loadListSrpint();
            // sum task list
            $scope.sumTaskSprint();
            // set data for grid
            $scope.grid.setData($scope.lstData);
            $scope.grid.invalidate();
        }

        // search
        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            // load data
            $scope.loadData();
            // set data for grid
            $scope.grid.setData($scope.lstData);
            $scope.grid.invalidate();
        };

        $(document).click(function (e) {
            if (!$(e.target).hasClass("addChild"))
                $("#contextMenu").hide();

            if (!$(e.target).hasClass("editsprint"))
                $("#contextMenuSprint").hide();

            if (!$(e.target).hasClass("editmember"))
                $("#contextMenuMember").hide();
        });

        setSelectedMenu("sprintPlan");

        // show info
        var result = $location.search()["result"];
        var action = $location.search()["action"];
        if (result && action) {
            if (action == 'approved') {
                if (result == 'True')
                    showSuccess(sprintPlanTranslation.SUCCESS_APPROVED_SPRINT);
                else
                    showError(sprintPlanTranslation.ERROR_APPROVED_SPRINT);
            }

            else {
                if (result == 'True')
                    showSuccess(sprintPlanTranslation.SUCCESS_REJECTED_SPRINT);
                else
                    showError(sprintPlanTranslation.ERROR_REJECTED_SPRINT);
            }
        }

        // resize
        $(window).resize(function () {
            var teamMemberHeight = "70px";
            if ($("#sprintPlan #id_sprint_team").hasClass('show_hidden_team_member'))
                teamMemberHeight = "0px";

            $("#sprintPlan .content_7_3").height("calc(100% - " + teamMemberHeight + ")");

            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });
    });

    $scope.toogleSprint = function () {
        $("#sprintPlan .content_3").toggleClass("show_hidden");
        $("#sprintPlan .content_7").toggleClass("show_hidden");
        $(window).resize();
    };

    $scope.toogleTeam = function () {
        $("#sprintPlan .team_member").toggleClass("show_hidden_team_member");
        $("#sprintPlan .sprint_plan").toggleClass("show_hidden_team_member");
        $(window).resize();
    };

    // set html
    $scope.setHtml = function () {
        var html = '<li class="nav-item">' +
            '<a class="nav-link active" href="/pm/sprintPlan?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_01-tab" data-toggle="tab" data-target="#tabSprintPlan"' +
            'role="tab" aria-controls="tab_01" aria-selected="false">Sprint Plan</a>' +
            '</li>' +
            '<li class="nav-item" ng-hide="!displayTab">' +
            '<a class="nav-link" href="/pm/kanban?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_02-tab" data-toggle="tab" data-target="#tabKanban"' +
            'role="tab" aria-controls="tab_02" aria-selected="false">Kanban</a>' +
            '</li>' +
            '<li class="nav-item" ng-hide="!displayTab">' +
            '<a class="nav-link" href="/pm/sprintReview?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_03-tab" data-toggle="tab" data-target="#tabSprintReview"' +
            'role="tab" aria-controls="tab_03" aria-selected="false">Sprint Review</a>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a class="nav-link" href="/pm/teamCapacity?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_04-tab" data-toggle="tab" data-target="#tabTeamCapacity"' +
            'role="tab" aria-controls="tab_04" aria-selected="true">Team Capacity</a>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a class="nav-link" href="/pm/sprintReport?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_05-tab" data-toggle="tab" data-target="#tabSprintReport"' +
            'role="tab" aria-controls="tab_05" aria-selected="false">Sprint Report</a>' +
            '</li>';
        if (!$scope.displayTab) {
            html = '<li class="nav-item">' +
                '<a class="nav-link active" href="/pm/sprintPlan?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_01-tab" data-toggle="tab" data-target="#tabSprintPlan"' +
                'role="tab" aria-controls="tab_01" aria-selected="true">Sprint Plan</a>' +
                '</li>' +
                '<li class="nav-item">' +
                '<a class="nav-link" href="/pm/teamCapacity?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_04-tab" data-toggle="tab" data-target="#tabTeamCapacity"' +
                'role="tab" aria-controls="tab_04" aria-selected="false">Team Capacity</a>' +
                '</li>' +
                '<li class="nav-item">' +
                '<a class="nav-link" href="/pm/sprintReport?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_05-tab" data-toggle="tab" data-target="#tabSprintReport"' +
                'role="tab" aria-controls="tab_05" aria-selected="false">Sprint Report</a>' +
                '</li>';
        }

        $('#main_tab_01').html(html);
        addElementToScope("#main_tab_01", $scope);
    };

    // check approved
    $scope.checkApproved = function () {
        if ($scope.currentProject.isApproveSprint) {
            if ($scope.currentSprint) {
                if ($scope.currentSprint.approveStatus == 'approved') {
                    $("#btnApproval a").removeClass('btn_add').addClass('btn_del');
                    $("#btnApproval a").html("<i style='font-size:15px;' class='fa fa-times-circle'></i>");

                    // show/hide action task
                    $scope.button.delete = false;
                    $scope.button.edit = false;
                    $scope.button.add = false;
                    $scope.button.copy = false;
                    $scope.title.approval = "Reject";

                    $scope.displayTab = true;
                }
                else {
                    $("#btnApproval a").removeClass('btn_del').addClass('btn_add');
                    $("#btnApproval a").html("<i style='font-size:15px;' class='fa fa-check-circle'></i>");

                    // show/hide action task
                    $scope.button.delete = true;
                    $scope.button.edit = true;
                    $scope.button.add = true;
                    $scope.button.copy = true;
                    $scope.title.approval = "Approved";

                    $scope.displayTab = false;
                }

                // check role
                if ($scope.currentProject.owner == $scope.authService.user.id)
                    $("#btnApproval").show();
                else
                    $("#btnApproval").hide();
            }
        }
        else {
            $scope.displayTab = true;
            $("#btnApproval").hide();
            // show/hide action task
            $scope.button.delete = true;
            $scope.button.edit = true;
            $scope.button.add = true;
            $scope.button.copy = true;
        }
    };

    // approval
    $scope.approval = function () {
        var area = $scope.params.area;
        var pjid = $scope.params.pjid;
        var spr = $scope.params.spr;
        var url = 'api/pm/Sprint/GetAverageStoriesSprint?pjid=' + pjid + '&spr=' + spr + '&area=' + area;
        $scope.postNoAsync(url, null, function (data) {
            if (data) {
                $scope.currentSprintStoriesPoint = data.currentSprintStoriesPoint;
                $scope.averageStoriesPoint = data.averageStoriesPoint;
            }
        });
        callModal('modal-approval');
    };

    // send approval
    $scope.sendApprove = function () {
        var params = {
            spr: $scope.params.spr,
            currentSprintStoriesPoint: $scope.currentSprintStoriesPoint,
            averageStoriesPoint: $scope.averageStoriesPoint,
            remaining: $scope.teamCapacity.remaining,
            capacity: $scope.teamCapacity.capacity,
        };

        $scope.postData('api/pm/Sprint/SendMailApprovalSprint', params, function (data) {
            $('#modal-approval').modal('hide');
            if (data) {
                if (data.action == 'approved') {
                    if (data.result == true)
                        showSuccess(sprintPlanTranslation.SUCCESS_SEND_APPROVED_SPRINT);
                    else
                        showError(sprintPlanTranslation.ERROR_SEND_APPROVED_SPRINT);
                }
                else {
                    if (data.result == true)
                        showSuccess(sprintPlanTranslation.SUCCESS_SEND_REJECTED_SPRINT);
                    else
                        showError(sprintPlanTranslation.ERROR_SEND_REJECTED_SPRINT);
                }
            }
        });
    };

    // load data
    $scope.loadData = function () {
        var pjid = $scope.params.pjid;
        var area = $scope.params.area;
        var spr = $scope.params.spr;
        var searchValue = $('#inputSearch').val();
        var url = 'api/pm/Sprint/get?pjid=' + pjid + '&spr=' + spr + '&searchValue=' + searchValue + '&area=' + area;
        $scope.postNoAsync(url, null, function (data) {
            if (data) {
                $scope.lstData = data;
            }
        });
    };

    // get project
    $scope.getProject = function () {
        var pjid = $scope.params.area;
        if (!pjid)
            pjid = $scope.params.pjid;
        var url = 'api/pm/project/getbyid?id=' + pjid;
        $scope.postNoAsync(url, null, function (data) {
            if (data) {
                $scope.currentProject = data;
                $scope.isApproveSprint = data.isApproveSprint;
                $scope.setting.isApproveSprint = data.isApproveSprint;
            }
        });
    };

    // get current sprint
    $scope.getCurrentSprint = function () {
        var pjid = $scope.params.pjid;
        var area = $scope.params.area;
        var spr = $scope.params.spr;
        var url = 'api/pm/Sprint/CurrentSprint?pjid=' + pjid + '&area=' + area + '&spr=' + spr;
        $scope.postNoAsync(url, null, function (data) {
            if (data) {
                $scope.params.spr = data.id;
                if (!data.workingDayList == null || data.workingDayList == undefined)
                    data.workingDayList = [];
                $scope.currentSprint = data;
                $scope.approveStatus = data.approveStatus;
                $scope.setting.approveStatus = data.approveStatus;
            }
        });
    };

    //load list sprint
    $scope.loadListSrpint = function () {
        $scope.lstSprintPast = [];
        $scope.lstSprintCurrent = [];
        $scope.lstSprintFuture = [];

        var url = 'api/pm/Sprint/GetAllListSprint';
        var params = {
            pjid: $scope.params.pjid,
            area: $scope.params.area
        };
        $scope.postData(url, params, function (data) {
            if (data) {
                // list sprint
                $scope.lstSprint = data;
                var dataFilter = data.filter(x => x.isShow == true);
                $.each(dataFilter, function (inx, val) {
                    var currentDate = moment().format("YYYY-MM-DD");
                    var endDate = moment(val.endDate).format("YYYY-MM-DD");
                    var startDate = moment(val.startDate).format("YYYY-MM-DD");
                    var checkPast = moment(currentDate).isAfter(endDate);
                    var checkFuture = moment(startDate).isAfter(currentDate);

                    if (checkPast) {
                        $scope.lstSprintPast.push(val);
                    }
                    if (checkFuture) {
                        $scope.lstSprintFuture.push(val);
                    }
                    if (checkPast == false && checkFuture == false) {
                        $scope.lstSprintCurrent.push(val);
                    }
                });
            }
        });
    };

    // sum task list
    $scope.sumTaskSprint = function () {
        var pjid = $scope.params.pjid;
        var area = $scope.params.area;
        var spr = $scope.params.spr;
        var searchValue = $('#inputSearch').val();
        var url = 'api/pm/Sprint/SumTaskSprints?pjid=' + pjid + '&spr=' + spr + '&searchValue=' + searchValue + '&area=' + area;
        $scope.postNoAsync(url, null, function (data) {
            if (data) {
                $scope.workdetails = data.workdetails;
                $scope.teamCapacity = data.teamCapacity;
            }
        });
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
        else if ($(e.target).hasClass("addChild")) {
            var item = $scope.grid.dataView.getItem(args.row);
            if (item) {
                $scope.parentType = item.type;
                $scope.parent = item.id;
                $scope.$apply();
            }
            $("#contextMenu").css({ "top": (e.pageY - 30) + "px", "left": (e.pageX - 10) + "px" }).show();
        }
        else if ($(e.target).hasClass("editsprint")) {
            if (!$scope.displayTab || $scope.currentProject.isApproveSprint == false) {
                var item = $scope.grid.dataView.getItem(args.row);
                if (item) {
                    $scope.data = item;
                    $("#contextMenuSprint").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenuSprint'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenuSprint') + 5 }).show();

                }
            }
        }
        else if ($(e.target).hasClass("editmember")) {
            if (!$scope.displayTab || $scope.currentProject.isApproveSprint == false) {
                var item = $scope.grid.dataView.getItem(args.row);
                if (item) {
                    $scope.data = item;
                    $("#contextMenuMember").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenuMember'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenuMember') + 5 }).show();
                }
            }
        };
    };

    // add
    $scope.add = function (typeAdd) {
        $scope.data = {};
        $scope.data.area = $scope.params.area;
        $scope.data.type = 'userstory';
        $scope.data.sprint = $scope.params.spr;

        $scope.action = 'add';

        if (typeAdd != null) {
            var parent = $scope.grid.dataView.getItemById($scope.parent);
            if (parent) {
                $scope.data.parent = parent.id;
                $scope.data.parentType = parent.type;
                $scope.parentItem = parent;
            }
            $scope.data.type = typeAdd;
            $("#contextMenu").hide();
        }

        $scope.childScope.workItemForm.dataAction($scope.action, $scope.data, $scope.parentItem);
    };

    // edit
    $scope.edit = function () {
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data == null || $scope.data == undefined) {
            showError($scope.translation.ERR_SELECT_DATA_EDIT);
        }
        else {
            $scope.parentId = angular.copy($scope.data.parent);
            $scope.action = 'edit';
            $scope.childScope.workItemForm.dataAction($scope.action, $scope.data);
        }
    };

    // copy
    $scope.copy = function (typeAdd, parent) {
        if ($scope.grid != null) {
            var data = $scope.grid.getCurrentData();
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }
            $scope.parentItem = null;
            $scope.action = 'add';

            $scope.data = angular.copy(data);
            $scope.data.id = null;
            $scope.data.no = null;
            $scope.data.state = 'new';
            $scope.data.priority = '3-Normal';
            $scope.data.risk = 'Medium';

            $scope.data.actualStartDate = null;
            $scope.data.actualEndDate = null;
            $scope.data.actualDuration = null;

            if ($scope.data.type != "task") {
                $scope.data.planStartDate = null;
                $scope.data.planEndDate = null;
                $scope.data.planDuration = null;
            }

            if (!isNullOrEmpty($scope.data.parent)) {
                var parentItemGrid = $scope.grid.dataView.getItemById($scope.data.parent);
                $scope.parentItem = parentItemGrid ? angular.copy(parentItemGrid) : $scope.getWorkItemById($scope.data.parent);
            }
            //$scope.parentItem = parent;

            if (!isNullOrEmpty(typeAdd)) {
                if (parent == null) {
                    parent = $scope.grid.getCurrentData();
                    $scope.parentItem = parent;
                }
                $scope.data.type = typeAdd;
                $("#contextMenu").hide();
            }

            $scope.childScope['workItemForm'].dataAction($scope.action, $scope.data, $scope.parentItem);
        }
    };

    // get work item by id
    $scope.getWorkItemById = function (id) {
        var itemData = {};
        $scope.postData('api/workitem/GetWorkItemById', { id: id }, function (data) {
            itemData = data;
        });
        return itemData;
    };

    // delete
    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError($scope.translation.ERR_SELECT_DATA_DELETE);
        else {
            $scope.data = $.extend(true, {}, data);
            $scope.flagDeleteSprint = false;
            $('#modal-confirm').modal();
        }
    };

    // delete data
    $scope.deleteData = function () {
        // delete sprint
        if ($scope.flagDeleteSprint) {
            // delete sprint
            $scope.childScope.sprintSetting.deleteSprint();
        }
        else {
            $scope.action = 'delete';
            $scope.childScope.workItemForm.dataAction($scope.action, $scope.data);
        }
    };

    // delete work item
    $scope.deleteWorkItem = function () {
        if ($scope.data.hasChild) {
            $('#inputSearch').val('');
            // load data
            $scope.loadData();
            // set data for grid
            $scope.grid.setData($scope.lstData);
            $scope.grid.invalidate();
        }
        else {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
        }

        $scope.$applyAsync(function () {
            //load list sprint
            $scope.loadListSrpint();
            // sum task list
            $scope.sumTaskSprint();
            showSuccess($scope.translation.DELETE_DATA_SUCCESS);
        });
    };

    // save work item
    $scope.saveWorkItem = function (data) {
        if (data.state != 'removed') {
            // in sprint
            if (data.sprint == $scope.params.spr) {
                var parentId = data.parent;
                // add
                if ($scope.action == 'add') {
                    $('#inputSearch').val('');
                    if (parentId == null)
                        $scope.grid.dataView.insertItem(0, data);
                    else {
                        var parent = $scope.grid.dataView.getItemById(parentId);
                        var index = 0;
                        if (parent) {
                            index = $scope.grid.dataView.getIdxById(parentId) + 1;
                            data.indent = parent.indent + 1;
                        }
                        $scope.grid.dataView.insertItem(index, data);
                        $scope.grid.invalidate();

                        // update user story
                        $scope.updateUserStory($scope.data, data);
                    }
                }
                // edit
                else {
                    if (parentId != $scope.parentId) {
                        $('#inputSearch').val('');
                        // load data
                        $scope.loadData();
                        // set data for grid
                        $scope.grid.setData($scope.lstData);
                        $scope.grid.invalidate();
                    }
                    else {
                        data.indent = $scope.data.indent;
                        $scope.grid.dataView.updateItem(data.id, data);
                        $scope.grid.invalidate();
                        // update user story
                        $scope.updateUserStory($scope.data, data);
                    }
                }
            }
            // without sprint
            else {
                if ($scope.data.hasChild) {
                    $('#inputSearch').val('');
                    // load data
                    $scope.loadData();
                    // set data for grid
                    $scope.grid.setData($scope.lstData);
                    $scope.grid.invalidate();
                }
                else {
                    $scope.grid.dataView.deleteItem($scope.data.id);
                    $scope.grid.invalidate();

                    // update user story
                    $scope.updateUserStory($scope.data, data);
                }
            }
        }
        else {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();

            // update user story
            $scope.updateUserStory($scope.data, data);
        }

        $scope.$applyAsync(function () {
            //load list sprint
            $scope.loadListSrpint();
            // sum task list
            $scope.sumTaskSprint();
        });
    };

    //--------- sprint setting ------------
    // change setting
    $scope.changeSetting = function () {
        var listData = angular.copy($scope.lstSprint);
        var currentSprint = angular.copy($scope.currentSprint);
        var currentProject = angular.copy($scope.currentProject);
        $scope.childScope.sprintSetting.callModal(listData, currentSprint, currentProject);
    };

    // save sprint setting
    $scope.saveAndClose = function (tabNameSetting) {
        if (tabNameSetting == "sprints") {
            $scope.$applyAsync(function () {
                //load list sprint
                $scope.loadListSrpint();
            });
        }
        else {
            $scope.$applyAsync(function () {
                // get current sprint
                $scope.getCurrentSprint();
                // load data
                $scope.loadData();
                // load list sprint
                $scope.loadListSrpint();
                // sum task list
                $scope.sumTaskSprint();
            });
        }
    };

    // refresh sprint setting
    $scope.refreshSprintSetting = function () {
        // load data sprint setting
        $scope.loadDataSprintSetting();
    };

    // save sprint setting popup
    $scope.saveSprintSettingPop = function () {
        // load data sprint setting
        $scope.loadDataSprintSetting();
    };

    // delete sprint setting
    $scope.deleteSprint = function () {
        // load data sprint setting
        $scope.loadDataSprintSetting();
    };

    // load data sprint setting
    $scope.loadDataSprintSetting = function () {
        //load list sprint
        $scope.loadListSrpint();
        var listData = angular.copy($scope.lstSprint);
        var currentProject = angular.copy($scope.currentProject);
        var currentSprint = angular.copy($scope.currentSprint);
        $scope.childScope.sprintSetting.loadData(listData, currentSprint, currentProject);
    };

    // --------- end sprint setting ------------

    $scope.editsprint = function (sprintID) {
        $("#contextMenuSprint").hide();
        $scope.data.sprint = sprintID;
        $scope.frmFile.set("data", JSON.stringify($scope.data));
        $scope.postFile('api/pj/' + $scope.data.type + '/update', $scope.frmFile, function (data) {
            $scope.refreshFrm();
            //data.indent = $scope.data.indent;
            //$scope.grid.dataView.updateItem(data.id, data);

            // load data
            $scope.loadData();
            // set data for grid
            $scope.grid.setData($scope.lstData);
            $scope.grid.invalidate();

            // sum task list
            $scope.sumTaskSprint();
        });
    };

    $scope.editmember = function (memberID) {
        $("#contextMenuMember").hide();
        $scope.data.assign = memberID;
        $scope.frmFile.set("data", JSON.stringify($scope.data));
        $scope.postFile('api/pj/' + $scope.data.type + '/update', $scope.frmFile, function (data) {
            $scope.refreshFrm();
            data.indent = $scope.data.indent;
            $scope.grid.dataView.updateItem(data.id, data);

            // sum task list
            $scope.sumTaskSprint();
        });
    };

    // update user story
    $scope.updateUserStory = function (oldData, newData) {
        var parent = $scope.grid.dataView.getItemById(newData.parent);
        if (parent) {
            var parent2 = angular.copy(parent);
            parent2.remaining = parent2.remaining - oldData.remaining + newData.remaining;
            parent2.originalEstimate = parent2.originalEstimate - oldData.originalEstimate + newData.originalEstimate;
            parent2.completed = parent2.completed - oldData.completed + newData.completed;
            $scope.grid.dataView.updateItem(parent.id, parent2);
            $scope.updateUserStory(parent, parent2);
        }
    };

}]);