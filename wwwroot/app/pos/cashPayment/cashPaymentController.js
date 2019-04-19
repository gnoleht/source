'use strict';
app.register.controller('cashPaymentController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.dataFilter = {};

    $scope.dataRootRoot = null;
    $scope.dataChoose = null;
    $scope.dataVendor = null;
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
        $scope.dateTypeFilter = 0;

        $scope.loadDataRoot(1);
        if ($scope.grid) {
            $scope.loadStore();
            $scope.getListCashierId();
            $scope.loadData();
            //load vendor chỉ xài trong modal
            $scope.getListVendorId();
        }

        if (!$scope.grvCashPaymentDetail) {
            initSlickGrid($scope, 'grvCashPaymentDetail');

            if ($scope.listCashPaymentDetail == null)
                $scope.listCashPaymentDetail = [];

            $scope.grvCashPaymentDetail.onCellChange.subscribe(function (e, args) {
                var column = args.grid.getColumns()[args.cell];
                var dataRow = args.item;

                var thisItem = $scope.setting.valuelist.listReason.find(x => x.id == dataRow.cashReasonId);
                //if (column.id == 'cashReasonId') {

                //    dataRow.quantity = thisItem.sum;
                //    dataRow.actualQuantity = dataRow.quantity;

                //    dataRow.difference = dataRow.quantity - dataRow.actualQuantity;

                //    dataRow.differeceAmount = (-1) * dataRow.difference * thisItem.cogs;

                //}
                args.grid.invalidate();
            });

            $scope.grvCashPaymentDetail.onKeyDown.subscribe(function (e) {
                if (e.which == 13) {
                    $scope.addRow();
                }
            });

            if ($scope.data)
                $scope.loadCashPaymentDetail($scope.data.id);
        }

        $scope.loadReason();

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
            var width = $("#cashPayment .white_box").width();
            var height = $("#cashPayment .white_box").height();
            var box_control = $("#cashPayment .box_filter").height();

            if ($("#cashPayment .box_filter").is(":visible")) {
                $('#cashPayment .content_4 dd').height(height - 45 - box_control);
                $('#cashPayment .content_6 .wrapper dd').height(height - 200 - box_control);
            }
            else {
                $('#cashPayment .content_4 dd').height(height - 30);
                $('#cashPayment .content_6 .wrapper dd').height(height - 180);
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
    $scope.getListVendorId = function () {
        $scope.postData("api/pos/vendor/getList", null, function (data) {
            $scope.setting.valuelist.vendorId = data;
        });

    };
    //cmbVendorId
    $scope.cmbVendorId = {
        url: "api/pos/vendor/GetListComboxboxOther",
        allowClear: true,
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
        placeholder: cashPaymentTranslation.STOREID,
    };
    //$scope.cmbStoreId = {
    //    url: "api/pos/store/GetListComboxbox",
    //    allowClear: true,
    //};

    //function
    $scope.loadDataRoot = function (page, pageEnd, searchValue, storeFilter, dateFrom, dateTo) {
        $scope.postData("api/pos/CashPayment/Get", { searchValue: searchValue, pageCurrent: page, pageEnd: pageEnd, storeFilter: storeFilter, dateFrom: dateFrom, dateTo: dateTo }, function (data) {
            $scope.dataRoot = data;
            $scope.dataRootRoot = data;
            if (data.data.length > 0) {
                $scope.data = data.data[0];
                if ($scope.action == 'add') {
                    $scope.data = data.data[data.data.length - 1];
                    $scope.chooseCashPayment($scope.data);
                }
            }
            else {
                $scope.data = {};
            }
            $scope.chooseCashPayment($scope.data);
            if (!$scope.$$phase)
                $scope.$apply();
        });
    };

    $scope.loadData = function () {
        $scope.postData("api/pos/CashPaymentDetail/GetById", { id: $scope.data.id }, function (data) {
            $scope.grid.setData(data);
            //$scope.loadReason();
        });
    }
    $scope.loadCashPaymentDetail = function (id) {
        $scope.postData("api/pos/CashPaymentDetail/GetById", { id: id }, function (data) {
            $scope.listCashPaymentDetail = data;
            $scope.grvCashPaymentDetail.setData($scope.listCashPaymentDetail);
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
        $scope.loadCashPaymentDetail(null);
        $scope.data.docDate = new Date();
        $scope.changeCashType('TM');
        $scope.changePaymentType('1');
        $scope.vendorName = '';
        //$scope.data.cashType = 'TM';
        //$scope.data.paymentType = '1';
        $scope.defaultData = $.extend(true, {}, $scope.data);

        $scope.dateTypeFilter = 0;

        callModal('modal-detail');
        $('#cmbVendorId').focus();
        $("#code").prop('disabled', true);
        //$("#vendorId").prop('disabled', true);
        $scope.loadReason();

        $('#cmbVendorId').prop("disabled", false);
    }

    $scope.edit = function () {
        if ($scope.data == null)
            showError(cashPaymentTranslation["ERR_UPDATE_NULL"]);
        else {
            $scope.action = 'edit';
            $scope.loadCashPaymentDetail($scope.data.id);

            $scope.changeCashType($scope.data.cashType);
            $scope.changePaymentType($scope.data.paymentType);
            $scope.vendorChange();
            callModal('modal-detail');
            $('#objectName').focus();
            $("#code").prop('disabled', true);
            if ($scope.data.paymentType == '2')
                $('#cmbVendorId').prop("disabled", true);
            else
                $('#cmbVendorId').prop("disabled", false);

            $scope.loadReason();

            $timeout($scope.grvCashPaymentDetail.resizeCanvas());

        };
    };
    $scope.setupEdit = function (item) {
        if (item == null)
            showError(cashPaymentTranslation["ERR_UPDATE_NULL"]);
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
            $scope.loadCashPaymentDetail($scope.data.id);

            $scope.action = 'add';
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            $scope.data.code = null;
            $scope.changeCashType($scope.data.cashType);
            $scope.changePaymentType($scope.data.paymentType);
            $scope.vendorChange();
            callModal('modal-detail');
            $('#objectName').focus();
            $("#code").prop('disabled', true);
            if ($scope.data.paymentType == '2')
                $('#cmbVendorId').prop("disabled", true);
            else
                $('#cmbVendorId').prop("disabled", false);

            $scope.loadReason();

            $timeout($scope.grvCashPaymentDetail.resizeCanvas());
        }
    };

    $scope.save = function (flag) {
        Slick.GlobalEditorLock.commitCurrentEdit();
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        var allItems = $scope.grvCashPaymentDetail.dataView.getItems().length;
        if (allItems == 0) {
            showError($scope.translation.ERR_NO_ITEM);
            return;
        }

        if ($scope.action == 'add') {
            $scope.postData("api/pos/cashPayment/Add", { data: $scope.data, dataDetails: $scope.listCashPaymentDetail }, function (data) {
                $scope.loadDataRoot($scope.dataRoot.pageCurrent, true);
                if (flag == 1)
                    $scope.add();
                else
                    $('#modal-detail').modal('hide');
            });

        }
        else {
            $scope.postData("api/pos/cashPayment/Update", { data: $scope.data, dataDetails: $scope.listCashPaymentDetail }, function (data) {
                $('#modal-detail').modal('hide');
                //$scope.loadDataRoot();
                var indexTemp = $scope.dataRoot.data.findIndex(x => x.id == data.id);
                $scope.dataRoot.data[indexTemp] = data;
                $scope.chooseCashPayment(data);
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
        $scope.postNoAsync("api/pos/cashPayment/remove", JSON.stringify($scope.dataChoose), function (lstDelete) {
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
            $scope.postData("api/pos/cashPayment/update", { data: JSON.stringify(item) }, function (data) {
                $scope.grid.dataView.updateItem(item.id, item);
                $scope.grid.invalidate();
            });

        }

    };
    //add new Step
    $scope.addRow = function () {
        Slick.GlobalEditorLock.commitCurrentEdit();
        var vllIndex = $scope.grvCashPaymentDetail.dataView.getLength();

        if (!$scope.listCashPaymentDetail)
            $scope.listCashPaymentDetail = [];

        if ($scope.listCashPaymentDetail.length > 0 && $scope.listCashPaymentDetail[$scope.listCashPaymentDetail.length - 1].cashReason == '')
            return false;

        var temp = { id: vllIndex, cashReason: '', creditAmount: '', docId: '' };
        $scope.listCashPaymentDetail.push(temp);

        $scope.grvCashPaymentDetail.setData([]);
        $scope.grvCashPaymentDetail.setData($scope.listCashPaymentDetail);

        //focus fisrt cell
        $scope.grvCashPaymentDetail.setActiveCell(vllIndex, 0);
        //$scope.grvCashPaymentDetail.editActiveCell(Slick.Editors.Text);
    };

    //remove Step
    $scope.removeRow = function () {
        var currentData = $scope.grvCashPaymentDetail.getCurrentData();

        if (currentData) {
            $scope.grvCashPaymentDetail.dataView.deleteItem(currentData.id);
        }

        //$scope.$applyAsync(function () {
        //    var selectedItem = $scope.grvCashPaymentDetail.getDataItem($scope.grvCashPaymentDetail.getSelectedRows([0]));
        //    var vllIndex = selectedItem == null ? 0 : selectedItem.id;

        //    $scope.listCashPaymentDetail.splice(vllIndex, 1);


        //    $.each($scope.listCashPaymentDetail, function (index, val) {
        //        val.id = index;
        //    });

        //    $scope.grvCashPaymentDetail.setData([]);
        //    $scope.grvCashPaymentDetail.setData($scope.listCashPaymentDetail);
        //});
    };

    $scope.chooseCashPayment = function (item) {
        $('.itemCashPayment').removeClass('active');
        $("#" + item.id).addClass("active");
        $scope.data = item;
        $scope.dataChoose = item;
        if ($scope.dataChoose.cashType)
            $scope.dataChoose.tempCashType = $scope.setting.valuelist.cashType.find(x => x.id == $scope.dataChoose.cashType).text;
        $scope.loadData();
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

    $scope.vendorChange = function () {
        //alert($scope.data.vendorId);
        var tempVendor = $scope.setting.valuelist.vendorId.find(x => x.id == $scope.data.vendorId);
        if (tempVendor) {
            $scope.vendorName = tempVendor.text;
        }
        else {
            $scope.vendorName = '';
        }
        if (!$scope.$$phase) {
            $scope.$digest();
        }
    }
    $scope.changeCashType = function (value) {
        $('#radioCashType input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioCashType input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.cashType = value;
    };
    $scope.changePaymentType = function (value) {
        $('#radioPaymentType input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioPaymentType input[value="' + value + '"]').attr('checked', 'checked');

        $scope.data.paymentType = value;
        if ($scope.data.paymentType == '2')
            $('#cmbVendorId').prop("disabled", true);
        else
            $('#cmbVendorId').prop("disabled", false);
    };
    $scope.loadReason = function () {
        $scope.postData("api/pos/cashReason/GetReason?type=CP", null, function (data) {
            //$scope.listItem = data;
            $scope.setting.valuelist.listReason = data.map(function (item) {
                return { id: item.id, text: item.name, code: item.code }
            });
            $scope.setting.valuelist.listReason.splice(0, 0, { id: 'header', disabled: true });
            $scope.grvCashPaymentDetail.setColumnDataSource('cashReasonId', $scope.setting.valuelist.listReason);

            //$scope.grvCashPaymentDetail.setColumnEditorFormat('cashReasonId', function (state) {
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

    $scope.changeKind = function (value) {
        $('input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioKind input[value="' + value + '"]').attr('checked', 'checked');

        $scope.dataVendor.kind = value;
    };

    $scope.addVendor = function () {
        if ($scope.data.paymentType == '2')
            return;
        $scope.action = 'addVendor';
        $scope.dataVendor = {};
        $scope.dataVendor.kind = 1;
        callModal('modal-vendor');
        $('#name').focus();
    }

    $scope.saveVendor = function (flag) {
        $scope.frmFile = new FormData();

        Slick.GlobalEditorLock.commitCurrentEdit();

        $scope.frmFile.append("data", JSON.stringify($scope.dataVendor));

        $scope.postFile("api/pos/vendor/Add", $scope.frmFile, function (data) {
            $('#modal-vendor').modal('hide');

        });      
    };
}]);