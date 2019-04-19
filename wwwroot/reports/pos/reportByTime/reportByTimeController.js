'use strict';
app.register.controller('reportByTimeController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.$on('$routeChangeSuccess', function () {
        //  $scope.setting.rowIndex = 0;
        $.ajax({
            url: '/reports/pos/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
                //var array = ["1", "3", "4", "5", "2", "6", "7", "8", "9", "10", "11", "12","13","14","15","16"]
                //$scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => array.includes(x.id));
                $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id != null);

            }
        });
        $scope.loadStore();
        //$scope.reloadGrid();
        $scope.refresh = function () {
            $scope.reloadGrid();
        };

        $scope.changeReport();
        $timeout(function () {
            $scope.timeMark = "1";
            $scope.data.reportDetail = "3";
            $scope.data.statisticID = "3";
            $scope.data.groupReport = "2";
            $scope.data.fromDate = moment().startOf('day').format();
            $scope.data.toDate = moment().endOf('day').format();


            $("#ItemField").prop('disabled', true);
            $("#ItemGroup").prop('disabled', true);
            $("#Item").prop('disabled', true);


            //$scope.groupID = "1";
        });

        $(window).resize(function () {
            var width = $("#reportByTime .white_box").width();
            var height = $("#reportByTime .white_box").height();

            $('#reportByTime #grvReportByTime').height(height - 75);

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

        $scope.checkCustomer = false;
        $scope.checkReport = $scope.data.reportdetail;



    });

    $scope.reloadGrid = function () {
        $scope.loadData();
    };



    $scope.cmbItemField = {
        url: 'api/pos/retailDetail/GetListItemField',
        allowClear: true,
    }
    $scope.cmbItemGroup = {
        url: 'api/pos/retailDetail/GetListItemGroup',
        allowClear: true,
    }
    $scope.cmbItem = {
        url: 'api/pos/retailDetail/GetListItem',
        allowClear: true,
    }
    $scope.cmbGroup_Cus = {
        url: 'api/pos/retailDetail/GetListCustGroup',
        allowClear: true,
    }
    $scope.cmbType_Cus = {
        url: 'api/pos/retailDetail/GetListCustType',
        allowClear: true,
    }
    $scope.cmbCustomer = {
        url: 'api/pos/retailDetail/GetListCustomer',
        allowClear: true,
    }
    $scope.cmbCashier = {
        url: 'api/pos/retailDetail/GetListUser',
        allowClear: true,
    }
    $scope.store = {
        url: 'api/pos/retailDetail/GetListStore',
        allowClear: true,
    }



    $scope.loadReport = function () {

        //$scope.loadData($scope.data.fromDate, $scope.data.toDate);
        $scope.loadData();
        $scope.data.fromDate1 = $scope.data.fromDate;
        $scope.data.toDate1 = $scope.data.toDate;
    }

    $scope.loadData = function () {
        //$scope.fromHour = $("#fromHour").val();
        //$scope.toHour = $("#toHour").val();
        var params = {

            statisticBy: $scope.data.statisticID,
            groupLable: $scope.data.groupReport,
            fromDate: $scope.data.fromDate,
            toDate: $scope.data.toDate,
            // groupId: $scope.data.groupId,
            fromTime: $scope.fromTime = $("#fromTime").val(),
            toTime: $scope.toTime = $("#toTime").val(),
            customer: $scope.data.customer,
            cashier: $scope.data.cashier,
            customerGroup: $scope.data.group_cus,
            customerType: $scope.data.type_cus,
            store: $scope.listStoreId,
            checkCustomer: $scope.checkCustomer
        }
        $scope.postData("api/pos/reportByTime/get", params, function (data) {
            debugger
            if (data) {
                $scope.grid.setData(data);
                $.each(data, function (index, item) {
                    var groupBy = '';

                    if ($scope.data.groupReport == '1')
                        //debugger
                        item.a = item.cashierId
                    if ($scope.data.groupReport == '2')
                        item.a = item.custName
                    if ($scope.data.groupReport == '3')
                        item.a = item.custGroup
                    if ($scope.data.groupReport == '4')
                        item.a = item.custType
                    if ($scope.data.groupReport == '5')
                        item.a = item.storeName

                });

                $scope.grid.groupDataField([
                    {
                        fieldName: "a",
                        groupFormat: function (group) {
                            debugger;
                            $.each(group.rows, function (index, row) { row.number = index + 1 });

                            if ($scope.data.groupReport == '1')
                                return "<strong>" + "Thu ngân: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.groupReport == '2')
                                return "<strong>" + "Khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.groupReport == '3')
                                return "<strong>" + "Nhóm khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.groupReport == '4')
                                return "<strong>" + "Loại khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.groupReport == '5')
                                return "<strong>" + "Cửa hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                        },
                        sum: [
                            { field: 'bPaidAmount', column: 'bPaidAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['bPaidAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>" } },
                            { field: 'vatAmount', column: 'vatAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['vatAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>" } },
                            { field: 'paidAmount', column: 'paidAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['paidAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>" } },

                            {
                                field: 'vatAmount', column: 'vatAmount', formatter: function (group, column) {
                                    return "<strong>" + parseFloat(group.sum['vatAmount']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                                }
                            },
                            {
                                field: 'paidAmount', column: 'paidAmount', formatter: function (group, column) {
                                    return "<strong>" + parseFloat(group.sum['paidAmount']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                                }
                            },
                        ],
                    },

                ]);

            }
        });
    }
//            //
//    //        //debugger
//    //        var groupBy = '';
//    //        debugger
//    //        if ($scope.data.statisticID == '1')
//    //            groupBy = 'HH';
//    //        if ($scope.data.statisticID == '2')
//    //            groupBy = 'dddd'
//    //        if ($scope.data.statisticID == '3')
//    //            groupBy = 'Q'
//    //        if ($scope.data.statisticID == '4')
//    //            groupBy = 'Y'
//    //        if ($scope.data.statisticID == '5')
//    //            groupBy = 'Y'
//    //        $.each(data, function (index, item) {
//    //            debugger
//    //            item.abcc = moment(item.createdTime).format(groupBy)
//    //        });
//    //        $scope.grid.groupDataField({
//    //            fieldName: "abcc",
//    //            groupFormat: function (group) {
//    //                $.each(group.rows, function (index, row) { row.number = index + 1 });
//    //                debugger;
//    //                if ($scope.data.statisticID == '1')
//    //                    return "<strong>" + "Giờ: " + group.value + " (" + group.count + " rows)" + "</strong>";
//    //                if ($scope.data.statisticID == '2')
//    //                    return "<strong>" + "Thứ: " + group.value + " (" + group.count + " rows)" + "</strong>";
//    //                if ($scope.data.statisticID == '3')
//    //                    return "<strong>" + "Ngày: " + group.value + " (" + group.count + " rows)" + "</strong>";
//    //                if ($scope.data.statisticID == '4')
//    //                    return "<strong>" + "Tháng: " + group.value + " (" + group.count + " rows)" + "</strong>";
//    //            },
//    //            sum: [
//    //                { field: 'bPaidAmount', column: 'bPaidAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['bPaidAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>"} },
//    //                { field: 'vatAmount', column: 'vatAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['vatAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>"} },
//    //                { field: 'paidAmount', column: 'paidAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['paidAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>" } },

//    //            ]
//    //            //avg: [
//    //            //    { field: 'age', formatter: function (value, column) { } }
//    //            //]
//    //        });
//             $.each(data, function (index, item) {
//                 var groupBy = '';
//                 debugger
//                 if ($scope.data.groupReport == '1')
//                     item.abc = item.cashierId
//                 if ($scope.data.groupReport == '2')
//                     item.abc = item.custName
//                 if ($scope.data.groupReport == '3')
//                     item.abc = item.custGroup
//                 if ($scope.data.groupReport == '4')
//                     item.abc = item.custType
//                 if ($scope.data.groupReport == '5')
//                     item.abc = item.storeName
//            });

//        $scope.grid.groupDataField({
//            fieldName: "abc",
//            groupFormat: function (group) {

//                    $.each(group.rows, function (index, row) { row.number = index + 1 });

//                    if ($scope.data.groupReport == '1')
//                        return "<strong>" + "Thu ngân: " + group.value + " (" + group.count + " rows)" + "</strong>";
//                    if ($scope.data.groupReport == '2')
//                        return "<strong>" + "Khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
//                    if ($scope.data.groupReport == '3')
//                        return "<strong>" + "Nhóm khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
//                    if ($scope.data.groupReport == '4')
//                        return "<strong>" + "Loại khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
//                    if ($scope.data.groupReport == '5')
//                        return "<strong>" + "Cửa hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
//                },
//                sum: [
//                    { field: 'bPaidAmount', column: 'bPaidAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['bPaidAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>"} },
//                    { field: 'vatAmount', column: 'vatAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['vatAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>"} },
//                    { field: 'paidAmount', column: 'paidAmount', formatter: function (group, column) { return "<strong>" + "Tổng: " + parseFloat(group.sum['paidAmount']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</strong>" } },

//                ]
//                //avg: [
//                //    { field: 'age', formatter: function (value, column) { } }
//                //]
//            });
//        }
//    });
//}

$scope.processDate = function (filter) {

    var currentYear = moment().get('year');

    var fromDate = null;
    var toDate = null;

    if (filter == "1")//Hôm nay
    {
        fromDate = moment().startOf("day");
        toDate = moment().endOf("day");
    }
    else if (filter == "2")//Tuần này
    {
        fromDate = moment().startOf("week");
        toDate = moment().endOf("week");
    }

    else if (filter == "3")// Tháng này
    {
        fromDate = moment().startOf("month");
        toDate = moment().endOf("month");
    }

    else if (filter == "4") //Quý này
    {
        fromDate = moment().startOf("quarter");
        toDate = moment().endOf("quarter");
    }

    else if (filter == "5")// Năm nay
    {
        fromDate = moment().startOf("year");
        toDate = moment().endOf("year");
    }

    else if (filter == "6") //Quý 1
    {
        fromDate = moment(new Date(currentYear, 0, 1));
        toDate = moment(fromDate).endOf("quarter");
    }

    else if (filter == "7") //Quý 2
    {
        fromDate = moment(new Date(currentYear, 3, 1));
        toDate = moment(fromDate).endOf("quarter");
    }

    else if (filter == "8") //Quý 3
    {
        fromDate = moment(new Date(currentYear, 6, 1));
        toDate = moment(fromDate).endOf("quarter");
    }
    else if (filter == "9") //Quý 4
    {
        fromDate = moment(new Date(currentYear, 9, 1));
        toDate = moment(fromDate).endOf("quarter");
    }
    else if (filter == "10") //6 tháng đầu năm
    {
        fromDate = moment(new Date(currentYear, 0, 1));
        toDate = moment(new Date(currentYear, 0, 1)).add(5, 'M').endOf('month');
    }
    else if (filter == "11") //6 tháng cuối năm
    {
        fromDate = moment(new Date(currentYear, 6, 1));
        toDate = moment(new Date(currentYear, 11, 31));
    }

    else if (filter == "12") //hôm trước
    {
        fromDate = moment().subtract(1, 'days');
        toDate = moment().subtract(1, 'days');
    }

    else if (filter == "13") //tuần trước
    {
        fromDate = moment().subtract(1, 'weeks').startOf("week");
        toDate = moment().subtract(1, 'weeks').endOf("week");
    }

    else if (filter == "14") //tháng trước
    {
        fromDate = moment().subtract(1, 'M').startOf("month");
        toDate = moment().subtract(1, 'M').endOf("month");
    }

    else if (filter == "15") //quý trước
    {
        fromDate = moment().subtract(1, 'Q').startOf("quarter");
        toDate = moment().subtract(1, 'Q').endOf("quarter");
    }

    else if (filter == "16") //năm trước
    {
        fromDate = moment().subtract(1, 'Y').startOf("year");
        toDate = moment().subtract(1, 'Y').endOf("year");
    }

    if (!filter) {
        $scope.fromDate = null;
        $scope.toDate = null;
    }
    else {
        $scope.data.fromDate = fromDate.format();
        $scope.data.toDate = toDate.format();
    }
}

$scope.changeTimeMark = function () {
    $scope.processDate($scope.timeMark);
};

$scope.loadStore = function () {
    $scope.postNoAsync("api/pos/Store/GetList", null, function (data) {
        $scope.setting.valuelist.storeId = data;
    });
};

$scope.changeCheck = function () {
    $scope.checkCustomer = !$scope.checkCustomer;

    $("#Group_Cus").prop('disabled', $scope.checkCustomer);
    $("#Type_Cus").prop('disabled', $scope.checkCustomer);
    $("#Customer").prop('disabled', $scope.checkCustomer);
    $("#Group_Cus").empty();
    $("#Type_Cus").empty();
    $("#Customer").empty();
};
$scope.changeReport = function () {
    if ($scope.data.reportDetail == "1") {
        location.href = "/reports/pos/retailDetail";
    }
    if ($scope.data.reportDetail == "2") {
        location.href = "/reports/pos/reportDetail";
    }
    if ($scope.data.reportDetail == "3") {
        location.href = "/reports/pos/reportByTime";
    }
    if ($scope.data.reportDetail == "4") {
        location.href = "/reports/pos/reportItem";
    }
    if ($scope.data.reportDetail == "5") {
        location.href = "/reports/pos/reportCashier";
    }
    if ($scope.data.reportDetail == "6") {
        location.href = "/reports/pos/reportCustomer";
    }
    if ($scope.data.reportDetail == "7") {
        location.href = "/reports/pos/reportStore";
    }
}
$scope.changeStatistic = function () {
    // $scope.setting.temp = "2"
    if ($scope.data.statisticID == "1") {
        $scope.setting.temp = "1"
    }
    if ($scope.data.statisticID == "2") {
        $scope.setting.temp = "2"
    }
    if ($scope.data.statisticID == "3") {
        $scope.setting.temp = "3"
    }
    if ($scope.data.statisticID == "4") {
        $scope.setting.temp = "4"
    }
    if ($scope.data.statisticID == "5") {
        $scope.setting.temp = "5"
    }
    if ($scope.data.statisticID == "6") {
        $scope.setting.temp = "6"
    }

}
}]);