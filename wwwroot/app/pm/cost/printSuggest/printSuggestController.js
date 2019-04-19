'use strict';
app.register.controller('printSuggestController', ['$scope', '$location', 'authService', '$timeout', function ($scope, $location, authService, $timeout) {
    

    $scope.onload = function () {
        $(window).resize(function () {
            var widthModelDetail = $(window).width() * 0.7;
            $("#grvDetail").width(widthModelDetail);
            $("#grvDetail").height(200);
        });

        modalPlusEvent('modal-cost');

        $(window).resize();
    };

    $scope.$on('$routeChangeSuccess', function () {
        init('printSuggest', $scope, true);
        var temp = $scope.data;
    });
    $scope.dataAction = function (data) {
        
    };
    $scope.print = function (data) {
        //var keepAttr = ["id", "style", "class"];
        //var headElements = '<meta charset="utf-8" />,<meta http-equiv="X-UA-Compatible" content="IE=edge"/>';
        //var options = { mode: 'popup', popClose: close, retainAttr: keepAttr, extraHead: headElements };

        //$("#printSuggest").printArea(options);

        debugger;
        $('#printSuggest').printThis({
            importCSS: false,
            //header: "<h1>Look at all of my kitties!</h1>",
            //base: "https://jasonday.github.io/printThis/"
        });
    };
}]);