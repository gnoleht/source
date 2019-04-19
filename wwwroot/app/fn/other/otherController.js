﻿'use strict';
app.register.controller('otherController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.displayFunction = function () {
        $scope.button.delete = true;
        $scope.button.edit = true;
        $scope.button.add = true;
        $scope.button.save = true;
        $scope.button.refresh = false;
        $scope.button.copy = true;
        $scope.button.search = false;
    };

    $scope.idx = 0;
    $scope.authService = authService;
 

    $scope.onload = function () {
    };

    $scope.$on('$routeChangeSuccess', function () {
        //init('cost', $scope);

        //$scope.grid.loadData(costSetting.grid.url += "?pid=" + $scope.params.pid + "&pjid=" + $scope.params.pjid + "&module=" + $scope.params.module);
        $(window).resize(function () {
            var width = $("#other .white_box").width();
            //$("#vendorAdd .white_box").width(width);
            var height = $("#other .white_box").height();
            //$("#vendorAdd .white_box").height(height);
            var box_control = $("#other .box_control").height();
            $("#other .scroll").height(height - box_control - 20);
        });
        $(window).resize();

    });


    //function
    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    }
    $scope.toogleRight = function () {
        $scope.checkRight = !$scope.checkRight;
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