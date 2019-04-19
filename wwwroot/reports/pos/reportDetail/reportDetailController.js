'use strict';
app.register.controller('reportDetailController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.setting.rowIndex = 0;
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
        $scope.loadItem();
        //$scope.reloadGrid();
        $scope.loadStore();


        $scope.refresh = function () {
            $scope.reloadGrid();
        };
        $scope.clickReport();
        $timeout(function () {
            $scope.timeMark = "1";
            $scope.data.fromDate = moment();
            $scope.data.toDate = moment();
            $scope.data.group = "1";


            $scope.data.report = "2";
            //$("#cmbMajorItem").prop('disabled', true);
            //$("#cmbGroupItem").prop('disabled', true);
            //$("#cmbItem").prop('disabled', true);

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


    $scope.changeCheck = function () {
        $scope.checkCustomer = !$scope.checkCustomer;

        $("#cmbGroupCustomer").prop('disabled', $scope.checkCustomer);
        $("#cmbCategoryCustomer").prop('disabled', $scope.checkCustomer);
        $("#cmbCustomer").prop('disabled', $scope.checkCustomer);
        $("#cmbGroupCustomer").empty();
        $("#cmbCategoryCustomer").empty();
        $("#cmbCustomer").empty();
    };

    $scope.print = function () {
        $scope.data.fromDate1 = $scope.data.fromDate;
        $scope.data.toDate1 = $scope.data.toDate;
        //$scope.data.fromDate1 = $scope.data.fromDate;
        //$scope.data.toDate1 = $scope.data.toDate; 
        $scope.loadData();

    }

   


    $scope.loadData = function () {
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
            group: $scope.data.group
        }

        $scope.postData("api/pos/reportDetail/get", params, function (data) {
            debugger
            if (data) {
                $.each(data, function (index, item) {
                    debugger
                    if ($scope.data.group == "1")
                        item.group = moment(item.createdTime).format("DD/MM/YYYY");//group theo ngày
                    if ($scope.data.group == "2")
                        item.group = moment(item.createdTime).format("MM/YYYY");//group theo tháng
                    if ($scope.data.group == "3")
                        item.group = moment(item.createdTime).format("Q");//group theo quý
                    if ($scope.data.group == "4")
                        item.group = moment(item.createdTime).format("YYYY");//group theo năm
                    if ($scope.data.group == "5")
                        item.group = item.relatedSaleOrder.relatedGroupCust.groupNameCust//group theo nhóm khách hàng
                    if ($scope.data.group == "6")
                        item.group = item.relatedSaleOrder.relatedGroupCust.typeNameCust//group theo loại khách hàng
                    if ($scope.data.group == "7")
                        item.group = item.relatedSaleOrder.relatedGroupCust.custName//group theo khách hàng
                    if ($scope.data.group == "8")
                        item.group = item.relatedSaleOrder.cashierId//group theo thu ngân
                    if ($scope.data.group == "9")
                        item.group = item.relatedSaleOrder.relatedStore.storeName//group theo cửa hàng
                    if ($scope.data.group == "10")
                        item.group = item.relatedSaleOrder.code//group theo số phiếu
                    if ($scope.data.group == "11")
                        item.group = item.relatedItem.relatedGroup.fieldName//group theo ngành hàng
                    if ($scope.data.group == "12")
                        item.group = item.relatedItem.relatedGroup.groupName//group theo nhóm hàng
                    if ($scope.data.group == "13")
                        item.group = item.relatedItem.name//group theo mặt hàng

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
                            if ($scope.data.group == "4")
                                return "<strong>" + "Năm: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "5")
                                return "<strong>" + "Nhóm khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "6")
                                return "<strong>" + "Loại khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "7")
                                return "<strong>" + "Khách hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "8")
                                return "<strong>" + "Thu ngân: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "9")
                                return "<strong>" + "Cửa hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "10")
                                return "<strong>" + "Số phiếu: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "11")
                                return "<strong>" + "Ngành hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "12")
                                return "<strong>" + "Nhóm hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                            if ($scope.data.group == "13")
                                return "<strong>" + "Mặt hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";

                        },
                        sum: [
                        {
                            field: 'quantity', column: 'quantitySale', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity >= 0 && item.chkPromo == false)
                                        tempSum = tempSum + item.quantity
                                });

                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

                            }
                        },
                        {
                            field: 'discAmount', column: 'discAmountSale', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity >= 0 && item.chkPromo == false)
                                        tempSum = tempSum + item.discAmount
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                                //return "Tổng số tuổi: " + group.sum['discAmount']
                            }
                        },
                        {
                            field: 'vatAmount', column: 'vatAmountSale', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity >= 0 && item.chkPromo == false)
                                        tempSum = tempSum + item.vatAmount
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                            }
                        },
                        {
                            field: 'sellingAmount', column: 'sellingAmountSale', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity >= 0 && item.chkPromo == false)
                                        tempSum = tempSum + item.sellingAmount
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                            }
                        },
                        {
                            field: 'quantity', column: 'quantityReturn', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity < 0 && item.chkPromo == false)
                                        tempSum = tempSum + item.quantity
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                            }
                        },
                        {
                            field: 'discAmount', column: 'discAmountReturn', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity < 0 && item.chkPromo == false)
                                        tempSum = tempSum + item.discAmount
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                            }
                        },
                        {
                            field: 'vatAmount', column: 'vatAmountReturn', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity < 0 && item.chkPromo == false)
                                        tempSum = tempSum + item.vatAmount
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                            }
                        },
                        {
                            field: 'sellingAmount', column: 'sellingAmountReturn', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.quantity < 0  && item.chkPromo == false)
                                        tempSum = tempSum + item.sellingAmount
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                            }
                        },
                        {
                            field: 'quantity', column: 'quantityPromo', formatter: function (group, column) {
                                var lstObj = group.group.rows;
                                var tempSum = 0;
                                $.each(lstObj, function (key, item) {
                                    if (item.chkPromo == true)
                                        tempSum = tempSum + item.quantity
                                });
                                return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
                            }
                        }
                    ],
                    }
                ]);
                $scope.grid.setData(data);
            }
        });

        //$scope.postData("api/pos/reportDetail/get", params, function (data) {
        //    if (data) {
        //        //debugger
        //        $.each(data, function (index, item) {
        //            var type = "";
        //            if ($scope.data.group == "1")
        //                type = "DD/MM/YYYY";
        //            if ($scope.data.group == "2")
        //                type = "MM/YYYY";
        //            if ($scope.data.group == "3")
        //                type = "Q";
        //            if ($scope.data.group == "4")
        //                type = "YYYY";
        //            item.group = moment(item.createdTime).format(type);
        //            //item.abc = moment(item.createdTime).format("DD");
        //        });
        //        $scope.grid.setData(data);
        //        $scope.grid.groupDataField({
        //            fieldName: "group",
        //            groupFormat: function (group) {
        //                $.each(group.rows, function (index, row) {
        //                    row.number = index + 1
        //                });
        //                if ($scope.data.group == "1")
        //                    return "<strong>" + "Ngày: " + group.value + " (" + group.count + " rows)" + "</strong>";
        //                if ($scope.data.group == "2")
        //                    return "<strong>" + "Tháng: " + group.value + " (" + group.count + " rows)" + "</strong>";
        //                if ($scope.data.group == "3")
        //                    return "<strong>" + "Quý: " + group.value + " (" + group.count + " rows)" + "</strong>";
        //                if ($scope.data.group == "4")
        //                    return "<strong>" + "Năm: " + group.value + " (" + group.count + " rows)" + "</strong>";
        //                //return "Mốc thời gian: " + group.value + " (" + group.count + " rows)";
        //            },
        //            sum: [
        //                {
        //                    field: 'quantity', column: 'quantitySale', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity >= 0 && item.chkPromo == false)
        //                                tempSum = tempSum + item.quantity
        //                        });
                               
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";

        //                    }
        //                },
        //                {
        //                    field: 'discAmount', column: 'discAmountSale', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity >= 0 && item.chkPromo == false)
        //                                tempSum = tempSum + item.discAmount
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                        //return "Tổng số tuổi: " + group.sum['discAmount']
        //                    }
        //                },
        //                {
        //                    field: 'vatAmount', column: 'vatAmountSale', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity >= 0 && item.chkPromo == false)
        //                                tempSum = tempSum + item.vatAmount
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                    }
        //                },
        //                {
        //                    field: 'sellingAmount', column: 'sellingAmountSale', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity >= 0 && item.chkPromo == false)
        //                                tempSum = tempSum + item.sellingAmount
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                    }
        //                },
        //                {
        //                    field: 'quantity', column: 'quantityReturn', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity < 0 && item.chkPromo == false)
        //                                tempSum = tempSum + item.quantity
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                    }
        //                },
        //                {
        //                    field: 'discAmount', column: 'discAmountReturn', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity < 0 && item.chkPromo == false)
        //                                tempSum = tempSum + item.discAmount
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                    }
        //                },
        //                {
        //                    field: 'vatAmount', column: 'vatAmountReturn', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity < 0 && item.chkPromo == false)
        //                                tempSum = tempSum + item.vatAmount
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                    }
        //                },
        //                {
        //                    field: 'sellingAmount', column: 'sellingAmountReturn', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.quantity < 0  && item.chkPromo == false)
        //                                tempSum = tempSum + item.sellingAmount
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                    }
        //                },
        //                {
        //                    field: 'quantity', column: 'quantityPromo', formatter: function (group, column) {
        //                        var lstObj = group.group.rows;
        //                        var tempSum = 0;
        //                        $.each(lstObj, function (key, item) {
        //                            if (item.chkPromo == true)
        //                                tempSum = tempSum + item.quantity
        //                        });
        //                        return "<strong>" + parseFloat(tempSum).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</strong>";
        //                    }
        //                }
        //            ],


        //            //avg: [
        //            //    { field: 'age', formatter: function (value, column) { } }
        //            //]
        //        });
        //    }
        //});
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




    $scope.loadItem = function () {
        $scope.postData("api/pos/reportDetail/GetListQuantity", null, function (data) {
            $scope.listItem = data;
            $scope.setting.valuelist.listItem = data.map(function (item) {
                return {
                    quantity: item.quantity,
                    chkPromo: item.chkPromo,
                    discAmount: item.discAmount,
                    vatAmount: item.vatAmount,
                    sellingAmount: item.sellingAmount,
                    unitPrice: item.unitPrice

                }
            });



        });
    };



    //$scope.data.fromDate = moment(Date.now());
    //$scope.data.toDate = moment(Date.now()); 

    //$scope.print = function ()
    //{
    //    $scope.data.fromDay1 = $scope.data.fromDay;
    //    $scope.data.toDay1 = $scope.data.toDay; 

    //    $scope.loadData();

    //}


    //$scope.loadData = function () {

    //    var params = {
    //        fromDate: $scope.data.fromDay,
    //        toDate: $scope.data.toDay
    //    }

    //    $scope.postData("api/pos/reportDetail/get", params, function (object) {

    //        $scope.listData = object.data;

    //        $scope.defaultFirstData = $scope.listData == null ? null : $scope.listData[0];

    //        $scope.reloadGrid();


    //    });
    //}

}]);