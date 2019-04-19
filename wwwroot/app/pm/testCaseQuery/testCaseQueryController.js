'use strict';
app.register.controller('testCaseQueryController', ['$scope', '$timeout', 'authService', function ($scope, $timeout, authService) {
   
    //display function
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
        $scope.button.search = false;
    };
    // display title
    $scope.displayTitle = function () {
        $scope.toogleTitle.area = false;
        toogleProject(true);
    };
    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        $scope.authService = authService;
        $("#detailWorkItem").hide();
        $scope.postNoAsync('api/sys/user/getlist', null, function (data) {
            $scope.setting.valuelist.user = data;
        });

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
        testCaseQuerySetting.valuelist = $scope.setting.valuelist;
        testCaseQuerySetting.listFilter = $scope.setting.listFilter;

        setSelectedMenu("testPlan");

        if ($scope.grid) {
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
                if (args.button.command != 'collapseAll') {
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
            $scope.grid.editAction = function () {
                $scope.edit();
                $scope.$digest();
            };
            
        }
      


        $scope.refresh = function () {
            $scope.loadData();
        };

        $(window).resize(function () {
            var height = $("#testCaseQuery .white_box").height();
            var width = $("#testCaseQuery .white_box").width();
            $('#grvTestCaseQuery').height(height - 120);
            $scope.grid.resizeCanvas();
        });

        $(window).resize();
        
        $scope.loadSprint(true);
        $scope.loadProjectMember();

        $timeout(function () {
            $("#startDate").change(function () {
                if ($scope.endDate < $scope.startDate) {
                    $scope.endDate = $scope.startDate;
                }
                $scope.$applyAsync();
            });
            $("#endDate").change(function () {
                if ($scope.endDate < $scope.startDate) {
                    $scope.endDate = $scope.startDate;
                }
                $scope.$applyAsync();

            });
            $scope.loadData();
        });
    });

    // load data
    $scope.loadData = function () {  
        var objectTrans = {
            pid: $scope.menuParams.pid,
            pjid: $scope.menuParams.pjid,
            module: $scope.params.module,
            sprint: $scope.sprint,
            startDate: $scope.startDate,
            endDate: $scope.endDate,
            projectMember: $scope.projectMember,
            search: $scope.searchValue
        }
        var url = 'api/pm/testPlan/GetWorkItems'; 
        $scope.postData(url, objectTrans, function (data) {
            $scope.grid.setData(data);            
        });      
    }

    $scope.loadSprint = function (isFirstLoad) {
        $scope.postNoAsync('api/pm/sprint/GetListIsApprove?pjid=' + $scope.menuParams.pjid, null, function (data) {
            $scope.setting.valuelist.sprint = data;
            if (!isFirstLoad || !$scope.sprint) {
                $scope.currentSprint();
            }
        });
    }

    $scope.loadProjectMember = function () {
        $scope.postNoAsync('api/pm/member/getList?pjid=' + $scope.menuParams.pjid, null, function (data) {
            $scope.setting.valuelist.projectMember = data;
            if (!$scope.projectMember) {
                $scope.projectMember = $scope.authService.user.id;
            }
        });
    }
    $scope.currentSprint = function () {
        $scope.postNoAsync('api/pm/sprint/currentSprint?pjid=' + $scope.menuParams.pjid, null, function (data) {
            if (data) {
                $scope.sprint = data.id;
            }
        });
    }

    // edit
    $scope.edit = function () {
        //if (true) {
        var data = $scope.grid.getCurrentData();
        if (data) {
            $scope.postNoAsync('api/pm/myTaskList/GetWorkItemById?id=' + data.id, null, function (response) {
                if (response) {
                    $scope.params.pid = $scope.pid;
                    $scope.params.pjid = $scope.project;
                    $scope.childScope.workItemForm.dataAction('edit', response);
                }
            });
        }
        else {
            showError($scope.translation.ERR_SELECT_DATA_EDIT);
        }
    };
    // save work item
    $scope.saveWorkItem = function (data) {
        // load data
        $scope.loadData();
    }
    // collapse all
    $scope.collapseAll = function (grid) {
        var array = grid.dataView.getItems().filter(function (x) { return x.hasChild != true; });
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
            //$("#contextMenu").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenu'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenu') + 5}).show();
            $("#contextMenu").css({ "top": (e.pageY - 30) + "px", "left": (e.pageX - 10) + "px" }).show();
        }
    };
}]);