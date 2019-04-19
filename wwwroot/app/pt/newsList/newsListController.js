'use strict';
app.register.controller('newsListController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
                newsListSetting.valuelist = $scope.setting.valuelist;
                newsListSetting.listFilter = $scope.setting.listFilter;
            }
        });
        $scope.refresh = function () {
            $scope.reload();
        };
        $scope.reload();

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            var searchValue = $("#inputSearch").val();
            var params = {searchValue: searchValue};
            $scope.reload(params);
        };
    });

    $scope.displayFunction = function () {
        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.delete = false;
        $scope.button.copy = false;
        $scope.button.setting = false;
    };

    $scope.reload = function (data) {
        $scope.postData("api/pt/news/getNews", data, function (data) {
            if (data) {
                $scope.data = data;
            }
        });
    };

    $scope.getByCategory = function (category) {
        var searchValue = $("#inputSearch").val();
        $scope.postData("api/pt/news/GetNewsByCategory", { category: category, searchValue: searchValue}, function (data) {
            if (data) {
                var index = $scope.data.findIndex(x => x.category.id == category.id);
                if(index != -1)
                    $scope.data[index].listNews = data.listNews;
            }
        });
    };
    
}]);



