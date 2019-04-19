'use strict';
app.register.controller('envisionConfigController', ['$scope', '$location', '$sce', 'authService', 'httpService', function ($scope, $location, $sce, authService, httpService) {
    //init
    init('envisionConfig', $scope, httpService);

    //page load
    var scope = $scope;
    $scope.$on('$routeChangeSuccess', function () { 
        
        $.ajax({
            url: '/js/basic/type.json',
			type: 'get',
			dataType: 'json',
            cache: false,           
            model: null,            
            success: function (data) {
                $scope.types = data.type		
			},
        });     
        $scope.pid = $location.search()["pid"];
        envisionConfigSetting.grid.url = "api/envisionConfig/get?pid=" + $scope.pid;
    });   

    // function
    $scope.add = function () {
        $scope.data = {};
        $scope.action = 'add';
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $("#txtTitle").focus();
    };

    $scope.edit = function () {
        var data = $scope.getCurrentData();
       
        if (data == null) {
            showError($scope.translation.ERR_UPDATE_NULL);
            return;       
        } else {
            $scope.action = 'edit';
            $scope.data = $.extend(true, {}, data);
            $("txtTitle").prop("readonly", true);
            $scope.data = $.extend(true, {}, data);
        }
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $("#txtTitle").focus();
    };

    $scope.save = function () {
        $scope.data.productId = $scope.pid;
        if ($scope.action == 'add') {
            //$scope.frmFile.append("data", JSON.stringify($scope.data));
            httpService.post("api/envisionConfig/add", JSON.stringify($scope.data),
            
                function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail').modal('hide');
                    $scope.dataView.insertItem(0, data);
                    $scope.grid.invalidate();
                    //$scope.grid.render();
                   
                },
                function (data) {
                    $scope.refreshFrm(['data']);
                });
        }

        else if ($scope.action === 'edit') {

            //$scope.frmFile.append("data", JSON.stringify($scope.data));

            httpService.post("api/envisionConfig/update", JSON.stringify($scope.data),
                function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail').modal('hide');
                    $scope.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $scope.grid.render();
                },
                function (data) {
                    $scope.refreshFrm(["data"]);
                });

        }

    };

    $scope.delete = function () {
        var data = $scope.getCurrentData();
        //var data = $scope.table.row('.selected').data();
        if (data === undefined || data === null) {
            showError($scope.translation.ERR_CHOOSE_ENVISIONCONFIG_DELETE);
            return;
        } else {
            $scope.data = data;
            callModal("modal-confirm");
            //$('#modal-confirm').modal();

        }
    };

    $scope.deleteData = function () {
        httpService.post("api/envisionConfig/delete", JSON.stringify($scope.data), function (data) {
            $scope.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
            $scope.grid.render();
        });
    };


}]);


