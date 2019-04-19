'use strict';

app.controller("reportController", function ($scope, $location, $route, $timeout) {

    $scope.globalTranslation = translation;

    var zoom = 1;

    $scope.$on('$routeChangeSuccess', function () {
        $scope.loadSettings();
    });

    $scope.zoomList = [
        { text: "100%", value: "100" },
        { text: "75%", value: "75" },
        { text: "50%", value: "50" },
        { text: "25%", value: "25" },
    ];

    $scope.loadSettings = function () {
        var reportId = $location.path();
        $.ajax({
            type: 'POST',
            url: 'api/report/GetSettings?id=' + reportId,
            success: function (response) {
                $scope.setting = response.data;
            },
            async: false
        });
    }

    $scope.print = function () {
        window.print();
    }

    $scope.export = function (type) {

    }

    $scope.reload = function () {
        $route.reload();
    }

    $scope.filter = function () {
        $route.reload();
    }

    $scope.zoomIn = function () {
        if (zoom < 1)
            zoom = zoom + 0.25;

        $("#reportWapper").animate({ 'zoom': zoom }, 200);
    }

    $scope.zoomOut = function () {

        if (zoom > 0.25)
            zoom = zoom - 0.25;

        $("#reportWapper").animate({ 'zoom': zoom }, 200);
    }

    $scope.zoomChange = function (zoomLevel) {
        if (zoomLevel.value == "100")
            zoom = 1;
        else if (zoomLevel.value == "75")
            zoom = 0.75;
        else if (zoomLevel.value == "50")
            zoom = 0.5;
        else if (zoomLevel.value == "25")
            zoom = 0.25;

        $("#reportWapper").animate({ 'zoom': zoom }, 200);
    }

});