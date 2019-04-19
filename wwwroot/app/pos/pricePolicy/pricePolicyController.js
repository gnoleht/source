'use strict';
app.register.controller('pricePolicyController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    };

    //init c
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
        $scope.setting.valuelist.priority = [];
        for (i = 1; i <= 10; i++) {
            var temp = {
                "id": i,
                "text": i
            };
            $scope.setting.valuelist.priority.push(temp);
        }

        $scope.setting.discPercent = 0;

        $scope.setting.valuelist.dayInMonth = [];
        for (i = 1; i <= 31; i++) {
            var temp = {
                "id": i,
                "text": i
            };
            $scope.setting.valuelist.dayInMonth.push(temp);
        }

        $scope.setting.valuelist.dayInWeek = moment.weekdays().map(function (value, key) {
            return {
                "id": key,
                "text": value
            }
        });
        $scope.searchFull = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadData();
        };

        $("#pageInput").keypress(function (e) {
            if (e != null && e.keyCode != 13) return;
            var page = parseInt($("#pageInput").val());
            if (page > 0 && page <= $scope.totalPage) {
                $scope.$applyAsync(function () { $scope.loadData(page); });
            }
        });


        $scope.loadCustGroup();
        $scope.initGrid();
        $scope.initGridDetail();

        $scope.loadData(1);
        $scope.loadItem();

        if ($scope.defaultFirstData)
            $scope.statusPolicy = $scope.defaultFirstData.status;
    });

    $scope.initGrid = function () {
        if (!$scope.grvPricePolicy) {
            initSlickGrid($scope, 'grvPricePolicy');
            $scope.grvPricePolicy.editAction = function (grid, item) { };
        }

        if (!$scope.grvPolicyStore) {
            initSlickGrid($scope, 'grvPolicyStore');
            $scope.grvPolicyStore.editAction = function (grid, item) { };
        }
    }

    $scope.initGridDetail = function () {
        //Grid Detail
        if (!$scope.grvPricePolicyDetail) {
            initSlickGrid($scope, 'grvPricePolicyDetail');
            $scope.grvPricePolicyDetail.dataView.bufferRemoveData = [];
            $scope.grvPricePolicyDetail.onClick.subscribe(function (e, args) {

            });
            $scope.grvPricePolicyDetail.editAction = function (grid, item) { };
        }

        if (!$scope.grvPolicyStoreDetail) {
            initSlickGrid($scope, 'grvPolicyStoreDetail');

            $scope.grvPolicyStoreDetail.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("selectedStore")) {
                    var data = $scope.grvPolicyStoreDetail.dataView.getItem(args.row);
                    $scope.checkItemImport(data);
                };
            });

            $scope.grvPolicyStoreDetail.editAction = function (grid, item) { };
        }
        $("#ckbAllStore").on("click", function (e) {
            $scope.checkAllStore();
        });

    }

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;

        $scope.button.add = true;
        $scope.button.edit = true;
        $scope.button.delete = true;
        $scope.button.refresh = true;
        $scope.button.copy = true;
    };

    $scope.cmbStoreId = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: pricePolicyTranslation.STOREID,
    };

    $scope.loadData = function (page, pageEnd) {
        var searchValue = $("#full_text_filter").val();
        var params = {
            searchValue: searchValue,
            pageCurrent: page,
            pageEnd: pageEnd,
            storeFilter: $scope.storeFilter,
            fromDate: $scope.fromDate,
            toDate: $scope.toDate
        }

        $scope.postData("api/pos/pricePolicy/get", params, function (object) {
            $scope.listData = object.data;

            $scope.totalItem = object.totalItem;
            $scope.totalPage = object.totalPage;
            $scope.pageCurrent = object.pageCurrent;

            $scope.defaultFirstData = $scope.listData == null ? null : $scope.listData[0];
        });

        if ($scope.defaultFirstData)
            $scope.loadGrid($scope.defaultFirstData.id);
        else {
            $scope.loadGrid(null);
            $scope.action = 'add';
        }



        $scope.getRowCountGrid();
    };

    $scope.loadGrid = function (policyId) {
        $scope.loadItem();
        $scope.postData("api/pos/pricePolicy/GetDataDetail", { policyId: policyId }, function (data) {
            if (data) {
                if (data.dataPolicyStore) {
                    //var dataMap = data.dataPolicyStore.map(function (data) {
                    //    return {
                    //        id: data.store.id, code: data.store.code, name: data.store.name, primaryStreet: data.store.primaryStreet
                    //    }
                    //});

                    //$scope.grvPolicyStore.setData(dataMap);
                    $scope.grvPolicyStore.setData(data.dataPolicyStore);
                }

                if (data.dataPriceDetail) {
                    $scope.grvPricePolicy.setData(data.dataPriceDetail);
                }

            }
            else {
                $scope.grvPolicyStore.setData([]);
                $scope.grvPricePolicy.setData([]);
            }
        });
    };

    $scope.loadGridDetail = function (policyId) {
        $scope.postData("api/pos/pricePolicy/GetDataDetail", { policyId: policyId }, function (data) {
            if (data != null && data.dataPolicyStore) {
                var gridPolicyStoreDetail = $scope.grvPolicyStoreDetail.dataView.getItems();
                angular.forEach(gridPolicyStoreDetail, function (item) {
                    if (data.dataPolicyStore.map(x => x.id).includes(item.id)) {
                        item.selectedStore = true;
                    }
                    else {
                        item.selectedStore = false;
                    }
                    $scope.grvPolicyStoreDetail.dataView.updateItem(item.id, item);
                });

                if (gridPolicyStoreDetail.length > 0 && gridPolicyStoreDetail.length === gridPolicyStoreDetail.filter(x => x.selectedStore === true).length)
                    $("#ckbAllStore").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
                else
                    $("#ckbAllStore").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');

            }

            if (data != null && data.dataPriceDetail) {
                $scope.grvPricePolicyDetail.setData(data.dataPriceDetail);
            }
            else
                $scope.grvPricePolicyDetail.setData([]);

        });
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

            $scope.getRowCountGrid();
            $scope.statusPolicy = $scope.defaultFirstData.status;
        }
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
            $scope.addRow("PricePolicyDetail", item.id);
            $("#inputBarcode").val("");
            $scope.inputBarcode = null;
            $scope.inputQuantity = 1;
        }
        else
            showError($scope.translation.ITEM_NOT_FOUND);
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.status = "0";
        $scope.data.active = true;
        $scope.data.policyDate = moment().format();
        $scope.data.custType = '1';
        $scope.data.type = '3';
        $scope.data.priority = '1';
        $scope.data.promoType = "1";

        $scope.statusPolicy = '0';

        //xet giá trị giảm giá về 0
        $scope.setting.discPercent = 0;
        $scope.setting.discAmount = 0;

        $scope.data.effFromDate = moment().format();
        $scope.data.effToDate = moment().format();

        var currentTime = moment().format("HH:mm");
        $("#effFromTime").val(currentTime);
        $("#effToTime").val(currentTime);


        callModal('modal-detail');
        $("#code").prop('disabled', true);
        $('#name').focus();
        $('#tab_01-tab').click();

        $scope.loadItem();
        $scope.loadStore();
        $scope.loadGridDetail(null);
        $('#tab_04-tab').click();

        $("#ckbAllStore").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
        $timeout(function () {
            $scope.grvPricePolicyDetail.resizeCanvas();
        }, 200);

    }

    $scope.copy = function () {
        var data = $scope.defaultFirstData;
        if (data == null) {
            showError($scope.translation.ERR_SELECT_DATA_COPY);
            return;
        }

        $scope.loadStore();
        $scope.loadItem();

        $scope.action = 'copy';
        data.code = null;
        $scope.statusPolicy = data.status;
        $scope.data = angular.copy(data);

        $scope.data.policyDate = moment().format();

        var effFromTime = moment($scope.data.effFromTime).format("HH:mm");
        $("#effFromTime").val(effFromTime);

        var effToTime = moment($scope.data.effToTime).format("HH:mm");
        $("#effToTime").val(effToTime);

        $scope.setting.discPercent = $scope.data.discPercent;
        $scope.setting.discAmount = $scope.data.discAmount;

        callModal('modal-detail');

        $("#code").prop('disabled', true);
        $('#name').focus();
        $('#tab_01-tab').click();
        $('#tab_04-tab').click();

        $scope.loadGridDetail($scope.data.id);
        $timeout(function () { $scope.grvPricePolicyDetail.resizeCanvas(); }, 200);
    };

    //
    $scope.edit = function () {
        var data = $scope.defaultFirstData;
        if (data == null)
            showError(groupTranslation["ERR_CHOOSE_STORE_EDIT"]);
        else {
            if (data.status == '1') {
                showWarning($scope.translation.ERR_EDIT);
                return;
            }
            $scope.loadStore();
            $scope.loadItem();

            $scope.action = 'edit';
            $scope.statusPolicy = data.status;
            $scope.data = angular.copy(data);

            $scope.setting.discPercent = $scope.data.discPercent;
            $scope.setting.discAmount = $scope.data.discAmount;

            $("#code").prop('disabled', true);
            $('#objectType').focus();

            $('#tab_01-tab').click();
            $('#tab_04-tab').click();

            var effFromTime = moment($scope.data.effFromTime).format("HH:mm");
            $("#effFromTime").val(effFromTime);

            var effToTime = moment($scope.data.effToTime).format("HH:mm");
            $("#effToTime").val(effToTime);

            callModal('modal-detail');

            $scope.loadGridDetail($scope.data.id);
            $timeout(function () { $scope.grvPricePolicyDetail.resizeCanvas(); }, 200);
        };


    };

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
                $scope.fromDate = null;
                $scope.toDate = null;
            }
            else {
                $scope.fromDate = fromDate.format();
                $scope.toDate = toDate.format();
            }
        });

        //$scope.fromDate = fromDate.format();
        //$scope.toDate = toDate.format();
    }

    $scope.changecustType = function (val) {
        if (val == "1")
            $scope.data.custType = '2';
        else
            $scope.data.custType = '1';
    }

    $scope.changeTimeMark = function () {
        $scope.processDate($scope.timeMark);
    };

    $scope.loadCustGroup = function () {
        $scope.postNoAsync("api/pos/CustGroup/GetList", null, function (data) {
            $scope.setting.valuelist.custApplied = data;
        });
    }

    $scope.addRow = function (type, id) {
        $scope.setting.discPercent = $scope.data.discPercent;
        if (type == "PricePolicyDetail") {
            var rowCount = $scope.grvPricePolicyDetail.dataView.getLength();
            if (id && id != undefined)
                $scope.grvPricePolicyDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', itemID: id, breakPoint: 1 });
            else
                $scope.grvPricePolicyDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', breakPoint: 1 });
        }
        else if (type == "PolicyStoreDetail") {
            var rowCount = $scope.grvPolicyStoreDetail.dataView.getLength();
            $scope.grvPolicyStoreDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', code: 'code', name: 'name', primaryStreet: 'primaryStreet' });
        }
    };

    $scope.deleteRow = function (type) {
        if (type == "PricePolicyDetail") {
            var currentData = $scope.grvPricePolicyDetail.getCurrentData();

            if (currentData) {
                if (currentData.slickRowState != 'new') {
                    $scope.grvPricePolicyDetail.dataView.bufferRemoveData.push(currentData);
                }

                $scope.grvPricePolicyDetail.dataView.deleteItem(currentData.id);
            }
        } else if (type == "PolicyStoreDetail") {
            var currentData = $scope.grvPolicyStoreDetail.getCurrentData();

            if (currentData) {
                if (currentData.slickRowState != 'new') {
                    $scope.grvPolicyStoreDetail.dataView.bufferRemoveData.push(currentData);
                }

                $scope.grvPricePolicyDetail.dataView.deleteItem(currentData.id);

            }

        }

    };

    $scope.loadItem = function () {
        $scope.postData("api/pos/Item/GetByPricePolicy", null, function (data) {
            $scope.listItem = data;
            $scope.setting.valuelist.listItem = data.map(function (item) {
                return {
                    id: item.id, text: item.sku, name: item.name, barcode: item.barcode,
                    unit: item.relatedUnitOfMeasure ? item.relatedUnitOfMeasure.name : null, group: item.relatedGroup ? item.relatedGroup.name : null,
                    sellPrice: item.sellPrice
                }
            });
            $scope.setting.valuelist.listItem.splice(0, 0, { id: 'header', disabled: true });

            $scope.grvPricePolicyDetail.setColumnDataSource('sku', $scope.setting.valuelist.listItem);

            $scope.grvPricePolicyDetail.setColumnEditorFormat('sku', function (state) {
                if (!state.id) return state.text;

                if (state.id == 'header') {
                    var $state = $('<div style="width:fit-content;display:flex;height:30px;border-bottom:1px solid #ddd">'
                        + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px;font-weight:600">' + 'Sku' + '</span>'
                        + '<span  class="txt_cut" style="width:250px;float:left;line-height:30px;font-weight:600">' + 'Name' + '</span>'
                        + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px;font-weight:600" >' + 'Unit' + '</span>'
                        + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px;font-weight:600" >' + 'SellPrice' + '</span>'
                        + '</div>');

                    return $state;
                }

                var $state = $('<div style="width:fit-content;display:flex;height:30px">'
                    + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px" >' + state.text + '</span>'
                    + '<span  class="txt_cut" style="width:250px;float:left;line-height:30px">' + state.name + '</span>'
                    + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px">' + state.unit + '</span>'
                    + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px">' + state.sellPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span>'
                    + '</div>');

                return $state;
            });

        });
    };

    $scope.loadStore = function () {
        $scope.postData("api/pos/store/get", null, function (data) {
            if (data)
                $scope.grvPolicyStoreDetail.setData(data);
        });
    };

    $scope.resizeGrid = function (type) {
        if (type == "grvPricePolicyDetail") {
            $timeout(function () {
                $scope.grvPricePolicyDetail.resizeCanvas();
            });
        } else if (type == "grvPolicyStoreDetail") {
            $timeout(function () {
                $scope.grvPolicyStoreDetail.resizeCanvas();
            });

        }
    };

    // checkAllItemImport
    $scope.checkAllStore = function () {
        var gridImportData = $scope.grvPolicyStoreDetail.dataView.getItems();
        if ($("#ckbAllStore").hasClass('bowtie-checkbox-empty')) {
            $("#ckbAllStore").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
            angular.forEach(gridImportData, function (item) {
                item.selectedStore = true;
            });
        }
        else {
            $("#ckbAllStore").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
            angular.forEach(gridImportData, function (item) {
                item.selectedStore = false;
            });
        }

        $scope.grvPolicyStoreDetail.setData(gridImportData);
    };

    // checkItemImport
    $scope.checkItemImport = function (item) {
        if (item.selectedStore) item.selectedStore = false;
        else item.selectedStore = true;
        var gridImportData = $scope.grvPolicyStoreDetail.dataView.getItems();
        if (gridImportData.length === gridImportData.filter(x => x.selectedStore === true).length)
            $("#ckbAllStore").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
        else
            $("#ckbAllStore").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');

        $scope.grvPolicyStoreDetail.dataView.updateItem(item.id, item);
    };

    $scope.save = function (status, released) {
        //không phải phát hành thì check giờ
        if (!released) {
            $scope.data.effFromTime = $("#effFromTime").val();
            $scope.data.effToTime = $("#effToTime").val();

            if ($scope.data.effFromTime == "" || $scope.data.effToTime == "") {
                showWarning($scope.translation.ERR_TIME_NULL);
                return;
            }
        }
        if ($scope.data.effToTime < $scope.data.effFromTime) {
            showError($scope.translation.ERR_TIME);
            return;
        }

        var gridImportData = $scope.grvPolicyStoreDetail.dataView.getItems();
        $scope.selectedStore = gridImportData.filter(x => x.selectedStore === true).map(x => x.id);


        var pricePolicyDetail = $scope.grvPricePolicyDetail.dataView.getItems().length;
        if (pricePolicyDetail == 0 || $scope.selectedStore.length == 0) {
            showError($scope.translation.ERR_DETAIL);
            return;
        }

        if (moment($scope.data.effToDate).isBefore($scope.data.effFromDate)) {
            showError($scope.translation.ERR_DATE);
            return;
        }



        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        $scope.grvPricePolicyDetail.getEditController().commitCurrentEdit();
        $scope.grvPolicyStoreDetail.getEditController().commitCurrentEdit();




        //var allItems = $scope.grvItemDetail.dataView.getItems().length;
        //if (allItems == 0) {
        //    showError($scope.translation.ERR_NO_ITEM);
        //    return;
        //}

        $scope.data.status = status;


        var newPromoBreakPoint = {};
        if ($scope.action == "copy") {
            $scope.action = "add";
            newPromoBreakPoint = $scope.grvPricePolicyDetail.dataView.getItems();
            var updatePromoBreakPoint = [];
            //var deletePromoBreakPoint = $scope.grvPricePolicyDetail.dataView.bufferRemoveData;
        }
        else {
            newPromoBreakPoint = $scope.grvPricePolicyDetail.dataView.getItems();
            var updatePromoBreakPoint = [];
        }



        $scope.data.storeId = $scope.selectedStore;

        if (released) {
            newPromoBreakPoint = $scope.defaultFirstData.dataPriceDetail;
        }


        var dataMaster = angular.copy($scope.data);
        var parameter = {
            detailsPrice: {
                'add': JSON.stringify(newPromoBreakPoint),
                //'update': JSON.stringify(updatePromoBreakPoint),
                //'delete': JSON.stringify(deletePromoBreakPoint)
            },
            //detailsPolicyStore: JSON.stringify($scope.selectedStore),           
            master: JSON.stringify(dataMaster),
            type: $scope.action
        }
        //xet
        if (!released) {
            if (newPromoBreakPoint.length == 0 || newPromoBreakPoint.length == undefined) {
                showError($scope.translation.ERR_DETAIL);
                return false;
            }
        }

        $scope.postData('api/pos/pricePolicy/save', parameter, function (data) {
            if ($scope.action == "add") {
                $scope.loadData($scope.totalPage);
            }
            else {
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
            if (data.status == '1') {
                showError($scope.translation.ERR_APPLY);
                return;
            }
            $scope.dataDelete = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postData("api/pos/pricePolicy/Delete", { data: $scope.dataDelete }, function (result) {
            if (!result) {
                $scope.loadData($scope.pageCurrent);
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    $scope.showDayInWeek = function () {
        if ($scope.defaultFirstData && $scope.defaultFirstData.dayInWeek)
            return $scope.defaultFirstData.dayInWeek.map(x => $scope.setting.valuelist.dayInWeek[parseInt(x)].text).join(', ');
        return null;
    }
    $scope.showDayInMonth = function () {
        if ($scope.defaultFirstData && $scope.defaultFirstData.dayInMonth)
            return $scope.defaultFirstData.dayInMonth.map(x => $scope.setting.valuelist.dayInMonth[parseInt(x - 1)].text).join(', ');
        return null;
    }

    $scope.showGroupCustomer = function () {
        if ($scope.defaultFirstData)
            return $scope.defaultFirstData.custGroup.map(x => x.name).join(', ');
        return null;
    }

    $scope.getRowCountGrid = function () {
        $scope.rowCountPromoBreakPoint = $scope.grvPricePolicy.dataView.getItems().length;
        $scope.rowCountPolicyStore = $scope.grvPolicyStore.dataView.getItems().length;
    }

    $scope.refresh = function () {
        $scope.loadData(1);
    };

    $scope.searchObject = function () {
        $scope.loadData();
    }
    $scope.prev = function (page) {
        if (page > 0)
            $scope.loadData(page);
    }

    $scope.next = function (page) {
        if (page <= $scope.totalPage)
            $scope.loadData(page);
    }
    $scope.changeDiscPercent = function () {
        if ($scope.data.discPercent == "" || $scope.data.discPercent == '') $scope.data.discPercent = 0;
        $scope.setting.discPercent = $scope.data.discPercent;

        $scope.setting.discAmount = 0;
        if ($scope.data.discPercent > 0) {
            $scope.data.discAmount = 0;

            var temp = $scope.grvPricePolicyDetail.dataView.getItems();
            if (temp) {
                $.each(temp, function (key, item) {
                    item.discPercent = $scope.data.discPercent;
                    item.discAmount = 0;
                    item.finalAmount = item.sellPrice * (100 - item.discPercent) / 100;
                });

                $scope.grvPricePolicyDetail.setData(temp);
            }
        }
        if ($scope.data.discPercent == 0 && $scope.data.discAmount == 0) {
            $scope.data.discAmount = 0;

            var temp = $scope.grvPricePolicyDetail.dataView.getItems();
            if (temp) {
                $.each(temp, function (key, item) {
                    item.discPercent = $scope.data.discPercent;
                    item.discAmount = 0;
                    item.finalAmount = item.sellPrice * (100 - item.discPercent) / 100;
                });

                $scope.grvPricePolicyDetail.setData(temp);
            }
        }



    };
    $scope.changeDiscAmount = function () {
        $scope.setting.discAmount = $scope.data.discAmount;
        $scope.setting.discPercent = 0;

        if ($scope.data.discAmount > 0) {
            $scope.data.discPercent = 0;

            var temp = $scope.grvPricePolicyDetail.dataView.getItems();
            if (temp) {
                $.each(temp, function (key, item) {
                    item.discPercent = 0;
                    item.discAmount = $scope.data.discAmount;
                    item.finalAmount = item.sellPrice - item.discAmount;
                });

                $scope.grvPricePolicyDetail.setData(temp);
            }
        }
        if ($scope.data.discAmount == 0 && $scope.data.discPercent == 0) {
            $scope.data.discPercent = 0;
            var temp = $scope.grvPricePolicyDetail.dataView.getItems();
            if (temp) {
                $.each(temp, function (key, item) {
                    item.discPercent = 0;
                    item.discAmount = $scope.data.discAmount;
                    item.finalAmount = item.sellPrice - item.discAmount;
                });

                $scope.grvPricePolicyDetail.setData(temp);
            }
        }


    };
    $scope.changeStatus = function () {
        var status = $scope.statusPolicy == '0' ? '1' : '0';
        $scope.data = $scope.defaultFirstData;
        $scope.action = 'edit';
        $scope.save(status, true);
    };

    $scope.resizeTab = function () {
        $timeout(function () {
            $('#tabBottom').height($('#modal-detail .modal-body').height() - $('#tabTop').height() - 155);
            $scope.grvPricePolicyDetail.resizeCanvas();
        });
    }

    $scope.dateTypeChange = function () {
        $scope.processDate($scope.dateTypeFilter);
    };
}]);