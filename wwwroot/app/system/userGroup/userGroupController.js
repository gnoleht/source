'use strict';
app.register.controller('userGroupController', ['$scope', '$location', '$sce', 'authService', 'httpService', function ($scope, $location, $sce, authService, httpService) {
    //init
    $scope.includeComplete = function () {
        userGroupSetting.options.scope = $scope;
    };

    init('userGroup', $scope, httpService);

}]);