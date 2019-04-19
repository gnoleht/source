'use strict';
app.register.controller('userGuideOverviewController', ['$scope', function ($scope) {
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
        $scope.touch = 'false';

        $scope.postData("api/pos/saleOrder/getDataPOS", null, function (data) {
            $scope.posKind = data.posKind;
            $scope.changeKind($scope.posKind);
            $scope.touch = data.touch;
        });   
    });

    $scope.changeKind = function (value) {
        $('input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioKind input[value="' + value + '"]').attr('checked', 'checked');

        $scope.posKind = value;

    };

    $scope.changeActive = function (value) {
        $scope.sampleData = !value;
    };

    $scope.changeTouch = function (value) {
        $scope.touch = $scope.touch == "true" ? "false" : "true";
    };

    $scope.apply = function () {
        $scope.postData("api/pos/saleOrder/updatePOS", { posKind: $scope.posKind, touch: $scope.touch}, function (data) {
        });
    };
    $scope.call = function () {
        callModal('importItem');
    };


    
}]);