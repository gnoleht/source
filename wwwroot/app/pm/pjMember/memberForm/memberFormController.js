'use strict';
app.register.controller('memberFormController', ['$scope', '$location', '$sce', 'authService', '$timeout', function ($scope, $location, $sce, authService, $timeout) {
    //
    $scope.userDetail = null;
    $scope.gitlabMember = null;
    $scope.objectTemp = null;
    $scope.privateToken = null;
    $scope.checkRoleTemp = false;

    //init
    //init('member', $scope, httpService);

    //$scope.$on('$routeChangeSuccess', function () {
    $scope.onLoad = function () {
        init('memberForm', $scope, true);        
        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        var id = $scope.params.module == 'pm' ? $scope.params.pid : $scope.params.pjid;
        $scope.data.module = $scope.params.module;
                

        $scope.getListUser(null);

        $scope.postNoAsync('api/sys/role/getListByObjectId?id=' + id, null, function (data) {
            $scope.setting.valuelist.roleFull = data;
        });

        $scope.postNoAsync('api/pm/member/getListAreaByObjectId?id=' + id, null, function (data) {
            $scope.setting.valuelist.projectArea = data;
        });

        $scope.postNoAsync('api/pm/member/GetListRoleFilteredByObjectId?id=' + id, null, function (data) {
            $scope.setting.valuelist.role = data;
        });


        $scope.postNoAsync('api/sys/company/GetListForUser', null, function (data) {
            $scope.setting.valuelist.department = data;
        });


        $scope.setting.options.scope = $scope;


        $timeout(function () {
            $.ajax({
                url: '/app/pm/valuelist.json',
                type: 'get',
                dataType: 'json',
                cache: false,
                success: function (data) {
                    $scope.privateToken = data.privateToken[0].id;
                },
            });
        }, 0);

        //setSelectedMenu("areas");        
    };

    

    $scope.getListUser = function (search) {
        $scope.postData("api/pm/member/getListUserForProject", search, function (data) {
            $scope.setting.valuelist.userId = data;
        });
        
    };
    
    $scope.cmbUserId = {
        url: "api/pm/member/getListUserForProject",
        allowClear: true,
    };

    $scope.dataAction = function (action, data, area) {
        if (action == 'add') {
            $("#cmb-userId").removeAttr('disabled');
            $scope.action = "add";
            $scope.checkRoleTemp = true;
            //memberSetting.readonly.push("userId");
            $scope.data = {};
            $scope.data.module = $scope.params.module; //$scope.params.pjid;
            $scope.data.projectId = $scope.params.module == 'pm' ? $scope.params.pid : $scope.params.pjid; //$scope.params.pjid;
            $scope.data.payRanges = "Mức 1";
            if (area != null && area != undefined) {
                $scope.data.projectArea = [];
                $scope.data.projectArea.push(area);
            }

            $("#imgAvatar").attr("src", "img/no_avatar.png");

            $scope.defaultData = $.extend(true, {}, $scope.data);
            callModal('modal-detail-member-root', true, 'userId');
        }
        else if (action == 'edit') {
            //var data = $scope.grid.getCurrentData();
            $scope.checkRoleTemp = $scope.checkRole(data.role);
            $("#cmb-userId").attr('disabled', 'disabled');

            if (data == null)
                showError($scope.translation["ERR_UPDATE_NULL"]);
            else {

                $scope.action = "edit";
                $scope.data = $.extend(true, {}, data);
                var thisAvatar = $scope.data.user != null ? $scope.data.user.avatarThumb : "";

                $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + thisAvatar + "&def=/img/no_avatar.png");
                $scope.defaultData = $.extend(true, {}, $scope.data);

                callModal('modal-detail-member-root');
                $("#firstName").focus();
            }
        }
    }

    $scope.checkRole = function (listRole) {        
        var fullRole = $scope.setting.valuelist.roleFull;
        var temp = 0;
        for (var i = 0; i < listRole.length; i++) {
            var thisCode = fullRole.filter(function (item) { return item.id === listRole[i]; })[0];
            if (thisCode != null) {
                if (thisCode.code.endsWith(".PM") || thisCode.code.endsWith(".PO") || thisCode.code.endsWith(".SP")) {
                    return false;
                }
            }
        }
        return true;
    };




    $scope.checkMemberInGroupGitLab = function (username, groupid) {
        $scope.objectTemp = null;
        var urlCheckMember = "http://172.16.7.65:1212/api/v4/users?username=" + username;
        $scope.getData(urlCheckMember, function (data, response) {
            if (response.length > 0) {
                var thisMemberDetail = response[0];
                var urlGetMemberToGroups = "http://172.16.7.65:1212/api/v4/groups/" + groupid + "/members/" + thisMemberDetail.id + "?private_token=" + $scope.privateToken;
                $scope.getData(urlGetMemberToGroups, function (data, response) {
                    if (response != undefined)
                        $scope.objectTemp = response;
                });
            }
        });
        return $scope.objectTemp;
    };

    $scope.addMemberGitlab = function (username, fullname, email, groupid) {
        var urlCheckMember = "http://172.16.7.65:1212/api/v4/users?username=" + username;// + "?private_token=B37ZFssarsjT7FxFwEZM";
        var urlAddkMember = "http://172.16.7.65:1212/api/v4/users" + "?private_token=" + $scope.privateToken;
        var urlAddkMemberToGroups = "http://172.16.7.65:1212/api/v4/groups/" + groupid + "/members" + "?private_token=" + $scope.privateToken;
        $scope.getData(urlCheckMember, function (data, response) {
            if (response.length > 0) {
                $scope.gitlabMember = response[0];
            }
            else {
                var dataMember = new Object();
                dataMember.username = username;
                dataMember.password = "Lacviet@@123#";
                dataMember.email = email;
                dataMember.name = fullname;
                

                $scope.postData(urlAddkMember, dataMember, function (data, response) {
                    $scope.gitlabMember = response;
                });
            }            

            if ($scope.gitlabMember != null) {
                var dataMemberToGroup = new Object();
                dataMemberToGroup.user_id = $scope.gitlabMember.id;
                dataMemberToGroup.access_level = 30; //30 dev
                //if (coderole.endsWith(".DEV") || coderole.endsWith(".Lead")) {
                //    code = 30;
                //}
                $scope.postData(urlAddkMemberToGroups, dataMemberToGroup, function (data, response) {                    
                    return;
                });
            }
        });
        return;
    }

    $scope.deleteMemberGitlab = function (username, groupid) {
        var urlCheckMember = "http://172.16.7.65:1212/api/v4/users?username=" + username;
        
        $scope.getData(urlCheckMember, function (data, response) {
            if (response.length > 0) {
                var thisMemberDetail = response[0];
                var urlDeletekMemberToGroups = "http://172.16.7.65:1212/api/v4/groups/" + groupid + "/members/" + thisMemberDetail.id + "?private_token=" + $scope.privateToken;
                $.ajax({
                    url: urlDeletekMemberToGroups,
                    type: "DELETE",
                    dataType: "json",
                    async: false,
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success: function (response) {
                        console.log("Deleted");
                    },
                    fail: function (response) {
                        showError(response);
                        console.log(response);
                    },
                });
            }
        });

        
        return;
    }


    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        if ($scope.action == 'add') {
            $scope.frmFile.set("data", JSON.stringify($scope.data));
            $scope.postFile("api/pm/member/Add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-member-root').modal('hide');
                //add member for gitlab group  
                var checkRoleDev = data.relatedRoles.filter(function (item) { return item.code.endsWith(".DEV") || item.code.endsWith(".Dev Lead")}).length > 0;
                if (checkRoleDev)
                    if ($scope.checkMemberInGroupGitLab(data.userId, data.project.gitlabGroupId) == null)
                        $scope.addMemberGitlab(data.userId, data.user.firstName + ", " + data.user.lastName, data.user.email, data.project.gitlabGroupId);

                $scope.$parent.saveMember($scope.action, data);
                //$scope.grid.dataView.insertItem(0, data);
                //$scope.grid.invalidate();
            });
            
        }
        else {           
            if ($scope.data.module == null) $scope.data.module = $scope.params.module;
            $scope.frmFile.set("data", JSON.stringify($scope.data));
            $scope.postFile("api/pm/member/Update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail-member-root').modal('hide');

                    
                //add member for gitlab group  
                var checkRoleDev = data.relatedRoles.filter(function (item) { return item.code.endsWith(".DEV") || item.code.endsWith(".Dev Lead") }).length > 0;
                var checkMemberInGroupGitLabTemp = $scope.checkMemberInGroupGitLab(data.userId, data.project.gitlabGroupId);
                if (checkRoleDev) {
                    if (checkMemberInGroupGitLabTemp == null)
                        $scope.addMemberGitlab(data.userId, data.user.firstName + ", " + data.user.lastName, data.user.email, data.project.gitlabGroupId);
                }
                else if (checkMemberInGroupGitLabTemp != null)
                    $scope.deleteMemberGitlab(data.userId, data.project.gitlabGroupId);

                $scope.$parent.saveMember($scope.action, data);
                //$scope.grid.dataView.updateItem(data.id, data);
                //$scope.grid.invalidate();
            });
            
        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (!$scope.checkRole(data.role)) {
            showError($scope.translation.ERR_CANT_EDIT);
            return;
        }
        if (data == null)
            showError($scope.translation["ERR_DELETE_NULL"]);
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };

    $scope.deleteData = function () {
        
        $scope.post("api/pm/member/remove", JSON.stringify($scope.data), function () {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();

            //delete user in gitlab
            if ($scope.checkMemberInGroupGitLab($scope.data.userId, $scope.data.project.gitlabGroupId) != null)
                $scope.deleteMemberGitlab($scope.data.userId, $scope.data.project.gitlabGroupId);
        });
    };


    $scope.checkNotNull = function (parameter) {
        if (parameter == null || parameter == undefined || parameter.length <= 0 || parameter == {}) return false;
        return true;
    };

    $scope.changeUserId = function () {
        $scope.postNoAsync("api/pm/member/GetUserDetail?userid=" + $scope.data.userId, null, function (data) {
            if (data != null) {
                // split ho - ten
                $scope.data.user = {};
                var displayNameSplit = data.displayName.split(",");
                $scope.data.user.firstName = displayNameSplit[0];
                $scope.data.user.lastName = displayNameSplit[1];
                $scope.data.user.workPhone = data.mobilePhone;
                $scope.data.user.mobilePhone = data.mobilePhone;
                $scope.data.user.birthDay = data.birthDay;
                $scope.data.user.email = data.email;
                $scope.$apply();

                $scope.postNoAsync("api/pm/member/GetUserSys?userid=" + $scope.data.userId, null, function (data) {
                    if (data != null) {
                        $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + data.avatarThumb + "&def=/img/no_avatar.png");
                    }
                    else
                        $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + "" + "&def=/img/no_avatar.png");
                });
                //$("#birthDay").focus();
            }

        });
    };

    $scope.configDepartment = {
        templateResult: function (state, element) {
            if (!state.id) {
                return state.text;
            }
            if (state.text == '') {
                return null;
            }

            var option = JSON.parse(state.element.attributes.opt.value);
            var nodeOpt = option.opt;
            if (nodeOpt != null) {
                return $('<span style="padding-left:' + nodeOpt.indent + 'px">' + state.text + '</span>');
            }
            else
                return state.text;
        },
    };
}]);



