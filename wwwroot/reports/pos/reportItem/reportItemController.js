'use strict';
app.register.controller('reportItemController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: '/reports/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
                //    var array = ["1", "3", "4", "5"]
                //    $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => array.includes(x.id));
                $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id != null);
            }
        });
        //$scope.loadItem();
        //$scope.reloadGrid();
        $scope.loadStore();


        $scope.refresh = function () {
            $scope.reloadGrid();
        };
        //$scope.clickReport();
        $timeout(function () {
            //mặc định thời gian
            $scope.timeMark = "1";
            $scope.data.fromDate = moment();
            $scope.data.toDate = moment();
            $scope.data.group = "1";

            //mặc định báo cáo
            $scope.data.report = "4";
            $("#cmbMajorItem").prop('disabled', true);
            $("#cmbGroupItem").prop('disabled', true);
            $("#cmbItem").prop('disabled', true);

            //mặc định thống kê
            $scope.data.statistical = "3";
            $scope.setting.a = "3";

        });


        $(window).resize(function () {
            var width = $("#reportDetail .white_box").width();
            var height = $("#reportDetail .white_box").height();

            $('#reportDetail #grvreportDetail').height(height - 75);

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

        $scope.checkCustomer = false;



    });

    //thống kê theo
    $scope.clickStatistic = function () {
        //debugger
        if ($scope.data.statistical == "1") {
            $scope.setting.temp = "1";//ngành hàng
        }
        if ($scope.data.statistical == "2") {
            $scope.setting.temp = "2";//nhóm hàng
        }
        if ($scope.data.statistical == "3") {
            $scope.setting.temp = "3";//mặt hàng
        }
    }

    $scope.clickReport = function () {
        if ($scope.data.report == "1") {
            location.href = "/reports/pos/retailDetail";
        }

        if ($scope.data.report == "2") {
            location.href = "/reports/pos/reportDetail";
        }
        if ($scope.data.report == "3") {
            location.href = "/reports/pos/reportByTime";
        }

        if ($scope.data.report == "4") {
            location.href = "/reports/pos/reportItem";
        }
        if ($scope.data.report == "5") {
            location.href = "/reports/pos/reportCashier"
        }

        if ($scope.data.report == "6") {
            location.href = "/reports/pos/reportCustomer";
        }
        if ($scope.data.report == "7") {
            location.href = "/reports/pos/reportStore";
        }
    }  
    //check khách hàng lẻ thì khóa các combobox thông tin khách hàng
    $scope.changeCheck = function () {
        $scope.checkCustomer = !$scope.checkCustomer;

        $("#cmbGroupCustomer").prop('disabled', $scope.checkCustomer);
        $("#cmbCategoryCustomer").prop('disabled', $scope.checkCustomer);
        $("#cmbCustomer").prop('disabled', $scope.checkCustomer);
        $("#cmbGroupCustomer").empty();
        $("#cmbCategoryCustomer").empty();
        $("#cmbCustomer").empty();
    };
    //click xem báo cáo
    $scope.print = function () {
        $scope.data.fromDate1 = $scope.data.fromDate;
        $scope.data.toDate1 = $scope.data.toDate;
        //$scope.data.fromDate1 = $scope.data.fromDate;
        //$scope.data.toDate1 = $scope.data.toDate; 
   //);
        $scope.loadData();
    }
    
    $scope.loadData = function () {
        //debugger
        $scope.fromHour = $("#fromHour").val();
        $scope.toHour = $("#toHour").val();
        var params = {
            fromDate: $scope.data.fromDate,
            toDate: $scope.data.toDate,
            fromHour: $scope.fromHour,
            toHour: $scope.toHour,
            majorItem: $scope.data.majorItem,
            groupItem: $scope.data.groupItem,
            itemId: $scope.data.item,
            cashier: $scope.data.cashier,
            customer: $scope.data.customer,
            store: $scope.listStoreId,
            groupCustomer: $scope.data.groupCustomer,
            categoryCustomer: $scope.data.categoryCustomer,
            checkCust: $scope.checkCustomer,
            group: $scope.data.group,
            statistical: $scope.data.statistical,
            groupByTime: $scope.data.group
        }
        $scope.postData("api/pos/reportItem/get", params, function (data) {
            debugger
            if (data) {
                $.each(data, function (index, item) {

                    if ($scope.data.group == "1")
                        item.group = moment(item.createdTime).format("DD/MM/YYYY");
                    if ($scope.data.group == "2")
                        item.group = moment(item.createdTime).format("MM/YYYY");
                    if ($scope.data.group == "3")
                        item.group = moment(item.createdTime).format("Q");
                    if ($scope.data.group == "4")
                        item.group = moment(item.createdTime).format("YYYY");
                    if ($scope.data.group == "5")
                        item.group = item.cashierId
                    if ($scope.data.group == "6")
                        item.group = item.groupNameCust
                    if ($scope.data.group == "7")
                        item.group = item.typeNameCust
                    if ($scope.data.group == "8")
                        item.group = item.custName
                    if ($scope.data.group == "9")
                        item.group = item.storeName


                });
                
                $scope.grid.groupDataField([
                    {
                        //fieldName: "group",
                        fieldName: "group",
                        groupFormat: function (group) {
                            
                            $.each(group.rows, function (index, row) { row.number = index + 1 });
                            if ($scope.data.group == "1")
                                return "<strong>" + "Ngày: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "2")
                                return "<strong>" + "Tháng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "3")
                                return "<strong>" + "Quý: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "4")
                                return "<strong>" + "Năm: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "5")
                                return "<strong>" + "Thu ngân: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "6")
                                return "<strong>" + "Nhóm khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "7")
                                return "<strong>" + "Loại khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "8")
                                return "<strong>" + "Khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "9")
                                return "<strong>" + "Cửa hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";


                            //return "Mốc thời gian: " + group.value + " (" + group.count + " rows)";
                        },
                        sum: [
                            {
                                field: 'quantity', column: 'quantity', formatter: function (group, column) {
                                    return "<strong>" + parseFloat(group.sum['quantity']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                                }
                            },
                            {
                                field: 'baseSellAmt', column: 'baseSellAmt', formatter: function (group, column) {
                                    return "<strong>" + parseFloat(group.sum['baseSellAmt']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                                }
                            },
                            {
                                field: 'vatAmount', column: 'vatAmount', formatter: function (group, column) {
                                    return "<strong>" + parseFloat(group.sum['vatAmount']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                                }
                            },
                            {
                                field: 'paidAmount', column: 'paidAmount', formatter: function (group, column) {
                                    //debugger
                                    var lstObj = group.group.rows;
                                    var tempSum = 0;
                                    $.each(lstObj, function (key, item) {
                                        tempSum = tempSum + item.paidAmount
                                    });

                                    return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                                }
                            },

                        ],

                    },
                    //{
                    //    fieldName: "itemId",
                    //    groupFormat: function (group) {
                    //        $.each(group.rows, function (index, row) { row.number = index + 1 });
                    //        return group.rows[0] ? group.rows[0].itemName: '';
                    //    },
                    //    sum: [
                    //        {
                    //            field: 'quantity', column: 'quantity', formatter: function (group, column) {
                    //                return "<strong>" + parseFloat(group.sum['quantity']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                    //            }
                    //        },
                    //        {
                    //            field: 'baseSellAmt', column: 'baseSellAmt', formatter: function (group, column) {
                    //                return "<strong>" + parseFloat(group.sum['baseSellAmt']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                    //            }
                    //        },
                    //        {
                    //            field: 'vatAmount', column: 'vatAmount', formatter: function (group, column) {
                    //                return "<strong>" + parseFloat(group.sum['vatAmount']).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                    //            }
                    //        },
                    //        {
                    //            field: 'relatedSaleOrder', column: 'relatedSaleOrder', formatter: function (group, column) {
                    //                debugger
                    //                var lstObj = group.group.rows;
                    //                var tempSum = 0;
                    //                $.each(lstObj, function (key, item) {
                    //                    tempSum = tempSum + item.paidAmount
                    //                });

                    //                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                    //            }
                    //        },

                    //    ],

                    //},
                ]);
                $scope.grid.setData(data);
            }
        });
    };

    $scope.reloadGrid = function () {
        $scope.loadData();
    };


    //$scope.reloadGrid = function () {

    //    $scope.postData("api/pos/reportDetail/get", null, function (data) {
    //        if (data) {
    //            $scope.grid.setData(data);
    //        }
    //    });
    //};

    $scope.cmbMajorItem = {
        url: 'api/pos/reportDetail/GetListMajorItem',
        allowClear: true,
    };

    $scope.cmbGroupItem = {
        url: 'api/pos/reportDetail/GetListGroupItem',
        allowClear: true,
    };

    $scope.cmbItem = {
        url: 'api/pos/reportDetail/GetListItem',
        allowClear: true,
    };

    $scope.cmbGroupCustomer = {
        url: 'api/pos/reportDetail/GetListGroupCustomer',
        allowClear: true,
    };

    $scope.cmbCategoryCustomer = {
        url: 'api/pos/reportDetail/GetListCategoryCustomer',
        allowClear: true,
    };

    $scope.cmbCustomer = {
        url: 'api/pos/reportDetail/GetListCustomer',
        allowClear: true,
    };

    //$scope.cmbStore = {
    //    url: 'api/pos/reportDetail/GetListStore',
    //    allowClear: true,
    //};

    $scope.loadStore = function () {
        $scope.postNoAsync("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    };

    $scope.cmbCashier = {
        url: 'api/pos/reportDetail/GetListCashier',
        allowClear: true,
    };

    $scope.processDate = function (filter) {
        var currentYear = moment().get('year');

        var fromDate = null;
        var toDate = null;

        if (filter == "1")//Hôm nay
        {
            fromDate = moment();
            toDate = moment();
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

        //$scope.$apply(function () {
        if (!filter) {
            $scope.data.fromDate = null;
            $scope.data.toDate = null;
        }
        else {
            $scope.data.fromDate = fromDate.format();
            $scope.data.toDate = toDate.format();
        }
        // });
    }

    $scope.changeTimeMark = function () {
        $scope.processDate($scope.timeMark);
    };




    //$scope.loadItem = function () {
    //    $scope.postData("api/pos/reportDetail/GetListQuantity", null, function (data) {
    //        $scope.listItem = data;
    //        $scope.setting.valuelist.listItem = data.map(function (item) {
    //            return {
    //                quantity: item.quantity,
    //                chkPromo: item.chkPromo,
    //                discAmount: item.discAmount,
    //                vatAmount: item.vatAmount,
    //                sellingAmount: item.sellingAmount,
    //                unitPrice: item.unitPrice

    //            }
    //        });



    //    });
    //};

}]);