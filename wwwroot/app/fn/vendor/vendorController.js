'use strict';
app.register.controller('vendorController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.button.search = true;
    $scope.ObjectPanelId = "ObjectPanel";
    $scope.ObjectId = "grvObject";
    $scope.dataSourceObject = [];
    $scope.headerObject = {};
    $scope.headerObject.title = vendorTranslation.Object_HeaderVendor_Title;
    $scope.headerObject.data = [{ title: vendorTranslation.Object_HeaderVendor_Total, total: 0 }, { title: vendorTranslation.Object_HeaderVendor_ActiveUser, total: 0 }, { title: vendorTranslation.Object_HeaderVendor_TopUser, total: 0 }];
    $scope.styleObject = { 'height': '100%', 'width': '100%' };
    $scope.translation = vendorTranslation;
    $scope.ObjectContactId = "grvObjectContact";
    $scope.ObjectContactPanelId = "ObjectContactPanel";
    $scope.dataSourceObjectContact = [];
    $scope.headerObjectContact = { title: vendorTranslation.ObjectContact_Total, total: 0 };
    $scope.stylePublic = { 'height': '100%', 'width': '100%' };

    $scope.ObjectCreditLimitId = "grvObjectCreditLimit";
    $scope.ObjectCreditLimitPanelId = "ObjectCreditLimitPanel";
    $scope.dataSourceObjectCreditLimit = [];
    $scope.headerObjectCreditLimit = { title: vendorTranslation.ObjCreditLimitTotal, total: 0 };

    $scope.ObjBankAccountId = "grvObjBankAccount";
    $scope.ObjBankAccountPanelId = "grvObjBankAccountPanel";
    $scope.dataSourceObjBankAccount = [];
    $scope.headerObjBankAccount = { title: vendorTranslation.ObjBankAccountTotal, total: 0 };

    $scope.ObjAddressPanelId = "ObjAddressPanel";
    $scope.ObjAddressId = "grvObjAddress";
    $scope.dataSourceObjAddress = [];
    $scope.headerObjAddress = { title: vendorTranslation.ObjAddressTotal, total: 0 };
    $scope.Country = [];
    $scope.Province = [];
    $scope.vendor = {};
    $scope.vendor.active = 1;
     $.ajax({
            url: `api/fn/Vendor/Get?active=${$scope.vendor.active}`,
            type: 'POST',
            async: false,
            success: function (response) {
                debugger;
             
                $scope.dataSourceObject = response.data.result;
                $scope.headerObject.data[0].total = response.data.total;
                $scope.headerObject.data[1].total = response.data.totalActive;
                $scope.headerObject.data[2].total = response.data.totalUnActive;

                
                $timeout(function () {
                    $scope.$apply(function () {

                        debugger
                    });
                });
            }
         });
     $.ajax({
            url: 'api/fn/Vendor/GetConfig',
            type: 'POST',
            async: false,
            success: function (response) {
                debugger;
                $scope.Country = response.data.country;
                $scope.Province = response.data.province;
                $timeout(function () {
                    $scope.$apply();
                })
            }
        });
  

    $scope.selectChange = function (e) {
        debugger;
        $.ajax({
            url: `api/fn/Vendor/GetByKey?objectId=${e.id}`,
            type: 'POST',
            async: false,
            success: function (response) {
                debugger;
                $scope.dataSourceObjectContact = response.data.objContact;
                $scope.headerObjectContact.total = response.data.objContact.length;
                $scope.dataSourceObjectCreditLimit = response.data.objCreditLimit;
                $scope.headerObjectCreditLimit.total = response.data.objCreditLimit.length;
                $scope.dataSourceObjBankAccount = response.data.bankAccount;
                $scope.headerObjBankAccount.total = response.data.bankAccount.length;
                $scope.dataSourceObjAddress = response.data.objAddress;
                $scope.headerObjAddress.total = response.data.objAddress.length;
                $scope.$apply();
            }
        });

        }

    $scope.$on('$routeChangeSuccess', function () {
        
        var that = $;
        var _this = $scope;
        that(".switch").click(function () {
            that(this).toggleClass("change");
           
            var active = $(this).context.innerText == "Hoạt động" ? 1 : 0;
            $scope.vendor.active = active;
            $scope.$apply();
            var search = that("#inputSearch").val() == null || that("#inputSearch").val() == "" || that("#inputSearch").val() == undefined ? null : that("#inputSearch").val();
            that.ajax({
                url: `api/fn/Vendor/Get?search=${search}&active=${active}`,
                type: 'POST',
                async: false,
                success: function (response) {
                    $scope.dataSourceObject = response.data.result;
                    $scope.headerObject.data[0].total = response.data.total;
                    $scope.headerObject.data[1].total = response.data.totalActive;
                    $scope.headerObject.data[2].total = response.data.totalUnActive;
                    $scope.$apply();

                }
            });
        });
       
        $scope.search = function (e){
            debugger;
            if (e != null && e.keyCode != 13)
                return;
            var search = that("#inputSearch").val();
            $.ajax({
                url: `api/fn/Vendor/Get?search=${search}&active=${$scope.vendor.active}`,
                type: 'POST',
                async: false,
                success: function (response) {
                    debugger;
                    $scope.dataSourceObject = response.data.result;
                    $scope.headerObject.data[0].total = response.data.total;
                    $scope.headerObject.data[1].total = response.data.totalActive;
                    $scope.headerObject.data[2].total = response.data.totalUnActive;

                    $timeout(function () {
                        $scope.$apply(function () {

                            debugger
                        });
                    });
                }
            });
           
          
        };
       
        // $scope.grid.loadData();
    });
   
    $scope.searchObject = function ()
    
    {
        debugger;
        if (($scope.vendor.ObjectID == null || $scope.vendor.ObjectID == "") && ($scope.vendor.TaxCode == null || $scope.vendor.TaxCode == "") && ($scope.vendor.AnalysisCode1 == null || $scope.vendor.AnalysisCode1 == "") && ($scope.vendor.PrimaryCountry == null || $scope.vendor.PrimaryCountry == "") && ($scope.vendor.PrimaryProvince == null || $scope.vendor.PrimaryProvince == "") && ($scope.vendor.AnalysisCode2==null || $scope.vendor.AnalysisCode2.length == ""))
        {
            return;
        }
       
        $.ajax({
            url: `api/fn/Vendor/SearchObject?active=${$scope.vendor.active}`,
            type: 'POST',
            async: false,
            data: JSON.stringify($scope.vendor),
            success: function (response) {
                            
                debugger
                $scope.headerObject.data[0].total = response.data.total;
                $scope.headerObject.data[1].total = response.data.totalActive;
                $scope.headerObject.data[2].total = response.data.totalUnActive;
                $scope.dataSourceObject = response.data.result;
                $scope.dataSourceObjectContact = [];
                $scope.headerObjectContact.total = 0;
                $scope.dataSourceObjectCreditLimit = [];
                $scope.headerObjectCreditLimit.total =0;
                $scope.dataSourceObjBankAccount = [];
                $scope.headerObjBankAccount.total =0;
                $scope.dataSourceObjAddress = [];
                $scope.headerObjAddress.total = 0;
                setTimeout(() => $scope.$apply(), 0);
               
              
            }
        });
    }
    $scope.edit = function (e) {
        var data = $scope.grid.getCurrentData();
        window.location.href = window.location.origin + "/fn/vendorAdd?id=" + data.id + '&action=edit&module=fn';
    }
    
    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100');
    }
    $scope.toogleRight = function () {
        $scope.checkRight = !$scope.checkRight;
    }

    $scope.add = function () {
        debugger;
        
        window.location.href = window.location.origin + "/fn/vendorAdd";
    };

    
    $scope.copy = function () {
        var data = $scope.grid.getCurrentData();
        window.location.href = window.location.origin + "/fn/vendorAdd?id=" + data.id +'&action=copy&module=fn';
       
    };
    $scope.delete = function () {
        debugger;
        var data = $scope.grid.getCurrentData();
        $('#modal-confirm').modal();
    };

    $scope.deleteData = function () {
        debugger;
        var data = $scope.grid.getCurrentData();
        var _$ = $;
        var that = $scope;
              $.ajax({
                  url: "api/fn/Vendor/Remove?id="+data.id,
                    type: 'POST',
                    async: false,
                    success: function (response) {
                        debugger;
                        if (response.data == true)
                        {
                            _$.ajax({
                                url: `api/fn/Vendor/Get?active=${$scope.vendor.active}`,
                                type: 'POST',
                                async: false,
                                success: (response)=> {
                                    debugger;
                                    that.dataSourceObject = response.data.result;
                                    that.headerObject.data[0].total = response.data.total;
                                    that.headerObject.data[1].total = response.data.totalActive;
                                    that.headerObject.data[2].total = response.data.totalUnActive;
                                    setTimeout(() => that.$apply(), 0);
                                    
                                }
                            });
                        }
                        
                    }
                });

            
      
    };

    

  

}]);