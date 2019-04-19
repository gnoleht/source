'use strict';
app.register.controller('stationeryFormController', ['$scope', '$timeout', 'authService', function ($scope, $timeout, authService) {

    $scope.onLoad = function () {
        $scope.grid = null;
        init('stationeryForm', $scope, true);
        $scope.grid.editAction = function (grid, item) { };

        $scope.grid.onClick.subscribe(function (e, args) {
            //if ($(e.target).is('.btnRemoveItem')) {
            //    $scope.data.stationeryDetail.splice(args.row, 1);
            //    $scope.grid.setData($scope.data.stationeryDetail);
            //}
        });

        $scope.grid.onCellChange.subscribe(function (e, args) {
            //debugger;
            var item = args.item;
            if (item.quantity < 1) {
                item.quantity = 1;
                args.grid.dataView.updateItem(item.id, item);
            }

            args.grid.updateFooter(args.grid);
            //if ($(e.target).is('.btnRemoveItem')) {
            //    $scope.data.stationeryDetail.splice(args.row, 1);
            //    $scope.grid.setData($scope.data.stationeryDetail);
            //}
        });

        //$scope.translation = stationeryFormTranslation;

        if ($scope.$parent.setting.valuelist && $scope.$parent.setting.listFilter) {
            $scope.setting.valuelist = $scope.$parent.setting.valuelist;
            $scope.setting.listFilter = $scope.$parent.setting.listFilter;
        stationeryFormSetting.valuelist = $scope.setting.valuelist;
        stationeryFormSetting.listFilter = $scope.setting.listFilter;
        }
        else {
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
        }

        stationeryFormSetting = $scope.setting;
        //$scope.buildGrvItem();
    };

    $scope.removeRow = function () {
        var rowSelected = $scope.grid.getCurrentData();
        if (rowSelected) {
            $scope.grid.dataView.deleteItem(rowSelected.id);
        }
    };

    $scope.dataAction = function (action, data) {
        if (action == 'delete') $scope.delete(data);
        else {
            $scope.action = action;
            $scope.data = angular.copy(data);
            if (action == "add") {
                $scope.data.period = "1";
                $scope.data.userRef = authService.user;
                $scope.getUserLogCompany();
                $scope.data.createdDate = moment().format('LL');

                $scope.grid.setData(null);
            }
            if (action == "edit") {
                $scope.data.createdDate = moment($scope.data.createdTime).format('LL');
                $scope.grid.setData($scope.data.stationeryDetail);
            }
            $scope.defaultData = angular.copy($scope.data);
            if ($scope.data != "1") {
                $scope.getCurentLimit();
            }
            callModal('modal-detail', true, "txtReason");
            $("#modal-detail #tab_01-tab").click();
        }
    };

    $scope.getCurentLimit = function () {
        var params = {
            department: $scope.data.department,
            data : $scope.action == 'add' ? null : $scope.data
        };
        $scope.postData("api/pt/stationery/GetCurentLimit", params, function (result) {
            if (result || result === 0) {
                $scope.limitMessage = $scope.translation.LIMIT_DEPARTMENT + ": " + accounting.formatMoney(result) + " (" + $scope.translation.UNIT_VND + ")";
            }
            else {
                $scope.limitMessage = $scope.translation.NOT_LIMIT_DEPARTMENT;
            }
        });
    };

    $scope.getUserLogCompany = function () {
        $scope.postData('api/pt/Stationery/GetUserLogCompany', null, function (result) {
            if (result.company) {
                $scope.data.company = result.company.id;
                $scope.data.companyRef = result.company;
            }
            if (result.department) {
                $scope.data.department = result.department.id;
                $scope.data.departmentRef = result.department;
            }
        });
    };

    $scope.save = function () {
        if (!$scope.checkFields()) return;
        else {
            if (!angular.equals($scope.data, $scope.defaultData)) {
                if ($scope.action == 'add') {
                    if (!$scope.data.department) { showWarning($scope.translation.WRN_NULL_DEPARTMENT); return; }
                    $scope.postData("api/pt/stationery/add", { data: $scope.data }, function (data) {
                        $scope.$parent.saveStationery(data);
                        $('#modal-detail').modal('hide');

                    });
                }
                else if ($scope.action == 'edit') {
                    $scope.postData("api/pt/stationery/update", { data: $scope.data }, function (data) {
                        $scope.$parent.saveStationery(data);
                        $('#modal-detail').modal('hide');
                    });
                }
            }
            else {
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
            }
        }
    };

    $scope.checkFields = function () {
        var message = '';
        if (isNullOrEmpty($scope.data.reason))
            message += $scope.translation.WRN_NULL_REASON + "<br/>";
        if ($scope.grid.dataView.getItems().length <= 0)
            message += $scope.translation.WRN_NULL_ITEM + "<br/>";
        if (message.length <= 0) return true;

        showWarning(message);
        return false;
    };

    $scope.sendApprove = function () {
        $scope.postData("api/pt/stationery/sendApprove", { data: $scope.data }, function (data) {
            $scope.$parent.saveStationery(data, 'sendapprove');
            $('#modal-detail').modal('hide');
        });
    };

    $scope.approve = function () {
        $scope.postData("api/pt/stationery/approve", { data: $scope.data, comment: $scope.data.comment }, function (data) {
            $scope.$parent.saveStationery(data, 'approve');
            $('#modal-detail').modal('hide');
        });
    };

    $scope.reject = function () {
        $scope.postData("api/pt/stationery/reject", { data: $scope.data, comment: $scope.data.comment }, function (data) {
            $scope.$parent.saveStationery(data, 'reject');
            $('#modal-detail').modal('hide');
        });
    };

    $scope.history = function () {
        $scope.postData("api/pt/stationery/GetHistory", { id: $scope.data.id }, function (data) {
            var html = '<tr><th colspan="5" class="text-center text-uppercase">' + $scope.translation.STATIONERY_PROCESS + '</th></tr>';
            if (data && data.length > 0) {
                html += '<tr class="active text-center">'
                    + '<th>' + $scope.translation.EXECUTOR + '</th>'
                    + '<th>' + $scope.translation.ACTION + '</th>'
                    + '<th>' + $scope.translation.DATE_ACTION + '</th>'
                    + '<th>' + $scope.translation.STATUS + '</th>'
                    + '<th>' + $scope.translation.OPINION + '</th></tr>';

                $.each(data, function (idx, item) {
                    //html += '<tr><td colspan="4"><strong>' + $scope.translation[item.action.toUpperCase()] + '</strong></td></tr>';

                    html += '<tr><td>' + item.userRef.displayName + '</td>'
                        + '<td>' + $scope.translation[item.action.toUpperCase()] + '</td>'
                        + '<td>' + (moment(item.createdTime).format('l') + ' ' + moment(item.createdTime).format('HH:mm'))
                        + '</td>' + '<td>' + gridItemRender($scope.setting.listFilter.stationeryStatus[item.status])
                        + '</td>' + '<td style="color:red;">' + (item.opinion ? item.opinion : '') + '</td></tr>';
                });
            }
            $('#btlContent').html(html);
            callModal('stationery-history');
        });
    };

    $scope.delete = function (item) {
        if (item !== undefined && item !== null && item !== {}) {
            $scope.postData("api/pt/stationery/delete", { id: item.id }, function () {
                if ($scope.$parent.deleteStationery)
                    $scope.$parent.deleteStationery(true, item);
            });
        }
    };

    $scope.importItem = function () {
        if (!$scope.grvItem)
            $scope.buildGrvItem();
        $scope.filterItem = { category : "-1"};

        $scope.postData("api/pt/stationery/GetItems", null, function (data) {
            $scope.grvItem.setData(data);
            $scope.grvItem.resizeCanvas();
        });

        callModal('modal-import-item', true);

        $timeout(function () { $scope.grvItem.resizeCanvas(); });
    };

    $scope.itemFilter = function () {
        var params = {
            category: $scope.filterItem.category > 0 ? $scope.filterItem.category : null,
            textSearch: $scope.filterItem.textSearch
        };
        $scope.postData("api/pt/stationery/GetItems", params, function (data) {
            $scope.grvItem.setData(data);
        });
    };

    $scope.buildGrvItem = function () {
        initSlickGrid($scope, 'grvItem');

        $scope.grvItem.editAction = function (grid, item) {
            item.selected = !item.selected;
            grid.dataView.updateItem(item.id, item);
        };

        $scope.grvItem.onClick.subscribe(function (e, args) {
            if ($(e.target).is('.check-selected')) {
                var item = args.grid.dataView.getItem(args.row);
                item.selected = !item.selected;
                $scope.grvItem.dataView.updateItem(item.id, item);
            }
        });
    };

    $scope.resizeGridCanvas = function () {
        $timeout(function () {
            if ($scope.grid)
                $scope.grid.resizeCanvas();
        });
    };

    $scope.saveAddItem = function () {
        var listAdd = $scope.grvItem.dataView.getItems().filter(x => x.selected);
        if (listAdd.length > 0) {
            if (!$scope.data.stationeryDetail) $scope.data.stationeryDetail = [];
            var curentList = $scope.data.stationeryDetail.map(x => x.id);
            $.each(listAdd, function (index, items) {
                var item = angular.copy(items);
                if (!curentList.includes(item.id)) {
                    item.quantity = 1;
                    item.prices = item.cost;
                    item.pricesVAT = item.cost - (item.cost * (item.percentVAT / 100));
                    $scope.data.stationeryDetail.push(item);
                }
            });
            $scope.grid.setData($scope.data.stationeryDetail);
            $scope.grid.resizeCanvas();
        }
        $('#modal-import-item').modal('hide');
    };
}]);