//check
'use strict';
app.register.controller('sourceControlController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
    //page load
    $scope.$on('$routeChangeSuccess', function () {
        //$('#gitlab').load('http://172.16.7.65:1212/ER2/PMP/tree/master');
    });

}]);



