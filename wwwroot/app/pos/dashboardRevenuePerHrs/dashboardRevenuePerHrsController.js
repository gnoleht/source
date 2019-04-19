﻿'use strict';
app.register.controller('dashboardRevenuePerHrsController', ['$scope', '$timeout', function ($scope, $timeout) {

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
        init('dashboardRevenuePerHrs', $scope, true);
        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
                $scope.setting.valuelist.revenuePerHrsByDayFilter = $scope.setting.valuelist.dashboardTimeMark;
            },
        });

        //$scope.loadStore();
        $scope.revenuePerHrsByDayFilter = "1";
        $timeout(function () {
            $scope.loadData([]);
            $scope.runLoaded();
        });

    });

    $scope.loadData = function (listStore) {
        $scope.listStore = listStore;
        $scope.processDate($scope.revenuePerHrsByDayFilter);
        $scope.loadDashboard();
    };


    //chartDashboardRevenuePerHrs
    $scope.loadDashboard = function () {

        var params = {
            listStore: $scope.listStore,
            startDate: $scope.fromDate,
            endDate: $scope.toDate
        };

        $scope.postData("api/pos/dashboardPOS/getDashboardRevenuePerHrs", params, function (data) {
            $scope.data = data;
            var labels = data.map(function (item) {
                return item.name;
            });
            var billTotal = data.map(function (item) {
                return item.billTotal;
            });
            var revenue = data.map(function (item) {
                return item.revenue;
            });


            var chartData = {
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Số hoá đơn',
                        borderColor: 'orange',
                        borderWidth: 2,
                        data: billTotal,
                        yAxisID: 'B',
                    },
                    {
                        type: 'bar',
                        label: 'Doanh thu',
                        backgroundColor: '#17a2b8',
                        borderColor: '#17a2b8',
                        borderWidth: 2,
                        fill: false,
                        data: revenue,
                        yAxisID: 'A',
                    }]
            };

            $('#chartDashboardRevenuePerHrs').remove();
            $('#divChartRevenuePerHrs').append('<canvas id="chartDashboardRevenuePerHrs"><canvas>');

            var ctx = document.getElementById('chartDashboardRevenuePerHrs').getContext('2d');
            var height = 500;
            $('#divChartRevenuePerHrs').height(height);

            window.myMixedChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        //text: $scope.translation.TITLE
                    },
                    //events: false,
                    //tooltips: {
                    //    enabled: false
                    //},
                    tooltips: {
                        //mode: 'label'
                        callbacks: {
                            title: function () {
                                return '';
                            },
                            label: function (item, data) {
                                var datasetLabel = data.datasets[item.datasetIndex].label || '';
                                var dataPoint = item.yLabel;
                                return datasetLabel + ': ' + dataPoint.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }
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
                            ctx.fillStyle = 'black';
                            this.data.datasets.forEach(function (dataset, i) {
                                var meta = chartInstance.controller.getDatasetMeta(i);

                                meta.data.forEach(function (bar, index) {
                                    var data = dataset.data[index].toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

                                    if (dataset.yAxisID == 'B') {
                                        ctx.fillStyle = '#E03510';
                                        ctx.fillText(data, bar._model.x - 10, bar._model.y);
                                    }
                                    else {
                                        ctx.fillStyle = '#046124';
                                        ctx.fillText(data, bar._model.x + 10, bar._model.y - 5);
                                    }

                                    //ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                });
                            });
                        }
                    },
                    scales: {
                        //xAxes: [{
                        //    ticks: {
                        //        callback: function (t) {
                        //            var maxLabelLength = 10;
                        //            if (t.length > maxLabelLength) return t.substr(0, maxLabelLength) + '...';
                        //            else return t;
                        //        }
                        //    }
                        //}],

                        //xAxes: [{
                        //    ticks: {
                        //        autoSkip: false,
                        //        maxRotation: 90,
                        //        minRotation: 90
                        //    }
                        //}],
                        yAxes: [{
                            id: 'A',
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                callback: function (label, index, labels) { return label.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }); },
                            }
                        }, {
                            id: 'B',
                            type: 'linear',
                            position: 'right',

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

        $scope.fromDate = fromDate.format();
        $scope.toDate = toDate.format();
    }

    $scope.changeTimeMark = function () {

        //$scope.processDate($scope.revenuePerHrsByDayFilter);
        //$scope.loadDashboard();

        $scope.loadData($scope.listStore);
    };
}]);