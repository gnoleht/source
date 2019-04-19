'use strict';
app.register.controller('sprintReviewController', ['$scope', '$location', '$window', '$timeout', 'authService', '$route', '$rootScope', function ($scope, $location, $window, $timeout, authService, $route, $rootScope) {
    // register scope
    $scope.lstData = [];
    $scope.lstSprint = [];
    $scope.currentSprint = {};
    $scope.tabNameSetting = 'sprints';
    $scope.workdetails = [];
    $scope.teamCapacity = {};
    $scope.displayTab = false;

    //display function
    $scope.displayFunction = function () {
        $scope.button.delete = true;
        $scope.button.edit = true;
        $scope.button.add = true;
        $scope.button.copy = true;
        $scope.button.refresh = true;
        $("#btnSprintSetting").hide();
    };

    // display title
    $scope.displayTitle = function () {
        toogleProject(true);
        toogleSprint(true);
    };

    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        $scope.setting.listFilter = [];
        $.ajax({
            url: '/app/pm/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
            },
        });

        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        if ($scope.menuParams.spr)
            $scope.sprUrl = "&spr=" + $scope.menuParams.spr;
        else
            $scope.sprUrl = '';

        // get project
        $scope.getProject();

        // click collapse sprint
        $("#sprintReview .sprint_plan dl dt").click(function () {
            $(this).toggleClass("arrow");
        });

        // set data
        if ($scope.grid !== null) {
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
                if (data.parent === null) return true;
                var dataView = $scope.grid.dataView;
                var parent = dataView.getItemById(data.parent);
                if (parent === undefined || parent === null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.onClick.subscribe(function (e, args) {
                $scope.collapseChild(e, args);
            });

            $scope.grid.isShowAll = true;
            $scope.grid.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command === 'collapseAll') {
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

            $scope.grid.onClick.subscribe(function (e, args) {
                var params = {};
                var data = $scope.grid.dataView.getItem(args.row);
                var indent = data.indent;
                if ($(e.target).hasClass("text_accept")) {
                    if (data !== null) {
                        data.approved = true;
                        data.state = 'closed';
                        params.data = JSON.stringify(data);
                        // update workitem
                        $scope.postData('api/WorkItem/Update', params, function (data) {
                            $scope.$applyAsync(function () {
                                data.indent = indent;
                                $scope.grid.dataView.updateItem(data.id, data);
                                $scope.grid.invalidate();
                                $(e.target).parent().parent().toggleClass("change");
                            });
                        });
                    }
                }
                if ($(e.target).hasClass("text_release")) {
                    if (data !== null) {
                        data.approved = false;
                        data.state = 'active';
                        params.data = JSON.stringify(data);
                        // update workitem
                        $scope.postData('api/WorkItem/Update', params, function (data) {
                            $scope.$applyAsync(function () {
                                data.indent = indent;
                                $scope.grid.dataView.updateItem(data.id, data);
                                $scope.grid.invalidate();
                                $(e.target).parent().parent().toggleClass("change");
                            });
                        });
                    }
                }
                else if ($(e.target).hasClass("bowtie-icon bowtie-comment-discussion")) {
                    if (data !== null) {
                        // open comment
                        $scope.wordItemId = data.id;
                        $scope.openComment(e, data.id);
                    }
                }
            });
        }

        // show/hide button Approval
        $scope.checkApproved();

        // refresh
        $scope.refresh = function () {
            // get project
            $scope.getProject();
            // get current sprint
            $scope.getCurrentSprint();

            // show/hide button Approval
            $scope.checkApproved();

            // load data
            $scope.loadData();
            // load list sprint
            $scope.loadListSrpint();
            // sum task list
            $scope.sumTaskSprint();
            // set data for grid
            $scope.grid.setData($scope.lstData);
            $scope.grid.invalidate();
        };

        // search
        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            // load data
            $scope.loadData();
            // set data for grid
            $scope.grid.setData($scope.lstData);
            $scope.grid.invalidate();
        };

        setSelectedMenu("sprintPlan");

        // resize
        $(window).resize(function () {
            var teamMemberHeight = "70px";
            if ($("#id_sprint_team").hasClass('show_hidden_team_member'))
                teamMemberHeight = "0px";

            $("#sprintReview .content_7_3").height("calc(100% - " + teamMemberHeight + ")");

            if ($scope.grid)  $scope.grid.resizeCanvas();
        });
    });

    $scope.toogleSprint = function (e) {
        $("#sprintReview .content_3").toggleClass("show_hidden");
        $("#sprintReview .content_7").toggleClass("show_hidden");

        $(window).resize();
    };

    $scope.toogleTeam = function (e) {
        $("#sprintReview .team_member, #sprintReview .sprint_plan").toggleClass("show_hidden_team_member");
        $(window).resize();
    };

    // open comment
    $scope.openComment = function (e, id) {
        $scope.comment = {};
        $scope.getComment(id);
        $scope.comment.PMId = id;
        $("#popover-comment-sprint").css({ "top": e.clientY - 25, "left": e.clientX - 280 }).show();
        $('#comment-content').focus();
    }

    $scope.closeComment = function () {
        $("#popover-comment-sprint").hide();
    }

    //get comment theo id
    $scope.getComment = function (id) {
        $scope.post('/api/workItem/getcomment?id=' + id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.discussion = data;
            $scope.$applyAsync();
        });
    };

    //post comment theo id
    $scope.postComment = function () {
        if ($scope.comment.content) {
            $scope.comment.PMId = $scope.wordItemId;
            $scope.postNoAsync('api/workitem/postcomment', JSON.stringify($scope.comment), function (data) {
                $scope.comment.createdByRelated = authService.user;
                $scope.comment.createdTime = moment(data.createdTime).fromNow();
                $scope.discussion.unshift($scope.comment);
                $scope.comment = {};
                $('#comment-content').focus();
            }, function (error) { showError(error); });
        }
        else {
            showError("Empty input comment content!");
        }
    };


    // check approved
    $scope.checkApproved = function () {
        if ($scope.currentProject.isApproveSprint) {
            if ($scope.currentSprint) {
                if ($scope.currentSprint.approveStatus == 'approved') {
                    // show/hide action task
                    $scope.button.delete = false;
                    $scope.button.edit = false;
                    $scope.button.add = false;
                    $scope.button.copy = false;
                }
                else {
                    // show/hide action task
                    $scope.button.delete = true;
                    $scope.button.edit = true;
                    $scope.button.add = true;
                    $scope.button.copy = true;
                }
            }
        }
        else {
            // show/hide action task
            $scope.button.delete = true;
            $scope.button.edit = true;
            $scope.button.add = true;
            $scope.button.copy = true;
        }
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
            }
        });
    }

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
    }

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
    };

    //-------------- work item -------------

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

    //-------------- end work item -------------

    // mouseup
    $(document).mouseup(function (e) {
        var container = $("#popover-comment-sprint");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $("#popover-comment-sprint").hide();
        }
    });

    //--------- sprint setting ------------
    // change setting
    $scope.changeSetting = function () {
        var listData = angular.copy($scope.lstSprint);
        var currentSprint = angular.copy($scope.currentSprint);
        var currentProject = angular.copy($scope.currentProject);
        $scope.childScope.sprintSetting.callModal(listData, currentSprint, currentProject);
    };

    // save sprint setting
    $scope.saveAndClose = function (tabNameSetting, listSprint) {
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

    // --------- end sprint setting ------------
}]);