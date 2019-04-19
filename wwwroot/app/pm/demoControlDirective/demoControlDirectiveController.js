'use strict';

app.register.controller('demoControlDirectiveController', ['$scope', '$location', '$sce', 'authService', 'httpService', function ($scope, $location, $sce, authService, httpService) {
    //init
   
    init('demoControlDirective', $scope, httpService);
    $scope.userDetail = null;
    
    
    //page load
    
    $scope.$on('$routeChangeSuccess', function () {
        demoControlDirectiveSetting.options.scope = $scope;        
        $scope.pid = $location.search()['pid'];
        $scope.pjid = $location.search()['pjid'];
        $scope.data = [];
        $scope.data.inputCheck = true;
    });

    $scope.initComplete = function () {
        $scope.setting = demoControlDirectiveSetting;
        function checkval(){
              console.log("out"); 
        }
       //$('#txt_name').focusout(function(){
       //     console.log("out");
       // })
        
    };

   
    //more functions
    $scope.checkValidate = function () {
        var data = $scope.data;
        
        var varUserId = data.userId;
        if (!varUserId) {
            $("#txtUserId").attr("placeholder", pjMemberTranslation.ERROR_FIELD + pjMemberTranslation.USERID);
            $("#txtUserId").focus();
            showError(pjMemberTranslation.ERROR_FIELD + pjMemberTranslation.USERID);
            return true;
        }       
    }

    $scope.checkNotNull = function (parameter) {
        if (parameter == null || parameter == undefined || parameter.length <= 0 || parameter == {}) return false;
        return true;
    }
    
    $scope.inputNormalChanged = function(){
        console.log("typing...");
    }
    $scope.helloDemo = function(){
        alert("hello demo...");
    }
	
}]);


$(document).ready(function () {
    $(":input").inputmask();
    //or
    //Inputmask().mask(document.querySelectorAll("input"));
});
