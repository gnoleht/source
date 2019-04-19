'use strict';
app.register.controller('workingdayController', ['$scope', '$timeout', function ($scope, $timeout) {
    // int scope
    $scope.data = [];

    //display function
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.search = false;
        $scope.button.save = true;
        $scope.button.refresh = true;
        $scope.button.copy = false;
        $("#btnSprintSetting").hide();
    };

    // display title
    $scope.displayTitle = function () {
        toogleProject(true);
        toogleArea(false);
    };

    $scope.$on('$routeChangeSuccess', function () {

        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        // resize
        $(window).resize(function () {
            var height = $("#workingday .white_box").height();
            $("#workingday #tab-content").height(height - 55);
        });

        $(window).resize();

        // load data
        $scope.loadData();

        // refresh
        $scope.refresh = function () {
            // load data
            $scope.loadData();
        }

        setSelectedMenu("areas");
    });

    // load data
    $scope.loadData = function () {
        var pjid = $scope.params.pjid;
        var params = {
            pjid: pjid
        };

        $scope.postData('api/pm/workingday/get', params, function (data) {
            if (data) $scope.data = data;
        });
    };

    // validate
    $scope.isValidateDateSprintSetting = function () {
        var temp = null;
        $.each($scope.data, function (index, obj) {
            if (obj.selected == true && (obj.fullDay == 0 || obj.fullDay == null)
                && (obj.morning == null || obj.morning == 0) && (obj.afternoon == null || obj.afternoon == 0)) {
                temp = obj;
                return;
            }
        });
        return temp;
    }

    // save
    $scope.save = function () {
        var obj = $scope.isValidateDateSprintSetting();
        if (obj == null) {
            var params = {
                workingDays: $scope.data
            };

            $scope.postData('api/pm/workingday/save', params, function (data) {
                if (data) {
                    $scope.data = data;
                    showSuccess(workingdayTranslation.SUCCESS_TAB);
                }
            });
        }
        else
            showError(workingdayTranslation.ERROR_FIELD);
    };

    // change working day
    $scope.changeWorkingDay = function (item) {
        var element = $("#i_" + item.id);
        if (element.hasClass("bowtie-icon bowtie-checkbox")) {
            element.removeClass("bowtie-icon bowtie-checkbox").addClass("bowtie-icon bowtie-checkbox-empty");
            $.each($scope.data, function (index, obj) {
                if (obj.id == item.id) {
                    obj.fullDay = null;
                    obj.morning = null;
                    obj.afternoon = null;
                    obj.selected = false;
                    obj.totalHours = null;
                    return;
                }
            });
        }
        else {
            element.removeClass("bowtie-icon bowtie-checkbox-empty").addClass("bowtie-icon bowtie-checkbox");
            $.each($scope.data, function (index, obj) {
                if (obj.id == item.id) {
                    obj.selected = true;
                    return;
                }
            });
        }
    };

    // change full day
    $scope.changeDay = function (item) {
        $.each($scope.data, function (index, obj) {
            if (obj.id == item.id) {
                if (item.fullDay) {
                    obj.totalHours = item.fullDay;
                    obj.morning = null;
                    obj.afternoon = null;
                }
                else {
                    if (item.morning && item.afternoon)
                        obj.totalHours = item.morning + item.afternoon;
                    else if (item.morning)
                        obj.totalHours = item.morning;
                    else if (item.afternoon)
                        obj.totalHours = item.afternoon;
                }
                return;
            }
        });
    }

}]);