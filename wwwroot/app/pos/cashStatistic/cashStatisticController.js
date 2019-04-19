'use strict';
app.register.controller('cashStatisticController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.searchValue = "";
    $scope.totalDebit = 0;
    $scope.totalCredit = 0;
    $scope.earlyPeriod = 0;
    $scope.endPeriod = 0;

    $scope.displayFunction = function () {
        $scope.button.filter = true;
        $scope.button.search = false;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $('#full_text_filter').focus();
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
                $scope.setting.valuelist.dateTypeFilter = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id == "1" || x.id == "3" || x.id == "4" || x.id == "5");
            },
        });

        //$scope.setting.valuelist.dateTypeFilter = [{ id: 0, text: 'Ngày' },{ id: 1, text: 'Tháng' }, { id: 2, text: 'Quý' }, { id: 3, text: 'Năm' }];





        $scope.refresh = function () {
            $scope.loadData();
        };

        $scope.search = function (e, type, click) {
            if (click != 1)
                if (e != null && e.keyCode != 13) return;
            if (type == 1)
                $scope.searchValue = $("#full_text_filter").val();
            else
                $scope.searchValue = $("#inputSearch").val();

            $scope.loadData();
        };

        if ($scope.grid) {
            $scope.loadData();
        }

        $(window).resize(function () {
            var width = $("#cashStatistic .white_box").width();
            var height = $("#cashStatistic .white_box").height();
            var box_control = $("#cashStatistic .box_filter").height();

            if ($("#cashStatistic .box_filter").is(":visible")) {
                $('#cashStatistic .tab-content').height(height - 70 - box_control - $('.pos .data-wrapper').height());
            }
            else {
                $('#cashStatistic .tab-content').height(height - 55 - $('.pos .data-wrapper').height());
            }

            $scope.grid.resizeCanvas();
            // $scope.grvWorst.resizeCanvas();
        });
        $(window).resize();

        $timeout(function () {
            $scope.dateTypeFilter = 1;
            $scope.docType = "ALL";
            $scope.dateTypeChange();
        });
    });
    $scope.cmbStoreFilter = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: cashStatisticTranslation.STOREID,
    };
    $scope.searchObject = function () {
        $scope.loadData();
    }
    //function
    $scope.loadData = function () {
        $scope.postData("api/pos/cashStatistic/get", { searchValue: $scope.searchValue, storeFilter: $scope.storeFilter, docType: $scope.docType, dateFrom: $scope.fromDate, dateTo: $scope.toDate }, function (data) {
            $scope.grid.setData(data.data);

            $scope.totalDebit = data.totalDebit;
            $scope.totalCredit = data.totalCredit;
            $scope.earlyPeriod = data.earlyPeriod;
            $scope.endPeriod = data.endPeriod;
        });
    }
    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    }

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

        //$scope.fromDate = fromDate.format();
        //$scope.toDate = toDate.format();
    }


    $scope.dateTypeChange = function () {
        $scope.processDate($scope.dateTypeFilter);
    };

}]);