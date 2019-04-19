'use strict';
app.register.controller('reportAnalysisController', ['$scope', '$timeout', function ($scope, $timeout) {

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
                $scope.setting.valuelist.group = $scope.setting.valuelist.group.filter(x => x.id == "9" || x.id == "5" || x.id == "8");
            }
        });
        $scope.loadStore();
        //$scope.reloadGrid();
        $scope.refresh = function () {
            $scope.reloadGrid();
        };

        $(window).resize(function () {
            var width = $("#reportAnalysis .white_box").width();
            var height = $("#reportAnalysis .white_box").height();

            $('#reportAnalysis #grvreportAnalysis').height(height - 75);

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

    });
    $scope.print = function () {
        $scope.loadData();
    }

    $scope.loadData = function () {

        var params = {
            store: $scope.data.listStore,
            group: $scope.data.groupBy,
            time: $scope.data.time,
        }
        $scope.postData("api/pos/reportAnalysis/get", params, function (data) {
            if (data) {
                $.each(data, function (index, item) {

                    if ($scope.data.groupBy == "5")
                        item.group = item.cashier
                    if ($scope.data.groupBy == "8")
                        item.group = item.cust
                    if ($scope.data.groupBy == "9")
                        item.group = item.store
                });

                $scope.grid.groupDataField([
                    {
                        fieldName: "group",
                        groupFormat: function (group) {
                            $.each(group.rows, function (index, row) { row.number = index + 1 });
                            if ($scope.data.groupBy == "5")
                                return "<strong>" + "Thu ngân: " + group.value  + "</strong>";
                            if ($scope.data.groupBy == "8")
                                return "<strong>" + "Khách hàng: " + group.value + "</strong>";
                            if ($scope.data.groupBy == "9")
                                return "<strong>" + "Cửa hàng: " + group.value + "</strong>";

                        },

                    },

                ]);
                $scope.grid.setData(data);

            }
        });
    };
   

    $scope.reloadGrid = function () {
        $scope.loadData();
    };
    
    $scope.loadStore = function () {
        $scope.postNoAsync("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.store = data;
        });
    };
}]);


