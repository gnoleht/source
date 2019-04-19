'use strict';
app.register.controller('successCriteriaController', ['$scope', function ($scope) {
    // route change success
    $scope.$on('$routeChangeSuccess', function () { });

    // onload
    $scope.onload = function () {
        // resize
        //$(window).resize(function () {
        //    var width = $("#successCriteria").closest('.tab-content').width();
        //    var height = $("#successCriteria").closest('.tab-content').height();
        //    $("#successCriteria").width(width);
        //    $("#successCriteria").height(height);
        //});

        //SetPerfectScroll("successCriteria");

        $(window).resize();
        // init
        init('successCriteria', $scope, true, false, false);
    };

    // save
    $scope.save = function () {
        $scope.post("api/pm/Envision/Save", JSON.stringify($scope.envision), function (data) {
            $scope.defaultData = data;
            showSuccess(envisionTranslation.SUCCESS_TAB);
        });
    };

    // refresh
    $scope.refresh = function () {
        // load data
        $scope.envision = $.extend(true, {}, $scope.defaultData);
    }
}]);



