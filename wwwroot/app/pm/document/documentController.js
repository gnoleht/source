'use strict';
app.register.controller('documentController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.$on('$routeChangeSuccess', function () {
        var roleUrl = 'api/sys/role/getListByObjectId';
        var roleParam = {
            id: $scope.params.module == "pj" ? $scope.params.pjid : $scope.params.pid
        }
        $scope.postData(roleUrl, roleParam, function (data) {
            $scope.setting.valuelist.viewRole = data;
            $scope.setting.valuelist.editRole = data;
            $scope.setting.valuelist.deleteRole = data;
            $scope.setting.valuelist.approveRole = data;
        });

        var projectUrl = 'api/workItem/getListProject';
        var projectParam = {
            pid: $scope.params.pid,
        };

        $scope.postData(projectUrl, projectParam, function (data) {
            $scope.setting.valuelist.project = data;
        });

        var folderRoleUrl = 'api/pm/document/getFolderRole';
        var folderRoleParam = {
            id: $scope.params.module == "pj" ? $scope.params.pjid : $scope.params.pid
        }

        $scope.postData(folderRoleUrl, folderRoleParam, function (data) {
            $scope.baseAllowEdit = data[0];
            $scope.allowEdit = data[0];
            $scope.userRole = data[1];
            $scope.isAdmin = data[2];

            if ($scope.isAdmin) $scope.allowEdit = true;
        });

        $scope.parentFolderChange = function () {
            var value = $scope.folder.parent;
            if ($scope.pevertChange) {
                $scope.pevertChange = false;
                return;
            }

            if ($scope.folder) {
                var parentFolder = $scope.getItemFolder(value, $scope.listFolder);
                if (parentFolder && parentFolder.tag) {
                    var parent = parentFolder.tag;

                    $scope.folder.module = parent.module;
                    $scope.folder.productId = parent.productId;
                    $scope.folder.projectId = parent.projectId;

                    $scope.folder.viewRole = parent.viewRole ? parent.viewRole : [];
                    $scope.folder.editRole = parent.editRole ? parent.editRole : [];
                    $scope.folder.deleteRole = parent.deleteRole ? parent.deleteRole : [];
                    $scope.folder.approveRole = parent.approveRole ? parent.approveRole : [];
                }
            }
        };

        $scope.setting.options.userId = authService.user.id;

        if ($scope.grid != null) {
            $scope.grid.editAction = function () { $scope.editFolder(); };

            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                var folder = $scope.grid.getCurrentData();// $scope.grid.dataView.getItem(args.rows[0]);
                $scope.folderChanged($scope.folder, folder)
            });

            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("toggle")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        if (!item.isCollapsed) {
                            item.isCollapsed = true;
                        } else
                            item.isCollapsed = false;

                        $scope.grid.dataView.updateItem(item.id, item);
                    }
                }
            });

            $scope.grid.customFilter = function (data) {
                if (data.parent == null)
                    return true;

                var parent = $scope.grid.dataView.getItemById(data.parent);
                if (parent == null) return true;

                if (parent.isCollapsed)
                    data.isCollapsed = true;

                return !parent.isCollapsed;
            }

            $scope.loadFolder();
        }

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadData();
        }

        $scope.refresh = function () {
            $scope.loadFolder(true);
        };

        if ($scope.grid != null) {
            $scope.grid.onContextMenu.subscribe(function (e, args) {
                e.preventDefault();
                $("#contextMenu").hide();

                var cell = $scope.grid.getCellFromEvent(e);
                if (cell != null) {
                    $scope.grid.setSelectedRows([cell.row]);
                    var item = $scope.grid.dataView.getItemByIdx(cell.row);

                    $scope.$applyAsync(function () { $scope.data = item; });
                    var menuHeight = $("#contextMenu").innerHeight();
                    $("#contextMenu").css({ "top": (e.pageY - menuHeight - 10) + "px", "left": e.pageX + "px" }).show();
                }
            });
        }

        Split(['#panelTree', '#grvDocument'], {
            sizes: [30, 70],
            minSize: 200,
            onDragEnd: function () {
                if ($scope.grid)
                    $scope.grid.resizeCanvas();

                if ($scope.grvDocument)
                $scope.grvDocument.resizeCanvas();
            }
        });

        //context menu
        $(document).click(function () {
            $("#document #contextMenu").hide();
        });
    });

    $scope.showAddRelate = function (e) {
        $("#modal-detail .modal-content-plus,.modal-dialog,.modal-body-content").toggleClass("open");
        $('#modal-detail .content_link').toggleClass('show');
        $(e.target).toggleClass("selected");
    };

    $scope.configFolder = {
        templateResult: function (state, element) {
            if (!state.id) {
                return state.text;
            }
            if (state.text == '') {
                return null;
            }

            var option = JSON.parse(state.element.attributes.opt.value);
            if (option != null) {
                return $('<span style="padding-left:' + option.indent + 'px">' + state.text + '</span>');
            }
            else
                return state.text;
        },
    };

    $scope.getVersion = function (value) {
        return parseFloat(Math.round(value * 100) / 100).toFixed(2);
    };

    $scope.displayFunction = function () {
        $scope.button.copy = false;
    };

    $scope.displayTitle = function () {
        if ($scope.params.module == 'pm') {
            toogleProduct(true);
        }
        else if ($scope.params.module == 'pj') {
            toogleProject(true);
            toogleArea(false);
        }
    };

    $scope.initJS = function () {
        $("#document .advancedDropzone").on({
            'dragover dragenter': function (e) {
                e.preventDefault();
                e.stopPropagation();
            },
            'click': function (e) {
                var input = $(document.createElement('input'));
                input.attr("type", "file");
                input.trigger('click');
                input.on("change", function (e) {
                    var file = this.files[0];
                    $scope.frmFile.set("file", file);
                    var fileExtension = "." + file.name.split('.').pop().toLowerCase();

                    if ($scope.action == "add") {
                        $scope.$applyAsync(function () {
                            $scope.data.fileExtension = fileExtension;
                            $scope.data.name = file.name.replace($scope.data.fileExtension, "");
                            $scope.data.fileName = file.name;
                        });

                        var imageUrl = '/images/file.ico';
                        if (fileExtension == ".doc" || fileExtension == ".docx" || fileExtension == ".dotx")
                            imageUrl = '/images/ic_word.png';
                        else if (fileExtension == ".xls" || fileExtension == ".xlsx" || fileExtension == ".xltx" || fileExtension == ".csv")
                            imageUrl = '/images/ic_excel.png';
                        else if (fileExtension == ".ppt" || fileExtension == ".pptx")
                            imageUrl = '/images/ic_ppt.png';
                        else if (fileExtension == ".7z" || fileExtension == ".zip" || fileExtension == ".rar")
                            imageUrl = '/images/ic_rar.png';
                        else if (fileExtension == ".png" || fileExtension == ".jpg" || fileExtension == ".jpeg"
                            || fileExtension == ".gip" || fileExtension == ".bmp" || fileExtension == ".tif" || fileExtension == ".ico")
                            imageUrl = '/images/ic_img.png';
                        else if (fileExtension == ".txt" || fileExtension == ".json" || fileExtension == ".js"
                            || fileExtension == ".html" || fileExtension == ".cs" || fileExtension == ".css")
                            imageUrl = '/images/ic_txt.png';
                        else {
                            var fileImageName = fileExtension.replace('.', 'ic_');
                            imageUrl = '/images/' + fileImageName + ".png";
                        }

                        $("#imgAvatar").attr("src", imageUrl);
                    }
                });
            },
            'drop': function (e) {
                e.preventDefault();
                e.stopPropagation();

                var dataTransfer = e.originalEvent.dataTransfer;
                if (dataTransfer && dataTransfer.files.length) {
                    var file = dataTransfer.files[0];
                    $scope.frmFile.set("file", file);
                    var fileExtension = "." + file.name.split('.').pop().toLowerCase();

                    if ($scope.action == "add") {
                        $scope.$applyAsync(function () {
                            $scope.data.fileExtension = fileExtension;
                            $scope.data.name = file.name.replace($scope.data.fileExtension, "");
                            $scope.data.fileName = file.name;
                        });

                        var imageUrl = '/images/file.ico';
                        if (fileExtension == ".doc" || fileExtension == ".docx" || fileExtension == ".dotx")
                            imageUrl = '/images/ic_word.png';
                        else if (fileExtension == ".xls" || fileExtension == ".xlsx" || fileExtension == ".xltx" || fileExtension == ".csv")
                            imageUrl = '/images/ic_excel.png';
                        else if (fileExtension == ".ppt" || fileExtension == ".pptx")
                            imageUrl = '/images/ic_ppt.png';
                        else if (fileExtension == ".7z" || fileExtension == ".zip" || fileExtension == ".rar")
                            imageUrl = '/images/ic_rar.png';
                        else if (fileExtension == ".png" || fileExtension == ".jpg" || fileExtension == ".jpeg"
                            || fileExtension == ".gip" || fileExtension == ".bmp" || fileExtension == ".tif" || fileExtension == ".ico")
                            imageUrl = '/images/ic_img.png';
                        else if (fileExtension == ".txt" || fileExtension == ".json" || fileExtension == ".js"
                            || fileExtension == ".html" || fileExtension == ".cs" || fileExtension == ".css")
                            imageUrl = '/images/ic_txt.png';
                        else {
                            var fileImageName = fileExtension.replace('.', 'ic_');
                            imageUrl = '/images/' + fileImageName + ".png";
                        }

                        $("#imgAvatar").attr("src", imageUrl);
                    }
                }
            }
        });
    };

    $scope.folderChanged = function (oldFolder, newFolder) {
        if (newFolder == null || newFolder.parent == null)
            $scope.folderId = null;
        else
            $scope.folderId = newFolder.id;

        $scope.loadData();
        $scope.pevertChange = true;

        $scope.$applyAsync(function () {
            $scope.folder = newFolder;

            if ($scope.isAdmin) {
                $scope.button.add = true;
                $scope.button.edit = true;
                $scope.button.delete = true;
                $scope.folder.allowApprove = true;
            }
            else {
                $scope.button.add = false;
                $scope.button.edit = false;
                $scope.button.delete = false;
                $scope.folder.allowApprove = false;

                if ($scope.folder.editRole) {
                    $.each($scope.folder.editRole, function (index, role) {
                        if ($scope.userRole.indexOf(role) != -1) {
                            $scope.button.add = true;
                            $scope.button.edit = true;
                            return false;
                        }
                    });
                };

                if ($scope.folder.approveRole) {
                    $.each($scope.folder.approveRole, function (index, role) {
                        if ($scope.userRole.indexOf(role) != -1) {
                            $scope.folder.allowApprove = true;
                            return false;
                        }
                    });
                };

                if ($scope.folder.deleteRole) {
                    $.each($scope.folder.deleteRole, function (index, role) {
                        if ($scope.userRole.indexOf(role) != -1) {
                            $scope.button.delete = true;
                            return false;
                        }
                    });
                };
            }

            if ($scope.folder.rootFolder)
                $("#folderParent").prop("disabled", true);
            else
                $("#folderParent").prop("disabled", false);

            if ($scope.folder.module == 'pm_template') {
                if ($scope.isAdmin) $scope.allowEdit = true;

                $("#vllViewRole").prop("disabled", true);
                $("#vllEditRole").prop("disabled", true);
                $("#vllDeleteRole").prop("disabled", true);
                $("#vllApproveRole").prop("disabled", true);
            }
            else {
                $scope.allowEdit = $scope.baseAllowEdit;

                $("#vllViewRole").prop("disabled", false);
                $("#vllEditRole").prop("disabled", false);
                $("#vllDeleteRole").prop("disabled", false);
                $("#vllApproveRole").prop("disabled", false);
            }
        });
    }

    $scope.loadData = function () {
        if (!$scope.grvDocument) {
            initSlickGrid($scope, 'grvDocument');

            $scope.grvDocument.onContextMenu.subscribe(function (e, args) {
                e.preventDefault();
                $("#contextMenu").hide();

                var cell = $scope.grvDocument.getCellFromEvent(e);
                if (cell != null) {
                    $scope.grvDocument.setSelectedRows([cell.row]);
                    var item = $scope.grvDocument.dataView.getItemByIdx(cell.row);

                    $scope.$applyAsync(function () { $scope.data = item; });
                    var menuHeight = $("#contextMenu").innerHeight();
                    $("#contextMenu").css({ "top": (e.pageY - menuHeight - 10) + "px", "left": e.pageX + "px" }).show();
                }
            });

            $scope.grvDocument.editAction = function () { $scope.edit(); };
        }

        var url = $scope.setting.gridChild.grvDocument.url;
        url += "?folder=" + $scope.folderId;

        var searchValue = $("#inputSearch").val();
        if (searchValue) url += "&searchValue=" + searchValue;

        if ($scope.params.did)
            url += "&did=" + $scope.params.did;

        $scope.grvDocument.loadData(url);
    };

    //link
    $scope.addLink = function () {
        callModal('modal-add-link');

        $scope.findLink = {};
        $scope.findLink.project = $scope.params.pjid;

        if ($scope.gridWorkItemLink)
            $scope.gridWorkItemLink.setData([]);
    }

    $scope.getLink = function () {
        var url = 'api/pm/document/findDocumentLink?documentId=' + $scope.data.id;

        //if ($scope.params.pid)
        //    url += '&pid=' + $scope.params.pid;

        if ($scope.findLink.project) {
            url = url + '&pjid=' + $scope.findLink.project;
        }

        if ($scope.findLink.entityType) {
            url = url + '&entityType=' + $scope.findLink.entityType;

            if ($scope.findLink.entityType == 'PM_WorkItem' && $scope.findLink.workItemType) {
                url = url + '&workItemType=' + $scope.findLink.workItemType;
            }
        }

        if ($scope.findLink.titleContains) {
            url = url + '&titleContains=' + $scope.findLink.titleContains;
        }

        if ($scope.gridWorkItemLink == null) {
            initSlickGrid($scope, 'gridWorkItemLink');
            $scope.gridWorkItemLink.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("checkWI")) {
                    var item = $scope.gridWorkItemLink.dataView.getItem(args.row);
                    $scope.checkWorkItem(item);
                }
            });
        }

        $scope.gridWorkItemLink.loadData(url);
    };

    $scope.saveLink = function () {
        var data = $scope.data;
        if (!$scope.relatedList) $scope.relatedList = [];

        var lstSelected = $scope.gridWorkItemLink.dataView.getItems().filter(x => x.isCheck);
        $.each(lstSelected, function (index, item) {
            var newItem = { relatedId: item.id, relatedType: item.type, relatedEntity: $scope.findLink.entityType, objectInfo: item, isCheck: true };
            var parent = $scope.relatedList.filter(x => x.key == $scope.findLink.entityType);
            if (parent.length == 0) {
                $scope.relatedList.push({ key: $scope.findLink.entityType, listData: [newItem] });
            }
            else {
                var parentObj = parent[0];
                var oldItem = parentObj.listData.filter(x => x.relatedId == item.id);
                if (oldItem.length == 0) parentObj.listData.push(newItem);
            }
        });

        $('#modal-add-link').modal('hide');
    };

    $scope.checkWorkItem = function (data) {
        data.isCheck = !data.isCheck;
        $scope.gridWorkItemLink.dataView.updateItem(data.id, data);
        $scope.gridWorkItemLink.invalidate();
    };

    $scope.removeLink = function (key, index) {
        var group = $scope.relatedList.filter(x => x.key == key)[0];
        var relatedItem = group.listData[index];
        group.listData.splice(index, 1);

        if (!relatedItem.isCheck) {
            if (!$scope.deleledLink) $scope.deleledLink = [];
            $scope.deleledLink.push(relatedItem);
        };
    };

    //basic
    $scope.add = function () {
        $scope.action = 'add';

        $scope.data = {};
        $scope.deleledLink = [];
        $scope.relatedList = [];
        $scope.data.Status = "new";
        $scope.data.checkOutStatus = "0";
        $scope.data.folder = $scope.folderId;
        $scope.data.productId = $scope.params.pid;
        $scope.data.projectId = $scope.params.pjid;

        $("#imgAvatar").attr("src", '/img/no-product.jpg');

        $scope.defaultData = $.extend(true, {}, $scope.data);

        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");

        callModal('modal-detail');
        $("#name").focus();
    }

    $scope.edit = function () {
        var data = $scope.grvDocument.getCurrentData();
        if (data == null)
            showError(documentTranslation["ERR_UPDATE_NULL"]);
        else if (data.checkOutStatus != "1")
            showWarning(documentTranslation["WRN_EDIT_CHECKOUT"]);
        else if (data.checkOutBy != $scope.loginInfo.id)
            showWarning(documentTranslation["ERR_CHECKOUT_ISCHECKOUT"]);
        else {
            $scope.action = 'edit';
            $scope.deleledLink = [];

            var fileExtension = data.fileExtension;
            var imageUrl = '/images/file.ico';
            if (fileExtension == ".doc" || fileExtension == ".docx" || fileExtension == ".dotx")
                imageUrl = '/images/ic_word.png';
            else if (fileExtension == ".xls" || fileExtension == ".xlsx" || fileExtension == ".xltx" || fileExtension == ".csv")
                imageUrl = '/images/ic_excel.png';
            else if (fileExtension == ".ppt" || fileExtension == ".pptx")
                imageUrl = '/images/ic_ppt.png';
            else if (fileExtension == ".7z" || fileExtension == ".zip" || fileExtension == ".rar")
                imageUrl = '/images/ic_rar.png';
            else if (fileExtension == ".png" || fileExtension == ".jpg" || fileExtension == ".jpeg"
                || fileExtension == ".gip" || fileExtension == ".bmp" || fileExtension == ".tif")
                imageUrl = '/images/ic_img.png';
            else if (fileExtension == ".txt" || fileExtension == ".json" || fileExtension == ".js"
                || fileExtension == ".html" || fileExtension == ".cs" || fileExtension == ".css")
                imageUrl = '/images/ic_txt.png';
            else {
                fileExtension = fileExtension.replace('.', 'ic_');
                imageUrl = '/images/' + fileExtension + ".png";
            }

            $("#imgAvatar").attr("src", imageUrl);

            $scope.data = $.extend(true, {}, data);
            $scope.data.comment = '';

            var creDate = new Date(data.createdTime);
            $scope.data.createdTimeString = creDate.getUTCDate() + "/" + (creDate.getUTCMonth() + 1) + "/" + creDate.getUTCFullYear() + " " + creDate.getHours() + ":" + creDate.getMinutes();

            var modDate = new Date(data.modifiedTime);
            $scope.data.modifiedTimeString = modDate.getUTCDate() + "/" + (modDate.getUTCMonth() + 1) + "/" + modDate.getUTCFullYear() + " " + modDate.getHours() + ":" + modDate.getMinutes();

            $scope.defaultData = $.extend(true, {}, $scope.data);

            $scope.post('api/pm/document/getDocumentLink?documentId=' + $scope.data.id, null, function (data) {
                $scope.$applyAsync(function () {
                    $scope.relatedList = data;
                });
            });

            $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
            $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");

            callModal('modal-detail');
            $("#comment").focus();
        }
    };

    $scope.save = function () {
        $scope.frmFile.append("data", JSON.stringify($scope.data));
        $scope.frmFile.append("delLink", JSON.stringify($scope.deleledLink));

        var addlink = [];
        $.each($scope.relatedList, function (index, parentItem) {
            var addItem = parentItem.listData.filter(x => x.isCheck);
            $.each(addItem, function (index, item) {
                item.objectInfo = null;
                addlink.push(item);
            });
        });

        $scope.frmFile.append("addLink", JSON.stringify(addlink));

        if ($scope.action == 'add') {
            $scope.postFile("api/pm/document/add", $scope.frmFile,
                function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail').modal('hide');

                    if (data.folder == $scope.folderId) {
                        var oldData = $scope.grvDocument.dataView.getItemById(data.id);

                        if (oldData)
                            $scope.grvDocument.dataView.updateItem(data.id, data);
                        else
                            $scope.grvDocument.dataView.insertItem(0, data);
                    }
                },
                function () {
                    $scope.refreshFrm(["data", "addLink", "deletedLink"]);
                });
        }
        else if ($scope.action == 'edit') {
            $scope.postFile("api/pm/document/update", $scope.frmFile,
                function (data) {
                    $scope.defaultData = null;
                    $scope.refreshFrm();
                    $('#modal-detail').modal('hide');

                    if (data.folder != $scope.folderId) {
                        $scope.grvDocument.dataView.deleteItem(data.id);
                    }
                    else {
                        $scope.grvDocument.dataView.updateItem(data.id, data);
                    }
                },
                function () {
                    $scope.refreshFrm(["data", "addLink", "deletedLink"]);
                });
        }
    };

    $scope.delete = function () {
        var data = $scope.grvDocument.getCurrentData();

        if (data == null) {
            showError(documentTranslation["ERR_DELETE_NULL"]);
        }
        else if (data.checkOutStatus == "1") {
            if (data.checkOutBy != documentSetting.options.userId)
                showError(documentTranslation["ERR_CHECKOUT_ISCHECKOUT"]);
            else
                showError(documentTranslation["ERR_DELETE_CHECKOUT"]);
        }
        else {
            $scope.action = "delete";
            $scope.data = data;
            callModal('modal-confirm');
        }
    };

    $scope.deleteData = function () {
        if ($scope.action == "delete") {
            var data = $scope.data;

            if (data != null) {
                $scope.post("api/pm/document/remove", JSON.stringify(data), function () {
                    $scope.grvDocument.dataView.deleteItem(data.id);
                });
            }
        }
        else if ($scope.action == "deleteFolder") {
            $scope.postNoAsync("api/pm/document/removeFolder", JSON.stringify($scope.folder), function (data) {
                $scope.grid.dataView.deleteItem($scope.folder.id);

                var delIndex = -1;
                $.each($scope.setting.valuelist.folder, function (index, item) {
                    if (item.id == data.id) {
                        delIndex = index;
                        return false;
                    }
                })

                if (delIndex != -1) $scope.setting.valuelist.folder.splice(index, 1);
            });
        }
    };

    //check file
    $scope.checkOut = function () {
        var data = $scope.grvDocument.getCurrentData();
        if (data != null) {
            $scope.post("api/pm/document/checkOut", JSON.stringify(data), function (data) {
                $scope.grvDocument.dataView.updateItem(data.id, data);
            });
        }
    };

    $scope.checkIn = function () {
        $scope.edit();
    };

    //history
    $scope.viewHistory = function () {
        var data = $scope.data;

        if (data != null) {
            $scope.data = data;

            //$('#modal-history').modal({ backdrop: false, keyboard: true });
            callModal('modal-history');

            if ($scope.grvHistory == null) {
                initSlickGrid($scope, 'grvHistory');
                $scope.grvHistory.editAction = function () { };
            }

            var param = 'fileName=' + data.name + data.fileExtension + "&documentId=" + data.id + "&folderId=" + data.folder;
            var url = $scope.setting.gridChild['grvHistory'].url + "?" + param;
            $scope.grvHistory.loadData(url);
            $scope.grvHistory.resizeCanvas();
        }
    };

    $scope.rollback = function () {
        var documentHistory = $scope.grvHistory.getCurrentData();
        if (documentHistory == null) return;

        var document = $scope.data;
        if (document.checkOutStatus == "1") {
            if (document.checkOutBy != documentSetting.options.userId)
                showError(documentTranslation["ERR_CHECKOUT_ISCHECKOUT"]);
            else
                showError(documentTranslation["ERR_ROLLBACK_CHECKOUT"]);
        }
        else {
            if (document.fileId == documentHistory.fileId) {
                var mes = documentTranslation["ERR_ROLLBACK_DUPLICATE"];
                showWarning(mes);
            }
            else {
                callModal('modal-rollback');
            }
        }
    };

    $scope.rollbackData = function () {
        var document = $scope.data;
        var documentHistory = $scope.grvHistory.getCurrentData();

        $scope.post("api/pm/document/rollback", JSON.stringify(documentHistory), function (data) {
            if (data) {
                $scope.grvDocument.dataView.updateItem(data.id, data);
                $scope.grvHistory.refreshData();
            }
        });
    };

    $scope.deleteHistory = function () {
        var documentHistory = $scope.grvHistory.getCurrentData();
        if (documentHistory == null) return;

        var document = $scope.data;
        if (document.checkOutStatus == "1") {
            if (document.checkOutBy != documentSetting.options.userId)
                showError(documentTranslation["ERR_CHECKOUT_ISCHECKOUT"]);
            else
                showError(documentTranslation["ERR_ROLLBACK_CHECKOUT"]);
        }
        else {
            if (document.fileId == documentHistory.fileId) {
                var mes = documentTranslation["ERR_ROLLBACK_DUPLICATE"];
                showWarning(mes);
            }
            else {
                callModal('modal-deleteHistory');
            }
        }
    };

    $scope.deleteHistoryData = function () {
        var documentHistory = $scope.grvHistory.getCurrentData();
        if (documentHistory != null) {
            $scope.post("api/pm/document/deleteHistory", JSON.stringify(documentHistory), function (data) {
                if (data) {
                    $scope.grvHistory.dataView.deleteItem(documentHistory.id);
                }
            });
        }
    };

    //arpove
    $scope.approveStatus = function () {
        var data = $scope.grvDocument.getCurrentData();
        if (data == null) {
            showWarning(documentTranslation["ERR_APPROVE_NULL"]);
            return;
        }
        else if (data.checkOutStatus == "1") {
            if (data.checkOutBy != documentSetting.options.userId)
                showWarning(documentTranslation["ERR_CHECKOUT_ISCHECKOUT"]);
            else
                showWarning(documentTranslation["ERR_APPROVE_CHECKOUT"]);

            return;
        }

        if (data.status != null || data.status != '0')
            $("#rdb" + data.status).prop("checked", true);

        $scope.data = $.extend(true, {}, data);
        $scope.data.comment = null;
        $scope.data.oldStatus = $scope.data.status;

        $scope.action = 'approve';
        if ($scope.data.status == 'new') {
            $scope.data.status = "pending";
            $scope.action = 'pending';
        }
        else if ($scope.data.status == 'approved')
            $scope.data.status = "rejected";
        else
            $scope.data.status = "approved";

        $scope.defaultData = $.extend(true, {}, $scope.data);
        var result = true;

        if ($scope.action == 'pending') {
            var url = 'api/pm/document/checkFolderApproveRole?folderId=' + data.folder;
            $scope.postNoAsync(url, null, function (data) { result = data; });
        }

        if (result)
            callModal("modal-status");
        else {
            showWarning(documentTranslation["WRN_APPROVE_NOROLE"]);
        }
    };

    $scope.approveStatusData = function () {
        $scope.data.comment = $("#txtApproveComment").val();

        $scope.frmFile.append("data", JSON.stringify($scope.data));
        $scope.postFile("api/pm/document/approve", $scope.frmFile, function (data) {
            $scope.refreshFrm();
            $scope.defaultData = null;
            $("#modal-status").modal('hide');
            $scope.grvDocument.dataView.updateItem(data.id, data);
        });
    };

    //tree folder
    $scope.loadFolder = function (isReload) {
        var url = 'api/pm/document/getFolder?&isAdmin=' + $scope.isAdmin;
        if ($scope.params.pid)
            url += "&pid=" + $scope.params.pid;
        if ($scope.params.pjid)
            url += '&pjid=' + $scope.params.pjid;

        $scope.post(url, null, function (data) {
            if (data != null) {
                $scope.grid.setData(data.nodes);
                $scope.setting.valuelist.folder = data.folder;
                $scope.grid.selectedRow();
            }
        });
    };

    $scope.addFolder = function () {
        var parent = $scope.folder;
        if (!parent) return;

        $scope.pevertChange = true;
        $scope.folder = {};
        $scope.action = 'addFolder';
        $scope.folder.groupName = "document";
        $scope.folder.indent = parent.indent + 1;
        $scope.folder.index = parent.index + 1;
        $scope.folder.parent = parent.id;
        $scope.folder.module = parent.module;
        $scope.folder.productId = parent.productId;
        $scope.folder.projectId = parent.projectId;

        $scope.folder.viewRole = parent.viewRole;
        $scope.folder.editRole = parent.editRole;
        $scope.folder.deleteRole = parent.deleteRole;
        $scope.folder.approveRole = parent.approveRole;

        $scope.defaultFolder = $.extend(true, {}, $scope.folder);
        callModal('modal-folder');
    };

    $scope.editFolder = function () {
        var folder = $scope.grid.getCurrentData();
        if (!$scope.allowEdit || folder == null) return;

        $scope.folder = folder;
        $scope.action = 'editFolder';
        $scope.defaultFolder = $.extend(true, {}, $scope.folder);

        callModal('modal-folder');
    };

    $scope.saveFolder = function () {
        if ($scope.folder.text == null || $scope.folder.text == '') {
            showWarning($scope.translation.ERR_NAME_NULL);
            return;
        }

        if ($scope.action == 'addFolder') {
            if ($scope.folder.parent == null && $scope.listFolder.length != 0) {
                var rootFolder = $scope.listFolder[0];
                $scope.folder.parent = rootFolder.parent;
            }

            $scope.postNoAsync("api/pm/document/addFolder?module=" + $scope.params.module, JSON.stringify($scope.folder), function (data) {
                $scope.defaultFolder = null;
                $('#modal-folder').modal('hide');
                data.indent = $scope.folder.indent;
                if (data.parent) {
                    var index = $scope.grid.dataView.getIdxById(data.parent);
                    $scope.grid.dataView.insertItem(index + 1, data);
                    $scope.setting.valuelist.folder.push({ id: data.id, text: data.text });

                    var dataParent = $scope.grid.dataView.getItemById(data.parent);
                    if (dataParent) {
                        dataParent.hasChild = true;
                        $scope.grid.dataView.updateItem(dataParent.id, dataParent);
                    }
                }
                else {
                    $scope.grid.dataView.insert(0, data);
                    $scope.setting.valuelist.folder.unshift({ id: data.id, text: data.text });
                }
            });
        }
        else if ($scope.action == 'editFolder') {
            $scope.post("api/pm/document/updateFolder?module=" + $scope.params.module, JSON.stringify($scope.folder), function (data) {
                $scope.defaultData = null;
                $('#modal-folder').modal('hide');
                if (data.isChangeParent) {
                    $scope.grid.deleteItem(data.id);
                    var index = $scope.grid.dataView.getIdxById(data.parent);
                    $scope.grid.dataView.insertItem(index + 1, data);
                }
                else {
                    $scope.grid.dataView.updateItem(data.id, data);

                }

                $scope.folder = data;

                if ($scope.folder.edit == null || $scope.folder.edit.indexOf($scope.setting.options.userId) == -1) {
                    $scope.folder.allowEdit = false;
                    $scope.button.add = false;
                    $scope.button.edit = false;
                    $scope.button.delete = false;
                }
                else {
                    $scope.folder.allowEdit = true;
                    $scope.button.add = true;
                    $scope.button.edit = true;
                    $scope.button.delete = true;
                }

                if ($scope.folder.approve == null || $scope.folder.approve.indexOf($scope.setting.options.userId) == -1)
                    $scope.folder.allowApprove = false;
                else
                    $scope.folder.allowApprove = true;
            });
        }
    };

    $scope.deleteFolder = function () {
        var folder = $scope.grid.getCurrentData();
        if (folder != null) {

            if ($scope.folder.rootFolder) {
                showWarning($scope.translation.WRN_DELETE_FOLDER);
                return;
            }

            if ($scope.grvDocument.dataView.getItems().length != 0) {
                showError($scope.translation.ERR_DELETE_FOLDER);
                return;
            }

            $scope.action = "deleteFolder";
            $scope.folder = folder;

            callModal('modal-confirm');
        }
    };
}]);


