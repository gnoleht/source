'use strict';
app.register.controller('testPlanController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.lstIdUserstory = [];
    //display function
    $scope.displayFunction = function () {
        //$scope.button.add = true;
        //$scope.button.delete = true;
        //$scope.button.edit = true;
        $scope.button.search = false;
        $scope.button.save = false;
        $scope.button.refresh = true;
        //$scope.button.copy = true;

        $scope.collapsed = true;

        $("#btnEditDetail").show();
    };

    $('#myTab a').on('click', function (e) {
        e.preventDefault();
        $('#myTab a').each(function () {
            $(this).removeClass('active');
        });
        $(this).tab('show');
    });

    $scope.GetListTestSuites = function () {
        $scope.postData('api/pm/testPlan/GetListTestSuites?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.testSuite = data.lstData;
            var lstSprId = data.lstData.map(r => r.sprintId);
            $scope.setting.valuelist.cmbSprint = $scope.setting.valuelist.cmbSprint.filter(x => !lstSprId.includes(x.id));
        });
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        // load data
        //$scope.postNoAsync('api/sys/user/getlist', null, function (data) {
        //    $scope.setting.valuelist.user = data;
        //});
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
        testPlanSetting.valuelist = $scope.setting.valuelist;
        testPlanSetting.listFilter = $scope.setting.listFilter;

        $scope.postNoAsync('api/pm/sprint/getList?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.cmbSprint = data;
        });

        $scope.postNoAsync('api/pm/testPlan/GetListTestSuites?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.testSuite = data.lstData;
            
            var lstSprId = data.lstData.map(r => r.sprintId);
            $scope.setting.valuelist.cmbSprint = $scope.setting.valuelist.cmbSprint.filter(x => !lstSprId.includes(x.id));

            if ($scope.currentTestSuiteId && data.lstData.map(r => r.id).indexOf($scope.currentTestSuiteId) != -1) {
                $scope.currentTestSuite = data.lstData.find(x => x.id == $scope.currentTestSuiteId);// data.currentTestSuite;
                //$scope.currentTestSuiteId = data.currentTestSuite.id;
            } else {
                if (data.currentTestSuite) {
                    $scope.currentTestSuite = data.currentTestSuite;
                    $scope.currentTestSuiteId = data.currentTestSuite.id;
                }
                else $scope.currentTestSuiteId = null;
            }

            // for chart
            if (data.lstBuild != null && data.currentBuildList != null) {
                $scope.currentBuildListId = data.currentBuildList.id;
            }
        });

        setSelectedMenu("testPlan");

        if ($scope.grid != null && $scope.grid != undefined) {
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
                //$("#contextMenu").hide();
                //$("#contextMenuMain").hide();
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
                var selectedItem = $scope.grid.getDataItem($scope.grid.getSelectedRows([0]));
                $scope.pBLChanged(selectedItem);
            });

            $scope.grid.editAction = function () { };

            $scope.loadPBL();
        }

        $scope.refresh = function () {
            //var selectedItem = $scope.grvTestPlan.getDataItem($scope.grvTestPlan.getSelectedRows([0]));
            //$scope.testPlanChanged(selectedItem);
            $scope.loadPBL();
        };

        // resize
        //$(window).resize(function () {
        //    var height = $("#testPlan .white_box").height();
        //    var width = $("#testPlan .white_box").width();

        //    $('#panelTree .tab-content').height(height - 96);
        //    $('#grvPBL').height(height - 138);
        //    $('#grvTestPlan').height((height - 155) / 3 * 2);
        //    $('#grvTestResults').height((height - 155) / 3 + 10);

        //    if ($scope.grid)
        //        $scope.grid.resizeCanvas();

        //    if ($scope.grvTestPlan)
        //        $scope.grvTestPlan.resizeCanvas();

        //    if ($scope.grvTestResults)
        //        $scope.grvTestResults.resizeCanvas();

        //    // tab chart
        //    $("#content_scroll").height($('#panelTree .tab-content').height());
        //});

        //$(window).resize();
        //// set scroll tab chart
        //SetPerfectScroll("content_scroll");
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
            if (data != null) {
                $scope.grid.setData(data.lstPBL);
                $scope.lstPBL = data.lstPBL;
                $scope.currentTestSuite = data.currentTestSuite;

                //$scope.grid.setSelectedRows([0]);
                $("#grvPBL .slick-row :first").click();  
                $scope.grid.selectedRow(0);
            }
        });
    };

    // PBL Changed
    $scope.pBLChanged = function (newItem) {
        if (!$scope.grvTestPlan) {
            initSlickGrid($scope, 'grvTestPlan');

            $scope.grvTestPlan.editAction = function (grid, data) {
                $scope.editDetail();
            };

            $scope.grvTestPlan.onSelectedRowsChanged.subscribe(function (e, args) {
                $('#sprint-task-list').select2();
                var selectedItem = $scope.grvTestPlan.getDataItem($scope.grvTestPlan.getSelectedRows([0]));
                $scope.testPlanChanged(selectedItem);
                $('#sprint-task-list').select2();
            });
        }

        if (!$scope.grvTestResults) {
            initSlickGrid($scope, 'grvTestResults');
            $scope.grvTestResults.editAction = function () { };
        }

        if (newItem) {
            $scope.currentPBL = newItem;
            $scope.arrKeys = [];
            $scope.arrKeys.push(newItem.id);
            $scope.getChild(newItem.id);

            // list id user story for chart
            $scope.lstIdUserstory = [];
            if (newItem.type == "userstory")
                $scope.lstIdUserstory.push(newItem.id);
            $scope.getChildUserStory(newItem.id);

            // get data
            $scope.postData('api/pm/testPlan/getTestPlan?id=' + JSON.stringify($scope.arrKeys) + "&pjid=" + $scope.params.pjid, null, function (data) {
                $scope.grvTestPlan.setData(data);
                $scope.grvTestPlan.selectedRow(0);
                //$("#grvTestPlan .slick-row :first").click();  

                // create chart
                $scope.createChart();
            });

            $timeout(function () {
                $(window).resize();
            });
        }
        else {
            var data = [];
            $scope.grvTestPlan.setData(data);
            $scope.grvTestResults.setData(data);
        }
    };

    // add Test Suite
    $scope.addTestSuite = function (newItem) {
        $scope.sprint = '';

        callModal('testSuiteModal', true, 'cmbWorkSprint');
    };

    // create Test Suite
    $scope.createTestSuite = function () {
        // get data
        if ($scope.sprint && $scope.sprint.length > 0) {
            $scope.post('api/pm/testPlan/createTestSuite?sprint=' + JSON.stringify($scope.sprint) + "&pjid=" + $scope.params.pjid, null, function (data) {
                $scope.setting.valuelist.testSuite = data.lstTestSuite;
                if (data.currentTestSuite) {
                    $scope.currentTestSuite = data.currentTestSuite;
                    $scope.currentTestSuiteId = data.currentTestSuite.id;
                }
                $scope.GetListTestSuites();
            });
        }
        $('#testSuiteModal').modal('hide');
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

    //Lấy danh sách ID là user story
    $scope.getChildUserStory = function (parentID) {
        $.each($scope.lstPBL, function (index, item) {
            if (item.parent == parentID) {
                if (item.type == "userstory")
                    $scope.lstIdUserstory.push(item.id);
                $scope.getChildUserStory(item.id);
            }
        });
    };

    $scope.testPlanChanged = function (newItem) {
        if (newItem) {
            var id = newItem == null ? null : newItem.id;
            $scope.postData('api/pm/testPlan/getTestResults?id=' + id, null, function (data) {
                $scope.grvTestResults.setData(data);
            });
        }
        else {
            var data = [];
            $scope.grvTestResults.setData(data);
            $scope.grvTestResults.render();
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

    // import workitem
    $scope.showImport = function () {
        if (!$scope.currentTestSuite) {
            showError($scope.translation.ERR_SELECT_DATA_IMPORT);
            return;
        }

        callModal('modal-import');
        $scope.totalWI = [];
        $scope.selectWI = [];
        $scope.unSelectWI = [];
        $scope.curentSelected = [];

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
                        //args.grid.updateColumnHeader(args.column.id);
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-checkbox-empty";
                        //args.grid.updateColumnHeader(args.column.id);
                    }
                    args.grid.isCheckAll = !args.grid.isCheckAll;
                    $scope.checkAllWorkItem(args.grid);
                };
            });
        }

        //loadGridImport
        var params = {
            pjid: $scope.params.pjid
        };

        $scope.postData('api/pm/testPlan/getTestSuiteImport', params, function (data) {
            $scope.totalWI = data.items.map(x => x.id);

            $.each(data.items, function (index, item) {
                if ($scope.currentTestSuite.workItems != null && $scope.currentTestSuite.workItems.indexOf(item.id) != -1) {
                    $scope.selectWI.push(item.id);
                    $scope.curentSelected.push(item.id);
                    item.isCheck = true;
                }
            });

            $scope.gridImport.setData(data.items);
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
        $.each($scope.curentSelected, function (index, item) {
            if ($scope.selectWI.indexOf(item) != -1) $scope.selectWI.splice($scope.selectWI.indexOf(item), 1);
        });

        var params = {
            testSuite: $scope.currentTestSuite,
            lstImportId: $scope.selectWI,
            lstRemoveImportId: $scope.unSelectWI
        };

        $scope.postData("api/pm/testPlan/testSuiteImport", params, function (data) {
            $('#modal-import').modal('toggle');
            $scope.loadPBL();
        });
    };

    //run after save from workItemForm
    $scope.saveWorkItem = function (data) {
        if ($scope.action == 'edit') {
            $scope.grvTestPlan.dataView.updateItem(data.id, data);
        }
        else {
            var selectedItem = $scope.grid.getDataItem($scope.grid.getSelectedRows([0]));
            $scope.pBLChanged(selectedItem);
        }
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

        $scope.relatedItem = $scope.currentPBL;

        //$("#contextMenu").hide();

        var relatedItem = {
            //relatedId: $scope.data.id,
            refRelatedId: $scope.relatedItem.id,
            type: 'test',
            entityType: "PM_WorkItem",
            data: $scope.relatedItem
        }
        var related = { test: [relatedItem] };

        $scope.childScope.workItemForm.dataAction($scope.action, $scope.data, null, related);
        //$(window).resize();
    };
    
    $scope.editDetail = function () {
        $scope.$applyAsync(function () {
            var data = $scope.grvTestPlan.getCurrentData();
            if (data == null || data == undefined) {
                showError($scope.translation.ERR_SELECT_DATA_EDIT);
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
    $scope.edit = $scope.editDetail;

    $scope.copy = function () {
        if ($scope.grvTestPlan != null) {
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

            $scope.data.sprint = $scope.currentTestSuite.sprintId;
            $scope.data.sprintName = $scope.currentTestSuite.sprintName;

            if (!isNullOrEmpty($scope.data.related)) {
                var relatedItemGrid = $scope.grid.dataView.getItemById($scope.data.related);
                $scope.relatedItem = relatedItemGrid ? angular.copy(relatedItemGrid) : $scope.getWorkItemById($scope.data.related);
            }

            //$("#contextMenu").hide();
            var relatedItem = {
                //relatedId: $scope.data.id,
                refRelatedId: $scope.relatedItem.id,
                type: 'test',
                entityType: "PM_WorkItem",
                data: $scope.relatedItem
            }
            var related = { test: [relatedItem] };

            $scope.childScope.workItemForm.dataAction($scope.action, $scope.data, null, related);
            $(window).resize();
        }
    };

    $scope.delete = function () {
        $scope.data = $scope.grvTestPlan.getCurrentData();
        if (!$scope.data || !$scope.data.no) {
            showWarning($scope.translation["WRN_SELECT_DATA_DELETE"]);
        }
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        var childScope = $scope.childScope.workItemForm;
        if (childScope)
            childScope.dataAction('delete', $scope.data);
    };

    $scope.deleteWorkItem = function () {
        var selectedItem = $scope.grid.getDataItem($scope.grid.getSelectedRows([0]));
        $scope.pBLChanged(selectedItem);
    };

    //------------ chart -------------
    // chart color
    window.chartColors = {
        new: 'rgb(153, 153, 153)',
        active: 'rgb(3, 169, 244)',
        resolved: 'rgb(248, 152, 29)',
        closed: 'rgb(48, 185, 143)',
        notRun: 'rgb(255, 224, 131)',
        passed: 'rgb(48, 185, 143)',
        failed: 'rgb(239, 68, 56)',
        inProgress: 'rgb(3, 169, 244)',
        blocked: 'rgb(0, 0, 0)'
    };

    // create chart
    $scope.createChart = function () {
        // create chart1
        $scope.createChart1();
        // create chart2
        $scope.createChart2();
        // create chart3
        $scope.createChart3();
    };

    // create chart1
    $scope.createChart1 = function () {
        var data = $scope.grvTestPlan.dataView.getItems();
        var valueNew = data.filter(x => x.state == 'new').length;
        var valueNotRun = data.filter(x => x.state == 'notRun').length;
        var valuePassed = data.filter(x => x.state == 'passed').length;
        var valueFailed = data.filter(x => x.state == 'failed').length;
        var valueInProgress = data.filter(x => x.state == 'inProgress').length;
        var valueBlocked = data.filter(x => x.state == 'blocked').length;

        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [
                        valueNew,
                        valueNotRun,
                        valuePassed,
                        valueFailed,
                        valueInProgress,
                        valueBlocked
                    ],
                    backgroundColor: [
                        window.chartColors.new,
                        window.chartColors.notRun,
                        window.chartColors.passed,
                        window.chartColors.failed,
                        window.chartColors.inProgress,
                        window.chartColors.blocked
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    'New',
                    'Not Run',
                    'Passed',
                    'Failed',
                    'In Progress',
                    'Blocked'
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: true,
                    position: 'bottom',
                    verticalAlign: "center"
                },
                title: {
                    display: true,
                    text: 'Test case by Status'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                pieceLabel: {
                    render: function (args) {
                        return args.value;
                    }
                }
            }
        };

        $('#chart1').remove();
        $('#divChart1').append('<canvas id="chart1"><canvas>');

        var ctx = document.getElementById('chart1').getContext('2d');
        window.myDoughnut = new Chart(ctx, config);
    };

    // create chart2
    $scope.createChart2 = function () {
        var labels = [];
        var dataNew = [];
        var dataActive = [];
        var dataResolved = [];
        var dataClosed = [];

        var lstParentId = $scope.grvTestPlan.dataView.getItems().map(x => x.id);
        var params = {
            lstParentId: lstParentId,
            buildId: $scope.currentBuildListId,
            spr: $scope.currentTestSuite.sprintId
        };

        $scope.postData('api/pm/testPlan/GetBugTestResultForChart', params, function (data) {
            if (data) {
                labels = data.labels;
                dataNew = data.dataNew;
                dataActive = data.dataActive;
                dataResolved = data.dataResolved;
                dataClosed = data.dataClosed;
            }
        });

        var barChartData = {
            labels: labels,
            datasets: [
                {
                    label: 'New',
                    backgroundColor: window.chartColors.new,
                    data: dataNew
                },
                {
                    label: 'Active',
                    backgroundColor: window.chartColors.active,
                    data: dataActive
                },
                {
                    label: 'Resolved',
                    backgroundColor: window.chartColors.resolved,
                    data: dataResolved
                },
                {
                    label: 'Closed',
                    backgroundColor: window.chartColors.closed,
                    data: dataClosed
                }
            ]
        };

        $('#chart2').remove();
        $('#divChart2').append('<canvas id="chart2"><canvas>');

        var ctx = document.getElementById('chart2').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'horizontalBar',
            data: barChartData,
            options: {
                legend: {
                    display: true,
                    position: 'bottom',
                    verticalAlign: "center"
                },
                title: {
                    display: true,
                    text: 'Bug by Owner'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    };

    // create chart3
    $scope.createChart3 = function () {
        var labels = [];
        var dataNew = [];
        var dataNotRun = [];
        var dataPassed = [];
        var dataFailed = [];
        var dataInProgress = [];
        var dataBlocked = [];

        var params = {
            lstIdUserstory: $scope.lstIdUserstory,
            pjid: $scope.params.pjid
        };

        // get data
        $scope.postData('api/pm/testPlan/GetTestPlanForChart', params, function (data) {
            if (data) {
                labels = data.labels;
                dataNew = data.dataNew;
                dataNotRun = data.dataNotRun;
                dataPassed = data.dataPassed;
                dataFailed = data.dataFailed;
                dataInProgress = data.dataInProgress;
                dataBlocked = data.dataBlocked;
            }
        });
        var barChartData = {
            labels: labels,
            datasets: [
                {
                    label: 'New',
                    backgroundColor: window.chartColors.new,
                    data: dataNew
                },
                {
                    label: 'Not Run',
                    backgroundColor: window.chartColors.notRun,
                    data: dataNotRun
                },
                {
                    label: 'Passed',
                    backgroundColor: window.chartColors.passed,
                    data: dataPassed
                },
                {
                    label: 'Failed',
                    backgroundColor: window.chartColors.failed,
                    data: dataFailed
                },
                {
                    label: 'In Progress',
                    backgroundColor: window.chartColors.inProgress,
                    data: dataInProgress
                },
                {
                    label: 'Blocked',
                    backgroundColor: window.chartColors.blocked,
                    data: dataBlocked
                }
            ]
        };

        $('#chart3').remove();
        $('#divChart3').append('<canvas id="chart3"><canvas>');

        var ctx = document.getElementById('chart3').getContext('2d');
        var height = labels.length * 50;
        $('#divChart3').height(height);
        window.myBar = new Chart(ctx, {
            type: 'horizontalBar',
            data: barChartData,
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'bottom',
                    verticalAlign: "center"
                },
                title: {
                    display: true,
                    text: 'Test case process'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    };
    //------------ end chart -------------
}]);
