'use strict';
app.register.controller('teamCapacityController', ['$scope', '$location', '$window', '$timeout', 'authService', '$route', '$rootScope', function ($scope, $location, $window, $timeout, authService, $route, $rootScope) {
    // register scope
    $scope.lstSprint = [];
    $scope.currentSprint = {};
    $scope.tabNameSetting = 'sprints';
    $scope.workdetails = [];
    $scope.teamCapacity = {};
    $scope.currentProject = {};
    $scope.displayTab = false;
    $scope.options = {
        daysOfWeekDisabled: [0, 6]
    };
    $scope.lstMember = [];
    $scope.addMember = {};

    //display function
    $scope.displayFunction = function () {
        $scope.button.delete = true;
        $scope.button.edit = false;
        $scope.button.search = false;
        $scope.button.save = true;
        $scope.button.refresh = true;
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
        $scope.lFormat = moment().locale(keyLang).localeData()._longDateFormat['l'];
        if (!$scope.lFormat)
            $scope.lFormat = keyLang === "vn" ? lFormat = "DD/MM/YYYY" : "MM/DD/YYYY";

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

        $scope.setting.valuelist.member = [];
        // role
        $scope.post('api/sys/role/GetListByObjectId?id=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.role = data;
        });

        $scope.postNoAsync('api/pm/Member/get?pjid=' + $scope.params.pjid + '&area=' + $scope.params.area + '&module=pj', null, function (data) {
            if (data) {
                $.each(data, function (inx, val) {
                    if (val.user && val.nonCapacity == false) {
                        var item = {
                            id: val.user.id,
                            text: val.user.displayName
                        };
                        $scope.lstMember.push(item);
                    }
                });
            }
        });

        // valuelist
        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $scope.setting.valuelist.activity = buildValueList(data.activityCapacity);
            },
        });

        // click collapse sprint
        $("#teamCapacity .sprint_plan dl dt").click(function () {
            $(this).toggleClass("arrow");
        });

        // scroll list sprint
        SetPerfectScroll("divTemCapacity");

        // get current sprint
        $scope.getCurrentSprint();

        // load data
        $scope.loadData();
        // load list sprint
        $scope.loadListSrpint();
        // sum task list
        $scope.sumTaskSprint();

        if ($scope.currentSprint.name)
            $scope.currentSprintName = $scope.currentSprint.name + ' (' + moment($scope.currentSprint.startDate).format('DD/MM/YYYY') + '-' + moment($scope.currentSprint.endDate).format('DD/MM/YYYY') + ')';
        else
            $scope.currentSprintName = 'Sprint (' + moment().format('DD/MM/YYYY') + '-' + moment().format('DD/MM/YYYY') + ')';

        // show/hide button Approval
        if ($scope.currentProject.isApproveSprint) {
            if ($scope.currentSprint.approveStatus == 'approved') $scope.displayTab = true;
            else $scope.displayTab = false;
        }
        else $scope.displayTab = true;

        // set html
        $scope.setHtml();

        // refresh
        $scope.refresh = function () {
            // get project
            $scope.getProject();
            // get current sprint
            $scope.getCurrentSprint();
            // show/hide button Approval
            if ($scope.currentProject.isApproveSprint) {
                if ($scope.currentSprint.approveStatus == 'approved') $scope.displayTab = true;
                else $scope.displayTab = false;
            }
            else $scope.displayTab = true;

            // set html
            $scope.setHtml();
            // load data
            $scope.loadData();
            // load list sprint
            $scope.loadListSrpint();
            // sum task list
            $scope.sumTaskSprint();
        }

        setSelectedMenu("sprintPlan");

        // resize
        $(window).resize(function () {

            var teamMemberHeight = "70px";
            if ($("#id_sprint_team").hasClass('show_hidden_team_member'))
                teamMemberHeight = "0px";

            $("#teamCapacity .content_7_3").height("calc(100% - " + teamMemberHeight + ")");
        });
    });

    $scope.toogleSprint = function () {
        $("#teamCapacity .content_3").toggleClass("show_hidden");
        $("#teamCapacity .content_7").toggleClass("show_hidden");
        $(window).resize();
    };

    $scope.toogleTeam = function () {
        $("#teamCapacity .team_member").toggleClass("show_hidden_team_member");
        $("#teamCapacity .sprint_plan").toggleClass("show_hidden_team_member");
        $(window).resize();
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
            '<a class="nav-link active" href="/pm/teamCapacity?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_04-tab" data-toggle="tab" data-target="#tabTeamCapacity"' +
            'role="tab" aria-controls="tab_04" aria-selected="true">Team Capacity</a>' +
            '</li>' +
            '<li class="nav-item">' +
            '<a class="nav-link" href="/pm/sprintReport?pjid={{menuParams.pjid}}{{sprUrl}}{{areaUrl}}&module=pj" id="tab_05-tab" data-toggle="tab" data-target="#tabSprintReport"' +
            'role="tab" aria-controls="tab_05" aria-selected="false">Sprint Report</a>' +
            '</li>';
        if (!$scope.displayTab) {
            html = '<li class="nav-item">' +
                '<a class="nav-link" href="/pm/sprintPlan?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_01-tab" data-toggle="tab" data-target="#tabSprintPlan"' +
                'role="tab" aria-controls="tab_01" aria-selected="false">Sprint Plan</a>' +
                '</li>' +
                '<li class="nav-item">' +
                '<a class="nav-link active" href="/pm/teamCapacity?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_04-tab" data-toggle="tab" data-target="#tabTeamCapacity"' +
                'role="tab" aria-controls="tab_04" aria-selected="true">Team Capacity</a>' +
                '</li>' +
                '<li class="nav-item">' +
                '<a class="nav-link" href="/pm/sprintReport?pjid={{menuParams.pjid}}&spr={{menuParams.spr}}&area={{menuParams.area}}&module=pj" id="tab_05-tab" data-toggle="tab" data-target="#tabSprintReport"' +
                'role="tab" aria-controls="tab_05" aria-selected="false">Sprint Report</a>' +
                '</li>';
        }

        $('#main_tab_01').html(html);
        addElementToScope("#main_tab_01", $scope);
    };

    // load data
    $scope.loadData = function () {
        var pjid = $scope.params.pjid;
        var area = $scope.params.area;
        var spr = $scope.params.spr;
        var searchValue = $('#inputSearch').val();
        var url = 'api/pm/Sprint/get?pjid=' + pjid + '&spr=' + spr + '&searchValue=' + searchValue + '&area=' + area;
        $scope.postNoAsync(url, null, function (data) {
            if (data) $scope.lstData = data;
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
        var url = 'api/pm/Sprint/GetCurrentTeamCapacity?pjid=' + pjid + '&area=' + area + '&spr=' + spr;
        $scope.postNoAsync(url, null, function (response) {
            if (response) {
                if (response.sprint && response.listMember) {
                    $scope.params.spr = response.sprint.id;
                    if (!response.sprint.workingDayList == null || response.sprint.workingDayList == undefined)
                        response.sprint.workingDayList = [];

                    var listMember = response.listMember;
                    $.each(response.sprint.capacityList, function (inx, val) {
                        if ($scope.params.area) {
                            var exist = listMember.find(x => x == val.userId);
                            if (exist)
                                val.select = true;
                            else
                                val.select = false;
                        }
                        else val.select = true;
                    });

                    $scope.currentSprint = response.sprint;
                    $scope.approveStatus = response.sprint.approveStatus;
                }
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

    // init js
    //$scope.initJS = function () {
    //    $("#modal-detail-member .advancedDropzoneUser").dropzone({
    //        acceptedFiles: 'image/*',
    //        url: 'data/upload',
    //        maxFiles: 1,
    //        addedfile: function (file) {
    //            $scope.frmFile.set('file', file);
    //            $('#imgAvatar').attr("src", window.URL.createObjectURL(file));
    //        },
    //    });
    //};

    // selected
    $(document).on('click', "tr.clickable-row", function () {
        $(this).addClass('tb_tree-active').siblings().removeClass('tb_tree-active');
    });

    // searchUserId
    $scope.searchUserId = function () {
        var thisUserId = $("#userId").val();
        $scope.postNoAsync("api/pm/Member/GetUserDetail?userid=" + thisUserId, null, function (data) {
            if (data != null) {
                // split ho - ten
                var displayNameSplit = data.displayName.split(",");
                $("#firstName").val(displayNameSplit[0]);
                $scope.data.firstName = displayNameSplit[0];
                $("#lastName").val(displayNameSplit[1]);
                $scope.data.lastName = displayNameSplit[1];
                $("#userId").val(data.userId);
                $scope.data.userId = data.userId;

                $("#workPhone").val(data.phone);
                $scope.data.txt_workPhone = data.phone;

                $("#workEmail").val(data.email);
                $scope.data.workEmail = data.email;

                $scope.postNoAsync("api/pm/Member/GetUserSys?userid=" + thisUserId, null, function (data) {
                    if (data != null) {
                        $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + data.avatarThumb + "&def=/img/no_avatar.png");
                        $scope.data.avatarThumb = data.avatarThumb;
                    }
                });
            }
        });
    };

    // add
    $scope.add = function () {
        var array = [];
        if ($scope.currentSprint.capacityList && $scope.currentSprint.capacityList.length > 0) {
            array = $scope.currentSprint.capacityList.map(x => x.userId);
        }
        var dataArr = $scope.lstMember.filter(function (item) {
            if (jQuery.inArray(item.id, array) == -1)
                return item.id;
        });

        $scope.setting.valuelist.member = dataArr;
        $('#modal-detail-member').modal();
    }

    // save add new member
    $scope.saveAddNewMember = function () {
        if ($scope.member) {
            // add new member
            $scope.currentSprint.capacityList.push(
                {
                    userId: $scope.member,
                    activity: "Deployment",
                    dayOffCount: 0,
                    capacityDays: 9,
                    dayOffList: []
                });
            // save capacity
            $scope.saveTeamCapacity();
            $('#modal-detail-member').modal('hide');
            showSuccess(teamCapacityTranslation.SUCCESS_TAB);
        }
    }

    // delete
    $scope.delete = function () {
        var userId = $("#teamCapacity .tb_tree-active").attr('data-id');
        if (userId) {
            $scope.flagDeleteSprint = false;
            callModal("modal-confirm");
        }
        else {
            showError($scope.translation.ERR_SELECT_DATA_DELETE);
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
            $scope.userId = $("#teamCapacity .tb_tree-active").attr('data-id');
            $scope.actionMember = 'delete';
            $scope.saveTeamCapacity();
            showSuccess(teamCapacityTranslation.SUCCESS_DELETE);
        }
    };

    // validateData
    $scope.validateData = function myfunction() {
        var error = null;
        for (var i = 0; i < $scope.currentSprint.capacityList.length; i++) {
            if ($scope.currentSprint.capacityList[i].capacityDays == undefined ||
                $scope.currentSprint.capacityList[i].capacityDays > 24 ||
                $scope.currentSprint.capacityList[i].capacityDays < 1) {
                error = teamCapacityTranslation.ERR_MIN_MAX_CAPACITYDAYS;
                break;
            }
        }
        return error;
    }

    //save team capacity
    $scope.save = function () {
        // save capacity
        $scope.saveTeamCapacity();
        showSuccess(teamCapacityTranslation.SUCCESS_TAB);
    }

    // save capacity
    $scope.saveTeamCapacity = function () {
        var error = $scope.validateData();
        if (error == null) {
            if ($scope.actionMember == 'delete') {
                $scope.currentSprint.capacityList = $.grep($scope.currentSprint.capacityList, function (val) {
                    return val.userId != $scope.userId;
                });
            }

            var params = {
                itemData: $scope.currentSprint
            };

            $scope.postData('api/pm/Sprint/Update_Sprint_TeamCapacity', params, function (data) {
                $scope.$applyAsync(function () {
                    // get current sprint
                    $scope.getCurrentSprint();
                    // sum task list
                    $scope.sumTaskSprint();
                    // action
                    $scope.actionMember = '';
                    // userid
                    $scope.userId = '';
                });
            }, function (error) {
                // get current sprint
                $scope.getCurrentSprint();
                // load data
                $scope.loadData();
                // load list sprint
                $scope.loadListSrpint();
                // sum task list
                $scope.sumTaskSprint();
                // show error
                showError(error);
            });
        }
        else {
            showError(error);
        }
    }

    // sumBusinessDays
    $scope.sumBusinessDays = function (dDate1, dDate2, lstWorkingDay) {
        var _dDate1 = dDate1;
        var _dDate2 = dDate2;
        _dDate2.set('hour', 23);
        _dDate2.set('minute', 59);
        _dDate2.set('second', 59);

        if (moment(_dDate2).isBefore(_dDate1)) return null;

        if (lstWorkingDay == null) lstWorkingDay = angular.copy($scope.currentSprint.workingDayList);
        if (lstWorkingDay == null || lstWorkingDay == undefined) lstWorkingDay = [];

        var sum = 0;
        while (moment(_dDate2).isSameOrAfter(_dDate1)) {
            var dayofweek = moment(_dDate1).day();
            var obj = lstWorkingDay.find(x => x.dayOfWeek == dayofweek && x.selectDay == true)
            if (obj) {
                if (obj.fullDay != null || obj.fullDay != undefined) {
                    sum += 1;
                }
                else {
                    sum += 0.5;
                }
            }
            _dDate1.add(1, "days");
        }
        return sum;
    }

    // load time
    $scope.loadTime = function (displayName, userId) {
        $scope.displayNamePop = displayName;
        $scope.userIdPop = userId;
        $scope.capacity = angular.copy($scope.currentSprint.capacityList.find(x => x.userId == userId));
        if ($scope.capacity == null)
            $scope.capacity = [];
        if ($scope.capacity.dayOffList == null)
            $scope.capacity.dayOffList = [];
        callModal('modal-time');
    }

    // load all time
    $scope.loadTimeAll = function () {
        $scope.displayNamePop = teamCapacityTranslation.TITLE_TEAM_DAYS_OFF;
        $scope.sprintAllDayOffList = angular.copy($scope.currentSprint.allDayOffList);
        if ($scope.sprintAllDayOffList == null)
            $scope.sprintAllDayOffList = [];
        callModal('modal-time-all');
    }

    //add day off
    $scope.addTimeCapacity = function () {
        $scope.capacity.dayOffList.push({ totalDayOff: 1, halfTime: false, startDate: moment().format(), endDate: moment().format() });
    }

    // changeStart
    $scope.changeStartDayOffList = function (index) {
        if ($scope.capacity.dayOffList[index].halfTime) {
            var startDate = $('#dtpStart_' + index).val();
            if (startDate) {
                $('#dtpEnd_' + index).val(startDate);
                var endDate = $('#dtpEnd_' + index).val();

                var totalDay = $scope.sumBusinessDays(moment(startDate, $scope.lFormat), moment(endDate, $scope.lFormat));
                if (totalDay > 0)
                    $scope.capacity.dayOffList[index].totalDayOff = 0.5;
                else
                    $scope.capacity.dayOffList[index].totalDayOff = 0;
            }
        }
        else {
            $scope.sumTotalDayOffList(index);
        }
    }

    // changeEnd
    $scope.changeEndDayOffList = function (index) {
        if ($scope.capacity.dayOffList[index].halfTime) {
            var endDate = $('#dtpEnd_' + index).val();
            if (endDate) {
                $('#dtpStart_' + index).val(endDate);
                var startDate = $('#dtpStart_' + index).val();

                var totalDay = $scope.sumBusinessDays(moment(startDate, $scope.lFormat), moment(endDate, $scope.lFormat));
                if (totalDay > 0)
                    $scope.capacity.dayOffList[index].totalDayOff = 0.5;
                else
                    $scope.capacity.dayOffList[index].totalDayOff = 0;
            }
        }
        else {
            $scope.sumTotalDayOffList(index);
        }
    }

    // changeHalftime
    $scope.changeHalftime = function (index) {
        var element = $("#halftime_" + index);
        if (element.hasClass("bowtie-icon bowtie-checkbox")) {
            element.removeClass("bowtie-icon bowtie-checkbox").addClass("bowtie-icon bowtie-checkbox-empty");
            $scope.capacity.dayOffList[index].halfTime = false;
            $scope.sumTotalDayOffList(index);
        }
        else {
            element.removeClass("bowtie-icon bowtie-checkbox-empty").addClass("bowtie-icon bowtie-checkbox");
            $scope.capacity.dayOffList[index].halfTime = true;
            var startDate = $('#dtpStart_' + index).val();
            var endDate = $('#dtpEnd_' + index).val();
            if (startDate && endDate) {
                $scope.capacity.dayOffList[index].startDate = $scope.capacity.dayOffList[index].endDate;
                $scope.capacity.dayOffList[index].totalDayOff = 0.5;
            }
        }
    }

    // sumTotalDayOffList
    $scope.sumTotalDayOffList = function (index) {
        var startDate = $('#dtpStart_' + index).val();
        var endDate = $('#dtpEnd_' + index).val();

        if (startDate && endDate) {
            if ($scope.capacity.dayOffList[index].halfTime) {
                $scope.capacity.dayOffList[index].totalDayOff = 0.5;
            }
            else {
                var totalDay = $scope.sumBusinessDays(moment(startDate, $scope.lFormat), moment(endDate, $scope.lFormat));
                if (totalDay < 0) {
                    $scope.capacity.dayOffList[index].totalDayOff = 0;
                }
                else {
                    $scope.capacity.dayOffList[index].totalDayOff = totalDay;
                }
            }
        }
    }

    //add day off for all
    $scope.addTimeCapacityAll = function () {
        $scope.sprintAllDayOffList.push({ totalDayOff: 1, halfTime: false, startDate: moment().format(), endDate: moment().format() });
    }

    // changeStartAll
    $scope.changeStartAllDayOffList = function (index) {
        if ($scope.sprintAllDayOffList[index].halfTime) {
            var startDate = $('#dtpStartAll_' + index).val();

            if (startDate) {
                $scope.sprintAllDayOffList[index].startDate = moment(startDate, $scope.lFormat).format("MM/DD/YYYY");
                $scope.sprintAllDayOffList[index].endDate = moment(startDate, $scope.lFormat).format("MM/DD/YYYY");
                $scope.sprintAllDayOffList[index].totalDayOff = 0.5;
            }
        }
        else {
            $scope.sumTotalDayOffListAll(index);
        }
    }

    // changeEndAll
    $scope.changeEndAllDayOffList = function (index) {
        if ($scope.sprintAllDayOffList[index].halfTime) {
            var endDate = $('#dtpEndAll_' + index).val();
            if (endDate) {
                $scope.sprintAllDayOffList[index].startDate = moment(endDate, $scope.lFormat).format("MM/DD/YYYY");
                $scope.sprintAllDayOffList[index].endDate = moment(endDate, $scope.lFormat).format("MM/DD/YYYY");
                $scope.sprintAllDayOffList[index].totalDayOff = 0.5;
            }
        }
        else {
            $scope.sumTotalDayOffListAll(index);
        }
    }

    // changeHalftimeAll
    $scope.changeHalftimeAll = function (index) {
        var element = $("#halftimeAll_" + index);
        if (element.hasClass("bowtie-icon bowtie-checkbox")) {
            element.removeClass("bowtie-icon bowtie-checkbox").addClass("bowtie-icon bowtie-checkbox-empty");
            $scope.sprintAllDayOffList[index].halfTime = false;
            $scope.sumTotalDayOffListAll(index);
        }
        else {
            element.removeClass("bowtie-icon bowtie-checkbox-empty").addClass("bowtie-icon bowtie-checkbox");
            $scope.sprintAllDayOffList[index].halfTime = true;
            var startDate = $('#dtpStartAll_' + index).val();
            var endDate = $('#dtpEndAll_' + index).val();
            if (startDate && endDate) {
                $scope.sprintAllDayOffList[index].startDate = $scope.sprintAllDayOffList[index].endDate;
                $scope.sprintAllDayOffList[index].totalDayOff = 0.5;
            }
        }
    }

    // sumTotalDayOffListAll
    $scope.sumTotalDayOffListAll = function (index) {
        var startDate = $('#dtpStartAll_' + index).val();
        var endDate = $('#dtpEndAll_' + index).val();

        if (startDate && endDate) {
            if ($scope.sprintAllDayOffList[index].halfTime) {
                $scope.sprintAllDayOffList[index].totalDayOff = 0.5;
            }
            else {
                var totalDay = $scope.sumBusinessDays(moment(startDate, $scope.lFormat), moment(endDate, $scope.lFormat));
                if (totalDay < 0) {
                    $scope.sprintAllDayOffList[index].totalDayOff = 0;
                }
                else {
                    $scope.sprintAllDayOffList[index].totalDayOff = totalDay;
                }
            }
        }
    }

    //remove day off
    $scope.removeTimeCapacity = function (item, userId) {
        $scope.capacity.dayOffList = $.grep($scope.capacity.dayOffList, function (val) {
            return val != item;
        });
    }

    //remove day off for all
    $scope.removeTimeCapacityAll = function (item) {
        $scope.sprintAllDayOffList = $.grep($scope.sprintAllDayOffList, function (val) {
            return val != item;
        });
    }

    //save day off
    $scope.saveDayOffList = function (userId) {
        // now
        var now = moment().format("YYYY-MM-DD");
        var total = 0;
        var check = true;
        var error = "";
        $.each($scope.capacity.dayOffList, function (id, val) {
            var valueStart = val.startDate;
            var valueEnd = val.endDate;

            var dateStart = moment(valueStart).format("YYYY-MM-DD");
            var dateEnd = moment(valueEnd).format("YYYY-MM-DD");

            var dateStartSpr = moment($scope.currentSprint.startDate).format("YYYY-MM-DD");
            var dateEndSpr = moment($scope.currentSprint.endDate).format("YYYY-MM-DD");

            var checkValidate = moment(dateStart).isAfter(dateEnd);
            var checkValidateSprint = moment(dateEnd).isAfter(dateEndSpr);
            var checkValidateSprintStart = moment(dateStart).isBefore(dateStartSpr);

            // now
            //var checkValiDateNow = moment(dateStart).isBefore(now);

            if (valueStart == "" || valueEnd == "") {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE_NULL + "</br>";
                check = false;
                return;
            }
            if (checkValidate) {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE + "</br>";
                check = false;
                return;
            }
            if (checkValidateSprint) {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE_SPRINT + "</br>";
                check = false;
                return;
            }
            if (checkValidateSprintStart) {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE_SPRINT + "</br>";
                check = false;
                return;
            }
            // now
            //if (checkValiDateNow) {
            //    error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERROR_INVALIDATE_DATE + "</br>";
            //    check = false;
            //    return;
            //}

            if (id != 0) {
                var _valueStart2 = $('#dtpStart_' + id).val();
                var _valueEnd2 = $('#dtpEnd_' + id).val();
                var _dateStart2 = moment(_valueStart2.substring(6, 10) + "-" + _valueStart2.substring(3, 5) + "-" + _valueStart2.substring(0, 2));
                var _dateEnd2 = moment(_valueEnd2.substring(6, 10) + "-" + _valueEnd2.substring(3, 5) + "-" + _valueEnd2.substring(0, 2));

                var _valueStart = $('#dtpStart_' + (id - 1)).val();
                var _valueEnd = $('#dtpEnd_' + (id - 1)).val();
                var _dateStart = moment(_valueStart.substring(6, 10) + "-" + _valueStart.substring(3, 5) + "-" + _valueStart.substring(0, 2));
                var _dateEnd = moment(_valueEnd.substring(6, 10) + "-" + _valueEnd.substring(3, 5) + "-" + _valueEnd.substring(0, 2));

                while (moment(_dateEnd2.format("YYYY-MM-DD")).isSameOrAfter(_dateStart2.format("YYYY-MM-DD"))) {
                    if (moment(_dateStart2.format("YYYY-MM-DD")).isSameOrAfter(_dateStart.format("YYYY-MM-DD")) &&
                        moment(_dateStart2.format("YYYY-MM-DD")).isSameOrBefore(_dateEnd.format("YYYY-MM-DD"))) {
                        if ($scope.capacity.dayOffList[id - 1].totalDayOff + $scope.capacity.dayOffList[id].totalDayOff > 1) {
                            error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.DAYS + " " + _valueStart2 + " " + teamCapacityTranslation.ALREADY_EXISTS + "</br>";
                            check = false;
                        }
                    }
                    _dateStart2.add(1, "days");
                }
            }

            if (check) {
                total += val.totalDayOff;
            }


        });
        if (check) {
            $scope.currentSprint.capacityList.find(x => x.userId == userId).dayOffCount = total;
            $scope.currentSprint.capacityList.find(x => x.userId == userId).dayOffList = angular.copy($scope.capacity.dayOffList);
            $scope.saveTeamCapacity();
            $('#modal-time').modal('hide');
            showSuccess(teamCapacityTranslation.SUCCESS_TAB);
        }
        else {
            showError(error);
        }
    }

    //save day off all
    $scope.saveDayOffListAll = function () {
        // now
        var now = moment().format("YYYY-MM-DD");
        var total = 0;
        var check = true;
        var error = "";
        $.each($scope.sprintAllDayOffList, function (id, val) {
            var valueStart = val.startDate;
            var valueEnd = val.endDate;

            var dateStart = moment(valueStart).format("YYYY-MM-DD");
            var dateEnd = moment(valueEnd).format("YYYY-MM-DD");

            var dateStartSpr = moment($scope.currentSprint.startDate).format("YYYY-MM-DD");
            var dateEndSpr = moment($scope.currentSprint.endDate).format("YYYY-MM-DD");

            var checkValidate = moment(dateStart).isAfter(dateEnd);
            var checkValidateSprint = moment(dateEnd).isAfter(dateEndSpr);
            var checkValidateSprintStart = moment(dateStart).isBefore(dateStartSpr);

            // now
            //var checkValiDateNow = moment(dateStart).isBefore(now);

            if (valueStart == "" || valueEnd == "") {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE_NULL + "</br>";
                check = false;
                return;
            }
            if (checkValidate) {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE + "</br>";
                check = false;
                return;
            }
            if (checkValidateSprint) {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE_SPRINT + "</br>";
                check = false;
                return;
            }
            if (checkValidateSprintStart) {
                error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERR_DATE_SPRINT + "</br>";
                check = false;
                return;
            }

            // now
            //if (checkValiDateNow) {
            //    error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.ERROR_INVALIDATE_DATE + "</br>";
            //    check = false;
            //    return;
            //}

            if (id != 0) {
                var _valueStart2 = $('#dtpStartAll_' + id).val();
                var _valueEnd2 = $('#dtpEndAll_' + id).val();
                var _dateStart2 = moment(_valueStart2.substring(6, 10) + "-" + _valueStart2.substring(3, 5) + "-" + _valueStart2.substring(0, 2));
                var _dateEnd2 = moment(_valueEnd2.substring(6, 10) + "-" + _valueEnd2.substring(3, 5) + "-" + _valueEnd2.substring(0, 2));

                var _valueStart = $('#dtpStartAll_' + (id - 1)).val();
                var _valueEnd = $('#dtpEndAll_' + (id - 1)).val();
                var _dateStart = moment(_valueStart.substring(6, 10) + "-" + _valueStart.substring(3, 5) + "-" + _valueStart.substring(0, 2));
                var _dateEnd = moment(_valueEnd.substring(6, 10) + "-" + _valueEnd.substring(3, 5) + "-" + _valueEnd.substring(0, 2));

                while (moment(_dateEnd2.format("YYYY-MM-DD")).isSameOrAfter(_dateStart2.format("YYYY-MM-DD"))) {
                    if (moment(_dateStart2.format("YYYY-MM-DD")).isSameOrAfter(_dateStart.format("YYYY-MM-DD")) &&
                        moment(_dateStart2.format("YYYY-MM-DD")).isSameOrBefore(_dateEnd.format("YYYY-MM-DD"))) {
                        error += teamCapacityTranslation.LINE + " " + (id + 1) + " : " + teamCapacityTranslation.DAYS + " " + _valueStart2 + " " + teamCapacityTranslation.ALREADY_EXISTS + "</br>";
                        check = false;
                    }
                    _dateStart2.add(1, "days");
                }
            }

            if (check) {
                total += val.totalDayOff;
            }
        });
        if (check) {
            $scope.currentSprint.allDayOffCount = total;
            $scope.currentSprint.allDayOffList = angular.copy($scope.sprintAllDayOffList);
            $scope.saveTeamCapacity();
            $('#modal-time-all').modal('hide');
            showSuccess(teamCapacityTranslation.SUCCESS_TAB);
        }
        else {
            showError(error);
        }
    }

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
    }

    // save sprint setting popup
    $scope.saveSprintSettingPop = function () {
        // load data sprint setting
        $scope.loadDataSprintSetting();
    }

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
    }

    // --------- end sprint setting ------------

    // Setup add member
    $scope.showAddMember = function () {
        $scope.addMember = {};
        $scope.childScope.memberForm.dataAction('add', $scope.addMember);
    };
    $scope.saveMember = function (action, data) {
        $scope.actionMember == 'add'
        $scope.member = data.userId;
        $scope.saveAddNewMember();
    }
}]);