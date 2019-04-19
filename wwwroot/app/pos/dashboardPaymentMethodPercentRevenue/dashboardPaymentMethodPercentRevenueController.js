'use strict';
app.register.controller('dashboardPaymentMethodPercentRevenueController', ['$scope', '$timeout', function ($scope, $timeout) {

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
        init('dashboardPaymentMethodPercentRevenue', $scope, true);

        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });

                $scope.setting.valuelist.paymentMethodPercentRevenueFilter = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id != "1" && x.id != "12");
            },
        });

        $scope.paymentMethodPercentRevenueFilter = "3";

        $timeout(function () {
            $scope.loadData([]);
            $scope.runLoaded();
        });

    });

    $scope.loadData = function (listStore) {
        $scope.listStore = listStore;
        $scope.processDate($scope.paymentMethodPercentRevenueFilter);
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

        $scope.postData("api/pos/DashboardPOS/GetPaymentMethodPercentRevenue", params, function (data) {
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
                            backgroundColor: [
                                chartColors.orange,
                                chartColors.green,
                                chartColors.blue,
                            ],
                            //borderColor: "#79D1CF",
                            data: value,
                            label: 'Doanh thu',
                        }
                    ]
                };
            }

        });


        var options = {
            title: {
                text: 'Tỷ lệ doanh thu theo phương thức thanh toán',
                display: true
            },
            responsive: true,
            tooltips: {
                enabled: true
            },
            hover: {
                animationDuration: 0
            },
            events: false,
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset) {
                        for (var i = 0; i < dataset.data.length; i++) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                start_angle = model.startAngle,
                                end_angle = model.endAngle,
                                mid_angle = start_angle + (end_angle - start_angle) / 2;

                            var x = mid_radius * Math.cos(mid_angle);
                            var y = mid_radius * Math.sin(mid_angle);

                            ctx.fillStyle = '#fff';
                            if (i == 3) { // Darker text color for lighter background
                                ctx.fillStyle = '#444';
                            }
                            var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                            if (percent != "0%" && percent !="NaN%") {
                                ctx.fillText(dataset.data[i].toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }), model.x + x, model.y + y);
                                // Display percent in another line, line break doesn't work for fillText
                                ctx.fillText(percent, model.x + x, model.y + y + 15);
                            }                         
                        }
                    });
                }
            }
        };

        var ctx = document.getElementById("paymentMethodPercentRevenue");
        var myChart = new Chart(ctx, {
            type: 'pie',
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
        //$scope.processDate($scope.paymentMethodPercentRevenueFilter);
        //$scope.loadchart();
        $scope.loadData($scope.listStore);
    };
}]);