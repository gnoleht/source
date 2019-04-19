'use strict';
app.register.controller('envisionController', ['$scope', '$location', '$route', '$timeout', function ($scope, $location, $route, $timeout) {
    // register scope
    $scope.currentTab = "businessObjective";
    $scope.envision = {};
    $scope.defaultData = {};
    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        // get envision
        $scope.getEnvision();

        //$scope.post('api/user/getlist', null, function (data) {
        //    $scope.setting.valuelist.user = data;
        //});

        // resize
        $(window).resize(function (e) {
            var width = $("#envision .white_box").width();
            var height = $("#envision .white_box").height();
            $timeout(function () {
                $(".tab-content").width(width - 20);
                $(".tab-content").height(height - 55);
            });
        });

        $timeout(function () {
            $(window).resize();
        });
    });

    // get envision
    $scope.getEnvision = function () {
        $scope.postNoAsync("api/pm/Envision/Get?pid=" + $scope.params.pid, null, function (data) {
            if (data != null || data != undefined) {
                // goNotGo
                if (data.goNotGo == null || data.goNotGo == undefined) {
                    // goNotGo
                    data.goNotGo = {};
                    data.goNotGo.strength = [];
                    data.goNotGo.weakness = [];
                    data.goNotGo.threat = [];
                    data.goNotGo.opportunity = [];
                }
                // successCriteria
                if (data.successCriteria == null || data.successCriteria == undefined) {
                    data.successCriteria = {};
                }
                // marketNeeds
                if (data.marketNeeds == null || data.marketNeeds == undefined) {
                    // marketNeeds
                    data.marketNeeds = {};
                    data.marketNeeds.competitions = [];
                    data.marketNeeds.sizes = [];
                }
                // businessObjective
                if (data.businessObjective == null || data.businessObjective == undefined) {
                    // businessObjective
                    data.businessObjective = {};
                }
            }
            else {
                // data
                data = {};
                // goNotGo
                data.goNotGo = {};
                data.goNotGo.strength = [];
                data.goNotGo.weakness = [];
                data.goNotGo.threat = [];
                data.goNotGo.opportunity = [];
                // successCriteria
                data.successCriteria = {};
                // marketNeeds
                data.marketNeeds = {};
                data.marketNeeds.competitions = [];
                data.marketNeeds.sizes = [];
                // businessObjective
                data.businessObjective = {};
            }
            // envision
            $scope.envision = data;
            $scope.defaultData = $.extend(true, {}, data);
        });
    }

    //display function
    $scope.displayFunction = function () {
        //if ($scope.currentTab != "briefDescription") {
        //    $scope.resultProduct = angular.equals($scope.childScope['briefDescription'].product, $scope.childScope['briefDescription'].defaultProduct);
        //}
        //$scope.result = angular.equals($scope.envision, $scope.defaultData);

        //if ($scope.pastTab) {
        //    if ($scope.resultProduct == false)
        //        $scope.childScope['briefDescription'].save();
        //    if ($scope.result == false)
        //        $scope.childScope[$scope.pastTab].save();
        //}

        $scope.button.search = false;
        $scope.button.save = true;
        $scope.button.add = false;
        $scope.button.copy = false;
        $scope.button.edit = false;
        $scope.button.delete = false;

        $scope.pastTab = $scope.currentTab;
    };

    // display title
    $scope.displayTitle = function () {
        toogleProduct(true);
    };

    // save
    $scope.save = function () {
        var childScope = $scope.childScope[$scope.currentTab];
        if (childScope != null) {
            childScope.save();
        }
    };

    // refresh
    $scope.refresh = function () {
        var childScope = $scope.childScope[$scope.currentTab];
        if (childScope != null) {
            childScope.refresh();
        }
    };

    // edit
    $scope.edit = function () {
        var childScope = $scope.childScope[$scope.currentTab];
        if (childScope != null) {
            childScope.edit();
        }
    };

    // delete data
    $scope.deleteData = function () {
        var childScope = $scope.childScope[$scope.currentTab];
        if (childScope != null) {
            childScope.deleteData();
        }
    }

}]);



