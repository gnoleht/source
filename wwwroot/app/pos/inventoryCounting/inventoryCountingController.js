'use strict';
app.register.controller('inventoryCountingController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.dataFilter = {};
    $scope.dataRootRoot = null;
    $scope.dataChoose = null;

    $scope.displayFunction = function () {
        $scope.button.filter = true;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $('#full_text_filter').focus();
        $scope.storeFilter = null;
        $scope.dateFromFilter = null;
        $scope.dateToFilter = null;

    }

    //init
    $scope.searchValue = "";


    $scope.displayFunction = function () {
        $scope.button.filter = true;
        $scope.button.search = false;
    };

    $scope.$on('$routeChangeSuccess', function () {

        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
                $scope.setting.valuelist.dateTypeFilter = $scope.setting.valuelist.dashboardTimeMark;
            },
        });
        $scope.dateTypeFilter = 0;
        $scope.dataFilter.dateToFilter = new Date();
        $scope.dataFilter.dateFromFilter = new Date();


        $scope.loadDataRoot(1);

        if ($scope.grid) {
            $scope.loadStore();
            $scope.getListCounter();
            $scope.loadData();
            $scope.grid.editAction = function (grid, item) { };
        }
        if (!$scope.grvInventoryCountingDetail) {
            initSlickGrid($scope, 'grvInventoryCountingDetail');

            if ($scope.listInventoryCountingDetail == null)
                $scope.listInventoryCountingDetail = [];

            $scope.grvInventoryCountingDetail.onCellChange.subscribe(function (e, args) {
                var column = args.grid.getColumns()[args.cell];
                var dataRow = args.item;

                var thisItem = $scope.setting.valuelist.listItem.find(x => x.id == dataRow.itemId);
                if (column.id == 'barcode') {

                    dataRow.quantity = thisItem.sum;
                    dataRow.actualQuantity = dataRow.quantity;

                    dataRow.difference = dataRow.quantity - dataRow.actualQuantity;

                    dataRow.differeceAmount = (-1) * dataRow.difference * thisItem.cogs;

                }

                if (column.id == 'actualQuantity') {
                    if (!dataRow.quantity)
                        dataRow.quantity = thisItem.sum;

                    dataRow.difference = dataRow.quantity - dataRow.actualQuantity;

                    dataRow.differeceAmount = (-1) * dataRow.difference * thisItem.cogs;

                }
                args.grid.invalidate();
            });

            $scope.grvInventoryCountingDetail.onKeyDown.subscribe(function (e) {
                if (e.which == 13) {
                    $scope.addRow();
                }
            });

            if ($scope.data)
                $scope.loadInventoryCountingDetail($scope.data.id);
        }

        if (!$scope.grvItemImport) {
            initSlickGrid($scope, 'grvItemImport');

            $scope.grvItemImport.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("selectedItemImport")) {
                    var data = $scope.grvItemImport.dataView.getItem(args.row);
                    data.selectedItemImport = !data.selectedItemImport;
                    $scope.grvItemImport.dataView.updateItem(data.id, data);
                    $scope.grvItemImport.invalidate();
                };
            });

            $scope.grvItemImport.resizeCanvas();

            $scope.grvItemImport.editAction = function (grid, item) { };
        }


        $scope.loadItem();

        $scope.refresh = function () {
            $scope.loadData();
            $scope.loadDataRoot(1);
        };

        $scope.search = function (e, type, click) {
            if (click != 1)
                if (e != null && e.keyCode != 13) return;

            $scope.searchValue = $("#full_text_filter").val();

            $scope.loadDataRoot(1, false, $scope.searchValue);
        };

        $(window).resize(function () {
            var width = $("#inventoryCounting .white_box").width();
            var height = $("#inventoryCounting .white_box").height();
            var box_control = $("#inventoryCounting .box_filter").height();

            if ($("#inventoryCounting .box_filter").is(":visible")) {
                $('#inventoryCounting .content_4 dd').height(height - 45 - box_control);
                $('#inventoryCounting .content_6 .wrapper dd').height(height - 250 - box_control);
            }
            else {
                $('#inventoryCounting .content_4 dd').height(height - 30);
                $('#inventoryCounting .content_6 .wrapper dd').height(height - 240);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

        $scope.searchItemFull = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadItemImport();
        };
        $timeout(function () {
            $("#code").prop('disabled', true);
            $("#statusCounting").prop('disabled', true);
            $("#inputQuantity").keydown(function (e) {
                if (e.which == 189 || e.which == 109)
                    e.preventDefault();
            });

            $("#pageInput").keypress(function (e) {
                if (e != null && e.keyCode != 13) return;
                var page = parseInt($("#pageInput").val());
                if (page > 0 && page <= $scope.dataRoot.totalPage) {
                    $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
                }
            });
        });

       
    });

    $scope.getListCounter = function (search) {
        $scope.postData("api/pos/employee/getList", null, function (data) {
            $scope.setting.valuelist.counter = data;
        });

    };

    //cmbEmployee
    $scope.cmbCashierId = {
        url: "api/pos/employee/getList",
        allowClear: true,
    };
    //function   
    $scope.cmbStoreFilter = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: inventoryCountingTranslation.STOREID,
    };
    //$scope.cmbStoreId = {
    //    url: "api/pos/store/GetListComboxbox",
    //    allowClear: true,
    //};

    //function
    $scope.loadDataRoot = function (page, pageEnd, searchValue, storeFilter, dateFrom, dateTo) {
        $scope.postData("api/pos/InventoryCounting/Get", { searchValue: searchValue, pageCurrent: page, pageEnd: pageEnd, storeFilter: storeFilter, dateFrom: dateFrom, dateTo: dateTo }, function (data) {
            $scope.dataRoot = data;
            $scope.dataRootRoot = data;
            if (data.data.length > 0) {
                $scope.data = data.data[0];
                if ($scope.action == 'add')
                    $scope.data = data.data[data.data.length - 1];
            }
            else {
                $scope.data = {};
            }
            $scope.chooseInventoryCounting($scope.data);
            if (!$scope.$$phase)
                $scope.$apply();
        });
    };

    $scope.loadData = function () {
        if ($scope.data.id != null && $scope.data.id != undefined)
            $scope.postData("api/pos/InventoryCountingDetail/GetById", { id: $scope.data.id }, function (data) {
                $scope.grid.setData(data);

                //show view
                $scope.dataChoose.totalDifference = 0;
                $scope.dataChoose.totalIncrease = 0;
                $scope.dataChoose.totalReduction = 0;

                $.each(data, function (i, v) {
                    $scope.dataChoose.totalDifference += v.difference;
                });
                $.each(data, function (i, v) { if (v.difference > 0) $scope.dataChoose.totalIncrease += v.difference; });
                $.each(data, function (i, v) { if (v.difference < 0) $scope.dataChoose.totalReduction += v.difference; });
            });
        else
            $scope.grid.setData([]);
    }
    $scope.loadInventoryCountingDetail = function (id) {
        $scope.postData("api/pos/InventoryCountingDetail/GetById", { id: id }, function (data) {
            $scope.listInventoryCountingDetail = data;
            if (data && $scope.grvInventoryCountingDetail)
                $scope.grvInventoryCountingDetail.setData(data);
        });
    };

    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
            if (data.length > 0)
                $scope.data.storeId = data[0];
        });
    }
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.loadInventoryCountingDetail(null);
        $scope.data.docDate = moment(new Date()).format();
        $scope.data.status = 'N';
        $scope.defaultData = $.extend(true, {}, $scope.data);
        $scope.barcodeArea = false;

        var docTime = moment(Date.now()).format("HH:mm");
        $("#docTime").val(docTime);

        $scope.dateTypeFilter = 0;

        callModal('modal-detail');
        $('#objectName').focus();

        $scope.loadItem();

        $timeout($scope.grvInventoryCountingDetail.resizeCanvas());

    }

    $scope.edit = function () {
        if ($scope.data.status == 'D') {
            showError(inventoryCountingTranslation["ERR_UPDATE_D"]);
            return false;
        }
        if ($scope.data == null)
            showError(inventoryCountingTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.barcodeArea = false;
            $scope.action = 'edit';
            $scope.loadInventoryCountingDetail($scope.data.id);

            var docDate = moment($scope.data.docTime).format("HH:mm");
            $("#docTime").val(docDate);

            $scope.data = $.extend(true, {}, $scope.data);
            callModal('modal-detail');
            $('#objectName').focus();
            $("#code").prop('disabled', true);

            $scope.loadItem();

            $timeout($scope.grvInventoryCountingDetail.resizeCanvas());
            
        };
    };
    $scope.setupEdit = function (item) {
        if (item == null)
            showError(inventoryCountingTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.data = $.extend(true, {}, item);
        }
        $scope.edit();
    };

    $scope.copy = function () {
        if ($scope.grid != null) {
            var data = $scope.data;
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }
            $scope.loadInventoryCountingDetail($scope.data.id);

            $scope.action = 'add';
            $scope.barcodeArea = false;
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            $scope.data.code = null;
            $scope.data.status = "N";

            var docDate = moment($scope.data.docTime).format("HH:mm");
            $("#docTime").val(docDate);

            callModal('modal-detail');
            $('#objectName').focus();
            $("#code").prop('disabled', true);
            $timeout($scope.grvInventoryCountingDetail.resizeCanvas());
        }
    };

    $scope.save = function () {
        Slick.GlobalEditorLock.commitCurrentEdit();

        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        $scope.data.docTime = $("#docTime").val();

        if ($scope.action == 'add') {
            debugger
            $scope.postData("api/pos/inventoryCounting/Add", { data: $scope.data, dataDetails: $scope.listInventoryCountingDetail }, function (data) {
                $('#modal-detail').modal('hide');
                //$scope.dataRoot.insert(0, data);
                $scope.loadDataRoot($scope.dataRoot.pageCurrent, true);
            });

        }
        else {
            //if ($scope.listInventoryCountingDetail)
            $scope.postData("api/pos/inventoryCounting/Update", { data: $scope.data, dataDetails: $scope.listInventoryCountingDetail }, function (data) {
                $('#modal-detail').modal('hide');
                //$scope.loadDataRoot();
                var indexTemp = $scope.dataRoot.data.findIndex(x => x.id == data.id);
                $scope.dataRoot.data[indexTemp] = data;
                $scope.chooseInventoryCounting(data);
            });

        }
    };

    $scope.delete = function () {
        if ($scope.data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        if ($scope.data.status == "D")
            showError($scope.translation.ERR_UPDATE_D);
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postNoAsync("api/pos/inventoryCounting/remove", JSON.stringify($scope.data), function (lstDelete) {
            if (lstDelete) {
                if ($scope.dataRootRoot.data.length == 1)
                    $scope.loadDataRoot($scope.dataRoot.pageCurrent - 1);
                else
                    $scope.loadDataRoot($scope.dataRoot.pageCurrent);
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    $(".switch").click(function () {
        $(this).toggleClass("change");

        var value = ($(".switch input").val() == 'true');
        $(".switch input").val(!value);
        $scope.data.active = !value;
    });

    $scope.changeActive = function (e, args) {
        var item = $scope.grid.dataView.getItem(args.row);
        if (item) {
            item.active = item.active ? false : true;
            $scope.postData("api/pos/inventoryCounting/update", { data: JSON.stringify(item) }, function (data) {
                $scope.grid.dataView.updateItem(item.id, item);
                $scope.grid.invalidate();
            });

        }

    };

    $scope.changeDocDate = function () {
        $scope.loadItem();
    };  

    $scope.addRow = function (itemId, quantity, type) {
        var rowCount = $scope.grvInventoryCountingDetail.dataView.getLength();
        var listItem = $scope.grvInventoryCountingDetail.dataView.getItems();
        if (type == "insertRow") {
            if (listItem.length > 0 && listItem.filter(x => x.itemId == "" || x.itemId == null).length > 0) {

            }
            else {
                $scope.grvInventoryCountingDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', itemId: itemId, actualQuantity: quantity ? quantity : 0 });
            }
        }
        else {
            //item lấy từ data - có giá vốn cogs
            var item = $scope.listItem.find(x => x.id == itemId);

            //item lấy tại grid
            var itemGrid = listItem.find(x => x.itemId == itemId);
            if (itemGrid) {//item tồn tại trên grid (cộng thêm)
                itemGrid.actualQuantity += quantity;

                itemGrid.difference = itemGrid.quantity - itemGrid.actualQuantity;

                itemGrid.differeceAmount = (-1) * itemGrid.difference * item.cogs;

                $scope.grvInventoryCountingDetail.dataView.updateItem(itemGrid.id, itemGrid);
            }
            else {//item chưa tồn tại, thêm vào
                //dataRow.actualQuantity = dataRow.quantity;

                //dataRow.difference = dataRow.actualQuantity - dataRow.quantity;

                //dataRow.differeceAmount = (-1) * dataRow.difference * thisItem.cogs;
                if (item) {
                    $scope.grvInventoryCountingDetail.dataView.insertItem(0, {
                        id: rowCount, slickRowState: 'new', itemId: itemId, quantity: item.sum, actualQuantity: quantity ? quantity : 0,
                        difference: item.sum - quantity, differeceAmount: (item.sum - quantity) * item.cogs
                    });
                }
            }

        }

    };


    //remove Step
    $scope.removeRow = function () {

        var currentData = $scope.grvInventoryCountingDetail.getCurrentData();

        if (currentData) {
            $scope.grvInventoryCountingDetail.dataView.deleteItem(currentData.id);
        }
    };

    $scope.chooseInventoryCounting = function (item) {
        $('.itemInventoryCounting').removeClass('active');
        $("#" + item.id).addClass("active");
        $scope.data = item;
        $scope.dataChoose = item;
        if ($scope.dataChoose.statusText)
            $scope.dataChoose.statusText = $scope.setting.valuelist.statusCounting.find(x => x.id == $scope.dataChoose.status).text;

        //$scope.data.tempCashType = $scope.setting.valuelist.cashType.find(x => x.id == $scope.data.cashType).text;
        $scope.loadData();
        $scope.loadInventoryCountingDetail($scope.data.id);
        //if (!item)
        //    $scope.dataChoose = {};
    };
    $scope.sum = function (items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    };

    $scope.prev = function (page) {
        if (page > 0)
            $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
    }
    $scope.next = function (page) {
        if (page <= $scope.dataRoot.totalPage)
            $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
    }
    $scope.searchObject = function () {
        //var dataFilter = [];
        //dataFilter = $.extend(true, [], $scope.dataRootRoot.data);

        //if ($scope.storeFilter != undefined && $scope.storeFilter != null)
        //    dataFilter = dataFilter.filter(x => x.storeId == $scope.storeFilter);


        //$scope.dataRoot.data = dataFilter;
        $scope.loadDataRoot(1, false, '', $scope.storeFilter, $scope.dataFilter.dateFromFilter, $scope.dataFilter.dateToFilter);
    }

    

    $scope.loadItem = function () {
        $scope.postData("api/pos/Item/GetInventoryCount", { docDate: $scope.data.docDate, storeId: $scope.data.storeId }, function (data) {
            $scope.listItem = data;
            $scope.setting.valuelist.listItem = data.map(function (item) {
                return { id: item.id, text: item.barcode, name: item.name, sku: item.sku, unit: item.relatedUnitOfMeasure ? item.relatedUnitOfMeasure.name : null, cogs: item.cogs, sum: item.sum }
            });
            $scope.setting.valuelist.listItem.splice(0, 0, { id: 'header', disabled: true });
            $scope.grvInventoryCountingDetail.setColumnDataSource('barcode', $scope.setting.valuelist.listItem);

            $scope.grvInventoryCountingDetail.setColumnEditorFormat('barcode', function (state) {
                if (!state.id) return state.text;

                if (state.id == 'header') {
                    var $state = $('<div style="width:fit-content;display:flex;height:30px;border-bottom:1px solid #ddd">'
                        + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px;font-weight:600" >' + 'Barcode' + '</span>'
                        + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px;font-weight:600">' + 'Sku' + '</span>'
                        + '<span  class="txt_cut" style="width:400px;float:left;line-height:30px;font-weight:600">' + 'Name' + '</span></div>');

                    return $state;
                }

                var $state = $('<div style="width:fit-content;display:flex;height:30px">'
                    + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px">' + state.text + '</span>'
                    + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px" >' + state.sku + '</span>'
                    + '<span  class="txt_cut" style="width:400px;float:left;line-height:30px">' + state.name + '</span></div>');

                return $state;
            });
        });
    };

    $scope.changeStatus = function () {

        $scope.action = 'edit'
        if ($scope.data.status == 'D')
            $scope.data.status = 'N';
        else
            $scope.data.status = 'D';

        $scope.save();
    }

    $scope.showBarcodeArea = function () {
        $scope.barcodeArea = !$scope.barcodeArea;
        $scope.inputQuantity = 1;

        setTimeout(function () { $("#inputBarcode").focus(); }, 500);
    };
    $scope.importItem = function () {
        var barcode = $scope.inputBarcode;
        var quantity = $scope.inputQuantity;

        if (!barcode || (!quantity && quantity != 0)) {
            showError($scope.translation.VALUE_NULL);
            return;
        }
        $scope.loadItem();
        var item = $scope.listItem.find(x => x.barcode == barcode);
        if (item) {
            $scope.addRow(item.id, quantity, 'barcode');
            $("#inputBarcode").val("");
            $scope.inputBarcode = null;
            $scope.inputQuantity = 1;
        }
        else
            showError($scope.translation.ITEM_NOT_FOUND);
    };

    $("#inputBarcode").on("keypress", function (e) {
        if (e.keyCode == 13) {
            $scope.importItem();
        }
    });

    /// Import item
    $scope.cmbFieldFilter = {
        url: "api/pos/ItemField/GetListComboxbox",
        allowClear: true,
    };


    $scope.cmbGroupFilter = {
        url: "api/pos/ItemGroup/GetListComboxbox",
        allowClear: true,
    };


    $scope.loadItemImport = function () {
        var searchValue = $("#full_text_filter2").val();
        $scope.postData("api/pos/Item/get", { searchValue: searchValue }, function (data) {
            $scope.listItemImport = data;
            if (data && data.length > 0) {
                $scope.grvItemImport.setData(data);
      
            }
        });

        $timeout(function () {
            $scope.grvItemImport.resizeCanvas();
        });
    }

    shortcut.add("F3", function () {
        if ($("#modal-detail").is(":visible")) {
            if ($("#modal-item-import").is(":visible")) {
                $('#modal-item-import').modal('hide');
            }
            else {
                callModal('modal-item-import');
                $scope.loadItemImport();
            }
        }
    });

    $scope.searchAdvance = function () {
        callModal('modal-item-import');
        $scope.loadItemImport();
    };


    $scope.searchItemImport = function () {
        var dataFilter = angular.copy($scope.listItemImport);
        if ($scope.fieldFilter) {
            dataFilter = dataFilter.filter(x => x.relatedGroup.itemField.id == $scope.fieldFilter);
        }
        if ($scope.groupFilter) {
            dataFilter = dataFilter.filter(x => x.groupId == $scope.groupFilter);
        }

        $scope.grvItemImport.setData(dataFilter);
        $scope.grvItemImport.resizeCanvas();
    }

    $scope.saveSearchItemImport = function () {
        var listItem = $scope.grvItemImport.dataView.getItems().filter(x => x.selectedItemImport);
        $.each(listItem, function (index, item) {
            $scope.addRow(item.id, item.quantity, 'import');
            $("#inputBarcode").val("");
            $scope.inputBarcode = null;
            $scope.inputQuantity = 1;
        });

        $('#modal-item-import').modal('hide');
    }
    $scope.processDate = function (filter) {
        var currentYear = moment().get('year');

        var fromDate = null;
        var toDate = null;

        if (filter == "1")//Hôm nay
        {
            fromDate = moment();
            toDate = moment();
        }
        else if (filter == "2")//Tuần này
        {
            fromDate = moment().startOf("week");
            toDate = moment().endOf("week");
        }

        else if (filter == "3")// Tháng này
        {
            fromDate = moment().startOf("month");
            toDate = moment().endOf("month");
        }

        else if (filter == "4") //Quý này
        {
            fromDate = moment().startOf("quarter");
            toDate = moment().endOf("quarter");
        }

        else if (filter == "5")// Năm nay
        {
            fromDate = moment().startOf("year");
            toDate = moment().endOf("year");
        }

        else if (filter == "6") //Quý 1
        {
            fromDate = moment(new Date(currentYear, 0, 1));
            toDate = moment(fromDate).endOf("quarter");
        }

        else if (filter == "7") //Quý 2
        {
            fromDate = moment(new Date(currentYear, 3, 1));
            toDate = moment(fromDate).endOf("quarter");
        }

        else if (filter == "8") //Quý 3
        {
            fromDate = moment(new Date(currentYear, 6, 1));
            toDate = moment(fromDate).endOf("quarter");
        }
        else if (filter == "9") //Quý 4
        {
            fromDate = moment(new Date(currentYear, 9, 1));
            toDate = moment(fromDate).endOf("quarter");
        }
        else if (filter == "10") //6 tháng đầu năm
        {
            fromDate = moment(new Date(currentYear, 0, 1));
            toDate = moment(new Date(currentYear, 0, 1)).add(5, 'M').endOf('month');
        }
        else if (filter == "11") //6 tháng cuối năm
        {
            fromDate = moment(new Date(currentYear, 6, 1));
            toDate = moment(new Date(currentYear, 11, 31));
        }

        else if (filter == "12") //hôm trước
        {
            fromDate = moment().subtract(1, 'days');
            toDate = moment().subtract(1, 'days');
        }

        else if (filter == "13") //tuần trước
        {
            fromDate = moment().subtract(1, 'weeks').startOf("week");
            toDate = moment().subtract(1, 'weeks').endOf("week");
        }

        else if (filter == "14") //tháng trước
        {
            fromDate = moment().subtract(1, 'M').startOf("month");
            toDate = moment().subtract(1, 'M').endOf("month");
        }

        else if (filter == "15") //quý trước
        {
            fromDate = moment().subtract(1, 'Q').startOf("quarter");
            toDate = moment().subtract(1, 'Q').endOf("quarter");
        }

        else if (filter == "16") //năm trước
        {
            fromDate = moment().subtract(1, 'Y').startOf("year");
            toDate = moment().subtract(1, 'Y').endOf("year");
        }


        $scope.$apply(function () {
            if (!filter) {
                $scope.dataFilter.dateFromFilter = null;
                $scope.dataFilter.dateToFilter = null;
            }
            else {
                $scope.dataFilter.dateFromFilter = fromDate.format();
                $scope.dataFilter.dateToFilter = toDate.format();
            }
        });

        //$scope.fromDate = fromDate.format();
        //$scope.toDate = toDate.format();
    }
    $scope.dateTypeChange = function () {
        $scope.processDate($scope.dateTypeFilter);
    };
}]);