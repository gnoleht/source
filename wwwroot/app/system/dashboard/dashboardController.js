'use strict';
app.register.controller('dashboardController', ['$scope', '$location', function ($scope, $location) {
    $scope.$on('$routeChangeSuccess', function () {
        toogleMenu(false);
        toogleHeader(false);

        $scope.title.form = translation.TITLE;
        $("#divModuleTitle").empty();

        $scope.currentMode = "open";
        $scope.currentLanguage = $.cookie("LANG");

        var widthBody = $(window).width() - 10;
        var heightBody = $(window).height() - 50;
        $("#dashboard").css("width", widthBody - 20);
        $("#dashboard").css("max-height", heightBody - 10 - 20);

        $(window).resize(function () {
            var widthBody = $(window).width() - 10;
            var heightBody = $(window).height() - 50;
            $("#dashboard").css("width", widthBody - 20);
            $("#dashboard").css("max-height", heightBody - 10 - 20);
        });

        $.ajax({
            type: 'POST',
            async: false,
            url: 'api/sys/function/getAllFunction',
            success: function (response) {
                $scope.listFunction = response.data.parent;
                $scope.listChild = response.data.child;
            },
        });

        SetPerfectScroll("dashboard");
        $("#dashboard").css('position', 'unset');

        $(document).keyup(function (e) {
            if (e.ctrlKey && e.keyCode == 81) {
                var listChildGroup = null;
                if ($scope.currentMode == 'open') {
                    listChildGroup = $(".childGroup");
                    $.each(listChildGroup, function (index, element) {

                        $scope.collapseChild(element.id, 'close');
                    });
                    $scope.currentMode = 'close';
                }
                else {
                    listChildGroup = $('.childGroup');
                    $.each(listChildGroup, function (index, element) {
                        $scope.collapseChild(element.id, 'open');
                    });

                    $scope.currentMode = 'open';
                }
            }
        });
    });



    $scope.collapseChild = function (id, type) {
        if (type == undefined || type == null) {
            if ($('#i_' + id).hasClass("blockOpen")) {
                $('#i_' + id).removeClass("bowtie-chevron-down-light").addClass("bowtie-chevron-right-light");
                $('#i_' + id).removeClass("blockOpen");
                $('#div_' + id).slideUp(150);
            }
            else {
                $('#i_' + id).removeClass("bowtie-chevron-right-light").addClass("bowtie-chevron-down-light");
                $('#i_' + id).addClass("blockOpen");
                $('#div_' + id).show(200);
            }
        }
        else {
            id = id.replace('div_', '');
            if (type == "open") {
                if (!$('#i_' + id).hasClass("blockOpen")) {
                    $('#i_' + id).removeClass("bowtie-chevron-right-light").addClass("bowtie-chevron-down-light");
                    $('#i_' + id).addClass("blockOpen");
                    $('#div_' + id).show(200);
                }
            }
            else {
                if ($('#i_' + id).hasClass("blockOpen")) {
                    $('#i_' + id).removeClass("bowtie-chevron-down-light").addClass("bowtie-chevron-right-light");
                    $('#i_' + id).removeClass("blockOpen");
                    $('#div_' + id).slideUp(150);
                }
            }
        }
    };

    $scope.openView = function (url) {
        $location.path(decodeURIComponent(url));
    };

    $scope.search = function (e) {
        var allowSearch = true;

        if (e != null && e.keyCode != 13) {
            allowSearch = false;
        }

        if (allowSearch) {
            var seachValue = $("#searchValue").val();
            if (seachValue == null || seachValue == '')
                $(".dbchildFunction").css('display', 'block');
            else {
                var lstChildElement = $(".dbchildFunction");
                $.each(lstChildElement, function (index, element) {
                    if (element.innerHTML.indexOf(seachValue) != -1)
                        element.style.display = 'block';
                    else
                        element.style.display = 'none';
                });
            }
        };
    };
}]);