'use strict';
app.register.controller('cashReceiptController', ['$scope', '$timeout', function ($scope, $timeout) {

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
                $scope.setting.valuelist.dateTypeFilter = $scope.setting.valuelist.dashboardTimeMark;//.filter(x => x.id == "1" || x.id == "3" || x.id == "4" || x.id == "5");
            },
        });
        //$scope.setting.valuelist.dateTypeFilter = [{ id: 0, text: 'Ngày' }, { id: 1, text: 'Tháng' }, { id: 2, text: 'Quý' }, { id: 3, text: 'Năm' }];
        $scope.dateTypeFilter = 0;

        $scope.loadDataRoot(1);
        if ($scope.grid) {
            $scope.loadStore();
            $scope.getListCashierId();
            $scope.loadData($scope.dataChoose);
        }
        if (!$scope.grvCashReceiptDetail) {
            initSlickGrid($scope, 'grvCashReceiptDetail');

            if ($scope.listCashReceiptDetail == null)
                $scope.listCashReceiptDetail = [];

            $scope.grvCashReceiptDetail.onCellChange.subscribe(function (e, args) {
                var column = args.grid.getColumns()[args.cell];
                var dataRow = args.item;

                var thisItem = $scope.setting.valuelist.listReason.find(x => x.id == dataRow.cashReasonId);
                args.grid.invalidate();
            });

            $scope.grvCashReceiptDetail.onKeyDown.subscribe(function (e) {
                if (e.which == 13) {
                    $scope.addRow();
                }
            });

            if ($scope.data)
                $scope.loadCashReceiptDetail($scope.data.id);
        }

        $scope.loadReason();

        $scope.refresh = function () {
            $scope.loadData($scope.dataChoose);
            $scope.loadDataRoot(1);
        };

        $scope.search = function (e, type, click) {
            if (click != 1)
                if (e != null && e.keyCode != 13) return;

            $scope.searchValue = $("#full_text_filter").val();

            $scope.loadDataRoot(1, false, $scope.searchValue);
        };

        $(window).resize(function () {
            var width = $("#cashReceipt .white_box").width();
            var height = $("#cashReceipt .white_box").height();
            var box_control = $("#cashReceipt .box_filter").height();

            if ($("#cashReceipt .box_filter").is(":visible")) {
                $('#cashReceipt .content_4 dd').height(height - 45 - box_control);
                $('#cashReceipt .content_6 .wrapper dd').height(height - 200 - box_control);
            }
            else {
                $('#cashReceipt .content_4 dd').height(height - 30);
                $('#cashReceipt .content_6 .wrapper dd').height(height - 180);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();


        $timeout(function () {
            $("#pageInput").keypress(function (e) {
                if (e != null && e.keyCode != 13) return;
                var page = parseInt($("#pageInput").val());
                if (page > 0 && page <= $scope.dataRoot.totalPage) {
                    $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.fromDate, $scope.toDate);
                }
            });


        });
    });
    $scope.getListCashierId = function (search) {
        $scope.postData("api/pos/employee/getList", null, function (data) {
            $scope.setting.valuelist.cashierId = data;
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
        placeholder: cashReceiptTranslation.STOREID,
    };
    //$scope.cmbStoreId = {
    //    url: "api/pos/store/GetListComboxbox",
    //    allowClear: true,
    //};

    //function
    $scope.loadDataRoot = function (page, pageEnd, searchValue, storeFilter, dateFrom, dateTo) {
        $scope.postData("api/pos/CashReceipt/Get", { searchValue: searchValue, pageCurrent: page, pageEnd: pageEnd, storeFilter: storeFilter, dateFrom: dateFrom, dateTo: dateTo }, function (data) {
            $scope.dataRootRoot = data;
            $scope.dataRoot = data;
            if (data.data.length > 0) {
                $scope.dataChoose = data.data[0];
                if ($scope.action == 'add')
                    $scope.dataChoose = data.data[data.data.length - 1];
                $scope.dataChoose.tempCashType = $scope.setting.valuelist.cashType.find(x => x.id == $scope.dataChoose.cashType).text;

                $scope.dataRoot.pageCurrent = data.pageCurrent;
            }
            else {
                $scope.dataChoose = {};
            }
            $scope.loadData($scope.dataChoose);

            if (!$scope.$$phase)
                $scope.$apply();
        });
    };

    $scope.loadData = function (dataChoose) {        
        $scope.postData("api/pos/CashReceiptDetail/GetById", { id: dataChoose.id }, function (data) {
            $scope.grid.setData(data);

            $scope.grid.resizeCanvas();
        });
    }
    $scope.loadCashReceiptDetail = function (id) {
        $scope.postData("api/pos/CashReceiptDetail/GetById", { id: id }, function (data) {
            $scope.listCashReceiptDetail = data;
            $scope.grvCashReceiptDetail.setData($scope.listCashReceiptDetail);
            $scope.grvCashReceiptDetail.resizeCanvas();
        });
    };

    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/GetList", null, function (data) {
            $scope.setting.valuelist.storeId = data;
        });
    }
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.loadCashReceiptDetail(null);
        $scope.data.docDate = new Date();
        $scope.data.cashType = 'TM';
        $scope.data.cashierId = "";
        $scope.data.storeId = "";
        $scope.defaultData = $.extend(true, {}, $scope.data);
        $scope.changeCashType('TM');
        $scope.dateTypeFilter = 0;

        callModal('modal-detail');
        $('#objectName').focus();
        $("#code").prop('disabled', true);
    }

    $scope.edit = function () {
        if ($scope.data == null)
            showError(cashReceiptTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.loadCashReceiptDetail($scope.data.id);


            $scope.data = $.extend(true, {}, $scope.dataChoose);
            callModal('modal-detail');
            $('#objectName').focus();
            $("#code").prop('disabled', true);

            $scope.changeCashType($scope.data.cashType);
            $timeout($scope.grvCashReceiptDetail.resizeCanvas());
        };
    };
    $scope.setupEdit = function (item) {
        if (item == null)
            showError(cashReceiptTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.data = $.extend(true, {}, item);
        }
        $scope.edit();
    };

    $scope.copy = function () {
        if ($scope.grid != null) {
            var data = $scope.dataChoose;
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }
            $scope.loadCashReceiptDetail($scope.dataChoose.id);

            $scope.action = 'add';
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            $scope.data.code = null;
            $scope.changeCashType($scope.data.cashType);

            callModal('modal-detail');
            $('#objectName').focus();
            $("#code").prop('disabled', true);
            $timeout($scope.grvCashReceiptDetail.resizeCanvas());
        }
    };

    $scope.save = function (flag) {
        Slick.GlobalEditorLock.commitCurrentEdit();

        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        var allItems = $scope.grvCashReceiptDetail.dataView.getItems().length;
        if (allItems == 0) {
            showError($scope.translation.ERR_NO_ITEM);
            return;
        }
        //validate name     
        if ($scope.listCashReceiptDetail.find(x => x.cashReason == '')) {
            showError($scope.translation.ERR_NO_ITEM);
            return;
        }
        if ($scope.action == 'add') {
            $scope.postData("api/pos/cashReceipt/Add", { data: $scope.data, dataDetails: $scope.listCashReceiptDetail }, function (data) {
                //$scope.dataRoot.insert(0, data);
                $scope.loadDataRoot($scope.dataRoot.pageCurrent, true);
                if (flag == 1)
                    $scope.add();
                else
                    $('#modal-detail').modal('hide');
            });

        }
        else {
            $scope.postData("api/pos/cashReceipt/Update", { data: $scope.data, dataDetails: $scope.listCashReceiptDetail }, function (data) {
                $('#modal-detail').modal('hide');
                //$scope.loadDataRoot();
                var indexTemp = $scope.dataRoot.data.findIndex(x => x.id == data.id);
                $scope.dataRoot.data[indexTemp] = data;
                $scope.chooseCashReceipt(data);
            });

        }
    };

    $scope.delete = function () {
        if ($scope.data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postNoAsync("api/pos/cashReceipt/remove", JSON.stringify($scope.dataChoose), function (lstDelete) {
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
            $scope.postData("api/pos/cashReceipt/update", { data: JSON.stringify(item) }, function (data) {
                $scope.grid.dataView.updateItem(item.id, item);
                $scope.grid.invalidate();
            });

        }

    };


    $scope.changeCashType = function (value) {
        $('#radioCashType input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioCashType input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.cashType = value;
    };
    //add new Step
    $scope.addRow = function () {
        Slick.GlobalEditorLock.commitCurrentEdit();
        var vllIndex = $scope.grvCashReceiptDetail.dataView.getLength();

        if (!$scope.listCashReceiptDetail)
            $scope.listCashReceiptDetail = [];

        if ($scope.listCashReceiptDetail.length > 0 && $scope.listCashReceiptDetail[$scope.listCashReceiptDetail.length - 1].cashReason == '')
            return false;

        var temp = { id: vllIndex, cashReason: '', debitAmount: '', docId: '' };
        $scope.listCashReceiptDetail.push(temp);

        $scope.grvCashReceiptDetail.setData([]);
        $scope.grvCashReceiptDetail.setData($scope.listCashReceiptDetail);

        //focus fisrt cell
        $scope.grvCashReceiptDetail.setActiveCell(vllIndex, 0);
        //$scope.grvCashReceiptDetail.editActiveCell(Slick.Editors.Text);
    };

    //remove Step
    $scope.removeRow = function () {
        var currentData = $scope.grvCashReceiptDetail.getCurrentData();

        if (currentData) {
            $scope.grvCashReceiptDetail.dataView.deleteItem(currentData.id);
        }

        //$scope.$applyAsync(function () {
        //    var selectedItem = $scope.grvCashReceiptDetail.getDataItem($scope.grvCashReceiptDetail.getSelectedRows([0]));
        //    var vllIndex = selectedItem == null ? 0 : selectedItem.id;

        //    $scope.listCashReceiptDetail.splice(vllIndex, 1);


        //    $.each($scope.listCashReceiptDetail, function (index, val) {
        //        val.id = index;
        //    });

        //    $scope.grvCashReceiptDetail.setData([]);
        //    $scope.grvCashReceiptDetail.setData($scope.listCashReceiptDetail);
        //});
    };

    $scope.chooseCashReceipt = function (item) {
        debugger
        $('.itemCashReceipt').removeClass('active');
        $("#" + item.id).addClass("active");
        $scope.dataChoose = item;
        if ($scope.dataChoose.cashType)
            $scope.dataChoose.tempCashType = $scope.setting.valuelist.cashType.find(x => x.id == $scope.dataChoose.cashType).text;
        $scope.loadData($scope.dataChoose);
    };
    $scope.sum = function (items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    };

    $scope.prev = function (page) {
        if (page > 0)
            $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.fromDate, $scope.toDate);
    }
    $scope.next = function (page) {
        if (page <= $scope.dataRoot.totalPage)
            $scope.loadDataRoot(page, false, $scope.searchValue, $scope.storeFilter, $scope.fromDate, $scope.toDate);
    }
    $scope.searchObject = function () {
        $scope.loadDataRoot(1, false, '', $scope.storeFilter, $scope.fromDate, $scope.toDate);
    }
    $scope.loadReason = function () {
        $scope.postData("api/pos/cashReason/GetReason?type=CR", null, function (data) {
            //$scope.listItem = data;
            $scope.setting.valuelist.listReason = data.map(function (item) {
                return { id: item.id, text: item.name, code: item.code }
            });
            $scope.setting.valuelist.listReason.splice(0, 0, { id: 'header', disabled: true });
            $scope.grvCashReceiptDetail.setColumnDataSource('cashReasonId', $scope.setting.valuelist.listReason);

            //$scope.grvCashReceiptDetail.setColumnEditorFormat('cashReasonId', function (state) {
            //    if (!state.id) return state.text;

            //    if (state.id == 'header') {
            //        var $state = $('<div style="width:fit-content;display:flex;height:30px;border-bottom:1px solid #ddd">'
            //            + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px;font-weight:600" >' + $scope.translation.CASHREASONID + '</span> </div>');

            //        return $state;
            //    }

            //    var $state = $('<div style="width:fit-content;display:flex;height:30px">'
            //        + '<span  class="txt_cut" style="width:200px;float:left;line-height:30px">' + state.text + '</span></div>');

            //    return $state;
            //});
        });
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


    $scope.dateTypeChange = function () {
        $scope.processDate($scope.dateTypeFilter);
    };
}]);