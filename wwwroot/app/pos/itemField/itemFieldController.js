﻿'use strict';
app.register.controller('itemFieldController', ['$scope', function ($scope) {

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    };

    //init
    $scope.$on('$routeChangeSuccess', function () {
        if ($scope.grid) {
            $scope.loadData();       
        }

        $scope.refresh = function () {
            $scope.loadData();
        };

        $(window).resize(function () {
            var width = $("#itemField .white_box").width();
            var height = $("#itemField .white_box").height();
            var box_control = $("#itemField .box_filter").height();

            if ($("#itemField .box_filter").is(":visible")) {
                $('#itemField dd').height(height - 50 - box_control);
            }
            else {
                $('#itemField dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });


    $scope.searchFull = function (e) {
        if (e != null && e.keyCode != 13) return;
        $scope.loadData();
    };


    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;
    };

    //function
    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.active = true;
        callModal('modal-detail');
        $("#code").prop('disabled', false);
        $('#code').focus();        
    }

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = angular.copy(data);;          

            callModal('modal-detail');
            $('#name').focus();
            $("#code").prop('disabled', true);
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
            $scope.data = angular.copy(data);
            $scope.data.code = null;       
            $scope.data.id = null;  

            callModal('modal-detail');
            $("#code").prop('disabled', false);
            $('#code').focus();       
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        if ($scope.action == 'add') {
            $scope.postData("api/pos/itemField/add", { data: $scope.data } , function (data) {

                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
               // $scope.grid.sortData('code', true);
            });
        }
        else if ($scope.action == 'edit') {
            $scope.postData("api/pos/itemField/update", { data: $scope.data } , function (data) {             
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });
        }
        $scope.calcListData();
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
        $scope.postData("api/pos/ItemField/remove", { data: $scope.data }, function (result) {     
            if (result) {
                $scope.grid.dataView.deleteItem($scope.data.id);
                $scope.grid.invalidate();

                $scope.calcListData();
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    $scope.loadData = function () {
        var searchValue = $("#full_text_filter").val();
        $scope.postData("api/pos/ItemField/get", { searchValue: searchValue }, function (data) {
            if (data) {               
                $scope.grid.setData(data);
            }         
            $scope.calcListData();
        });
    }  

    //change active
    $scope.changeActive = function (data) {
        $scope.data.active = !data;
    };

    $scope.calcListData = function () {
        var tempDataView = $scope.grid.getData().getItems();
        if (tempDataView) {
            $scope.total = tempDataView.length;
            $scope.active = tempDataView.filter(x => x.active == true).length;
            $scope.deactive = tempDataView.filter(x => x.active == false).length;
        } else {
            $scope.total = 0;
            $scope.active = 0;
            $scope.deactive = 0;
        }
    };
}]);