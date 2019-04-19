'use strict';
app.register.controller('vehicleReportsController', ['$scope', '$timeout', function ($scope, $timeout) {
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

    //init
    $scope.badges = [
        { 'color': '#007bff', 'badge': 'primary' },
        { 'color': '#28a745', 'badge': 'success' },
        { 'color': '#17a2b8', 'badge': 'info' },
        { 'color': '#ffc107', 'badge': 'warning' },
        { 'color': '#dc3545', 'badge': 'danger' },
        { 'color': '#6c757d', 'badge': 'secondary' },
        { 'color': '#f8f9fa', 'badge': 'light' },
        { 'color': '#343a40', 'badge': 'dark' }
    ];

    //$routeChangeSuccess
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: 'api/system/getSystemFormat?language=' + keyLang,
            data: null,
            type: "POST",
            contentType: "application/json",
            success: function (response) {
                if (response && !response.isError && response.data) {
                    var data = response.data;
                    accounting.settings = {
                        number: data.number,
                        currency: data.currency
                    };

                    if (data.dateTime && data.dateTime.longDateFormat) {
                        var longDateFormat = {};
                        var dateTimeFormat = data.dateTime.longDateFormat;

                        longDateFormat.L = dateTimeFormat.longDate;
                        longDateFormat.l = dateTimeFormat.shortDate;
                        longDateFormat.LT = dateTimeFormat.longTime;
                        longDateFormat.LTS = dateTimeFormat.shortTime;
                        longDateFormat.LLL = dateTimeFormat.longDateTime;
                        longDateFormat.lll = dateTimeFormat.shortDateTime;
                        data.dateTime.longDateFormat = longDateFormat;

                        moment.updateLocale(keyLang, data.dateTime);
                        // locale
                        moment.locale(keyLang);
                    }
                }
            }
        });

        // get locaiton
        $scope.getLocaiton();
        // get vehicleType
        $scope.getVehicleTypes();
        // get data
        $scope.getEventData();

        // load data
        $timeout(function () {
            $scope.loadData();
        });

        // search
        $scope.search = function () {
            // get data
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
            // get data
            $scope.getEventData();
            // reload data
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', $scope.listData);
            $('#calendar').fullCalendar('refetchEvents');
            $('#calendar').fullCalendar('rerenderEvents');
        };
    });

    // get locaiton
    $scope.getLocaiton = function () {
        $scope.postData('api/pt/location/get', null, function (data) {
            $scope.locations = [];
            if (data) {
                var dataValueList = data.map(function (item) {
                    return { id: item.id, text: item.name };
                });

                $scope.location = data[0].id;
                $scope.setting.valuelist.location = dataValueList;
            }
        });
    };

    // get vehicleType
    $scope.getVehicleTypes = function () {
        var params = {
            location: $scope.location
        };

        $scope.postData('api/pt/VehicleTypes/GetByLocaiton', params, function (data) {
            $scope.vehicleTypes = [];
            if (data) {
                $.each(data, function (idx, item) {
                    if (item.isActive) {
                        item.isCheck = true;
                        item.badge = $scope.badges[idx].badge;
                        item.color = $scope.badges[idx].color;

                        $scope.vehicleTypes.push(item);
                    }
                });
            }
        });
    };

    // get data
    $scope.getEventData = function () {
        var searchValue = $('#inputSearch').val();
        if (!searchValue)
            searchValue = null;

        $scope.vehicleTypeIds = [];
        $.each($scope.vehicleTypes, function (idx, item) {
            if (item.isCheck)
                $scope.vehicleTypeIds.push(item.id);
        });

        var params = {
            searchValue: searchValue,
            location: $scope.location,
            vehicleTypeIds: $scope.vehicleTypeIds
        };

        $scope.postData('api/pt/vehicleEvents/GetReports', params, function (data) {
            if (data) {
                $.each(data, function (idx, item) {
                    item.start = moment(item.startTimeDate).format();
                    item.end = moment(item.endTimeDate).format();
                    item.color = $scope.vehicleTypes.find(x => x.id === item.vehicleType).color;
                });
                $scope.listData = data;
            }
        });
    };

    // load data
    $scope.loadData = function () {
        var events = $scope.listData;
        var initialLocaleCode = keyLang === 'vn' ? 'vi' : 'en';

        $('#calendar').fullCalendar({
            timeFormat: 'HH:mm',
            allDaySlot: false,
            firstDay: 1,
            nowIndicator: true, // line
            locale: initialLocaleCode,
            height: 'parent',
            now: moment(),
            editable: false, // disable draggable events
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month,basicWeek,agendaDay'
            },
            buttonText: {
                month: initialLocaleCode === 'vi' ? 'Tháng' : 'Month',
                week: initialLocaleCode === 'vi' ? 'Tuần' : 'Week',
                day: initialLocaleCode === 'vi' ? 'Ngày' : 'Day'
            },
            views: {
                agendaDay: {
                    slotLabelFormat: ['HH:mm']
                }
            },
            defaultView: 'month',
            // event
            events: events,
            eventClick: function (eventObj) {
                // day click
                // TODO
            },

            // day click
            dayClick: function (date, jsEvent, view, resourceObj) {
                // day click
                // TODO
            }
        });
    };

    // changeIsCheck
    $scope.changeIsCheck = function (id) {
        $.each($scope.vehicleTypes, function (idx, item) {
            if (item.id === id)
                item.isCheck = !item.isCheck;
        });

        // get data
        $scope.getEventData();
        // reload data
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', $scope.listData);
        $('#calendar').fullCalendar('refetchEvents');
        $('#calendar').fullCalendar('rerenderEvents');
    };

    // changeLocation
    $scope.changeLocation = function () {
        // get vehicleType
        $scope.getVehicleTypes();
        // get data
        $scope.getEventData();
        // reload data
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', $scope.listData);
        $('#calendar').fullCalendar('refetchEvents');
        $('#calendar').fullCalendar('rerenderEvents');
    };
}]);