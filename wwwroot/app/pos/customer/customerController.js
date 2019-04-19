'use strict';
app.register.controller('customerController', ['$scope', function ($scope) {
    //init
    $scope.searchValue = "";

    $scope.dataCustomer = {};
    $scope.removeAvatar = false;
    $scope.subModal = "type";
    $scope.sub = {};
    $scope.data = {};
    $scope.dataDetailCustTemp = {};
    $scope.tempArrayDistrict = [];

    $scope.displayFunction = function () {
        $scope.button.filter = true;
        $scope.button.search = false;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $('#full_text_filter').focus();
        $scope.typeFilter = null;
        $scope.groupFilter = null;
    }

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

        if ($scope.grid) {
            $scope.loadData();

            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                $scope.data = {};
                $scope.data = angular.copy($scope.grid.getCurrentData());
                if (!$scope.$$phase)
                    $scope.$digest();
            });
        }
        //$scope.loadStore();
        $scope.loadCustGroup();
        $scope.loadCustType();
        $scope.loadProvinceDistrict();

        $scope.refresh = function () {
            $scope.loadData();
        };

        $scope.search = function (e, type, click) {
            if (click != 1)
                if (e != null && e.keyCode != 13) return;

            if (type == 1)
                $scope.searchValue = $("#full_text_filter").val();
            else
                $scope.searchValue = $("#inputSearch").val();
            $scope.loadData();
        };

        $(window).resize(function () {
            var width = $("#customer .white_box").width();
            var height = $("#customer .white_box").height();
            var box_control = $("#customer .box_filter").height();

            if ($("#customer .box_filter").is(":visible")) {
                $('#customer .content_6 dd').height(height - 40 - box_control);
                $("#customer .scroll").height(height - 15 - box_control);
            }
            else {
                $('#customer .content_6 dd').height(height - 25);
                $("#customer .scroll").height(height);
            }

            $scope.grid.resizeCanvas();
        });
    });

    //function
    $scope.cmbTypeFilter = {
        url: "api/pos/CustType/GetListComboxbox",
        allowClear: true,
        placeholder: customerTranslation.TYPEID,
    };
    $scope.cmbGroupFilter = {
        url: "api/pos/CustGroup/GetListComboxbox",
        allowClear: true,
        placeholder: customerTranslation.GROUPID,
    };
    $scope.cmbTypeId = {
        url: "api/pos/CustType/GetListComboxbox",
        allowClear: true,
    };
    $scope.cmbGroupId = {
        url: "api/pos/CustGroup/GetListComboxbox",
        allowClear: true,
    };

    $scope.changeKind = function (value) {
        $('#radioKind input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioKind input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.kind = value;
    };
    $scope.changeGender = function (value) {
        $('#radioGender input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioGender input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.gender = value;
    };

    $scope.loadData = function (typeId, groupId) {
        $scope.postData("api/pos/customer/get", { searchValue: $scope.searchValue, typeId: typeId, groupId: groupId }, function (data) {
            if (data) {
                $scope.listData = data;
                $scope.grid.setData(data);
                $scope.data = data[0];
                $("#grvCustomer .slick-row :first").click();
                $scope.calcListData();
            }
            //$scope.updateDataCustomer();
        });
    }
    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    }
    $scope.loadCustGroup = function () {
        $scope.postData("api/pos/CustGroup/GetList", null, function (data) {
            $scope.setting.valuelist.groupId = data;
        });
    }
    $scope.loadCustType = function () {
        $scope.postData("api/pos/CustType/GetList", null, function (data) {
            $scope.setting.valuelist.typeId = data;
        });
    }
    $scope.loadProvinceDistrict = function () {
        //get  province//get  district
        $.ajax({
            url: './js/resources/address.json/province.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            async: false,
            success: function (data) {
                $scope.setting.valuelist.primaryProvince = data;
                $.ajax({
                    url: './js/resources/address.json/district.json',
                    type: 'get',
                    dataType: 'json',
                    cache: false,
                    async: false,
                    success: function (data) {
                        $scope.tempArrayDistrict = $.map(data, function (value, index) {
                            return { "id": value.id, "text": value.text, "parent_code": value.parent_code };
                        });
                        $scope.setting.valuelist.primaryDistrict = $scope.tempArrayDistrict;
                    },
                });
            },
        });
    };

    $scope.deleteAvatar = function () {
        $("#imgAvatar").attr("src", "/img/no_avatar.png");
        $scope.removeAvatar = true;
    };

    $scope.add = function () {
        callModal('modal-detail');
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.primaryCountry = "VN";
        $scope.data.kind = 1;
        $scope.data.gender = 1;
        $scope.changeGender(1);
        $scope.data.active = true;
        $scope.defaultData = angular.copy($scope.data);
        $("#imgAvatar").attr("src", "/img/no_avatar.png");
        $scope.changeKind(1);
        $("#tab_01-tab").click();
        //$("#code").prop('disabled', false);
        $("#code").prop('disabled', true);
        $('#radioKind').focus();

        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};
    }



    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = jQuery.extend(true, {}, data);


            $scope.changeGender($scope.data.gender);

            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.avatar + "&def=/img/no_avatar.png");
            $scope.changeKind($scope.data.kind);

            if ($scope.data.primaryProvince) {
                $scope.setting.valuelist.primaryDistrict = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.primaryProvince; });
            }
            callModal('modal-detail');
            $("#tab_01-tab").click();
            $('#radioKind').focus();
            $("#code").prop('disabled', true);

            $scope.frmFile = new FormData();
            $scope.fileAvatar = {};
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
            $scope.data = angular.copy(data);//$.extend(true, {}, data);
            $scope.data.id = null;
            $scope.data.code = null;
            $scope.data.avatar = null;
            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.avatar + "&def=/img/no_avatar.png");

            callModal('modal-detail');
            $("#tab_01-tab").click();
            $("#code").prop('disabled', true);
            $('#radioKind').focus();
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.fileAvatar && $scope.fileAvatar.file) {
            $scope.fileAvatar.append("file", $scope.fileAvatar.file);
        }
        if ($scope.removeAvatar) {
            $scope.frmFile.append("removeAvatar", $scope.removeAvatar);
        }
        if ($scope.data) {
            $scope.data.birthDay = moment($scope.data.birthDay).format();

            $scope.frmFile.append("data", JSON.stringify($scope.data));
        }

        if ($scope.action == 'add') {
            $scope.postFile("api/pos/customer/Add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                //$scope.grid.sortData('code', true);
                $scope.grid.invalidate();
                $scope.updateDataCustomer();
            });

        }
        else {
            debugger
            $scope.postFile("api/pos/customer/Update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
                $scope.updateDataCustomer();
            });

        }
        $scope.calcListData();
    };

    $scope.saveAndContinue = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.fileAvatar && $scope.fileAvatar.file) {
            $scope.fileAvatar.append("file", $scope.fileAvatar.file);
        }
        if ($scope.removeAvatar) {
            $scope.frmFile.append("removeAvatar", $scope.removeAvatar);
        }
        if ($scope.data) {
            $scope.data.birthDay = moment($scope.data.birthDay).format();

            $scope.frmFile.append("data", JSON.stringify($scope.data));
        }

        if ($scope.action == 'add') {
            $scope.postFile("api/pos/customer/Add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.data.id = null;

                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
                $scope.updateDataCustomer();
            });

        }
        $scope.calcListData();

        $scope.add();
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
        $scope.post("api/pos/customer/remove", JSON.stringify($scope.data), function (lstDelete) {
            debugger
            if (lstDelete) {
                $scope.grid.dataView.deleteItem($scope.data.id);
                $scope.grid.invalidate();
                $scope.calcListData();
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    //$(".switch").click(function () {
    //    $(this).toggleClass("change");
    //    $scope.data.active = !$scope.data.active;
    //});

    $scope.changeActive = function () {
        $scope.data.active = !$scope.data.active;


    };
    $scope.ChangeProvince = function () {
        $scope.setting.valuelist.primaryDistrict = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.primaryProvince; });
        $scope.data.primaryDistrict = $scope.setting.valuelist.primaryDistrict[0].id;
    };

    $scope.$watch('data', function () {
        $scope.updateDataCustomer();

    });
    $scope.updateDataCustomer = function () {

        if ($scope.data) {
            //try{
            $scope.dataCustomer.birthDay = $scope.data.birthDay;
            $scope.dataCustomer.primaryEmail = $scope.data.primaryEmail;
            //$scope.dataCustomer.kind = $scope.setting.valuelist.kind.find(x => x.id == $scope.data.kind) != null ? $scope.setting.valuelist.kind.find(x => x.id == $scope.data.kind).text : '';
            $scope.dataCustomer.typeId = $scope.setting.valuelist.typeId.find(x => x.id == $scope.data.typeId) != null ? $scope.setting.valuelist.typeId.find(x => x.id == $scope.data.typeId).text : '';
            $scope.dataCustomer.groupId = $scope.setting.valuelist.groupId.find(x => x.id == $scope.data.groupId) != null ? $scope.setting.valuelist.groupId.find(x => x.id == $scope.data.groupId).text : '';
            $scope.dataCustomer.primaryDistrict = $scope.tempArrayDistrict.find(x => x.id == $scope.data.primaryDistrict) != null ? $scope.tempArrayDistrict.find(x => x.id == $scope.data.primaryDistrict).text : '';
            $scope.dataCustomer.primaryProvince = $scope.setting.valuelist.primaryProvince[$scope.data.primaryProvince] != null ? $scope.setting.valuelist.primaryProvince[$scope.data.primaryProvince].text : '';

            $scope.post("api/pos/customer/getInformationSaleOrder?customerId=" + $scope.data.id, null, function (dataReturn) {
                $scope.dataCustomer.totalPay = dataReturn.totalPay;
                $scope.dataCustomer.totalSaleOrder = dataReturn.totalSaleOrder;
                $scope.dataCustomer.topItem = dataReturn.topItem;
                $scope.dataCustomer.dataSaleOrder = dataReturn.dataSaleOrder;
                if (!$scope.$$phase)
                    $scope.$apply();
            });
        }
        else {
            $scope.dataCustomer = {};            
        }
        //}
        //catch{}
    };

    $scope.add1 = function () {
        $scope.sub = {};
        $scope.action = 'add1';
        $scope.subModal = "type";
        callModal('modal-detail-2');
        $("#subName").focus();
    }

    $scope.add2 = function () {
        $scope.sub = {};
        $scope.action = 'add2';
        $scope.subModal = "group";
        callModal('modal-detail-2');
        $("#subName").focus();
    }

    $scope.saveSub = function () {
        if ($scope.sub.code == undefined || $scope.sub.code == null || $scope.sub.code == "") {
            showError(customerTranslation["ERR_SUBCODE_REQUIRED"]);
            return;
        }
        if ($scope.sub.name == undefined || $scope.sub.name == null || $scope.sub.name == "") {
            showError(customerTranslation["ERR_SUBNAME_REQUIRED"]);
            return;
        }

        if ($scope.subModal == 'type') {
            $scope.sub.active = true;
            $scope.postData("api/pos/custType/Add", { data: $scope.sub }, function (data) {
                $('#modal-detail-2').modal('hide');                
                $scope.setting.valuelist.typeId.push({ "id": data.id, "text": data.name });
                $scope.data.typeId = data.id;
                
            });
        }
        else {
            $scope.sub.active = true;
            $scope.postData("api/pos/custGroup/Add", { data: $scope.sub }, function (data) {
                $('#modal-detail-2').modal('hide');
                $scope.setting.valuelist.groupId.push({ "id": data.id, "text": data.name });
                $scope.data.groupId = data.id;                
            });
        }
    };
    $scope.searchObject = function () {
        $scope.loadData($scope.typeFilter, $scope.groupFilter)
        //var dataFilter = $scope.listData.filter(x => x.typeId == $scope.typeFilter && x.groupId == $scope.groupFilter);
        //$scope.grid.setData(dataFilter);
    }
    $scope.calcListData = function () {
        var tempDataView = $scope.grid.getData().getItems();
        if (tempDataView) {
            $scope.dataDetailCustTemp.total = tempDataView.length;
            //$scope.active = tempDataView.filter(x => x.active == true).length;
            //$scope.deactive = tempDataView.filter(x => x.active == false).length;
        } else {
            $scope.total = 0;
            //$scope.active = 0;
            //$scope.deactive = 0;
        }
        if (!$scope.$$phase)
            $scope.$apply();
    };
}]);