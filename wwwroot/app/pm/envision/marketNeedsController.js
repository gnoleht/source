'use strict';
app.register.controller('marketNeedsController', ['$scope', function ($scope) {
    // register scope
    $scope.sizes = [];
    $scope.criteria = [[]];

    // on load
    $scope.onload = function () {
        // resize
        //$(window).resize(function () {
        //    var width = $("#marketNeeds").closest('.tab-content').width();
        //    var height = $("#marketNeeds").closest('.tab-content').height();
        //    $("#marketNeeds").width(width);
        //    $("#marketNeeds").height(height);
        //});
        //$(window).resize();
        //SetPerfectScroll("marketNeeds");
        // init
        init('marketNeeds', $scope, true, false, false);
    };

    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        $scope.setting.valuelist.glads = [{ id: 'satisfied', text: 'Hài lòng' }, { id: 'unsatisfied', text: 'Không hài lòng' }];
        // load data
        $scope.loadData();
    });

    // load data
    $scope.loadData = function () {
        if ($scope.envision.id == null || $scope.envision.id == undefined)
            $scope.envision.id = $scope.params.pid;
        $scope.marketNeeds = $scope.envision.marketNeeds;
        if ($scope.marketNeeds.criterias == null || $scope.marketNeeds.criterias == undefined)
            $scope.criteria[0] = [];
        else
            $scope.criteria[0] = JSON.parse($scope.marketNeeds.criterias);
        $scope.getMarketConfig();
        if ($scope.marketNeeds.criterias == null)
            $scope.marketNeeds.criterias = "[]";
    }


    $scope.loadInputMask = function () {
        //inputmask
        $('.input-mask-cost').inputmask("currency", {
            groupSeparator: ",",
            digits: 2,
            autoGroup: true,
            rightAlign: false,
            prefix: "",
        });
    }

    // change working day
    $scope.changeSelectedSize = function (item) {
        var element = $("#i_" + item.id);
        if (element.hasClass("bowtie-icon bowtie-checkbox")) {
            element.removeClass("bowtie-icon bowtie-checkbox").addClass("bowtie-icon bowtie-checkbox-empty");
            $.each($scope.sizes, function (index, obj) {
                if (obj.id == item.id) {
                    obj.selected = false;
                    return;
                }
            });
        }
        else {
            element.removeClass("bowtie-icon bowtie-checkbox-empty").addClass("bowtie-icon bowtie-checkbox");
            $.each($scope.sizes, function (index, obj) {
                if (obj.id == item.id) {
                    obj.selected = true;
                    return;
                }
            });
        }
    };

    $scope.getMarketConfig = function () {
        $scope.postNoAsync('api/pm/envision/GetMarketConfigByType?type=Size', null, function (data) {
            $.each(data, function (index, item) {
                var checkin = $.inArray(item.id, $scope.envision.marketNeeds.sizes);
                item = {
                    index: index,
                    id: item.id,
                    name: item.title,
                    selected: checkin == -1 ? false : true
                };
                $scope.sizes.push(item);
            });


            var criteria = $scope.criteria[0];
            $scope.criteriaData = criteria;
            //Size config
            if ($scope.marketNeeds == null) {
                $scope.marketNeeds = {};
                $scope.marketNeeds.sizes = [];
            }

            //Compertition config
            if ($scope.marketNeeds.competitions == null || $scope.marketNeeds.competitions == undefined) {
                $scope.marketNeeds.competitions = [];
            }
            $scope.competitions = $scope.marketNeeds.competitions;
            $.each($scope.marketNeeds.competitions, function (index, item) {
                var criteriasList = [];
                var total = 0;
                var arrCriterias = jQuery.map(item.criterias, function (n, i) {
                    return n.substring(0, n.indexOf("_"));
                });
                $.each(criteria, function (index, val) {
                    var checkin = $.inArray(val.id.toString(), arrCriterias);
                    val = {
                        id: val.id + "_" + uniqId(),
                        selected: checkin == -1 ? false : true
                    };
                    if (val.selected) {
                        total = total + 1;
                    }
                    criteriasList.push(val);
                });
                $scope.competitions[index].total = total;
                $scope.criteria.push(criteriasList);
            });
        });
    };

    //add competition
    $scope.addCompetition = function () {
        // check NameCompetition
        var errorNameCompetition = checkNameCompetition();
        if (errorNameCompetition) {
            showError(errorNameCompetition);
        }
        else {
            // check MarketCompetition
            var errorMarketCompetition = checkMarketCompetition();
            if (errorMarketCompetition) {
                showError(errorMarketCompetition);
            }
            else {
                $scope.competitions.push({ name: '', cost: 0, glad: "satisfied", market: '', criterias: [], total: 0 });
                var criteriasList = [];
                $.each($scope.criteriaData, function (index, val) {
                    val = {
                        id: val.id + "_" + uniqId(),
                        selected: false
                    };
                    criteriasList.push(val);
                });
                $scope.criteria.push(criteriasList);
            }
        }
    }

    //add criteria
    $scope.addCriteria = function () {
        // check validate product features
        var error = checkProductFeatures();
        if (error == "") {
            var obj = $scope.criteria[0];
            var index = 0;
            var item;
            if (obj != null || obj != undefined)
                index = obj.length + 1;
            var id = uniqId();
            $scope.criteria[0].push({ index: index, id: id, name: '' });
            for (var i = 1; i < $scope.criteria.length; i++) {
                item = {
                    id: id + "_" + i,
                    selected: false
                };
                $scope.criteria[i].push(item);
            }
            $("#" + id).focus();
        }
        else {
            showError(error);
        }
    }

    $scope.removeCompetition = function (index) {
        $scope.competitions.splice(index, 1);
        $scope.criteria.splice(index + 1, 1);
    }

    $scope.removeCriteria = function (index) {
        $scope.criteria[0].splice(index, 1);
        for (var i = 1; i < $scope.criteria.length; i++) {
            reSum(i, $scope.criteria[i][index]["selected"]);
            $scope.criteria[i].splice(index, 1);
        }
    }

    function reSum(index, val) {
        if (val) {
            $scope.competitions[index - 1].total = $scope.competitions[index - 1].total - 1;
        }
    }

    $scope.checkCriteria = function (index, val, item) {
        var element = $("#i_" + item.id);
        if (val) {
            element.removeClass("bowtie-icon bowtie-checkbox").addClass("bowtie-icon bowtie-checkbox-empty");
            $.each($scope.criteria[index], function (idex, obj) {
                if (obj.id == item.id) {
                    obj.selected = false;
                    return false;
                }
            });
            $scope.competitions[index - 1].total = $scope.competitions[index - 1].total - 1;
        }
        else {
            element.removeClass("bowtie-icon bowtie-checkbox-empty").addClass("bowtie-icon bowtie-checkbox");
            $.each($scope.criteria[index], function (idex, obj) {
                if (obj.id == item.id) {
                    obj.selected = true;
                    return false;
                }
            });
            $scope.competitions[index - 1].total = $scope.competitions[index - 1].total + 1;
        }
    }

    $scope.save = function () {
        // check NameCompetition
        var errorNameCompetition = checkNameCompetition();
        if (errorNameCompetition) {
            showError(errorNameCompetition);
        }
        else {
            // check MarketCompetition
            var errorMarketCompetition = checkMarketCompetition();
            if (errorMarketCompetition) {
                showError(errorMarketCompetition);
            }
            else {
                // check validate product features
                var error = checkProductFeatures();
                if (error) {
                    showError(error);
                }
                else {
                    $scope.configData();
                    $scope.post("api/pm/envision/save", JSON.stringify($scope.envision), function (data) {
                        $scope.marketNeeds = data.marketNeeds;
                        $scope.defaultData = data;
                        showSuccess(envisionTranslation.SUCCESS_TAB);
                    });
                }
            }
        }
    };


    $scope.configData = function () {
        $scope.marketNeeds.sizes = [];
        $.each($scope.sizes, function (index, item) {
            if (item.selected == true) {
                $scope.marketNeeds.sizes.push(item.id)
            }
        });
        $scope.marketNeeds.criterias = angular.toJson($scope.criteria[0]);
        $.each($scope.competitions, function (index, item) {
            $scope.marketNeeds.competitions[index].criterias = [];
            $.each($scope.criteria[index + 1], function (i, val) {
                if (val.selected) {
                    $scope.marketNeeds.competitions[index].criterias.push(val.id);
                }
            });
        });
        $scope.envision.marketNeeds = $scope.marketNeeds;
    };

    //create unique id
    function uniqId() {
        return Math.round(new Date().getTime() + (Math.random() * 100));
    }

    // refresh
    $scope.refresh = function () {
        $scope.sizes = [];
        $scope.criteria = [[]];
        $scope.envision = $.extend(true, {}, $scope.defaultData);
        // load data
        $scope.loadData();
    }

    // check validate product features
    function checkProductFeatures() {
        var error = "";
        var valid = true;
        $.each($scope.criteria[0], function (index, item) {
            if (item.name) {
                return;
            }
            else {
                error += envisionTranslation["LINE"] + " " + (index + 1) + " : " + envisionTranslation["ERR_PRODUCT_FEATURES_NAME"] + "</br>";
                valid = false;
            }
        });
        if (valid == false)
            return envisionTranslation["PRODUCT_FEATURES"] + "</br>" + error;
        else
            return "";
    }

    // check NameCompetition
    function checkNameCompetition() {
        var error = "";
        $.each($scope.competitions, function (index, item) {
            if (item.name) {
                return;
            }
            else {
                error += envisionTranslation["COLUM"] + " " + (index + 1) + " : " + envisionTranslation["ERR_CRITERIA"] + "</br>";
            }
        });
        return error;
    }

    // check MarketCompetition
    function checkMarketCompetition() {
        var error = "";
        $.each($scope.competitions, function (index, item) {
            if (item.market) {
                return;
            }
            else {
                error += envisionTranslation["COLUM"] + " " + (index + 1) + " : " + envisionTranslation["ERR_MARKET"] + "</br>";
            }
        });
        return error;
    }

}]);
