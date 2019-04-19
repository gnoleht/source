'use strict';
app.register.controller('shiftHistoryController', ['$scope', function ($scope) {

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    }

    //init
    $scope.$on('$routeChangeSuccess', function () {

        if ($scope.grid) {
            //$scope.loadStore();
            $scope.loadData();     

            $scope.grid.editAction = function (grid, item) { };
        }

        $scope.refresh = function () {
            $scope.loadData();
        };

        $(window).resize(function () {
            var width = $("#shiftHistory .white_box").width();
            var height = $("#shiftHistory .white_box").height();
            var box_control = $("#shiftHistory .box_filter").height();

            if ($("#shiftHistory .box_filter").is(":visible")) {
                $('#shiftHistory  dd').height(height - 50 - box_control);
            }
            else {
                $('#shiftHistory dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });

    $scope.searchFull = function (e) {
        if (e != null && e.keyCode != 13) return;
        $scope.loadData();
    };

    //$scope.loadStore = function () {
    //    $scope.postData("api/pos/Store/GetList",null, function (data) {
    //        $scope.setting.valuelist.storeId = data;
    //    });
    //}


    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;
        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.delete = false;
        $scope.button.copy = false;
    };

    $scope.loadData = function () {
        var searchValue = $("#full_text_filter").val();
        $scope.postData("api/pos/shiftHistory/get", { searchValue: searchValue }, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }

            $scope.calcListData();
        });
    }  

    $scope.calcListData = function () {
        var tempDataView = $scope.grid.getData().getItems();
        if (tempDataView) {
            $scope.total = tempDataView.length;
            $scope.active = tempDataView.filter(x => x.active == true).length;
            $scope.deactive = tempDataView.filter(x => x.active == false).length;
        } else {
            $scope.total = 0;
            $scope.active = 0;
            $scope.deactive = 0;
        }
    };
}]);