'use strict';
app.register.controller('saleOrderController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.dataFilter = {};
    $scope.dataRootRoot = null;
    $scope.dataChoose = null;
    $scope.dataCalcTotal = null;

    $scope.displayFunction = function () {
        $scope.button.filter = true;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $('#full_text_filter').focus();
        $scope.storeFilter = null;
        $scope.dateFromFilter = null;
        $scope.dateToFilter = null;

    }

    //init
    $scope.searchValue = "";


    $scope.displayFunction = function () {
        $scope.button.filter = true;
        $scope.button.search = false;
        $scope.button.add = false;
        $scope.button.copy = false;
        $scope.button.edit = false;
        $scope.button.delete = false;

        if ($scope.params.code) {
            $scope.button.filter = false;
            $scope.button.search = false;
            $scope.button.refresh = false;
            $scope.button.add = false;
            $scope.button.copy = false;
            $scope.button.edit = false;
            $scope.button.delete = false;
        }
    };

    $scope.$on('$routeChangeSuccess', function () {

        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
                $scope.setting.valuelist.dateTypeFilter = $scope.setting.valuelist.dashboardTimeMark;                
            },
        });
        $scope.dateTypeFilter = 0;
        $scope.dataFilter.dateToFilter = new Date();
        $scope.dataFilter.dateFromFilter = new Date();
        

        $scope.loadDataRoot(1);
        if ($scope.grid) {
            $scope.loadStore();
            $scope.getListCashierId();
            $scope.loadData($scope.dataChoose);
        }
        if (!$scope.grvSaleOrderPair) {
            initSlickGrid($scope, 'grvSaleOrderPair');

            $scope.grvSaleOrderPair.editAction = function (grid, item) { };

            if ($scope.listSaleOrderPair == null)
                $scope.listSaleOrderPair = [];


            if ($scope.dataChoose)
                $scope.loadSaleOrderPair($scope.dataChoose.id);
        }

        $scope.refresh = function () {
            $scope.loadData($scope.dataChoose);
            $scope.loadDataRoot(1);
        };

        $scope.search = function (e, type, click) {
            if (click != 1)
                if (e != null && e.keyCode != 13) return;

            $scope.searchValue = $("#full_text_filter").val();

            $scope.loadDataRoot(1, false, $scope.searchValue);
        };

        $(window).resize(function () {
            var width = $("#saleOrder .white_box").width();
            var height = $("#saleOrder .white_box").height();
            var box_control = $("#saleOrder .box_filter").height();

            if ($("#saleOrder .box_filter").is(":visible")) {
                $('#saleOrder .content_4 dd').height(height - 45 - box_control);
                $('#saleOrder .content_6 .wrapper dd').height(height - 200 - box_control);
            }
            else {
                $('#saleOrder .content_4 dd').height(height - 30);
                $('#saleOrder .content_6 .wrapper dd').height(height - 180);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

        $timeout(function () {
            $("#pageInput").keypress(function (e) {
                if (e != null && e.keyCode != 13) return;
                var page = parseInt($("#pageInput").val());
                if (page > 0 && page <= $scope.dataRoot.totalPage)
                    $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
            });
            $scope.grid.editAction = function (grid, item) { };
        });
        //pageParent
    });

    $scope.getListCashierId = function (search) {
        $scope.postData("api/pos/employee/getList", null, function (data) {
            $scope.setting.valuelist.cashierId = data;
        });

    };

    //cmbEmployee
    $scope.cmbCashierId = {
        url: "api/pos/employee/getList",
        allowClear: true,
    };
    //function   
    $scope.cmbStoreFilter = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: saleOrderTranslation.STOREID,
    };
    //$scope.cmbStoreId = {
    //    url: "api/pos/store/GetListComboxbox",
    //    allowClear: true,
    //};

    //function
    $scope.loadDataRoot = function (page, pageEnd, searchValue, storeFilter, dateFrom, dateTo, id) {
        $scope.postData("api/pos/SaleOrder/GetSaleOrder", { searchValue: searchValue, pageCurrent: page, pageEnd: pageEnd, storeFilter: storeFilter, dateFrom: dateFrom, dateTo: dateTo, code: $scope.params.code }, function (data) {
            $scope.dataChoose = {};
            $scope.dataRoot = data;
            $scope.dataRootRoot = data;
            if (data.data.length > 0) {
                $scope.dataChoose = data.data[0];
                if ($scope.action == 'add')
                    $scope.dataChoose = data.data[data.data.length - 1];
            }
            $scope.chooseSaleOrder($scope.dataChoose);
            if (!$scope.$$phase)
                $scope.$apply();
        });
    };

    $scope.loadData = function (dataChoose) {
        $scope.postData("api/pos/SaleOrder/GetById", { id: dataChoose.id }, function (data) {
            $scope.grid.setData(data);
            $scope.dataCalcTotal = data;

            //load grvSaleOrderPair
            $scope.loadSaleOrderPair(dataChoose.id);

        });
    }
    $scope.loadSaleOrderPair = function (id) {
        $scope.postData("api/pos/SaleOrder/GetSaleOrderPaidById", { id: id }, function (data) {
            $scope.listSaleOrderPair = data;
            if ($scope.grvSaleOrderPair != undefined)
                $scope.grvSaleOrderPair.setData($scope.listSaleOrderPair);
        });
    }
    $scope.loadSaleOrderDetail = function (id) {
        $scope.postData("api/pos/SaleOrder/GetById", { id: id }, function (data) {
            $scope.listSaleOrderDetail = data;
            $scope.grvSaleOrderDetail.setData($scope.listSaleOrderDetail);
        });
    };

    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    }

    $scope.delete = function () {
        if ($scope.data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postNoAsync("api/pos/saleOrder/removeSaleOrder?id=" + $scope.dataChoose.id, null, function (lstDelete) {
            if (lstDelete) {
                if ($scope.dataRootRoot.data.length == 1)
                    $scope.loadDataRoot($scope.dataRoot.pageCurrent - 1, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
                //$scope.loadDataRoot($scope.dataRoot.pageCurrent - 1);
                else
                    $scope.loadDataRoot($scope.dataRoot.pageCurrent, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
                //$scope.loadDataRoot($scope.dataRoot.pageCurrent);
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };



    $scope.chooseSaleOrder = function (item) {
        $('.itemSaleOrder').removeClass('active');
        $("#" + item.id).addClass("active");
        $scope.dataChoose = item;
        $scope.loadData($scope.dataChoose);

    };
    $scope.sum = function (items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    };

    $scope.prev = function (page) {
        if (page > 0)
            $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
    }
    $scope.next = function (page) {
        if (page <= $scope.dataRoot.totalPage)
            $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
    }
    $scope.searchObject = function () {
        //var dataFilter = [];
        //dataFilter = $.extend(true, [], $scope.dataRootRoot.data);

        //if ($scope.storeFilter != undefined && $scope.storeFilter != null)
        //    dataFilter = dataFilter.filter(x => x.storeId == $scope.storeFilter);


        //$scope.dataRoot.data = dataFilter;
        $scope.loadDataRoot(1, false, '', $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
    }
    $scope.dateTypeChange = function () {
        var temp = $scope.dateTypeFilter;
        if (temp) {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            if (temp == 0) {
                $scope.dataFilter.dateToFilter = date;
                $scope.dataFilter.dateFromFilter = date;
            }
            else if (temp == 1) {
                $scope.dataFilter.dateToFilter = lastDay;
                $scope.dataFilter.dateFromFilter = firstDay;
            }
            else if (temp == 2) {
                var thisMonth = date.getMonth() + 1;

                if (1 <= thisMonth <= 3) {
                    $scope.dataFilter.dateFromFilter = new Date(date.getFullYear(), 0, 1);
                    $scope.dataFilter.dateToFilter = new Date(date.getFullYear(), 3, 0);
                }
                if (4 <= thisMonth <= 6) {
                    $scope.dataFilter.dateFromFilter = new Date(date.getFullYear(), 3, 1);
                    $scope.dataFilter.dateToFilter = new Date(date.getFullYear(), 6, 0);
                }
                if (7 <= thisMonth <= 9) {
                    $scope.dataFilter.dateFromFilter = new Date(date.getFullYear(), 6, 1);
                    $scope.dataFilter.dateToFilter = new Date(date.getFullYear(), 9, 0);
                }
                if (10 <= thisMonth <= 12) {
                    $scope.dataFilter.dateFromFilter = new Date(date.getFullYear(), 9, 1);
                    $scope.dataFilter.dateToFilter = new Date(date.getFullYear(), 12, 0);
                }
            }
            else if (temp == 3) {
                firstDay = new Date(date.getFullYear(), 0, 1);
                lastDay = new Date(date.getFullYear(), 12, 0);
                $scope.dataFilter.dateFromFilter = firstDay;
                $scope.dataFilter.dateToFilter = lastDay;
            }
        }
        else {
            $scope.dataFilter.dateToFilter = null;
            $scope.dataFilter.dateFromFilter = null;
        }

        $scope.$apply();
    }
}]);