'use strict';
app.register.controller('sprintReportController', ['$scope', '$location', '$window', '$timeout', 'authService', '$route', '$rootScope', function ($scope, $location, $window, $timeout, authService, $route, $rootScope) {
    // register scope
    $scope.lstSprint = [];
    $scope.currentSprint = {};
    $scope.tabNameSetting = 'sprints';
    $scope.currentProject = {};
    $scope.displayTab = false;

    //display function
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.search = false;
        $scope.button.copy = false;
        $("#btnSprintSetting").hide();
    };

    // display title
    $scope.displayTitle = function () {
        toogleProject(true);
        toogleSprint(true);
    };

    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        if ($scope.menuParams.spr)
            $scope.sprUrl = "&spr=" + $scope.menuParams.spr;
        else
            $scope.sprUrl = '';

        if (localStorage.SPRINTSETTING) {
            var sprintSetting = JSON.parse(localStorage.SPRINTSETTING);
            if (sprintSetting) {
                if (sprintSetting.hiddenListSprint)
                    $scope.hiddenListSprint = 'show_hidden';
            }
        }

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
            },
        });

        // click collapse sprint
        $("#sprintReport .sprint_plan dl dt").click(function () {
            $(this).toggleClass("arrow");
        });

        // scroll list sprint
        //SetPerfectScroll("accordion");
        SetPerfectScroll("content_scroll");

        // get current sprint
        $scope.getCurrentSprint();
        // load list sprint
        $scope.loadListSrpint();

        // show/hide button Approval
        if ($scope.currentProject.isApproveSprint) {
            if ($scope.currentSprint.approveStatus == 'approved') $scope.displayTab = true;
            else $scope.displayTab = false;
        }
        else $scope.displayTab = true;

        // set html
        $scope.setHtml();

        // create chart
        $scope.createChart();

        setSelectedMenu("sprintPlan");

        // refresh
        $scope.refresh = function () {
            // get project
            $scope.getProject();
            // get current sprint
            $scope.getCurrentSprint();
            // load list sprint
            $scope.loadListSrpint();
            // show/hide button Approval
            if ($scope.currentProject.isApproveSprint) {
                if ($scope.currentSprint.approveStatus == 'approved') $scope.displayTab = true;
                else $scope.displayTab = false;
            }
            else $scope.displayTab = true;

            // set html
            $scope.setHtml();
            // create chart
            $scope.createChart();
        };

        // resize
        $(window).resize(function () {
            var lableChart2InfoHeight = $("#lable-chart2-info").height();
            $("#divChart2").height(353 - lableChart2InfoHeight);
        });
        $(window).resize();

        SetPerfectScroll("divChart2");
    });

    $scope.toogleSprint = function () {
        $("#sprintReport .content_3").toggleClass("show_hidden");
        $("#sprintReport .content_7").toggleClass("show_hidden");
        //$(window).resize();
    };

    // set html
    $scope.setHtml = function () {
        var html = '<li class="nav-item">' +
            '<a class="nav-link" href="/pm/sprintPlan?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_01-tab" data-toggle="tab" data-target="#tabSprintPlan"' +
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
            '<a class="nav-link active" href="/pm/sprintReport?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_05-tab" data-toggle="tab" data-target="#tabSprintReport"' +
            'role="tab" aria-controls="tab_05" aria-selected="false">Sprint Report</a>' +
            '</li>';
        if (!$scope.displayTab) {
            html = '<li class="nav-item">' +
                '<a class="nav-link" href="/pm/sprintPlan?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_01-tab" data-toggle="tab" data-target="#tabSprintPlan"' +
                'role="tab" aria-controls="tab_01" aria-selected="false">Sprint Plan</a>' +
                '</li>' +
                '<li class="nav-item">' +
                '<a class="nav-link" href="/pm/teamCapacity?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_04-tab" data-toggle="tab" data-target="#tabTeamCapacity"' +
                'role="tab" aria-controls="tab_04" aria-selected="false">Team Capacity</a>' +
                '</li>' +
                '<li class="nav-item">' +
                '<a class="nav-link active" href="/pm/sprintReport?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_05-tab" data-toggle="tab" data-target="#tabSprintReport"' +
                'role="tab" aria-controls="tab_05" aria-selected="true">Sprint Report</a>' +
                '</li>';
        }

        $('#main_tab_01').html(html);
        addElementToScope("#main_tab_01", $scope);
    };

    // create chart
    $scope.createChart = function () {
        // create chart1
        $scope.createChart1();
        // create chart2
        $scope.createChart2();
        // create chart3
        $scope.createChart3();
        // create chart4
        $scope.createChart4();
    }

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

    // init chart
    // chart color
    window.chartColors = {
        effort: 'rgb(255, 99, 132)',
        completed: 'rgb(75, 192, 192)',
        total: 'rgb(153, 102, 255)',
        remaining: 'rgb(255, 159, 64)',
        originalEstimate: 'rgb(54, 162, 235)',
        inProcess: 'rgb(54, 162, 235)',
        idealTrend: 'rgb(255, 99, 132)'
    };

    // create chart1
    $scope.createChart1 = function () {
        var data = [];
        var url = 'api/pm/Sprint/GetBurndowChart';
        var params = {
            pjid: $scope.params.pjid,
            spr: $scope.params.spr,
            area: $scope.params.area
        };
        $scope.postData(url, params, function (response) {
            if (response) {
                data = response;
            }
        });
        if (data.length > 0) {
            var labels = data.map(x => x.dateCreated);
            var inProcess = [];
            var remaining = [];
            var completed = [];
            var idealTrend = [];
            $.each(data, function (index, value) {
                inProcess.push(value.inProcess);
                remaining.push(value.remaining);
                completed.push(value.completed);
                idealTrend.push(value.idealTrend);
            });
            var dataChart = {
                labels: labels,
                datasets: [
                    {
                        label: 'Ideal Trend',
                        backgroundColor: 'rgba(255,255,255,0)',
                        borderColor: 'rgba(255,99,132,1)',
                        data: idealTrend
                    },
                    {
                        label: 'InProcess',
                        backgroundColor: window.chartColors.inProcess,
                        data: inProcess
                    },
                    {
                        label: 'Remaining',
                        backgroundColor: window.chartColors.remaining,
                        data: remaining
                    },
                    {
                        label: 'Completed',
                        backgroundColor: window.chartColors.completed,
                        data: completed
                    }
                ]
            };

            $('#myChart1').remove();
            $('#divChart1').append('<canvas id="myChart1"><canvas>');
            var ctx = document.getElementById('myChart1').getContext("2d");
            $('#divChart1').height(400);

            window.myBar = new Chart(ctx, {
                type: 'line',
                data: dataChart,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    tooltips: {
                        mode: 'index',
                        intersect: true
                    }
                }
            });
        }
    };

    // create chart2
    $scope.createChart2 = function () {
        var url = 'api/pm/Sprint/GetCurrentSprintStatus';
        var params = {
            pjid: $scope.params.pjid,
            area: $scope.params.area
        };

        $scope.charData2 = [];
        $scope.postData(url, params, function (response) {
            if (response) {
                $scope.charData2 = response;
            }
        });
    }

    // create chart3
    $scope.createChart3 = function () {
        var url = 'api/pm/Sprint/TaskStatistics';
        var params = {
            pjid: $scope.params.pjid,
            spr: $scope.params.spr,
            area: $scope.params.area
        };

        var data = [];
        $scope.postData(url, params, function (response) {
            if (response) {
                data = response;
            }
        });
        if (data.length > 0) {
            var labels = data.map(x => x.assign);
            var effort = [];
            var taskCompleted = [];
            var total = [];
            $.each(data, function (index, value) {
                effort.push(value.effort);
                taskCompleted.push(value.taskCompleted);
                total.push(value.total);
            });

            var dataChart = {
                labels: labels,
                datasets: [
                    {
                        label: 'Effort',
                        backgroundColor: window.chartColors.effort,
                        data: effort
                    },
                    {
                        label: 'Task Completed',
                        backgroundColor: window.chartColors.completed,
                        data: taskCompleted
                    },
                    {
                        label: 'Total',
                        backgroundColor: window.chartColors.total,
                        data: total
                    }
                ]
            };

            $('#myChart3').remove();
            $('#divChart3').append('<canvas id="myChart3"><canvas>');

            var ctx = document.getElementById('myChart3').getContext("2d");
            var height = labels.length * 50;
            $('#divChart3').height(height);

            window.myBar = new Chart(ctx, {
                type: 'horizontalBar',
                data: dataChart,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    tooltips: {
                        mode: 'index',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                callback: function (label, index, labels) { return label + '%'; },
                            }
                        }]
                    }
                }
            });
        }
    }

    // create chart4
    $scope.createChart4 = function () {
        var url = 'api/pm/Sprint/TotalHours';
        var params = {
            pjid: $scope.params.pjid,
            spr: $scope.params.spr,
            area: $scope.params.area
        };

        var capacity = 0;
        var data = [];
        $scope.postData(url, params, function (response) {
            if (response) {
                data = response.listData;
                capacity = response.capacity
            }
        });

        if (data.length > 0) {
            var labels = data.map(x => x.assign);
            var originalEstimate = [];
            var remaining = [];
            var completed = [];
            $.each(data, function (index, value) {
                originalEstimate.push(value.originalEstimate);
                remaining.push(value.remaining);
                completed.push(value.completed);
            });

            var chartData = {
                labels: labels,
                datasets: [
                    {
                        type: 'horizontalBar',
                        label: 'Original Estimate',
                        backgroundColor: window.chartColors.originalEstimate,
                        data: originalEstimate
                    },
                    {
                        type: 'horizontalBar',
                        label: 'Remaining',
                        backgroundColor: window.chartColors.remaining,
                        data: remaining,
                    },
                    {
                        type: 'horizontalBar',
                        label: 'Completed',
                        backgroundColor: window.chartColors.completed,
                        data: completed,
                    }]
            };

            $('#myChart4').remove();
            $('#divChart4').append('<canvas id="myChart4"><canvas>');

            var ctx = document.getElementById('myChart4').getContext('2d');
            var height = labels.length * 50;
            $('#divChart4').height(height);

            window.myMixedChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: chartData,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    tooltips: {
                        mode: 'index',
                        intersect: true
                    },
                    annotation: {
                        annotations: [
                            {
                                drawTime: "afterDatasetsDraw",
                                id: "hline",
                                type: "line",
                                mode: "vertical",
                                scaleID: "x-axis-0",
                                value: capacity,
                                borderColor: "black",
                                borderWidth: 2,
                                label: {
                                    backgroundColor: "red",
                                    content: capacity,
                                    enabled: true
                                }
                            }
                        ]
                    }
                }
            });
        }
    }

    // delete data
    $scope.deleteData = function () {
        // delete sprint
        $scope.childScope.sprintSetting.deleteSprint();
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
            })
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
    }

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
}]);