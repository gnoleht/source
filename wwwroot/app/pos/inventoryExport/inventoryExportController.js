'use strict';
app.register.controller('inventoryExportController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.totalItem = 0;
    $scope.totalPage = 0;
    $scope.pageCurrent = 0;
    //$scope.timeMark = 3;

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $scope.objectTypeFilter = null;
        $scope.storeFilter = null;
    }
    //init
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

                $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark;
            },
        });

        if (!$scope.grvItemDetail) {
            initSlickGrid($scope, 'grvItemDetail');

            $scope.loadItem();
            $scope.loadUnit();
            $scope.grvItemDetail.dataView.bufferRemoveData = [];

            $scope.grvItemDetail.onCellChange.subscribe(function (e, args) {
                var column = args.grid.getColumns()[args.cell];
                var dataRow = args.item;

                if (column.id == 'barcode') {
                    if (dataRow.itemId) {
                        var item = $scope.listItem.find(x => x.id == dataRow.itemId);
                        dataRow.unitCost = item.cogs;
                        dataRow.amount = dataRow.unitCost * dataRow.quantity;
                    }
                }

                if (column.id == 'quantity' || column.id == 'unitCost') {
                    dataRow.amount = dataRow.unitCost * dataRow.quantity;
                }

                if (column.id == 'amount') {
                    if (dataRow.quantity && dataRow.quantity != 0)
                        dataRow.unitCost = dataRow.amount / dataRow.quantity;
                }

                args.grid.invalidate();
            });

        }

        if (!$scope.grvItemImport) {
            initSlickGrid($scope, 'grvItemImport');

            $scope.grvItemImport.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("selectedItemImport")) {
                    var data = $scope.grvItemImport.dataView.getItem(args.row);
                    $scope.checkItemImport(data);
                };
            });

            $("#ckbAllItem").on("click", function (e) {
                $scope.checkAllItemImport();
            });

            $scope.grvItemImport.resizeCanvas();

            $scope.grvItemImport.editAction = function (grid, item) { };
        }

        if ($scope.grid) {
            $scope.loadData(1);
            $scope.grid.editAction = function (grid, item) { };
        }



        $scope.refresh = function () {
            $scope.loadData();
        };

        $scope.searchFull = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadData();
        };

        //$(window).resize(function (e) {
        //    if ($scope.grid)
        //        $scope.grid.resizeCanvas();
        //});
        //$(window).resize();

        $("#pageInput").keypress(function (e) {
            if (e != null && e.keyCode != 13) return;
            var page = parseInt($("#pageInput").val());
            if (page > 0 && page <= $scope.totalPage)
                $scope.loadData(page);
        });

        $(window).resize(function () {
            var width = $("#inventoryExport .white_box").width();
            var height = $("#inventoryExport .white_box").height();
            var box_control = $("#inventoryExport .box_filter").height();

            if ($("#inventoryExport .box_filter").is(":visible")) {
                $('#inventoryExport .content_4 dd').height(height - 55 - box_control);
                $('#inventoryExport .content_6 .wrapper dd').height(height - 250 - box_control);
            }
            else {
                $('#inventoryExport .content_4 dd').height(height - 30);
                $('#inventoryExport .content_6 .wrapper dd').height(height - 240);
            }

            $scope.grid.resizeCanvas();
            $scope.grvItemDetail.resizeCanvas();
        });
        $(window).resize();

        $scope.searchItemFull = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadItemImport();
        };

        //$scope.processDate($scope.timeMark);
    });

    // checkAllItemImport
    $scope.checkAllItemImport = function () {
        var gridImportData = $scope.grvItemImport.dataView.getItems();
        if ($("#ckbAllItem").hasClass('bowtie-checkbox-empty')) {
            $("#ckbAllItem").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
            angular.forEach(gridImportData, function (item) {
                item.selectedItemImport = true;
            });
        }
        else {
            $("#ckbAllItem").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
            angular.forEach(gridImportData, function (item) {
                item.selectedItemImport = false;
            });
        }

        $scope.grvItemImport.setData(gridImportData);
    };

    // checkItemImport
    $scope.checkItemImport = function (item) {
        if (item.selectedItemImport) item.selectedItemImport = false;
        else item.selectedItemImport = true;
        var gridImportData = $scope.grvItemImport.dataView.getItems();
        if (gridImportData.length === gridImportData.filter(x => x.selectedItemImport === true).length)
            $("#ckbAllItem").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
        else
            $("#ckbAllItem").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');

        $scope.grvItemImport.dataView.updateItem(item.id, item);
    };




    $scope.loadItem = function () {
        $scope.postData("api/pos/Item/get", null, function (data) {
            $scope.listItem = data;
            $scope.setting.valuelist.listItem = data.map(function (item) {
                return { id: item.id, text: item.barcode, name: item.name, sku: item.sku, unit: item.relatedUnitOfMeasure ? item.relatedUnitOfMeasure.name : null, cogs: item.cogs }
            });
            $scope.setting.valuelist.listItem.splice(0, 0, { id: 'header', disabled: true });
            $scope.grvItemDetail.setColumnDataSource('barcode', $scope.setting.valuelist.listItem);

            $scope.grvItemDetail.setColumnEditorFormat('barcode', function (state) {
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

    $scope.loadUnit = function () {
        $scope.postData("api/pos/UnitOfMeasure/get", null, function (data) {
            $scope.setting.valuelist.listUnit = data;
        });
    };



    $scope.cmbStoreId = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: inventoryExportTranslation.STOREID,
    };

    $scope.cmbObject = {
        url: "api/pos/inventoryExport/GetListComboxbox",
        allowClear: true,
        params: {},
    };

    $scope.changeObjectType = function () {
        $scope.cmbObject.params.type = $scope.data.objectType;
        $scope.data.objectId = null;
    };

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.active = true;
        $scope.data.docDate = moment().format();
        $scope.barcodeArea = false;
        $scope.cancelExport = false;

        var docTime = moment(Date.now()).format("HH:mm");
        $("#docTime").val(docTime);

        callModal('modal-detail');
        $("#code").prop('disabled', true);
        $('#objectType').focus();

        $scope.cmbObject.params.type = null;
        $scope.grvItemDetail.setData([]);
        $timeout(function () {
            $scope.grvItemDetail.resizeCanvas();
            $scope.data.objectType = "1";
            $scope.cmbObject.params.type = "1";
        });
    }

    $scope.edit = function () {
        var data = $scope.defaultFirstData;
        if (data == null)
            showError(groupTranslation["ERR_CHOOSE_STORE_EDIT"]);
        else {
            $scope.cmbObject = {
                url: "api/pos/inventoryExport/GetListComboxbox",
                allowClear: true,
                params: {},
            };

            $scope.barcodeArea = false;

            $scope.action = 'edit';
            $scope.data = angular.copy(data);

            $("#code").prop('disabled', true);
            $('#objectType').focus();

            //$scope.data.docTime = moment($scope.data.docTime).format("HH:mm");
            var docDate = moment($scope.data.docTime).format("HH:mm");
            $("#docTime").val(docDate);


            $scope.cmbObject.params.type = $scope.data.objectType;

            callModal('modal-detail');
            //$scope.loadGrid(item.id);
            $timeout(function () { $scope.grvItemDetail.resizeCanvas(); }, 200);
        };
    };

    $scope.copy = function () {
        var data = $scope.defaultFirstData;
        if (data == null) {
            showError($scope.translation.ERR_SELECT_DATA_COPY);
            return;
        }

        $scope.cmbObject = {
            url: "api/pos/inventoryExport/GetListComboxbox",
            allowClear: true,
            params: {},
        };

        data.code = null;

        $scope.barcodeArea = false;
        $scope.action = 'copy';
        $scope.data = angular.copy(data);

        var docDate = moment($scope.data.docTime).format("HH:mm");
        $("#docTime").val(docDate);

        $scope.data.docDate = moment().format();

        $scope.cmbObject.params.type = $scope.data.objectType;

        callModal('modal-detail');
        $timeout(function () { $scope.grvItemDetail.resizeCanvas(); });
        $("#code").prop('disabled', true);
        $('#objectType').focus();
    };

    $scope.classActive = function (id) {
        if ($scope.defaultFirstData.id == id)
            return 'active';
        return '';
    }


    $scope.changeRow = function (item) {
        if (item) {
            $scope.defaultFirstData = item;
            $scope.loadGrid(item.id);
            $scope.loadObject(item.objectType, item.objectId);
        }
    }


    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        $scope.grvItemDetail.getEditController().commitCurrentEdit();

        var allItems = $scope.grvItemDetail.dataView.getItems().length;
        if (allItems == 0) {
            showError($scope.translation.ERR_NO_ITEM);
            return;
        }

        if ($scope.action == "copy") {
            var dataMaster = angular.copy($scope.data);
            var newData = $scope.grvItemDetail.dataView.getItems();
            var updateData = [];
            $scope.action = "add";
        }
        else {
            var newData = $scope.grvItemDetail.dataView.getItems().filter(x => x.slickRowState == 'new');
            var updateData = $scope.grvItemDetail.dataView.getItems().filter(x => x.slickRowState == 'update');
            var deleteData = $scope.grvItemDetail.dataView.bufferRemoveData;

            $scope.data.docTime = $("#docTime").val();

            var dataMaster = angular.copy($scope.data);
        }

        var parameter = {
            details: {
                'add': JSON.stringify(newData),
                'update': JSON.stringify(updateData),
                'delete': JSON.stringify(deleteData)
            },
            master: JSON.stringify(dataMaster),
            type: $scope.action
        }


        $scope.postData('api/pos/inventoryExport/save', parameter, function (data) {
            if ($scope.action == "add") {
                $scope.loadData($scope.totalPage);
            }
            else {
                //var indexTemp = $scope.listData.findIndex(x => x.invExport.id == data.id);
                //$scope.listData[indexTemp].invExport = data;

                $scope.loadData($scope.pageCurrent);
            }

            $('#modal-detail').modal('hide');

            $timeout(function () {
                $("#" + data.id).click();
            });
        });
    };

    $scope.delete = function () {
        var data = $scope.defaultFirstData;

        if (data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postData("api/pos/inventoryExport/Delete", { data: $scope.data }, function (result) {
            if (!result) {
                $scope.loadData();
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    $scope.loadData = function (page, pageEnd) {

        var searchValue = $("#full_text_filter").val();
        var params = {
            searchValue: searchValue,
            pageCurrent: page,
            pageEnd: pageEnd,
            objectTypeFilter: $scope.objectTypeFilter,
            storeFilter: $scope.storeFilter,
            fromDate: $scope.fromDate,
            toDate: $scope.toDate
        }

        $scope.postData("api/pos/inventoryExport/get", params, function (object) {
            $scope.$applyAsync(function () {
                //if (object.data.length > 0) {
                $scope.listData = object.data;
                $scope.listFilter = object.data;

                $scope.totalItem = object.totalItem;
                $scope.totalPage = object.totalPage;
                $scope.pageCurrent = object.pageCurrent;

                $scope.defaultFirstData = $scope.listData.length > 0 ? $scope.listData[0].invExport : null;
                if ($scope.defaultFirstData) {
                    $scope.loadGrid($scope.defaultFirstData.id);

                    $scope.loadObject($scope.defaultFirstData.objectType, $scope.defaultFirstData.objectId);
                }
                //}
            });
        });
    }

    $scope.loadObject = function (type, id) {
        var params = {
            type: type,
            id: id
        }

        $scope.objectType = $scope.setting.valuelist.objectType.find(x => x.id == type).text;

        $scope.postData("api/pos/inventoryExport/GetObject", params, function (data) {
            if (data) {
                if (type == "3") {
                    $scope.objectName = data.displayName;
                }
                else {
                    $scope.objectName = data.name;
                }
            }
            else {
                $scope.objectName = "";
            }
        });
    }

    $scope.loadGrid = function (id) {
        $scope.postData("api/pos/inventoryExport/GetDetail", { id: id }, function (data) {
            $scope.grid.setData(data);
            $scope.grvItemDetail.setData(data);
        });
    }

    $scope.addRow = function (itemId, quantity, type) {
        var rowCount = $scope.grvItemDetail.dataView.getLength();
        if (type == "insertRow") {
            $scope.grvItemDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', itemId: itemId, quantity: quantity ? quantity : 1 });
        }
        else {
            var item = $scope.listItem.find(x => x.id == itemId);
            var listItem = $scope.grvItemDetail.dataView.getItems();
            var itemGrid = listItem.find(x => x.itemId == itemId);
            if (itemGrid) {
                itemGrid.quantity += quantity;
                itemGrid.amount = itemGrid.quantity * itemGrid.unitCost;
                $scope.grvItemDetail.dataView.updateItem(itemGrid.id, itemGrid);
            }
            else {
                $scope.grvItemDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', itemId: itemId, quantity: quantity ? quantity : 1, unitCost: item.cogs, amount: item.cogs * quantity });
            }

        }

    };

    $scope.deleteRow = function () {
        var currentData = $scope.grvItemDetail.getCurrentData();

        if (currentData) {
            if (currentData.slickRowState != 'new') {
                $scope.grvItemDetail.dataView.bufferRemoveData.push(currentData);
            }

            $scope.grvItemDetail.dataView.deleteItem(currentData.id);
        }
    };

    $scope.prev = function (page) {
        if (page > 0) {
            $scope.loadData(page);
            $("#pageInput").val(page);
        }
    }

    $scope.next = function (page) {
        if (page <= $scope.totalPage) {
            $scope.loadData(page);
            $("#pageInput").val(page);
        }
    }

    $scope.searchObject = function () {
        //$scope.loadData();
        var fromDate = $scope.fromDate;
        var toDate = $scope.toDate;
        var dataFilter = angular.copy($scope.listFilter);
        if ($scope.objectTypeFilter) {
            dataFilter = dataFilter.filter(x => x.invExport.objectType == $scope.objectTypeFilter);
        }
        if ($scope.storeFilter) {
            dataFilter = dataFilter.filter(x => x.invExport.storeId == $scope.storeFilter);
        }
        if (fromDate && toDate && fromDate != "Invalid date" && toDate != "Invalid date") {
            dataFilter = dataFilter.filter(x => x.invExport.docDate <= toDate && x.invExport.docDate >= fromDate);
        }

        $scope.listData = dataFilter;
    }

    $scope.showBarcodeArea = function () {
        $scope.barcodeArea = !$scope.barcodeArea;
        $scope.inputQuantity = 1;

        setTimeout(function () { $("#inputBarcode").focus(); }, 500);
    }



    $scope.importItem = function () {
        var barcode = $scope.inputBarcode;
        var quantity = $scope.inputQuantity;

        if (!barcode || (!quantity && quantity != 0)) {
            showError($scope.translation.VALUE_NULL);
            return;
        }

        if (quantity <= 0) {
            showError($scope.translation.QUANTITY_NULL);
            return;
        }

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
        placeholder: inventoryExportTranslation.FIELDID,
    };

    $scope.changeFieldFilter = function () {
        $scope.postData("api/pos/ItemGroup/GetListByFieldId", { fieldId: $scope.fieldFilter }, function (data) {
            $scope.setting.valuelist.groupFilter = data
        });
    };


    $scope.loadItemImport = function () {
        var searchValue = $("#full_text_filter2").val();
        $scope.postData("api/pos/Item/get", { searchValue: searchValue }, function (data) {
            $scope.listItemImport = data;
            if (data && data.length > 0) {
                $scope.grvItemImport.setData(data);
            }
        });

        $timeout(function () { $scope.grvItemImport.resizeCanvas(); });
    }

    shortcut.add("F3", function () {
        if ($("#modal-detail").is(":visible")) {
            if ($("#modal-item-import").is(":visible")) {
                $('#modal-item-import').modal('hide');
            }
            else {
                //$scope.searchAdvance();
                $("#seachButton").click();
            }
        }
    });

    $scope.searchItemExport = function () {
        var dataFilter = angular.copy($scope.listItemImport).filter(x => x.sizeBreakdown == false && x.active == true && (x.kind == '1' || x.kind == '3'));

        if ($scope.groupFilter) {
            dataFilter = dataFilter.filter(x => x.groupId == $scope.groupFilter);
        }

        $scope.grvItemImport.setData(dataFilter);
        $scope.grvItemImport.resizeCanvas();
    }

    $scope.saveSearchItemExport = function () {
        var listItem = $scope.grvItemImport.dataView.getItems().filter(x => x.selectedItemImport);
        $.each(listItem, function (index, item) {
            $scope.addRow(item.id, item.quantity, 'import');
            $("#inputBarcode").val("");
            $scope.inputBarcode = null;
            $scope.inputQuantity = 1;
        });

        $('#modal-item-import').modal('hide');

        $('#full_text_filter2').val('');
        $("#ckbAllItem").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
    }

    $scope.searchAdvance = function () {
        callModal('modal-item-import');
        $scope.loadItemImport();
    };

    /// add object---------------------

    $scope.addObject = function () {
        var type = $scope.data.objectType ? $scope.data.objectType : "1";
        $scope.action = type;
        if (type == "1") {
            $scope.dataVendor = {};
            $scope.dataVendor.active = true;
            $scope.kind = "1";
            $("#codeVendor").prop('disabled', true);
            $('#nameVendor').focus();
        }
        else if (type == "2") {

            $scope.dataCustomer = {};

            $scope.dataCustomer.primaryCountry = "VN";
            $scope.kind = "1";
            $scope.gender = 1;

            $scope.dataCustomer.birthDay = moment().format();
            $scope.changeGender(1);
            $scope.dataCustomer.active = true;

            $("#codeCustomer").prop('disabled', true);
            $('#nameCustomer').focus();
        }
        else if (type == "3") {

            $scope.dataEmployee = {};

            $scope.dataEmployee.maritalStatus = '1';
            $scope.dataEmployee.active = true;
            $scope.dataEmployee.roleId = [];
            $scope.gender = 1;
            $scope.changeGender(1);
            $scope.dataEmployee.birthDay = moment().format();

            $("#codeEmployee").prop('disabled', true);
            $('#phoneEmployee').focus();
        }

        callModal('modal-object-detail');
        $scope.frmFile = new FormData();
    }

    //function
    $scope.changeKind = function (value) {
        $('input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioKind input[value="' + value + '"]').attr('checked', 'checked');

        $scope.kind = value;
    };

    $scope.changeGender = function (value) {
        $('#radioGender input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioGender input[value="' + value + '"]').attr('checked', 'checked');

        $scope.gender = value;
    };

    $scope.saveObject = function () {
        if ($scope.action == "1") {
            if (!$scope.dataVendor.name) {
                showWarning($scope.translation.VALUE_NULL);
                return;
            }

            if ($scope.dataVendor) {
                $scope.dataVendor.kind = $scope.kind;
                $scope.frmFile.append("data", JSON.stringify($scope.dataVendor));
            }

            $scope.postFile("api/pos/vendor/Add", $scope.frmFile, function (data) {
                $scope.data.objectId = data.id;
                $('#modal-object-detail').modal('hide');
            });
        }
        else if ($scope.action == "2") {
            if (!$scope.dataCustomer.name || !$scope.dataCustomer.identificationNo) {
                showWarning($scope.translation.VALUE_NULL);
                return;
            }

            if ($scope.dataCustomer) {
                $scope.dataCustomer.gender = $scope.gender;
                $scope.dataCustomer.kind = $scope.kind;
                $scope.frmFile.append("data", JSON.stringify($scope.dataCustomer));
            }

            $scope.postFile("api/pos/customer/Add", $scope.frmFile, function (data) {
                $scope.data.objectId = data.id;
                $('#modal-object-detail').modal('hide');
            });
        }
        else if ($scope.action == "3") {
            if (!$scope.dataEmployee.firstName || !$scope.dataEmployee.lastName) {
                showWarning($scope.translation.VALUE_NULL);
                return;
            }

            if ($scope.dataEmployee) {
                $scope.dataEmployee.gender = $scope.gender;
                $scope.frmFile.append("data", JSON.stringify($scope.dataEmployee));
            }

            $scope.postFile("api/pos/employee/Add", $scope.frmFile, function (data) {
                $scope.data.objectId = data.id;
                $('#modal-object-detail').modal('hide');
            });
        }
    }

    $scope.changeCancelExport = function (data) {
        $scope.data.cancelExport = !data;
    };

    $scope.processDate = function (filter) {
        var fromDate = null;
        var toDate = null;
        var currentYear = moment().get('year');

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

        //$scope.$apply(function () {
        if (!filter) {
            $scope.fromDate = null;
            $scope.toDate = null;
        }
        else {
            $scope.fromDate = fromDate.format();
            $scope.toDate = toDate.format();
        }
        // });
    }

    $scope.changeTimeMark = function () {
        $scope.processDate($scope.timeMark);
    };

}]);