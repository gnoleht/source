'use strict';
app.register.controller('sprintSettingController', ['$scope', '$location', '$sce', 'authService', '$route', '$window', '$timeout', '$rootScope', function ($scope, $location, $sce, authService, $route, $window, $timeout, $rootScope) {
    // on load
    $scope.onload = function () {
        // init scope 
        $scope.tabNameSetting = 'sprints';
        $scope.listCheckShow = [];
        $scope.currentSprint = {};
        // int setting
        init('sprintSetting', $scope, true);
        // init gird
        if ($scope.grid != null) {
            $scope.grid.editAction = function () {
                // edit sprint setting
                $scope.editSprintSetting();
                $scope.$digest();
            };
            // check is show
            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("checkIsShow")) {
                    var data = $scope.grid.dataView.getItem(args.row);
                    if (data != null) {
                        data.isShow = !data.isShow;
                        $scope.grid.dataView.updateItem(data.id, data);
                        $scope.grid.invalidate();
                        $scope.listCheckShow.push(data);
                    }
                };
            });
        }

        $scope.setting.valuelist.areas = [];
        $.ajax({
            url: 'api/pm/project/getarea',
            type: 'get',
            data: {
                pjid: $scope.menuParams.pjid
            },
            dataType: 'json',
            cache: false,
            async: false,
            success: function (response) {
                $.each(response.data, function (i, val) {
                    var item = {
                        id: val.id,
                        text: val.name
                    };
                    $scope.setting.valuelist.areas.push(item);
                });
            }
        });
    };

    // load data
    $scope.loadData = function (listData, currentSprint, currentProject) {
        if (currentProject)
            $scope.currentProject = currentProject;
        if (currentSprint) {
            $scope.currentSprint = currentSprint;
            $scope.setting.currentSprintId = currentSprint.id;
        }
        if (listData) {
            // sort by end date
            listData.sort(function (a, b) {
                var startDateA = a.startDate;
                var startDateB = b.startDate;
                if (moment(startDateA).isAfter(startDateB)) return -1;
                if (moment(startDateA).isBefore(startDateB)) return 1;
                return 0;
            });
            $scope.grid.setData([]);
            $scope.grid.setData(listData);
            $scope.grid.invalidate();
        }
    }

    // call modal
    $scope.callModal = function (listData, currentSprint, currentProject) {
        if (currentProject)
            $scope.currentProject = currentProject;
        if (currentSprint) {
            $scope.currentSprint = currentSprint;
            $scope.setting.currentSprintId = currentSprint.id;
        }
        if (listData) {
            // sort by end date
            listData.sort(function (a, b) {
                var startDateA = a.startDate;
                var startDateB = b.startDate;
                if (moment(startDateA).isAfter(startDateB)) return -1;
                if (moment(startDateA).isBefore(startDateB)) return 1;
                return 0;
            });
            $scope.grid.setData([]);
            $scope.grid.setData(listData);
            $scope.grid.invalidate();
        }

        callModal("modal-setting");

        $(window).resize(function () {
            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });

        $(window).resize();
    };

    // change tab
    $scope.changeTab = function (tab) {
        $scope.tabNameSetting = tab;
        $('#btnRefreshSprint').show();
        if ($scope.tabNameSetting == "sprints") {
            $('#btnAddSprint').show();
            $('#btnEditSprint').show();
            $('#btnDeleteSprint').show();
        } else {
            $('#btnAddSprint').hide();
            $('#btnEditSprint').hide();
            $('#btnDeleteSprint').hide();
        }
    }

    // save sprint setting
    $scope.saveAndClose = function () {
        if ($scope.tabNameSetting == "sprints") {
            var params = {
                listData: $scope.listCheckShow
            };
            $scope.postData("api/pm/Sprint/UpdateSprints", params, function (data) {
                $scope.listCheckShow = [];
                $('#modal-setting').modal('hide');
                showSuccess($scope.translation.SUCCESS_SAVE_DATA);
                // save and closed parent form
                $scope.$parent.saveAndClose($scope.tabNameSetting);
                // reload menu sprint
                var listSprint = $scope.grid.dataView.getItems();
                $scope.getToogleSprint(listSprint);
            });
        }
        else $scope.saveSprintSettting();
    }

    // reload menu sprint
    $scope.getToogleSprint = function (listData) {
        listData = listData.filter(x => x.isShow == true);
        var spr = $scope.menuParams.spr;
        // sort by end date
        listData.sort(function (a, b) {
            var startDateA = a.startDate;
            var startDateB = b.startDate;
            if (moment(startDateA).isAfter(startDateB)) return -1;
            if (moment(startDateA).isBefore(startDateB)) return 1;
            return 0;
        });

        var url = $location.url();
        //url = decodeURIComponent(url);
        $.each(listData, function (index, item) {
            if (spr)
                item.url = url.replace(spr, item.code);
            else {
                if (url.indexOf('&spr=') == -1)
                    item.url = url + "&spr=" + item.code;
                else
                    item.url = url.replace("&spr=", "&spr=" + item.code);
            }

            // remove action
            item.url = item.url.replace('&action=rejected', '').replace('&action=approved', '');
            // remove result
            item.url = item.url.replace('&result=True', '').replace('&result=False', '');
        });

        $rootScope.$$childHead.data.sprints = listData;
    };

    // save sprint settting
    $scope.saveSprintSettting = function () {
        var obj = $scope.isValidateSprintSetting();
        if (obj == null) {
            $.each($scope.currentSprint.workingDayList, function (index, obj) {
                if (obj.fullDay && obj.fullDay > 0)
                    obj.totalHours = obj.fullDay;
                else
                    obj.totalHours = (obj.morning ? obj.morning : 0) + (obj.afternoon ? obj.afternoon : 0);
            });

            var params = {
                itemData: $scope.currentSprint,
                area: $scope.params.area
            };

            $scope.postData("api/pm/Sprint/Update_Sprint", params, function (data) {
                $('#modal-setting').modal('hide');
                $scope.$parent.saveAndClose($scope.tabNameSetting);
                showSuccess($scope.translation.SUCCESS_SAVE_DATA);
            });
        }
        else showError($scope.translation.ERROR_FIELD + obj.day);
    };

    // validate
    $scope.isValidateSprintSetting = function () {
        var temp = null;
        $.each($scope.currentSprint.workingDayList, function (index, obj) {
            if (obj.selectDay == true && (obj.fullDay == 0 || obj.fullDay == null)
                && (obj.morning == null || obj.morning == 0) && (obj.afternoon == null || obj.afternoon == 0)) {
                temp = obj;
                return;
            }
        });
        return temp;
    }

    // change working day
    $scope.changeWorkingDay = function (item) {
        var element = $("#i_" + item.dayId);
        if (element.hasClass("bowtie-icon bowtie-checkbox")) {
            element.removeClass("bowtie-icon bowtie-checkbox").addClass("bowtie-icon bowtie-checkbox-empty");
            $.each($scope.currentSprint.workingDayList, function (index, obj) {
                if (obj.dayId == item.dayId) {
                    obj.fullDay = null;
                    obj.morning = null;
                    obj.afternoon = null;
                    obj.selectDay = false;
                    return;
                }
            });
        }
        else {
            element.removeClass("bowtie-icon bowtie-checkbox-empty").addClass("bowtie-icon bowtie-checkbox");
            $.each($scope.currentSprint.workingDayList, function (index, obj) {
                if (obj.dayId == item.dayId) {
                    obj.selectDay = true;
                    return;
                }
            });
        }
    };

    // refresh sprint setting
    $scope.refreshSprintSetting = function () {
        $scope.$parent.refreshSprintSetting();
        // reload menu sprint
        var listSprint = $scope.grid.dataView.getItems();
        $scope.getToogleSprint(listSprint);
    }

    // add sprint setting
    $scope.addSprintSetting = function () {
        $scope.dataSprint = {};
        $scope.dataSprint.allDayOffList = [];
        $scope.dataSprint.workingWithbugs = "tasks";
        $scope.dataSprint.approveStatus = "pendding";

        var lstVelocity = $scope.lstSprint.map(function (item) {
            return item.velocity;
        });
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        var totalPoint = lstVelocity.length == 0 ? 0 : lstVelocity.reduce(reducer);
        $scope.dataSprint.velocity = Math.round(totalPoint / $scope.lstSprint.length);

        $scope.dataSprint.productId = $scope.params.pid;

        $scope.dataSprint.projectId = $scope.params.pjid;;
        $scope.dataSprint.isPlan = false;
        $scope.dataSprint.isShow = true;

        if ($scope.lstSprint.length == 0) {
            $scope.dataSprint.startDate = moment();
            $scope.dataSprint.endDate = moment();
            $scope.dataSprint.workingDays = 1;
        }
        else {
            var lengthSprints = $scope.lstSprint.length;
            $scope.dataSprint.startDate = addWeekdays(moment($scope.lstSprint[lengthSprints - 1].endDate), 1);
            $scope.dataSprint.endDate = addWeekdays(moment($scope.lstSprint[lengthSprints - 1].endDate), $scope.lstSprint[lengthSprints - 1].workingDays);
            $scope.dataSprint.workingDays = $scope.lstSprint[lengthSprints - 1].workingDays;
        }

        $scope.actionSetting = 'add';
        callModal('modal-detail-sprint', true, 'txtName_Sprint_Setting');
    };

    // add week days
    function addWeekdays(date, days) {
        while (days > 0) {
            date.add(1, 'days');
            var dayofweek = date.day();
            if (dayofweek != 0 && dayofweek != 6)
                days -= 1;
        }
        return date.format('YYYY-MM-DDTHH:mm:ssZ');
    }

    // change data
    $scope.changeSettingDate = function () {
        var startDate = $scope.dataSprint.startDate;
        var endDate = $scope.dataSprint.endDate;

        if (startDate && endDate) {
            var totalDay = 0;
            if ($scope.actionSetting == 'add') {
                var params = {
                    dDate1: moment(startDate).format(),
                    dDate2: moment(endDate).format(),
                };
                $scope.postData('api/pm/sprint/CalcBusinessDay', params, function (data) {
                    totalDay = data;
                });
            }
            else {
                if ($scope.currentSprint == null) {
                    var params = {
                        dDate1: moment(startDate).format(),
                        dDate2: moment(endDate).format(),
                    };
                    $scope.postData('api/pm/sprint/CalcBusinessDay', params, function (data) {
                        totalDay = data;
                    });
                }
                else {
                    var params = {
                        dDate1: moment(startDate).format(),
                        dDate2: moment(endDate).format(),
                        lstWorkingDay: $scope.editListWorkingDay
                    };
                    $scope.postData('api/pm/sprint/SumBusinessDay', params, function (data) {
                        totalDay = data;
                    });
                }
            }

            if (totalDay <= 0) {
                if (totalDay == -1)
                    showError(sprintPlanTranslation.ERR_DATE);
                $scope.dataSprint.workingDays = null;
            }
            else $scope.dataSprint.workingDays = totalDay;
        }
    }

    // edit sprint setting
    $scope.editSprintSetting = function () {
        $scope.dataSprint = angular.copy($scope.grid.getCurrentData());
        if ($scope.dataSprint == null) {
            showError($scope.translation.ERR_SELECT_DATA_EDIT);
            return;
        }

        // approved
        if ($scope.dataSprint.approveStatus == 'approved' && $scope.currentProject.isApproveSprint == true) {
            showError($scope.translation.ERROR_EDIT_SPRINT_APPROVED);
            return;
        }

        // update past sprint
        //if (moment($scope.dataSprint.endDate).isBefore(moment())) {
        //    showError($scope.translation.ERROR_UPDATE_PAST_SPRINT);
        //    return;
        //}

        $scope.editListWorkingDay = $scope.dataSprint.workingDayList;
        $scope.actionSetting = 'edit';
        callModal('modal-detail-sprint');
    };

    // save sprint setting popup
    $scope.saveSprintSettingPop = function () {
        var temp = checkInputRequired($scope.dataSprint, sprintSettingSetting, sprintSettingTranslation);
        if (temp != true) {
            showError(temp.error);
            return false;
        }

        $scope.dataSprint.startDate = moment($scope.dataSprint.startDate).format();
        $scope.dataSprint.endDate = moment($scope.dataSprint.endDate).format();
        // add
        if ($scope.actionSetting == 'add') {
            var pjid = $scope.params.pjid;
            var area = $scope.params.area;
            // load pj member
            $scope.postNoAsync('api/pm/Member/get?pjid=' + pjid + '&area=' + area + '&module=pj', null, function (data) {
                $scope.dataSprint.capacityList = [];
                if (data) {
                    // pjMember
                    $.each(data.filter(x => x.nonCapacity == false), function (index, obj) {
                        $scope.dataSprint.capacityList.push({
                            UserId: obj.userId,
                            Activity: "Deployment",
                            CapacityDays: 9.0,
                            DayOffCount: 0.0,
                            DayOffList: []
                        });
                    });
                }
            });

            // area
            if (area) {
                $scope.dataSprint.areas = [];
                $scope.dataSprint.areas.push($scope.params.area);
            }

            $scope.postNoAsync("api/pm/Sprint/Add_Sprint", JSON.stringify($scope.dataSprint), function (data) {
                $scope.dataSprint = {};
            });
        }
        // edit
        else {
            var params = {
                itemData: $scope.dataSprint,
                area: $scope.params.area
            };

            $scope.postData("api/pm/Sprint/Update_Sprint", params, function (data) {
                $scope.dataSprint = {};
            });
        }

        $('#modal-detail-sprint').modal('hide');
        showSuccess($scope.translation.SUCCESS_SAVE_DATA);
        $scope.$parent.saveSprintSettingPop();
        // reload menu sprint
        var listSprint = $scope.grid.dataView.getItems();
        $scope.getToogleSprint(listSprint);

    };

    // delete sprint setting
    $scope.deleteSprintSetting = function () {
        $scope.dataSprint = $scope.grid.getCurrentData();
        if ($scope.dataSprint == null) {
            showError($scope.translation.ERR_SELECT_DATA_DELETE);
            return;
        }
        $scope.$parent.flagDeleteSprint = true;
        $('#modal-confirm').modal();
    };

    // delete data
    $scope.deleteSprint = function () {
        var params = {
            area: $scope.params.area,
            itemData: $scope.dataSprint
        };
        $scope.postData("api/pm/Sprint/Delete_Sprint", params, function (data) {
            if ($scope.currentSprint.id == $scope.dataSprint.id) {
                var url = $location.url();
                var spid = $scope.menuParams.spr;
                if (spid != null && spid != '')
                    url = url.replace(spid, '');
                window.location.href = url;
            }

            showSuccess($scope.translation.SUCCESS_DELETE);
            $scope.$parent.deleteSprint();
            // reload menu sprint
            var listSprint = $scope.grid.dataView.getItems();
            $scope.getToogleSprint(listSprint);
        });
    };

}]);