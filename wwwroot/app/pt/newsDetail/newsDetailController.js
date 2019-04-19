'use strict';
app.register.controller('newsDetailController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.refresh = function () {
            $scope.load();
        };
        $scope.load();

        SetPerfectScroll("contentDetail");
        setTimeout(function () {
            $('#contentDetail').scrollTop(1);
        });
    });

    $scope.displayFunction = function () {
        $scope.title.form = 'News';
        $scope.title.formUrl = 'pt/newsList';

        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.delete = false;
        $scope.button.copy = false;
        $scope.button.search = false;
        $scope.button.setting = false;
    };

    $scope.load = function () {
        $scope.postData("api/pt/news/GetNewsByCode", {code : $scope.params.code}, function (data) {
            if (data) {
                $scope.data = data;
            }
        });
        $scope.getRelated(5, $scope.data.id, $scope.data.category);
    };

    $scope.getRelated = function (limit, outId, id) {
        $scope.postData("api/pt/news/GetNewsRelated", { categoryId: id, outId: outId, limit: limit }, function (data) {
            $scope.listRelated = data;
        });
    }
}]);



