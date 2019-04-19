'use strict';
app.register.controller('userGuideReceiptPaymentController', ['$scope', function ($scope) {


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

     
    });


}]);