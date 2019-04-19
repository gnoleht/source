'use strict';
app.register.controller('workItemFormController', ['$scope', '$location', '$sce', 'authService', '$route', function ($scope, $location, $sce, authService, $route) {
    $scope.$on('$routeChangeSuccess', function () {
        init('workItemForm', $scope, true);
        $scope.findLink = {};
        $scope.authService = authService;
        $scope.params.url = 'api/';
        $scope.params.url += (($scope.params.pjid ? 'pj/' : 'pm/') + ($scope.params.type == undefined ? 'epic' : $scope.params.type) + '/');

        $scope.initControl();

        $scope.tinymceOptions.setup = function (editor) {
            editor.on('keyup', function (e) {
                if (e.keyCode == 27) {
                    $('#modal-detail').modal('hide');
                }
            });
            editor.on("click",function (e) {
                $('.context-popover').hide();
            });
        };
    });

    $scope.onload = function () {
        modalPlusEvent('modal-detail');
    };

    $scope.initControl = function () {
        $scope.translation = workItemFormTranslation;

        if ($scope.$parent.setting.valuelist && $scope.$parent.setting.listFilter && $scope.$parent.setting.valuelist.state) {
            $scope.setting.valuelist = $scope.$parent.setting.valuelist;
            $scope.setting.listFilter = $scope.$parent.setting.listFilter;
            workItemFormSetting.valuelist = $scope.setting.valuelist;
            workItemFormSetting.listFilter = $scope.setting.listFilter;
        }
        else {
            $.ajax({
                url: '/app/pm/valuelist.json',
                async: false,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    $.each(data, function (key, item) {
                        var listData = buildValueListData(item);
                        $scope.setting.valuelist[key] = listData.list;
                        $scope.setting.listFilter[key] = listData.listFilter;
                    });
                    if ($scope.params.page === 'myKanban') {
                        $scope.setting.valuelist.state.splice(3, 1);
                    }
                }
            });
        }
        //Check combobox this
        if ($scope.params.type == 'requirement') {
            $scope.postData('api/personas/getlist', { pid: $scope.params.pid, pjid: $scope.params.pjid }, function (data) {
                $scope.setting.valuelist.personas = data;
            });
        }

        $.ajax({
            url: '/app/pm/workItemReasons.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $scope.workItemReasons = data;
            },
        });

        workItemFormSetting.valuelist = $scope.setting.valuelist;

        var url = 'api/pm/Sprint/CheckSprintApprove?pjid=' + $scope.params.pjid + '&spr=' + $scope.params.spr;
        $scope.postNoAsync(url, null, function (data) {
            if (!data)//sprint approved
                $scope.setting.valuelist.state = $scope.setting.valuelist.state.filter(x => x.id != "removed");
        });
    };

    $scope.dataAction = function (action, data, parentData, related) {
        if (action == 'delete') $scope.delete(data);
        else {
            data.category = data.category ? data.category : data.type;
            data.typeName = data.type == 'userstory' ? 'User Story' : capitalizeText(data.type);
            if (data.type == 'requirement') {
                $scope.setting.valuelist.typeCategory = [{ id: 'requirement', text: 'Requirement' }, { id: 'changerequest', text: 'Change request' }]
            }
            if (data.type == 'function') {
                $scope.setting.valuelist.typeCategory = [{ id: 'functional', text: 'Functional' }, { id: 'nonfunctional', text: 'Non Functional' }]
                data.category = 'functional';
            }

            $scope.data = {};
            angular.copy(data, $scope.data);

            $scope.action = action;

            $scope.history = [];
            $scope.discussion = [];
            $scope.listFileRelated = [];
            $scope.listFileUpload = [];
            $scope.folders = [];
            $scope.listFileRemove = [];

            $scope.attachments = [];

            $scope.relatedList = {};

            if (action == 'add') {
                if (parentData) {
                    $scope.parentData = parentData;
                    $scope.data.parent = parentData.id;
                    $scope.data.parentType = parentData.type;
                    $scope.data.assign = $scope.data.assign ? $scope.data.assign : parentData.assign;
                    if (!$scope.data.area) $scope.data.area = parentData.area;
                } else $scope.parentData = null;

                if (related) {
                    $scope.relatedList = angular.copy(related);
                }
                if ($scope.params.module == 'pj' && $scope.data.type == 'task' && isNullOrEmpty($scope.data.name)) {
                    if ($scope.data.area) {
                        var area = $scope.getAreaById($scope.data.area);
                        $scope.data.name = area ? '[' + area.code + '] ' : '';
                    }
                    else if ($scope.menuParams.area) {
                        $scope.data.name = '[' + $scope.menuParams.area + '] ';
                    } else if ($scope.menuParams.pjid) {
                        $scope.data.name = '[' + $scope.menuParams.pjid + '] ';
                    }
                }

                if (!$scope.data.state) $scope.data.state = 'new';
                $scope.data.priority = $scope.data.priority ? $scope.data.priority : '3-Normal';
                $scope.data.risk = $scope.data.risk ? $scope.data.risk : 'Medium';
                $scope.data.size = $scope.data.size ? $scope.data.size : $scope.data.type == 'userstory' ? 1 : 0;
                if (isNullOrEmpty($scope.data.area)) $scope.data.area = $scope.params.area;
                $scope.data.originalEstimate = $scope.data.originalEstimate ? $scope.data.originalEstimate : 0;
                $scope.data.remaining = $scope.data.remaining ? $scope.data.remaining : 0;
                $scope.data.completed = $scope.data.completed ? $scope.data.completed : 0;
                //$scope.controlCollapse("show");
            }
            else {
                $scope.listChildRemove = [];
                $scope.GetRelatedWork();
                //$scope.controlCollapse("hide");
            }

            $scope.getAttachment($scope.data.id);
            $scope.defaultData = $.extend(true, {}, $scope.data);
            $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
            $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
            $(".multi-collapse").collapse('show');

            $scope.cmbBuilder();

            callModal('modal-detail', true, 'txtWIName');

            if ($scope.data.type === 'testCase') {
                setTimeout(function () {
                    if (!$scope.data.steps) $scope.data.steps = [];

                    $scope.data.parent = null;
                    $scope.data.parentType = null;

                    if (!$scope.grvTestSteps) {
                        initSlickGrid($scope, 'grvTestSteps');
                        $scope.grvTestSteps.editAction = function () { };

                        $scope.grvTestSteps.onAddNewRow.subscribe(function (e, args) {
                            var col = args.column.field;
                            var itemValue = args.item;
                            var item = {};

                            item.id = $scope.grvTestSteps.dataView.getLength();
                            item.action = col === "action" ? itemValue.action : "";
                            item.expectedResults = col === "expectedResults" ? itemValue.expectedResults : "";
                            item.note = null;

                            $scope.grvTestSteps.dataView.addItem(item);
                            $scope.grvTestSteps.invalidateRows(item.id);
                            $scope.grvTestSteps.updateRowCount();
                            $scope.grvTestSteps.render();
                            $scope.grvTestSteps.resizeCanvas();
                        });
                    }

                    $scope.grvTestSteps.setData($scope.data.steps);
                    $('#grvTestSteps').height(157);
                    $scope.fullTestStep(false);
                    if ($scope.grvTestSteps) $scope.grvTestSteps.resizeCanvas();
                    $scope.grvTestSteps.selectedRow(0);
                });
            };
        }
    };

    $scope.fullTestStep = function (full) {
        if ($('#testStepWrapper').hasClass('fullscreen') || full === false) {
            $('#fullTestStepButton').removeClass('bowtie-view-full-screen-exit').addClass('bowtie-view-full-screen');//.toggleClass('bowtie-view-full-screen').toggleClass('bowtie-view-full-screen-exit');
            $('#testStepWrapper').css({
                'position': 'relative',
                'width': '100%',
                'left': '0',
                'height': 'initial'
            });
            $('#grvTestSteps').height(157);
            $scope.grvTestSteps.resizeCanvas();
            $('#testStepWrapper').removeClass('fullscreen');
        }
        else {
            $('#fullTestStepButton').removeClass('bowtie-view-full-screen').addClass('bowtie-view-full-screen-exit');
            var height = $('#testStepWrapper').parent().height();
            $('#testStepWrapper').height(height);
            $('#testStepWrapper').parent().height(height);
            $('#testStepWrapper').css({
                'position': 'absolute',
                'width': 'calc(100% - 30px)',
                'left': '10px'
            });
            $('#grvTestSteps').height(height - 30);
            $scope.grvTestSteps.resizeCanvas();
            $('#testStepWrapper').addClass('fullscreen');
        };
        //$('#testStepWrapper').toggleClass('fullscreen');
    };

    $scope.save = function () {
        if (isNullOrEmpty($scope.data.name)
            || ($scope.params.module == 'pj' && $scope.data.type == 'task' && isNullOrEmpty($scope.data.name) && $scope.action == 'add')) {
            showWarning($scope.translation.ERR_INPUT_NULL_NAME);
            return;
        }

        if (!angular.equals($scope.data, $scope.defaultData) || $scope.data.changed) {
            if ($scope.checkFiled()) {
                if ($scope.data.type == 'testCase') {
                    $scope.data.parent = null;
                    if ($scope.data.steps) {
                        $scope.data.steps = $scope.data.steps.filter(function (item) {
                            if (!isNullOrEmpty(item.action) || !isNullOrEmpty(item.expectedResults)) {
                                return item;
                            }
                        });
                        $.each($scope.data.steps, function (index, item) {
                            item.id = index;
                        });
                        //$scope.data.changed = true;
                    }
                }
                $scope.frmFile = new FormData();
                if ($scope.action == 'edit') {
                    $scope.buildAttachment(); // Build data file attach from directive listAttachment
                    $scope.buildRelated();

                    if (!$scope.params.pjid) $scope.data.isProductWorkItem = true;
                    $scope.frmFile.append("data", JSON.stringify($scope.data));

                    $scope.postFile($scope.params.url + 'update', $scope.frmFile, function (data) {
                        $scope.refreshFrm();
                        $scope.defaultData = null;
                        $('#modal-detail').modal('hide');
                        $scope.$parent.saveWorkItem(data);
                        showSuccess($scope.translation.SUCCESS_SAVE_DATA);
                    });
                }
                else {
                    if ($scope.checkCreate()) {
                        if (!$scope.data.productId) $scope.data.productId = $scope.params.pid;
                        if (!$scope.data.projectId) $scope.data.projectId = $scope.params.pjid;

                        $scope.data.isDeploy = $scope.params.pjType == '2';
                        $scope.buildAttachment(); // Build data file attach from directive listAttachment
                        $scope.buildRelated();

                        $scope.frmFile.append("data", JSON.stringify($scope.data));

                        $scope.postFile($scope.params.url + 'add', $scope.frmFile, function (data) {
                            $scope.refreshFrm();
                            $scope.defaultData = null;
                            $('#modal-detail').modal('hide');
                            $scope.$parent.saveWorkItem(data);
                            showSuccess($scope.translation.SUCCESS_SAVE_DATA);
                        });
                    }
                }
            }
        }
        else {
            $scope.refreshFrm();
            $scope.defaultData = null;
            $('#modal-detail').modal('hide');
        }
    };

    $scope.delete = function (item) {
        if (item !== undefined && item !== null && item !== {}) {
            $scope.post($scope.params.url + 'delete', JSON.stringify(item), function () {
                if ($scope.$parent.deleteWorkItem != null && $scope.$parent.deleteWorkItem != undefined)
                    $scope.$parent.deleteWorkItem(true, item);
            });
        }
    };

    $scope.getAreaById = function (id) {
        var result = null;
        if (id) {
            $scope.postData('api/workitem/GetListArea', { id: id }, function (data) {
                result = data;
            });
        }
        return result;
    }

    $scope.changeArea = function () {
        if ($scope.action == "add" && $scope.data.type == 'task' && $scope.data.area) {
            var area = $scope.getAreaById($scope.data.area);
            $scope.data.name = area ? '[' + area.code + '] ' : '';
            $scope.defaultData.name = $scope.data.name;
        }
        $scope.data.sprint = null;
    }

    $scope.includePopover = function () {

        $('.context-popover').on('hide', function (e) { //hide.bs.modal
            e.stopPropagation();
        });

    };

    $scope.changePlanDate = function (fileds) {
        var startDate = $scope.data.planStartDate;
        var endDate = $scope.data.planEndDate;
        if (!isNullOrEmpty(startDate) && !isNullOrEmpty(endDate)) {
            if (startDate > endDate) {
                if (fileds == 'startDate') {
                    startDate = $scope.data.planStartDate = $scope.data.planEndDate;
                }
                else {
                    endDate = $scope.data.planEndDate = $scope.data.planStartDate;
                }
            }
            $scope.data.planDuration = $scope.getWorkDuration(startDate, endDate);
        }
        else {
            if ($scope.data.type == 'task')
                if (!endDate) {
                    $scope.data.planEndDate = $scope.data.planStartDate;
                }
                else {
                    $scope.data.planStartDate = $scope.data.planEndDate;
                }
            $scope.data.planDuration = 1;
        }
    }

    $scope.getWorkDuration = function (start, end) {
        var totalDay = 1;
        $scope.postData('api/workitem/GetWorkDuration', { starDate: start, endDate: end }, function (data) {
            totalDay = data;
        });
        return totalDay;
    }

    //Customize combobox
    $scope.cmbBuilder = function () {
        $scope.cmbAssign.params.pid = $scope.params.pid;
        $scope.cmbAssign.params.pjid = $scope.params.pjid;

        $scope.cmbSprint.params.pjid = $scope.params.pjid;

        $scope.cmbArea.params.pjid = $scope.params.pjid;
    }

    $scope.cmbSprint = {
        url: 'api/pm/sprint/GetList',
        params: {
            pjid: $scope.params.pjid
        }
    }

    $scope.cmbAssign = {
        url: "api/workitem/GetListAssign",
        allowClear: true,
        params: {
            //id: $scope.data.assign,
            pid: $scope.params.pid,
            pjid: $scope.params.pjid
        },
        templateResult: function (state, element) {
            if (!state.id) {
                return state.text;
            }
            if (state.text == '') {
                return null;
            }
            var baseUrl = "/api/system/viewfile?id=" + state.avatar + "&def=/img/no_avatar.png";
            var $state = $(
                '<div class="clearfix"><span class= "img_user_tb img_over_28 float-left" style = "background-image: url(\'' + baseUrl + '\');" ></span > <span class="middle_30 txt_cut txt_cut_01 float-right">' + state.text + '</span></div>'
            );
            return $state;
        },
        templateSelection: function (state, element) {
            if (!state.id) {
                return state.text;
            }
            if (state.text == '') {
                return null;
            }
            var baseUrl = "/api/system/viewfile?id=" + state.avatar + "&def=/img/no_avatar.png";
            var $state = $(
                '<span class="img_user_tb img_over_28 float-left" style="background-image: url(\'' + baseUrl + '\');"></span><span class="middle_30 txt_cut">' + state.text + '</span>'
            );
            return $state;
        },
    };

    $scope.cmbArea = {
        url: "api/workitem/GetListArea",
        allowClear: true,
        params: {
            pjid: $scope.params.pjid
        }
    };

    $scope.configState = {
        templateResult: function (data) {
            return data.id && data.text ? $('<span><i class="fa fa-circle status_' + data.id.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>') : null;
        },
        templateSelection: function (data) {
            return data.id && data.text ? $('<span><i class="fa fa-circle status_' + data.id.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>') : null;
        }
    };

    $scope.changeState = function () {
        if (!$scope.defaultData) return;
        var oldVal = $scope.defaultData.state;
        var newVal = $('#vllState').val();
        var valuelist = $scope.workItemReasons[$scope.defaultData.type][oldVal][newVal];
        if (valuelist == null) {
            $scope.data.reason = null;
            $scope.setting.valuelist.reasons = null;
        }
        else {
            $scope.setting.valuelist.reasons = valuelist;
            $scope.data.reason = valuelist[0];
            setTimeout(function () {
                $('#vllReason').val(0).trigger('change.select2');
            }, 50);
        }
    };

    $scope.changeOriginal = function () {
        if ($scope.data.type == 'task' && $scope.action == 'add') {
            $scope.data.remaining = $scope.data.originalEstimate;
            $scope.$digest();
        }
    };

    //Customize select2 state
    $scope.configPriority = {
        templateResult: function (data) {
            return data.id && data.text ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        },
        templateSelection: function (data) {
            return data.id && data.text ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        }
    };

    //Lấy thông tin lịch sử
    $scope.getHistory = function () {
        $scope.post($scope.params.url + 'gethistory?id=' + $scope.data.id, null, function (data) {
            var listFilter = $scope.setting.listFilter;
            $.each(data, function (index, val) {
                data[index].oldValue = JSON.parse(val.oldValue);
                data[index].newValue = JSON.parse(val.newValue);
                var dataOldVal = data[index].oldValue;
                var dataNewVal = data[index].newValue;
                data[index].createdTime = moment(data[index].createdTime).fromNow();
                if ($scope.data.type === 'testCase') {
                    var noneSteps = [];
                    if (dataNewVal && dataNewVal.Steps && dataNewVal.Steps.length > 0) {
                        $.each(dataNewVal.Steps, function (index, step) {
                            var oldStep = dataOldVal.Steps ? dataOldVal.Steps[index] : null;
                            if (!angular.equals(oldStep, step)) {
                                delete step.Id;
                                dataNewVal["Step-" + (index + 1)] = step;
                            } else noneSteps.push(index);
                        });
                        delete dataNewVal.Steps;
                    }
                    if (dataOldVal && dataOldVal.Steps && dataOldVal.Steps.length > 0) {
                        $.each(dataOldVal.Steps, function (index, step) {
                            if (noneSteps.indexOf(index) === -1) {
                                delete step.Id;
                                dataOldVal["Step-" + (index + 1)] = step;
                            }
                        });
                        delete dataOldVal.Steps;
                    }
                }
                
                if (dataNewVal != null) {
                    if (dataNewVal.Personas != undefined) {
                        dataNewVal.Personas = dataNewVal.Personas.join(', ');
                    }
                    $.each(dataNewVal, function (key, value) {
                        if (dataOldVal[key] == undefined)
                            dataOldVal[key] = value === true ? false : '';
                        var fieldName = toLowerFirstLetter(key);
                        if (listFilter[fieldName] && listFilter[fieldName][value]) dataNewVal[key] = listFilter[fieldName][value].text;
                    });
                }
                if (val.oldValue != null) {
                    if (dataOldVal.Personas != undefined) {
                        dataOldVal.Personas = dataOldVal.Personas.join(', ');
                    }
                    $.each(dataOldVal, function (key, value) {
                        if (dataNewVal[key] == undefined)
                            dataNewVal[key] = value === true ? false : '';
                        var fieldName = toLowerFirstLetter(key);
                        if (listFilter[fieldName] && listFilter[fieldName][value]) dataOldVal[key] = listFilter[fieldName][value].text;
                    });
                }
            });
            $scope.history = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };

    //Lấy comment theo id
    $scope.getComment = function () {
        $scope.post($scope.params.url + 'getcomment?id=' + $scope.data.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.discussion = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };
    //Đăng comment theo id
    $scope.postComment = function (comment) {
        if ($scope.data.id) {
            if (comment && comment.content != "") {
                comment.PMId = $scope.data.id.toString();
                $scope.postNoAsync($scope.params.url + 'postcomment', JSON.stringify(comment), function (data) {
                    comment.createdByRelated = $scope.authService.user;
                    var thisTime = new Date();
                    comment.createdTime = moment(thisTime).fromNow();
                }, function () { comment = false; });

                var feed = {};
                feed.content = comment.content;

                //var userReed = [];
                //userReed.push($scope.authService.user.id);
                //$scope.data.sendTime = new Date();

                feed.groupId = $scope.data.area ? $scope.data.area : $scope.data.projectId ? $scope.data.projectId : $scope.data.productId;
                feed.groupType = $scope.data.area ? "area" : $scope.data.projectId ? "project" : "product";

                //$scope.data.userRead = userReed;
                //feed.attachments = null;
                feed.refType = 'comment';
                feed.refId = $scope.data.id;
                feed.feedType = $scope.data.type;
                feed.refEntity = "PM_WorkItem";
                //feed.parentId = null;
                $scope.postData("api/pm/Feed/CreateFeed", { feed: feed });
                return comment;
            }
            else {
                showWarning("Empty input comment content!");
            }
        }
        else {
            showError();
        }
        return false;
    };

    $scope.GetRelatedWork = function () {
        $scope.relatedList = {};
        $scope.postNoAsync($scope.params.url + 'GetRelatedWork?id=' + $scope.data.id, null, function (data) {
            if (data.parent) {
                $scope.parentData = data.parent;
            }
            else {
                $scope.parentData = null;
            }
            if (data.childs != null) {
                var relatedChilds = [];
                $.each(data.childs, function (index, item) {
                    var relatedItem = {
                        relatedId: $scope.data.id,
                        refRelatedId: item.id,
                        type: 'child',
                        entityType: 'PM_WorkItem',
                        data: item
                    };
                    relatedChilds.push(relatedItem);
                });
                $scope.relatedList.child = relatedChilds;
            }
            if (data.relateds != null && data.relateds.length > 0) {
                $.each(data.relateds, function (index, item) {
                    $scope.relatedList[item.type] = $scope.relatedList[item.type] == undefined ? [] : $scope.relatedList[item.type];
                    $scope.relatedList[item.type].push(item);
                });
            }
        });
    };

    $scope.checkCreate = function () {
        //var message = [];
        //if ($scope.data.type == 'task' && ($scope.data.originalEstimate == 0 || isNullOrEmpty($scope.data.originalEstimate))){
        //    message.push('Must input Original Estimate');
        //}
        //if (message.length == 0) {
        //    return true;
        //}
        //showWarning(message.join(', '));
        //return false;
        return true;
    };

    $scope.checkFiled = function () {
        if (
            $scope.data.state == undefined || $scope.data.state == null || $scope.data.state.length <= 0
            || $scope.data.priority == undefined || $scope.data.priority == null || $scope.data.priority.length <= 0
        ) { showError($scope.translation.ERR_NOT_NULL_INPUT); return false; }

        return true;
    };

    $scope.collapseButton = function () {
        if ($(".multi-collapse").hasClass('show')) {
            $(".multi-collapse").collapse('hide');
        }
        else {
            $(".multi-collapse").collapse('show');
        }
    };

    //add new Step
    $scope.addRow = function () {
        Slick.GlobalEditorLock.commitCurrentEdit();
        var selectedRow = $scope.grvTestSteps.getCurrentData();
        if (selectedRow) {
            var selectedIndex = selectedRow.id;
            var stepsLength = $scope.data.steps.length;
            if (selectedIndex + 1 < stepsLength) {
                $scope.data.steps.splice(selectedIndex + 1, 0, { id: "newId", action: '', expectedResults: '', fileName: '', note: null });
                $scope.grvTestSteps.setData($scope.data.steps);
                $scope.grvTestSteps.selectedRow(selectedIndex + 1);
            }
        }
        //var vllIndex = $scope.grvTestSteps.dataView.getLength();
        //var lastRow = $scope.grvTestSteps.dataView.getItem(vllIndex);
        //if (lastRow) {
        //    if (!$scope.data.steps)
        //        $scope.data.steps = [];

        //    $scope.data.steps.splice(vllIndex, 0, { id: vllIndex, action: '', expectedResults: '', fileId: null, fileName: '', note: null });
        //}

        //$scope.grvTestSteps.setData($scope.data.steps);
    };
    $scope.moveUp = function () {
        var selectedRow = $scope.grvTestSteps.getCurrentData();
        if (selectedRow) {
            var selectedIndex = selectedRow.id;
            if (selectedIndex > 0) {
                $scope.data.steps = arrayMove($scope.data.steps, selectedIndex, selectedIndex - 1);
                $scope.grvTestSteps.setData($scope.data.steps);
                var rowIdxSelect = (selectedIndex < 1 ? 1 : selectedIndex) - 1;
                debugger;
                $scope.grvTestSteps.selectedRow(rowIdxSelect);
            }
        }
    };
    $scope.moveDown = function () {
        var selectedRow = $scope.grvTestSteps.getCurrentData();
        if (selectedRow) {
            var selectedIndex = selectedRow.id;
            var stepsLength = $scope.data.steps.length;
            if (selectedIndex + 1 < stepsLength) {
                $scope.data.steps = arrayMove($scope.data.steps, selectedIndex, selectedIndex + 1);
                $scope.grvTestSteps.setData($scope.data.steps);
                var rowIdxSelect = selectedIndex + 1;
                $scope.grvTestSteps.selectedRow(rowIdxSelect);
            }
        }
    };

    //remove Step
    $scope.removeRow = function () {
        var selectedRow = $scope.grvTestSteps.getCurrentData();
        if (selectedRow) {
            var selectedIndex = selectedRow.id;
            $scope.data.steps.splice(selectedIndex, 1);
            $scope.grvTestSteps.setData($scope.data.steps);
            $scope.grvTestSteps.selectedRow(selectedIndex);
        }
        //$scope.$applyAsync(function () {
        //    var selectedItem = $scope.grvTestSteps.getDataItem($scope.grvTestSteps.getSelectedRows([0]));
        //    var vllIndex = selectedItem == null ? 0 : selectedItem.id;

        //    $scope.data.steps.splice(vllIndex, 1);


        //    $.each($scope.data.steps, function (index, val) {
        //        val.id = index;
        //    });

        //    $scope.grvTestSteps.setData([]);
        //    $scope.grvTestSteps.setData($scope.data.steps);
        //});
    };
}]);