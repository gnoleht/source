'use strict';
app.register.controller('dashboardCostProfitController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.dataDashboardTop = null;

    $scope.displayFunction = function () {
        $scope.button.filter = false;
        $scope.button.search = false;
        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.copy = false;
        $scope.button.delete = false;

        //$scope.button = null;

    };

    //init
    $scope.$on('$routeChangeSuccess', function () {
        init('dashboardCostProfit', $scope, true);
        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
                $scope.setting.valuelist.costProfitByDayFilter = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id != "1" && x.id != "2" && x.id != "12" && x.id != "13");
            },
        });

        //$scope.loadStore();
        $timeout(function () {
            $scope.costProfitByDayFilter = "5";
            $scope.loadData([]);
            $scope.runLoaded();
        })

    });

    $scope.loadData = function (listStore) {
        $scope.listStore = listStore;
        $scope.processDate($scope.costProfitByDayFilter);
        $scope.loadDashboard();
    };


    //chartDashboardCostProfit
    $scope.loadDashboard = function () {
        
        var params = {
            listStore: $scope.listStore,
            startDate: $scope.fromDate,
            endDate: $scope.toDate
        }

        $scope.postData("api/pos/dashboardPOS/getDashboardCostProfit", params, function (data) {
            $scope.data = data;
            var labels = data.map(function (item) {
                return $scope.setting.valuelist.titleMonth.find(x => x.id == item.labels).text;
            });
            var revenues = data.map(function (item) {
                return item.revenues;
            });
            var profits = data.map(function (item) {
                return item.profits;
            });
            var costs = data.map(function (item) {
                return item.costs;
            });

            var MONTHS = labels;
            var color = Chart.helpers.color;
            var barChartData = {
                labels: labels,
                datasets: [{
                    label: $scope.translation.REVENUE,
                    backgroundColor: color('blue').alpha(0.5).rgbString(),
                    borderColor: 'blue',
                    borderWidth: 1,
                    data: revenues
                }, {
                    label: $scope.translation.PROFIT,
                    backgroundColor: color('orange').alpha(0.5).rgbString(),
                    borderColor: 'orange',
                    borderWidth: 1,
                    data: profits
                }, {
                    label: $scope.translation.COST,
                    backgroundColor: color('grey').alpha(0.5).rgbString(),
                    borderColor: 'grey',
                    borderWidth: 1,
                    data: costs
                },

                ]

            };

            $('#chartDashboardCostProfit').remove();
            $('#divChart1').append('<canvas id="chartDashboardCostProfit"><canvas>');

            var ctx = document.getElementById('chartDashboardCostProfit').getContext('2d');
            window.myBar = new Chart(ctx, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: $scope.translation.TITLE
                    },
                    //events: false,
                    tooltips: {
                        enabled: false
                    },
                    hover: {
                        animationDuration: 0
                    },
                    animation: {
                        duration: 1,
                        onComplete: function () {
                            var chartInstance = this.chart,
                                ctx = chartInstance.ctx;
                            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';

                            this.data.datasets.forEach(function (dataset, i) {
                                var meta = chartInstance.controller.getDatasetMeta(i);
                                meta.data.forEach(function (bar, index) {
                                    var data = dataset.data[index].toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                });
                            });
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function (label, index, labels) { return label.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ; },
                            }
                        }]
                    }
                }
        });            
        });

        

    };

    function randomScalingFactor() {
        return Math.floor(Math.random() * (100 - 50)) + 50;
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
                $scope.fromDate = null;
                $scope.toDate = null;
            }
            else {
                $scope.fromDate = fromDate.format();
                $scope.toDate = toDate.format();
            }
       // });      

        //$scope.fromDate = fromDate.format();
        //$scope.toDate = toDate.format();
    }

    $scope.changeTimeMark = function () {
        $scope.loadData($scope.listStore);
        //$scope.processDate($scope.costProfitByDayFilter);
        //$scope.loadDashboard();
    };      
}]);