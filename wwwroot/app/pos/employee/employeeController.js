'use strict';
app.register.controller('employeeController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.actionContact = 'add';
    $scope.listContact = [];
    $scope.removeAvatar = false;

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
                $scope.setting.valuelist.identificationPlace = data;
            },
        });

        if ($scope.grid) {
            $scope.loadData();

            // $scope.loadRole();

            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                $scope.dataEmployee = {};
                $scope.dataEmployee = angular.copy($scope.grid.getCurrentData());
                $scope.loadContactDefault($scope.dataEmployee.id);
                $scope.loadDataContact($scope.dataEmployee.id);
                if ($scope.dataEmployee && $scope.dataEmployee.identificationPlace)
                    $scope.identificationPlaceText = $scope.setting.valuelist.identificationPlace[$scope.dataEmployee.identificationPlace].text;
                if (!$scope.$$phase)
                    $scope.$digest();
            });
        }


        if (!$scope.grvContact) {
            initSlickGrid($scope, 'grvContact');

            if ($scope.listContact == null)
                $scope.listContact = [];

            $scope.grvContact.onKeyDown.subscribe(function (e) {
                if (e.which == 13) {
                    $scope.addRow();
                }
            });

            if ($scope.dataEmployee)
                $scope.loadDataContact($scope.dataEmployee.id);
        }

        $scope.refresh = function () {
            $scope.loadData();
        };

        $timeout(function () {
            var url = 'api/sys/role/GetListForUserGroupBy?userId=' + null;
            $scope.postNoAsync(url, null, function (data) {
                $scope.setting.valuelist.roleId = data;
                $timeout(function () {
                    $("#select-role").selectpicker({
                        width: "100%",
                        selectedTextFormat: "count>2",
                        noneSelectedText: "...",
                        actionsBox: true,
                        size: false
                    });
                    $('#select-role').selectpicker('refresh');
                });

            });


            $('#select-identificationPlace').select2();
        });

        $(window).resize(function () {
            var width = $("#employee .white_box").width();
            var height = $("#employee .white_box").height();
            var box_control = $("#employee .box_filter").height();

            if ($("#employee .box_filter").is(":visible")) {
                $("#employee .scroll").height(height - 15 - box_control);
            }
            else {
                $("#employee .scroll").height(height);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });

    $scope.searchFull = function (e) {
        if (e != null && e.keyCode != 13) return;
        $scope.loadData();
    };

    $scope.loadContactDefault = function (employeeId) {
        $scope.postData("api/pos/Contact/GetByIdDefault", { id: employeeId }, function (data) {
            $scope.dataContact = data;
        });
    };

    $scope.loadRole = function () {
        var url = 'api/sys/role/GetListForUserGroupBy?userId=' + null;
        $scope.postNoAsync(url, null, function (data) {
            $scope.setting.valuelist.roleId = data;
            $timeout(function () {
                $("#select-role").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-role').selectpicker('refresh');
            });

        });
    };


    // Modal
    $scope.onloadModal = function () {

    };

    $scope.cmbRoleFilter = {
        url: "api/sys/role/GetListComboxbox",
        allowClear: true,
        placeholder: employeeTranslation.ROLEID,
    };

    $scope.loadData = function () {
        var searchValue = $("#full_text_filter").val();
        $scope.postData("api/pos/Employee/get", { searchValue: searchValue }, function (data) {

            if (data) {
                $scope.listData = data;
                $scope.grid.setData($scope.listData);
                $("#grvEmployee .slick-row :first").click();
                $scope.dataEmployee = angular.copy(data[0]);
                $scope.loadContactDefault($scope.dataEmployee.id);
                if ($scope.dataEmployee && $scope.dataEmployee.identificationPlace)
                    $scope.dataEmployee.identificationPlace = $scope.setting.valuelist.identificationPlace[data[0].identificationPlace].text;
            }

            $scope.calcListData();          
        });
    };

    $scope.resizeGrvContact = function () {
        $timeout(function () { $scope.grvContact.resizeCanvas() });
    };

    $scope.loadDataContact = function (employeeId) {
        $scope.postData("api/pos/Contact/GetById", { id: employeeId }, function (data) {
            $scope.listContact = data;
            $scope.grvContact.setData($scope.listContact);
        });
    };

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $scope.roleFilter = null;
    }

    $scope.changeGender = function (value) {
        $('input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioGender input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.gender = value;
    };

    $scope.changeRelation = function (value) {
        $('input[name="radio2"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioRelation input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.maritalStatus = value;
    };

    //function
    $scope.add = function () {
        $scope.removeAvatar = false;
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.gender = '1';
        $scope.data.maritalStatus = '1';
        $scope.data.active = true;
        $scope.data.roleId = [];
        $scope.changeGender('1');
        $scope.changeRelation('1');
        $scope.loadDataContact(null);

        $scope.defaultData = angular.copy($scope.data);
        $("#imgAvatar").attr("src", "/img/no_avatar.png");
        callModal('modal-detail');
        $("#code").prop('disabled', false);
        $("#barcode").prop('disabled', true);
        $('#code').focus();

        $timeout(function () {
            $("#elect-role").selectpicker('val', null);
            $("#select-role").selectpicker('refresh');
        });

        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};
    };

    $scope.edit = function () {
        $("#tab_01-tab").click();      
        $scope.removeAvatar = false;
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_CHOOSE_EMPLOYEE_EDIT"]);
        else {
            $scope.action = 'edit';
            $scope.changeGender(data.gender);
            $scope.changeRelation(data.maritalStatus);


            $scope.loadDataContact(data.id);
            $scope.data = angular.copy(data);


            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.avatar + "&def=/img/no-product.jpg");

            callModal('modal-detail');
            $('#firstName').focus();
            $("#code").prop('disabled', true);
            $("#barcode").prop('disabled', true);

            $timeout(function () {
                $("#elect-role").selectpicker('val', data.roleId);
                $("#select-role").selectpicker('refresh');
            });

            $scope.frmFile = new FormData();
            $scope.fileAvatar = {};

            $scope.grvContact.resizeCanvas();
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
            $scope.data.avatar = null;
            $scope.data.code = null;
            $scope.data.barcode = null;
            $("#imgAvatar").attr("src", "/img/no-product.jpg");

            callModal('modal-detail');
            $("#code").prop('disabled', true);
            $("#barcode").prop('disabled', true);
            $('#firstName').focus();
        }
    };


    $scope.save = function () {

        Slick.GlobalEditorLock.commitCurrentEdit();

        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if (!$scope.data.roleId || $scope.data.roleId.length == 0) {
            showWarning($scope.translation.ERR_ROLEID_REQUIRED);
            return;
        }

        if ($scope.fileAvatar && $scope.fileAvatar.file) {
            $scope.fileAvatar.append("file", $scope.fileAvatar.file);
        }

       // $scope.data.identificationDate = moment($scope.data.identificationDate).format();
        debugger
        var a = $scope.data.birthday;
        $scope.frmFile.append("data", JSON.stringify($scope.data));

        if ($scope.listContact && $scope.listContact.length > 0) {
            var contactData = $scope.listContact.filter(x => x.name.trim() == "");
            if (contactData.length > 0) {
                showWarning($scope.translation.DATACONTACT_EMPTY);
                return;
            }
              
            $scope.frmFile.append("dataContact", JSON.stringify($scope.listContact));
        }


        $scope.frmFile.append("removeAvatar", $scope.removeAvatar);

        if ($scope.action == 'add') {
            $scope.postFile("api/pos/Employee/Add", $scope.frmFile, function (data) {
                if (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail').modal('hide');
                    $scope.grid.dataView.insertItem(0, data);
                   // $scope.grid.sortData('code', true);
                }             
            });
        }
        else {
            $scope.postFile("api/pos/Employee/Update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();


                $scope.$applyAsync(function () {
                    $scope.dataEmployee = data;
                    $scope.loadContactDefault(data.id);  

                    if ($scope.dataEmployee && $scope.dataEmployee.identificationPlace)
                        $scope.identificationPlaceText = $scope.setting.valuelist.identificationPlace[$scope.dataEmployee.identificationPlace].text;
                })           
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
        $scope.postData("api/pos/Employee/delete", { employee: $scope.dataDelete }, function (result) {
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

    //add new Step
    $scope.addRow = function () { 
        Slick.GlobalEditorLock.commitCurrentEdit();
        var vllIndex = $scope.grvContact.dataView.getLength();

        if (!$scope.listContact)
            $scope.listContact = [];

        var contact = { id : vllIndex, name: '', phone: '', email: '', relationship: '', address: '', note: ''};
        $scope.listContact.push(contact);

        $scope.grvContact.setData([]);
        $scope.grvContact.setData($scope.listContact);

        //focus fisrt cell
        $scope.grvContact.setActiveCell(vllIndex, 0);
        //$scope.grvContact.editActiveCell(Slick.Editors.Text);
    };

    //remove Step
    $scope.removeRow = function () {
        $scope.$applyAsync(function () {
            var selectedItem = $scope.grvContact.getDataItem($scope.grvContact.getSelectedRows([0]));
            var vllIndex = selectedItem == null ? 0 : selectedItem.id;

            $scope.listContact.splice(vllIndex, 1);

            $scope.grvContact.setData([]);
            $scope.grvContact.setData($scope.listContact);
        });
    };

    $scope.deleteAvatar = function () {
        $("#imgAvatar").attr("src", "/img/no_avatar.png");
        $scope.removeAvatar = true;
        //$scope.frmFile = new FormData();
        //$scope.fileAvatar = null;
    }

    $scope.searchObject = function () {
        var dataFilter = $scope.listData;
        if ($scope.roleFilter) {
            dataFilter = $scope.listData.filter(function (item) {
                if (item.roleId)
                    return item.roleId.includes($scope.roleFilter);
            });
        }      

        $scope.grid.setData(dataFilter);
        $scope.calcListData();
    }

    //change active
    $scope.changeActive = function (data) {
        $scope.data.active = !data;
    };

    $scope.saveAndContinue = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if (!$scope.data.roleId || $scope.data.roleId.length == 0) {
            showWarning($scope.translation.ERR_ROLEID_REQUIRED);
            return;
        }

        if ($scope.fileAvatar && $scope.fileAvatar.file) {
            $scope.fileAvatar.append("file", $scope.fileAvatar.file);
        }

        $scope.data.identificationDate = moment($scope.data.identificationDate).format();
        $scope.frmFile.append("data", JSON.stringify($scope.data));

        if ($scope.listContact && $scope.listContact.length > 0) {

            $scope.frmFile.append("dataContact", JSON.stringify($scope.listContact));
        }

        $scope.frmFile.append("removeAvatar", $scope.removeAvatar);

        $scope.postFile("api/pos/Employee/Add", $scope.frmFile, function (data) {
            if (data) {
                //$scope.refreshFrm();
                //$scope.defaultData = null;
                //$('#modal-detail').modal('hide');

                $scope.grid.dataView.insertItem(0, data);

                $scope.removeAvatar = false;
                $scope.data = {};
                $scope.data.gender = '1';
                $scope.data.maritalStatus = '1';
                $scope.data.active = true;
                $scope.data.roleId = [];
                $scope.changeGender('1');
                $scope.changeRelation('1');
                $scope.loadDataContact(null);

                $scope.defaultData = angular.copy($scope.data);
                $("#imgAvatar").attr("src", "/img/no-product.jpg");
                $("#code").prop('disabled', true);
                $("#barcode").prop('disabled', true);
                $('#firstName').focus();

                $timeout(function () {
                    $("#elect-role").selectpicker('val', null);
                    $("#select-role").selectpicker('refresh');
                });

                $scope.frmFile = new FormData();
                $scope.fileAvatar = {};
            }
        }); 

        $scope.calcListData();
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