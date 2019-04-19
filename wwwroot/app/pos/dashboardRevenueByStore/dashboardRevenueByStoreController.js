'use strict';
app.register.controller('dashboardRevenueByStoreController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.displayFunction = function () {
        $scope.button.filter = false;
        $scope.button.search = false;
        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.copy = false;
        $scope.button.delete = false;
    };

    //init
    $scope.$on('$routeChangeSuccess', function () {
        init('dashboardRevenueByStore', $scope, true);

        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });

                $scope.setting.valuelist.revenueByStoreFilter = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id != "1" && x.id !="12");
            },
        });

        $scope.revenueByStoreFilter = "2";

        $timeout(function () {
            $scope.loadData([]);
            $scope.runLoaded();
        });

    });

    $scope.loadData = function (listStore) {
        $scope.listStore = listStore;
        $scope.processDate($scope.revenueByStoreFilter);
        $scope.loadchart();
    };

    $scope.loadchart = function () {
        var chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        var params = {
            listStore: $scope.listStore,
            startDate: $scope.fromDate,
            endDate: $scope.toDate
        }

        var dataChart = {};

        $scope.postData("api/pos/DashboardPOS/GetRevenueByStore", params, function (data) {          
            if (data) {
                var labels = [];
                var value = [];
                $.each(data, function (label, sum) {
                    labels.push(label);
                    value.push(sum);
                });


                dataChart = {
                    labels: labels,
                    datasets: [
                        {
                            backgroundColor: "#79D1CF",
                            borderColor: "#79D1CF",//chartColors.green,
                            data: value,
                            label: 'Doanh thu',
                            fill: true,
                        }
                    ]
                };
            }

        });


        var options = {
            title: {
                text: 'Doanh thu theo chi nhánh',
                display: true
            },
            //maintainAspectRatio: false,
            spanGaps: false,
            elements: {
                line: {
                    //tension: 0.000001
                }
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0
                    }
                }],
                yAxes: [
                    {
                        ticks: {
                            callback: function (label, index, labels) {
                                return label.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        },
                    }
                ],
            },

            events: false,
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
                    //ctx.fillStyle = chartColors.red;
                    ctx.fillStyle = 'black';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index].toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            ctx.fillText(data, bar._model.x, bar._model.y - 10);
                        });
                    });
                }
            }
        };

        var ctx = document.getElementById("chartRevenueByStore");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: dataChart,
            options: options
        });
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

        $scope.fromDate = fromDate.format();
        $scope.toDate = toDate.format();
    }

    $scope.changeTimeMark = function () {
        $scope.loadData($scope.listStore);
    };      
}]);