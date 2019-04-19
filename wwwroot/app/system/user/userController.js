'use strict';
app.register.controller('userController', ['$scope', 'socketService', function ($scope, socketService) {

    $scope.lDAPLogin = null;
    //init
    $scope.$on('$routeChangeSuccess', function () {
        if ($scope.grid != null) {
            $scope.grid.loadData();
        }
        $scope.getListUser(null);

        $scope.postData("api/sys/user/GetLDAPLogin", null, function (data) {
            $scope.lDAPLogin = data;
        });

    });

    $scope.displayFunction = function () {
        $("#btnChangePass").show();
        $scope.button.editLanguage = true;
        $scope.button.filter = false;
    };

    $scope.getListUser = function (search) {
        $scope.postData("api/sys/user/getListUserForProject", search, function (data) {
            $scope.setting.valuelist.userId = data;
        });

    };

    $scope.cmbUserId = {
        url: "api/sys/user/getListUserForProject",
        allowClear: true,
    };

    $scope.clearData = function () {
        $scope.post("api/system/clearDummyData", null, function (data) {
            if (data) showSuccess("Done");
        });
    };

    //function
    $scope.add = function () {
        //$scope.clearData();
        //return;

        $scope.action = 'add';
        $scope.data = {};
        $scope.childScope['userForm'].dataAction($scope.action, $scope.data, null, null);
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError($scope.translation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.childScope['userForm'].dataAction($scope.action, data, null, null, "SYSTEM");
        }
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
            $scope.defaultData = $.extend(true, {}, $scope.data);
            $scope.childScope['userForm'].dataAction($scope.action, $scope.data, null, null);

            //var url = 'api/sys/role/GetListForUser?userId=' + $scope.data.id;
            //$scope.postNoAsync(url, null, function (data) {
            //    $scope.setting.valuelist.role = data;
            //    $scope.listRole = data;
            //});

            //var url = 'api/sys/company/getListForUser?userId=' + $scope.data.id;
            //$scope.postNoAsync(url, null, function (data) {
            //    $scope.setting.valuelist.company = data;
            //    $scope.listCompany = data;
            //});

            //callModal('modal-detail');
            //$("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.avatarThumb + "&def=/img/no_avatar.png");
            //$("#id").attr('disabled', false);
            //$("#id").focus();
        }
    };

    $scope.saveUser = function (action, data) {      
        if (action == 'add') {
            $scope.grid.dataView.insertItem(0, data);
            $scope.grid.invalidate();
        }
        else {
            $scope.grid.dataView.updateItem(data.id, data);
            $scope.grid.invalidate();
        }
    };
    $scope.save = function () {
        if ($scope.action == 'changePass') {
            if ($scope.data.newPassword != $scope.data.newPassword2) {
                showError($scope.translation.ERR_INCORRECT_PASS_CONFIRM);
            }
            else {
                $scope.data.password = $scope.data.newPassword;
                $scope.post("api/sys/user/changePassword", JSON.stringify($scope.data), function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-changePass').modal('hide');
                    $scope.grid.dataView.updateItem(data.id, data);
                });
            }
        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) {
            showError($scope.translation.ERR_UPDATE_NULL);
            return;
        }

        if (data.id.toLowerCase() == 'admin') {
            showError($scope.translation.ERR_REMOVE_ADMIN);
            return;
        }

        $scope.data = data;
        $('#modal-confirm').modal();
    };

    $scope.deleteData = function () {
        $scope.post("api/sys/user/delete", JSON.stringify($scope.data), function (data) {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
        });
    };

    //more function
    $scope.changePass = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) return;

        if (data.id.toLowerCase() == 'admin') {
            showError($scope.translation.ERR_UPDATE_ADMIN);
            return;
        }

        $scope.action = 'changePass';
        $scope.data = $.extend(true, {}, data);
        $scope.data.password = null;
        $scope.passConfirm = null;
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-changePass');
    };

    $scope.addUserRoleData = function (item) {
        var data = $scope.data;
        var element = $("#i_" + item.id);
        if (element.hasClass("bowtie-checkbox")) {
            element.removeClass("bowtie-checkbox").addClass("bowtie-checkbox-empty");
            $.each($scope.listRole, function (index, obj) {
                if (obj.id == item.id) {
                    obj.value = false;
                    return;
                }
            });
        }
        else {
            element.removeClass("bowtie-checkbox-empty").addClass("bowtie-checkbox");
            $.each($scope.listRole, function (index, obj) {
                if (obj.id == item.id) {
                    obj.value = true;
                    return;
                }
            });
        }
    };

    $scope.addUserGroupData = function (item) {
        var data = $scope.data;
        var element = $("#i_" + item.id);

        if (element.hasClass("bowtie-checkbox")) {
            element.removeClass("bowtie-checkbox").addClass("bowtie-checkbox-empty");
            $.each($scope.listGroup, function (index, obj) {
                if (obj.id == item.id) {
                    obj.value = false;
                    return;
                }
            });
        }
        else {
            element.removeClass("bowtie-checkbox-empty").addClass("bowtie-checkbox");
            $.each($scope.listGroup, function (index, obj) {
                if (obj.id == item.id) {
                    obj.value = true;
                    return;
                }
            });
        }
    };

    $scope.addUserBusinessUnitData = function (item) {
        var data = $scope.data;
        var element = $("#i_" + item.id);
        if (element.hasClass("bowtie-checkbox")) {
            element.removeClass("bowtie-checkbox").addClass("bowtie-checkbox-empty");
            $.each($scope.listCompany, function (index, obj) {
                if (obj.id == item.id) {
                    obj.value = false;
                    return;
                }
            });
        }
        else {
            element.removeClass("bowtie-checkbox-empty").addClass("bowtie-checkbox");
            $.each($scope.listCompany, function (index, obj) {
                if (obj.id == item.id) {
                    obj.value = true;
                    return;
                }
            });
        }
    };

    //search userid
    $scope.changeUserId = function () {
        $scope.post("api/sys/user/GetUserDetail?userid=" + $scope.data.id, null, function (data) {
            if (data != null) {
                // split ho - ten
                var displayNameSplit = data.displayName.split(", ");
                $scope.data.firstName = displayNameSplit[0];
                $scope.data.lastName = displayNameSplit[1];
                $scope.data.email = data.email;
                $scope.$apply();
                $("#firstName").focus();

            }

        });
    };
}]);
