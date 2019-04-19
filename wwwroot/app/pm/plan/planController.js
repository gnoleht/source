'use strict';
app.register.controller('planController', ['$scope', '$location', '$route', '$timeout', function ($scope, $location, $route, $timeout) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.ListIsOpen = [];
        $.ajax({
            url: '/app/pm/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $scope.setting.valuelist = {};
                $scope.setting.listFilter = {};
                $.each(data, function (key, item) {
                    //$scope.setting.valuelist[key] = buildValueList(item);
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
                planSetting.valuelist = $scope.setting.valuelist;
                planSetting.listFilter = $scope.setting.listFilter ? $scope.setting.listFilter : {};
            },
        });

        //get list sprint
        $scope.postNoAsync('api/pm/Sprint/GetAllListSprintByTrue?pid=' + $scope.params.pid + "&pjid=" + $scope.params.pjid, null, function (data) {
            $scope.lstSprintPast = [];
            $scope.lstSprintCurrent = [];
            $scope.lstSprintFuture = [];
            if (data.length > 0)
                $scope.loadListSrpint(data);
        });


        //get list project member
        $scope.postNoAsync('api/pm/Member/GetList?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.projectMember = data;
        });

        if ($scope.grid) {

            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            var url = "api/pm/plan/get?pjid=" + $scope.params.pjid + "&pjType=" + $scope.params.pjType + "&area=" + $scope.params.area;
            $scope.setting.grid.url = url;
            $scope.post(url, null, function (data) {
                //$.each(data, function (index, item) {
                //    if (item.hasChild)
                //        item.isCollapsed = true;
                //});
                //$scope.ListIsOpen = $.map(data, x => x.id)
                $scope.grid.setData(data);
            });
            $scope.grid.onClick.subscribe(function (e, args) {
                $("#contextMenu").hide();
                $("#contextMenuSize").hide();
                $("#contextMenuSprint").hide();
                $("#contextMenuMember").hide();
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

        $scope.refresh = function () {
            $scope.ListIsOpen = [];
            if ($scope.viewMode != "1")
                $scope.reloadGrid();
            else
                $scope.loadGrant();
        };

        $scope.settingGrantChart();

    });

    $scope.gridImportResize = function () {
        $timeout(function () {
            $scope.gridImport.resizeCanvas();
        }, 250);
    };

    $scope.settingGrantChart = function () {
        var url = "api/pm/sprint/getListById";
        var params = {
            pjid: $scope.params.pjid
        }

        $scope.postData(url, params, function (data) {
            $scope.grantParam = {};
            $scope.grantParam.listSprint = data.listSprint;
            $scope.grantParam.startDate = data.startDate;
            $scope.grantParam.endDate = data.endDate;
        });

        //gantt.config.subscales = [
        //    {
        //        unit: "day", step: 14, template: function (date) {
        //            var sprintName = null;
        //            debugger;
        //            $.each($scope.grantParam.listSprint, function (index, sprint) {
        //                var minDate = new Date(sprint.endDate);
        //                var maxDate = new Date(sprint.startDate);

        //                if (minDate.getTime() <= date.getTime() && date.getTime() <= maxDate.getTime()) {
        //                    sprintName = sprint.name;
        //                    return false;
        //                }
        //            });

        //            return sprintName;
        //        }
        //    },
        //];

        gantt.config.scale_unit = 'day';
        gantt.config.step = 1;
        gantt.config.date = "%d";
        gantt.config.xml_date = '%Y-%m-%d';
        gantt.config.date_grid = '%d/%m/%Y';
        gantt.config.grid_width = 500;
        gantt.config.columns = [
            { name: "text", label: "Name", tree: true, width: 350 },
            { name: "start_date", label: "Start", align: "center", width: 100 },
            { name: "duration", label: "Duration", align: "center", width: 50 },
        ];
        gantt.config.start_date = $scope.grantParam.startDate;
        gantt.config.end_date = $scope.grantParam.endDate;

        gantt.config.scale_height = 60;
        gantt.config.task_height = 14;
        gantt.config.row_height = 40;

        gantt.config.order_branch = true;
        gantt.config.order_branch_free = true;

        $(window).resize(function () {
            if (gantt && $scope.viewMode == "1")
                gantt.render();
        });
    };

    $scope.loadGrant = function () {
        try {
            var url = 'api/pm/plan/getForGrant';
            var param = {
                pjid: $scope.params.pjid
            };

            $scope.postData(url, param, function (data) {
                gantt.init('gantt');
                gantt.parse({ data: data[0], collections: { links: [] } }, 'json');
            });
        }
        catch (ex) {
            console.log(ex);
        }
    };

    $scope.changeView = function () {
        if ($scope.viewMode != "1") {
            $scope.viewMode = "1";
            setTimeout(function () {
                $scope.loadGrant();
                $(window).resize();
            }, 300);
        }
        else {
            $scope.viewMode = "0";
            $scope.reloadGrid();
        }
    };

    $scope.collapseAll = function (grid) {
        //$scope.ListIsOpen = [];
        var listHasChild = grid.dataView.getItems().filter(function (x) { return x.hasChild == true; });
        //if (!grid.isShowAll) $scope.ListIsOpen = $.map(listHasChild, x => x.id);

        grid.dataView.beginUpdate();
        $.each(listHasChild, function (index, item) {
            item.isCollapsed = grid.isShowAll;
            grid.dataView.updateItem(item.id, item);
        });
        grid.dataView.endUpdate();
        grid.invalidate();
        grid.isShowAll = !grid.isShowAll;

        //var array = grid.dataView.getItems().filter(function (x) { return x.hasChild == true; });
        //grid.dataView.beginUpdate();
        //$.each(array, function (index, item) {
        //    item.isCollapsed = grid.isShowAll;
        //    grid.dataView.updateItem(item.id, item);
        //});
        //grid.dataView.endUpdate();
        //grid.invalidate();
        //grid.isShowAll = !grid.isShowAll;
    };

    //load list sprint
    $scope.loadListSrpint = function (data) {
        $.each(data, function (inx, val) {
            var currentDate = moment().format("YYYY-MM-DD");
            var endDate = moment(val.endDate).format("YYYY-MM-DD");
            var startDate = moment(val.startDate).format("YYYY-MM-DD");
            var checkPast = moment(currentDate).isAfter(endDate);
            var checkFuture = moment(startDate).isAfter(currentDate);
            if (checkPast)
                $scope.lstSprintPast.push(val);
            if (checkFuture)
                $scope.lstSprintFuture.push(val);
            if (checkPast == false && checkFuture == false)
                $scope.lstSprintCurrent.push(val);
        });
        //$scope.$digest();
    }

    $scope.displayFunction = function () {
        //$("#btnChangeViewGrant").show();
        //$("#btnPlanImport").show();
    };

    $scope.displayTitle = function () {
        toogleProject(true);
    };

    $scope.planImport = function () {
        $scope.showImport();
    }

    $scope.planDetail = function () {
        window.location = "/pm/planDetail?pid=" + $scope.params["pid"] + "&pjid=" + $scope.params["pjid"];
    }

    $(document).click(function (e) {
        var tag = $(e.target);
        if (!tag.hasClass("addChild"))
            $("#contextMenu").hide();

        if (!tag.hasClass("editsize"))
            $("#contextMenuSize").hide();

        if (!tag.hasClass("editsprint"))
            $("#contextMenuSprint").hide();

        if (!tag.hasClass("editmember"))
            $("#contextMenuMember").hide();
    });

    $scope.collapseChild = function (e, args) {
        var dataView = args.grid.dataView;
        if ($(e.target).hasClass("toggle")) {
            var item = dataView.getItem(args.row);
            if (item) {
                if (!item.isCollapsed) {
                    item.isCollapsed = true;
                } else {
                    item.isCollapsed = false;
                }

                dataView.updateItem(item.id, item);
            }
        }
        else
            if (args.grid.name == "grvPlan") {
                if ($(e.target).hasClass("addChild")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        $scope.parentType = item.type;
                        $scope.$applyAsync();
                    }
                    $("#contextMenu").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenu'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenu') + 5 }).show();

                }
                else if ($(e.target).hasClass("editsize")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        $scope.data = item;

                        $("#contextMenuSize").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenuSize'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenuSize') + 5 }).show();
                        //$("#contextMenuSize").css({ "top": (e.pageY + 15) + "px", "left": (e.pageX + 10) + "px" }).show();
                    }
                }
                else if ($(e.target).hasClass("editsprint")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        $scope.data = item;
                        $("#contextMenuSprint").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenuSprint'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenuSprint') + 5 }).show();
                        //$("#contextMenuSprint").css({ "top": (e.pageY + 15) + "px", "left": (e.pageX + 10) + "px" }).show();

                    }
                }
                else if ($(e.target).hasClass("editmember")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        $scope.data = item;
                        $("#contextMenuMember").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenuMember'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenuMember') + 5 }).show();
                        //$("#contextMenuMember").css({ "top": (e.pageY + 15) + "px", "left": (e.pageX + 10) + "px" }).show();

                    }
                };
            }
    };


    $scope.editsize = function (size) {
        $("#contextMenuSize").hide();
        $scope.data.size = size;
        $scope.frmFile.set("data", JSON.stringify($scope.data));
        $scope.postFile('api/pj/' + $scope.data.type + '/update', $scope.frmFile, function (data) {
            //$scope.refreshFrm();
            //data.indent = $scope.data.indent;
            //$scope.grid.dataView.updateItem(data.id, data);
            $scope.reloadGrid();
        });
    };

    $scope.editsprint = function (sprintID) {
        $("#contextMenuSprint").hide();
        $scope.data.sprint = sprintID;
        $scope.frmFile.set("data", JSON.stringify($scope.data));
        $scope.postFile('api/pj/' + $scope.data.type + '/update', $scope.frmFile, function (data) {
            $scope.refreshFrm();
            data.indent = $scope.data.indent;
            $scope.grid.dataView.updateItem(data.id, data);
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
        });
    };

    $scope.add = function (typeAdd) {
        //$scope.$applyAsync(function () {
        //    $scope.loadInclude = true;
        //});

        $scope.action = 'add';
        $scope.listFileUpload = [];
        $scope.data = {};
        $scope.attachments = [];

        $scope.data.type = 'epic';

        $scope.parentItem = null;//noparent

        if (typeAdd != null) {
            var parent = $scope.grid.getCurrentData();
            if (parent) {
                $scope.data.parent = parent.id;
                $scope.data.parentType = parent.type;
                $scope.parentItem = parent;
            }
            $scope.data.type = typeAdd;
            $("#contextMenu").hide();
        }

        var childScope = $scope.childScope["workItemForm"];
        if (childScope)
            childScope.dataAction($scope.action, $scope.data, $scope.parentItem);
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null || data == undefined) {
            showError($scope.translation.ERR_SELECT_DATA_EDIT);
        }
        else {
            $scope.action = 'edit';
            var childScope = $scope.childScope["workItemForm"];
            if (childScope)
                childScope.dataAction($scope.action, data);
        }
    };

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

    $scope.getWorkItemById = function (id) {
        var itemData = {};
        $scope.postData('api/workitem/GetWorkItemById', { id: id }, function (data) {
            itemData = data;
        })
        return itemData;
    }


    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (data == undefined || data == null) {
            showError($scope.translation["ERR_SELECT_DATA_DELETE"]);
            return;
        }
        $scope.data = data;
        $('#modal-confirm').modal();
    };

    $scope.deleteData = function () {
        var childScope = $scope.childScope.workItemForm;
        if (childScope)
            childScope.dataAction('delete', $scope.data);
    };

    $scope.deleteWorkItem = function () {
        var isOpenList = $scope.grid.dataView.getItems().filter(x => !x.isCollapsed);
        $scope.ListIsOpen = $.map(isOpenList, x => x.id);
        $scope.reloadGrid();
    };

    $scope.saveWorkItem = function (data) {
        var isOpenList = $scope.grid.dataView.getItems().filter(x => !x.isCollapsed);
        $scope.ListIsOpen = $.map(isOpenList, x => x.id);
        $scope.reloadGrid();
    };

    $scope.reloadGrid = function () {
        $scope.postData($scope.setting.grid.url, null, function (data) {
            if (data) {
                $.each(data, function (index, item) {
                    item.isCollapsed = item.hasChild;
                    if ($scope.ListIsOpen.length > 0 && $scope.ListIsOpen.indexOf(item.id) != -1) {
                        item.isCollapsed = false;
                    }
                });
                $scope.grid.setData(data);
            }
        });
    };

    // import workitem
    $scope.showImport = function () {
        callModal('modal-import');
        $scope.setting.gridChild.gridImport.url = 'api/pm/plan/GetWorkItemImport?pid=' + $scope.params.pid + "&pjType=" + $scope.params.pjType;
        $scope.totalWI = [];
        $scope.selectWI = [];
        $scope.curentSelected = [];
        $scope.unSelectWI = [];
        if ($scope.gridImport == null) {
            initSlickGrid($scope, 'gridImport');
            $scope.gridImport.editAction = function () { };

            $scope.gridImport.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.gridImport.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.gridImport.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("checkWI")) {
                    var item = $scope.gridImport.dataView.getItem(args.row);
                    $scope.checkWorkItem(item);
                }
                else {
                    $scope.collapseChild(e, args, 'gridImport');
                }
            });

            $scope.gridImport.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command == 'checkAll') {
                    if (!args.grid.isCheckAll) {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-checkbox";
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-checkbox-empty";
                    }
                    args.grid.isCheckAll = !args.grid.isCheckAll;
                    $scope.checkAllWorkItem(args.grid);
                };
            });
        }
        $scope.inProject = false;
        $scope.loadGridImport();

    };

    $scope.inProjectClick = function () {
        $scope.inProject = !$scope.inProject;
        $scope.loadGridImport()
    }
    $scope.loadGridImport = function () {
        var params = {
            pid: $scope.params.pid,
            pjid: $scope.params.pjid,
            inProject: $scope.inProject,
            pjType: $scope.params.pjType,
            area: $scope.params.area
        };
        $scope.postData('api/pm/plan/GetWorkItemImport', params, function (data) {
            $scope.totalWI = data.items.map(x => x.id);
            //$scope.curentDeployRelate = angular.copy(data.deployRelate);
            if ($scope.params.pjType != "2") {
                $.each(data.items, function (index, item) {
                    if (item.projectId == $scope.params.pjid || item.projectId == null || item.projectId.length == 0) {
                        if (item.projectId == $scope.params.pjid) {
                            $scope.selectWI.push(item.id);
                            $scope.curentSelected.push(item.id);
                            item.isCheck = true;
                        }
                    }
                    else if (item.projectRelated != null) item.otherProject = true;
                });
            }
            else {
                $.each(data.items, function (index, item) {
                    if (data.deployRelate.indexOf(item.id) != -1) {
                        $scope.selectWI.push(item.id);
                        $scope.curentSelected.push(item.id);
                        item.isCheck = true;
                    }
                });
            }
            $scope.gridImport.setData(data.items);
            if ($scope.totalWI.length == $scope.selectWI.length) {
                $('#gridImport .slick-header-button:first').attr('class', 'slick-header-button bowtie-icon bowtie-checkbox');
                $scope.gridImport.isCheckAll = true;
            }
            else $('#gridImport .slick-header-button:first').attr('class', 'slick-header-button bowtie-icon bowtie-checkbox-empty');
        });
    };

    $scope.checkWorkItem = function (item) {
        if (item.isCheck) {
            $scope.selectWI.splice($.inArray(item.id, $scope.selectWI), 1);
            if ($scope.curentSelected.indexOf(item.id) != -1) $scope.unSelectWI.push(item.id);
            $('#gridImport .slick-header-button:first').attr('class', 'slick-header-button bowtie-icon bowtie-checkbox-empty');
            $scope.gridImport.isCheckAll = false;
            item.isCheck = false;
        }
        else {
            $scope.selectWI.push(item.id);

            if ($scope.curentSelected.indexOf(item.id) != -1) $scope.unSelectWI.splice($.inArray(item.id, $scope.unSelectWI), 1);

            if ($scope.totalWI.length == $scope.selectWI.length) {
                $('#gridImport .slick-header-button:first').attr('class', 'slick-header-button bowtie-icon bowtie-checkbox');
                $scope.gridImport.isCheckAll = true;
            }
            item.isCheck = true;
        }
        $scope.gridImport.dataView.updateItem(item.id, item);
    };

    $scope.checkAllWorkItem = function (grid) {
        var gridImportData = grid.dataView.getItems();
        if (grid.isCheckAll == true) {
            $.each(gridImportData, function (index, item) {
                if (!item.isCheck) {
                    item.isCheck = true;
                }
            });
            $scope.gridImport.setData(gridImportData);
            $scope.selectWI = angular.copy($scope.totalWI);
            $scope.unSelectWI = [];
        }
        else {
            $.each(gridImportData, function (index, item) {
                if (item.isCheck) {
                    item.isCheck = false;
                    $scope.unSelectWI.push(item.id);
                }
            });
            $scope.gridImport.setData(gridImportData);
            $scope.selectWI = [];
        }
    };

    $scope.saveImport = function () {
        $scope.ListIsOpen = [];
        $.each($scope.curentSelected, function (index, item) {
            if ($scope.selectWI.indexOf(item) != -1) $scope.selectWI.splice($scope.selectWI.indexOf(item), 1);
        });

        var params = {
            pjid: $scope.params.pjid,
            pjType: $scope.params.pjType,
            area: $scope.params.area,
            listImportId: $scope.selectWI,
            listRemoveImportId: $scope.unSelectWI,
        };
        $scope.postData("api/pm/plan/projectImport", params, function (data) {
            $('#modal-import').modal('toggle');
            $scope.reloadGrid();
        });

    }

}]);
