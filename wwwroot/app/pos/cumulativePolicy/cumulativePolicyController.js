'use strict';
app.register.controller('cumulativePolicyController', ['$scope', '$timeout', function ($scope, $timeout) {    
    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    };

    //init
    $scope.$on('$routeChangeSuccess', function () {
        ////$(window).resize(function (e) {
        //$(window).resize(function () {
        //    var width = $("#cumulativePolicy .white_box").width();
        //    var height = $("#cumulativePolicy .white_box").height();
        //    var box_control = $("#cumulativePolicy .box_filter").height();

        //    if ($("#cumulativePolicy .box_filter").is(":visible")) {
        //        $('#cumulativePolicy .content_4 dd').height(height - 45 - box_control);
        //        $('#cumulativePolicy .content_6 .wrapper dd').height(height - 250 - box_control);
        //    }
        //    else {
        //        $('#cumulativePolicy .content_4 dd').height(height - 30);
        //        $('#cumulativePolicy .content_6 .wrapper dd').height(height - 240);
        //    }

        //    $scope.grid.resizeCanvas();
        //    $scope.grvItemDetail.resizeCanvas();
        //});
        //$(window).resize();
    });

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;

        $scope.button.add = true;
        $scope.button.edit = true;
        $scope.button.delete = true;
        $scope.button.refresh = true;
        $scope.button.copy = true;
    };

    $scope.add = function () {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.active = true;
        $scope.data.docDate = Date.now();
        $scope.barcodeArea = false;

        var docTime = moment(Date.now()).format("HH:mm");
        $("#docTime").val(docTime);

        callModal('modal-detail');
        $("#code").prop('disabled', true);
        $('#objectType').focus();

        $scope.cmbObject.params.type = null;
        $scope.grvItemDetail.setData([]);
        $timeout(function () { $scope.grvItemDetail.resizeCanvas(); });
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

    $scope.resizeTab = function () {
        $timeout(function () {
            $('#tabBottom').height($('#modal-detail .modal-body').height() - $('#tabTop').height() - 155);
            $scope.grvPricePolicyDetail.resizeCanvas();
        });
    }
}]);