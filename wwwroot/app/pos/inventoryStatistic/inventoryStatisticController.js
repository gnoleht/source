'use strict';
app.register.controller('inventoryStatisticController', ['$scope',"$timeout", function ($scope,$timeout) {


    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });

    }

    //init
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
                var array = ["1", "2", "3", "4", "5"]
                $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => array.includes(x.id));
            },
        });

        if ($scope.grid) {
            $scope.loadUnit();
        }

        if (!$scope.grvWorst) {
            initSlickGrid($scope, 'grvWorst');
        }

        if (!$scope.grvBest) {
            initSlickGrid($scope, 'grvBest');
        }
        
        $scope.refresh = function () {
            $scope.loadData();
        };

        $(window).resize(function () {
            var width = $("#inventoryStatistic .white_box").width();
            var height = $("#inventoryStatistic .white_box").height();
            var box_control = $("#inventoryStatistic .box_filter").height();

            if ($("#inventoryStatistic .box_filter").is(":visible")) {
                $('#inventoryStatistic .tab-content').height(height - 70 - box_control - $('.pos .data-wrapper').height());
            }
            else {
                $('#inventoryStatistic .tab-content').height(height - 55 - $('.pos .data-wrapper').height());
            }

            $scope.grid.resizeCanvas();
            $scope.grvWorst.resizeCanvas();
            $scope.grvBest.resizeCanvas();
        });
        $(window).resize();

        $timeout(function () {
            $scope.storeFilter = null;
            $scope.timeMark = "3";
            $scope.processDate("3");
            $scope.loadData();
            $scope.loadGrid();

            $scope.grid.resizeCanvas();
            $scope.grvWorst.resizeCanvas();
            $scope.grvBest.resizeCanvas();
        });
    });

    $scope.loadUnit = function () {
        $scope.postData("api/pos/UnitOfMeasure/get", null, function (data) {
            $scope.setting.valuelist.listUnit = data;
        });
    };

    $scope.cmbStoreId = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: inventoryStatisticTranslation.STOREID,
    };

    $scope.cmbGroupFilter = {
        url: "api/pos/ItemGroup/GetListComboxbox",
        allowClear: true,
    };

    $scope.cmbItemFilter = {
        url: "api/pos/Item/GetListComboxbox",
        allowClear: true,
    };

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;

        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.delete = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.loadData = function () {
        var params = {
            store: $scope.storeFilter,
            fromDate: $scope.fromDate,
            toDate: $scope.toDate
        }
        $scope.postData("api/pos/InventoryStatistic/GetStatistic", params, function (data) {
            $scope.statistic = data;
        });
    }

    $scope.loadGrid = function () {
        var params = {
            store: $scope.storeFilter,
            fromDate: $scope.fromDate,
            toDate: $scope.toDate
        }

        $scope.postData("api/pos/InventoryStatistic/GetStatisticSell", { store: $scope.storeFilter }, function (data) {
            $scope.grvBest.setData(data.bestSell);
            $scope.grvWorst.setData(data.worstSell);
        });

        $scope.postData("api/pos/InventoryStatistic/GetInventoryStatistic", params, function (data) {
            $scope.grid.setData(data);
        });
    }

    $scope.searchObject = function () {
        $scope.loadData();
        $scope.loadGrid();
    }

    $scope.processDate = function (filter) {
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

        $scope.$apply(function () {
            if (!filter) {
                $scope.fromDate = null;
                $scope.toDate = null;
            }
            else {
                $scope.fromDate = fromDate.format();
                $scope.toDate = toDate.format();
            }
        });       
    }

    $scope.changeTimeMark = function () {
        $scope.processDate($scope.timeMark);
    };  

    $scope.resizeGrid = function () {
        $timeout(function () {
            $scope.grid.resizeCanvas();
            $scope.grvWorst.resizeCanvas();
            $scope.grvBest.resizeCanvas();
        });
      
    };

}]);