'use strict';
app.register.controller('groupController', ['$scope', '$location', '$sce', 'authService', '$timeout', function ($scope, $location, $sce, authService, $timeout) {

    $scope.$on('$routeChangeSuccess', function () {
        //$scope.grid.loadData();
        initSlickGrid($scope, 'grvUser');

        initSlickGrid($scope, 'grvRole');

        $scope.post($scope.setting.gridChild.grvUser.url, null, function (data) {

            $scope.grvUser.setData(data, 'displayName');
            $scope.grvRole.setData(data, 'displayName');

            //$scope.grvUser.dataView.setItems(data, 'displayName');
            //$scope.grvUser.invalidate();

            //$scope.grvRole.dataView.setItems(data, 'displayName');
            //$scope.grvRole.invalidate();
        });


    });


    //function
    $scope.add = function () {
        var userGroup = $scope.getChildData('userGroup');

        $scope.action = 'add';
        $scope.data = {};
        $("#imgAvatar").attr("src", "/img/no_avatar.png");

        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $('#txtName').focus();
    }

    $scope.edit = function () {
        var data = $scope.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = jQuery.extend(true, {}, data);
            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.iconThumb + "&def=/img/no_avatar.png");

            $scope.defaultData = $.extend(true, {}, $scope.data);
            callModal('modal-detail');
            $('#txtName').focus();
        };
    };

    $scope.save = function () {
        if ($scope.action == 'edit') {
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            httpService.postFile("api/group/Update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });
        }
        else {
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            httpService.postFile("api/group/add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });
        }
    };

    $scope.delete = function () {
        var data = $scope.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_DELETE_NULL"]);
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };

    $scope.deleteData = function () {
        httpService.post("api/group/remove", JSON.stringify($scope.data), function () {
            $scope.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
            $scope.grid.render();
        });
    };

    //more functions


    $scope.addUserGroup = function () {
        var user = $("#vllUser").select2('data')[0];
        if (user == null || user.text == '') return;

        var userGroup = {};
        userGroup.groupId = $scope.data.id;
        userGroup.groupName = $scope.data.name;
        userGroup.groupAvatar = $scope.data.iconThumb;

        userGroup.userId = user.id;
        userGroup.userName = user.text;
        userGroup.userAvatar = user.element.dataset.avatar;

        userGroup.id = user.id + "_" + userGroup.groupId;
        userGroup.name = userGroup.groupName + "_" + userGroup.userName;

        var index = $scope.grvUserGroupDataView.getItems().length;
        $scope.grvUserGroupDataView.insertItem(index, userGroup);
        $scope.grvUserGroup.invalidate();

        $scope.valuelist.userList = $scope.valuelist.userList.filter(function (obj) {
            return obj.id !== userGroup.userId;
        });
    }

    $scope.saveUserGroup = function () {
        var userGroups = $scope.grvUserGroupDataView.getItems();
        httpService.post('api/group/updateUserGroup?groupId=' + $scope.data.id, JSON.stringify(userGroups), function (data) {
            $("#modal-userGroup").modal('hide');
        });
    };

    $scope.deleteUserGroup = function (rowId, id, text, avatar) {
        $scope.grvUserGroupDataView.deleteItem(rowId);
        $scope.grvUserGroup.invalidate();
        $scope.valuelist.userList.push({ id: id, text: text, avatar: avatar });
        $("#vllUser").trigger("change");
    };
}]);