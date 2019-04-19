'use strict';
app.register.controller('promotionPolicyController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.selectedStore = [];
    $scope.dateFilter = {};

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    };

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
                //var array = ["1", "3", "4", "5"]
                //$scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => array.includes(x.id));
                $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark;
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

        if ($scope.defaultFirstData)
            $scope.statusPolicy = $scope.defaultFirstData.status;
    });

    $scope.initGrid = function () {
        if (!$scope.grvPromoBreakPoint) {
            initSlickGrid($scope, 'grvPromoBreakPoint');
            $scope.grvPromoBreakPoint.editAction = function (grid, item) { };
        }

        if (!$scope.grvPolicyStore) {
            initSlickGrid($scope, 'grvPolicyStore');
            $scope.grvPolicyStore.editAction = function (grid, item) { };
        }

        if (!$scope.grvPromoApply) {
            initSlickGrid($scope, 'grvPromoApply');
            $scope.grvPromoApply.editAction = function (grid, item) { };
        }
    }

    $scope.initGridDetail = function () {
        //Grid Detail
        $scope.dataParent = null;
        if (!$scope.grvPromoBreakPointDetail) {
            initSlickGrid($scope, 'grvPromoBreakPointDetail');
            $scope.grvPromoBreakPointDetail.dataView.bufferRemoveData = [];
            $scope.grvPromoBreakPointDetail.onClick.subscribe(function (e, args) {

            });
            $scope.grvPromoBreakPointDetail.onSelectedRowsChanged.subscribe(function (e, args) {
                $scope.dataParent = args.grid.getCurrentData();
                $scope.grvPromoItemDetail.setData($scope.dataParent.listItem);
            });
            $scope.grvPromoBreakPointDetail.editAction = function (grid, item) { };

            $scope.grvPromoBreakPointDetail.dataView.bufferRemoveData = [];
        }

        if (!$scope.grvPolicyStoreDetail) {
            initSlickGrid($scope, 'grvPolicyStoreDetail');

            $scope.grvPolicyStoreDetail.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("selectedStore")) {
                    var data = $scope.grvPolicyStoreDetail.dataView.getItem(args.row);
                    $scope.checkItemImport(data);
                };
            });

            $("#ckbAllStore").on("click", function (e) {
                $scope.checkAllStore();
            });

            $scope.grvPolicyStoreDetail.editAction = function (grid, item) { };

        }

        if (!$scope.grvPromoApplyDetail) {
            initSlickGrid($scope, 'grvPromoApplyDetail');

            $scope.grvPromoApplyDetail.onClick.subscribe(function (e, args) {

            });

            $scope.grvPromoApplyDetail.onCellChange.subscribe(function (e, args) {
                var column = args.grid.getColumns()[args.cell];
                var dataRow = args.item;
            });

            $scope.grvPromoApplyDetail.editAction = function (grid, item) { };

            $scope.grvPromoApplyDetail.dataView.bufferRemoveData = [];
        }


        if (!$scope.grvPromoItemDetail) {
            initSlickGrid($scope, 'grvPromoItemDetail');

            $scope.grvPromoItemDetail.setData($scope.promoBreakPoint);

            $scope.grvPromoItemDetail.onClick.subscribe(function (e, args) {

            });

            $scope.grvPromoItemDetail.onCellChange.subscribe(function (e, args) {
                var column = args.grid.getColumns()[args.cell];
                var dataRow = args.item;
            });

            $scope.grvPromoItemDetail.editAction = function (grid, item) { };

            $scope.grvPromoItemDetail.dataView.bufferRemoveData = [];
        }
    }

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;

        $scope.button.add = true;
        $scope.button.edit = true;
        $scope.button.delete = true;
        $scope.button.refresh = true;
        $scope.button.copy = true;
        $scope.button.setting = false;
    };

    $scope.cmbStoreId = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: promotionPolicyTranslation.STOREID,
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

        $scope.postData("api/pos/PromotionPolicy/get", params, function (object) {
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
        $scope.postData("api/pos/PromotionPolicy/GetDataDetail", { policyId: policyId }, function (data) {
            if (data) {
                if (data.dataPolicyStore) {
                    $scope.grvPolicyStore.setData(data.dataPolicyStore);
                }

                if (data.dataPromoBreakPoint) {
                    $scope.grvPromoBreakPoint.setData(data.dataPromoBreakPoint);
                }

                if (data.dataPromoApply) {
                    var dataMap = data.dataPromoApply.map(function (data) {
                        if (data.item) {
                            return {
                                id: data.id, groupId: data.item.relatedGroup ? data.item.relatedGroup.name : null, sku: data.item.sku, name: data.item.name, uom: data.item.relatedUnitOfMeasure ? data.item.relatedUnitOfMeasure.name : null, note: data.note
                            }
                        }
                        return null;
                    });

                    $scope.grvPromoApply.setData(dataMap);
                }
            }
            else {
                $scope.grvPolicyStore.setData([]);
                $scope.grvPromoBreakPoint.setData([]);
                $scope.grvPromoApply.setData([]);
            }
        });
    };

    $scope.loadGridDetail = function (policyId) {
        $scope.postData("api/pos/PromotionPolicy/GetDataDetail", { policyId: policyId }, function (data) {
            if (data) {
                if (data.dataPolicyStore) {
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
                if (data.dataPromoBreakPoint) {
                    $scope.grvPromoBreakPointDetail.setData(data.dataPromoBreakPoint);
                    $scope.grvPromoBreakPointDetail.selectedRow(0);
                }

                if (data.dataPromoApply) {
                    var dataMap = data.dataPromoApply.map(function (data) {
                        return {
                            id: data.id, itemId: data.item.id
                        }
                    });

                    $scope.grvPromoApplyDetail.setData(dataMap);
                }
            }
            else {
                $scope.grvPromoBreakPointDetail.setData([]);
                $scope.grvPromoApplyDetail.setData([]);
                $scope.grvPromoItemDetail.setData([]);
            }
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

    $scope.add = function () {
        $('#tab_01-tab').click();
        $('#tab_05-tab').click();
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
        $scope.data.sameItems = false;

        $scope.data.effFromDate = moment().format();
        $scope.data.effToDate = moment().format();

        var currentTime = moment().format("HH:mm");
        $("#effFromTime").val(currentTime);
        $("#effToTime").val(currentTime);


        callModal('modal-detail', false);
        $("#code").prop('disabled', true);
        $('#name').focus();

        $scope.loadItem();
        $scope.loadStore();

        $scope.loadGridDetail(null);

        $timeout(function () {
            $scope.grvPromoBreakPointDetail.resizeCanvas();
            $("#ckbAllStore").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
        }, 200);
    }

    $scope.copy = function () {
        $('#tab_01-tab').click();
        $('#tab_05-tab').click();
        var data = $scope.defaultFirstData;
        if (data == null) {
            showError($scope.translation.ERR_SELECT_DATA_COPY);
            return;
        }

        $scope.loadStore();
        $scope.loadItem();

        $scope.statusPolicy = data.status;
        $scope.action = 'copy';

        data.policyDate = moment().format();
        

        $scope.data = angular.copy(data);


        var effFromTime = moment($scope.data.effFromTime).format("HH:mm");
        $("#effFromTime").val(effFromTime);

        var effToTime = moment($scope.data.effToTime).format("HH:mm");
        $("#effToTime").val(effToTime);

        callModal('modal-detail', false);

        $("#code").prop('disabled', true);

        $('#name').focus();

        $scope.loadGridDetail($scope.data.id);
        $timeout(function () {
            $scope.grvPromoBreakPointDetail.resizeCanvas();
            $("#code").val(null);
        }, 200);
    };


    $scope.edit = function () {
        $('#tab_01-tab').click();
        $('#tab_05-tab').click();
        var data = $scope.defaultFirstData;
        if (data == null)
            showError($scope.translation.ERR_CHOOSE_STORE_EDIT);
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

            $("#code").prop('disabled', true);
            $('#objectType').focus();

            var effFromTime = moment($scope.data.effFromTime).format("HH:mm");
            $("#effFromTime").val(effFromTime);

            var effToTime = moment($scope.data.effToTime).format("HH:mm");
            $("#effToTime").val(effToTime);

            callModal('modal-detail', false);

            $scope.loadGridDetail($scope.data.id);
            $timeout(function () {
                $scope.grvPromoBreakPointDetail.resizeCanvas();
                //$scope.grvPromoApplyDetail.resizeCanvas();
            }, 200);
        };
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

    $scope.addRow = function (type) {
        if (type == "BreakPointDetail") {
            var rowCount = $scope.grvPromoBreakPointDetail.dataView.getLength();
            $scope.grvPromoBreakPointDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', breakPoint: 1, quantity: 1, note: '', listItem: [] });

            $scope.grvPromoBreakPointDetail.selectedRow("first");
        }
        else if (type == "PromoApplyDetail") {
            var rowCount = $scope.grvPromoApplyDetail.dataView.getLength();
            $scope.grvPromoApplyDetail.dataView.insertItem(0, { id: rowCount, slickRowState: 'new', note: '' });

        }
    };

    $scope.addRowPromoItem = function () {
        if ($scope.dataParent) {
            var rowCount = $scope.grvPromoItemDetail.dataView.getLength();
            $scope.grvPromoItemDetail.dataView.insertItem(0, { id: rowCount });
            if ($scope.dataParent.slickRowState != "new")
                $scope.dataParent.slickRowState = "update";
        }
    }

    $scope.deleteRowPromoItem = function () {
        if ($scope.dataParent) {
            var currentData = $scope.grvPromoItemDetail.getCurrentData();
            $scope.grvPromoItemDetail.dataView.deleteItem(currentData.id);
            if ($scope.dataParent.slickRowState != "new")
                $scope.dataParent.slickRowState = "update";
        }
    }

    $scope.deleteRow = function (type) {
        if (type == "BreakPointDetail") {
            var currentData = $scope.grvPromoBreakPointDetail.getCurrentData();

            if (currentData) {
                if (currentData.slickRowState != 'new') {
                    $scope.grvPromoBreakPointDetail.dataView.bufferRemoveData.push(currentData);
                }

                $scope.grvPromoBreakPointDetail.dataView.deleteItem(currentData.id);
            }
        }
        else if (type == "PromoApplyDetail") {
            var currentData = $scope.grvPromoApplyDetail.getCurrentData();
            if (currentData) {
                if (currentData.slickRowState != 'new') {
                    $scope.grvPromoApplyDetail.dataView.bufferRemoveData.push(currentData);
                }

                $scope.grvPromoApplyDetail.dataView.deleteItem(currentData.id);
            }
        }
    };

    $scope.loadItem = function () {
        $scope.postData("api/pos/Item/get", null, function (data) {
            $scope.listItem = data;
            $scope.setting.valuelist.listItem = data.map(function (item) {
                return {
                    id: item.id, text: item.sku, name: item.name, barcode: item.barcode,
                    unit: item.relatedUnitOfMeasure ? item.relatedUnitOfMeasure.name : null, group: item.relatedGroup ? item.relatedGroup.name : null
                }
            });
            $scope.setting.valuelist.listItem.splice(0, 0, { id: 'header', disabled: true });
            $scope.grvPromoApplyDetail.setColumnDataSource('sku', $scope.setting.valuelist.listItem);

            $scope.grvPromoApplyDetail.setColumnEditorFormat('sku', function (state) {
                if (!state.id) return state.text;

                if (state.id == 'header') {
                    var $state = $('<div style="width:fit-content;display:flex;height:30px;border-bottom:1px solid #ddd">'
                        + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px;font-weight:600">' + 'Sku' + '</span>'
                        + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px;font-weight:600" >' + 'Barcode' + '</span>'
                        + '<span  class="txt_cut" style="width:400px;float:left;line-height:30px;font-weight:600">' + 'Name' + '</span></div>');

                    return $state;
                }

                var $state = $('<div style="width:fit-content;display:flex;height:30px">'
                    + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px" >' + state.text + '</span>'
                    + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px">' + state.barcode + '</span>'
                    + '<span  class="txt_cut" style="width:400px;float:left;line-height:30px">' + state.name + '</span></div>');

                return $state;
            });

            $scope.grvPromoItemDetail.setColumnDataSource('sku', $scope.setting.valuelist.listItem);

            $scope.grvPromoItemDetail.setColumnEditorFormat('sku', function (state) {
                if (!state.id) return state.text;
                if (state.id == 'header') {
                    var $state = $('<div style="width:fit-content;display:flex;height:30px;border-bottom:1px solid #ddd">'
                        + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px;font-weight:600">' + 'Sku' + '</span>'
                        + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px;font-weight:600" >' + 'Barcode' + '</span>'
                        + '<span  class="txt_cut" style="width:400px;float:left;line-height:30px;font-weight:600">' + 'Name' + '</span></div>');

                    return $state;
                }

                var $state = $('<div style="width:fit-content;display:flex;height:30px">'
                    + '<span  class="txt_cut" style="width:150px;float:left;line-height:30px" >' + state.text + '</span>'
                    + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px">' + state.barcode + '</span>'
                    + '<span  class="txt_cut" style="width:400px;float:left;line-height:30px">' + state.name + '</span></div>');

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
        if (type == "grvPromoBreakPointDetail") {
            $timeout(function () {
                $scope.grvPromoBreakPointDetail.resizeCanvas();
            });
        } else if (type == "grvPolicyStoreDetail") {
            $timeout(function () {
                $scope.grvPolicyStoreDetail.resizeCanvas();
            });

        } else if (type == "grvPromoApplyDetail") {
            $timeout(function () {
                $scope.grvPromoApplyDetail.resizeCanvas();
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

    $scope.save = function (status) {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        $scope.grvPromoBreakPointDetail.getEditController().commitCurrentEdit();
        $scope.grvPolicyStoreDetail.getEditController().commitCurrentEdit();
        $scope.grvPromoApplyDetail.getEditController().commitCurrentEdit();


        var gridImportData = $scope.grvPolicyStoreDetail.dataView.getItems();
        $scope.selectedStore = gridImportData.filter(x => x.selectedStore === true).map(x => x.id);

        var promoBreakPoint = $scope.grvPromoBreakPointDetail.dataView.getItems().length;
        var promoApplyDetail = $scope.grvPromoApplyDetail.dataView.getItems().length;

        var dataPromoApplyDetail = $scope.grvPromoApplyDetail.dataView.getItems();

        var flag = false;
        $.each(dataPromoApplyDetail, function (index, item) {
            if (!item.itemId)
                flag = true;            
        });


        if (promoBreakPoint == 0 || promoApplyDetail == 0 || $scope.selectedStore.length == 0 || flag==true) {
            showError($scope.translation.ERR_DETAIL);
            return;
        }

        $scope.data.status = status;

        $scope.data.effFromTime = $("#effFromTime").val();
        $scope.data.effToTime = $("#effToTime").val();

        if ($scope.data.effFromTime == "" || $scope.data.effToTime == "") {
            showWarning($scope.translation.ERR_TIME_NULL);
            return;
        }

        if ($scope.data.effToDate < $scope.data.effFromDate) {
            showError($scope.translation.ERR_DATE);
            return;
        }

        if ($scope.data.effToTime < $scope.data.effFromTime) {
            showError($scope.translation.ERR_TIME);
            return;
        }

        if ($scope.action == "copy") {
            $scope.action = "add";
            var newPromoBreakPoint = $scope.grvPromoBreakPointDetail.dataView.getItems();
            var updatePromoBreakPoint = [];
            var deletePromoBreakPoint = $scope.grvPromoBreakPointDetail.dataView.bufferRemoveData;

            var newPromoApply = $scope.grvPromoApplyDetail.dataView.getItems();
            var updatePromoApply = [];
            var deletePromoApply = $scope.grvPromoApplyDetail.dataView.bufferRemoveData;
        }
        else {
            var newPromoBreakPoint = $scope.grvPromoBreakPointDetail.dataView.getItems().filter(x => x.slickRowState == 'new');
            var updatePromoBreakPoint = $scope.grvPromoBreakPointDetail.dataView.getItems().filter(x => x.slickRowState == 'update');
            var deletePromoBreakPoint = $scope.grvPromoBreakPointDetail.dataView.bufferRemoveData;

            var newPromoApply = $scope.grvPromoApplyDetail.dataView.getItems().filter(x => x.slickRowState == 'new');
            var updatePromoApply = $scope.grvPromoApplyDetail.dataView.getItems().filter(x => x.slickRowState == 'update');
            var deletePromoApply = $scope.grvPromoApplyDetail.dataView.bufferRemoveData;

        }

        $scope.data.storeId = $scope.selectedStore;

        var dataMaster = angular.copy($scope.data);


        var parameter = {
            detailsPromoBreakPoint: {
                'add': JSON.stringify(newPromoBreakPoint),
                'update': JSON.stringify(updatePromoBreakPoint),
                'delete': JSON.stringify(deletePromoBreakPoint)
            },
            detailsPromoApply: {
                'add': JSON.stringify(newPromoApply),
                'update': JSON.stringify(updatePromoApply),
                'delete': JSON.stringify(deletePromoApply),
            },
            master: JSON.stringify(dataMaster),
            type: $scope.action
        }


        $scope.postData('api/pos/PromotionPolicy/save', parameter, function (data) {
            if ($scope.action == "add") {
                $scope.loadData($scope.totalPage);
                $scope.loadGridDetail(null);
            }
            else {
                $scope.loadData($scope.pageCurrent);
            }

            $('#modal-detail').modal('hide');

            $timeout(function () {
                $("#" + data.id).click();
                $scope.statusPolicy = data.status;
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
        $scope.postData("api/pos/promotionPolicy/Delete", { data: $scope.dataDelete }, function (result) {
            if (!result) {
                $scope.loadData($scope.pageCurrent);
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    $scope.showDayInWeek = function () {
        if ($scope.defaultFirstData && $scope.defaultFirstData.dayInWeek) {
            if ($scope.defaultFirstData.dayInWeek[0] == null)
                return null;
            return $scope.defaultFirstData.dayInWeek.map(x => $scope.setting.valuelist.dayInWeek[parseInt(x)].text).join(', ');
        }          
        return null;
    }

    $scope.showGroupCustomer = function () {
        if ($scope.defaultFirstData && $scope.defaultFirstData.custGroup && $scope.defaultFirstData.custType == '2')
            return $scope.defaultFirstData.custGroup.map(x => x.name).join(', ');
        return null;
    }

    $scope.getRowCountGrid = function () {
        $scope.rowCountPromoBreakPoint = $scope.grvPromoBreakPoint.dataView.getItems().length;
        $scope.rowCountPromoApply = $scope.grvPromoApply.dataView.getItems().length;
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

    $scope.changeStatus = function () {
        var status = $scope.statusPolicy == '0' ? '1' : '0';
        $scope.data = $scope.defaultFirstData;
        if (!$scope.data)
            return;
        $scope.data.status = status;

        $scope.postData("api/pos/promotionPolicy/UpdateStatus", { data: $scope.data }, function (result) {
            if (result) {
                $timeout(function () {
                    $("#" + result.id).click();
                    $scope.statusPolicy = result.status;
                });
            }
        });
    };

    $scope.changePromoType = function () {
        if ($scope.data.promoType == "2") {
            $('#tab_05-tab').hide();
            $('#tab_04-tab').click();
            $scope.data.sameItems = false;
        }
        else {
            $('#tab_05-tab').show();
            $('#tab_05-tab').click();
        }
    }

    $scope.changeSameItems = function (data) {
        if ($scope.data.promoType == "2")
            return;
        $scope.data.sameItems = !data;
    };


}]);