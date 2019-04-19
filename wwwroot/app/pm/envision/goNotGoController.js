'use strict';
app.register.controller('goNotGoController', ['$scope', function ($scope) {
    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        // scope
        $scope.setting.valuelist.strength = [{ id: 1, text: "Công nghệ" }, { id: 2, text: "Nghiệp vụ" }];
        $scope.setting.valuelist.weakness = [{ id: 1, text: "Công nghệ" }, { id: 2, text: "Nghiệp vụ" }, { id: 3, text: "Kỹ thuật" }];
        $scope.setting.valuelist.opportunity = [{ id: 1, text: "Thị trường" }, { id: 2, text: "Nghiệp vụ" }, { id: 3, text: "Tổ chức" }];
        $scope.setting.valuelist.threat = [{ id: 1, text: "Con người" }, { id: 2, text: "Nghiệp vụ" }, { id: 3, text: "Chính phủ" }];
    });

    // onload
    $scope.onload = function () {
        // resize
        //$(window).resize(function () {
        //    var width = $("#goNotGo").closest('.tab-content').width();
        //    var height = $("#goNotGo").closest('.tab-content').height();
        //    $("#goNotGo").width(width);
        //    $("#goNotGo").height(height);

        //    var formHeight = height / 2 - 80;
        //    $(".tblDiv").outerHeight(formHeight);
        //});
        //$(window).resize();

        SetPerfectScroll("divStrength");
        SetPerfectScroll("divWeakness");
        SetPerfectScroll("divOpportunity");
        SetPerfectScroll("divThreat");
        SetPerfectScroll("divTable");
        // init
        init('goNotGo', $scope, true, false, false);
    };

    // refresh
    $scope.refresh = function () {
        // load data
        $scope.envision = $.extend(true, {}, $scope.defaultData);
    }

    // save
    $scope.save = function () {
        // check strength
        var indexStrength = $scope.envision.goNotGo.strength.findIndex(x => x.value == null || x.value == "");
        if (indexStrength != -1) {
            showError(envisionTranslation["STRENGTHS"] + ": " + envisionTranslation["LINE"] + " " + (indexStrength + 1) + " " + envisionTranslation["REQUIRED"]);
            $('#txtStrength_' + indexStrength).focus();
        }
        else {
            // check weakness
            var indexWeakness = $scope.envision.goNotGo.weakness.findIndex(x => x.value == null || x.value == "");
            if (indexWeakness != -1) {
                showError(envisionTranslation["WEAKNESSES"] + ": " + envisionTranslation["LINE"] + " " + (indexWeakness + 1) + " " + envisionTranslation["REQUIRED"]);
                $('#txtWeakness_' + indexWeakness).focus();
            }
            else {
                // check opportunity
                var indexOpportunity = $scope.envision.goNotGo.opportunity.findIndex(x => x.value == null || x.value == "");
                if (indexOpportunity != -1) {
                    showError(envisionTranslation["OPPORTUNITIES"] + ": " + envisionTranslation["LINE"] + " " + (indexOpportunity + 1) + " " + envisionTranslation["REQUIRED"]);
                    $('#txtOpportunity_' + indexOpportunity).focus();
                }
                else {
                    // check threat
                    var indexThreat = $scope.envision.goNotGo.threat.findIndex(x => x.value == null || x.value == "");
                    if (indexThreat != -1) {
                        showError(envisionTranslation["THREATS"] + ": " + envisionTranslation["LINE"] + " " + (indexThreat + 1) + " " + envisionTranslation["REQUIRED"]);
                        $('#txtThreat_' + indexThreat).focus();
                    }
                    // isvalid data
                    else {
                        $scope.post("api/pm/Envision/Save", JSON.stringify($scope.envision), function (data) {
                            $scope.defaultData = data;
                            showSuccess(envisionTranslation.SUCCESS_TAB);
                        });
                    }
                }
            }
        }
    };

    // add item
    $scope.addItem = function (type) {
        // strength
        if (type == "strength") {
            var index = $scope.envision.goNotGo.strength.findIndex(x => x.value == null || x.value == "");
            if (index != -1) {
                showError(envisionTranslation["STRENGTHS"] + ": " + envisionTranslation["LINE"] + " " + (index + 1) + " " + envisionTranslation["REQUIRED"]);
                $('#txtStrength_' + index).focus();
            }
            else {
                $scope.envision.goNotGo.strength.push({ type: "1" });
                var length = ($scope.envision.goNotGo.strength.length - 1) < 0 ? 0 : ($scope.envision.goNotGo.strength.length - 1);
                setTimeout(function () {
                    $('#txtStrength_' + length).focus().click();
                }, 0);
            }
        }
        // weakness
        else if (type == "weakness") {
            var index = $scope.envision.goNotGo.weakness.findIndex(x => x.value == null || x.value == "");
            if (index != -1) {
                showError(envisionTranslation["WEAKNESSES"] + ": " + envisionTranslation["LINE"] + " " + (index + 1) + " " + envisionTranslation["REQUIRED"]);
                $('#txtWeakness_' + index).focus();
            }
            else {
                $scope.envision.goNotGo.weakness.push({ type: "1" });
                var length = ($scope.envision.goNotGo.weakness.length - 1) < 0 ? 0 : ($scope.envision.goNotGo.weakness.length - 1);
                setTimeout(function () {
                    $('#txtWeakness_' + length).focus().click();
                }, 0);
            }
        }
        // opportunity
        else if (type == "opportunity") {
            var index = $scope.envision.goNotGo.opportunity.findIndex(x => x.value == null || x.value == "");
            if (index != -1) {
                showError(envisionTranslation["OPPORTUNITIES"] + ": " + envisionTranslation["LINE"] + " " + (index + 1) + " " + envisionTranslation["REQUIRED"]);
                $('#txtOpportunity_' + index).focus();
            }
            else {
                $scope.envision.goNotGo.opportunity.push({ type: "1" });
                var length = ($scope.envision.goNotGo.opportunity.length - 1) < 0 ? 0 : ($scope.envision.goNotGo.opportunity.length - 1);
                setTimeout(function () {
                    $('#txtOpportunity_' + length).focus().click();
                }, 0);
            }
        }
        // threat
        else if (type == "threat") {
            var index = $scope.envision.goNotGo.threat.findIndex(x => x.value == null || x.value == "");
            if (index != -1) {
                showError(envisionTranslation["THREATS"] + ": " + envisionTranslation["LINE"] + " " + (index + 1) + " " + envisionTranslation["REQUIRED"]);
                $('#txtThreat_' + index).focus();
            }
            else {
                $scope.envision.goNotGo.threat.push({ type: "1" });
                var length = ($scope.envision.goNotGo.threat.length - 1) < 0 ? 0 : ($scope.envision.goNotGo.threat.length - 1);
                setTimeout(function () {
                    $('#txtThreat_' + length).focus().click();
                }, 0);
            }
        }
    }

    // remove item
    $scope.removeItem = function (type) {
        // strength
        if (type == "strength") {
            var index = $("#tblStrength .tb_tree-active").attr('data-id');
            if (index) $scope.envision.goNotGo.strength.splice(index, 1);
            else showError(envisionTranslation["EER_CHOOSE_DELETE"]);
        }
        // weakness
        else if (type == "weakness") {
            var index = $("#tblWeakness .tb_tree-active").attr('data-id');
            if (index) $scope.envision.goNotGo.weakness.splice(index, 1);
            else showError(envisionTranslation["EER_CHOOSE_DELETE"]);
        }
        // opportunity
        else if (type == "opportunity") {
            var index = $("#tblOpportunity .tb_tree-active").attr('data-id');
            if (index) $scope.envision.goNotGo.opportunity.splice(index, 1);
            else showError(envisionTranslation["EER_CHOOSE_DELETE"]);
        }
        // threat
        else if (type == "threat") {
            var index = $("#tblThreat .tb_tree-active").attr('data-id');
            if (index) $scope.envision.goNotGo.threat.splice(index, 1);
            else showError(envisionTranslation["EER_CHOOSE_DELETE"]);
        }
    }

    // seleted strength
    $(document).on('click', "tr.clickable-row-strength", function () {
        $(this).addClass('tb_tree-active').siblings().removeClass('tb_tree-active');
    });

    // seleted weakness
    $(document).on('click', "tr.clickable-row-weakness", function () {
        $(this).addClass('tb_tree-active').siblings().removeClass('tb_tree-active');
    });

    // seleted opportunity
    $(document).on('click', "tr.clickable-row-opportunity", function () {
        $(this).addClass('tb_tree-active').siblings().removeClass('tb_tree-active');
    });

    // seleted threat
    $(document).on('click', "tr.clickable-row-threat", function () {
        $(this).addClass('tb_tree-active').siblings().removeClass('tb_tree-active');
    });

}]);