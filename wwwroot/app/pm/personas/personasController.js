'use strict';
app.register.controller('personasController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.$on('$routeChangeSuccess', function () {
        personasSetting.grid.url = personasSetting.grid.url + "?pid=" + $scope.params.pid;
        if ($scope.params.pjid) personasSetting.grid.url += ("&pjid=" + $scope.params.pjid);
        $scope.refresh = function () {
            $scope.postData($scope.setting.grid.url, $scope.params, function (data) {
                $scope.grid.setData(data);
            });
        };

        if ($scope.grid) {
            $scope.grid.refreshData = function () { $scope.refresh() };
            $scope.refresh();
        }
    });

    $scope.displayTitle = function () {
        if ($scope.params.module == "pm") {
            toogleProduct(true);
            $scope.grid.defaultValues = { productId: $scope.params.pid };
        }
        else {
            $scope.toogleTitle.area = false;
            toogleProject(true);
            $scope.grid.defaultValues = { productId: $scope.params.pid, projectId: $scope.params.pjid, isDeploy: $scope.params.pjType == "2" };
        }
    };

    $scope.displayFunction = function () {
        if ($scope.params.module == "pj" && $scope.params.pjType != "2")
            $location.url('/pm/projects');
    };

    //function 
    $scope.add = function () {
        $scope.action = "add";
        $scope.data = {};

        $scope.data.productId = $scope.params.pid;
        $scope.data.projectId = $scope.params.pjid;
        $scope.data.isDeploy = $scope.params.pjType == "2";

        $scope.defaultData = $.extend(true, {}, $scope.data);

        $("#imgAvatarAdd").attr("src", "/img/no_avatar.png");
        callModal('modal-detail');
        $("#name").focus();
    };

    $scope.addData = function () {
        if ($scope.data.name == null) {
            showError($scope.translation.ERROR_NAME);
            return;
        }

        $scope.frmFile.delete("data");
        $scope.frmFile.append("data", JSON.stringify($scope.data));

        $scope.postFile("api/personas/add", $scope.frmFile, function (data) {
            $scope.defaultData = null;
            $scope.grid.dataView.insertItem(0, data);
            $scope.grid.invalidate();

            $('#modal-detail').modal('hide');
            $scope.refreshFrm();
        });
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) {
            showError($scope.translation.ERROR_TABLE);
            return;
        }
        else {

            $scope.action = "edit";
            $scope.data = $.extend(true, {}, data);
            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.pictureThumb + "&def=/img/no_avatar.png");
            $scope.defaultData = $.extend(true, {}, $scope.data);

            $scope.post("api/Personas/GetAttachments?pid=" + $scope.params.pid + "&id=" + $scope.data.id, null, function (data) {
                $scope.attachments = data;
            });

            callModal('modal-detail', false, 'txtName');
            $scope.getHistory();
            $scope.getComment();
        }
    };

    $scope.editData = function () {
        $scope.frmFile.delete("data");
        $scope.frmFile.append("data", JSON.stringify($scope.data));

        $scope.postFile("api/personas/update", $scope.frmFile, function (data) {
            $scope.defaultData = null;
            $scope.grid.dataView.updateItem(data.id, data);
            $scope.grid.invalidate();

            callModal('modal-detail', false, 'txtName');
            $scope.refreshFrm();
        });
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

            callModal('modal-detail', false, 'txtName');
            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.avatarThumb + "&def=/img/no_avatar.png");
            $("#id").attr('disabled', false);
            $("#id").focus();
        }
    };

    $scope.save = function () {
        if ($scope.action == "add")
            $scope.addData();
        else
            $scope.editData();
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if ($scope.data == undefined || $scope.data == null) {
            showError(personasTranslation["EER_CHOOSE_DELETE"]);
        }
        else {
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        if ($scope.data !== null) {
            $scope.post("api/Personas/Delete", JSON.stringify($scope.data),
                function (data) {
                    $scope.grid.dataView.deleteItem($scope.data.id);
                    $scope.grid.invalidate();

                }
            );
        }
    };

    //Lấy thông tin lịch sử
    $scope.getHistory = function () {
        $scope.post('api/personas/gethistory?id=' + $scope.data.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].oldValue = JSON.parse(val.oldValue);
                data[index].newValue = JSON.parse(val.newValue);
                data[index].createdTime = moment(data[index].createdTime).fromNow();
                if (data[index].newValue != null)
                    if (data[index].newValue.Personas != undefined) {
                        data[index].newValue.Personas = data[index].newValue.Personas.join(', ');
                    }
                if (val.oldValue != null) {
                    if (data[index].oldValue.Personas != undefined) {
                        data[index].oldValue.Personas = data[index].oldValue.Personas.join(', ');
                    }
                    $.each(data[index].oldValue, function (key, value) {
                        if (data[index].newValue[key] == undefined)
                            data[index].newValue[key] = '';
                    });
                }
            });
            $scope.history = data;
            $scope.$applyAsync();
        });
    };

    //Lấy comment theo id
    $scope.getComment = function () {
        $scope.post('api/personas/getcomment?id=' + $scope.data.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.discussion = data;
            $scope.$applyAsync();
        });
    };
    //Đăng comment theo id
    $scope.postComment = function (comment) {
        if ($scope.data.id) {
            if (comment) {
                comment.PMId = $scope.data.id.toString();
                $scope.postNoAsync('api/personas/postcomment', JSON.stringify(comment), function (data) {
                    comment.createdByRelated = authService.user;
                    comment.createdTime = moment(new Date()).fromNow();
                }, function () { comment = false; });
                return comment;
            }
            else {
                showError("Empty input comment content!");
            }
        }
        else {
            showError();
        }
        return false;
    };

    $scope.collapseButton = function () {
        if ($(".multi-collapse").hasClass('show')) {
            $(".multi-collapse").collapse('hide');
        }
        else {
            $(".multi-collapse").collapse('show');
        }

    };

}]);



