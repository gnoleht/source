'use strict';
app.register.controller('storeController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.removeLogo = false;
    //init
    $scope.$on('$routeChangeSuccess', function () {

        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
            },
        });

        $.ajax({
            url: './js/resources/address.json/province.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $scope.tempArrayProvince = $.map(data, function (value, index) {
                    return { "id": value.id, "text": value.text};
                });
                $scope.setting.valuelist.primaryProvince = $scope.tempArrayProvince;
                $.ajax({
                    url: './js/resources/address.json/district.json',
                    type: 'get',
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        $scope.tempArrayDistrict = $.map(data, function (value, index) {
                            return { "id": value.id, "text": value.text, "parent_code": value.parent_code };
                        });
                        $scope.setting.valuelist.primaryDistrict = $scope.tempArrayDistrict;

                        if ($scope.data.primaryProvince != null && $scope.data.primaryProvince != undefined) {
                            $scope.setting.valuelist.primaryDistrict = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.primaryProvince; });
                        }
                    },
                });
            },
        });

        if ($scope.grid) {
            $scope.loadData();
        }

        $scope.refresh = function () {
            $scope.loadData();
        };

        //$scope.search = function (e) {
        //    if (e != null && e.keyCode != 13) return;
        //    $scope.loadData();
        //};

        $(window).resize(function () {
            var width = $("#store .white_box").width();
            var height = $("#store .white_box").height();
            var box_control = $("#store .box_filter").height();

            if ($("#store .box_filter").is(":visible")) {
                $('#store dd').height(height - 50 - box_control);
            }
            else {
                $('#store dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

    });



    $scope.searchFull = function (e) {
        if (e != null && e.keyCode != 13) return;
        $scope.loadData();
    };

    $scope.loadData = function () {
        var searchValue = $("#full_text_filter").val();
        $scope.postData("api/pos/Store/get", { searchValue: searchValue }, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
            $scope.calcListData();
        });
    }


    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    }

    //function
    $scope.add = function () {
        $scope.setting.valuelist.primaryDistrict = [];
        $scope.removeLogo = false;
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.primaryCountry = "VN";
        $scope.data.active = true;
        $scope.defaultData = angular.copy($scope.data);
        $("#imgLogo").attr("src", "/img/no-product.jpg");
        callModal('modal-detail-store');
        $("#code").prop('disabled', false);
        $('#code').focus();


        $scope.frmFile = new FormData();
        $scope.fileLogo = {};
    }


    // Modal
    $scope.onloadModal = function () {
        //get  province//get  district



    }

    $scope.edit = function () {
        $scope.removeLogo = false;
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_CHOOSE_STORE_EDIT"]);
        else {
            $scope.action = 'edit';
            $scope.data = angular.copy(data);


            if ($scope.data.active)
                $(".switch").addClass('change');
            else
                $(".switch").removeClass('change');

            $("#imgLogo").attr("src", "/api/system/viewfile?id=" + $scope.data.logo + "&def=/img/no-product.jpg");

            callModal('modal-detail-store');
            $('#name').focus();
            $("#code").prop('disabled', true);

            $scope.frmFile = new FormData();
            $scope.fileLogo = {};
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

            $scope.data.logo = null;
            $scope.data.id = null;
            $scope.data.code = null;
            $("#imgLogo").attr("src", "/img/no-product.jpg");

            callModal('modal-detail-store');
            $("#code").prop('disabled', false);
            $('#code').focus();   

            $scope.frmFile = new FormData();
            $scope.fileLogo = {};

        }
    };

    $scope.ChangeProvince = function () {
        $scope.setting.valuelist.primaryDistrict = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.primaryProvince; });
        $scope.data.primaryDistrict = $scope.setting.valuelist.primaryDistrict[0].id;
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.fileLogo && $scope.fileLogo.file) {
            $scope.fileLogo.append("file", $scope.fileLogo.file);
        }

        if ($scope.data)
            $scope.frmFile.append("data", JSON.stringify($scope.data));

        $scope.frmFile.append("removeLogo", $scope.removeLogo);

        if ($scope.action == 'add') {
            $scope.postFile("api/pos/store/Add", $scope.frmFile, function (data) {
                
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-store').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
            });

        }
        else {
            $scope.postFile("api/pos/store/Update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-store').modal('hide');
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
            $scope.dataDelete = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postData("api/pos/store/delete", { store: $scope.dataDelete }, function (result) {
            if (result) {
                $scope.grid.dataView.deleteItem($scope.dataDelete.id);
                $scope.grid.invalidate();
                $scope.calcListData();
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    //change active
    $scope.changeActive = function (data) {
        $scope.data.active = !data;
    };

    $scope.deleteAvatar = function () {
        $("#imgLogo").attr("src", "/api/system/viewfile?id=null&def=/img/no-product.jpg");
        $scope.removeLogo = true;
    }

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