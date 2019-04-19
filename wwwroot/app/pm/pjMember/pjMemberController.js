'use strict';
app.register.controller('pjMemberController', ['$scope', '$location', '$sce', 'authService', '$timeout', function ($scope, $location, $sce, authService, $timeout) {
    //
    $scope.userDetail = null;
    $scope.gitlabMember = null;
    $scope.objectTemp = null;
    $scope.privateToken = null;
    $scope.checkRoleTemp = false;

    //init
    //init('member', $scope, httpService);

    $scope.$on('$routeChangeSuccess', function () {

        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        var id = $scope.params.module == 'pm' ? $scope.params.pid : $scope.params.pjid;
        $scope.data.module = $scope.params.module;

        //$(window).resize(function () {
        //    var height = $("#pjMember .white_box").height();
        //    var width = $("#pjMember .white_box").width();          
        //    $("#tab-content").height(height - 55);
        //});

        //$(window).resize();

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

        $scope.refresh = function () {
            var url = $scope.setting.grid.url + "?pjid=" + $scope.params.pjid + "&pid=" + $scope.params.pid + "&module=" + $scope.params.module + "&area=" + $scope.params.area;
            $scope.postNoAsync(url, null, function (data) {

                $scope.grid.setData(data);
            });
        };

        var columns = $scope.setting.grid.columns.filter(x => x.id != "projectArea");
        if ($scope.params.module!= "pj")
            $scope.grid.setColumns(columns);

        $scope.refresh();

    
        $scope.grid.onClick.subscribe(function (e, args) {
            if ($(e.target).hasClass("checkWI")) {
                $scope.UpdateNonCapacity(e, args);
            }
            $("#contextListCurrentRole").hide();
            $scope.collapseChild(e, args);

        });

       

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

        setSelectedMenu("areas");        
    });

    $(document).click(function (e) {
        var tag = $(e.target);
        if (!tag.hasClass("showRoles")) {
            $("#contextListCurrentRole").hide();
        }
        if (!tag.hasClass("showAreas")) {
            $("#contextListCurrentArea").hide();
        }
    });

    $scope.getListUser = function (search) {
        //$scope.postNoAsync('api/pm/member/getListUserForProject', null, function (data) {
        //    $scope.setting.valuelist.userId = data;
        //});
        $scope.postData("api/pm/member/getListUserForProject", search, function (data) {
            $scope.setting.valuelist.userId = data;
        });
        
    };
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
    $scope.cmbUserId = {
        url: "api/pm/member/getListUserForProject",
        allowClear: true,
    };


    $scope.displayTitle = function () {
        if ($scope.params.module == "pm") {
            toogleProduct(true);
            if ($scope.params.area) {
                toogleArea(true);
            }
        }
        else if ($scope.params.module == "pj") {
            toogleProject(true);
            if ($scope.params.area) {
                toogleArea(true);
            }
        }
    };
    $scope.displayFunction = function () {
        $scope.button.delete = true;
        $scope.button.edit = true;
        $scope.button.add = true;
        $scope.button.refresh = true;
        $scope.button.copy = false;

        if ($scope.params.module == "pj")
            $('#btnAddProjectArea').show();
    };
    $scope.UpdateNonCapacity = function (e, args) {
        var item = $scope.grid.dataView.getItem(args.row);
        $scope.action = "edit";
        item.nonCapacity = item.nonCapacity ? false : true;
        $scope.data = item;
        $scope.childScope['memberForm'].save();
    };
    $scope.reloadGrid = function () {
        var url = $scope.setting.grid.url += "?pjid=" + $scope.params.pjid + "&pid=" + $scope.params.pid + "&module=" + $scope.params.module;
        $scope.post(url, null, function (data) {
            $scope.grid.setData(data);
        });
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.childScope['memberForm'].dataAction($scope.action, $scope.data, $scope.params.area);
    };

    

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError($scope.translation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.childScope['memberForm'].dataAction($scope.action, data, $scope.params.area);
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

            $("#imgAvatar").attr("src", "img/no_avatar.png");
            callModal('modal-detail');
            $("#userId").focus();
        }
    };



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


    $scope.saveMember = function (action, data) {
        if (action == 'add') {            
            $scope.grid.dataView.insertItem(0, data);
            $scope.grid.invalidate();
            
        }
        else {           
            $scope.grid.dataView.updateItem(data.id, data);
            $scope.grid.invalidate();
            
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

    $scope.collapseChild = function (e, args) {
        var dataView = args.grid.dataView;
        if (args.grid.name == "grvMember") {
            if ($(e.target).hasClass("showRoles")) {
                var item = $scope.grid.dataView.getItem(args.row);
                if (item) {
                    $scope.listCurrentRole = $.grep($scope.setting.valuelist.roleFull, function (e) {
                        return $.inArray(e.id, item.role) != -1;
                    });
                    $scope.$applyAsync();
                }
                $("#contextListCurrentRole").css({ "top": (e.pageY + 15) + "px", "left": (e.pageX + 10) + "px" }).show();

            }
            if ($(e.target).hasClass("showAreas")) {
                var item = $scope.grid.dataView.getItem(args.row);
                if (item) {
                    $scope.listCurrentArea = $.grep($scope.setting.valuelist.projectArea, function (e) {
                        return $.inArray(e.id, item.projectArea) != -1;
                    });
                    $scope.$applyAsync();
                }
                $("#contextListCurrentArea").css({ "top": (e.pageY + 15) + "px", "left": (e.pageX + 10) + "px" }).show();

            }
        }
    };

}]);



