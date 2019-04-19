'use strict';
app.register.controller('contactController', ['$scope', function ($scope) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        $(window).resize(function () {
            var height = $("#contact .white_box").height();
            var width = $("#contact .white_box").width();
            $("#contact .white_box").height(height - 20);
            $("#contact .white_box").width(width - 20);

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
        $scope.grid.onClick.subscribe(function (e, args) {
            if ($(e.target).hasClass("checkWI")) {
                $scope.changeActive(e, args);
            }
        });
    });

    //function
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.active = true;
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $('#name').focus();
    }

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = jQuery.extend(true, {}, data);          

            callModal('modal-detail');
            $('#name').focus();
        };
    };

    $scope.copy = function () {
        if ($scope.grid != null) {
            var data = $scope.grid.getCurrentData();
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }

            $scope.action = 'add';            
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;

            callModal('modal-detail');
            $('#name').focus();
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.action == 'add') {
            $scope.postData("api/pos/contact/Add", { data: JSON.stringify($scope.data) }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });

        }
        else {
            $scope.frmFile.set("data", JSON.stringify($scope.data.cost));
            $scope.postData("api/pos/contact/Update", { data: JSON.stringify($scope.data) }, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');                
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });

        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.post("api/pos/contact/remove", JSON.stringify($scope.data), function (lstDelete) {
            $scope.grid.dataView.deleteItem($scope.data.id);           
            $scope.grid.invalidate();
        });
    };

    // change active
    //$scope.changeActive = function (data) {
    //    if (data.active) {
    //        $("#chkActive").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
    //        data.active = false;
    //    }
    //    else {
    //        $("#chkActive").removeClass().addClass("bowtie-icon bowtie-checkbox");
    //        data.active = true;
    //    }
    //};

    $scope.changeActive = function (e, args) {
        var item = $scope.grid.dataView.getItem(args.row);
        if (item) {
            item.active = item.active ? false : true;
            $scope.postData("api/pos/contact/update", { data: JSON.stringify(item) }, function (data) {
                $scope.grid.dataView.updateItem(item.id, item);
                $scope.grid.invalidate();
            });

        }

    };
}]);