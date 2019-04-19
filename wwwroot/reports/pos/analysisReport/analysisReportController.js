'use strict';
app.register.controller('analysisReportController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.$on('$routeChangeSuccess', function () {
        //  $scope.setting.rowIndex = 0;
        $.ajax({
            url: '/reports/pos/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
                
               // $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id != null);

            }
        });
        $scope.loadStore();
        //$scope.reloadGrid();
        $scope.refresh = function () {
            $scope.reloadGrid();
        };

       
        $timeout(function () {
            $scope.data.analysisReport_Group = "1";
        });

        $(window).resize(function () {
            var width = $("#analysisReport .white_box").width();
            var height = $("#analysisReport .white_box").height();

            $('#analysisReport #grvAnalysisReport').height(height - 75);

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

        //$scope.checkCustomer = false;
        //$scope.checkReport = $scope.data.reportdetail;



    });

    $scope.reloadGrid = function () {
        $scope.loadData();
    };
    
    $scope.store = {
        url: 'api/pos/retailDetail/GetListStore',
        allowClear: true,
    }



    $scope.loadReport = function () {
        $scope.loadData();
        
    }

    $scope.loadData = function () {
        var params = {
            time: $scope.data.time,
            store: $scope.data.analysisReport_Group,        }
        $scope.postData("api/pos/analysisReport/get", params, function (data) {
            //debugger
            if (data) {
                $scope.grid.setData(data);
                $.each(data, function (index, item) {
                    if ($scope.data.analysisReport_Group == '1')
                        item.a = item.store
                });
                $scope.grid.groupDataField([
                    {
                        fieldName: "a",
                        groupFormat: function (group) {
                            debugger;
                            $.each(group.rows, function (index, row) { row.number = index + 1 });

                            if ($scope.data.analysisReport_Group == '1')
                                return "<strong>" + "Cửa hàng: " + group.value + " (" + group.count + " rows)" + "</strong>";
                        },
                      
                    },

                ]);
               
            }
        });
    }
// load danh sách store
$scope.loadStore = function () {
    $scope.postNoAsync("api/pos/Store/GetList", null, function (data) {
        $scope.setting.valuelist.storeId = data;
    });
}; 
}]);