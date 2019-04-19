'use strict';
app.register.controller('permission2Controller', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () { });

    $scope.onload = function () {
        SetPerfectScroll("divFunction");
        SetPerfectScroll("divPermission");
        init('permission2', $scope, true);
    };

    //function
    $scope.save = function () {
        var lstUpdate = {};

        var selectedtNode = $('#trvFunction').treeview('getSelected');
        if (selectedtNode.length > 0)
            $('#trvFunction').treeview('unselectNode', selectedtNode[0].nodeId);

        var nodes = $('#trvFunction').treeview('getUnselected');
        $.each(nodes, function (index, node) {
            if (node.hasChanged) {
                var rootSetting = lstUpdate[node.root];
                if (rootSetting == null) {
                    rootSetting = {};
                    rootSetting.module = node.root;
                    rootSetting.modulePermissions = [];
                    rootSetting.functionPermissions = [];
                    lstUpdate[node.root] = rootSetting;
                }

                if (node.option == "module")
                    rootSetting.modulePermissions = node.tag;
                else {
                    var permissionSetting = null;
                    var permissionSettings = rootSetting.functionPermissions.filter(x => x.function == node.parent);
                    if (permissionSettings.length > 0)
                        permissionSetting = permissionSettings[0];

                    if (permissionSetting == null) {
                        permissionSetting = {};
                        permissionSetting.function = node.parent;
                        permissionSetting.fieldSettings = [];
                        permissionSetting.functionSettings = [];
                        permissionSetting.methodSettings = [];
                        rootSetting.functionPermissions.push(permissionSetting);
                    }

                    if (node.option == "function")
                        permissionSetting.functionSettings = node.tag;
                    else if (node.option == "field" || node.option == "fields")
                        permissionSetting.fieldSettings.push({ fieldId: node.value, permissions: node.tag });
                    else if (node.option == "method" || node.option == "methods")
                        permissionSetting.methodSettings.push({ methodId: node.value, permissions: node.tag });
                }
            }
        });

        var url = 'api/sys/function/updateRolePermission2?roleId=' + $scope.roleId;
        $scope.post(url, JSON.stringify(lstUpdate), function (data) {
        });
    };

    $scope.init = function (data) {
        $scope.parentData = data;
        $scope.roleId = data.id;

        var typeURL = 'api/system/getBasicList?name=PermissionType&&language=' + $scope.currentLanguage;
        $scope.post(typeURL, null, function (data) {
            $scope.setting.valuelist.permissionType = data;
            $scope.initTreePermissionType();
        });

        var url = 'api/sys/function/loadRolePermission2?RoleId=' + $scope.roleId + '&language=' + $scope.currentLanguage;
        $scope.post(url, null, function (data) {
            $scope.data = data;
            $scope.initTreeFunction(data);
            $('#trvFunction').treeview('selectNode', 0);
        });
    };

    $scope.initTreePermissionType = function () {
        var data = [];
        $.each($scope.setting.valuelist.permissionType, function (index, item) {
            var node = {
                option: "action",
                id: item.id,
                text: item.text,
                value: item.id,
                icon: 'bowtie-icon bowtie-tag'
            };

            data.push(node);
        });

        $('#trvPermissionType').treeview({
            data: data,
            showBorder: false,
            selectedBackColor: '#e7e7e7',
            selectedColor: '#111',
            onhoverColor: '#F5F5F5',
            onNodeUnselected: function (e, node) {
                $scope.nodeUnselected(node);
            },
            onNodeSelected: function (e, node) {
                $scope.nodeSelected(node);
            },
        });
    };

    $scope.initTreeFunction = function (data) {
        $('#trvFunction').treeview({
            data: data,
            showBorder: false,
            selectedBackColor: '#e7e7e7',
            selectedColor: '#111',
            onhoverColor: '#F5F5F5',
            expandIcon: 'bowtie-icon bowtie-chevron-right',
            collapseIcon: 'bowtie-icon bowtie-chevron-down',
            onNodeUnselected: function (e, node) {
                $scope.nodeUnselected(node);
            },
            onNodeSelected: function (e, node) {
                $scope.$applyAsync(function () {
                    $scope.currentType2 = node.option;
                });

                $scope.currentType = node.option;
                $scope.updateEnabled(node);
                $scope.nodeSelected(node);
            },
        });
    };


    //more function
    $scope.nodeUnselected = function (node) {
        if (node.option == "action") {
            if ($scope.actionSetting != null) {
                var index = $scope.permissions.findIndex(item => item.key === node.value);
                if (index != -1)
                    $scope.permissions.splice(index, 1);

                var currNode = $('#trvPermissionType').treeview('getNode', node.nodeId);
                if ($scope.actionSetting.read || $scope.actionSetting.create || $scope.actionSetting.update || $scope.actionSetting.delete) {
                    $scope.permissions.push($scope.actionSetting);
                    currNode.icon = "bowtie-icon bowtie-tag-fill";
                }
                else {
                    currNode.icon = "bowtie-icon bowtie-tag";
                }
            }

            currNode.actionPermission = $scope.actionSetting;
            return;
        }

        if (node.option == "module" || node.option == "fields" || node.option == "methods") {
            var selectedNodes = $('#trvPermissionType').treeview('getSelected');
            $.each(selectedNodes, function (index, selectedNode) {
                $('#trvPermissionType').treeview('unselectNode', selectedNode.nodeId);
            });

            var currNode = $('#trvFunction').treeview('getNode', node.nodeId);
            currNode.tag = $scope.permissions;

            var sPermission = JSON.stringify(currNode.tag);
            var sDefaultPermission = JSON.stringify(currNode.tag2);

            var hasChanged = false;
            if (sPermission != sDefaultPermission) hasChanged = true;

            if (hasChanged) {
                var childNodes = currNode.nodes;
                $.each(currNode.tag, function (index, newPermission) {
                    var oldPermissions = currNode.tag2.filter(x => x.key == newPermission.key);
                    if (oldPermissions.length == 0 || oldPermissions[0] != newPermission) {
                        $.each(childNodes, function (index, childNode) {
                            var childPermission = childNode.tag.filter(x => x.key == newPermission.key);
                            if (childPermission.length == 0)
                                childNode.tag.push(newPermission);
                            else
                                childPermission[0] = newPermission;

                            childNode.icon = "bowtie-icon bowtie-tag-fill";
                            childNode.hasChanged = true;
                        });
                    }
                });

                if (currNode.tag2.length > currNode.tag.length) {
                    $.each(currNode.tag2, function (index, oldPermission) {
                        var newPermissions = currNode.tag.filter(x => x.key == oldPermission.key);
                        if (newPermissions.length == 0) {
                            $.each(childNodes, function (index, childNode) {
                                $.each(childNode.tag, function (index, childPermission) {
                                    if (childPermission.key == oldPermission.key) {
                                        childNode.tag.splice(index, 1);
                                        if (childNode.tag.length == 0)
                                            childNode.icon = "bowtie-icon bowtie-tag";
                                        return false;
                                    }
                                });
                            });
                        }
                    });
                }

                currNode.hasChanged = true;
                currNode.tag2 = $scope.permissions;
            }

            if (currNode.tag.length > 0)
                currNode.icon = "bowtie-icon bowtie-tag-fill";
            else {
                currNode.icon = "bowtie-icon bowtie-tag";

                if (currNode.option == "module" || currNode.option == "fields" || currNode.option == "methods") {
                    $.each(currNode.nodes, function (index, childNode) {
                        if (childNode.tag.length != 0) {
                            currNode.icon = "bowtie-icon bowtie-tag-fill";
                            return false;
                        }
                    });
                }
            }

            return;
        }

        //function or field or method
        var selectedNodes = $('#trvPermissionType').treeview('getSelected');
        $.each(selectedNodes, function (index, selectedNode) {
            $('#trvPermissionType').treeview('unselectNode', selectedNode.nodeId);
        });

        var currNode = $('#trvFunction').treeview('getNode', node.nodeId);
        currNode.tag = $scope.permissions;

        var sPermission = JSON.stringify(currNode.tag);
        var sDefaultPermission = JSON.stringify(currNode.tag2);

        if (sPermission == sDefaultPermission)
            currNode.hasChanged = false;
        else
            currNode.hasChanged = true;

        if (currNode.tag.length > 0)
            currNode.icon = "bowtie-icon bowtie-tag-fill";
        else
            currNode.icon = "bowtie-icon bowtie-tag";

        if (node.option == "function") {
            var parentNode = $('#trvFunction').treeview('getParent', currNode);
            if (currNode.icon == "bowtie-icon bowtie-tag-fill")
                parentNode.icon = "bowtie-icon bowtie-tag-fill";
            else {
                var siblingNodes = $('#trvFunction').treeview('getSiblings', currNode);
                if (siblingNodes.filter(x => x.icon == "bowtie-icon bowtie-tag-fill").length > 0)
                    parentNode.icon = "bowtie-icon bowtie-tag-fill";
                else
                    parentNode.icon = "bowtie-icon bowtie-tag";
            }
        }
    };

    $scope.nodeSelected = function (node) {
        var type = node.option;
        if (type == "action") {
            var currNode = $('#trvPermissionType').treeview('getNode', node.nodeId);
            var actionSetting = currNode.actionPermission;

            $scope.actionSetting = actionSetting;

            var sClass = actionSetting.read ? 'bowtie-icon bowtie-checkbox' : 'bowtie-icon bowtie-checkbox-empty';
            $("#chkView").removeClass().addClass(sClass);

            sClass = actionSetting.create ? 'bowtie-icon bowtie-checkbox' : 'bowtie-icon bowtie-checkbox-empty';
            $("#chkAdd").removeClass().addClass(sClass);

            sClass = actionSetting.update ? 'bowtie-icon bowtie-checkbox' : 'bowtie-icon bowtie-checkbox-empty';
            $("#chkEdit").removeClass().addClass(sClass);

            sClass = actionSetting.delete ? 'bowtie-icon bowtie-checkbox' : 'bowtie-icon bowtie-checkbox-empty';
            $("#chkDelete").removeClass().addClass(sClass);

            var funcNode = $('#trvFunction').treeview('getSelected')[0];
            if (funcNode.option == "module" || funcNode.option == "function") {
                if (actionSetting.read && actionSetting.create && actionSetting.update && actionSetting.delete)
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox');
                else
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox-empty');
            }
            else if (funcNode.option == "fields" || funcNode.option == "field") {
                if (actionSetting.read && actionSetting.update)
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox');
                else
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox-empty');
            }

            return;
        }

        //function or field
        var permissions = node.tag;

        var nodes = $('#trvPermissionType').treeview('getUnselected');
        $.each(nodes, function (index, node) {
            var nodePermission = null;
            if (permissions != null && permissions.length != 0) {
                var lstPermission = permissions.filter(x => x.key == node.value);
                if (lstPermission.length > 0)
                    nodePermission = lstPermission[0];
            }

            var icon = 'bowtie-icon bowtie-tag-fill';
            if (nodePermission == null) {
                nodePermission = {
                    key: node.value,
                    read: false,
                    create: false,
                    update: false,
                    remove: false,
                };
                icon = 'bowtie-icon bowtie-tag';
            }

            node.actionPermission = nodePermission;
            node.icon = icon;
        });

        $('#trvPermissionType').treeview('selectNode', 0);
    };

    $scope.permissionActionChange = function (id, field, group) {
        if ($scope.actionSetting == null) return;

        var element = $("#" + id);
        if (element.css('cursor') == 'not-allowed') return;

        if (field == 'all') {
            if (element.hasClass('bowtie-icon bowtie-checkbox-empty')) {
                element.removeClass().addClass("bowtie-icon bowtie-checkbox");

                if ($scope.currentType == "module" || $scope.currentType == "function") {
                    $("#chkView").removeClass().addClass("bowtie-icon bowtie-checkbox");
                    $("#chkAdd").removeClass().addClass("bowtie-icon bowtie-checkbox");
                    $("#chkEdit").removeClass().addClass("bowtie-icon bowtie-checkbox");
                    $("#chkDelete").removeClass().addClass("bowtie-icon bowtie-checkbox");

                    $scope.actionSetting.read = true;
                    $scope.actionSetting.create = true;
                    $scope.actionSetting.update = true;
                    $scope.actionSetting.delete = true;
                }
                else if ($scope.currentType == "fields" || $scope.currentType == "field") {
                    $("#chkView").removeClass().addClass("bowtie-icon bowtie-checkbox");
                    $("#chkEdit").removeClass().addClass("bowtie-icon bowtie-checkbox");

                    $scope.actionSetting.read = true;
                    $scope.actionSetting.update = true;
                }
            }
            else {
                element.removeClass().addClass("bowtie-icon bowtie-checkbox-empty");

                $("#chkView").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
                $("#chkAdd").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
                $("#chkEdit").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
                $("#chkDelete").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");

                $scope.actionSetting.read = false;
                $scope.actionSetting.create = false;
                $scope.actionSetting.update = false;
                $scope.actionSetting.delete = false;
            }
        }

        else {
            if (element.hasClass('bowtie-icon bowtie-checkbox-empty')) {
                element.removeClass().addClass("bowtie-icon bowtie-checkbox");
                $scope.actionSetting[field] = true;
            }
            else {
                element.removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
                $scope.actionSetting[field] = false;
            }

            if ($scope.currentType == "module" || $scope.currentType == "function") {
                if ($scope.actionSetting.read && $scope.actionSetting.create && $scope.actionSetting.update && $scope.actionSetting.delete)
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox');
                else
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox-empty');
            }
            else if ($scope.currentType == "fields" || $scope.currentType == "field") {
                if ($scope.actionSetting.read && $scope.actionSetting.update)
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox');
                else
                    $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox-empty');
            }
        };
    };

    $scope.resetPermission = function () {
        var elements = $("#divPermission .bowtie-icon .bowtie-checkbox");
        $.each(elements, function (index, element) {
            element.removeClass("bowtie-checkbox").addClass("bowtie-checkbox-empty");
        });

        $('#trvPermissionType').treeview('enableAll');
        $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'pointer');
        $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 1);
    };

    $scope.updateEnabled = function (node) {
        $scope.resetPermission();
        $scope.actionPermission = null;
        $scope.permissions = node.tag;

        if (node.option == "module") {
            $('#trvPermissionType').treeview('enableAll');
            $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'pointer');
            $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 1);
            return;
        }

        if (node.option == "fields" || node.option == "methods") {
            var parentNode = $('#trvFunction').treeview('getParent', node);
            if (parentNode != null && parentNode.icon == 'bowtie-icon bowtie-tag') {
                $('#trvPermissionType').treeview('disableAll');
                $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'not-allowed');
                $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 0.5);
            }
            else {
                $('#trvPermissionType').treeview('enableAll');
                $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'pointer');
                $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 1);
            }
        }

        if (node.option == 'field' || node.option == 'method') {
            var parentNode1 = $('#trvFunction').treeview('getParent', node);
            var parentNode = $('#trvFunction').treeview('getParent', parentNode1);

            if (parentNode != null && parentNode.icon == 'bowtie-icon bowtie-tag') {
                $('#trvPermissionType').treeview('disableAll');
                $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'not-allowed');
                $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 0.5);
            }
            else {
                $('#trvPermissionType').treeview('enableAll');
                $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'pointer');
                $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 1);
            }
        }
        else if (node.option == 'function') {
            $('#trvPermissionType').treeview('enableAll');
            $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'pointer');
            $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 1);
        }
    };
}]);