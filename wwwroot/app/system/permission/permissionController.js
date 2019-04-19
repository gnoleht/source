'use strict';
app.register.controller('permissionController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
    });

    $scope.onload = function () {
        SetPerfectScroll("divFunction");
        SetPerfectScroll("divPermission");

        init('permission', $scope, true);
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
                var permissionSetting = lstUpdate[node.function];

                if (permissionSetting == null) {
                    permissionSetting = {};
                    permissionSetting.function = node.function;
                    permissionSetting.fieldSettings = [];
                    permissionSetting.functionSettings = [];
                    lstUpdate[node.function] = permissionSetting;
                }

                if (node.type == "function")
                    permissionSetting.functionSettings = node.permission;
                else 
                    permissionSetting.fieldSettings.push({ fieldId: node.value, permissions: node.permission });
            }
        });

        var url = 'api/function/updateRolePermission?roleId=' + $scope.roleId;
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

        var url = 'api/function/loadRolePermission?RoleId=' + $scope.roleId + '&language=' + $scope.currentLanguage;
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
                type: "action",
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
                if (node.type == "root") return;
                $scope.nodeUnselected(node);
            },
            onNodeSelected: function (e, node) {
                $scope.updateEnabled(node);

                if (node.type != "root")
                    $scope.nodeSelected(node);
            },
        });
    };


    //more function
    $scope.nodeUnselected = function (node) {
        if (node.type == "action") {
            if ($scope.actionSetting != null) {
                var index = $scope.permissions.findIndex(item => item.key === node.value);
                if (index != -1)
                    $scope.permissions.splice(index, 1);

                var currNode = $('#trvPermissionType').treeview('getNode', node.nodeId);
                if ($scope.actionSetting.read || $scope.actionSetting.create || $scope.actionSetting.update || $scope.actionSetting.delete) {
                    $scope.permissions.push({ key: node.value, actionSetting: $scope.actionSetting });
                    currNode.icon = "bowtie-icon bowtie-tag-fill";
                }
                else {
                    currNode.icon = "bowtie-icon bowtie-tag";
                }
            }

            currNode.actionPermission.actionSetting = $scope.actionSetting;
            return;
        }

        //function or field
        var selectedNodes = $('#trvPermissionType').treeview('getSelected');
        $.each(selectedNodes, function (index, selectedNode) {
            $('#trvPermissionType').treeview('unselectNode', selectedNode.nodeId);
        });

        var currNode = $('#trvFunction').treeview('getNode', node.nodeId);
        currNode.permission = $scope.permissions;

        var sPermission = JSON.stringify(currNode.permission);
        var sDefaultPermission = JSON.stringify(currNode.defaultPermission);

        if (sPermission == sDefaultPermission)
            currNode.hasChanged = false;
        else
            currNode.hasChanged = true;

        if (currNode.permission.length > 0)
            currNode.icon = "bowtie-icon bowtie-tag-fill";
        else
            currNode.icon = "bowtie-icon bowtie-tag";

        if (node.type == "function") {
            var parentNode = $('#trvFunction').treeview('getParent', currNode);
            if (parentNode.type == "root") {
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
        }

    };

    $scope.nodeSelected = function (node) {
        var type = node.type;

        if (type == "action") {
            var currNode = $('#trvPermissionType').treeview('getNode', node.nodeId);
            //var actionSetting = currNode.actionPermission.actionSetting;
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

            if (actionSetting.read && actionSetting.create && actionSetting.update && actionSetting.delete)
                $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox');
            else
                $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox-empty');

            return;
        }

        //function or field
        var permissions = $scope.permissions;

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
                    key: node.value, actionSetting: {}
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
        if (element.parent().css('cursor') == 'not-allowed') return;

        if (field == 'all') {
            if (element.hasClass('bowtie-icon bowtie-checkbox-empty')) {
                element.removeClass().addClass("bowtie-icon bowtie-checkbox");

                $("#chkView").removeClass().addClass("bowtie-icon bowtie-checkbox");
                $("#chkAdd").removeClass().addClass("bowtie-icon bowtie-checkbox");
                $("#chkEdit").removeClass().addClass("bowtie-icon bowtie-checkbox");
                $("#chkDelete").removeClass().addClass("bowtie-icon bowtie-checkbox");

                $scope.actionSetting.read = true;
                $scope.actionSetting.create = true;
                $scope.actionSetting.update = true;
                $scope.actionSetting.delete = true;
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

            if ($scope.actionSetting.read && $scope.actionSetting.create && $scope.actionSetting.update && $scope.actionSetting.delete)
                $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox');
            else
                $("#chkAll").removeClass().addClass('bowtie-icon bowtie-checkbox-empty');
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
        //var currNode = $('#trvFunction').treeview('getNode', node.nodeId);

        $scope.resetPermission();
        $scope.actionPermission = null;
        $scope.permissions = node.permission;

        if (node.type == "root") {
            $('#trvPermissionType').treeview('disableAll');
            $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'not-allowed');
            $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 0.5);
            return;
        }

        if (node.type == 'field') {
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
        else if (node.type == 'function') {
            var parentNode = $('#trvFunction').treeview('getParent', node);
            if (parentNode.type == 'root') {
                $('#trvPermissionType').treeview('enableAll');
                $("#divActionPermission .divCheckbox-permission .bowtie-icon").css('cursor', 'pointer');
                $("#divActionPermission .divCheckbox-permission .action-text").css('opacity', 1);
            }
            else if (parentNode != null && parentNode.icon == 'bowtie-icon bowtie-tag') {
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
    };
}]);