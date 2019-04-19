
'use strict';
app.register.controller('workItemController', ['$scope', '$location', '$sce', 'authService', function ($scope, $location, $sce, authService) {

    $scope.$on('$routeChangeSuccess', function () {
        $scope.ListIsOpen = [];

        init($scope.params.type, $scope);

        eval($scope.params.type + "InitSetting()");
        $scope.setting = window[$scope.params.type + "Setting"];

        var title = $scope.$root.titleTemplate[$scope.params.type];
        if (title != null) {
            $("#divModuleTitle").html(title.moduleTitle);
            $scope.title.form = title.formTitle;
        }

        $("#menu_" + $scope.params.type).addClass("selected");

        $scope.params.url = 'api/';
        $scope.params.url += (($scope.params.pjid ? 'pj/' : 'pm/') + ($scope.params.type == undefined ? 'epic' : $scope.params.type) + '/');

        $scope.postData($scope.params.url + 'GetListProject', { pid: $scope.params.pid }, function (data) {
            $scope.setting.valuelist.project = data;
        });

        $.ajax({
            url: '/app/pm/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
            },
        });

        workItemSetting.valuelist = $scope.setting.valuelist;
        workItemSetting.listFilter = $scope.setting.listFilter;

        $scope.translation = workItemTranslation;
        if ($scope.grid != null) {

            //custom in filter function, data is rowData, return true to show row, false to hide row
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            var url = $scope.params.url + 'get?pid=' + $scope.params.pid + '&pjid=' + $scope.params.pjid + '&area=' + $scope.params.area + '&type=' + $scope.params.type + '&pjType=' + $scope.params.pjType;

            $scope.setting.grid.url = url;

            $scope.post(url, null, function (data) {
                if (data) {
                    $.each(data, function (index, item) { item.isCollapsed = item.hasChild });
                    $scope.grid.setData(data);
                }
            });

            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("toggle")) {
                    var item = $scope.grid.dataView.getItem(args.row);

                    if (item) {
                        if (!item.isCollapsed) {
                            item.isCollapsed = true;
                            //$scope.ListIsColllapsed.splice($scope.ListIsColllapsed.indexOf(item.id), 1);
                        } else {
                            item.isCollapsed = false;
                            //$scope.ListIsColllapsed.push(item.id);
                        }
                        $scope.grid.dataView.updateItem(item.id, item);
                    }

                    //e.stopImmediatePropagation();
                }
                else {
                    if ($(e.target).hasClass("addChild")) {
                        var item = $scope.grid.dataView.getItem(args.row);
                        if (item) {
                            $scope.parentType = item.type;
                            if (item.type == 'requirement') {
                                $scope.add('requirement', item)
                                $scope.$digest();
                            }
                            else {
                                $scope.$digest();
                                $("#contextMenu").css({ "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenu'), "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenu') + 5}).show();
                            }
                        }
                    }
                    if ($(e.target).hasClass("use-case")) {
                        var item = $scope.grid.dataView.getItem(args.row);
                        $scope.openUseCase(item.id);
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
            $scope.grid.onScroll.subscribe(function () {
                $(".context-menu").hide();
            });
        };

        $scope.refresh = function () {
            $scope.ListIsOpen = [];
            $scope.reloadGrid();
        };

        $(document).click(function (e) {
            if (!$(e.target).hasClass("addChild"))
                $("#contextMenu").hide();
        });
    });

    $scope.displayTitle = function () {
        if ($scope.params.module == 'pm') {
            toogleProduct(true);
        }
        else if ($scope.params.module == 'pj') {
            toogleProject(true);
            //toogleArea(true);
        }
    };

    $scope.collapseAll = function (grid) {
        //$scope.ListIsOpen = [];
        var listHasChild = grid.dataView.getItems().filter(function (x) { return x.hasChild == true; });
        //if (!grid.isShowAll) $scope.ListIsOpen = $.map(listHasChild, x => x.id);
        grid.dataView.beginUpdate();
        $.each(listHasChild, function (index, item) {
            item.isCollapsed = grid.isShowAll;
            grid.dataView.updateItem(item.id, item);
        });
        grid.dataView.endUpdate();
        grid.invalidate();
        grid.isShowAll = !grid.isShowAll;
    };

    $scope.reloadGrid = function () {
        $scope.post($scope.setting.grid.url, null, function (data) {
            if (data) {
                $.each(data, function (index, item) {
                    item.isCollapsed = item.hasChild;
                    if ($scope.ListIsOpen && $scope.ListIsOpen.indexOf(item.id) != -1) {
                        item.isCollapsed = false;
                    }
                });
                $scope.grid.setData(data);
            }
        });
    };

    $scope.add = function (typeAdd, parent) {
        $scope.action = 'add';
        $scope.data = {};

        $scope.data.type = $scope.params.type;

        $scope.parentItem = parent;

        if (typeAdd != null) {
            if (parent == null) {
                parent = $scope.grid.getCurrentData();
                //$scope.data.parent = parent.id;
                //$scope.data.parentType = parent.type;
                $scope.parentItem = parent;
            }
            $scope.data.type = typeAdd;
            $("#contextMenu").hide();
        }
        $scope.childScope['workItemForm'].dataAction($scope.action, $scope.data, $scope.parentItem);
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null || data == undefined) {
            showError($scope.translation.ERR_SELECT_DATA_EDIT);
        }
        else {
            var childScope = $scope.childScope['workItemForm'];
            if (childScope == null) return;

            $scope.data = data;
            $scope.action = 'edit';
            childScope.dataAction($scope.action, data);
        }
    };

    $scope.copy = function (typeAdd, parent) {
        if ($scope.grid != null) {
            var data = $scope.grid.getCurrentData();
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }
            $scope.parentItem = null;
            $scope.action = 'add';

            $scope.data = angular.copy(data);
            $scope.data.id = null;
            $scope.data.no = null;
            $scope.data.state = 'new';
            $scope.data.priority = '3-Normal';
            $scope.data.risk = 'Medium';

            $scope.data.actualStartDate = null;
            $scope.data.actualEndDate = null;
            $scope.data.actualDuration = null;

            if ($scope.data.type != "task") {
                $scope.data.planStartDate = null;
                $scope.data.planEndDate = null;
                $scope.data.planDuration = null;
            }

            if (!isNullOrEmpty($scope.data.parent)) {
                var parentItemGrid = $scope.grid.dataView.getItemById($scope.data.parent);
                $scope.parentItem = parentItemGrid ? angular.copy(parentItemGrid) : $scope.getWorkItemById($scope.data.parent);
            }
            //$scope.parentItem = parent;

            if (!isNullOrEmpty(typeAdd)) {
                if (parent == null) {
                    parent = $scope.grid.getCurrentData();
                    $scope.parentItem = parent;
                }
                $scope.data.type = typeAdd;
            }

            $scope.childScope['workItemForm'].dataAction($scope.action, $scope.data, $scope.parentItem);
        }
    };

    $scope.getWorkItemById = function (id) {
        var itemData = {};
        $scope.postData('api/workitem/GetWorkItemById', { id: id }, function (data) {
            itemData = data;
        })
        return itemData;
    }

    //Use case
    $scope.openUseCase = function (id) {
        $('#page-loading').removeClass('loaded')
        var href = '../../../js/grapheditor/grapheditor.html?touch=1&refId=' + id;
        //$('#grapheditor-modal').modal();
        callModal('grapheditor-modal');
        $("#ifr-usecase").attr("src", href);
        $('#ifr-usecase').on('load', function () {
        });
    };
    $scope.closeUsecase = function () {
        document.getElementById('ifr-usecase').contentWindow.location.reload();
    };

    $scope.delete = function () {
        $scope.data = $scope.grid.getCurrentData();
        if ($scope.data == null) {
            showError($scope.translation["ERR_SELECT_DATA_DELETE"]);
        }
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        var childScope = $scope.childScope.workItemForm;
        if (childScope)
            childScope.dataAction('delete', $scope.data);
    };

    $scope.deleteWorkItem = function () {
        var isOpenList = $scope.grid.dataView.getItems().filter(x => !x.isCollapsed);
        $scope.ListIsOpen = $.map(isOpenList, x => x.id);
        $scope.reloadGrid();
    };

    $scope.saveWorkItem = function (data) {
        var isOpenList = $scope.grid.dataView.getItems().filter(x => !x.isCollapsed);
        $scope.ListIsOpen = $.map(isOpenList, x => x.id);
        $scope.reloadGrid();
    };
}]);
