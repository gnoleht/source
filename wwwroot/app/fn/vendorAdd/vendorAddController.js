'use strict';
app.register.controller('vendorAddController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.save = true;
        $scope.button.refresh = false;
        $scope.button.copy = false;
        $scope.button.search = false;
    };

    $scope.authService = authService;

    
    $scope.InvoiceUpdate = $scope.ValueListData.responseJSON.InvoiceUpdate;
    $scope.SettlementPrinciple = $scope.ValueListData.responseJSON.SettlementPrinciple;

    $scope.onload = function () {
        debugger;

        $('#myTab a').on('click', function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
        $scope.refresh();
        $.ajax({
            url: 'api/fn/Vendor/GetConfig',
            type: 'POST',
            async: false,
            success: (response) => {
                debugger;
                $scope.Country = response.data.country;
                $scope.Province = response.data.province;
                $scope.JobTitle = response.data.jobTitle;
                $scope.Object = response.data.object;
                $scope.Currency = response.data.currency;
                $scope.PaymMethod = response.data.paymMethod;
                $scope.DelTerm = response.data.delTerm;
                $scope.DelMethod = response.data.delMethod;
                setTimeout(function () {
                    $scope.$apply();
                })
            }
        });
       
    };
    $scope.load = function (callback) {
        debugger;
        var searchValue = $("#inputSearch").val();
    }

    $scope.$on('$routeChangeSuccess', function () {
        //debugger;
        var c = $scope;
        //$scope.grid.loadData();
        // resize
        var this_ = $;
        $scope.search = (e) => {
            var a = this;
            debugger;
            if (e != null && e.keyCode != 13) return;
            var searchValue = $("#inputSearch").val();
            // $scope.load();


        }


        $(window).resize(function () {
            var width = $("#vendorAdd .white_box").width();
            //$("#vendorAdd .white_box").width(width);
            var height = $("#vendorAdd .white_box").height();
            //$("#vendorAdd .white_box").height(height);
            var box_control = $("#vendorAdd .box_control").height();
            $("#vendorAdd .scroll").height(height - box_control - 20);
        });
        $(window).resize();

        setTimeout(() => {
            angular.element(function () {
                debugger;
                $('span.select2-selection--single').attr('style', 'background-color: #fffbfa !important; border-bottom: 1px solid #ff867e !important')
            });
        }, 2000);
    });

    $scope.Change = function (value, key) {
        if (value != null || value != undefined) {
            //set color select2
            switch (key) {
                case "PrimaryProvince": {
                    $('#PrimaryProvince').next('.select2').children().children().attr('style', 'border-bottom: 1px solid #ff867e !important');
                    break;
                }
                case "RepJobTitleID": {
                    $('#RepJobTitleID').next('.select2').children().children().attr('style', 'border-bottom: 1px solid #ff867e !important');
                    break;
                }
                case "PrimaryCountry": {
                    $('#PrimaryCountry').next('.select2').children().children().attr('style', 'border-bottom: 1px solid #ff867e !important');
                    break;
                }

            }

        }
    }
    //function
    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
    }
    $scope.add = function () {

    };

    $scope.click = function () {

    }

    $scope.edit = function () {

        //$("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.pictureThumb + "&def=/img/no-product.jpg");
    };


    $scope.copy = function () {
    };

    //save
    $scope.save = function () {
        debugger;
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        var str = $('#imgAvatar').attr('src');
        var fileName = str.split("/").pop();
        $scope.data.Avatar = fileName;
        $scope.data.Vendor = !$scope.data.Customer;
        $scope.frmFile.append("data", JSON.stringify($scope.data));
        $scope.post("api/fn/Vendor/Add", JSON.stringify($scope.data), function (data) {
            debugger;
            showSuccess($scope.translation.SUCCESS);
            $scope.refresh();
            //$scope.data = [];

            //$scope.grid.dataView.insertItem(0, data);
            //$scope.grid.invalidate();
        });
        console.log("data ", JSON.stringify($scope.data));


    }
    $scope.CheckTab = function (value) {
        switch (value) {
            case "LienHe": {
                console.log("value", value);
                break;
            }
            case "ChiNhanh": {
                console.log("value", value);
                break;
            }
            case "HanMucCongNo": {
                console.log("value", value);
                break;
            }
            case "HanMucCongNoQuaHan": {
                console.log("value", value);
                break;
            }
            case "HoaDon": {
                console.log("value", value);
                break;
            }
            case "DonHang": {
                console.log("value", value);
                break;
            }
            case "HopDong": {
                console.log("value", value);
                break;
            }
            case "ThamSoThietLap": {
                $('#tab_12').find('span.select2-selection--single').attr('style', '')
                console.log("value", value);
                break;
            }
            case "PhanTich": {
                $('#tab_14').find('span.select2-selection--single').attr('style', '')
                console.log("value", value);
                break;
            }

        }
    }

    //hiển thị modal xóa
    $scope.delete = function () {

    };
    $scope.refresh = function () {
        $scope.data = {};
        setTimeout(() => {
            $scope.$apply();
        });
        $scope.data.Customer = false;
        $scope.data.Active = true;
        $('span.select2-selection--single').attr('style', 'background-color: #fffbfa !important; border-bottom: 1px solid #ff867e !important')
    }



}]);