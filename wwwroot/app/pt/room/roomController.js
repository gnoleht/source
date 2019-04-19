'use strict';
app.register.controller('roomController', ['$scope', '$timeout', 'authService', '$location', function ($scope, $timeout, authService, $location) {
    //init
    $scope.checkBoxShowAll = false;
    $scope.roomLogistics = [];
    $scope.roomResources = [];
    $scope.typeView = 'timelineDay';
    $scope.typeViewEvent = 'all';
    // locale
    moment.locale(keyLang);
    $scope.today = moment();

    // displayFunction
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.search = true;
        $scope.button.save = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    // $routeChangeSuccess
    $scope.$on('$routeChangeSuccess', function () {
        $scope.authService = authService;

        // document click
        $(document).click(function (e) {
            if (!$(e.target).hasClass("form-control")) {
                $('#today').blur();
                $('#repeatEndDate').blur();
            }
        });

        // value list
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                });

                $scope.setting.valuelist.startTimeDateHours = $.extend(true, {}, $scope.setting.valuelist.hours);
                $scope.setting.valuelist.startTimeDateMinutes = $.extend(true, {}, $scope.setting.valuelist.minutes);
                $scope.setting.valuelist.endTimeDateHours = $.extend(true, {}, $scope.setting.valuelist.hours);
                $scope.setting.valuelist.endTimeDateMinutes = $.extend(true, {}, $scope.setting.valuelist.minutes);
            }
        });
        // value list room repate
        $scope.roomRepeat = [
            {
                id: 'none',
                text: 'NONE',
                isActive: true
            },
            {
                id: 'date',
                text: 'DATE',
                isActive: false
            },
            {
                id: 'week',
                text: 'WEEK',
                isActive: false
            }
        ];
        // get data room event
        $scope.getRomEventData();
        // get DepartmentByUserId
        $scope.getDepartmentByUserId();
        // get roomItem
        $scope.getRoomItem();
        // get getDepartment
        $scope.getDepartment();
        // get OwnerMeeting
        $scope.getOwnerMeeting();

        // load data
        $timeout(function () {
            $scope.loadData();
        });

        // search
        $scope.search = function () {
            // get data room event
            $scope.getRomEventData();
            // reload data
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', $scope.listData);
            $('#calendar').fullCalendar('refetchEvents');
            $('#calendar').fullCalendar('rerenderEvents');
        };

        // refresh
        $scope.refresh = function () {
            $('#inputSearch').val('');
            // get data room event
            $scope.getRomEventData();
            // reload data
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', $scope.listData);
            $('#calendar').fullCalendar('refetchEvents');
            $('#calendar').fullCalendar('rerenderEvents');
        };
    });

    // load data
    $scope.loadData = function () {
        var events = $scope.listData;
        var resources = $scope.roomItem;
        var initialLocaleCode = keyLang === 'vn' ? 'vi' : 'en';
        var slotLabelFormatTopTimelineWeek = moment.localeData().longDateFormat('l');

        $('#calendar').fullCalendar({
            timeFormat: 'HH:mm',
            firstDay: 1,
            nowIndicator: true, // line
            locale: initialLocaleCode,
            height: 'parent',
            minTime: '8:00:00',
            maxTime: '18:00:00',
            now: moment(),
            editable: false, // disable draggable events
            header: false,
            views: {
                timelineDay: {
                    slotDuration: '00:15:00',
                    slotLabelFormat: ['HH:mm']
                },
                timelineWeek: {
                    slotLabelFormat: [
                        slotLabelFormatTopTimelineWeek,
                        'HH:mm'
                    ]
                }
            },
            defaultView: 'timelineDay',

            // resources
            resources: resources,
            resourceAreaWidth: '20%',
            resourceLabelText: 'Rooms',
            resourceRender: function (resourceObj, element) {
                element.find('.fc-cell-text').popover({
                    title: '<b>' + resourceObj.title + '</b>',
                    content: buildContentResourceRender(resourceObj),
                    html: true,
                    trigger: 'hover',
                    placement: 'left',
                    container: 'body',
                    delay: {
                        show: "200",
                        hide: "100"
                    }
                });
            },

            // event
            events: events,
            eventAfterRender: function (event, element, view) {
                element[0].innerHTML = '<div class="fc-content"><div class="fc-title" style="color: #fff;padding: 0 15px; box-sizing: border-box">' + '<div style="font-size: 12px;">' + event.title + '</div>' + '<div style="font-size: 12px;"><i class="fa fa-user"></i> ' + event.displayName + '</div>' + '</div></div><div class="fc-bg"></div><div class="fc-resizer fc-start-resizer"></div><div class="fc-resizer fc-end-resizer"></div>';
                element.popover({
                    html: true,
                    title: event.title,
                    content: buildContentEventRender(event),
                    trigger: 'hover',
                    placement: 'left',
                    container: 'body',
                    delay: {
                        show: "200",
                        hide: "0"
                    }
                });
            },
            eventClick: function (eventObj) {
                // event Click
                $scope.eventClick(eventObj);
            },

            // day click
            dayClick: function (date, jsEvent, view, resourceObj) {
                // day click
                $scope.dayClick(date, resourceObj);
            }
        });

        // go to date
        if ($location.search()["date"]) {
            $scope.today = moment($location.search()["date"], 'YYYY-MM-DD');
            $('#calendar').fullCalendar('gotoDate', $scope.today);
        }

        // set lable check box show all
        $scope.showAll = false;
        var icon = "mr-5 bowtie-icon bowtie-checkbox-empty";
        var html = '<i class="' + icon + '"' +
            'style="font-size:17px;width:10px" ng-click="changeCheckBoxShowAll()"></i>' +
            '<span class="txt_cut">' + $scope.translation.LBL_SHOWALL + '</span>';
        $('tbody tr:first .fc-cell-text').attr('id', 'lblShowAll').html(html);
        addElementToScope("#lblShowAll", $scope);
    };

    // check box show all change date
    $scope.changeCheckBoxShowAll = function () {
        $scope.showAll = !$scope.showAll;
        var minTime = '';
        var maxTime = '1';
        var icon = '';
        if ($scope.showAll === false) {
            icon = "mr-5 bowtie-icon bowtie-checkbox-empty";
            minTime = '08:00:00';
            maxTime = '18:00:00';
        }
        else {
            icon = "mr-5 bowtie-icon bowtie-checkbox";
            minTime = '00:00:00';
            maxTime = '24:00:00';
        }

        var html = '<i class="' + icon + '"' +
            'style="font-size:17px;width:10px" ng-click="changeCheckBoxShowAll()"></i>' +
            '<span class="txt_cut">' + $scope.translation.LBL_SHOWALL + '</span>';

        $('#calendar').fullCalendar('option', {
            minTime: minTime,
            maxTime: maxTime
        });
        $('tbody tr:first .fc-cell-text').attr('id', 'lblShowAll').html(html);
        addElementToScope("#lblShowAll", $scope);
    };

    // day click
    $scope.dayClick = function (date, resourceObj) {
        $scope.isComment = false;
        $scope.isApprove = false;

        var now = moment();
        now.set('second', 0);
        now.set('millisecond', 0);

        // start date < now
        if (moment(date.format("YYYY-MM-DD HH:mm:ss")).isBefore(now.format("YYYY-MM-DD HH:mm:ss"))) {
            showError($scope.translation.ERROR_DATE_START_INSERT);
            return;
        }

        var dateHours = date.get('hour');
        var dateMinutes = date.get('minute');
        var endTimeDateHours = dateHours + 1;

        // data
        $scope.data = {
            status: 'pendding',
            creator: authService.user.displayName,
            roomItem: resourceObj.id,
            // start time
            startTimeDate: date.format(),
            startTimeDateHours: dateHours < 10 ? '0' + dateHours : dateHours,
            startTimeDateMinutes: dateMinutes < 10 ? '0' + dateMinutes : dateMinutes,
            // end time
            endTimeDate: date.format(),
            endTimeDateHours: endTimeDateHours < 10 ? '0' + endTimeDateHours : endTimeDateHours,
            endTimeDateMinutes: dateMinutes < 10 ? '0' + dateMinutes : dateMinutes
        };

        // setRepeat
        $scope.setRepeat('none');

        // department
        $scope.data.department = angular.copy($scope.department);
        // scope
        $scope.data.scope = '1';
        // repeatEndDate
        $scope.data.repeatEndDate = moment();
        // action
        $scope.action = 'add';

        //$scope.$apply(function () {
        //    $scope.data.permission = {};
        //    $scope.data.permission.create = $scope.methodPermission.create != null;
        //});

        //TODO
        $scope.data.permission = {};
        $scope.data.permission.create = true;

        // readonly Item
        $scope.readonlyItem(false);
        // readonly approved field
        $scope.readonlyApprovedField(false);

        // change roomItem
        $scope.changeRoomItem(false);

        // apply scope
        $scope.$digest();

        callModal('modal-detail');
        $("#a_info").click();
    };

    // event Click
    $scope.eventClick = function (eventObj) {
        $scope.isApprove = false;
        $scope.isComment = false;

        var now = moment();
        now.set('second', 0);
        now.set('millisecond', 0);

        var params = {
            id: eventObj.id
        };
        $scope.postData('api/pt/room/getById', params, function (data) {
            data.permission = eventObj.permission;
            $scope.data = data;

            // setRepeat
            $scope.setRepeat(data.repeat);

            // start time
            $scope.data.startTimeDateHours = $scope.data.startTimeDateHours < 10 ? '0' + $scope.data.startTimeDateHours : $scope.data.startTimeDateHours;
            $scope.data.startTimeDateMinutes = $scope.data.startTimeDateMinutes < 10 ? '0' + $scope.data.startTimeDateMinutes : $scope.data.startTimeDateMinutes;
            // end time
            $scope.data.endTimeDateHours = $scope.data.endTimeDateHours < 10 ? '0' + $scope.data.endTimeDateHours : $scope.data.endTimeDateHours;
            $scope.data.endTimeDateMinutes = $scope.data.endTimeDateMinutes < 10 ? '0' + $scope.data.endTimeDateMinutes : $scope.data.endTimeDateMinutes;
        });

        //TODO
        $scope.data.permission = {};
        $scope.data.permission.create = true;
        $scope.data.permission.update = true;
        $scope.data.permission.delete = true;
        $scope.data.permission.approve = true;

        // start date < now
        if (moment($scope.data.startTimeDate).isBefore(now)) {
            $scope.action = 'view';
            $scope.isApprove = false;
            $scope.isComment = false;

            // readonly Item
            $scope.readonlyItem(true);
            // readonly approved field
            $scope.readonlyApprovedField(true);
        }
        else {
            var isUser = false;
            // check user approves
            var isApprove = $scope.checkUserApproves($scope.data.roomItem);
            if ($scope.data.creator === authService.user.id)
                isUser = true;

            // approves
            if (isApprove) {
                if (isUser) {
                    if ($scope.data.status === 'pendding') {
                        $scope.isComment = true;
                        $scope.isApprove = true;
                        $scope.action = 'edit';
                        // readonly Item
                        $scope.readonlyItem(false);
                        // readonly approved field
                        $scope.readonlyApprovedField(false);
                    }
                    else if ($scope.data.status === 'reject') {
                        $scope.isComment = false;
                        $scope.isApprove = false;
                        $scope.action = 'reSubmit';
                        // readonly Item
                        $scope.readonlyItem(false);
                        // readonly approved field
                        $scope.readonlyApprovedField(false);
                    }
                    else if ($scope.data.status === 'approve') {
                        $scope.action = 'approve';
                        $scope.isComment = true;
                        $scope.isApprove = true;
                        // readonly Item
                        $scope.readonlyItem(true);
                        // readonly approved field
                        $scope.readonlyApprovedField(false);
                    }
                    else {
                        $scope.action = 'view';
                        $scope.isComment = false;
                        $scope.isApprove = false;

                        // readonly Item
                        $scope.readonlyItem(true);
                        // readonly approved field
                        $scope.readonlyApprovedField(true);
                    }
                }
                else {
                    if ($scope.data.status === 'pendding') {
                        $scope.action = 'approve';
                        $scope.isComment = true;
                        $scope.isApprove = true;
                        // readonly Item
                        $scope.readonlyItem(true);
                        // readonly approved field
                        $scope.readonlyApprovedField(true);
                    }
                    else if ($scope.data.status === 'approve') {
                        $scope.action = 'approve';
                        $scope.isComment = true;
                        $scope.isApprove = true;
                        // readonly Item
                        $scope.readonlyItem(true);
                        // readonly approved field
                        $scope.readonlyApprovedField(false);
                    }
                    else {
                        $scope.action = 'view';
                        $scope.isComment = false;
                        $scope.isApprove = false;

                        // readonly Item
                        $scope.readonlyItem(true);
                        // readonly approved field
                        $scope.readonlyApprovedField(true);
                    }
                }
            }
            // user
            else if (isUser) {
                $scope.isApprove = false;
                $scope.isComment = false;
                if ($scope.data.status === 'pendding') {
                    $scope.action = 'edit';
                    // readonly Item
                    $scope.readonlyItem(false);
                    // readonly approved field
                    $scope.readonlyApprovedField(false);
                }
                else if ($scope.data.status === 'reject') {
                    $scope.action = 'reSubmit';
                    // readonly Item
                    $scope.readonlyItem(false);
                    // readonly approved field
                    $scope.readonlyApprovedField(false);
                }
                else {
                    $scope.action = 'view';
                    // readonly Item
                    $scope.readonlyItem(true);
                    // readonly approved field
                    $scope.readonlyApprovedField(true);
                }
            }
            // anonymous
            else {
                $scope.action = 'view';
                $scope.isApprove = false;
                $scope.isComment = false;

                // readonly Item
                $scope.readonlyItem(true);
                // readonly approved field
                $scope.readonlyApprovedField(true);
            }
        }

        // change roomItem
        $scope.changeRoomItem(true);
        // apply scope
        $scope.$digest();
        callModal('modal-detail');
        $("#a_info").click();
    };

    // get data
    $scope.getRomEventData = function () {
        //var searchValue = $('#inputSearch').val();
        //if (!searchValue)
        //    searchValue = null;
        //var params = {
        //    searchValue: searchValue
        //};

        $scope.postData('api/pt/room/get', $scope.params, function (data) {
            if (data) {
                $.each(data, function (idx, item) {
                    item.resourceId = item.roomItem;
                    item.start = moment(item.startTimeDate).format();
                    item.end = moment(item.endTimeDate).format();
                    item.displayName = item.ownerMeetingRelated.displayName;
                    if (item.status === 'pendding')
                        item.color = '#f1ba27';
                    else if (item.status === 'approve')
                        item.color = '#00afbe';
                    else if (item.status === 'reject')
                        item.color = '#EF4438';
                });
                $scope.listData = data;
            }
        });
    };

    // get DepartmentByUserId
    $scope.getDepartmentByUserId = function () {
        var params = {
            userId: authService.user.id
        };
        $scope.postData('api/pt/room/getDepartmentByUserId', params, function (data) {
            $scope.department = data;
        });
    };

    // get OwnerMeeting
    $scope.getOwnerMeeting = function () {
        $scope.postData('api/pt/room/GetOwnerMeeting', null, function (data) {
            if (data) {
                $scope.setting.valuelist.ownerMeeting = data;
                $scope.setting.valuelist.requiredParticipants = data;
                $scope.setting.valuelist.participants = data;
            }
        });
    };

    // get roomItem
    $scope.getRoomItem = function () {
        $scope.postData('api/pt/roomItem/GetRoomItem', null, function (data) {
            if (data) {
                $.each(data, function (idx, item) {
                    item.title = item.name;
                    item.text = item.name;
                });

                $scope.roomItem = data;
                $scope.setting.valuelist.roomItem = data;
            }
        });
    };

    // get getDepartment
    $scope.getDepartment = function () {
        $scope.postData('api/sys/Company/get', null, function (data) {
            if (data) {
                $.each(data, function (index, value) {
                    value.text = value.name;
                });
                $scope.setting.valuelist.department = data;
            }
        });
    };

    // config Department
    $scope.configDepartment = {
        templateResult: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.type === '1')
                    color = '#f98f05';
                else if (nodeOpt.type === '2')
                    color = '#fcd036';
                else if (nodeOpt.type === '3')
                    color = '#00b19d';
                else if (nodeOpt.type === '4')
                    color = '#0e62c7';
                return $('<span style="margin-left: ' + nodeOpt.type * 10 + 'px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        },
        templateSelection: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.type === '1')
                    color = '#f98f05';
                else if (nodeOpt.type === '2')
                    color = '#fcd036';
                else if (nodeOpt.type === '3')
                    color = '#00b19d';
                else if (nodeOpt.type === '4')
                    color = '#0e62c7';
                return $('<span style="margin-left: 10px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        }
    };

    // change roomItem
    $scope.changeRoomItem = function (isUpdate) {
        var roomItem = $scope.setting.valuelist.roomItem.find(x => x.id === $scope.data.roomItem);
        // roomLogistics
        $scope.roomLogistics = [];
        $.each(roomItem.roomLogisticsRelated, function (idx, item) {
            if (isUpdate) {
                if ($scope.data.logistics && $scope.data.logistics.includes(item.id))
                    item.isActive = true;
                else
                    item.isActive = false;
            }
            else {
                item.isActive = false;
            }

            $scope.roomLogistics.push({
                id: item.id,
                text: item.name,
                isActive: item.isActive
            });
        });

        // roomResources
        $scope.roomResources = [];
        $.each(roomItem.roomResourcesRelated, function (idx, item) {
            if (isUpdate) {
                if ($scope.data.resources && $scope.data.resources.includes(item.id))
                    item.isActive = true;
                else
                    item.isActive = false;
            }
            else {
                item.isActive = false;
            }

            $scope.roomResources.push({
                id: item.id,
                text: item.name,
                isActive: item.isActive
            });
        });
    };

    // changeRepeat
    $scope.changeRepeat = function (id) {
        if ($scope.action !== 'view') {
            $.each($scope.roomRepeat, function (idx, item) {
                if (item.id === id)
                    item.isActive = true;
                else
                    item.isActive = false;
            });

            if (id === 'none')
                $('#item_repeatEndDate').css('display', 'none');
            else
                $('#item_repeatEndDate').css('display', 'block');
        }
    };

    // setRepeat
    $scope.setRepeat = function (id) {
        $.each($scope.roomRepeat, function (idx, item) {
            if (item.id === id)
                item.isActive = true;
            else
                item.isActive = false;
        });

        if (id === 'none')
            $('#item_repeatEndDate').css('display', 'none');
        else
            $('#item_repeatEndDate').css('display', 'block');
    };

    // changeResources
    $scope.changeResources = function (id) {
        if ($scope.action !== 'editApprove' && $scope.action !== 'isApproveView') {
            $.each($scope.roomResources, function (idx, item) {
                if (item.id === id)
                    item.isActive = !item.isActive;
            });
        }
    };

    // changeLogistics
    $scope.changeLogistics = function (id) {
        if ($scope.action !== 'editApprove' && $scope.action !== 'isApproveView') {
            $.each($scope.roomLogistics, function (idx, item) {
                if (item.id === id)
                    item.isActive = !item.isActive;
            });
        }
    };

    // change view
    $scope.changeView = function (typeView) {
        $scope.typeView = typeView;
        $('#calendar').fullCalendar('changeView', typeView);
        // set lable check box show all
        var icon = '';
        if ($scope.showAll === false) {
            icon = "mr-5 bowtie-icon bowtie-checkbox-empty";
        }
        else {
            icon = "mr-5 bowtie-icon bowtie-checkbox";
        }

        var html = '<i class="' + icon + '"' +
            'style="font-size:17px;width:10px" ng-click="changeCheckBoxShowAll()"></i>' +
            '<span class="txt_cut">' + $scope.translation.LBL_SHOWALL + '</span>';
        $('tbody tr:first .fc-cell-text').attr('id', 'lblShowAll').html(html);
        $scope.showAll = true;
        addElementToScope("#lblShowAll", $scope);
    };

    // change resource event
    $scope.changeResoruceEvent = function (typeView) {
        var dataEvent = [];
        if (typeView === 'my')
            dataEvent = $scope.listData.filter(x => x.creator === authService.user.id);
        else
            dataEvent = $scope.listData;
        $scope.typeViewEvent = typeView;
        // reload view
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', dataEvent);
        $('#calendar').fullCalendar('refetchEvents');
        $('#calendar').fullCalendar('rerenderEvents');
    };

    // prev
    $scope.prev = function () {
        $scope.today = moment($scope.today).add(-1, 'day');
        $('#calendar').fullCalendar('gotoDate', moment($scope.today));
    };

    // next
    $scope.next = function () {
        $scope.today = moment($scope.today).add(1, 'day');
        $('#calendar').fullCalendar('gotoDate', moment($scope.today));
    };

    // changeDay
    $scope.changeDay = function () {
        $('#calendar').fullCalendar('gotoDate', moment($scope.today));
    };

    // check user approves
    $scope.checkUserApproves = function (roomItemId) {
        var res = false;
        var params = {
            userId: authService.user.id,
            roomItemId: roomItemId
        };
        $scope.postData('api/pt/room/CheckUserApproves', params, function (data) {
            res = data;
        });

        return res;
    };

    //set permission
    $scope.setPermission = function (data, permission) {
        $.each($scope.methodPermission, function (method, value) {
            if (value !== "99") data[method] = true;
            else data[method] = data.createdBy === $scope.loginInfo.id;
        });
    };

    // submit
    $scope.submit = function () {
        $scope.action = 'add';
        // save
        $scope.save();
    };

    // update
    $scope.update = function () {
        $scope.action = 'edit';
        // save
        $scope.save();
    };

    // resubmit
    $scope.reSubmit = function () {
        $scope.action = 'resubmit';
        // save
        $scope.save();
    };

    // save
    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        var startTimeDate = moment($scope.data.startTimeDate);
        startTimeDate.set('hour', $scope.data.startTimeDateHours);
        startTimeDate.set('minute', $scope.data.startTimeDateMinutes);
        startTimeDate.set('second', 0);
        startTimeDate.set('millisecond', 0);

        var endTimeDate = moment($scope.data.endTimeDate);
        endTimeDate.set('hour', $scope.data.endTimeDateHours);
        endTimeDate.set('minute', $scope.data.endTimeDateMinutes);
        endTimeDate.set('second', 0);
        endTimeDate.set('millisecond', 0);

        var now = moment();
        now.set('second', 0);
        now.set('millisecond', 0);

        // add
        if ($scope.action === 'add') {
            // start date < now
            if (moment(startTimeDate).isBefore(now)) {
                showError($scope.translation.ERROR_DATE_START_INSERT);
                return;
            }
        }

        // edit
        else if ($scope.action === 'edit' || $scope.action === 'editApprove' || $scope.action === 'resubmit') {
            // start date < now
            if (moment(startTimeDate).isBefore(now)) {
                showError($scope.translation.ERROR_DATE_START_EDIT);
                return;
            }
        }

        // start date == end date
        if (moment(startTimeDate).isSame(endTimeDate)) {
            showError($scope.translation.ERROR_DATE_COMPARE_ISSAME);
            return;
        }

        // start date > end date
        if (moment(startTimeDate).isAfter(endTimeDate)) {
            showError($scope.translation.ERROR_DATE_COMPARE);
            return;
        }

        // repeat
        $scope.data.repeat = $scope.roomRepeat.find(x => x.isActive).id;
        // check end date repeat
        if ($scope.data.repeat !== 'none') {
            if (!$scope.data.repeatEndDate) {
                showError($scope.translation.ERROR_REPEAT_END_DATE);
                return;
            }
        }

        // in one day
        if (moment(startTimeDate).get('date') !== moment(endTimeDate).get('date')) {
            showError($scope.translation.ERROR_IN_ONE_DAY);
            return;
        }

        if ($scope.data.repeat === 'none') {
            $scope.data.repeatEndDate = null;
        }
        else {
            var repeatEndDate = moment($scope.data.repeatEndDate);
            repeatEndDate.set('hour', 0);
            repeatEndDate.set('minute', 0);
            repeatEndDate.set('second', 0);
            repeatEndDate.set('millisecond', 0);

            var now2 = moment();
            now2.set('hour', 0);
            now2.set('minute', 0);
            now2.set('second', 0);
            now2.set('millisecond', 0);

            // start date < now
            if (moment(repeatEndDate).isBefore(now2)) {
                showError($scope.translation.ERROR_DATE_REPEAT);
                return;
            }
        }

        // roomLogistics
        $scope.data.logistics = $scope.roomLogistics.filter(x => x.isActive).map(x => x.id);
        // roomResources
        $scope.data.resources = $scope.roomResources.filter(x => x.isActive).map(x => x.id);
        // creator
        $scope.data.creator = authService.user.id;

        var params = {
            data: $scope.data
        };

        // add
        if ($scope.action === 'add') {
            $scope.postData("api/pt/room/Add", params, function (data) {
                if (data) {
                    // get data room event
                    $scope.getRomEventData();
                    // reload data
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', $scope.listData);
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#calendar').fullCalendar('rerenderEvents');

                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_SUBMIT);
                }
                else showError($scope.translation.ERR_REQUIRED);
            });
        }
        else if ($scope.action === 'edit') {
            params.data.start = null;
            params.data.end = null;
            $scope.postData("api/pt/room/Edit", params, function (data) {
                if (data) {
                    // get data room event
                    $scope.getRomEventData();
                    // reload data
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', $scope.listData);
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#calendar').fullCalendar('rerenderEvents');

                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
                else showError($scope.translation.ERR_REQUIRED);
            });
        }
        else if ($scope.action === 'editApprove') {
            params.data.start = null;
            params.data.end = null;
            if (!$scope.data.reasonEdit)
                showError($scope.translation.ERR_REQUIRED_REASONEDIT);
            else {
                $scope.postData("api/pt/room/EditApprove", params, function (data) {
                    if (data) {
                        // get data room event
                        $scope.getRomEventData();
                        // reload data
                        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar('addEventSource', $scope.listData);
                        $('#calendar').fullCalendar('refetchEvents');
                        $('#calendar').fullCalendar('rerenderEvents');

                        $('#modal-detail-edit-approve').modal('hide');
                        $('#modal-detail').modal('hide');
                        showSuccess($scope.translation.SUCCESS_EDIT_APPROVE);
                    }
                    else showError($scope.translation.HAS_AN_ERROR);
                });
            }
        }
        else if ($scope.action === 'resubmit') {
            params.data.start = null;
            params.data.end = null;
            $scope.postData("api/pt/room/resubmit", params, function (data) {
                if (data) {
                    // get data room event
                    $scope.getRomEventData();
                    // reload data
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', $scope.listData);
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#calendar').fullCalendar('rerenderEvents');

                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_SUBMIT);
                }
                else showError($scope.translation.ERR_REQUIRED);
            });
        }
    };

    // #region delete
    // delelte
    $scope.delete = function () {
        $scope.isComment = true;
        if (!$scope.data.comment) {
            showWarning($scope.translation.ERROR_REQUIRED_COMMENT);
            $timeout(function () {
                $('#comment').focus();
            }, 1000);
        }
        else {
            $('#modal-confirm').modal();
        }
    };

    // delete data
    $scope.deleteData = function () {
        var params = {
            id: $scope.data.id,
            comment: $scope.data.comment
        };
        $scope.postData("api/pt/room/delete", params, function (data) {
            if (data) {
                // get data room event
                $scope.getRomEventData();
                // reload data
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', $scope.listData);
                $('#calendar').fullCalendar('refetchEvents');
                $('#calendar').fullCalendar('rerenderEvents');

                $('#modal-detail').modal('hide');
                showSuccess($scope.translation.SUCCESS_DELETE);
            }
            else showError($scope.translation.ERROR_DELETE);
        });
    };
    // #endregion

    // #region history

    // history
    $scope.history = function () {
        var params = {
            id: $scope.data.id
        };
        $scope.postData("api/pt/room/getHistory", params, function (data) {
            var html = '<tr><th colspan="4" class="text-center text-uppercase">' + $scope.translation.ROOM_REGISTRATION + '</th></tr>';
            html += '<tr class="active text-center">'
                + '<th>' + $scope.translation.EXECUTOR + '</th>'
                + '<th>' + $scope.translation.DATE_FOR_PERFORMANCE + '</th>'
                + '<th>' + $scope.translation.ACTION + '</th>'
                + '<th>' + $scope.translation.OPINION + '</th></tr>';

            $.each($scope.setting.valuelist.portalRole, function (idx, val) {
                var _data = [];
                if (val.id === 'creator') {
                    _data = data.filter(x => x.action === 'new' || x.action === 'edit' || x.action === 'delete' || x.action === 'reSubmit');
                }
                else if (val.id === 'approve') {
                    _data = data.filter(x => x.action === 'approved' || x.action === 'reApproved' || x.action === 'rejected' || x.action === 'reRejected');
                }

                if (_data.length > 0) {
                    html += '<tr><td colspan="4"><strong>' + $scope.translation.STEP + ': ' + val.text + '</strong></td></tr>';
                    $.each(_data, function (index, value) {
                        html += '<tr><td>' + value.actorRelated.displayName + '</td>'
                            + '<td>' + (moment(value.createdTime).format('l') + ' ' + moment(value.createdTime).format('HH:mm'))
                            + '</td>' + '<td>' + $scope.setting.valuelist.portalAction.find(x => x.id === value.action).text
                            + '</td>' + '<td style="color:red;">' + (value.opinion ? value.opinion : '') + '</td></tr>';
                    });
                }
            });

            $('#btlContent').html(html);
            callModal('modal-detail-history');
        });
    };

    // #endregion

    // #region apporve

    // approve
    $scope.approve = function () {
        var params = {
            data: $scope.data,
            comment: $scope.data.comment
        };
        $scope.postData("api/pt/room/Approve", params, function (data) {
            if (data) {
                // get data vehicleEvents event
                $scope.getRomEventData();
                // reload data
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', $scope.listData);
                $('#calendar').fullCalendar('refetchEvents');
                $('#calendar').fullCalendar('rerenderEvents');

                $('#modal-detail').modal('hide');
                showSuccess($scope.translation.SUCCESS_APPROVE);
            }
            else showError($scope.translation.ERROR_APPROVE_DB);
        });
    };

    // reject
    $scope.reject = function () {
        if (!$scope.data.comment) {
            showError($scope.translation.ERROR_REQUIRED_COMMENT);
            $timeout(function () {
                $('#comment').focus();
            }, 1000);
        }
        else {
            var params = {
                data: $scope.data,
                comment: $scope.data.comment
            };
            $scope.postData("api/pt/room/Reject", params, function (data) {
                if (data) {
                    // get data vehicleEvents event
                    $scope.getRomEventData();
                    // reload data
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', $scope.listData);
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#calendar').fullCalendar('rerenderEvents');

                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_REJECT);
                }
                else showError($scope.translation.ERROR_REJECT_DB);
            });
        }
    };

    // #endregion
    // #region readOnly

    // readonly Item
    $scope.readonlyItem = function (flag) {
        // info
        $('#department').attr("disabled", flag);
        $('#title').attr('readonly', flag);
        $('#ownerMeeting').attr("disabled", flag);
        $('#scope').attr("disabled", flag);
        $('#participantCount').attr('readonly', flag);
        // option
        $('#requiredParticipants').attr("disabled", flag);
        $('#participants').attr("disabled", flag);
        $('#preparation').attr('readonly', flag);
        // repeat
        $('#repeatEndDate').attr('disabled', flag);
    };

    // readonly approved field
    $scope.readonlyApprovedField = function (flag) {
        // info
        $('#roomItem').attr("disabled", flag);
        $('#startTimeDate').attr("disabled", flag);
        $('#startTimeDateHours').attr("disabled", flag);
        $('#startTimeDateMinutes').attr("disabled", flag);
        $('#endTimeDate').attr("disabled", flag);
        $('#endTimeDateHours').attr("disabled", flag);
        $('#endTimeDateMinutes').attr("disabled", flag);

        if (flag) {
            $(".input-group-addon").css("background-color", "#e9ecef");
        }
        else {
            $(".input-group-addon").css("background-color", "#fff");
        }
    };

    // #endregion

    // build content
    function buildContentResourceRender(resourceObj) {
        var html = '<div><b>' + $scope.translation.CAPACITY + ': </b>' + resourceObj.capacity + '</div>';
        if (resourceObj.roomResourcesRelated)
            html += '<div><b>' + $scope.translation._RESOURCES + ': </b>' + resourceObj.roomResourcesRelated.map(x => x.name).join(', ') + '</div>';
        if (resourceObj.roomLogisticsRelated)
            html += '<div><b>' + $scope.translation._LOGISTICS + ': </b>' + resourceObj.roomLogisticsRelated.map(x => x.name).join(', ') + '</div>';
        if (resourceObj.description)
            html += '<div><b>' + $scope.translation.DESCRIPTION + ': </b>' + resourceObj.description + '</div>';
        return html;
    }

    // build event content
    function buildContentEventRender(event) {
        var html = '<div><b>' + $scope.translation._OWNERMEETING + ': </b>' + event.displayName + '</div>' + '<div><b>' + $scope.translation.TITLE + ': </b>' + event.title + '</div>';
        html += '<div><b>' + $scope.translation.STARTTIMEDATE + ': </b>' + (moment(event.startTimeDate).format('l') + ' ' + moment(event.startTimeDate).format('HH:mm')) + '</div>' + '<div><b>' + $scope.translation.ENDTIMEDATE + ': </b>' + (moment(event.endTimeDate).format('l') + ' ' + moment(event.endTimeDate).format('HH:mm')) + '</div>'
        return html;
    }

}]);