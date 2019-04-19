//check
'use strict';
app.register.controller('myTaskCalendarController', ['$scope', '$location', '$timeout', 'authService', function ($scope, $location, $timeout, authService) {
    // init
    $scope.displayTitle = function () {
        toogleProduct(false);
        toogleProject(false);
        toogleSprint(false);
    };
    $scope.displayFunction = function () {
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.$on('$routeChangeSuccess', function () {
        $scope.authService = authService;
        $("#task-context-menu").hide();
        setSelectedMenu('myTaskList');

        //$(window).resize(function () {
        //    var height = $("#myTaskCalendar .white_box").height();
        //    var width = $("#myTaskCalendar .white_box").width();
        //    $("#myTaskCalendar .white_box").height(height - 20);
        //    $("#myTaskCalendar .white_box").width(width - 20);
        //});
        //$(window).resize();

        $scope.data = [];
        $scope.taskId = "";
        $("#detailWorkItem").hide();
        $("#myTaskCalendar").on('click', function () {
            $("#task-context-menu").hide();
        });

        $.ajax({
            url: '/app/pm/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
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

        //DATA FOR CALENDAR
        var element = $("#calendar .fc-scroller");
        element.css('position', 'relative');

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadData();
        };

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
            $scope.showButton();
            $scope.loadData();
        };
    });

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

    $scope.loadData = function () {
        var searchValue = $("#inputSearch").val();
        if (searchValue === undefined) searchValue = null;
        $('#calendarFrom').fullCalendar({
            defaultView: 'month',
            height: 400,
            selectable: true,
            header: {
                left: '',
                center: '',
                right: 'title',
            },
            disableDragging: true
        });
        $('#calendarTo').fullCalendar({
            defaultView: 'month',
            height: 400,
            selectable: true,
            header: {
                //left: 'prev,next today',
                left: '',
                center: '',
                right: 'title',
            },
            disableDragging: true
        });
        $('#calendar').fullCalendar({
            defaultView: 'month',
            header: {
                left: 'prev,next today',
                //left: '',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            views: {
                week: { // name of view
                    columnFormat: 'ddd DD/MM'
                    // other view-specific options here
                }
            },

            defaultDate: $scope.defaultDate,
            navLinks: true, // can click day/week names to navigate views
            editable: false,
            eventLimit: true, // allow "more" link when too many events
            event: $scope.data,
        });

        //remove class name highlight
        $('.fc-day-top').removeClass('highlight');
        $('.fc-day-top').removeClass('h-bug');
        $('.fc-day-top').removeClass('h-task');

        $('.fc-month-button').text('Month');
        $('.fc-basicWeek-button').text('Week');
        $('.fc-basicDay-button').text('Day');
        $('.fc-today-button').text('Today');

        // $scope.params.pjid = $scope.project;

        var obj = {
            'module': $scope.params.module,
            'pjid': $scope.project,
            'userId': $scope.projectMember,
            'sprint': $scope.sprint,
            'type': $scope.type,
            'searchValue': searchValue
        };

        $scope.postData('api/pm/myTaskCalendar/GetSprintDetail', { sprint: $scope.sprint }, function (data) {
            $scope.startSprint = moment(data.startDate).format("YYYY-MM-DD");
            $scope.endSprint = moment(data.endDate).format("YYYY-MM-DD");
        });

        $scope.postData('api/pm/myTaskCalendar/Get', obj, function (data) {
            //if (data.length != undefined) {
            $scope.defaultDate = $scope.endSprint;//data.slice(-1)[0].start;
            //set default date From To
            $('#calendarFrom').fullCalendar('gotoDate', $scope.startSprint);
            //set class hightlight DateFrom
            var listDateFrom = $('#calendarFrom .fc-day-top');
            listDateFrom.each(function (index, element) {
                var thisDate = element.dataset.date;
                var currentDate = moment(thisDate, "YYYY-MM-DD").format("YYYY-MM-DD");

                if ($scope.startSprint <= currentDate && currentDate <= $scope.endSprint) {
                    element.className += " highlight";
                }

                var checkExistWorkItem = data.filter(x => (moment(x.start).format("YYYY-MM-DD")) == thisDate)[0];
                if ((typeof (checkExistWorkItem) !== "undefined")) {
                    var listClass = checkExistWorkItem.className.split(' ');
                    if (listClass.indexOf("task") > -1) { element.className += " h-task" }
                    else if (listClass.indexOf("bug") > -1) { element.className += " h-bug" }
                }
            });
            //set class hightlight DateFrom
            var nextMonth = moment($scope.startSprint).add(1, 'month').format("YYYY-MM-DD")
            $('#calendarTo').fullCalendar('gotoDate', nextMonth);

            var listDateTo = $('#calendarTo .fc-day-top');
            listDateTo.each(function (index, element) {
                var thisDate = element.dataset.date;
                var currentDate = moment(thisDate, "YYYY-MM-DD").format("YYYY-MM-DD");

                if ($scope.startSprint <= currentDate && currentDate <= $scope.endSprint) {
                    element.className += " highlight";
                }

                var checkExistWorkItem = data.filter(x => moment(x.start).format("YYYY-MM-DD") == thisDate)[0];
                if ((typeof (checkExistWorkItem) !== "undefined")) {
                    var listClass = checkExistWorkItem.className.split(' ');
                    if (listClass.indexOf("task") > -1) { element.className += " h-task" }
                    else if (listClass.indexOf("bug") > -1) { element.className += " h-bug" }
                }
            });

            $('#calendar').fullCalendar('gotoDate', $scope.endSprint);
            //}
            //else
            //    data = [];

            $scope.data = data;
        });

        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', $scope.data);
        $('#calendar').fullCalendar('rerenderEvents');

        //set event click / dbclick workitem
        $("#myTaskCalendar .taskitem").dblclick(function (e) {
            var temp = $(this).position();
            var allClass = $(this).attr('class');
            var dataId = allClass.split(" ").slice(-1)[0];
            $scope.postNoAsync('api/pm/myTaskCalendar/GetWorkItemDetail?id=' + dataId, null, function (data) {
                $scope.editWorkItem(data);
            });
        });
        $(".taskitem").click(function (e) {
            var temp = $(this).position();
            var allClass = $(this).attr('class');
            var dataId = allClass.split(" ").slice(-1)[0];
            $scope.taskId = dataId;
        });

        $('.fc-more').click(function () {
            $("#myTaskCalendar .taskitem").dblclick(function (e) {
                var temp = $(this).position();
                var allClass = $(this).attr('class');
                var dataId = allClass.split(" ").slice(-1)[0];
                $scope.postNoAsync('api/pm/myTaskCalendar/GetWorkItemDetail?id=' + dataId, null, function (data) {
                    $scope.editWorkItem(data);
                });
            });
            $(".taskitem").click(function (e) {
                var temp = $(this).position();
                var allClass = $(this).attr('class');
                var dataId = allClass.split(" ").slice(-1)[0];
                $scope.taskId = dataId;
            });
        });
    };

    $scope.editWorkItem = function (data) {
        //if (data.assign != $scope.authService.user.id) {
        //    showError($scope.translation.ERR_CANT_EDIT);
        //    return;
        //}
        //if (data.sprintRelated == null || data.sprintRelated.approveStatus == 'approved') {
        //    showError($scope.translation.ERR_SPRINT_APPROVED);
        //    return;
        //}
        $scope.action = 'edit';
        $scope.childScope.workItemForm.dataAction('edit', data);

        if (data.assign != $scope.authService.user.id) {
            $("#btnSaveClose").hide();
        }
        else {
            $("#btnSaveClose").show();
        }
        $scope.$applyAsync();
    };

    $scope.displayTitle = function () {
        toogleProduct(true);
        toogleProject(true);
    };

    $scope.changeTeamMember = function (value) {
        $scope.loadData();
    };

    // save work item
    $scope.saveWorkItem = function (data) {
        // load data
        $scope.loadData();
    };

    $scope.edit = function () {
        // load data
        $scope.postNoAsync('    api/pm/myTaskCalendar/GetWorkItemDetail?id=' + $scope.taskId, null, function (data) {
            if (data.assign != $scope.authService.user.id) {
                showError($scope.translation.ERR_CANT_EDIT);
                return;
            }
            var isApproveSprint = $scope.setting.valuelist.project.find(x => x.id == $scope.project).isApproveSprint;
            //if (data.sprintRelated == null || data.sprintRelated.approveStatus =='approved'){
            if (isApproveSprint == true && (data.sprintRelated == null || data.sprintRelated.approveStatus == 'approved')) {
                showError($scope.translation.ERR_SPRINT_APPROVED);
                return;
            }

            $scope.action = 'edit';
            $scope.childScope.workItemForm.dataAction('edit', data);
            $scope.$applyAsync();
        });
    };

    $scope.delete = function () {
        // load data
        if ($scope.taskId != "" && $scope.taskId != null) {
            $scope.postNoAsync('api/pm/myTaskCalendar/GetWorkItemDetail?id=' + $scope.taskId, null, function (response) {
                if (response) {
                    if (response.assign != $scope.authService.user.id) {
                        showError($scope.translation.ERR_CANT_EDIT);
                        return;
                    }
                    var isApproveSprint = $scope.setting.valuelist.project.find(x => x.id == $scope.project).isApproveSprint;
                    //if (data.sprintRelated == null || data.sprintRelated.approveStatus =='approved'){
                    if (isApproveSprint == true && (data.sprintRelated == null || data.sprintRelated.approveStatus == 'approved')) {
                        showError($scope.translation.ERR_SPRINT_APPROVED);
                        return;
                    }

                    $scope.currentWorkitem = response;
                    $('#modal-confirm').modal();
                }
            });
        }
        else {
            showError($scope.translation.ERR_SELECT_DATA_DELETE);
        }
    };

    // delete data
    $scope.deleteData = function () {
        $scope.childScope.workItemForm.dataAction('delete', $scope.currentWorkitem);
    };

    // delete work item
    $scope.deleteWorkItem = function () {
        // load data
        $scope.loadData();
    };

    //function
    $scope.add = function () {
        var temp = $("#btnAdd").position();
        var inputSearchWidth = $("#inputSearch").width();
        $("#task-context-menu").css({ "top": (temp.top + 40) + "px", "right": (inputSearchWidth + 20) + "px" }).show();
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

    // show button
    $scope.showButton = function () {
        if ($scope.project.length === 0 || $scope.sprint.length === 0) {
            $scope.button.add = false;
            $scope.button.delete = false;
            $scope.button.edit = false;
            return;
        }

        if ($scope.projectMember === $scope.authService.user.id) {
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
}]);