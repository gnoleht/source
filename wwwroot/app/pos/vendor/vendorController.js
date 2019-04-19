'use strict';
app.register.controller('vendorController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.searchValue = "";

    $scope.dataVendor = {};

    $scope.displayFunction = function () {
        $scope.button.filter = true;
        $scope.button.search = false;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $('#full_text_filter').focus();
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
                $scope.data = $.extend(true, {}, $scope.grid.getCurrentData());
                $scope.dataSub = $.extend(true, {}, $scope.grid.getCurrentData());
                $scope.loadInvImport($scope.data.id);

                if (!$scope.$$phase)
                    $scope.$digest();
            });
        }
        //$scope.loadStore();
        $scope.loadBank();


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
            var width = $("#vendor .white_box").width();
            var height = $("#vendor .white_box").height();
            var box_control = $("#vendor .box_filter").height();

            if ($("#vendor .box_filter").is(":visible")) {
                $('#vendor .content_6 dd').height(height - 40 - box_control);
                $("#vendor .scroll").height(height - 25 - box_control);
            }
            else {
                $('#vendor .content_6 dd').height(height - 25);
                $("#vendor .scroll").height(height);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });
    $scope.resizeGrvContact = function () {
        $timeout(function () { $scope.grvContact.resizeCanvas() });
    };
    //function
    $scope.changeKind = function (value) {
        $('input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioKind input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.kind = value;
    };

    $scope.loadData = function () {
        $scope.postData("api/pos/vendor/get", { searchValue: $scope.searchValue }, function (data) {
            if (data) {
                $scope.grid.setData(data);
                $scope.data = data[0];
                $scope.dataSub = data[0];

                $scope.loadInvImport($scope.data.id);

                $("#grvVendor .slick-row :first").click();
            }
        });
    }

    $scope.loadInvImport = function (vendorId) {
        $scope.postData("api/pos/vendor/getlInvImport", { vendorId: vendorId }, function (data) {
            if (data) {
                $scope.dataSub.totalSaleOrder = data.dataInvImport.length;
                $scope.dataSub.dataInvImport = data.dataInvImport;
                $scope.dataSub.topItem = data.topItem;
            }
        });
    }

    $scope.loadDataContact = function (vendorId) {
        $scope.postData("api/pos/Contact/GetById", { id: vendorId }, function (data) {
            $scope.listContact = data;
            $scope.grvContact.setData($scope.listContact);

        });
    };

    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    }
    $scope.loadBank = function () {
        $scope.postData("api/pos/Bank/GetList", null, function (data) {
            $scope.setting.valuelist.bankId = data;
        });
    }

    $scope.deleteAvatar = function () {
        $("#imgAvatarVendor").attr("src", "/img/no-product.jpg");
        $scope.removeAvatar = true;
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.primaryCountry = "VN";
        $scope.data.kind = 1;
        $scope.data.gender = 1;
        $scope.changeKind(1);
        $scope.data.active = true;
        $scope.loadDataContact(null);
        $scope.defaultData = angular.copy($scope.data);
        $("#imgAvatarVendor").attr("src", "/img/no-product.jpg");
        callModal('modal-detail');

        $("#tab_01-tab").click();

        $("#code").prop('disabled', true);
        $('#name').focus();


        $scope.frmFile = new FormData();
        $scope.fileAvatarVendor = {};
    }

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = angular.copy(data);


            $scope.changeKind($scope.data.kind);
            $("#imgAvatarVendor").attr("src", "/api/system/viewfile?id=" + $scope.data.avatar + "&def=/img/no-product.jpg");

            callModal('modal-detail');
            $('#name').focus();
            $("#code").prop('disabled', true);
            $("#tab_01-tab").click();
            $scope.frmFile = new FormData();
            $scope.fileAvatarVendor = {};

            $scope.loadDataContact($scope.data.id);
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
            $scope.data.code = null;
            $scope.deleteAvatar();

            callModal('modal-detail');

            $("#tab_01-tab").click();
            $('#name').focus();
            $("#code").prop('disabled', true);
        }
    };

    $scope.save = function () {
        Slick.GlobalEditorLock.commitCurrentEdit();

        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        $scope.fileAvatarVendor = new FormData();
        //$scope.frmFile = new FormData();

        if ($scope.fileAvatarVendor && $scope.fileAvatarVendor.file) {
            $scope.frmFile.append("file", $scope.fileAvatarVendor.file);
        }
        if ($scope.removeAvatar) {
            $scope.frmFile.append("removeAvatar", $scope.removeAvatar);
        }

        if ($scope.data) {
            $scope.data.birthDay = moment($scope.data.birthDay).format();

            $scope.frmFile.append("data", JSON.stringify($scope.data));
        }
        debugger
        if ($scope.listContact)
            $scope.frmFile.append("dataContact", JSON.stringify($scope.listContact));

        if ($scope.action == 'add') {
            $scope.postFile("api/pos/vendor/Add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                //$scope.grid.sortData('code', true);
                $scope.grid.invalidate();
            });

        }
        else {
            $scope.postFile("api/pos/vendor/Update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });

        }
        $scope.dataSub = $.extend(true, {}, $scope.data);
        $scope.loadInvImport($scope.data.id);

    };
    $scope.saveAndContinue = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        $scope.fileAvatarVendor = new FormData();
        //$scope.frmFile = new FormData();

        if ($scope.fileAvatarVendor && $scope.fileAvatarVendor.file) {
            $scope.frmFile.append("file", $scope.fileAvatarVendor.file);
        }
        if ($scope.removeAvatar) {
            $scope.frmFile.append("removeAvatar", $scope.removeAvatar);
        }

        if ($scope.data) {
            $scope.data.birthDay = moment($scope.data.birthDay).format();

            $scope.frmFile.append("data", JSON.stringify($scope.data));
        }
        debugger
        if ($scope.listContact)
            $scope.frmFile.append("dataContact", JSON.stringify($scope.listContact));

        if ($scope.action == 'add') {
            $scope.postFile("api/pos/vendor/Add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $scope.grid.dataView.insertItem(0, data);
                //$scope.grid.sortData('code', true);
                $scope.grid.invalidate();

                $scope.add();
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
        $scope.post("api/pos/vendor/remove", JSON.stringify($scope.data), function (lstDelete) {
            if (lstDelete) {
                $scope.grid.dataView.deleteItem($scope.data.id);
                $scope.grid.invalidate();
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

    //add new Step
    $scope.addRow = function () {
        Slick.GlobalEditorLock.commitCurrentEdit();
        var vllIndex = $scope.grvContact.dataView.getLength();

        if (!$scope.listContact)
            $scope.listContact = [];
        if ($scope.listContact.length > 0 && $scope.listContact[$scope.listContact.length - 1].name == '')
            return false;
        var contact = { id: vllIndex, name: '', phone: '', email: '', relationship: '', address: '', note: '' };
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


            $.each($scope.listContact, function (index, val) {
                val.id = index;
            });

            $scope.grvContact.setData([]);
            $scope.grvContact.setData($scope.listContact);
        });
    };

}]);