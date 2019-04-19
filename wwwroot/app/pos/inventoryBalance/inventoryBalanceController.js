'use strict';
app.register.controller('inventoryBalanceController', ['$scope', '$timeout', function ($scope, $timeout) {    
    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
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

                var array = ["1", "2", "3", "4", "5"]
                $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => array.includes(x.id));
            },
        });

       
        if ($scope.grid) {           
            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                var dataTemp = angular.copy(args.grid.getCurrentData());
                if (dataTemp)
                    $scope.dataDetail = dataTemp;                           

                if (!$scope.$$phase)
                    $scope.$digest();
            });

            $scope.grid.editAction = function (grid, item) { };
        }


        if (!$scope.grvItemDetail) {
            initSlickGrid($scope, 'grvItemDetail');
            $scope.grvItemDetail.editAction = function (grid, item) { };         
        }



        $scope.refresh = function () {
            $scope.loadData();
        };

        $(window).resize(function () {
            var width = $("#inventoryBalance .white_box").width();
            var height = $("#inventoryBalance .white_box").height();
            var box_control = $("#inventoryBalance .box_filter").height();

            if ($("#inventoryBalance .box_filter").is(":visible")) {
                $('#inventoryBalance .content_6 dd').height(height - 40 - box_control);
                $("#inventoryBalance .scroll").height(height - 15 - box_control);
            }
            else {
                $('#inventoryBalance .content_6 dd').height(height - 25);
                $("#inventoryBalance .scroll").height(height);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();

        $timeout(function () {
            $scope.objectTypeFilter = null;
            $scope.storeFilter = null;
            $scope.timeMark = "3";
            $scope.processDate("3");
            $scope.loadData();

            $scope.grid.resizeCanvas();         
        });
    });


    $scope.searchFull = function (e) {
        if (e != null && e.keyCode != 13) return;
        $scope.loadData();
    };


    $scope.cmbStoreId = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: inventoryBalanceTranslation.STOREID,
    };

    $scope.cmbGroupFilter = {
        url: "api/pos/ItemGroup/GetListComboxbox",
        allowClear: true,
        placeholder: inventoryBalanceTranslation.GROUPFILTER,
    };

    $scope.cmbObject = {
        url: "api/pos/inventoryImport/GetListComboxbox",
        allowClear: true,
        params: {},
        disabled:true
    };


    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;

        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.delete = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.loadData = function () {
        var searchValue = $("#full_text_filter").val();

        var params = {
            searchValue: searchValue,
            storeId: $scope.storeFilter,
            groupId: $scope.groupFilter,
            fromDate: $scope.fromDate,
            toDate : $scope.toDate
        }

        $scope.postData("api/pos/InventoryBalance/get", params , function (data) {
            if (data) {
                $scope.listData = data;              
                $scope.grid.setData(data);
                $scope.dataDetail = angular.copy(data[0]);
                $("#grvInventoryBalance .slick-row :first").click();
            }
        });
    };  

    $scope.searchObject = function () {
        $scope.loadData();
    }

    $scope.processDate = function (filter) {
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
    }

    $scope.changeTimeMark = function () {
        $scope.processDate($scope.timeMark);
    };

    $scope.showInventoryDetail = function (data, type) {
        if (data == null)
            showError(groupTranslation["ERR_CHOOSE_STORE_EDIT"]);
        else {
            $scope.typeInventory = type;
            $scope.action = 'edit';
            $scope.data = angular.copy(data);

            $("#code").prop('disabled', true);
            $("#cmbObject").prop('disabled', true);
            $("#objectType").prop('disabled', true);
            $("#deliverer").prop('disabled', true);
            $("#memo").prop('disabled', true);
            $("#docDate").prop('disabled', true);
            $("#docTime").prop('disabled', true);
            $("#storeId").prop('disabled', true);

            var docDate = moment($scope.data.docTime).format("HH:mm");
            $("#docTime").val(docDate);

            $scope.cmbObject.params.type = $scope.data.objectType;

            var url = type == 'import' ? 'api/pos/InventoryImport/GetDetail' : 'api/pos/InventoryExport/GetDetail';
            $scope.postData(url, { id: data.docId }, function (data) {
                $scope.grvItemDetail.setData(data);
            });

            callModal('modal-detail-inventory');
            $timeout(function () { $scope.grvItemDetail.resizeCanvas(); }, 200);
        };
    }
}]);