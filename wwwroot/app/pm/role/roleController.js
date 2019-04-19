'use strict';
app.register.controller('roleController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.$on('$routeChangeSuccess', function () {
        $scope.activeTabId = "tabPermissions";
        $scope.roleGroup = $scope.params.module == "pm" ? $scope.params.pid : $scope.params.pjid;

        $scope.postNoAsync('api/sys/role/getGroup', null, function (data) {
            $scope.setting.valuelist.roleGroup = data
        });

        $scope.postNoAsync('api/sys/function/getModuleList', null, function (data) {
            $scope.setting.valuelist.module = data
        });

        $scope.refresh = function () {
            var params = { objectId: $scope.roleGroup };
            $scope.postData($scope.setting.grid.url, params, function (data) {
                $scope.grid.dataView.beginUpdate();
                $scope.grid.dataView.setItems(data);
                $scope.grid.dataView.endUpdate();
                $scope.grid.selectedRow(0);
            });
        };

        if ($scope.grid) {
            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                if ($scope.activeTabId == 'tabMembers') {
                    $scope.loadUserByRole();
                }
                if ($scope.activeTabId == 'tabPermissions') {
                    $scope.loadPermissionsByRole();
                }
            });

            $scope.grid.editAction = function () { $scope.edit(); };
            $scope.refresh();
        }

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            var searchValue = $("#inputSearch").val();
            var params = { objectId: $scope.roleGroup, searchValue: searchValue };
            $scope.postData($scope.setting.grid.url, params, function (data) {
                $scope.grid.dataView.beginUpdate();
                $scope.grid.dataView.setItems(data);
                $scope.grid.dataView.endUpdate();
            });
        };

        $(window).resize(function (e) {
            if ($scope.grvUserRole)
                $scope.grvUserRole.resizeCanvas();
        });
    });

    $scope.refreshTab = function () {
        if ($scope.activeTabId == 'tabPermissions') $scope.loadPermissionsByRole();
        if ($scope.activeTabId == 'tabMembers') $scope.loadUserByRole();
    };

    $scope.tabChange = function (id) {
        $scope.activeTabId = id;
    };

    $scope.roleGroupChange = function () {
        $scope.refresh();
    };

    $scope.displayFunction = function () {
        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.delete = false;
        $scope.button.refresh = false;
        $scope.button.copy = false;
        $("#btnUpdatePermission").show();
    };

    $scope.updateAllRole = function () {
        $scope.post("api/sys/role/updateAll", null, function (data) {
            if (data) showSuccess("Complete");
        });
    };

    $scope.loadUserByRole = function () {
        if (!$scope.grvUserRole) {
            $scope.buildGridUser();
        }

        var role = $scope.grid.getCurrentData();
        if (role) {
            var params = { role: role.id };

            $scope.postData('api/sys/role/getUserByRole', params, function (data) {
                if (data) {
                    $scope.grvUserRole.setData(data);
                    $timeout(function () { $scope.grvUserRole.resizeCanvas() });
                }
            });
        }
        else {
            $scope.grvUserRole.setData([]);
        }
    };

    $scope.buildGridUser = function () {
        initSlickGrid($scope, 'grvUserRole');

        $scope.grvUserRole.onClick.subscribe(function (e, args) {
            if ($(e.target).hasClass("btnEditUser")) {
                var item = args.grid.dataView.getItem(args.row);
                $scope.editUserRole(item);
            }
            if ($(e.target).hasClass("btnRemoveUser")) {
                $scope.removeUserRow = angular.copy(args.grid.dataView.getItem(args.row));
                $scope.$digest();
                $scope.deleteUserRole(true);
            }
        });

        $scope.grvUserRole.editAction = function (grid, data) {
            $scope.editUserRole(data);
        }
    };

    $scope.loadPermissionsByRole = function () {
        if (!$scope.grvPermissions) {
            $scope.buildGridPermissions();
        }
        var role = $scope.grid.getCurrentData();
        if (role) {
            $scope.postData('api/sys/function/loadRolePermission', { roleId: role.id, code: $scope.params.module.toUpperCase() }, function (data) {
                if (data) {
                    $.each(data, function (index, item) { item.isCollapsed = true });
                    $scope.grvPermissions.setData(data);
                    $timeout(function () {
                        $scope.grvPermissions.resizeCanvas();
                        $scope.grvPermissions.selectedRow(0);
                    });
                    $scope.listChange = [];
                }
            });
        }
        else {
            $scope.grvPermissions.setData([]);
        }
    };

    $scope.buildGridPermissions = function () {
        initSlickGrid($scope, 'grvPermissions');

        $scope.grvPermissions.editAction = function (grid, data) { };

        $scope.grvPermissions.onSelectedRowsChanged.subscribe(function (e, args) {
            var item = args.grid.dataView.getItem(args.rows);
            if (item) $scope.loadAction(item);
        });

        $scope.grvPermissions.customFilter = function (data) {
            if (data.parent == null) return true;
            var dataView = $scope.grvPermissions.dataView;

            var parent = dataView.getItemById(data.parent);
            if (parent == undefined || parent == null) return true;
            if (parent.isCollapsed) data.isCollapsed = true;
            return !parent.isCollapsed;
        };

        $scope.grvPermissions.onClick.subscribe(function (e, args) {
            if ($(e.target).hasClass("toggle")) {
                var item = $scope.grvPermissions.dataView.getItem(args.row);
                if (item) {
                    if (!item.isCollapsed) {
                        item.isCollapsed = true;
                    } else {
                        item.isCollapsed = false;
                    }
                    $scope.grvPermissions.dataView.updateItem(item.id, item);
                }
                //e.stopImmediatePropagation();
            }
        });
    }

    $scope.loadAction = function (permissions) {
        if (!$scope.grvAction) $scope.buildGridAction();
        if (!permissions) permissions = $scope.grvPermissions.getCurrentData();

        var gridColumn = $scope.setting.gridChild.grvAction.columns;

        if (permissions.type == "function" || permissions.type == "module") {
            var col = gridColumn.filter(x => x.id == "key" || x.id == "all" || x.colType == "function");
            $scope.grvAction.setColumns(col);
        }
        else if (permissions.type == "rootField" || permissions.type == "field") {
            var col = gridColumn.filter(x => x.id == "key" || x.id == "all" || x.colType == "field");
            $scope.grvAction.setColumns(col);
        }
        else if (permissions.type == "rootMethod" || permissions.type == "method") {
            var col = gridColumn.filter(x => x.id == "key" || x.id == "active");
            $scope.grvAction.setColumns(col);
        }
        else {
            var col = gridColumn.filter(x => x.id == "key" || x.id == "all" || x.colType == "function");
            $scope.grvAction.setColumns(col);
        }

        $scope.grvAction.setData(permissions.listPermission, 'key');
    };

    $scope.buildGridAction = function () {
        initSlickGrid($scope, 'grvAction');
        $scope.grvAction.editAction = function (grid, data) { };

        $scope.grvAction.onClick.subscribe(function (e, args) {
            if ($(e.target).is('.check-all, .check-read, .check-create, .check-update, .check-delete')) {
                $scope.curentChange();
                var item = args.grid.dataView.getItem(args.row);
                var classAction = $(e.target).attr('class').split(' ').pop();
                var doAction = null;
                switch (classAction) {
                    case "check-all":
                        item.all = !item.all;
                        item.read = item.create = item.update = item.delete = item.all;
                        doAction = 'all';
                        break;
                    case "check-read":
                        item.read = !item.read;
                        doAction = 'read';
                        break;
                    case "check-create":
                        item.create = !item.create;
                        doAction = 'create';
                        break;
                    case "check-update":
                        item.update = !item.update;
                        doAction = 'update';
                        break;
                    case "check-delete":
                        item.delete = !item.delete;
                        doAction = 'delete';
                        break;
                }
                $scope.grvAction.dataView.updateItem(item.key, item);
                $scope.changeAction(item, doAction);
            }
        });
    };

    $scope.changeAction = function (actionItem, doAction) {
        var permissions = $scope.grvPermissions.getCurrentData();
        $scope.changePermissions(permissions);
        if (permissions.hasChild) {
            if (permissions.type == 'module' || permissions.type == 'rootField' || permissions.type == 'rootMethod') {
                var listChild = $scope.grvPermissions.dataView.getItems().filter(x => x.parent == permissions.id);
                if (listChild.length > 0) {
                    $.each(listChild, function (index, item) {
                        $scope.curentChange(item);
                        var action = item.listPermission.find(x => x.key == actionItem.key);
                        if (doAction == 'all') {
                            action.read = action.create = action.update = action.delete = actionItem.all;
                        }
                        else {
                            action[doAction] = actionItem[doAction];
                        }
                        $scope.changePermissions(item);
                    });
                }
            }
        }
    };

    $scope.changePermissions = function (permissions) {
        var hasItemChange = $scope.listChange.find(x => x.id == permissions.id);
        permissions.dataChanged = !angular.equals(permissions.listPermission, hasItemChange.listPermission);
        $.each(permissions.listPermission, function (index, item) {
            permissions.hasPermission = item.read || item.create || item.update || item.delete;
            if (permissions.hasPermission) return false;
        });
        $scope.grvPermissions.dataView.updateItem(permissions.id, permissions);
    }

    $scope.curentChange = function (permissionsItem) {
        var permissions = permissionsItem ? angular.copy(permissionsItem) : angular.copy($scope.grvPermissions.getCurrentData());
        var hasItemChange = $scope.listChange.find(x => x.id == permissions.id);
        if (!hasItemChange) {
            $scope.listChange.push(permissions);
        }
    };

    $scope.savePermissions = function () {
        var role = $scope.grid.getCurrentData();
        var listData = $scope.grvPermissions.dataView.getItems().filter(x => x.dataChanged);
        if (listData.length > 0) {
            $scope.postData("api/sys/function/UpdateRolePermission", { roleId: role.id, lstUpdate: listData }, function (data) {
                if (!data) {
                    showWarning("Save Failed!");
                    return;
                };
                showSuccess($scope.translation.SAVE_PERMISSIONS_SUCCESS);
                $scope.listChange = [];
                $.each(listData, function (index, item) {
                    item.dataChanged = false;
                    $scope.grvPermissions.dataView.updateItem(item.id, item);
                });
            });
        }
    };

    //function
    $scope.add = function () {
        $scope.action = "add";
        $scope.data = {};

        var groupRole = $scope.setting.valuelist.roleGroup.filter(x => x.id == $scope.roleGroup);
        if (groupRole.length > 0) {
            $scope.data.objectId = groupRole[0].id;
            $scope.data.objectCode = groupRole[0].text;

            if ($scope.roleGroup != "SYSTEM" && $scope.roleGroup != "PM_Template") {
                $scope.data.code = groupRole[0].text + ".";
                $scope.data.name = groupRole[0].text + " - ";
            }
        }

        $("#imgAvatar").attr("src", "img/no_avatar.png");
        $scope.defaultData = $.extend(true, {}, $scope.data);
        $scope.loadRole($scope.data);
        callModal('modal-detail');
        $("#code").attr("disabled", false);
        $("#code").focus();
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(roleTranslation["ERR_UPDATE_NULL"]);
        else {
            if (data.code.endsWith('.PO') || data.code.endsWith('.PM') || data.code.endsWith('.SP')) {
                showWarning($scope.translation["WRN_ROLE_ALLOW"]);
                return;
            }

            $scope.action = "edit";
            $scope.data = $.extend(true, {}, data);

            $scope.defaultData = $.extend(true, {}, $scope.data);
            $scope.loadRole($scope.data);
            callModal('modal-detail');

            $scope.loadRole($scope.data);
            $("#code").attr("disabled", true);
            $("#name").focus();
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
            $scope.loadRole($scope.data);
            callModal('modal-detail');
            $("#code").focus();
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        var groupRole = $scope.setting.valuelist.roleGroup.filter(x => x.id == $scope.roleGroup);
        var code = groupRole[0].text;

        if ($scope.roleGroup != "SYSTEM" && $scope.roleGroup != "PM_Template") {
            if (!$scope.data.code.startsWith(code + ".") || $scope.data.code.length < (code + ".").length + 1) {
                showWarning($scope.translation.ERR_CODE_FORMAT);
                return;
            }

            if (!$scope.data.name.startsWith(code + " - ") || $scope.data.name.length < (code + " - ").length + 1) {
                showWarning($scope.translation.ERR_NAME_FORMAT);
                return;
            }
        }

        if ($scope.action == 'add') {
            $scope.post("api/sys/role/add", JSON.stringify($scope.data), function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');

                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });
        }
        else {
            $scope.post("api/sys/role/update", JSON.stringify($scope.data), function (data) {
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
            showError($scope.translation["ERR_DELETE_NULL"]);
        else {
            if (data.code.endsWith('.PO') || data.code.endsWith('.PM') || data.code.endsWith('.SP')) {
                showWarning($scope.translation["WRN_ROLE_ALLOW"]);
                return;
            }

            $scope.data = data;
            callModal('modal-confirm');
        }
    };

    $scope.deleteData = function () {
        $scope.post("api/sys/role/remove", JSON.stringify($scope.data), function () {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
        });
    };

    //more functions
    $scope.loadRole = function (data) {
        if (data.admin)
            $("#chkAdmin").removeClass().addClass("bowtie-icon bowtie-checkbox");
        else
            $("#chkAdmin").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");

        if (data.adminModule)
            $("#chkAdminModule").removeClass().addClass("bowtie-icon bowtie-checkbox");
        else
            $("#chkAdminModule").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
    };

    $scope.updateRole = function (elementId, field) {
        var element = $("#" + elementId);
        if (element.hasClass("bowtie-icon bowtie-checkbox-empty")) {
            element.removeClass().addClass("bowtie-icon bowtie-checkbox");
            $scope.data[field] = true;
            $("vll_module").select2().enable(false);
        }
        else {
            element.removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
            $scope.data[field] = false;
            $("#vll_module").css('readonly', 'readonly');
        }
    };

    $scope.checkValidate = function () {
        var data = $scope.data;
        var varName = data.name;
        if (!varName) {
            $("#txtName").attr("placeholder", roleTranslation.ERROR_NAME + roleTranslation.NAME);
            $("#txtName").focus();
            showError(roleTranslation.ERROR_NAME + roleTranslation.NAME);
            return true;
        }
        else {
            $(".inputName").removeAttr("placeholder");
            return false;
        }
    }

    $scope.editUserRole = function (user) {
        if (!user) user = $scope.grvUserRole.getCurrentData();
        $scope.childScope['userForm'].dataAction('edit', user, 'role');
    };

    $scope.addUserRole = function () {
        var role = $scope.grid.getCurrentData();
        $scope.childScope.userForm.dataAction('add', {}, 'role', role.id);
    };

    $scope.saveUser = function (action, data) {
        //var activeTabId = $('.tab-pane.active.show').attr('id');
        if ($scope.activeTabId == 'tabMembers') {
            if (action == 'add') {
                $scope.grvUserRole.dataView.insertItem(0, data);
                $scope.grvUserRole.invalidate();
            }
            else {
                $scope.grvUserRole.dataView.updateItem(data.id, data);
                $scope.grvUserRole.invalidate();
            }
        }
    };

    $scope.deleteUserRole = function (b) {
        if (!b) $scope.removeUserRow = $scope.grvUserRole.getCurrentData();
        if ($scope.removeUserRow) $('#modal-remove-user').modal('show');
    }

    $scope.removeUserRole = function () {
        var role = $scope.grid.getCurrentData();
        if (!role) role = $scope.grid.dataView.getItem(0);
        if (role && $scope.removeUserRow) {
            $scope.grvUserRole.dataView.deleteItem($scope.removeUserRow.id);
            //$scope.grvUserRole.invalidate();
            $scope.postData("api/sys/role/RemoveUserRole", { userId: $scope.removeUserRow.id, roleId: role.id }, function () {
                showSuccess($scope.translation.SUCCESS_REMOVED_USER_ROLE);
                $scope.removeUserRow = null;
            });
        }
    }

    $scope.updatePermission = function () {
        $scope.$applyAsync(function () {
            $scope.initPermission = true;
        });

        var data = $scope.grid.getCurrentData();
        if (data == null) {
            showError(roleTranslation["ERR_UPDATE_NULL"]);
            return;
        }

        var childScope = $scope.childScope['permission2'];
        if (childScope == null) return;

        $scope.data = data;
        childScope.init(data);
        callModal('modal-permission2');
        $(window).resize();
    };
}]);