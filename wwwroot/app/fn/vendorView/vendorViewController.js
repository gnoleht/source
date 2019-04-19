'use strict';
app.register.controller('vendorViewController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.displayFunction = function () {
        $scope.button.delete = true;
        $scope.button.edit = true;
        $scope.button.add = true;
        $scope.button.save = true;
        $scope.button.refresh = false;
        $scope.button.copy = true;
        $scope.button.search = false;
    };

    $scope.authService = authService;

    $scope.onload = function () {
    };

    $scope.$on('$routeChangeSuccess', function () {
        //debugger;
        var a = $scope;
        //$scope.grid.loadData();
        //resize
        $(window).resize(function () {
            var width = $("#vendorView .white_box").width();
            //$("#vendorView .white_box").width(width);
            var height = $("#vendorView .white_box").height();
            //$("#vendorView .white_box").height(height);
            var box_control = $("#vendorView .box_control").height();
            $("#vendorView .scroll").height(height - box_control - 20);
        });
        $(window).resize();
    });


    //function
    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    }
    $scope.add = function () {
    };

    $scope.edit = function () {
    };


    $scope.copy = function () {
    };

    //save
    $scope.save = function () {
    }

    //hiển thị modal xóa
    $scope.delete = function () {

    };

    //xóa
    $scope.deleteData = function () {

    };

}]);