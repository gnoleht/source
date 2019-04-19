'use strict';
app.register.controller('surveyController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        $scope.keyLang = keyLang;

        $scope.refresh = function () {
            $scope.loadData();
        };

        // grvSurveyQuestion
        if (!$scope.grvSurveyQuestion) {
            initSlickGrid($scope, 'grvSurveyQuestion');
            $scope.grvSurveyQuestion.customFilter = function (data) {
                if (data.parent === null) return true;
                var dataView = $scope.grvSurveyQuestion.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent === undefined || parent === null) return true;
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grvSurveyQuestion.onClick.subscribe(function (e, args) {
                $scope.collapseChild(e, args);
            });

            $scope.grvSurveyQuestion.isShowAll = true;
            $scope.grvSurveyQuestion.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command === 'collapseAll') {
                    if (!args.grid.isShowAll) {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list-tree";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    $scope.collapseAll(args.grid);
                }
            });

            $scope.grvSurveyQuestion.editAction = function (grid, data) {
                $scope.editQuestion();
            };
        }

        // refresh
        $scope.refresh();
    });


    $scope.showSurveyResult = function () {
        var currentData = $scope.grid.getCurrentData();
        if (!currentData) return;

        $scope.postData("api/pt/survey/getSurveyResult", { id: currentData.id }, function (data) {
            console.log(data);
        });
    };


    // runSurvey
    $scope.runSurvey = function () {
        var currentData = $scope.grid.getCurrentData();
        if (!currentData) return;

        $scope.postData("api/pt/survey/getSurvey", { id: currentData.id }, function (data) {
            $scope.survey = data[0];
            $scope.surveyQuestion = data[1];
            $scope.surveyResult = data[2];

            if (!$scope.surveyResult) {
                $scope.surveyResult = {};
                $scope.surveyResult.userId = $scope.loginInfo.userId;
                $scope.surveyResult.surveyId = $scope.survey.id;
                $scope.surveyResult.answerSheet = {};
                $.each($scope.surveyQuestion, function (index, question) {
                    $scope.surveyResult.answerSheet[question.id] = {};
                });
            }

            if (data[1]) {
                $scope.grvSurveyQuestion.setData(data[1]);
                $scope.grvSurveyQuestion.invalidate();
            }

            callModal("modal_survey");
        });
    };

    // saveSurvey
    $scope.saveSurvey = function () {
        $scope.postData("api/pt/survey/saveSurvey", $scope.surveyResult, null);
    };

    // load data
    $scope.loadData = function () {
        $scope.grid.loadData();
    };

    // getWidth
    $scope.getWidth = function (w) {
        w++;
        return "width: calc(100% / " + w + ")";
    };

    // collapse all
    $scope.collapseAll = function (grid) {
        var array = grid.dataView.getItems().filter(function (x) { return x.hasChild === true; });
        grid.dataView.beginUpdate();
        $.each(array, function (index, item) {
            item.isCollapsed = grid.isShowAll;
            grid.dataView.updateItem(item.id, item);
        });
        grid.dataView.endUpdate();
        grid.invalidate();
        grid.isShowAll = !grid.isShowAll;
    };

    // collapseChild
    $scope.collapseChild = function (e, args) {
        var item = $scope.grvSurveyQuestion.dataView.getItem(args.row);
        if ($(e.target).hasClass("toggle")) {
            if (item) {
                if (!item.isCollapsed) {
                    item.isCollapsed = true;
                    $(e.target).removeClass("fa fa-angle-down").addClass("fa fa-angle-right");
                } else {
                    item.isCollapsed = false;
                    $(e.target).removeClass("fa fa-angle-right").addClass("fa fa-angle-down");
                }
                $scope.grvSurveyQuestion.dataView.updateItem(item.id, item);
            }
            e.stopImmediatePropagation();
        }
    };

    // add
    $scope.add = function () {
        $scope.data = {};
        $scope.action = 'add';
        callModal("modal_detail");
        // resizeCanvas
        $scope.grvSurveyQuestion.resizeCanvas();
    };

    // addQuestion
    $scope.addQuestion = function (type) {
        $scope.typeAddQuestion = type;
        $scope.dataQuestion = {};
        callModal("modal_detail_question");
    };

    // editQuestion
    $scope.editQuestion = function () {
        var currentData = $scope.grvSurveyQuestion.getCurrentData();
        if (!currentData)
            return;
        $scope.dataQuestion = currentData;
        callModal("modal_detail_question");
    };

}]);