'use strict';
app.register.controller('functionController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.keyLang = keyLang;
        $scope.collapseType = 1;

        var url = "api/sys/function/getModule";
        $scope.post(url, null, function (data) {
            $scope.setting.valuelist.controller = data;
        });

        if ($scope.grid != null) {
            $scope.grid.customFilter = function (data) {
                if (data.parent == null)
                    return true;

                var parent = $scope.grid.dataView.getItemById(data.parent);
                if (parent == null) {
                    data.isCollapsed = true;
                    return false;
                }

                if (parent.isCollapsed)
                    data.isCollapsed = true;

                return !parent.isCollapsed;
            }

            $scope.post($scope.setting.grid.url, null, function (data) {
                $.each(data, function (index, item) { item.isCollapsed = item.hasChild });
                $scope.grid.setData(data);
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
                else if ($(e.target).hasClass("addChild")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        item.index = args.row;
                        $scope.add(item);
                    }
                }
            });

            $scope.grid.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command == 'collapseAll') {
                    if (!args.grid.isShowAll) {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list-tree";
                        args.grid.updateColumnHeader(args.column.id);
                    }

                    $scope.collapseAll(args.grid);

                };
            });
        };


        //$(window).resize(function () {
        //    var height = $("#function .white_box").height();
        //    var width = $("#function .white_box").width();
            
        //    $("#tab-content").width(width - 20);
        //    $("#tab-content").height(height - 55);
        //});
        //$(window).resize();
    });

    $scope.configModule = {
        templateResult: function (state, element) {
            if (!state.id) {
                return state.text;
            }
            if (state.text == '') {
                return null;
            }

            var nodeOpt = JSON.parse(state.element.attributes.opt.value);
            if (nodeOpt != null) {
                return $('<span style="padding-left:' + nodeOpt.indent + 'px">' + state.text + '</span>');
            }
            else
                return state.text;
        },
    };

    //function
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.url = "";
        $scope.data.name = { vn: '', en: '' };
        $scope.data.description = { vn: '', en: '' };
        $scope.data.style = { titleColor: '#FFF', descColor: '#FFF', icon: null, iconThumb: null };

        if (item) {
            $scope.action = 'addChild';
            var childNum = $scope.grid.dataView.getItems().filter(function (x) { return x.parent == item.id }).length;
            $scope.data.module = item.module;
            $scope.data.ordering = childNum + 1;
            $scope.data.parent = item.id;
            $scope.data.index = item.index + childNum + 1;
            $scope.data.indent = item.indent + 1;
            $scope.$apply();
        }
        else {
            var array = $scope.grid.dataView.getItems().filter(function (x) { return x.parent == null });
            var order = Math.max.apply(Math, array.map(function (x) { return x.ordering; }))
            $scope.data.ordering = order + 1;
        }

        $("#imgAvatar").attr("src", 'img/file_select.png');
        $scope.defaultData = $.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $('#txtName').focus();
    }

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.data = jQuery.extend(true, {}, data);
            $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.style.iconThumb + "&def=/img/file_select.png");
            $scope.defaultData = $.extend(true, {}, $scope.data);

            callModal('modal-detail');
            $('#txtName').focus();
        };
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

            callModal('modal-detail');
            $("#imgAvatar").attr("src", 'img/file_select.png');
            $('#txtName').focus();
        }
    };

    $scope.save = function () {
        if ($scope.action == 'edit') {
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.postFile("api/sys/function/update", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });
        }
        else if ($scope.action == 'add') {
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.postFile("api/sys/function/add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });
        }
        else if ($scope.action == 'addChild') {
            $scope.post('api/sys/function/createChild', JSON.stringify($scope.data), function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                var parentId = data.parent;
                var parentIndex = $scope.grid.dataView.getIdxById(parentId);
                $scope.grid.dataView.insertItem(parentIndex + 1, data);
                $scope.grid.invalidate();
            });
        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError(groupTranslation["ERR_DELETE_NULL"]);
        else {
            $scope.data = data;
            callModal('modal-confirm');
        }
    };

    $scope.deleteData = function () {
        $scope.post("api/sys/function/remove", JSON.stringify($scope.data), function (lstDelete) {
            $.each(lstDelete, function (index, id) { $scope.grid.dataView.deleteItem(id); });
            $scope.grid.invalidate();
        });
    };

    //more function
    $scope.configColor = {
        templateResult: function (item) {
            if (item.id == null) return item.id;
            return $('<div style="height:22px;line-height:20px;width:80%;margin-left:10%;background-color:' + item.id + ';text-align:center">' + item.id + '</div>');
        },
        templateSelection: function (item) {
            if (item.id == null) return item.id;
            return $('<div style="height:22px;line-height:20px;width:80%;margin-left:10%;background-color:' + item.id + ';text-align:center">' + item.id + '</div>');
        },
    }

    $scope.collapseAll = function (grid) {
        if (!grid.isShowAll) {
            var array = grid.dataView.getItems().filter(function (x) { return (x.indent == 0 || x.indent == 1) && x.isCollapsed });
            grid.dataView.beginUpdate();
            $.each(array, function (index, item) {
                item.isCollapsed = false;
                grid.dataView.updateItem(item.id, item);
            });

            grid.dataView.endUpdate();
            grid.invalidate();
            grid.isShowAll = true;
        }
        else {
            var array = grid.dataView.getItems().filter(function (x) { return x.indent == 0 && x.isCollapsed != true });
            grid.dataView.beginUpdate();
            $.each(array, function (index, item) {
                item.isCollapsed = true;
                grid.dataView.updateItem(item.id, item);
            });

            grid.dataView.endUpdate();
            grid.invalidate();
            grid.isShowAll = false;
        }
    };

    $scope.reorderBegin = function (args) {
        var data = args.data;
        var nextData = args.nextData;
        var beforeData = args.beforeData;

        if (data.parent == nextData.parent) return true;

        if ((data.parent == null && nextData.parent != null) || (data.parent != null && nextData.parent == null))
            return false;

        var parent = $scope.grid.dataView.getItemById(data.parent);
        var nextParent = $scope.grid.dataView.getItemById(nextData.parent);

        if (parent.indent != nextParent.indent) {
            if (beforeData != null && beforeData.parent != null) {
                var beforeParent = $scope.grid.dataView.getItemById(beforeData.parent);

                if (beforeParent.indent == parent.indent)
                    return true;
                else
                    return false;
            }

            return false;
        }

        return true;
    };

    $scope.reorderComplete = function (args) {
        var data = args.data;
        var nextData = args.nextData;
        var direction = args.direction;

        var url = "api/sys/function/reorder?id=" + data.id + "&nextId=" + nextData.id + "&direction=" + direction;
        $scope.post(url, null, function (data) { });
    };
}]);