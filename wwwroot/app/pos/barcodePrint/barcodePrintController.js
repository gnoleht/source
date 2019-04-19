'use strict';
app.register.controller('barcodePrintController', ['$scope', '$timeout', function ($scope, $timeout) {
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
    $scope.typePrint = "1";
    $scope.pageSize = "2";
    $scope.templatePrint = "1";
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

                $scope.setting.valuelist.timeMark = $scope.setting.valuelist.dashboardTimeMark.filter(x => x.id == "1" || x.id == "2" || x.id == "3" || x.id == "4" || x.id == "5");

                $scope.setting.valuelist.pageSize = $scope.setting.valuelist.pageSize.filter(x => x.id == "2" || x.id == "3");
                $scope.setting.valuelist.typeSearchPrint = $scope.setting.valuelist.typeSearchPrint.filter(x => x.id == "1" || x.id == "2");
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
                $scope.checkItemPrint(data);
            };
            //if ($(e.target).hasClass("selectedPrint")) {
            //    var data = $scope.grid.dataView.getItem(args.row);
            //    data.selectedPrint = !data.selectedPrint;
            //    $scope.grid.dataView.updateItem(data.id, data);
            //    $scope.grid.invalidate();
            //};
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

        $("#typePrint").prop('disabled', true);

        $(window).resize(function () {
            var width = $("#barcodePrint .white_box").width();
            var height = $("#barcodePrint .white_box").height();
            var box_control = $("#barcodePrint .box_filter").height();

            if ($("#barcodePrint .box_filter").is(":visible")) {
                $('#barcodePrint .scroll').height(height - 25 - box_control);
                $('#barcodePrint .content_6 dd').height(height - 50 - box_control);
            }
            else {
                $('#barcodePrint .scroll').height(height - 10);
                $('#barcodePrint .content_6 dd').height(height - 25);
            }

            $scope.grid.resizeCanvas();
        });
        $timeout(function () {
            $scope.setMarginDefault();
            $(window).resize();

            $("#ckbAllPrint").on("click", function (e) {
                $scope.checkAllPrint();
            });
        });

        $scope.searchObject();

        $scope.marginTop = 0;
        $scope.marginBottom = 0;
        $scope.marginLeft = 0;
        $scope.marginRight = 0;
    });


    $scope.checkAllPrint = function () {
        var gridPrintData = $scope.grid.dataView.getItems();
        if ($("#ckbAllPrint").hasClass('bowtie-checkbox-empty')) {
            $("#ckbAllPrint").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
            angular.forEach(gridPrintData, function (item) {
                item.selectedPrint = true;
            });
        }
        else {
            $("#ckbAllPrint").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
            angular.forEach(gridPrintData, function (item) {
                item.selectedPrint = false;
            });
        }

        $scope.grid.setData(gridPrintData);
    };

    // checkItemImport
    $scope.checkItemPrint = function (item) {
        if (item.selectedPrint) item.selectedPrint = false;
        else item.selectedPrint = true;
        var gridPrintData = $scope.grid.dataView.getItems();
        if (gridPrintData.length === gridPrintData.filter(x => x.selectedPrint === true).length)
            $("#ckbAllPrint").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
        else
            $("#ckbAllPrint").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');

        $scope.grid.dataView.updateItem(item.id, item);
    };

    $scope.cmbGroupItem = {
        url: "api/pos/ItemGroup/GetListComboxbox",
        allowClear: true,
        placeholder: barcodePrintTranslation.GROUPITEM,
    };

    $scope.cmbInventoryImport = {
        url: "api/pos/InventoryImport/GetListComboxboxSearchPrint",
        allowClear: true,
        placeholder: barcodePrintTranslation.INVENTORYIMPORT,
    };

    $scope.cmbStoreId = {
        url: "api/pos/store/GetListComboxbox",
        allowClear: true,
        placeholder: barcodePrintTranslation.STOREID,
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


    $scope.changeTimeMark = function () {
        $scope.processDate($scope.timeMark);
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

    $scope.searchInventoryImport = function () {
        var params = {
            storeId: $scope.storeFilter,
            fromDate: $scope.fromDate,
            toDate: $scope.toDate
        };

        $scope.postData("api/pos/barcodePrint/SearchInventoryImport", params, function (data) {
            $scope.grvInventoryImport.setData(data);
        });
    }

    $scope.searchObject = function () {
        var valueSearch = null;
        if ($scope.typeSearchPrint == "1")
            valueSearch = $scope.groupItem;
        if ($scope.typeSearchPrint == "2")
            valueSearch = $scope.inventoryImport;
        //if ($scope.typeSearchPrint == "3")
        //    valueSearch = $scope.cmbGroupItem;

        var params = {
            type: $scope.typeSearchPrint,
            value: valueSearch,
        };

        $scope.postData("api/pos/barcodePrint/SearchObject", params, function (data) {
            $scope.grid.setData(data);
            $scope.grid.resizeCanvas();
        });
    };

    $scope.saveSearchInventoryImport = function () {
        var dataGrid = $scope.grvInventoryImport.dataView.getItems();
        var listDocId = dataGrid.filter(function (value) {
            if (value.selectedInvImport)
                return value;
        }).map(x => x.id);
        var params = {
            listDocId: listDocId,
        };

        $scope.postData("api/pos/barcodePrint/GetItemByInventoryImport", params, function (data) {
            $scope.grid.setData(data);
            $('#modal-detail').modal('hide');
        });
    }

    $scope.changeTemplatePrint = function () {
        var src = "";
        if ($scope.templatePrint == "1")
            src = "/api/system/viewfile?id=null&def=/images/print/templatePrint_01.PNG";
        else if ($scope.templatePrint == "2")
            src = "/api/system/viewfile?id=null&def=/images/print/templatePrint_02.PNG";
        else if ($scope.templatePrint == "3")
            src = "/api/system/viewfile?id=null&def=/images/print/templatePrint_03.PNG";

        $("#imgItem").attr("src", src);
    }



    $scope.setMarginDefault = function () {
        $scope.marginTop = 0;
        $scope.marginLeft = 0;
        $scope.marginRight = 0;
        $scope.marginBottom = 0;
    }

    $scope.getItemRow = function (array, take) {
        var current = 0;
        var length = array.length;
        return function () {
            end = current + take;
            var part = array.slice(current, end);
            current = end < l ? end : 0;
            return part;
        };
    }

    $scope.printBarcode = function () {
        var dataGrid = $scope.grid.dataView.getItems();
        $scope.listItemPrint = dataGrid.filter(function (value) {
            if (value.selectedPrint) {
                if (value.storeId)
                    value.store = $scope.setting.valuelist.listStore.find(x => x.id == value.storeId).text;
                return value;
            }

        });

        if ($scope.listItemPrint.length == 0) {
            showWarning($scope.translation.ERR_DATA_NULL);
            return;
        }

        $timeout(function () {

            JsBarcode(".barcode").init();
            var printPopup = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=" + screen.availWidth + ",height=" + screen.availHeight);

            var elementPrint = $("#printArea").parent().html();
            printPopup.document.body.innerHTML = "<html><body>" + elementPrint + "</body></html>";

            printPopup.print();
            printPopup.close();
        }, 500);

    };
}]);