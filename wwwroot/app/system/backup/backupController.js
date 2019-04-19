'use strict';
app.register.controller('backupController', ['$scope', '$location', '$sce', 'authService', '$timeout', 'localStorageService', function ($scope, $location, $sce, authService, $timeout, localStorageService) {

    $scope.$on('$routeChangeSuccess', function () {
        $scope.postNoAsync('api/sys/backup/get', null, function (data) {
            $scope.data = data;
            var arrTime = data.timeBackup.time.split(':');
            $scope.data.timeBackup.time = new Date(1970, 0, 1, arrTime[0], arrTime[1], 0);
        });
    });
    $scope.updateBackup = function () {
        $scope.data.timeBackup.time = moment($scope.data.timeBackup.time).format('HH:mm:ss');
        $scope.postData('api/sys/backup/Update', { data: $scope.data }, function (data) {
            showSuccess($scope.translation.SAVESUCCESS);
        });
    };
}]);



