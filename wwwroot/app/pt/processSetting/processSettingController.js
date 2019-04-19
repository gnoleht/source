'use strict';
app.register.controller('processSettingController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    // displayFunction
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.search = true;
        $scope.button.save = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
        $scope.button.search = false;
        $('#btnSetting').hide();
    };

    // change levels
    $scope.changeLevels = function () {
        var year = moment().year();
        if ($scope.currentYear)
            year = parseInt($scope.currentYear);
        // value list levels
        var levels = [
            {
                "id": "self_level",
                "text": {
                    "vn": "Điểm " + year,
                    "en": "Point " + year
                }
            },
            {
                "id": "board_level",
                "text": {
                    "vn": "Điểm đoàn " + year,
                    "en": "Board " + year
                }
            },
            {
                "id": "plan_level",
                "text": {
                    "vn": "Điểm " + (year + 1),
                    "en": "Point " + (year + 1)
                }
            }
        ];

        $scope.setting.valuelist.levels = buildValueListData(levels).list;
    };

    $scope.attachments = { files: [] };
    // $routeChangeSuccess
    $scope.$on('$routeChangeSuccess', function () {
        $('.advancedDropzoneAttachment').on({
            'click': function (e) {
                e.preventDefault();
                e.stopPropagation();

                var input = $(document.createElement('input'));
                input.attr("type", "file");
                input.attr("multiple", 'multiple');
                input.on("change", function (e) {
                    var files = this.files;
                    $.each(files, function (idx, item) {
                        $scope.attachments.files.push(item);
                    });
                });
                input.trigger('click');
            }
        });


        // change levels
        $scope.changeLevels();

        // document click
        $(document).click(function (e) {
            if (!$(e.target).hasClass("criteria-assessment"))
                $("#context_menu_assessment").hide();

            if (!$(e.target).hasClass("edit-department"))
                $("#contextMenuDepartment").hide();
        });

        // value list
        $.ajax({
            url: '/app/pt/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                });
            }
        });

        // valuelist level
        $scope.setting.valuelist.status = $scope.setting.valuelist.criteriaStatus;
        $scope.setting.valuelist.selfLevel = $scope.setting.valuelist.criteriaLevel;
        $scope.setting.valuelist.boardLevel = $scope.setting.valuelist.criteriaLevel;
        $scope.setting.valuelist.planLevel = $scope.setting.valuelist.criteriaLevel;

        if ($scope.grid) {
            // setColumnOption
            $scope.grid.setColumnOption('selfLevel', { name: $scope.setting.valuelist.levels.find(x => x.id === "self_level").text });
            $scope.grid.setColumnOption('boardLevel', { name: $scope.setting.valuelist.levels.find(x => x.id === "board_level").text });
            $scope.grid.setColumnOption('planLevel', { name: $scope.setting.valuelist.levels.find(x => x.id === "plan_level").text });

            $scope.grid.customFilter = function (data) {
                if (data.parent === null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent === undefined || parent === null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.onClick.subscribe(function (e, args) {
                $scope.collapseChild(e, args);
            });

            $scope.grid.isShowAll = true;
            $scope.grid.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
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

            $scope.grid.editAction = function (grid, data) { };

            // load data
            $scope.loadData();

            $scope.post('api/pt/processSetting/getYear', null, function (data) {
                $scope.loadPortalYear(data, moment().year());
            });
        }

        if (!$scope.grvCriteriaCategoryDetail) {
            initSlickGrid($scope, 'grvCriteriaCategoryDetail');

            //$scope.grvCriteriaCategoryDetail.editAction = function (grid, data) { };

            $scope.grvCriteriaCategoryDetail.dataView.bufferRemoveData = [];
            $scope.grvCriteriaCategoryDetail.setColumnDataSource('level', $scope.setting.valuelist.criteriaLevel);

            $scope.grvCriteriaCategoryDetail.setColumnEditorFormat('level', function (state) {
                if (!state.id) return state.text;

                return $('<div style="width:fit-content;display:flex;height:30px">'
                    + '<span class="txt_cut" style="width:150;float:left;line-height:30px"><span class="criteria_level_' + state.id + '"> ' + state.text + '</span></span>');
            });

            $scope.grvCriteriaCategoryDetail.editAction = function (grid, data) {
                // editDetail
                $scope.editDetail();
            };
        }

        // get department
        $scope.getDepartment();

        // search
        $scope.refresh = function () {
            // load data
            $scope.loadData($scope.currentYear);
        };

        $(window).resize(function (e) {
            if ($scope.grvImport)
                $scope.grvImport.resizeCanvas();

            if ($scope.grvAssessment)
                $scope.grvAssessment.resizeCanvas();

            if ($scope.grid)
                $scope.grid.resizeCanvas();

            if ($scope.grvCriteriaCategoryDetail)
                $scope.grvCriteriaCategoryDetail.resizeCanvas();
        });
        $(window).resize();
    });

    // get department
    $scope.getDepartment = function () {
        $scope.postData('api/sys/company/get', null, function (data) {
            if (data) {
                var dataValueList = data.map(function (item) {
                    return { id: item.id, text: item.name, type: item.type };
                });
                $scope.setting.valuelist.executorDepartment = dataValueList;
                $scope.setting.valuelist.supportDepartment = dataValueList;
                $scope.setting.valuelist.monitorDepartment = dataValueList;

                $scope.departments = dataValueList;
            }
        });
    };

    // config Department
    $scope.configDepartment = {
        templateResult: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.type === '1')
                    color = '#f98f05';
                else if (nodeOpt.type === '2')
                    color = '#fcd036';
                else if (nodeOpt.type === '3')
                    color = '#00b19d';
                else if (nodeOpt.type === '4')
                    color = '#0e62c7';
                return $('<span style="margin-left: ' + nodeOpt.type * 10 + 'px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        },
        templateSelection: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.type === '1')
                    color = '#f98f05';
                else if (nodeOpt.type === '2')
                    color = '#fcd036';
                else if (nodeOpt.type === '3')
                    color = '#00b19d';
                else if (nodeOpt.type === '4')
                    color = '#0e62c7';
                return $('<span style="margin-left: 10px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        }
    };

    $scope.changedYear = function (year) {
        $scope.loadData(year);
        // change levels
        $scope.changeLevels();

        // setColumnOption
        $scope.grid.setColumnOption('selfLevel', { name: $scope.setting.valuelist.levels.find(x => x.id === "self_level").text });
        $scope.grid.setColumnOption('boardLevel', { name: $scope.setting.valuelist.levels.find(x => x.id === "board_level").text });
        $scope.grid.setColumnOption('planLevel', { name: $scope.setting.valuelist.levels.find(x => x.id === "plan_level").text });
    };

    // load data
    $scope.loadData = function (year) {
        if (year) $scope.currentYear = year;
        else $scope.currentYear = moment().year();
        $scope.params.currentYear = $scope.currentYear;

        $scope.postData('api/pt/processSetting/get', $scope.params, function (data) {
            if (data) {
                $scope.setting.indentMax = Math.max(...data.map(x => x.indent));
                $scope.grid.setData(data);

                $scope.setting.valuelist.parent = data.filter(x => x.indent !== 3).map(function (item) {
                    return { id: item.id, text: item.name, indent: item.indent };
                });
            }
        });
    };

    // configParent
    $scope.configParent = {
        templateResult: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.indent === 0)
                    color = '#f98f05';
                else if (nodeOpt.indent === 1)
                    color = '#fcd036';
                else if (nodeOpt.indent === 2)
                    color = '#00b19d';
                else if (nodeOpt.indent === 3)
                    color = '#0e62c7';
                return $('<span style="margin-left: ' + nodeOpt.indent * 10 + 'px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        },
        templateSelection: function (data) {
            if (!data.id) return data.text;
            if (!data.text) return null;
            var nodeOpt = JSON.parse(data.element.attributes.opt.value);
            if (nodeOpt !== null) {
                var color = '#ff6264';
                if (nodeOpt.indent === 0)
                    color = '#f98f05';
                else if (nodeOpt.indent === 1)
                    color = '#fcd036';
                else if (nodeOpt.indent === 2)
                    color = '#00b19d';
                else if (nodeOpt.indent === 3)
                    color = '#0e62c7';
                return $('<span style="margin-left: 10px;padding-left: 10px;border-left: 4px solid ' + color + '">' + data.text + '</span>');
            }
            else return data.text;
        }
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
        var item = $scope.grid.dataView.getItem(args.row);
        if ($(e.target).hasClass("toggle")) {
            if (item) {
                if (!item.isCollapsed) {
                    item.isCollapsed = true;
                    $(e.target).removeClass("fa fa-angle-down").addClass("fa fa-angle-right");
                } else {
                    item.isCollapsed = false;
                    $(e.target).removeClass("fa fa-angle-right").addClass("fa fa-angle-down");
                }
                $scope.grid.dataView.updateItem(item.id, item);
            }
            e.stopImmediatePropagation();
        }
        else if ($(e.target).hasClass("edit-department")) {
            if (item) {
                $scope.data = item;
                $("#contextMenuDepartment").css({
                    "top": getMenuPosition(e.clientY, 'height', 'scrollTop', 'contextMenuDepartment'),
                    "left": getMenuPosition(e.clientX, 'width', 'scrollLeft', 'contextMenuDepartment') + 5
                }).show();
            }
        }
    };

    // #region import

    // callModalImport
    $scope.callModalImport = function () {
        callModal('modal_import');

        // import
        $scope.grvImport = null;
        if (!$scope.grvImport) {
            initSlickGrid($scope, 'grvImport');

            $scope.grvImport.customFilter = function (data) {
                if (data.parent === null) return true;
                var dataView = $scope.grvImport.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent === undefined || parent === null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grvImport.onClick.subscribe(function (e, args) {
                var item = $scope.grvImport.dataView.getItem(args.row);
                if ($(e.target).hasClass("toggle")) {
                    if (item) {
                        if (!item.isCollapsed) {
                            item.isCollapsed = true;
                            $(e.target).removeClass("fa fa-angle-down").addClass("fa fa-angle-right");
                        } else {
                            item.isCollapsed = false;
                            $(e.target).removeClass("fa fa-angle-right").addClass("fa fa-angle-down");
                        }
                        $scope.grvImport.dataView.updateItem(item.id, item);
                    }
                    e.stopImmediatePropagation();
                }

                if ($(e.target).hasClass("checkWI")) {
                    $scope.checkItemImport(item);
                }
            });

            $scope.grvImport.editAction = function (grid, data) { };
        }

        // load data import
        $scope.postData('api/pt/criteriaCategory/Get', null, function (data) {
            if (data) {
                var dataGrid = $scope.grid.dataView.getItems();
                angular.forEach(data, function (item) {
                    if (dataGrid.map(x => x.criteriaCategoryId).includes(item.id)) {
                        if (item.year) {
                            var arr = [];
                            $.each(item.year.split(','), function () {
                                arr.push(parseInt($.trim(this)));
                            });
                            if (arr.includes($scope.currentYear))
                                item.checked = true;
                            else
                                item.checked = false;
                        }
                        else
                            item.checked = true;
                    }
                    else {
                        item.checked = false;
                    }
                });

                if (data.length > 0 && data.length === data.filter(x => x.checked === true).length)
                    $("#ckbAllWorkItem").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
                else
                    $("#ckbAllWorkItem").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');

                $scope.grvImport.setData(data);
                $timeout(function () {
                    $scope.grvImport.resizeCanvas();
                }, 200);
            }
        });

        $("#ckbAllWorkItem").off("click").on("click", function () {
            // checkAllItemImport
            $scope.checkAllItemImport();
        });
    };

    // checkItemImport
    $scope.checkItemImport = function (item) {
        if (item.checked) item.checked = false;
        else item.checked = true;
        var gridImportData = $scope.grvImport.dataView.getItems();
        if (gridImportData.length === gridImportData.filter(x => x.checked === true).length)
            $("#ckbAllWorkItem").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
        else
            $("#ckbAllWorkItem").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');

        $scope.grvImport.dataView.updateItem(item.id, item);
    };

    // checkAllItemImport
    $scope.checkAllItemImport = function () {
        var gridImportData = $.extend(true, [], $scope.grvImport.dataView.getItems());
        if ($("#ckbAllWorkItem").hasClass('bowtie-checkbox-empty')) {
            $("#ckbAllWorkItem").removeClass('bowtie-checkbox-empty').addClass('bowtie-checkbox');
            angular.forEach(gridImportData, function (item) {
                item.checked = true;
            });
        }
        else {
            $("#ckbAllWorkItem").removeClass('bowtie-checkbox').addClass('bowtie-checkbox-empty');
            angular.forEach(gridImportData, function (item) {
                item.checked = false;
            });
        }

        $scope.grvImport.setData(gridImportData);
    };

    // save import
    $scope.saveImport = function () {
        var params = {
            ids: $scope.grvImport.dataView.getItems().filter(x => x.checked === true).map(x => x.id),
            currentYear: $scope.currentYear
        };
        $scope.postData("api/pt/ProcessSetting/import", params, function (data) {
            if (data) {
                $scope.loadData($scope.currentYear);
                $('#modal_import').modal('hide');
                showSuccess($scope.translation.SUCCESS_TAB);
            }
        });
    };

    // #endregion

    // #region assessment

    // callAssessment
    $scope.callAssessment = function (id) {
        var temp = $("#btnAssessment").position();
        var inputSearchWidth = $("#inputSearch").width();
        $("#context_menu_assessment").css({ "top": temp.top + 40 + "px", "right": inputSearchWidth + 60 + "px" }).show();
    };

    // showModalAssessment
    $scope.showModalAssessment = function (typeLevel) {
        $scope.typeLevel = typeLevel;
        callModal('modal_assessment');

        // set null  $scope.grvAssessment
        $scope.grvAssessment = null;
        // grvAssessment
        if (!$scope.grvAssessment) {
            initSlickGrid($scope, 'grvAssessment');

            // customFilter
            $scope.grvAssessment.customFilter = function (data) {
                if (data.parent === null) return true;
                var dataView = $scope.grvAssessment.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent === undefined || parent === null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            // onClick
            $scope.grvAssessment.onClick.subscribe(function (e, args) {
                var item = $scope.grvAssessment.dataView.getItem(args.row);
                $scope.currentParentData = $scope.grvAssessment.dataView.getItemById(item.parent);

                if ($(e.target).hasClass("toggle")) {
                    if (item) {
                        if (!item.isCollapsed) {
                            item.isCollapsed = true;
                            $(e.target).removeClass("fa fa-angle-down").addClass("fa fa-angle-right");
                        } else {
                            item.isCollapsed = false;
                            $(e.target).removeClass("fa fa-angle-right").addClass("fa fa-angle-down");
                        }
                        $scope.grvAssessment.dataView.updateItem(item.id, item);
                    }
                    e.stopImmediatePropagation();
                }

                if ($(e.target).hasClass("text_accept")) {
                    if (item) {
                        item.typeAssessmentStatus = true;
                        if (typeLevel === "self_level")
                            item.selfLevelAssessmentStatus = true;
                        else if (typeLevel === "board_level")
                            item.boardLevelAssessmentStatus = true;
                        else
                            item.planLevelAssessmentStatus = true;

                        $scope.grvAssessment.dataView.updateItem(item.id, item);
                        // save import
                        $scope.saveAssessment(item);
                    }
                }
                else if ($(e.target).hasClass("text_release")) {
                    if (item) {
                        item.typeAssessmentStatus = false;
                        if (typeLevel === "self_level")
                            item.selfLevelAssessmentStatus = false;
                        else if (typeLevel === "board_level")
                            item.boardLevelAssessmentStatus = false;
                        else
                            item.planLevelAssessmentStatus = false;

                        $scope.grvAssessment.dataView.updateItem(item.id, item);
                        // save import
                        $scope.saveAssessment(item);
                    }
                }
            });

            // headerButtonsPlugin
            $scope.grvAssessment.isShowAll = true;
            $scope.grvAssessment.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
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

                    var array = $scope.grvAssessment.dataView.getItems().filter(function (x) { return x.hasChild === true; });
                    $scope.grvAssessment.dataView.beginUpdate();
                    $.each(array, function (index, item) {
                        item.isCollapsed = $scope.grvAssessment.isShowAll;
                        $scope.grvAssessment.dataView.updateItem(item.id, item);
                    });
                    $scope.grvAssessment.dataView.endUpdate();
                    $scope.grvAssessment.invalidate();
                    $scope.grvAssessment.isShowAll = !$scope.grvAssessment.isShowAll;
                }
            });

            $scope.grvAssessment.editAction = function (grid, data) { };
        }

        // load data import
        var data = $.extend(true, [], $scope.grid.dataView.getItems());

        $.each(data, function (index, item) {
            if (typeLevel === "self_level") {
                item.typeLevel = item.selfLevel;
                item.typeAssessmentStatus = item.selfLevelAssessmentStatus;
            }
            else if (typeLevel === "board_level") {
                item.typeLevel = item.boardLevel;
                item.typeAssessmentStatus = item.boardLevelAssessmentStatus;
            }
            else {
                item.typeLevel = item.planLevel;
                item.typeAssessmentStatus = item.planLevelAssessmentStatus;
            }
        });

        $scope.grvAssessment.setData(data);
        $timeout(function () {
            $scope.grvAssessment.resizeCanvas();
        }, 200);
    };

    // save Assessment
    $scope.saveAssessment = function (data) {
        var params = {
            data: data,
            typeLevel: $scope.typeLevel
        };
        $scope.postData("api/pt/ProcessSetting/assessment", params, function (data) {
            if (data) {
                if ($scope.typeLevel === "self_level") {
                    data.typeLevel = data.selfLevel;
                    data.typeAssessmentStatus = data.selfLevelAssessmentStatus;
                }
                else if ($scope.typeLevel === "board_level") {
                    data.typeLevel = data.boardLevel;
                    data.typeAssessmentStatus = data.boardLevelAssessmentStatus;
                }
                else {
                    data.typeLevel = data.planLevel;
                    data.typeAssessmentStatus = data.planLevelAssessmentStatus;
                }

                data.indent = $scope.currentParentData.indent;
                data.hasChild = $scope.currentParentData.hasChild;
                $scope.grvAssessment.dataView.updateItem(data.id, data);
            }
        });
    };

    // close Assessment
    $scope.closeAssessment = function () {
        $scope.loadData($scope.currentYear);
        $('#modal_assessment').modal('hide');
    };

    // #endregion

    // #region improve

    // callModalImprove
    $scope.callModalImprove = function () {
        var data = $scope.grid.getCurrentData();
        if (data && data.indent === 2) {
            if (!data.priority)
                data.priority = '1-Urgent';
            $scope.data = data;

            // readonly
            $scope.readonlyFiled(true);
            callModal('modal_improve');
            // grvCriteriaCategoryDetail
            var dataCriteriaCategoryDetail = $.extend(true, [], $scope.grid.dataView.getItems().filter(x => x.parent === data.id && x.isImproveCriteria === true));
            $scope.grvCriteriaCategoryDetail.setData(dataCriteriaCategoryDetail);
            $timeout(function () {
                $scope.grvCriteriaCategoryDetail.resizeCanvas();
            }, 200);
        }
    };

    // closeImprove
    $scope.closeImprove = function () {
        $('#modal_improve').modal('hide');
    };

    // saveImprove
    $scope.saveImprove = function () {
        if (!$scope.data.priority) {
            showWarning($scope.translation.ERR_PRIORITY_REQUIRED);
            return;
        }

        var params = {
            data: $scope.data
        };
        $scope.postData("api/pt/processSetting/saveImprove", params, function (data) {
            if (data) {
                $scope.loadData($scope.currentYear);
                $('#modal_improve').modal('hide');
                showSuccess($scope.translation.SUCCESS_TAB);
            }
        });
    };

    // addDetail
    $scope.addDetail = function () {
        $scope.attachments = { files: [] };
        $scope.listRemoves = [];

        var data = $scope.grid.dataView.getItems();
        var dataCriteriaCategoryDetail = $scope.grvCriteriaCategoryDetail.dataView.getItems().map(x => x.id);
        $scope.setting.valuelist.levelDetail = data.filter(x => x.parent === $scope.data.id && !dataCriteriaCategoryDetail.includes(x.id)).map(function (item) {
            return { id: item.id, text: item.name, indent: item.indent };
        });

        $scope.levelDetail = null;
        $scope.dataChild = {
            implementationPlan: 'consolidate',
            status: 'undeveloped',
            deadline: moment()
        };

        $('#levelDetail_improve_criteria').attr("disabled", false);
        $scope.actionChild = 'add';
        callModal('modal_improve_criteria');
    };

    // editDetail
    $scope.editDetail = function () {
        $scope.attachments = { files: [] };
        $scope.listRemoves = [];

        var currentData = $scope.grvCriteriaCategoryDetail.getCurrentData();
        if (currentData) {
            $scope.setting.valuelist.levelDetail = $scope.grid.dataView.getItems().filter(x => x.parent === $scope.data.id).map(function (item) {
                return { id: item.id, text: item.name, indent: item.indent };
            });

            var data = $scope.grid.dataView.getItemById(currentData.id);
            $scope.levelDetail = data.id;

            $('#levelDetail_improve_criteria').attr("disabled", true);

            $scope.dataChild = $.extend(true, {}, currentData);
            $scope.actionChild = 'edit';
            callModal('modal_improve_criteria');
        }
    };

    // saveImproveCriteria
    $scope.saveImproveCriteria = function () {
        if (!validateData($scope.dataChild, $scope.setting, $scope.translation)) return;

        $scope.frmFile = new FormData();
        $.each($scope.attachments.files, function (idx, file) {
            $scope.frmFile.append('files', file);
        });
        if (!$scope.levelDetail) {
            showWarning($scope.translation.ERR_LEVELDETAIL_REQUIRED);
            return;
        }

        $scope.frmFile.append('data', JSON.stringify($scope.dataChild));
        $scope.frmFile.append('fileRemoves', JSON.stringify($scope.listRemoves));
        $scope.postFile('api/pt/processSetting/saveImproveCriteria', $scope.frmFile, function (data) {
            $scope.attachments = { files: [] };
            $scope.listRemoves = [];

            if ($scope.actionChild === 'add') {
                var rowCount = $scope.grvCriteriaCategoryDetail.dataView.getLength();
                $scope.grvCriteriaCategoryDetail.dataView.insertItem(rowCount, data);

                var array = $scope.setting.valuelist.levelDetail;
                $scope.setting.valuelist.levelDetail = array.filter(function (value) {
                    return value.id !== data.id;
                });
            }
            else {
                $scope.grvCriteriaCategoryDetail.dataView.updateItem(data.id, data);
            }

            $scope.grvCriteriaCategoryDetail.resizeCanvas();
            $('#modal_improve_criteria').modal('hide');
        });
    };

    // closeImproveCriteria
    $scope.closeImproveCriteria = function () {
        $('#modal_improve_criteria').modal('hide');
    };

    // readonly
    $scope.readonlyFiled = function (flag) {
        $('#parent').attr("disabled", flag);
        $('#selfLevel').attr("disabled", flag);
        $('#boardLevel').attr("disabled", flag);
        $('#planLevel').attr("disabled", flag);
    };

    // configPriority
    $scope.configPriority = {
        templateResult: function (data) {
            return data.id && data.text ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        },
        templateSelection: function (data) {
            return data.id && data.text ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        }
    };

    // configState
    $scope.configState = {
        templateResult: function (data) {
            var obj = $scope.setting.valuelist.criteriaStatus.find(x => x.id === data.id);
            return data.id && data.text ? $('<span><i class="' + obj.icon + '"bowtie-icon bowtie-square"></i>&nbsp;' + data.text + '</span>') : null;
        },
        templateSelection: function (data) {
            var obj = $scope.setting.valuelist.criteriaStatus.find(x => x.id === data.id);
            return data.id && data.text ? $('<span><i class="' + obj.icon + '"bowtie-icon bowtie-square"></i>&nbsp;' + data.text + '</span>') : null;
        }
    };

    // changeLevelDetail
    $scope.changeLevelDetail = function () {
        var data = $scope.grid.dataView.getItemById($scope.levelDetail);
        var oldData = $.extend(true, {}, $scope.dataChild);
        data.implementationPlan = oldData.implementationPlan;
        if (!data.executorDepartment)
            data.executorDepartment = oldData.executorDepartment;
        data.supportDepartment = oldData.supportDepartment;
        data.improvementDetail = oldData.improvementDetail;
        data.checkingMethod = oldData.checkingMethod;
        data.checkingGuideline = oldData.checkingGuideline;
        data.deadline = oldData.deadline;
        data.monitorDepartment = oldData.monitorDepartment;
        data.status = oldData.status;
        data.reason = oldData.reason;

        $scope.dataChild = data;
    };

    // #endregion improve

    $scope.editDepartment = function (id) {
        $("#contextMenuDepartment").hide();
        $scope.data.executorDepartment = id;
        var params = {
            id: $scope.data.id,
            executorDepartment: $scope.data.executorDepartment
        };
        $scope.postData("api/pt/ProcessSetting/executorDepartment", params, function (data) {
            if (data) {
                $scope.loadData($scope.currentYear);
            }
        });
    };

    // removeFile
    $scope.removeFile = function (fileId, e) {
        $scope.listRemoves.push(fileId);
        $(e.target).closest('li').remove();
    };
}]);