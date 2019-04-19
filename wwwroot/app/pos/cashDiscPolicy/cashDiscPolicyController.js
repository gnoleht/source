'use strict';
app.register.controller('cashDiscPolicyController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.selectedStore = [];

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

        $scope.postData("api/pos/BankCardType/GetListComboxbox", null, function (data) {
            if (data) {
                $scope.listBankCardType = data;
            }
        });  

        $scope.loadData(1);     
    });

    $scope.cmdBankCardTypeId = {
        url: "api/pos/BankCardType/GetListComboxbox",
        allowClear: true,
        placeholder: cashDiscPolicyTranslation.BANKCARDTYPEID,
    };

    $scope.initGrid = function () {
        if (!$scope.grvPolicyStore) {
            initSlickGrid($scope, 'grvPolicyStore');
            $scope.grvPolicyStore.editAction = function (grid, item) { };
        }
    }

    $scope.initGridDetail = function () {
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
        placeholder: cashDiscPolicyTranslation.STOREID,
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

        $scope.postData("api/pos/cashDiscPolicy/get", params, function (object) {
            $scope.listData = object.data;

            $scope.totalItem = object.totalItem;
            $scope.totalPage = object.totalPage;
            $scope.pageCurrent = object.pageCurrent;

            $scope.defaultFirstData = $scope.listData == null ? null : $scope.listData[0];
        });

        if ($scope.defaultFirstData) {
            $scope.loadGrid($scope.defaultFirstData.id);
            $scope.bankCardTypeText = $scope.listBankCardType.find(x => x.id == $scope.defaultFirstData.bankCardTypeId).text;
            $scope.statusPolicy = $scope.defaultFirstData.status;
        }           
        else {
            $scope.loadGrid(null);
            $scope.action = 'add';
        }



        $scope.getRowCountGrid();
    };

    $scope.loadGrid = function (policyId) {
        $scope.postData("api/pos/cashDiscPolicy/GetDataDetail", { policyId: policyId }, function (data) {
            if (data) {
                $scope.grvPolicyStore.setData(data);                  
            }
            else {
                $scope.grvPolicyStore.setData([]);
            }
        });
    };

    $scope.loadGridDetail = function (policyId) {
        $scope.postData("api/pos/cashDiscPolicy/GetDataDetail", { policyId: policyId }, function (data) {
            if (data) {
                var gridPolicyStoreDetail = $scope.grvPolicyStoreDetail.dataView.getItems();
                angular.forEach(gridPolicyStoreDetail, function (item) {
                    if (data.map(x => x.id).includes(item.id)) {
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
            $scope.bankCardTypeText = $scope.listBankCardType.find(x => x.id == $scope.defaultFirstData.bankCardTypeId).text;
            $scope.loadGrid(item.id);
            $scope.getRowCountGrid();

            $scope.statusPolicy = $scope.defaultFirstData.status;
        }
    }

    $scope.add = function () {
        $('#tab_01-tab').click();
        $('#tab_04-tab').click();
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.status = "0";
        $scope.data.active = true;
        $scope.data.policyDate = moment().format();
        $scope.data.custType = '1';
        $scope.data.type = '4';
        $scope.data.priority = '1';
        $scope.data.bankCardTypeId = $scope.listBankCardType[0].id;       
        
        $scope.statusPolicy = '0';

        $scope.data.effFromDate = moment().format();
        $scope.data.effToDate = moment().format();

        var currentTime = moment().format("HH:mm");
        $("#effFromTime").val(currentTime);
        $("#effToTime").val(currentTime);


        callModal('modal-detail', false);
        $("#code").prop('disabled', true);
        $('#name').focus();

        $scope.loadStore();
        $scope.loadGridDetail(null);

        $timeout(function () {
            $scope.grvPolicyStoreDetail.resizeCanvas();
            $("#ckbAllStore").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
        }, 200);

    }

    $scope.copy = function () {
        $('#tab_01-tab').click();
        var data = $scope.defaultFirstData;
        if (data == null) {
            showError($scope.translation.ERR_SELECT_DATA_COPY);
            return;
        }

        $scope.loadStore();

        $scope.action = 'copy';
        $scope.statusPolicy = data.status;
        $scope.data = angular.copy(data);

        $scope.data.bankCardTypeId = $scope.listBankCardType ? $scope.listBankCardType[0].id : null;

        var effFromTime = moment($scope.data.effFromTime).format("HH:mm");
        $("#effFromTime").val(effFromTime);

        var effToTime = moment($scope.data.effToTime).format("HH:mm");
        $("#effToTime").val(effToTime);

        callModal('modal-detail', false);

        $("#code").prop('disabled', true);
        $('#name').focus();

        $scope.loadGridDetail($scope.data.id);


        $timeout(function () {
            $("#code").val(null);
            $scope.grvPolicyStoreDetail.resizeCanvas();
        }, 200);
    };


    $scope.edit = function () {
        $('#tab_01-tab').click();
        var data = $scope.defaultFirstData;
        if (data == null)
            showError($scope.translation.ERR_CHOOSE_STORE_EDIT);
        else {
            if (data.status == '1') {
                showWarning($scope.translation.ERR_EDIT);
                return;
            }

            $scope.loadStore();

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
                $scope.grvPolicyStoreDetail.resizeCanvas();
            });
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

    $scope.loadStore = function () {
        $scope.postData("api/pos/store/get", null, function (data) {
            if (data)
                $scope.grvPolicyStoreDetail.setData(data);
        });
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

        $scope.grvPolicyStoreDetail.getEditController().commitCurrentEdit();

        var gridImportData = $scope.grvPolicyStoreDetail.dataView.getItems();
        $scope.selectedStore = gridImportData.filter(x => x.selectedStore === true).map(x => x.id);

        if ($scope.selectedStore.length == 0) {
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

        $scope.data.storeId = $scope.selectedStore;
        var dataMaster = angular.copy($scope.data);

        var parameter = {
            master: JSON.stringify(dataMaster),
            type: $scope.action
        }


        $scope.postData('api/pos/cashDiscPolicy/save', parameter, function (data) {
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
        $scope.postData("api/pos/cashDiscPolicy/Delete", { data: $scope.dataDelete }, function (result) {
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
        $scope.data.status = status;

        $scope.postData("api/pos/cashDiscPolicy/UpdateStatus", { data: $scope.data }, function (result) {
            if (result) {
                $timeout(function () {
                    $("#" + result.id).click();
                    $scope.statusPolicy = result.status;
                });
            }
        });
    };

    $scope.resizeTab = function () {
        $timeout(function () {
            $('#tabBottom').height($('#modal-detail .modal-body').height() - $('#tabTop').height() - 155);
        });
    }
}]);