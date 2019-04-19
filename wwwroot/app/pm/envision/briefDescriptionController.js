'use strict';
app.register.controller('briefDescriptionController', ['$scope', 'authService', function ($scope, authService) {
    // register scope
    $scope.authService = authService;
    $scope.product = {};
    $scope.defaultProduct = {};

    $scope.listFileRelated = [];
    $scope.listFileUpload = [];
    $scope.folders = [];
    $scope.listFileRemove = [];

    $scope.$on('$routeChangeSuccess', function () {
        // load data
        $scope.loadData();
    });

    // onload
    $scope.onload = function () {
        // resize
        //$(window).resize(function () {
        //    var width = $("#briefDescription").closest('.tab-content').width();
        //    var height = $("#briefDescription").closest('.tab-content').height();
        //    // set value
        //    $("#briefDescription .content_7_3").width(width);
        //    $("#briefDescription .content_7_3").height(height);

        //    $(".content_data_main").outerHeight(height - 35 - 40);
        //    $(".content_data_main").css("overflow", "auto");
        //});
        //$(window).resize();
        // init
        init('briefDescription', $scope, true, false);
        // hidden attachment
        $("#briefDescription .btn_full").click(function (e) {
            $(e.target).closest(".content_3").toggleClass("show_hidden");
            $(e.target).closest(".content_3").siblings(".content_7").toggleClass("show_hidden");
        });
    };

    // load data
    $scope.loadData = function () {
        // product
        $scope.postNoAsync("api/pm/envision/getProduct?pid=" + $scope.params.pid, null, function (data) {
            $scope.product = data;
            $scope.defaultProduct = $.extend(true, {}, data);
        });

        $scope.postNoAsync('api/sys/document/getAttachment?objectId=' + $scope.params.pid, null, function (data) {
            $scope.attachments = data;
        });
        //$scope.getAttachment($scope.params.pid);
    }

    // init summer note
    $scope.initSummerNote = function (e) {
        $("#description").siblings(".note-editor").css('height', '100%');
        $("#description").siblings(".note-editor").css('overflow', 'auto');
    };

    // refresh
    $scope.refresh = function () {
        // load data
        $scope.loadData();
    }

    // save
    $scope.save = function () {
        if ($scope.product !== null && $scope.product !== undefined) {

            $scope.buildAttachment();

            $scope.frmFile.append("data", JSON.stringify($scope.product));
            // save
            $scope.postFile("api/pm/envision/updateproduct", $scope.frmFile, function (data) {
                showSuccess(envisionTranslation.SUCCESS_TAB);
                $scope.defaultProduct = data;

                $scope.listFileRelated = [];
                $scope.listFileUpload = [];
                $scope.folders = [];
                $scope.listFileRemove = [];
            });
        }
    }
}]);
