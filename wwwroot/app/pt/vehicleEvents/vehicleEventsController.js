'use strict';
app.register.controller('vehicleEventsController', ['$scope', '$timeout', 'authService', '$location', function ($scope, $timeout, authService, $location) {
    //init
    $scope.action = 'add';
    $scope.checkBoxShowAll = false;
    $scope.vehicleEventsLogistics = [];
    $scope.vehicleEventsResources = [];
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
            $("#today").blur();
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

        // get vehicleType
        $scope.getVehicleTypes();
        // get user
        $scope.getUser();
        // get department
        $scope.getDepartment();
        // get DepartmentByUserId
        $scope.getDepartmentByUserId();
        // get data
        $scope.getEventData();

        // load data
        $timeout(function () {
            $scope.loadData();
        });

        // search
        $scope.search = function () {
            // get data vehicleEvents event
            $scope.getEventData();
            // reload data
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', $scope.listData);
            $('#calendar').fullCalendar('refetchEvents');
            $('#calendar').fullCalendar('rerenderEvents');
        };

        // refresh
        $scope.refresh = function () {
            $('#inputSearch').val('');
            // get data vehicleEvents event
            $scope.getEventData();
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
        var resources = $scope.vehicleTypes;
        var keyLang = $.cookie("LANG");
        var initialLocaleCode = keyLang === 'vn' ? 'vi' : 'en';
        var slotLabelFormatTopTimelineWeek = moment.localeData().longDateFormat('l');

        $('#calendar').fullCalendar({
            eventOverlap: false,
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
                    title: resourceObj.title,
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
                element[0].innerHTML = '<div class="fc-content"><div class="fc-title" style="color: #fff;padding: 0 15px; box-sizing: border-box">' + '<div style="font-size: 12px;">' + event.title + '</div>' + '<div style="font-size: 12px;">' + event.vehicleTypeRelated.name + '</div>' + '</div></div><div class="fc-bg"></div><div class="fc-resizer fc-start-resizer"></div><div class="fc-resizer fc-end-resizer"></div>';
                var top = $(element[0]).position().top;
                if (top !== 0)
                    top += 16;
                $(element[0]).css('top', top);

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

                $('tr[data-resource-id="' + event.resourceId + '"]').each(function (index) {
                    var length = $scope.listData.filter(x => x.resourceId === event.resourceId && moment(x.startTimeDate).format('DD/MM/YYYY') === moment($scope.today).format('DD/MM/YYYY'))
                        .length;
                    $(this).height(length * 46);
                });
            },
            eventAfterAllRender: function (view) {
                $('.fc-rows tr').each(function (idx) {
                    var resourceId = $(this).attr('data-resource-id');
                    var data = $scope.listData.filter(x => x.resourceId === resourceId && moment(x.startTimeDate).format('DD/MM/YYYY') === moment($scope.today).format('DD/MM/YYYY'));
                    if (data.length === 0) {
                        $(this).height(31);
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
        $('#id_vehicleType').attr("disabled", false);
        $('#id_vehicle').attr("disabled", false);
        $('#id_driver').attr("disabled", false);

        $scope.isArrangeView = false;
        $scope.isComment = false;
        $scope.isUser = true;
        $scope.isArrange = false;
        $scope.isApprove = false;
        $scope.isDelete = false;

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
            vehicleType: resourceObj.id,
            // start time
            startTimeDate: date.format(),
            startTimeDateHours: dateHours < 10 ? '0' + dateHours : dateHours,
            startTimeDateMinutes: dateMinutes < 10 ? '0' + dateMinutes : dateMinutes,
            // end time
            endTimeDate: date.format(),
            endTimeDateHours: endTimeDateHours < 10 ? '0' + endTimeDateHours : endTimeDateHours,
            endTimeDateMinutes: dateMinutes < 10 ? '0' + dateMinutes : dateMinutes,
            // department
            department: angular.copy($scope.department)
        };
        // action
        $scope.action = 'add';
        // readonly Item
        $scope.readonlyItem(false);
        // apply scope
        $scope.$digest();
        callModal('modal-detail');
    };

    // event Click
    $scope.eventClick = function (eventObj) {
        $scope.isDelete = false;
        $('#id_vehicleType').attr("disabled", false);
        $('#id_vehicle').attr("disabled", false);
        $('#id_driver').attr("disabled", false);

        $scope.isArrangeView = false;
        $scope.isArrange = false;
        $scope.isApprove = false;
        $scope.isComment = false;
        $scope.isHistory = true;

        var now = moment();
        now.set('second', 0);
        now.set('millisecond', 0);
        // get data
        var params = {
            id: eventObj.id
        };
        $scope.postData('api/pt/vehicleEvents/getById', params, function (data) {
            $scope.data = data;
            // start time
            $scope.data.startTimeDateHours = $scope.data.startTimeDateHours < 10 ? '0' + $scope.data.startTimeDateHours : $scope.data.startTimeDateHours;
            $scope.data.startTimeDateMinutes = $scope.data.startTimeDateMinutes < 10 ? '0' + $scope.data.startTimeDateMinutes : $scope.data.startTimeDateMinutes;
            // end time
            $scope.data.endTimeDateHours = $scope.data.endTimeDateHours < 10 ? '0' + $scope.data.endTimeDateHours : $scope.data.endTimeDateHours;
            $scope.data.endTimeDateMinutes = $scope.data.endTimeDateMinutes < 10 ? '0' + $scope.data.endTimeDateMinutes : $scope.data.endTimeDateMinutes;
        });

        // check user approves
        var isApprove = $scope.checkUserApproves($scope.data.vehicleType);
        // check user Arrangers
        var isArrange = $scope.checkUserArrangers($scope.data.vehicleType);
        if ($scope.data.creator === authService.user.id)
            $scope.isUser = true;
        else
            $scope.isUser = false;

        // start date < now
        if (moment($scope.data.startTimeDate).isBefore(now)) {
            $scope.isArrange = false;
            $scope.isApprove = false;
            $scope.isComment = false;

            $scope.action = 'view';
            if ($scope.data.status === 'arranged') {
                $scope.isArrangeView = true;
                $scope.$digest();
            }
            // changeVehicleType
            $scope.changeVehicleType();
            // changeVehicle
            $scope.changeVehicle();
            $('#id_vehicleType').attr("disabled", true);
            $('#id_vehicle').attr("disabled", true);
            $('#id_driver').attr("disabled", true);
            // readonly Item
            $scope.readonlyItem(true);
        }
        else {
            // arrange
            if (isArrange) {
                if ($scope.isUser) {
                    if ($scope.data.status === 'pendding') {
                        $scope.isComment = isApprove;
                        $scope.isArrange = false;
                        $scope.isApprove = isApprove;

                        $scope.action = 'edit';
                        // readonly Item
                        $scope.readonlyItem(false);
                    }
                    else if ($scope.data.status === 'reject') {
                        $scope.isComment = false;
                        $scope.isArrange = false;
                        $scope.isApprove = false;

                        $scope.action = 'reSubmit';
                        // readonly Item
                        $scope.readonlyItem(false);
                    }
                    else if ($scope.data.status === 'approve') {
                        $scope.isComment = true;
                        $scope.isArrange = true;
                        $scope.isApprove = isApprove;

                        $scope.action = 'arrange';
                        // changeVehicleType
                        $scope.changeVehicleType();
                        $('#id_vehicleType').attr("disabled", false);
                        // readonly Item
                        $scope.readonlyItem(true);
                    }
                    else if ($scope.data.status === 'arranged') {
                        $scope.isComment = true;
                        $scope.isArrange = true;
                        $scope.isApprove = false;

                        $scope.action = 'arrange';
                        // changeVehicleType
                        $scope.changeVehicleType();
                        $('#id_vehicleType').attr("disabled", false);
                        // readonly Item
                        $scope.readonlyItem(true);
                    }
                    else {
                        $scope.isComment = false;
                        $scope.isArrange = false;
                        $scope.isApprove = false;

                        $scope.action = 'view';
                        if ($scope.data.status === 'arranged') {
                            $scope.isArrangeView = true;
                            $scope.$digest();
                        }
                        // changeVehicleType
                        $scope.changeVehicleType();
                        // changeVehicle
                        $scope.changeVehicle();
                        $('#id_vehicleType').attr("disabled", true);
                        $('#id_vehicle').attr("disabled", true);
                        $('#id_driver').attr("disabled", true);
                        // readonly Item
                        $scope.readonlyItem(true);
                    }
                }
                else {
                    // approve
                    if (isApprove) {
                        if ($scope.data.status === 'pendding') {
                            $scope.action = 'approve';
                            $scope.isComment = true;
                            $scope.isArrange = false;
                            $scope.isApprove = true;

                            $('#id_vehicleType').attr("disabled", true);
                            // readonly Item
                            $scope.readonlyItem(true);
                        }
                        else if ($scope.data.status === 'approve' || $scope.data.status === 'arranged') {
                            $scope.action = 'arrange';
                            $scope.isComment = true;
                            $scope.isArrange = true;
                            $scope.isApprove = false;

                            // changeVehicleType
                            $scope.changeVehicleType();

                            $('#id_vehicleType').attr("disabled", false);
                            // readonly Item
                            $scope.readonlyItem(true);
                        }
                        else {
                            $scope.action = 'view';
                            $scope.isComment = false;
                            $scope.isArrange = false;
                            $scope.isApprove = false;

                            if ($scope.data.status === 'arranged') {
                                $scope.isArrangeView = true;
                                $scope.$digest();
                            }
                            // changeVehicleType
                            $scope.changeVehicleType();
                            // changeVehicle
                            $scope.changeVehicle();
                            $('#id_vehicleType').attr("disabled", true);
                            $('#id_vehicle').attr("disabled", true);
                            $('#id_driver').attr("disabled", true);
                            // readonly Item
                            $scope.readonlyItem(true);
                        }
                    }
                    else {
                        if ($scope.data.status === 'approve' || $scope.data.status === 'arranged') {
                            $scope.action = 'arrange';
                            $scope.isComment = true;
                            $scope.isArrange = true;
                            $scope.isApprove = false;

                            // changeVehicleType
                            $scope.changeVehicleType();
                            $('#id_vehicleType').attr("disabled", false);
                            // readonly Item
                            $scope.readonlyItem(true);
                        }
                        else {
                            $scope.action = 'view';
                            $scope.isComment = false;
                            $scope.isArrange = false;
                            $scope.isApprove = false;

                            if ($scope.data.status === 'arranged') {
                                $scope.isArrangeView = true;
                                $scope.$digest();
                            }
                            // changeVehicleType
                            $scope.changeVehicleType();
                            // changeVehicle
                            $scope.changeVehicle();
                            $('#id_vehicleType').attr("disabled", true);
                            $('#id_vehicle').attr("disabled", true);
                            $('#id_driver').attr("disabled", true);
                            // readonly Item
                            $scope.readonlyItem(true);
                        }
                    }
                }
            }
            // approve
            else if (isApprove) {
                $scope.isArrange = false;
                if ($scope.isUser) {
                    if ($scope.data.status === 'pendding') {
                        $scope.isComment = true;
                        $scope.isApprove = true;
                        $scope.action = 'edit';
                        $('#id_vehicleType').attr("disabled", false);
                        // readonly Item
                        $scope.readonlyItem(false);
                    }
                    else if ($scope.data.status === 'reject') {
                        $scope.isComment = false;
                        $scope.isApprove = false;
                        $scope.action = 'reSubmit';
                        $('#id_vehicleType').attr("disabled", false);
                        // readonly Item
                        $scope.readonlyItem(false);
                    }
                    else if ($scope.data.status === 'approve') {
                        $scope.isComment = false;
                        $scope.isApprove = false;
                        $scope.action = 'view';

                        if ($scope.data.status === 'arranged') {
                            $scope.isArrangeView = true;
                            $scope.$digest();
                        }
                        // changeVehicleType
                        $scope.changeVehicleType();
                        // changeVehicle
                        $scope.changeVehicle();
                        $('#id_vehicleType').attr("disabled", true);
                        $('#id_vehicle').attr("disabled", true);
                        $('#id_driver').attr("disabled", true);
                        // readonly Item
                        $scope.readonlyItem(true);
                    }
                    else {
                        $scope.isComment = false;
                        $scope.isApprove = false;
                        $scope.action = 'view';

                        if ($scope.data.status === 'arranged') {
                            $scope.isArrangeView = true;
                            $scope.$digest();
                        }
                        // changeVehicleType
                        $scope.changeVehicleType();
                        // changeVehicle
                        $scope.changeVehicle();
                        $('#id_vehicleType').attr("disabled", true);
                        $('#id_vehicle').attr("disabled", true);
                        $('#id_driver').attr("disabled", true);
                        // readonly Item
                        $scope.readonlyItem(true);
                    }
                }
                else {
                    if ($scope.data.status === 'pendding') {
                        $scope.action = 'approve';
                        $scope.isComment = true;
                        $scope.isApprove = true;
                    }
                    else {
                        $scope.action = 'view';
                        $scope.isComment = false;
                        $scope.isApprove = false;
                    }

                    // changeVehicleType
                    $scope.changeVehicleType();
                    $('#id_vehicleType').attr("disabled", true);
                    $('#id_vehicle').attr("disabled", true);
                    $('#id_driver').attr("disabled", true);
                    // readonly Item
                    $scope.readonlyItem(true);
                }
            }
            // user
            else if ($scope.isUser) {
                $scope.isArrange = false;
                $scope.isApprove = false;
                $scope.isComment = false;
                if ($scope.data.status === 'pendding') {
                    $scope.action = 'edit';
                    // readonly Item
                    $scope.readonlyItem(false);
                }
                else if ($scope.data.status === 'reject') {
                    $scope.action = 'reSubmit';
                    // readonly Item
                    $scope.readonlyItem(false);
                }
                else {
                    $scope.action = 'view';
                    if ($scope.data.status === 'arranged') {
                        $scope.isArrangeView = true;
                        $scope.$digest();
                    }

                    // changeVehicleType
                    $scope.changeVehicleType();
                    // changeVehicle
                    $scope.changeVehicle();
                    $('#id_vehicleType').attr("disabled", true);
                    $('#id_vehicle').attr("disabled", true);
                    $('#id_driver').attr("disabled", true);
                    // readonly Item
                    $scope.readonlyItem(true);
                }
            }
            // anonymous
            else {
                $scope.action = 'view';
                $scope.isArrange = false;
                $scope.isApprove = false;
                $scope.isComment = false;
                $scope.isUser = false;

                if ($scope.data.status === 'arranged') {
                    $scope.isArrangeView = true;
                    $scope.$digest();
                }

                // changeVehicleType
                $scope.changeVehicleType();
                // changeVehicle
                $scope.changeVehicle();
                $('#id_vehicleType').attr("disabled", true);
                $('#id_vehicle').attr("disabled", true);
                $('#id_driver').attr("disabled", true);
                // readonly Item
                $scope.readonlyItem(true);
            }
        }

        // delete
        if ($scope.data.status !== 'approve' && $scope.data.status !== 'arranged') {
            $scope.isDelete = true;
        }

        // apply scope
        $scope.$digest();
        callModal('modal-detail');
    };

    // get data
    $scope.getEventData = function () {
        var searchValue = $('#inputSearch').val();
        if (!searchValue)
            searchValue = null;
        var params = {
            searchValue: searchValue
        };
        $scope.postData('api/pt/vehicleEvents/Get', params, function (data) {
            if (data) {
                $.each(data, function (idx, item) {
                    item.resourceId = item.vehicleType;
                    item.start = moment(item.startTimeDate).format();
                    item.end = moment(item.endTimeDate).format();
                    if (item.status === 'pendding')
                        item.color = '#f1ba27';
                    else if (item.status === 'approve')
                        item.color = '#5bc0de';
                    else if (item.status === 'arranged')
                        item.color = '#5cb85c';
                    else if (item.status === 'reject')
                        item.color = '#EF4438';
                });
                $scope.listData = data;
            }
        });
    };

    // get department
    $scope.getDepartment = function () {
        $scope.postData('api/sys/company/get', null, function (data) {
            if (data) {
                var dataValueList = data.map(function (item) {
                    return { id: item.id, text: item.name, type: item.type };
                });
                $scope.setting.valuelist.department = dataValueList;
            }
        });
    };

    // get departmentByUserId
    $scope.getDepartmentByUserId = function () {
        var params = {
            userId: authService.user.id
        };
        $scope.postData('api/pt/room/GetDepartmentByUserId', params, function (data) {
            $scope.department = data;
        });
    };

    // get user
    $scope.getUser = function () {
        $scope.postData('api/pt/vehicleEvents/getUser', null, function (data) {
            if (data) {
                $scope.setting.valuelist.secretary = data;
                $scope.setting.valuelist.contact = data;
                $scope.setting.valuelist.participants = data;
            }
        });
    };

    // get vehicleType
    $scope.getVehicleTypes = function () {
        $scope.postData('api/pt/VehicleTypes/get', null, function (data) {
            $scope.vehicleTypes = [];
            $scope.setting.valuelist.vehicleType = [];
            if (data) {
                $.each(data, function (idx, item) {
                    if (item.isActive) {
                        item.title = item.name;
                        item.text = item.name;

                        $scope.vehicleTypes.push(item);
                        $scope.setting.valuelist.vehicleType.push(item);
                    }
                });
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

    // view vehicleEvents approves
    $scope.viewRoomApproves = function (id) {
        var params = {
            id: id
        };
        $scope.postData('api/pt/vehicleEvents/getById', params, function (data) {
            data.participantsText = data.participantsRelated ? data.participantsRelated.map(x => x.displayName).join('; ') : '';
            data.secretaryText = data.secretaryRelated ? data.secretaryRelated.map(x => x.displayName).join('; ') : '';

            if (keyLang === 'en') {
                data.startTimeDateText = moment(data.startTimeDate).format('DD-MMM-YYYY HH:mm');
                data.endTimeDateText = moment(data.endTimeDate).format('DD-MMM-YYYY HH:mm');
            }
            else {
                data.startTimeDateText = moment(data.startTimeDate).format('DD-MM-YYYY HH:mm');
                data.endTimeDateText = moment(data.endTimeDate).format('DD-MM-YYYY HH:mm');
            }

            $scope.data = data;
            // apply scope
            $scope.$digest();
            // call modal
            callModal('modal-view-detail-approves');
        });
    };

    // view vehicleEvents
    $scope.viewRoom = function (id) {
        var params = {
            id: id
        };
        $scope.postData('api/pt/vehicleEvents/getById', params, function (data) {
            $scope.data = data;
            // apply scope
            $scope.$digest();
            // call modal
            callModal('modal-view-detail');
        });
    };

    // check user approves
    $scope.checkUserApproves = function (vehicleTypeId) {
        var res = false;
        var params = {
            userId: authService.user.id,
            vehicleTypeId: vehicleTypeId
        };
        $scope.postData('api/pt/vehicleEvents/CheckUserApproves', params, function (data) {
            res = data;
        });

        return res;
    };

    // check user Arrangers
    $scope.checkUserArrangers = function (vehicleTypeId) {
        var res = false;
        var params = {
            userId: authService.user.id,
            vehicleTypeId: vehicleTypeId
        };
        $scope.postData('api/pt/vehicleEvents/CheckUserArrangers', params, function (data) {
            res = data;
        });

        return res;
    };

    // changeVehicleType
    $scope.changeVehicleType = function () {
        var params = {
            vehicleTypeId: $scope.data.vehicleType
        };
        $scope.postData('api/pt/VehicleTypes/GetVehicles', params, function (data) {
            $.each(data, function (index, value) {
                value.text = value.name;
            });
            $scope.setting.valuelist.vehicle = data;
        });
    };

    // changeVehicle
    $scope.changeVehicle = function () {
        $scope.postData('api/pt/Vehicles/GetDrivers', null, function (data) {
            $scope.setting.valuelist.driver = data;
            var driverDefault = $scope.setting.valuelist.vehicle.find(x => x.id === $scope.data.vehicle);
            if (driverDefault && driverDefault.driver) {
                $scope.setting.valuelist.driver.push({
                    id: driverDefault.driver,
                    text: driverDefault.driverRelated.displayName
                });

                $scope.data.driver = driverDefault.driver;
            }
        });
    };

    // submit
    $scope.submit = function () {
        $scope.action = 'add';
        // save
        $scope.save();
    };

    // resubmit
    $scope.reSubmit = function () {
        $scope.action = 'resubmit';
        // save
        $scope.save();
    };

    // update
    $scope.update = function () {
        $scope.action = 'edit';
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
        else if ($scope.action === 'edit' || $scope.action === 'resubmit') {
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
            showWarning($scope.translation.ERROR_DATE_COMPARE);
            return;
        }

        // Participant Count
        if ($scope.data.participantCount <= 0) {
            showWarning($scope.translation.INVALID_VALUE);
            return;
        }

        // creator
        $scope.data.creator = authService.user.id;

        var params = {
            data: $scope.data
        };
        params.data.start = null;
        params.data.end = null;

        // add
        if ($scope.action === 'add') {
            $scope.postData("api/pt/vehicleEvents/Add", params, function (data) {
                if (data) {
                    // get data vehicleEvents event
                    $scope.getEventData();
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
        // edit
        else if ($scope.action === 'edit') {
            $scope.postData("api/pt/vehicleEvents/Edit", params, function (data) {
                if (data) {
                    // get data vehicleEvents event
                    $scope.getEventData();
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
        else if ($scope.action === 'resubmit') {
            params.data.start = null;
            params.data.end = null;
            $scope.postData("api/pt/vehicleEvents/resubmit", params, function (data) {
                if (data) {
                    // get data vehicleEvents event
                    $scope.getEventData();
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

    // #region apporve

    // approve
    $scope.approve = function () {
        var params = {
            id: $scope.data.id,
            comment: $scope.data.comment
        };
        $scope.postData("api/pt/vehicleEvents/Approve", params, function (data) {
            if (data) {
                // get data vehicleEvents event
                $scope.getEventData();
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
                $('#id_Comment').focus();
            }, 1000);
        }
        else {
            var params = {
                id: $scope.data.id,
                comment: $scope.data.comment
            };
            $scope.postData("api/pt/vehicleEvents/Reject", params, function (data) {
                if (data) {
                    // get data vehicleEvents event
                    $scope.getEventData();
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

    // #region arrangers

    // approveArrangers
    $scope.approveArrangers = function () {
        // vehicle
        if (!$scope.data.vehicle) {
            showError($scope.translation.ERROR_VEHICLE);
            return;
        }
        // driver
        if (!$scope.data.driver) {
            showError($scope.translation.ERROR_DRIVER);
            return;
        }

        var params = {
            data: $scope.data,
            comment: $scope.data.comment
        };
        $scope.postData("api/pt/vehicleEvents/ApproveArrangers", params, function (data) {
            if (data) {
                // get data vehicleEvents event
                $scope.getEventData();
                // reload data
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', $scope.listData);
                $('#calendar').fullCalendar('refetchEvents');
                $('#calendar').fullCalendar('rerenderEvents');

                $('#modal-detail').modal('hide');
                showSuccess($scope.translation.SUCCESS_ARRANGERS);
            }
            else showError($scope.translation.ERROR_ARRANGERS_DB);
        });
    };

    // rejectArrangers
    $scope.rejectArrangers = function () {
        // comment
        if (!$scope.data.comment) {
            showError($scope.translation.ERROR_REQUIRED_COMMENT);
            $timeout(function () {
                $('#id_Comment').focus();
            }, 1000);
        }
        else {
            var params = {
                data: $scope.data,
                comment: $scope.data.comment
            };
            $scope.postData("api/pt/vehicleEvents/RejectArrangers", params, function (data) {
                if (data) {
                    // get data vehicleEvents event
                    $scope.getEventData();
                    // reload data
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', $scope.listData);
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#calendar').fullCalendar('rerenderEvents');

                    $('#modal-detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_REJECT_ARRANGERS);
                }
                else showError($scope.translation.ERROR_REJECT_ARRANGERS_DB);
            });
        }
    };

    // #endregion

    // #region delete

    // delelte
    $scope.delete = function () {
        $scope.isComment = true;
        if (!$scope.data.comment) {
            showWarning($scope.translation.ERROR_REQUIRED_COMMENT);
            $timeout(function () {
                $('#id_Comment').focus();
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
        $scope.postData("api/pt/vehicleEvents/delete", params, function (data) {
            if (data) {
                // get data vehicleEvents event
                $scope.getEventData();
                // reload data
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', $scope.listData);
                $('#calendar').fullCalendar('refetchEvents');
                $('#calendar').fullCalendar('rerenderEvents');

                $('#modal-detail-delete-comment').modal('hide');
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
        $scope.postData("api/pt/vehicleEvents/getHistory", params, function (data) {
            var html = '<tr><th colspan="4" class="text-center text-uppercase">' + $scope.translation.VEHICLE_BROWSING_PROCESS + '</th></tr>';
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
                    _data = data.filter(x => x.action === 'approved' || x.action === 'rejected');
                }
                else if (val.id === 'arrange') {
                    _data = data.filter(x => x.action === 'arranged' || x.action === 'reArranged' || x.action === 'rejectArranged' || x.action === 'reRejectArranged');
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

    // #region print

    // print
    $scope.print = function () {
        var params = {
            id: $scope.data.id
        };
        $scope.postData('api/pt/vehicleEvents/getById', params, function (data) {
            data.labelStartTime = moment(data.startTimeDate).format('l') + ' ' + moment(data.startTimeDate).format('HH:mm');
            data.labelEndTime = moment(data.endTimeDate).format('l') + ' ' + moment(data.endTimeDate).format('HH:mm');
            data.labelParticipants = data.participantsRelated.map(x => x.displayName).join('; ');
            $scope.dataPrint = data;
        });
        $scope.postData("api/pt/vehicleEvents/getHistory", params, function (data) {
            var html = '';
            $.each(data, function (idx, val) {
                var role = '';
                if (val.action === 'new' || val.action === 'edit' || val.action === 'delete' || val.action === 'reSubmit') {
                    role = $scope.setting.valuelist.portalRole.find(x => x.id === 'creator').text;
                }
                else if (val.action === 'approved' || val.action === 'rejected') {
                    role = $scope.setting.valuelist.portalRole.find(x => x.id === 'approve').text;
                }
                else if (val.action === 'arranged' || val.action === 'reArranged' || val.action === 'rejectArranged' || val.action === 'reRejectArranged') {
                    role = $scope.setting.valuelist.portalRole.find(x => x.id === 'arrange').text;
                }

                html += '<tr>'
                    + '<td>' + role + '</td>'
                    + '<td>' + val.actorRelated.displayName + '</td>'
                    + '<td class="text-center">' + (moment(val.createdTime).format('l') + ' ' + moment(val.createdTime).format('HH:mm')) + '</td>'
                    + '<td>' + (val.opinion ? val.opinion : '') + '</td>'
                    + '<td>' + $scope.setting.valuelist.portalAction.find(x => x.id === val.action).text + '</td>'
                    + '</tr>';
                $('#BPMBody').html(html);
            });
        });

        // call modal
        callModal('modal-print');
    };

    // call print
    $scope.callPrint = function () {
        $("#content_print_vehicle").print({});
    };

    // #endregion

    // readonly Item
    $scope.readonlyItem = function (flag) {
        //$('#id_vehicleType').attr("disabled", flag);
        $('#id_secretary').attr("disabled", flag);
        $('#id_startTimeDate').attr('readonly', flag);
        $('#id_startTimeDateHours').attr("disabled", flag);
        $('#id_startTimeDateMinutes').attr("disabled", flag);
        $('#id_endTimeDate').attr('readonly', flag);
        $('#id_endTimeDateHours').attr("disabled", flag);
        $('#id_endTimeDateMinutes').attr("disabled", flag);
        $('#id_department').attr("disabled", flag);
        $('#id_title').attr('readonly', flag);
        $('#id_departure').attr('readonly', flag);
        $('#id_destination').attr('readonly', flag);
        $('#id_contact').attr("disabled", flag);
        $('#id_participantCount').attr('readonly', flag);
        $('#id_participants').attr("disabled", flag);
        $('#id_externalParticipants').attr('readonly', flag);
        $('#id_note').attr('readonly', flag);
    };

    // build content
    function buildContentResourceRender(resourceObj) {
        var html = '<div><b>' + $scope.translation.CAPACITY + ': </b>' + resourceObj.capacity + '</div>';
        if (resourceObj.total)
            html += '<div><b>' + $scope.translation.PARTICIPANTCOUNT + ': </b>' + resourceObj.total + '</div>';
        if (resourceObj.description)
            html += '<div><b>' + $scope.translation.DESCRIPTION + ': </b>' + resourceObj.description + '</div>';
        return html;
    }

    // build event content
    function buildContentEventRender(event) {
        var html = '<div><b>' + $scope.translation.CREATOR + ': </b>' + event.creatorRelated.displayName + '</div>' + '<div><b>' + $scope.translation.STARTTIMEDATE + ': </b>' + (moment(event.startTimeDate).format('l') + ' ' + moment(event.startTimeDate).format('HH:mm')) + '</div>' + '<div><b>' + $scope.translation.ENDTIMEDATE + ': </b>' + (moment(event.endTimeDate).format('l') + ' ' + moment(event.endTimeDate).format('HH:mm')) + '</div>';
        html += '<div><b>' + $scope.translation.DEPARTURE + ': </b>' + event.departure + '</div>';
        html += '<div><b>' + $scope.translation.DESTINATION + ': </b>' + event.destination + '</div>';
        return html;
    }
}]);