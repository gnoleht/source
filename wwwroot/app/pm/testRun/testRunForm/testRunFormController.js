'use strict';
app.register.controller('testRunFormController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        $scope.showWindow = true;

        init('testRunForm', $scope, true);

        // hide right menu
        $("#runTestModal .bowtie-view-full-screen").click(function (e) {
            $(e.target).closest(".content_4").toggleClass("show_hidden");
            $(e.target).closest(".content_4").siblings(".content_6").toggleClass("show_hidden");
        });

        $scope.params.url = 'api/';
        $scope.params.url += ($scope.params.pjid ? 'pj/' : 'pm/') + ($scope.params.type === undefined ? 'epic' : $scope.params.type) + '/';
        $scope.initControl();
    });

    $scope.onloadModal = function () {
        $scope.showWindow = false;
        modalPlusEvent('runTestModal');
        $('.advancedDropzoneFile, .advancedDropzoneFile i').dropzone({
            addedfile: function (file) {
                $scope.frmFile = new FormData();
                $scope.frmFile.append("file", file);
                $scope.currentStep.attachFileName = file.name.replace($scope.data.fileExtension, "");

                $scope.postFile("api/pm/testPlan/uploadFiles", $scope.frmFile, function (data) {
                    $scope.currentStep.attachFileId = data;
                });

                $scope.noteChanged();
            }
        });
    };

    $scope.initControl = function () {
        $scope.translation = testRunFormTranslation;
    };

    $scope.dataAction = function (data, currentBuildListId) {
        $.each(data.steps, function (index, item) {
            item.screenshotId = null;
            item.screenshotName = null;
            item.voiceId = null;
            item.voiceName = null;
            item.attachFileId = null;
            item.attachFileName = null;
            item.result = null;
        });
        $scope.data = {};
        angular.copy(data, $scope.data);
        //$scope.action = action;
        $scope.defaultData = $.extend(true, {}, $scope.data);
        $scope.lstTestSteps = $scope.data.steps;
        $scope.currentBuildListId = currentBuildListId;

        if ($scope.data.steps)
            $scope.currentStep = $scope.data.steps[0];

        $("runTestModal").modal()
        callModal('runTestModal', true, 'txtWIName');
    };

    $scope.collapseButton = function () {
        if ($(".multi-collapse").hasClass('show')) {
            $(".multi-collapse").collapse('hide');
        }
        else {
            $(".multi-collapse").collapse('show');
        }
    };

    //result Changed
    $scope.resultChanged = function (data, index) {
        switch (data.result) {
            case "Passed":
                data.result = "Failed";
                break;
            case "Failed":
                data.result = "";
                break;
            default:
                data.result = "Passed";
                break;
        }
    };

    //select Step
    $scope.selectStep = function (item) {
        $scope.currentStep = item;
    };

    //new Bug
    $scope.newBug = function () {
        $scope.$applyAsync(function () {
            var childScope = $scope.$parent.childScope['workItemForm'];
            if (childScope == null) return;
            
            var isOK = true;
            
            var tmp = "<table style=\"border-collapse:collapse; width:99.7149%; height:54px;\" border=\"1\">\n<tbody>\n";
            tmp += "<tr style=\"height:18px; \">\n<th style=\"width:9.60785%; height: 18px; text-align:center; vertical-align:middle; \"><strong>Step No.</strong></th>\n";
            tmp += "<th style=\"width:13.411 %; height:18px; text-align:center; vertical-align:middle; \"><strong>Result</strong></th>\n";
            tmp += "<th style=\"width:80.3011 %; height:18px; text-align:center; vertical-align:middle; \"><strong>Title</strong></th>\n</tr>\n ";
       
            $.each($scope.data.steps, function (index, val) {                
                tmp += "<tr style=\"height:18px;\">\n";
                tmp += "<td style=\"width:9.60785%; height:18px; font-size:14px; text-align:center; vertical-align:middle;\">" + (index + 1) + "</td>\n";

                if (val.result == "Failed") {
                    isOK = false;
                }
                //isOK = isOK && (val.result === "Passed");

                if (val.result === "Passed")
                    tmp += "<td style=\"width:13.411%; height:18px; text-align:center; vertical-align:middle;\"><span style=\"color:green\"><strong>" + val.result + "</strong></span></td>\n";
                else
                    if (val.result == "Failed") tmp += "<td style=\"width:13.411%; height:18px; text-align:center; vertical-align:middle;\"><span style=\"color:red\"><strong>" + val.result + "</strong></span></td>\n";
                    else tmp += "<td style=\"width:13.411%; height:18px; text-align:center; vertical-align:middle;\"><span style=\"color:black\"><strong>" + "Not Run" + "</strong></span></td>\n";                

                tmp += "<td style=\"width:80.3011%; height:18px; font-size:14px;\">\n";

                tmp += "<p>" + val.action + "</p>\n";

                if (val.expectedResults)
                    tmp += "<p> Expected Results: <em>" + val.expectedResults + "</em></p>\n ";

                if (val.note)
                    tmp += "<p> Comment: <em>" + val.note + "</em></p>\n ";

                if (val.screenshotId)
                    tmp += "<p> Screenshot File: <img src=\"/api/system/viewFile?id=" + val.screenshotId + "\"/></p>\n";

                if (val.attachFileId)
                    tmp += "<p> Attachment File: <a href=\"/api/system/ViewFile/" + val.attachFileId + "/" + val.attachFileName + "\" target=\"_blank\" class=\"link\"><i class=\"bowtie-icon bowtie-attach\"></i>" + val.attachFileName + "</a></p>\n";

                if (val.voiceId)
                    tmp += "<p> Voice File: <a href=\"/api/system/ViewFile/" + val.voiceId + "/" + val.voiceName + "\" target=\"_blank\" class=\"link\"><i class=\"bowtie-icon bowtie-attach\"></i>" + val.voiceName + "</a></p>\n";
                  
                tmp += "</td>\n";
                tmp += "</tr>\n";
            });

            if (isOK) {
                showError($scope.translation.ERR_ADD_NEW_BUG);
                return;
            }

            tmp += "</tbody>\n";
            tmp += "</table>";

            $scope.action = 'add';
            $scope.dataChild = {};
            $scope.dataChild.type = 'bug';
            $scope.dataChild.severity = '2';
            $scope.dataChild.phase = '3';
            $scope.dataChild.retrospective = '1';
            $scope.dataChild.bugCategory = '2';
            $scope.dataChild.reproduceSteps = tmp;
            $scope.dataChild.sprint = $scope.$parent.currentTestSuite.sprintId;
            $scope.dataChild.foundInBuild = $scope.$parent.currentBuildList.text;
    
            var testPlan = $scope.$parent.grvTestPlan.getCurrentData();

            //$scope.parentItem = [];
            //$scope.parentItem.id = testPlan.related;
            //$scope.parentItem.type = ''
            //$scope.parentItem.assign = '';
            var relatedItem = {
                //relatedId: $scope.data.id,
                refRelatedId: $scope.testPlanSelectedItem.id,
                type: 'testedby',
                entityType: "PM_WorkItem",
                data: $scope.testPlanSelectedItem
            }
            var related = { testedby: [relatedItem] };
            var parent = $scope.getWorkItemById($scope.testPlanSelectedItem.related);
            childScope.dataAction($scope.action, $scope.dataChild, parent, related);
        });
    };

    $scope.getWorkItemById = function (id) {
        var itemData = {};
        $scope.postData('api/workitem/GetWorkItemById', { id: id }, function (data) {
            itemData = data;
        })
        return itemData;
    }
    //save
    $scope.save = function () {
        $.each($scope.data.steps, function (index, item) {
            item.screenshotId = null;
            item.screenshotName = null;
            item.voiceId = null;
            item.voiceName = null;
            item.attachFileId = null;
            item.attachFileName = null;
        });
        var params = {
            data: $scope.data,
            buildId: $scope.currentBuildListId
        };
        $scope.postData("api/pm/testPlan/runTest", params, function (data) {
            $scope.refreshFrm();
            $scope.defaultData = null;
            $('#runTestModal').modal('hide');
            $scope.$parent.saveRuntest(data);
            //$scope.$parent.testPlanChanged(data);
            showSuccess($scope.translation.SUCCESS_SAVE_DATA);
        });
    };

    //note Changed
    $scope.noteChanged = function () {
        $.each($scope.data.steps, function (index, val) {
            if (val.id === $scope.currentStep.id) {
                val = $scope.currentStep;
            }
        });
        $scope.$applyAsync();
    };

    $scope.removeFile = function (type, step) {
        step[type + 'Id'] = null;
        step[type + 'Name'] = null;
        $scope.currentStep = step;
        $scope.noteChanged();
    };

    //recorder
    $scope.recorder = function () {
        $scope.$applyAsync(function () {
            $scope.childScopeRecorder = $scope.$parent.childScope.recorder;
            if ($scope.childScopeRecorder)
                $scope.childScopeRecorder.initRecoder(function (recorderId) {
                    $scope.currentStep.voiceId = recorderId;
                    $scope.currentStep.voiceName = 'Voice_' + Date.now();
                });
        });
    };

    //screenshot
    $scope.screenshot = function () {
        $scope.$applyAsync(function () {
            var frmFileImages = new FormData();
            var element = document.getElementById('mainView');

            html2canvas(element).then(function (canvas) {
                canvas.toBlob(function (blob) {
                    frmFileImages.append('fileImages', blob);
                    frmFileImages.append("fileName", new Date().toISOString() + '.png');

                    $scope.postFile("api/pm/testPlan/UploadFilesImage", frmFileImages, function (imageId) {
                        $scope.currentStep.screenshotId = imageId;
                        $scope.currentStep.screenshotName = 'Screenshot_' + Date.now();
                    });
                });
            });
        });
    };
}]);