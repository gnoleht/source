'use strict';
app.register.controller('testRunController', ['$scope', '$timeout', function ($scope, $timeout) {
    //display function
    $scope.displayFunction = function () {
        $scope.button.add = true;
        $scope.button.delete = true;
        $scope.button.edit = false;
        $scope.button.search = false;
        $scope.button.save = false;
        $scope.button.refresh = true;
        $scope.button.copy = true;

        $scope.collapsed = true;

        //$("#btnRunTest").show();
        //$("#btnAddExisting").show();
        //$("#btnEditDetail").show();
    };

    $('#myTab a').on('click', function (e) {
        e.preventDefault();
        $('#myTab a').each(function () {
            $(this).removeClass('active');
        });
        $(this).tab('show');
    });

    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        // load data
        $.ajax({
            url: '/app/pm/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!$scope.setting.listFilter) $scope.setting.listFilter = {};
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
            }
        });
        $scope.postNoAsync('api/sys/user/getlist', null, function (data) {
            $scope.setting.valuelist.user = data;
        });

        $scope.postNoAsync('api/pm/testPlan/GetListTestSuites?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.testSuite = data.lstData;

            if ($scope.currentTestSuiteId && data.lstData.map(r => r.id).indexOf($scope.currentTestSuiteId) != -1) {
                $scope.currentTestSuite = data.lstData.find(x => x.id == $scope.currentTestSuiteId);
            } else {
                if (data.currentTestSuite) {
                    $scope.currentTestSuite = data.currentTestSuite;
                    $scope.currentTestSuiteId = data.currentTestSuite.id;
                }
                else $scope.currentTestSuiteId = null;
            }

            //if (data.currentTestSuite) {
            //    $scope.currentTestSuite = data.currentTestSuite;
            //    if (!$scope.currentTestSuiteId) $scope.currentTestSuiteId = data.currentTestSuite.id;
            //}

            $scope.setting.valuelist.buildList = data.lstBuild;
            if (data.lstBuild != null && data.currentBuildList != null) {
                $scope.currentBuildList = data.currentBuildList;
                $scope.currentBuildListId = data.currentBuildList.id;
            }
        });
        testRunSetting = $scope.setting;

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
                $scope.viewList(e, args);
            });

            //This works for me:

            $scope.grid.setSelectionModel(new Slick.RowSelectionModel());

            //onSelectedRowsChanged event, if row number was changed call some function.
            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                $scope.buildChanged();
            });

            $scope.grid.editAction = function () { };

            $scope.loadPBL();
        };

        if ($scope.grvTestPlan == null) {
            initSlickGrid($scope, 'grvTestPlan');

            $scope.grvTestPlan.onSelectedRowsChanged.subscribe(function (e, args) {
                var selectedItem = $scope.grvTestPlan.getDataItem($scope.grvTestPlan.getSelectedRows([0]));
                $scope.testPlanChanged(selectedItem);
                $scope.testPlanSelectedItem = selectedItem;
            });

            $scope.grvTestPlan.editAction = function (grid, data) {
                $scope.editDetail();
            };
        };

        if ($scope.grvTestResults == null) {
            initSlickGrid($scope, 'grvTestResults');

            $scope.grvTestResults.editAction = function (grid, data) {
                $scope.editTestResult($scope.grvTestResults);
            };
        };

        $scope.refresh = function () {
            var selectedItem = $scope.grvTestPlan.getDataItem($scope.grvTestPlan.getSelectedRows([0]));
            $scope.testPlanChanged(selectedItem);
        };

        //Split(['#grvTestPlanWrapper', '#grvTestResultsWrapper'], {
        //    sizes: [65, 35],
        //    minSize: 200,
        //    direction: 'vertical',
        //    onDragEnd: function () {
        //        if ($scope.grvTestPlanWrapper)
        //            $scope.grvTestPlanWrapper.resizeCanvas();
        //        if ($scope.grvTestResultsWrapper)
        //            $scope.grvTestResultsWrapper.resizeCanvas();
        //    }
        //});

        // resize
        //    $(window).resize(function () {
        //        var height = $("#testRun .white_box").height();
        //        var width = $("#testRun .white_box").width();

        //        $('#grvPBL').height(height - 138);
        //        $('#grvTestPlan').height((height - 155) / 3 * 2);
        //        $('#grvTestResults').height((height - 155) / 3 + 11);

        //        $('#panelTree').height($('.tab-content').height() - 20);

        //        $('#runTestModal .testcase-list').css('max-height', $(window).height() - 337);

        //        if ($scope.grid)
        //            $scope.grid.resizeCanvas();

        //        if ($scope.grvTestPlan)
        //            $scope.grvTestPlan.resizeCanvas();

        //        if ($scope.grvTestResults)
        //            $scope.grvTestResults.resizeCanvas();
        //    });

        //    $(window).resize();
    });

    // display title
    $scope.displayTitle = function () {
        $scope.toogleTitle.area = false;
        toogleProject(true);
    };

    $scope.collapseLeft = function () {
        $scope.collapsed = !$scope.collapsed;
    };

    // get list test plan
    $scope.loadPBL = function () {
        $scope.$parent.$parent.currentTestSuiteId = $scope.currentTestSuiteId;
        $scope.post('api/pm/testPlan/GetPBL?id=' + $scope.currentTestSuiteId, null, function (data) {
            $scope.grid.setData(data.lstPBL);
            $scope.lstPBL = data.lstPBL;
            $scope.currentTestSuite = data.currentTestSuite;
            $scope.grid.setSelectedRows([0]);

            $("#grvPBL .slick-row :first").click();
        });
    };

    // build Changed
    $scope.buildChanged = function () {
        if ($scope.setting.valuelist.buildList != null) {
            $.each($scope.setting.valuelist.buildList, function (index, item) {
                if (item.id == $scope.currentBuildListId) {
                    $scope.currentBuildList = item;
                    return false;
                }
            });
        }

        var selectedItem = $scope.grid.getDataItem($scope.grid.getSelectedRows([0]));
        $scope.pBLChanged(selectedItem);
    };

    // PBL Changed
    $scope.pBLChanged = function (newItem) {
        if (!$scope.grvTestPlan)
            initSlickGrid($scope, 'grvTestPlan');

        if (!$scope.grvTestResults)
            initSlickGrid($scope, 'grvTestResults');

        if (newItem) {
            $scope.currentPBL = newItem;
            $scope.arrKeys = [];
            $scope.arrKeys.push(newItem.id);
            $scope.getChild(newItem.id);

            $scope.post('api/pm/testPlan/getTestPlan?id=' + JSON.stringify($scope.arrKeys)
                + "&pjid=" + $scope.params.pjid
                + "&buildId=" + $scope.currentBuildListId, null, function (data) {
                    if (data) {
                        $scope.grvTestPlan.setData(data);
                        $scope.grvTestPlan.setSelectedRows([0]);
                        $("#grvTestPlan .slick-row :first").click();
                    }
                    else {
                        $scope.grvTestPlan.setData([]);
                        $scope.grvTestResults.setData([]);
                    }
                });
        }
        else {
            $scope.grvTestPlan.setData([]);
            $scope.grvTestResults.setData([]);
        }
    };

    //Lấy danh sách ID con của PBL
    $scope.getChild = function (parentID) {
        $.each($scope.lstPBL, function (index, item) {
            if (item.parent == parentID) {
                $scope.arrKeys.push(item.id);
                $scope.getChild(item.id);
            }
        });
    };

    $scope.testPlanChanged = function (newItem) {
        if (newItem) {
            var id = newItem.no == 0 ? null : newItem.id;

            $scope.post('api/pm/testPlan/getBugTestResults?id=' + id + "&buildId=" + $scope.currentBuildListId, null, function (data) {
                if (data)
                    $scope.grvTestResults.setData(data);
                else
                    $scope.grvTestResults.setData([]);
            });
        }
        else {
            $scope.grvTestResults.setData([]);
        }
    };

    $scope.viewList = function (e, args) {
        $scope.abc = !$scope.abc;
        if (e == null) {
            args = $scope;
            $scope.collapseAll(args.grid);
            return;
        }

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
    };

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
    };

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

    //run after save from workItemForm
    $scope.saveWorkItem = function (data) {
        if (data.type == 'testCase') {
            if ($scope.action == 'edit') {
                var oldData = $scope.grvTestPlan.getCurrentData();
                data.outcome = oldData.outcome;
                $scope.grvTestPlan.dataView.updateItem(data.id, data);
            } else {
                $scope.selectWI = [];
                $scope.selectWI.push(data);
                $scope.saveImport();
            }
        }
        else {
            var params = {
                data: $scope.selectedItem,
                id: data.id,
                buildId: $scope.currentBuildListId
            };

            $scope.postData("api/pm/testPlan/updateBugToTestPlan", params, function (data) {
                showSuccess($scope.translation.SUCCESS_SAVE_DATA);
            });
            $scope.testPlanChanged($scope.testPlanSelectedItem);
        }
    };

    $scope.saveRuntest = function (data) {
        $scope.grvTestPlan.dataView.updateItem(data.id, data);
        //$scope.testPlanChanged(data);
    };

    $scope.add = function () {
        $scope.data = {};
        $scope.data.type = 'testCase';
        $scope.data.sprint = $scope.currentTestSuite.sprintId;

        $scope.action = 'add';

        $scope.data.productId = $scope.params.pid;
        $scope.data.projectId = $scope.params.pjid;
        $scope.data.changeLevel = "4";
        $scope.data.related = $scope.currentPBL.id;
        $scope.data.testingType = "systemTesting";
        $scope.data.assign = $scope.loginInfo.id;
        $scope.data.sprint = $scope.currentTestSuite.sprintId;
        $scope.data.sprintName = $scope.currentTestSuite.sprintName;

        //$scope.relatedItem = $scope.currentPBL;

        //$("#contextMenu").hide();
        var relatedItem = {
            //relatedId: $scope.data.id,
            refRelatedId: $scope.currentPBL.id,
            type: 'test',
            entityType: "PM_WorkItem",
            data: $scope.currentPBL
        }
        var related = { test: [relatedItem] };

        $scope.childScope.workItemForm.dataAction($scope.action, $scope.data, null, related);
        //$(window).resize();
    };

    $scope.editDetail = function () {
        $scope.$applyAsync(function () {
            var data = $scope.grvTestPlan.getCurrentData();
            if (data.outcome.toLowerCase() !== 'notrun' && !$scope.selectedItem.hasChild) { showWarning($scope.translation.WRN_CAN_NOT_EDIT_PASS_OR_FAILE); return; }
            if (data == null || data == undefined || data.no == 0) {
                showWarning($scope.translation.WRN_SELECT_DATA_EDIT);
            }
            else {
                var childScope = $scope.childScope['workItemForm'];
                if (childScope == null) return;
                $scope.data = data;
                $scope.data.state = 'notRun';//toLowerFirstLetter(data.outcome);//
                $scope.data.sprintName = $scope.currentTestSuite.sprintName;
                $scope.action = 'edit';
                childScope.dataAction($scope.action, data);
            }
        });
    };

    $scope.copy = function () {
        if ($scope.grid != null) {
            var data = $scope.grvTestPlan.getCurrentData();
            if (!data || !data.no) {
                showWarning($scope.translation.WRN_SELECT_DATA_COPY);
                return;
            }

            $scope.action = 'add';

            $scope.data = angular.copy(data);
            $scope.data.type = 'testCase';

            $scope.data.related = $scope.currentPBL.id;

            $scope.data.id = null;
            $scope.data.no = null;
            $scope.data.reason = null;
            $scope.data.state = 'new';
            $scope.data.priority = '3-Normal';
            $scope.data.risk = 'Medium';
            $scope.data.changeLevel = "4";

            $scope.data.actualStartDate = null;
            $scope.data.actualEndDate = null;
            $scope.data.actualDuration = null;
            $scope.data.planStartDate = null;
            $scope.data.planEndDate = null;
            $scope.data.planDuration = null;
            //$scope.data.related = $scope.currentPBL.id;
            //$scope.data.testingType = "systemTesting";
            //$scope.data.assign = $scope.loginInfo.id;
            $scope.data.sprint = $scope.currentTestSuite.sprintId;
            $scope.data.sprintName = $scope.currentTestSuite.sprintName;
            //$scope.relatedItem = $scope.currentPBL;

            //$("#contextMenu").hide();

            var relatedItem = {
                //relatedId: $scope.data.id,
                refRelatedId: $scope.currentPBL.id,
                type: 'test',
                entityType: "PM_WorkItem",
                data: $scope.currentPBL
            }
            var related = { test: [relatedItem] };

            $scope.childScope.workItemForm.dataAction($scope.action, $scope.data, null, related);
            $(window).resize();
        }
    };

    $scope.delete = function () {
        $scope.data = $scope.grvTestPlan.getCurrentData();
        $scope.action = 'delete';

        if (!$scope.data || !$scope.data.no) {
            showWarning($scope.translation["WRN_SELECT_DATA_DELETE"]);
        }
        else {
            if ($scope.data.outcome.toLowerCase() !== 'notrun') { showWarning($scope.translation.WRN_CAN_NOT_DELETE_PASS_OR_FAILE); }
            else $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        if ($scope.action == 'delete') {
            var childScope = $scope.childScope.workItemForm;
            if (childScope)
                childScope.dataAction('delete', $scope.data);
        }
        else {
            var selectedItem = $scope.grvTestPlan.getDataItem($scope.grvTestPlan.getSelectedRows([0]));

            if ($scope.data != undefined && $scope.data != null && $scope.data != {}) {
                $scope.post('api/pm/testPlan/updateRunTest?parentId=' + selectedItem.id + "&buildId=" + $scope.currentBuildListId + "&id=" + $scope.data.id, null, function () {
                    $scope.testPlanChanged(selectedItem);
                });
            }
        }
    };

    $scope.deleteWorkItem = function () {
        var selectedItem = $scope.grid.getDataItem($scope.grid.getSelectedRows([0]));
        $scope.pBLChanged(selectedItem);
    };

    // import test Plan
    $scope.addExisting = function () {
        if (!$scope.currentTestSuite) {
            showWarning($scope.translation.ERR_SELECT_DATA_IMPORT);
            return;
        }

        callModal('modal-import');
        $scope.totalWI = [];
        $scope.selectWI = [];

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

        //loadGridImport
        $scope.arrKeys = [];
        $scope.arrKeys.push($scope.currentPBL.id);

        var params = {
            pjid: $scope.params.pjid,
            id: JSON.stringify($scope.arrKeys),
            buildId: $scope.currentBuildListId
        };

        $scope.postData('api/pm/testPlan/getTestPlanImport', params, function (data) {
            $scope.totalWI = data;

            if ($scope.params.pjType != "2") {
                $.each(data, function (index, item) {
                    if (item.projectId == $scope.params.pjid || item.projectId == null || item.projectId.length == 0) {
                        if (item.projectId == $scope.params.pjid) {
                            $scope.selectWI.push(item);
                            item.isCheck = true;
                        }
                    }
                });
            }
            else {
                $.each(data, function (index, item) {
                    $scope.selectWI.push(item);
                    item.isCheck = true;
                });
            }

            $scope.gridImport.setData(data);
            if ($scope.totalWI.length == $scope.selectWI.length) {
                $('#gridImport .slick-header-button:first').attr('class', 'slick-header-button bowtie-icon bowtie-checkbox');
                $scope.gridImport.isCheckAll = true;
            }
            else $('#gridImport .slick-header-button:first').attr('class', 'slick-header-button bowtie-icon bowtie-checkbox-empty');
        });
        //end

    };

    $scope.checkWorkItem = function (item) {
        if (item.isCheck) {
            $scope.selectWI.splice($.inArray(item, $scope.selectWI), 1);
            
            $('#gridImport .slick-header-button:first').attr('class', 'slick-header-button bowtie-icon bowtie-checkbox-empty');
            $scope.gridImport.isCheckAll = false;
            item.isCheck = false;
        }
        else {
            $scope.selectWI.push(item);

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
        var params = {
            lstImports: $scope.selectWI,
            buildId: $scope.currentBuildListId
        };

        $scope.postData("api/pm/testPlan/testPlanImport", params, function (data) {
            $('#modal-import').modal('hide');
            var selectedItem = $scope.grid.getDataItem($scope.grid.getSelectedRows([0]));
            $scope.pBLChanged(selectedItem);
        });
    };
    // end import

    $scope.executeFunction = function () {
        $scope.selectedItem = $scope.grvTestPlan.getDataItem($scope.grvTestPlan.getSelectedRows([0]));
        if ($scope.selectedItem.outcome.toLowerCase() !== 'notrun' && !$scope.selectedItem.hasChild) { showWarning($scope.translation.WRN_CAN_NOT_RUN_PASS_OR_FAILE); }
        else if (!$scope.selectedItem.hasChild)
            $scope.childScope['testRunForm'].dataAction($scope.selectedItem, $scope.currentBuildListId);
        else
        {
            showWarning($scope.translation.WRN_SELECT_DATA_RUN);
        }
        //$(window).resize();
    };

    $scope.editTestResult = function (grid) {
        $scope.$applyAsync(function () {
            if (grid == null)
                grid = $scope.grvTestResults;

            var data = grid.getCurrentData();
            if (data == null || data == undefined) {
                showWarning($scope.translation.WRN_SELECT_DATA_EDIT);
            }
            else {
                var childScope = $scope.childScope['workItemForm'];
                if (childScope == null) return;

                $scope.data = data;
                $scope.data.sprintName = $scope.currentTestSuite.sprintName;
                $scope.action = 'edit';
                childScope.dataAction($scope.action, data);
            }
        });
    };

    //delete Test Result
    $scope.deleteTestResult = function () {
        $scope.data = $scope.grvTestResults.getCurrentData();
        $scope.action = 'deleteTestResult';

        if ($scope.data == null) {
            showWarning($scope.translation["WRN_SELECT_DATA_DELETE"]);
        }
        else {
            $('#modal-confirm').modal();
        }
    };
}]);