'use strict';
app.register.controller('criteriaCategoryController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    // displayFunction
    $scope.displayFunction = function () {
        $scope.button.search = false;
        $('#btnSetting').hide();
    };

    $scope.$on('$routeChangeSuccess', function () {
        // value list
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                });
            }
        });

        if ($scope.grid) {
            $scope.grid.customFilter = function (data) {
                if (data.parent === null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent === undefined || parent === null) return true;
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.onClick.subscribe(function (e, args) {
                $scope.collapseChild(e, args);

                if ($(e.target).hasClass("addChild")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    $scope.data = {
                        parent: item.id
                    };

                    callModal('modal_detail');
                    // change parent
                    $scope.changeParent();
                }
            });

            $scope.grid.isShowAll = true;
            $scope.grid.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command === 'collapseAll') {
                    if (!args.grid.isShowAll) {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list-tree";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    $scope.collapseAll(args.grid);
                }
            });

            // load data
            $scope.loadData();
        }

        // refresh
        $scope.refresh = function () {
            // load data
            $scope.loadData();
        };

        $(window).resize(function (e) {
            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });

    // load data
    $scope.loadData = function () {
        var searchValue = $('#inputSearch').val();
        if (!searchValue)
            searchValue = null;
        var params = {
            searchValue: searchValue
        };
        $scope.postData('api/pt/criteriaCategory/Get', params, function (data) {
            if (data) {
                $scope.grid.setData(data);
                $scope.grid.invalidate();

                $scope.setting.valuelist.parent = data.filter(x => x.indent !== 3).map(function (item) {
                    return { id: item.id, text: item.name, indent: item.indent };
                });
            }
        });
    };

    // configParent
    $scope.configParent = {
        templateResult: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.indent === 0)
                    color = '#f98f05';
                else if (nodeOpt.indent === 1)
                    color = '#fcd036';
                else if (nodeOpt.indent === 2)
                    color = '#00b19d';
                else if (nodeOpt.indent === 3)
                    color = '#0e62c7';
                return $('<span style="margin-left: ' + nodeOpt.indent * 10 + 'px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        },
        templateSelection: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.indent === 0)
                    color = '#f98f05';
                else if (nodeOpt.indent === 1)
                    color = '#fcd036';
                else if (nodeOpt.indent === 2)
                    color = '#00b19d';
                else if (nodeOpt.indent === 3)
                    color = '#0e62c7';
                return $('<span style="margin-left: 10px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        }
    };

    // collapse all
    $scope.collapseAll = function (grid) {
        var array = grid.dataView.getItems().filter(function (x) { return x.hasChild === true; });
        grid.dataView.beginUpdate();
        $.each(array, function (index, item) {
            item.isCollapsed = grid.isShowAll;
            grid.dataView.updateItem(item.id, item);
        });
        grid.dataView.endUpdate();
        grid.invalidate();
        grid.isShowAll = !grid.isShowAll;
    };

    // collapseChild
    $scope.collapseChild = function (e, args) {
        if ($(e.target).hasClass("toggle")) {
            var item = $scope.grid.dataView.getItem(args.row);
            if (item) {
                if (!item.isCollapsed) {
                    item.isCollapsed = true;
                    $(e.target).removeClass("fa fa-angle-down").addClass("fa fa-angle-right");
                } else {
                    item.isCollapsed = false;
                    $(e.target).removeClass("fa fa-angle-right").addClass("fa fa-angle-down");
                }
                $scope.grid.dataView.updateItem(item.id, item);
            }
            e.stopImmediatePropagation();
        }
    };

    // change parent
    $scope.changeParent = function () {
        var parent = $scope.grid.dataView.getItemById($scope.data.parent);
        if (parent) {
            $scope.data.indent = parent.indent + 1;
            if (parent.indent === 1) {
                $('#div_grvCriteriaCategoryDetail').removeClass('hidden');
                $timeout(function () {
                    initSlickGrid($scope, 'grvCriteriaCategoryDetail');
                    $scope.grvCriteriaCategoryDetail.dataView.bufferRemoveData = [];
                    $scope.grvCriteriaCategoryDetail.setColumnDataSource('level', $scope.setting.valuelist.criteriaLevel);
                    $scope.grvCriteriaCategoryDetail.setColumnEditorFormat('level', function (state) {
                        if (!state.id) return state.text;

                        return $('<div style="width:fit-content;display:flex;height:30px">'
                            + '<span class="txt_cut" style="width:150;float:left;line-height:30px"><span class="criteria_level_' + state.id + '"> ' + state.text + '</span></span>');
                    });
                    var data = $.extend(true, [], $scope.grid.dataView.getItems().filter(x => x.parent === $scope.data.id));
                    $scope.grvCriteriaCategoryDetail.setData(data);
                }, 100);
            }
            else {
                $scope.grvCriteriaCategoryDetail = null;
                $('#div_grvCriteriaCategoryDetail').addClass('hidden');
            }
        }
        else {
            $scope.grvCriteriaCategoryDetail = null;
            $('#div_grvCriteriaCategoryDetail').addClass('hidden');
        }
    };

    // add
    $scope.add = function () {
        $('#parent_id').attr("disabled", false);
        $scope.data = {};
        callModal('modal_detail');
        // change parent
        $scope.changeParent();
    };

    // edit
    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (!data)
            showError($scope.translation.ERR_UPDATE_NULL);
        else {
            $('#parent_id').attr("disabled", true);
            $scope.data = $.extend(true, {}, data);
            callModal('modal_detail');
            // change parent
            $scope.changeParent();
        }
    };

    // copy
    $scope.copy = function () {
        var data = $scope.grid.getCurrentData();
        if (!data)
            showError($scope.translation.ERR_SELECT_DATA_COPY);
        else {
            $('#parent_id').attr("disabled", true);
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            callModal('modal_detail');
            // change parent
            $scope.changeParent();
        }
    };

    // delete
    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (!data)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    // delete data
    $scope.deleteData = function () {
        var params = {
            id: $scope.data.id
        };
        $scope.postData("api/pt/criteriaCategory/Delete", params, function (data) {
            if (data) {
                $scope.loadData();
                showSuccess($scope.translation.SUCCESS_DELETE);
            }
        });
    };

    // save data
    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        var listChild = [];
        if ($scope.grvCriteriaCategoryDetail)
            listChild = $scope.grvCriteriaCategoryDetail.dataView.getItems();

        if (listChild.filter(x => !x.name).length > 0 || listChild.filter(x => !x.level).length > 0) {
            showWarning($scope.translation.ERR_REQUIRED);
        }
        else {
            var params = {
                data: $scope.data,
                listChild: listChild
            };

            $scope.postData("api/pt/criteriaCategory/Save", params, function (data) {
                if (data) {
                    $scope.loadData();
                    $('#modal_detail').modal('hide');
                    showSuccess($scope.translation.SUCCESS_TAB);
                }
            });
        }
    };

    // addDetail
    $scope.addDetail = function () {
        var data = $scope.grvCriteriaCategoryDetail.dataView.getItems();
        if (data.filter(x => !x.name).length > 0 || data.filter(x => !x.level).length > 0)
            showWarning($scope.translation.ERR_REQUIRED);
        else {
            var rowCount = data.length;
            $scope.grvCriteriaCategoryDetail.dataView.insertItem(rowCount, { id: rowCount, level: 1, name: '' });
        }
    };

    // deleteDetail
    $scope.deleteDetail = function () {
        var data = $scope.grvCriteriaCategoryDetail.getCurrentData();
        if (data) {
            $scope.grvCriteriaCategoryDetail.dataView.deleteItem(data.id);
            $scope.grvCriteriaCategoryDetail.invalidate();
        }
        else {
            showError($scope.translation.ERR_DELETE_NULL);
        }
    };

    $scope.importData = function () {
        var allowFile = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        var input = $(document.createElement('input'));
        input.attr("type", "file");
        if (allowFile) input.attr("accept", allowFile);

        input.on("change", function (e) {
            var file = this.files[0];
            var fileType = file["type"];

            if (allowFile == "image/*" && !fileType.startsWith("image/")) {
                showWarning(scope.globalTranslation["WRN_UPLOAD_FILETYPE"]);
                $scope.frmFile.set("file", null);
                return;
            }

            $scope.frmFile.set("file", file);
            $scope.frmFile.set("baseRow", 2);
            $scope.postFile('api/pt/criteriaCategory/import', $scope.frmFile, function (data) {
                $scope.loadData();
            });
        });

        input.trigger('click');
    };
}]);