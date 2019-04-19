'use strict';
app.register.controller('costPriceController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;

        $scope.button.add = false;
        $scope.button.edit = false;
        $scope.button.delete = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $('#full_text_filter').focus();
    }

    $scope.typeSearchPrint = "1";
    $scope.selectedInvImport = [];

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
            },
        });


        if (!$scope.grvInventoryImport) {
            initSlickGrid($scope, 'grvInventoryImport');

            $scope.grvInventoryImport.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("selectedInvImport")) {
                    var data = $scope.grvInventoryImport.dataView.getItem(args.row);                 
                    data.selectedInvImport = !data.selectedInvImport;
                    $scope.grvInventoryImport.dataView.updateItem(data.id, data);
                    $scope.grvInventoryImport.invalidate();
                };
            });

            $scope.grvInventoryImport.resizeCanvas();
        }

        $scope.grid.onClick.subscribe(function (e, args) {
            if ($(e.target).hasClass("selectedPrint")) {
                var data = $scope.grid.dataView.getItem(args.row);
                data.selectedPrint = !data.selectedPrint;
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            };
        });

        $scope.refresh = function () {
            //$scope.loadData();
        };

        $scope.searchItem = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadItem();
        };

        $scope.searchInvImport = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.loadInvImport();
        };

        $scope.loadStore();

        $(window).resize(function () {
            var width = $("#costPrice .white_box").width();
            var height = $("#costPrice .white_box").height();
            var box_control = $("#costPrice .box_filter").height();

            if ($("#costPrice .box_filter").is(":visible")) {
                $('#costPrice .scroll').height(height - 15 - box_control);
                $('#costPrice .content_6 dd').height(height - 40 - box_control);
            }
            else {
                $('#costPrice .scroll').height(height);
                $('#costPrice .content_6 dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $timeout(function () {
            $(window).resize();
        });
    });

    $scope.cmbGroupItem = {
        url: "api/pos/ItemGroup/GetListComboxbox",
        allowClear: true,
    };

    $scope.cmbInventoryImport = {
        url: "api/pos/InventoryImport/GetListComboxboxSearchPrint",
        allowClear: true,
    };

    $scope.cmbStoreId = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
    };


    $scope.loadStore = function () {
        $scope.postData("api/pos/Store/get", null, function (data) {
            $scope.setting.valuelist.listStore = data.map(function (item) {
                return { id: item.id, text: item.name }
            });
            $scope.setting.valuelist.listStore.splice(0, 0, { id: 'header', disabled: true });
            $scope.grid.setColumnDataSource('storeId', $scope.setting.valuelist.listStore);
        });
    };

    $scope.loadItem = function () {
        var searchValue = $("#full_text_filter").val();
        $scope.postData("api/pos/Item/get", { searchValue: searchValue }, function (data) {
            if (data) {             
                $scope.grid.setData(data);        
            }          
        });
    }

    $scope.loadInvImport = function () {
        var searchValue = $("#full_text_filter2").val();
        $scope.postData("api/pos/InventoryImport/get", { searchValue: searchValue }, function (data) {
            if (data.data.length > 0) {
                var listData = data.data.map(x => x.invImport);
                $scope.grvInventoryImport.setData(listData);
            }
        });
    }


    $scope.showInventoryImport = function () {
        $scope.grvInventoryImport.setData([]);
        callModal('modal-detail');
        $("#code").prop('disabled', false);
        $('#code').focus();
    }

    $scope.searchInventoryImport = function () {
        var params = {
            storeId: $scope.storeFilter,
            timeMark: $scope.timeMark,
            fromDate: $scope.fromDate,
            toDate: $scope.toDate
        };

        $scope.postData("api/pos/costPrice/SearchInventoryImport", params, function (data) {
            $scope.grvInventoryImport.setData(data);         
        });
    }

    $scope.searchObject = function () {
        var valueSearch = null;
        if ($scope.typeSearchPrint == "1")
            valueSearch = $scope.cmbGroupItem;
        if ($scope.typeSearchPrint == "2")
            valueSearch = $scope.cmbInventoryImport;
        if ($scope.typeSearchPrint == "3")
            //valueSearch = $scope.cmbGroupItem;
            
        var params = {
            type: $scope.typeSearchPrint,
            value: valueSearch,
        };

        $scope.postData("api/pos/costPrice/SearchObject", params, function (data) {
            $scope.grid.setData(data);
            $scope.grid.resizeCanvas();
        });
    };

    $scope.saveSearchInventoryImport = function () {
        var dataGrid = $scope.grvInventoryImport.dataView.getItems();
        var listDocId = dataGrid.filter(function (value) {
            if (value.selectedInvImport)
                return value;           
        }).map(x=>x.id);
        var params = {
            listDocId: listDocId,
        };

        $scope.postData("api/pos/costPrice/GetItemByInventoryImport", params, function (data) {
            $scope.grid.setData(data);
            $('#modal-detail').modal('hide');
        });
    }

    $scope.printBarcode = function () {
        var dataGrid = $scope.grid.dataView.getItems();
        var listItemPrint = dataGrid.filter(function (value) {
            if (value.selectedPrint)
                return value;
        });

        if (listItemPrint.length == 0)
            showWarning($scope.translation.ERR_DATA_NULL);
       
    };

    //shortcut.add("F9", function () {
    //    window.print();
    //});
}]);