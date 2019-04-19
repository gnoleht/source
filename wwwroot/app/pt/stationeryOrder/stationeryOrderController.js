'use strict';
app.register.controller('stationeryOrderController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
            }
        });
        $scope.reloadGrid();
        if ($scope.grid) {
            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                $scope.loadOrder();
            });
            $scope.grid.onMouseEnter.subscribe(function (e, args) {
                if (e.type === "mouseenter") {
                    var cell = args.grid.getCellFromEvent(e)
                    var row = cell.row
                    var item = args.grid.dataView.getItem(row);
                    if (!item.hasChild) {
                        $(e.target).closest('div').popover({
                            title: '<strong>' + stationeryOrderTranslation.INFORMATION + '</strong>',
                            content: function () {
                                var html = '';
                                //html += '<div><strong>' + $scope.translation.REASON + '</strong>: ' + item.reason + '</div>';
                                html += '<div><strong>' + stationeryOrderTranslation.DEPARTMENT + '</strong>: ' + (item.departmentRef ? item.departmentRef.code : '') + '</div>';
                                html += '<div><strong>' + stationeryOrderTranslation.CREATED_BY + '</strong>: ' + (item.userRef ? item.userRef.displayName : '') + '</div>';
                                html += '<div><strong>' + stationeryOrderTranslation.AMOUNT_REGISTER + '</strong>: ' + item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + stationeryOrderTranslation.UNIT_VND + '</div>';
                                return html;
                            },
                            html: true,
                            trigger: 'hover',
                            placement: 'bottom',
                            container: '#grvStationeryOrder',
                            delay: {
                                show: "0",
                                hide: "0"
                            }
                        }).popover('show');
                    }
                }

            });
            $scope.grid.editAction = function (grid, item) { };

            $scope.grid.customFilter = function (data) {
                if (data.parentGroup == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parentGroup);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("toggle")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    if (item) {
                        if (!item.isCollapsed) {
                            item.isCollapsed = true;
                        } else {
                            item.isCollapsed = false;
                        }
                        $scope.grid.dataView.updateItem(item.id, item);
                    }
                }
            });
        }

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            var url = $scope.setting.grid.url;
            var searchValue = $scope.stringSearch;
            url += "?searchValue=" + searchValue;
            $.ajax({
                url: url,
                data: null,
                type: "POST",
                contentType: "application/json",
                success: function (response) {
                    if (response.isError == false) {
                        $scope.grid.dataView.setItems(response.data, 'id');
                        $scope.grid.selectedRow(1);
                        $scope.loadOrder();
                        $("#stationeryOrder #txtSearch").focus();
                    }
                },
            });
        }
    });

    $scope.displayFunction = function () {
        $scope.button.copy = false;
        $scope.button.search = false;
    };

    $scope.reloadGrid = function () {
        $scope.postData("api/pt/StationeryOrder/GetRegister", {}, function (data) {
            if (data) {
                $scope.grid.setData(data);
                $scope.grid.selectedRow(1);
                $scope.loadOrder();
            }
        });
    };

    $scope.loadOrder = function () {
        if (!$scope.grvOrder) $scope.buildGrvOrder();
        var item = $scope.grid.getCurrentData();
        if (item) {
            $scope.parentData = item;
            var params = { id: item.id };
            $scope.postData('api/pt/StationeryOrder/get', params, function (data) {
                if (data) {
                    $scope.grvOrder.setData(data);
                    $scope.grvOrder.selectedRow(0);
                }
            });
        }
        else {
            $scope.grvOrder.setData([]);
        }
        if (!$scope.$$phase) {
            $scope.$digest();
        }
    };

    $scope.add = function () {
        $scope.addOrder();
    };

    $scope.edit = function () {
        $scope.editOrder();
    };

    $scope.delete = function () {
        $scope.data = $scope.grvOrder.getCurrentData();
        if ($scope.data == null) {
            showWarning($scope.translation["ERR_SELECT_DATA_DELETE"]);
        }
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postData("api/pt/stationeryOrder/delete", { data: $scope.data }, function (data) {
            data.stationery.indent = $scope.parentData.indent;
            data.stationery.parentGroup = $scope.parentData.parentGroup;
            $scope.grid.dataView.updateItem($scope.parentData.id, data.stationery);
            $scope.loadOrder();
            showSuccess($scope.translation.DELETE_SUCCESS);
        })
    };

    $scope.changeDateOrder = function () {
        var orderDate = $scope.dataOrder.orderDate;
        var expectedDate = $scope.dataOrder.expectedDate;
        if (!isNullOrEmpty(orderDate) && !isNullOrEmpty(expectedDate)) {
            //var today = moment().format();
            //if (today > orderDate) {
            //    $scope.dataOrder.orderDate = today;
            //}
            if (orderDate > expectedDate) {
                $scope.dataOrder.expectedDate = $scope.dataOrder.orderDate;
            }
        }
        else {
            if (!$scope.dataOrder.orderDate) $scope.dataOrder.orderDate = moment().format();
            if (!$scope.dataOrder.expectedDate || orderDate > expectedDate) $scope.dataOrder.expectedDate = $scope.dataOrder.orderDate;
        }
    }

    $scope.saveAndExport = function () {
        $scope.saveOrder();
        if ($scope.dataOrder.id) $scope.exportExcel();
    };

    $scope.exportExcel = function () {
        if (!$scope.dataOrder) return;

        var exportData = $scope.dataOrder.items;
        if (exportData.length == 0) return;
        $.each(exportData, function (i, item) {
            var listFilter = stationeryOrderSetting.listFilter.stationeryUnit[item.unit];
            if (listFilter)
                item.unit = listFilter.text;
        });

        exportData[0].orderDate = moment($scope.dataOrder.orderDate).format('l');
        exportData[0].expectedDate = moment($scope.dataOrder.expectedDate).format('l');
        exportData[0].createBy = $scope.dataOrder.userCreate.displayName;
        exportData[0].amount = $scope.dataOrder.amountOrder;

        var param = {
            id: 'Stationery Teamplate',
            data: JSON.stringify(exportData),
            baseRow: '9',
        };
        $scope.postData('api/pt/stationeryOrder/export', param, function (data) {
            window.location = 'api/system/ViewFile/' + data.fileId + '/' + data.fileName;
        });
    };

    $scope.buildGrvOrder = function () {
        initSlickGrid($scope, 'grvOrder');

        $scope.grvOrder.editAction = function (grid, item) {
            $scope.editOrder();
        };
    };

    $scope.buildGrvOrderDetail = function () {
        initSlickGrid($scope, 'grvOrderDetail');

        $scope.grvOrderDetail.editAction = function (grid, item) {
        };

        $scope.grvOrderDetail.onClick.subscribe(function (e, args) {
        });

        $scope.grvOrderDetail.onCellChange.subscribe(function (e, args) {
            var item = args.item;
            if (item.quantityOrder < 0)
                item.quantityOrder = 0;
            else if (item.quantityOrder > item.quantity) {
                item.quantityOrder = item.quantity;
            }

            if (item.delivered < 0)
                item.delivered = 0;
            else if (item.delivered > item.quantityOrder) {
                item.delivered = item.quantityOrder;
            }
            args.grid.dataView.updateItem(item.id, item);
            args.grid.updateFooter(args.grid);
        });
    };

    $scope.addOrder = function () {
        $scope.action = 'add';
        if (!$scope.grvOrderDetail) $scope.buildGrvOrderDetail();
        var parent = $scope.grid.getCurrentData();
        if (!parent) return;
        var stationery = angular.copy(parent.stationeryDetail.filter(x => x.quantity > (x.quantityOrder + x.received)));
        if (stationery.length > 0) {
            $.each(stationery, function (index, item) {
                item.quantityOrder = item.quantity = item.quantity - item.quantityOrder - item.received;
            });

            $scope.dataOrder = {};
            $scope.dataOrder.StationeryId = parent.id;
            $scope.dataOrder.items = stationery;
            $scope.dataOrder.orderDate = moment().format();
            $scope.dataOrder.expectedDate = moment().format();


            $scope.grvOrderDetail.setData($scope.dataOrder.items);
            $scope.grvOrderDetail.setColumnOption('delivered', { editor: null });
            $scope.grvOrderDetail.setColumnOption('quantityOrder', { editor: Slick.Editors.Integer });

            allowInput("#orderDate,#expectedDate");
            callModal('modal-order');
            setTimeout(function () { $scope.grvOrderDetail.resizeCanvas(); $scope.grvOrderDetail.updateFooter($scope.grvOrderDetail); });
        }
        else showWarning($scope.translation.WRN_THIS_ORDER_HAD_ENOUGH);
    };

    $scope.editOrder = function () {
        $scope.action = 'edit';
        if (!$scope.grvOrderDetail) $scope.buildGrvOrderDetail();
        $scope.dataOrder = $scope.grvOrder.getCurrentData();
        if ($scope.dataOrder.status == "0") {
            $.each($scope.dataOrder.items, function (index, item) {
                item.delivered = item.quantityOrder;
            });
        }
        $scope.grvOrderDetail.setData($scope.dataOrder.items);

        $scope.grvOrderDetail.setColumnOption('quantityOrder', { editor: null });
        $scope.grvOrderDetail.setColumnOption('delivered', { editor: Slick.Editors.Integer });

        readonlyInput("#orderDate,#expectedDate");
        callModal('modal-order');
        if (!$scope.$$phase) {
            $scope.$digest();
        }
        setTimeout(function () { $scope.grvOrderDetail.resizeCanvas(); $scope.grvOrderDetail.updateFooter($scope.grvOrderDetail); });
    };

    $scope.saveOrder = function () {
        if ($scope.action == 'add') {
            $scope.postData("api/pt/stationeryOrder/add", { data: $scope.dataOrder }, function (data) {
                $('#modal-order').modal('hide');

                $scope.dataOrder = data.data;
                if ($scope.parentData.stationeryStatus == data.stationery.stationeryStatus) {
                    data.stationery.indent = $scope.parentData.indent;
                    data.stationery.parentGroup = $scope.parentData.parentGroup;
                    $scope.grid.dataView.updateItem($scope.parentData.id, data.stationery);
                    $scope.loadOrder();
                }
                else {
                    $scope.reloadGridParent($scope.parentData.id);
                }

                showSuccess($scope.translation.ADD_ORDER_SUCCESS);
            })
        }
        else if ($scope.action == 'edit') {
            $scope.postData("api/pt/stationeryOrder/update", { data: $scope.dataOrder }, function (data) {
                $('#modal-order').modal('hide');
                if ($scope.parentData.stationeryStatus == data.stationery.stationeryStatus) {
                    data.stationery.indent = $scope.parentData.indent;
                    data.stationery.parentGroup = $scope.parentData.parentGroup;
                    $scope.grid.dataView.updateItem($scope.parentData.id, data.stationery);
                    $scope.loadOrder();
                }
                else {
                    $scope.reloadGridParent($scope.parentData.id);
                }

                showSuccess($scope.translation.COMPLETE_ORDER_SUCCESS);
            })
        }
    };

    $scope.reloadGridParent = function (parentId) {
        $scope.postData("api/pt/StationeryOrder/GetRegister", {}, function (data) {
            if (data) {
                $scope.grid.setData(data);
                var index = $scope.grid.dataView.getIdxById(parentId);
                $scope.grid.selectedRow(index > 1 ? index : 1);
                $scope.loadOrder();
            }
        });
    };

    $scope.historyShow = function () {
        $scope.postData("api/pt/stationeryOrder/GetHistory", { id: $scope.dataOrder.id }, function (data) {
            var html = '<tr><th colspan="3" class="text-center text-uppercase">' + $scope.translation.ORDER_PROCESS + '</th></tr>';
            if (data && data.length > 0) {
                html += '<tr class="active text-center">'
                    + '<th>' + $scope.translation.EXECUTOR + '</th>'
                    + '<th>' + $scope.translation.DATE_ACTION + '</th>'
                    + '<th>' + $scope.translation.STATUS + '</th>'
                //+ '<th>' + $scope.translation.OPINION + '</th></tr>';

                $.each(data, function (idx, item) {
                    html += '<tr><td colspan="4"><strong>' + $scope.translation[item.action.toUpperCase()] + '</strong></td></tr>';

                    html += '<tr><td>' + item.userRef.displayName + '</td>'
                        + '<td>' + (moment(item.createdTime).format('l') + ' ' + moment(item.createdTime).format('HH:mm'))
                        + '</td>' + '<td>' + gridItemRender($scope.setting.listFilter.orderStatus[item.status])
                    //+ '</td>' + '<td style="color:red;">' + (item.opinion ? item.opinion : '') + '</td></tr>';
                });
            }
            $('#content-history').html(html);
            callModal('order-history');
        });
    };
}]);
