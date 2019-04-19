'use strict';
app.register.controller('areasController', ['$scope', 'authService', '$timeout', function ($scope, authService, $timeout) {
    $scope.$on('$routeChangeSuccess', function () {
        //init("areas", $scope);

        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        $scope.authService = authService;
        $scope.relateData = {};

        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $scope.setting.listFilter = {};
                $.each(data, function (key, item) {

                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
                areasSetting.valuelist = $scope.setting.valuelist;
                areasSetting.listFilter = $scope.setting.listFilter;

                areasSetting.valuelist.state.splice(4, 1);
            },
        });

        $scope.postNoAsync('api/sys/company/GetListForUser', null, function (data) {
            $scope.setting.valuelist.department = data;
        });

        $scope.postNoAsync('api/pm/Product/GetProductByUser', null, function (data) {
            $scope.setting.valuelist.productId = data;
        });

        $scope.postNoAsync('api/sys/User/GetList', null, function (data) {
            $scope.setting.valuelist.owner = data;
            $scope.setting.valuelist.sponser = data;
        });


        $scope.loadData = function () {
            var url = "api/pm/Areas/GetListAreas?pjid=" + $scope.params.pjid + "&area=" + $scope.params.area;
            $scope.setting.grid.url = url;
            $scope.post(url, null, function (data) {
                $scope.grid.setData(data);
            });
        }


        if ($scope.grid)
            $scope.loadData();

        $scope.refresh = function () {
            $scope.loadData();
        };


        //$(window).resize(function () {
        //    var height = $("#areas .white_box").height();
        //    var width = $("#areas .white_box").width();
        //    $("#areas #tab-content").height(height - 55);

        //    $scope.grid.resizeCanvas();
        //});
        //$(window).resize();

        setSelectedMenu("areas");
    });

    $scope.cmbUserId = {
        url: "api/pm/member/getListUserForProject",
        allowClear: true,
    };

    //function
    $scope.add = function () {
        var project = null;
        $scope.postData('api/pm/Project/GetById', { id: $scope.params.pjid }, function (data) {
            project = data;
        });

        $scope.action = "add";
        $scope.data = {};
        $scope.data.reason = "new";
        $scope.data.state = "new";
        $scope.data.priority = "3-Normal";

        $scope.data.projectType = project.projectType;
        $scope.data.description = "";
        $scope.data.productId = $scope.params.pid;
        $scope.data.owner = project.owner;
        $scope.data.sponser = project.sponser;
        $scope.data.department = project.department;
        $scope.data.client = project.client;
        $scope.data.type = "area";
        $scope.data.parentId = project.id;



        $scope.attachments = [];
        $scope.listFileRelated = [];
        $scope.listFileUpload = [];
        $scope.folders = [];
        $("#code").prop('disabled', false);

        $scope.defaultData = angular.copy($scope.data);

        $("#imgAvatarAreas").attr("src", "/img/no-product.jpg");
        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");

        $("#area_name").focus();


        callModal('modal-project', true, 'area_name');

        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};
    }


    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();

        $scope.attachments = [];
        $scope.listFileRelated = [];
        $scope.listFileUpload = [];
        $scope.folders = [];
        $scope.listFileRemove = [];

        $("#code").prop('disabled', true);

        if (!data) {
            showWarning(areasTranslation.ERROR_EDIT);
            return;
        }
        else {
            $scope.data = angular.copy(data);
        }

        $scope.action = "edit";
        $("#imgAvatarAreas").attr("src", "/api/system/viewfile?id=" + $scope.data.pictureThumb + "&def=/img/no-product.jpg");


        $scope.defaultData = angular.copy($scope.data);
        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
        callModal('modal-project', true, 'area_name');
        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};
        $scope.getAttachment($scope.data.id);
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (!data) {
            showError(projectsTranslation["EER_CHOOSE_DELETE"]);
        }
        else {
            $scope.dataDelete = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        if ($scope.dataDelete) {
            $scope.postData("api/pm/Areas/Delete", { data: $scope.dataDelete } , function (result) {
                if (result) {
                    $scope.grid.dataView.deleteItem($scope.dataDelete.id);
                    $scope.grid.invalidate();

                    showSuccess($scope.translation.SUCCESS_DELETE);
                } else {
                    showError($scope.translation.ERROR_DELETE);
                }

            });
        }
    };

    $scope.displayFunction = function () {
        if ($scope.params.area) {
            $scope.button.add = false;
            $scope.button.delete = false;
        }
        else {
            $scope.button.add = true;
            $scope.button.delete = true;
        }

        $scope.button.edit = true;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.displayTitle = function () {
        toogleProject(true);
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.fileAvatar && $scope.fileAvatar.file) {
            $scope.frmFile.append("file", $scope.fileAvatar.file);
        }

        $scope.buildAttachment();

        if ($scope.action == "add") {

            //$scope.frmFile.delete("data");
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.postFile("api/pm/Areas/Add", $scope.frmFile, function (data) {
                $('#modal-project').modal('hide');
                $scope.refreshFrm();

                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.sortData('code', true);

                showSuccess($scope.translation.SUCCESS_ADD);
            }, function (data) {
                $scope.refreshFrm(["data"]);
            });

        }
        else {
            if ($scope.childScope.attachment.listFileRemove !== undefined && $scope.childScope.attachment.listFileRemove.length > 0) {
                $.each($scope.childScope.attachment.listFileRemove, function (index, item) {
                    $scope.frmFile.append("removeFiles", item);
                });
            }

            //$scope.frmFile.delete("data");
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.postFile("api/pm/Areas/Update", $scope.frmFile, function (data) {
                $scope.defaultData = null;
                $('#modal-project').modal('hide');
                $scope.refreshFrm();

                $scope.grid.dataView.updateItem(data.projectOrArea.id, data.projectOrArea);
                $scope.grid.invalidate();

                showSuccess($scope.translation.SUCCESS_EDIT);


            }, function (data) {
                $scope.refreshFrm(["data"]);
            });
        }
    };


    //Lấy thông tin lịch sử
    $scope.getHistory = function () {
        $scope.post("api/pm/Project/gethistory?id=" + $scope.data.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].oldValue = JSON.parse(val.oldValue);
                data[index].newValue = JSON.parse(val.newValue);
                data[index].createdTime = moment(data[index].createdTime).fromNow();

                if (data[index].newValue != null) {
                    $.each(data[index].newValue, function (key, value) {
                        if (data[index].oldValue[key] == undefined)
                            data[index].oldValue[key] = '';
                        if (data[index].newValue[key] != undefined && data[index].newValue[key] == true) {
                            data[index].oldValue[key] = false;
                        }
                    });
                }
                if (val.oldValue != null) {
                    $.each(data[index].oldValue, function (key, value) {
                        if (data[index].newValue[key] == undefined)
                            data[index].newValue[key] = '';
                        if (data[index].oldValue[key] != undefined && data[index].oldValue[key] == true) {
                            data[index].newValue[key] = false;
                        }
                    });
                }
            });
            $scope.history = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };

    //Lấy comment theo id
    $scope.getComment = function () {
        $scope.post("api/pm/Project/getcomment?id=" + $scope.data.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.discussion = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };
    //Đăng comment theo id
    $scope.postComment = function (comment) {
        if ($scope.data.id) {
            if (comment && comment.content != "") {
                comment.PMId = $scope.data.id.toString();
                $scope.postNoAsync("api/pm/Project/postcomment", JSON.stringify(comment), function (data) {
                    comment.createdByRelated = $scope.authService.user;
                    comment.createdTime = moment(data.createdTime).fromNow();
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

    //config state
    $scope.configState = {

        templateResult: function (data) {
            return $('<span><i class="fa fa-circle status_' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        },
        templateSelection: function (data) {
            return $('<span><i class="fa fa-circle status_' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        }
    }
    //config reason
    $scope.configReason = {
        templateResult: function (data) {
            return $('<span><i class="fa fa-circle reason-' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        },
        templateSelection: function (data) {
            return $('<span><i class="fa fa-circle reason-' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        }
    }

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


    $scope.configPriority = {
        templateResult: function (data) {
            return data.id ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        },
        templateSelection: function (data) {
            return data.id ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        }
    };

}]);
