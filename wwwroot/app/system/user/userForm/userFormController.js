'use strict';
app.register.controller('userFormController', ['$scope', 'socketService', '$timeout', function ($scope, socketService, $timeout) {
    $scope.lDAPLogin = null;
    $scope.roleGroup = '';
    $scope.removeAvatar = false;
    //init
    //init('member', $scope, httpService);
    $scope.onLoad = function () {
        init('userForm', $scope, true);

        $scope.loadProvinceDistrict();
        $scope.getListUser(null);

        $scope.postData("api/sys/user/GetLDAPLogin", null, function (data) {
            $scope.lDAPLogin = data;
        });

        $(".switch").click(function () {
            $(this).toggleClass("change");
            $scope.data.active = !$scope.data.active;
        });

        $('.advancedDropzoneUser').dropzone({
            acceptedFiles: 'image/*',
            addedfile: function (file) {
                $scope.fileAvatar.file = file;
                //$scope.frmFile.append("file", file);
                $('#imgAvatarUser').attr("src", window.URL.createObjectURL(file));
            },
        });

    };

    $scope.loadCompany = function () {
        var url = 'api/sys/company/getListForUser?userId=' + $scope.data.id;
        $scope.postNoAsync(url, null, function (data) {
            $scope.setting.valuelist.company = data;
            $timeout(function () {
                $("#select-company").selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                });
                $('#select-company').selectpicker('refresh');
            });

            $scope.listCompany = data;
        });
    };
    $scope.loadRole = function () {
        var url = '';
        if ($scope.roleGroup)
            url = 'api/sys/role/GetListForUserGroupBy?userId=' + $scope.data.id + '&objectCode=' + $scope.roleGroup;
        else
            url = 'api/sys/role/GetListForUserGroupBy?userId=' + $scope.data.id;

        $scope.postNoAsync(url, null, function (data) {
            $scope.setting.valuelist.role = data;
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

            $scope.listRole = data;
        });
    };
    $scope.loadProvinceDistrict = function () {
        //get  province//get  district
        $.ajax({
            url: './js/resources/address.json/province.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $scope.setting.valuelist.province = data;
                $.ajax({
                    url: './js/resources/address.json/district.json',
                    type: 'get',
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        $scope.tempArrayDistrict = $.map(data, function (value, index) {
                            return { "id": value.id, "text": value.text, "parent_code": value.parent_code };
                        });
                        $scope.setting.valuelist.district = $scope.tempArrayDistrict;

                        if ($scope.data.province != null && $scope.data.province != undefined) {
                            $scope.setting.valuelist.district = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.province; });
                        }
                    },
                });
            },
        });
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

    $scope.dataAction = function (action, data, type, parentId, roleGroup) {
        if (roleGroup) {
            $scope.roleGroup = roleGroup;
        }

        $scope.type = type;
        $scope.parentId = parentId;
        if (action == 'add') {
            $("#cmb-userId").removeAttr('disabled');
            $scope.data = data;
            $scope.data.id = "";
            $scope.action = 'add';
            $scope.data.active = false;

            $("#imgAvatarUser").attr("src", "/img/no_avatar.png");
            $scope.loadCompany();
            $scope.loadRole();
            $scope.defaultData = $.extend(true, {}, $scope.data);
            $scope.activeTab = 1;
            callModal('userForm', true, 'id');
            $("#id").attr('disabled', false);
            $("#id").focus();
            $scope.frmFile = new FormData();
            $scope.fileAvatar = {};
        }
        else if (action == 'edit') {
            $("#cmb-userId").attr('disabled', 'disabled');
            if (data == null) {
                showError($scope.translation.ERR_UPDATE_NULL);
                return;
            }

            if (data.id.toLowerCase() == 'admin') {
                showError($scope.translation.ERR_UPDATE_ADMIN);
                return;
            }

            $scope.action = 'edit';
            $scope.data.password = null;
            $("#imgAvatarUser").attr("src", "/api/system/viewfile?id=" + $scope.data.avatarThumb + "&def=/img/no_avatar.png");
            $scope.loadCompany();
            $scope.loadRole();
            $scope.defaultData = $.extend(true, {}, $scope.data);
            $scope.activeTab = 1;
            $scope.$applyAsync(function () { $scope.data = $.extend(true, {}, data) });
            callModal('userForm', true, 'id');
            $("#userFirstName").focus();
            $scope.frmFile = new FormData();
            $scope.fileAvatar = {};
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.action == 'add') {
            //$scope.frmFile = new FormData();
            if ($scope.fileAvatar && $scope.fileAvatar.file) {
                $scope.fileAvatar.append("file", $scope.fileAvatar.file);
            }
          

            $scope.frmFile.append("data", JSON.stringify($scope.data));
            if ($scope.type) $scope.frmFile.append("type", $scope.type);
            if ($scope.parentId) $scope.frmFile.append("parentId", $scope.parentId);

            $scope.postFile("api/sys/user/add", $scope.frmFile,
                function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#userForm').modal('hide');
                    $scope.$parent.saveUser($scope.action, data);
                },
                function (data) {
                    $scope.refreshFrm(['data']);
                });
        }
        else if ($scope.action == 'edit') {
            //var updateData = { user: $scope.data }
            //$scope.frmFile = new FormData();
            $scope.frmFile.append("data", JSON.stringify($scope.data));
            $scope.frmFile.append("roleGroup", $scope.roleGroup);
            
            if ($scope.type) $scope.frmFile.append("type", $scope.type);
            if ($scope.parentId) $scope.frmFile.append("parentId", $scope.parentId);
            $scope.postFile("api/sys/user/update", $scope.frmFile,
                function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#userForm').modal('hide');
                    $scope.$parent.saveUser($scope.action, data);
                },
                function (data) {
                    $scope.refreshFrm(['data']);
                })
        }
        else if ($scope.action == 'changePass') {
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

    $scope.ChangeProvince = function () {
        $scope.setting.valuelist.district = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.address.province; });
        $scope.data.address.district = $scope.setting.valuelist.district[0].id;
    };
    $scope.AddSocial = function () {
        if ($scope.data.socials == null || $scope.data.socials == undefined) {
            $scope.data.socials = [];
        }
        $scope.data.socials.push("");
        $timeout(function () {
            $('.input-social')[$('.input-social').length - 1].focus();
        }, 1);
    };
    $scope.FindImage = function (item) {
        var srcTemp = "/images/www.png";
        var temp = $scope.setting.valuelist.iconSocials.find(function (element) {
            //var tempLower = element.id.toLowerCase();
            return (item.toLowerCase()).indexOf(element.id) >= 0;
        });
        if (temp == null || temp == undefined)
            return srcTemp;
        return temp.text;
    };
    $scope.DeleteSocial = function (item) {
        var index = $scope.data.socials.indexOf(item);
        if (index !== -1) $scope.data.socials.splice(index, 1);
    };

    $scope.checkNotNull = function (parameter) {
        if (parameter == null || parameter == undefined || parameter.length <= 0 || parameter == {}) return false;
        return true;
    };

    $scope.changeUserId = function () {
        $scope.post("api/sys/user/GetUserDetail?userid=" + $scope.data.id, null, function (data) {
            if (data != null) {
                // split ho - ten
                var displayNameSplit = data.displayName.split(", ");
                $scope.data.firstName = displayNameSplit[0];
                $scope.data.lastName = displayNameSplit[1];
                $scope.data.email = data.email;

                $scope.data.birthDay = data.birthDay;
                $scope.data.mobilePhone = data.mobilePhone;

                $scope.data.address = data.address;
                $scope.data.company = data.company == null ? [] : data.company;
                $scope.data.role = data.role == null ? [] : data.role;
                $scope.$apply();
                $("#firstName").focus();

            }

        });
    };
    $scope.getUniqueValuesOfKey = function (array, key) {
        return array.reduce(function (carry, item) {
            if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
            return carry;
        }, []);
    };


}]);



