'use strict';
app.register.controller('myKPIController', ['$scope', '$location', '$window', '$timeout', 'authService', function ($scope, $location, $window, $timeout, authService) {
    // display function
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.$on('$routeChangeSuccess', function () {
        $scope.authService = authService;

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

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadData();
        };

        setSelectedMenu('myKPI');

        if ($scope.grid != null) {
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

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

            // load data
            $scope.loadData();
        }

        // resize
        $(window).resize(function (e) {
            var width = $("#myKPI .white_box").width();
            var height = $("#myKPI .white_box").height();

            $('#myKPI #grvKPI').height(height - 210);
            $('#myKPI #grvKPI').width(width);
            
            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });
        $(window).resize();

        // refresh
        $scope.refresh = function () {
            //$("#inputSearch").val('');
            //$scope.type = "all";
            //$scope.postNoAsync('api/pm/myTaskList/GetListProject', null, function (data) {
            //    $scope.project = [];
            //    $scope.setting.valuelist.project = data;
            //    $scope.project.push(data[0].id);
            //    $timeout(function () {
            //        $("#select-project").selectpicker({
            //            width: "100%",
            //            selectedTextFormat: "count>2",
            //            noneSelectedText: "...",
            //            actionsBox: true,
            //            size: false
            //        });
            //        $('#select-project').selectpicker('refresh');
            //    });
            //});
            //$scope.loadSprint();
            //$scope.loadProjectMember();
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
            type: $scope.type,
            userId: $scope.projectMember
        };

        $scope.postData(myKPISetting.grid.url, params, function (response) {
            $.each(response, function (index, item) {
                if (item.hasChild) item.isCollapsed = false;
            });
            $scope.grid.setData(response);
            // load chart
            $scope.loadChart();
        });
    };

    // change project
    $scope.ChangeProject = function () {
        $scope.$parent.$parent.taskParams.project = $scope.project;
        $scope.loadSprint();
        $scope.loadProjectMember();
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
    };

    $scope.ChangeMember = function () {
        $scope.$parent.$parent.taskParams.projectMember = $scope.projectMember;
        $scope.loadData();
    };

    // change task bug
    $scope.ChangeType = function () {
        $scope.$parent.$parent.taskParams.type = $scope.type;
        $scope.loadData();
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

    // load chart
    $scope.loadChart = function () {
        $scope.createChart();
        $scope.createChart2();
        $scope.createChart3();
        $scope.createChart4();
    };

    // chart color
    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)',

        new: 'rgb(153, 153, 153)',
        active: 'rgb(55, 165, 221)',
        resolved: 'rgb(248, 152, 29)',
        closed: 'rgb(48, 185, 143)',

        urgent: 'rgb(239, 68, 56)',
        high: 'rgb(248, 152, 29)',
        normal: 'rgb(55, 165, 221)',
        low: 'rgb(48, 185, 143)',
    };

    //create chart
    $scope.createChart = function () {
        var gridData = $scope.grid.dataView.getItems().filter(x => x.indent == 2);
        var newHrs = gridData.filter(x => x.state == "new").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "new").map(x => x.completed).reduce(getSum);
        var activeHrs = gridData.filter(x => x.state == "active").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "active").map(x => x.completed).reduce(getSum);
        var resolvedHrs = gridData.filter(x => x.state == "resolved").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "resolved").map(x => x.completed).reduce(getSum);
        var closedhrs = gridData.filter(x => x.state == "closed").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "closed").map(x => x.completed).reduce(getSum);

        var avgNewHrs = parseFloat(100 * newHrs / (newHrs + activeHrs + resolvedHrs + closedhrs)).toFixed(2);
        var avgActiveHrs = parseFloat(100 * activeHrs / (newHrs + activeHrs + resolvedHrs + closedhrs)).toFixed(2);
        var avgResolvedHrs = parseFloat(100 * resolvedHrs / (newHrs + activeHrs + resolvedHrs + closedhrs)).toFixed(2);
        var avgClosedhrs = parseFloat(100 * closedhrs / (newHrs + activeHrs + resolvedHrs + closedhrs)).toFixed(2);

        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        avgNewHrs,
                        avgActiveHrs,
                        avgResolvedHrs,
                        avgClosedhrs
                    ],
                    backgroundColor: [
                        window.chartColors.new,
                        window.chartColors.active,
                        window.chartColors.resolved,
                        window.chartColors.closed,
                    ]
                }],
                labels: [
                    myKPITranslation.NEW,
                    myKPITranslation.ACTIVE,
                    myKPITranslation.RESOLVED,
                    myKPITranslation.CLOSED,
                ]
            },
            options: {
                legend: {
                    display: true,
                    position: 'right',
                    verticalAlign: "center",
                },
                title: {
                    display: true,
                    text: myKPITranslation.EFFORT_BREAKUP_BY_STATUS
                },
                responsive: true,
                pieceLabel: {
                    render: function (args) {
                        return args.value + '%';
                    }
                }
            }
        };

        $('#myChart').remove();
        $('#div_mychart').append('<canvas id="myChart"><canvas>');
        var ctx = document.getElementById('myChart').getContext('2d');
        window.myPie = new Chart(ctx, config);
    };

    // create chart
    $scope.createChart2 = function () {
        var gridData = $scope.grid.dataView.getItems().filter(x => x.indent == 2);

        var newHrsEstimated = gridData.filter(x => x.state == "new").map(x => x.originalEstimate).length == 0 ? 0 : gridData.filter(x => x.state == "new").map(x => x.originalEstimate).reduce(getSum);
        var activeHrsEstimated = gridData.filter(x => x.state == "active").map(x => x.originalEstimate).length == 0 ? 0 : gridData.filter(x => x.state == "active").map(x => x.originalEstimate).reduce(getSum);
        var resolvedHrsEstimated = gridData.filter(x => x.state == "resolved").map(x => x.originalEstimate).length == 0 ? 0 : gridData.filter(x => x.state == "resolved").map(x => x.originalEstimate).reduce(getSum);
        var closedhrsEstimated = gridData.filter(x => x.state == "closed").map(x => x.originalEstimate).length == 0 ? 0 : gridData.filter(x => x.state == "closed").map(x => x.originalEstimate).reduce(getSum);
        var estimated = [newHrsEstimated, activeHrsEstimated, resolvedHrsEstimated, closedhrsEstimated];

        var newHrsCompleted = gridData.filter(x => x.state == "new").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "new").map(x => x.completed).reduce(getSum);
        var activeHrsCompleted = gridData.filter(x => x.state == "active").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "active").map(x => x.completed).reduce(getSum);
        var resolvedHrsCompleted = gridData.filter(x => x.state == "resolved").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "resolved").map(x => x.completed).reduce(getSum);
        var closedhrsCompleted = gridData.filter(x => x.state == "closed").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.state == "closed").map(x => x.completed).reduce(getSum);
        var completed = [newHrsCompleted, activeHrsCompleted, resolvedHrsCompleted, closedhrsCompleted];

        var dataChart = {
            labels: [
                myKPITranslation.NEW,
                myKPITranslation.ACTIVE,
                myKPITranslation.RESOLVED,
                myKPITranslation.CLOSED,
            ],
            datasets: [{
                label: myKPITranslation.COMPLETED,
                backgroundColor: window.chartColors.blue,
                data: completed,
            }, {
                label: myKPITranslation.ESTIMATE,
                backgroundColor: window.chartColors.yellow,
                data: estimated,
            }]
        };

        $('#myChart2').remove();
        $('#div_mychart2').append('<canvas id="myChart2"><canvas>');
        var ctx = document.getElementById('myChart2').getContext("2d");
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: dataChart,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                    verticalAlign: "center",
                },
                title: {
                    display: true,
                    text: myKPITranslation.EFFORT_BREAKUP_BY_STATUS
                },
                tooltips: {
                    enabled: true
                },
            }
        });
    };

    //create chart
    $scope.createChart3 = function () {
        var gridData = $scope.grid.dataView.getItems().filter(x => x.indent == 2);
        var urgentHrs = gridData.filter(x => x.priority == "1-Urgent").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.priority == "1-Urgent").map(x => x.completed).reduce(getSum);
        var highHrs = gridData.filter(x => x.priority == "2-High").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.priority == "2-High").map(x => x.completed).reduce(getSum);
        var normalHrs = gridData.filter(x => x.priority == "3-Normal").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.priority == "3-Normal").map(x => x.completed).reduce(getSum);
        var lowHrs = gridData.filter(x => x.priority == "4-Low").map(x => x.completed).length == 0 ? 0 : gridData.filter(x => x.priority == "4-Low").map(x => x.completed).reduce(getSum);

        var avgUrgentHrs = parseFloat(100 * urgentHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);
        var avgHighHrs = parseFloat(100 * highHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);
        var avgNormalHrs = parseFloat(100 * normalHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);
        var avgLowHrs = parseFloat(100 * lowHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);

        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        avgUrgentHrs,
                        avgHighHrs,
                        avgNormalHrs,
                        avgLowHrs,
                    ],
                    backgroundColor: [
                        window.chartColors.urgent,
                        window.chartColors.high,
                        window.chartColors.normal,
                        window.chartColors.low
                    ]
                }],
                labels: [
                    myKPITranslation.URGENT,
                    myKPITranslation.HIGH,
                    myKPITranslation.NORMAL,
                    myKPITranslation.LOW
                ]
            },
            options: {
                legend: {
                    display: true,
                    position: 'right',
                    verticalAlign: "center",
                },
                title: {
                    display: true,
                    text: myKPITranslation.EFFORT_BREAKUP_BY_PRIORITY
                },
                responsive: true,
                pieceLabel: {
                    render: function (args) {
                        return args.value + '%';
                    }
                }
            }
        };

        $('#myChart3').remove();
        $('#div_mychart3').append('<canvas id="myChart3"><canvas>');
        var ctx = document.getElementById('myChart3').getContext('2d');
        window.myPie = new Chart(ctx, config);
    };

    //create chart
    $scope.createChart4 = function () {
        var gridData = $scope.grid.dataView.getItems().filter(x => x.indent == 2 && (x.state == "new" || x.state == "active") && x.type == "bug");
        var urgentHrs = gridData.filter(x => x.priority == "1-Urgent").length;
        var highHrs = gridData.filter(x => x.priority == "2-High").length;
        var normalHrs = gridData.filter(x => x.priority == "3-Normal").length;
        var lowHrs = gridData.filter(x => x.priority == "4-Low").length;

        var avgUrgentHrs = parseFloat(100 * urgentHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);
        var avgHighHrs = parseFloat(100 * highHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);
        var avgNormalHrs = parseFloat(100 * normalHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);
        var avgLowHrs = parseFloat(100 * lowHrs / (urgentHrs + highHrs + normalHrs + lowHrs)).toFixed(2);

        var config = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        avgUrgentHrs,
                        avgHighHrs,
                        avgNormalHrs,
                        avgLowHrs,
                    ],
                    backgroundColor: [
                        window.chartColors.urgent,
                        window.chartColors.high,
                        window.chartColors.normal,
                        window.chartColors.low
                    ]
                }],
                labels: [
                    myKPITranslation.URGENT,
                    myKPITranslation.HIGH,
                    myKPITranslation.NORMAL,
                    myKPITranslation.LOW
                ]
            },
            options: {
                legend: {
                    display: true,
                    position: 'right',
                    verticalAlign: "center",
                },
                title: {
                    display: true,
                    text: myKPITranslation.ACTIVE_BUG_BY_PRIORITY
                },
                responsive: true,
                pieceLabel: {
                    render: function (args) {
                        return args.value + '%';
                    }
                }
            }
        };

        $('#myChart4').remove();
        $('#div_mychart4').append('<canvas id="myChart4"><canvas>');
        var ctx = document.getElementById('myChart4').getContext('2d');
        window.myPie = new Chart(ctx, config);
    };

    // sum
    function getSum(total, num) {
        return total + num;
    }
}]);