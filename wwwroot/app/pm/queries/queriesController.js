'use strict';
app.register.controller('queriesController', ['$scope', function ($scope) {
    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.save = true;
        $scope.button.refresh = true;
        $scope.button.copy = false;
        $scope.button.search = false;

        //$("#btnSaveAs").show();
        //$("#btnExportExcel").show();
        //$("#btnExecute").show();
    };

    //init
    $scope.$on('$routeChangeSuccess', function () {
        //$scope.postData("api/pm/areas/getListAreas", $scope.params, function (data) {
        //    $scope.setting.valuelist.area = data.map(x => { return { id: x.id, text: x.name }});
        //});

        // click collapse sprint
        $("#queries .sprint_plan dl dt").click(function () {
            $(this).toggleClass("arrow");
        });

        // hide sprint plan
        $("#queries .btn_full").click(function (e) {
            $(e.target).closest(".content_3").toggleClass("show_hidden");
            $(e.target).closest(".content_3").siblings(".content_7").toggleClass("show_hidden");
        });

        $scope.loadQueries();

        if ($scope.grid != null && $scope.grid != undefined) {
            //custom in filter function, data is rowData, return true to show row, false to hide row
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.onClick.subscribe(function (e, args) {
                $("#contextMenu").hide();
                $("#contextMenuMain").hide();
                $scope.collapseChild(e, args);
            });

            $scope.grid.isShowAll = true;

            $scope.grid.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command == 'collapseAll') {
                    if (!args.grid.isShowAll) {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list-tree";
                        args.grid.updateColumnHeader(args.column.id);
                    }

                    $scope.collapseAll(args.grid);
                };
            });

            $scope.grid.editAction = function (grid, data) {
                $scope.$applyAsync(function () {
                    if (data == null) {
                        showError($scope.translation.ERR_SELECT_DATA_EDIT);
                        return;
                    }
                    $scope.data = $.extend(true, {}, data);
                    $scope.action = 'edit';

                    if (data.type == 'testCase') {
                        var arrSprint = $scope.setting.valuelist.sprint.filter(function (item) { return item.id == data.sprint; });
                        if (arrSprint.length != 0)
                            $scope.data.sprintName = arrSprint[0].text;
                    };

                    $scope.childScope.workItemForm.dataAction('edit', $scope.data);
                });
            };

            $scope.grid.onContextMenu.subscribe(function (e, args) {
                e.preventDefault();
                $("#contextMenu").hide();

                var cell = $scope.grid.getCellFromEvent(e);
                if (cell != null) {
                    $scope.grid.setSelectedRows([cell.row]);
                    var item = $scope.grid.dataView.getItemByIdx(cell.row);

                    $scope.$applyAsync(function () { $scope.data = item; });
                    var menuHeight = $("#contextMenu").innerHeight();
                    $("#contextMenu").css({ "top": (e.pageY - menuHeight - 10) + "px", "left": e.pageX + "px" }).show();
                }
            });
        }

        $scope.refresh = function () {
            $scope.loadQueries();
            $scope.selectQueries($scope.currentQuery.id);
            $scope.setQueryModified(false);
        };

        $.ajax({
            url: '/app/pm/valuelist.json',
            async: false,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    var listData = buildValueListData(item);
                    $scope.setting.valuelist[key] = listData.list;
                    $scope.setting.listFilter[key] = listData.listFilter;
                });
            },
        });

        queriesSetting.valuelist = $scope.setting.valuelist;
        queriesSetting.listFilter = $scope.setting.listFilter;

        //$scope.postNoAsync('api/pm/member/getListAreaByObjectId?id=' + $scope.params.pjid, null, function (data) {
        //    $scope.setting.valuelist.area = data;
        //});
    });


    // get list queries
    $scope.loadQueries = function () {
        $scope.post('api/pm/queries/GetList?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.defaultQuery = data.defaultQuery;
            $scope.currentQuery = $.extend(true, {}, $scope.defaultQuery);

            $scope.setting.valuelist.noneParent = data.noneParent;
            $scope.setting.valuelist.myFavorites = data.myFavorites;
            $scope.setting.valuelist.teamFavorites = data.teamFavorites;
            $scope.setting.valuelist.myQueries = data.myQueries;
            $scope.setting.valuelist.currentIteration = data.currentIteration;
            $scope.setting.valuelist.troublesshooting = data.troublesshooting;
            $scope.setting.valuelist.sprint = $scope.setting.valuelist.sprint.concat(data.sprint);
            $scope.setting.valuelist.user = $scope.setting.valuelist.user.concat(data.projectMember);

            if ($scope.currentQuery.queryBuilder && $scope.currentQuery.queryBuilder.length != 0)
                $scope.selectCurrQueries();
            else
                $scope.addRow(0);
        });
    };

    //select Current Queries
    $scope.selectCurrQueries = function () {
        $scope.currentQueryBuilder = $.extend(true, {}, $scope.currentQuery.queryBuilder);

        $.each($scope.currentQuery.queryBuilder, function (index, val) {
            if (val) $scope.setSource(val.field, val.operator, index);
        });

        $scope.loadGrid();

        switch ($scope.currentQuery.parent) {
            case "noneParent":
            case "currentIteration":
            case "troublesshooting":
                $("#deleteQuery").hide();
                $("#renameQuery").hide();
                break;
            default:
                $("#deleteQuery").show();
                $("#renameQuery").show();
                break;
        }
    }

    //select Queries
    $scope.selectQueries = function (id) {
        $scope.post('api/pm/queries/Get?id=' + id, null, function (data) {
            $scope.currentQuery = data;

            $scope.$applyAsync(function () {
                if ($scope.currentQuery.queryBuilder.length != 0)
                    $scope.selectCurrQueries();
                else
                    $scope.addRow(0);
            });
        });
    };

    //rename query
    $scope.renameQuery = function () {
        $scope.action = 'rename';
        $scope.oldName = $scope.currentQuery.name;

        callModal('modal-renameQuery');
        $('#txtName').focus();
    };

    $scope.saveRenameQuery = function () {
        $scope.postNoAsync("api/pm/queries/update", JSON.stringify($scope.currentQuery), function (data) {
            $('#modal-renameQuery').modal('hide');
            $scope.currentQuery = data;

            switch ($scope.currentQuery.parent) {
                //case "noneParent":
                //    $.each($scope.setting.valuelist.noneParent, function (index, val) {
                //        if ($scope.oldName == val.name) {
                //            val.name = $scope.currentQuery.name;
                //        }
                //    });
                //    break;
                case "myFavorites":
                    $.each($scope.setting.valuelist.myFavorites, function (index, val) {
                        if ($scope.oldName == val.name) {
                            val.name = $scope.currentQuery.name;
                        }
                    });
                    break;
                case "teamFavorites":
                    $.each($scope.setting.valuelist.teamFavorites, function (index, val) {
                        if ($scope.oldName == val.name) {
                            val.name = $scope.currentQuery.name;
                        }
                    });
                    break;
                case "myQueries":
                    $.each($scope.setting.valuelist.myQueries, function (index, val) {
                        if ($scope.oldName == val.name) {
                            val.name = $scope.currentQuery.name;
                        }
                    });
                    break;
            }

            showSuccess($scope.translation.SUCCESS_RENAME_DATA);
        });
    };

    //save
    $scope.save = function () {
        if ($scope.currentQuery.name == null) {
            showError($scope.translation.ERR_INPUT_NULL_NAME);
            return;
        }
        else {
            $scope.postNoAsync("api/pm/queries/update", JSON.stringify($scope.currentQuery), function (data) {
                $scope.currentQuery = data;
                $scope.setQueryModified(false);
                showSuccess($scope.translation.SUCCESS_SAVE_DATA);
            });
        }
    };

    //save as
    $scope.saveAs = function () {
        $scope.action = 'saveAs';
        $scope.currentQuery.id = null;
        $scope.currentQuery.name = null;

        callModal('modal-saveAs');
        $('#txtName').focus();
    };

    $scope.saveDetail = function () {
        if ($scope.currentQuery.parent == "currentIteration" || $scope.currentQuery.parent == "troublesshooting")
            showError($scope.translation.ERR_ADD_PERMISSION);
        else {
            if ($scope.currentQuery.name == null) {
                showError($scope.translation.ERR_INPUT_NULL_NAME);
                return;
            }
            else {
                $scope.post("api/pm/queries/add", JSON.stringify($scope.currentQuery), function (data) {
                    $scope.$applyAsync(function () {
                        $('#modal-saveAs').modal('hide');

                        switch (data.parent) {
                            case "noneParent":
                                $scope.setting.valuelist.noneParent.push(data);
                                break;
                            case "myFavorites":
                                $scope.setting.valuelist.myFavorites.push(data);
                                break;
                            case "teamFavorites":
                                $scope.setting.valuelist.teamFavorites.push(data);
                                break;
                            case "myQueries":
                                $scope.setting.valuelist.myQueries.push(data);
                                break;
                            //case "currentIteration":
                            //    $scope.setting.valuelist.currentIteration.push(data);
                            //    break;
                            //case "troublesshooting":
                            //    $scope.setting.valuelist.troublesshooting.push(data);
                            //    break;
                        }

                        $scope.currentQuery = data;

                        if ($scope.currentQuery.queryBuilder.length != 0)
                            $scope.selectCurrQueries();
                    });
                });
            }
        }
    };

    $scope.deleteData = function () {
        if ($scope.action == "deleteQuery") {
            $scope.postNoAsync("api/pm/queries/delete", JSON.stringify($scope.currentQuery), function (data) {
                $scope.$applyAsync(function () {
                    switch ($scope.currentQuery.parent) {
                        //case "noneParent":
                        //    $.each($scope.setting.valuelist.noneParent, function (index, val) {
                        //        if ($scope.currentQuery.name == val.name) {
                        //            $scope.setting.valuelist.noneParent.splice(index, 1);
                        //        }
                        //    });
                        //    break;
                        case "myFavorites":
                            $.each($scope.setting.valuelist.myFavorites, function (index, val) {
                                if ($scope.currentQuery.name == val.name) {
                                    $scope.setting.valuelist.myFavorites.splice(index, 1);
                                }
                            });
                            break;
                        case "teamFavorites":
                            $.each($scope.setting.valuelist.teamFavorites, function (index, val) {
                                if ($scope.currentQuery.name == val.name) {
                                    $scope.setting.valuelist.teamFavorites.splice(index, 1);
                                }
                            });
                            break;
                        case "myQueries":
                            $.each($scope.setting.valuelist.myQueries, function (index, val) {
                                if ($scope.currentQuery.name == val.name) {
                                    $scope.setting.valuelist.myQueries.splice(index, 1);
                                }
                            });
                            break;
                    }

                    $scope.currentQuery = $.extend(true, {}, $scope.defaultQuery);

                    if ($scope.currentQuery.queryBuilder.length != 0)
                        $scope.selectCurrQueries();

                    showSuccess($scope.translation.SUCCESS_SAVE_DATA);
                });
            });
        }
    };

    $scope.deleteQuery = function () {
        $scope.action = "deleteQuery";
        callModal('modal-confirm');
    };

    $scope.executeFunction = function () {
        $scope.loadGrid();
    };

    $scope.exportExcel = function () {
        var dataExport = $scope.grid.dataView.getItems();
        $.each(dataExport, function (index, item) {
            item.assign = item.assignRelated ? item.assignRelated.displayName : '';
            item.area = item.areaRelated ? item.areaRelated.displayName : '';
            item.sprint = item.sprintRelated ? item.sprintRelated.Name : '';
        });
        var arrColumns = [];
        $.each($scope.setting.grid.columns, function (index, item) {
            switch (item.id) {
                case 'assignRelated':
                    arrColumns.push('assign');
                    break;
                case 'sprintRelated':
                    arrColumns.push('sprint');
                    break;
                case 'areaRelated':
                    arrColumns.push('area');
                    break;
                default: 
                    if (item.id != 'id')
                        arrColumns.push(item.id);
                    break;
            }
        });

        var url = 'api/pm/queries/exportExcel';
        var param = {
            name: "Queries",
            dataExport: JSON.stringify(dataExport),
            columns: JSON.stringify(arrColumns)
        };

        var fileID = "";
        $scope.postData(url, param, function (data) {
            fileID = "api/system/ViewFile?id=" + data + "&displayName=true";
        });

        window.location.href = fileID;
    };

    $scope.columnOptions = function () {
        $scope.grid.editSetting();
        $("#" + "aa" + "_headerMenu").hide();
    };

    // display title
    $scope.displayTitle = function () {
        toogleProject(true);
        toogleArea(false);
    };

    //load grid data
    $scope.loadGrid = function () {
        if ($scope.grid != null) {
            var url = $scope.setting.grid.url + "?&id=" + $scope.currentQuery.id + "&pid=" + $scope.params.pid + "&pjid=" + $scope.params.pjid;
            $scope.post(url, JSON.stringify($scope.currentQuery), function (data) {
                $scope.grid.setData(data);
            });
        }
    };

    //add Row
    $scope.addRow = function (vllIndex) {
        if ($scope.currentQuery.queryBuilder) {
            $scope.currentQuery.queryBuilder.splice(vllIndex + 1, 0, { group: false, groupClauses: null, field: "", type: "and", operator: "=", value: "" });
            $scope.currentQueryBuilder = $.extend(true, {}, $scope.currentQuery.queryBuilder);

            $.each($scope.currentQuery.queryBuilder, function (index, val) {
                if (val) $scope.setSource(val.field, val.operator, index);
            });
        }
    };

    //remove Row
    $scope.removeRow = function (vllIndex) {
        $scope.$applyAsync(function () {
            $scope.currentQuery.queryBuilder.splice(vllIndex, 1);
            $scope.currentQueryBuilder = $.extend(true, {}, $scope.currentQuery.queryBuilder);

            if ($scope.currentQuery.queryBuilder.length == 0) {
                $scope.addRow(-1);
            }
            else {
                $.each($scope.currentQuery.queryBuilder, function (index, val) {
                    if (val) $scope.setSource(val.field, val.operator, index);
                });
            }
        });
    };

    //Change Field
    $scope.changeField = function (vllIndex) {
        $scope.currentQuery.queryBuilder[vllIndex].operator = "=";
        var qry = $scope.currentQuery.queryBuilder[vllIndex];
        if (qry) $scope.setSource(qry.field, "=", vllIndex);

        $scope.setQueryModified(true);

        $scope.currentQuery.queryBuilder[vllIndex].value = null;
        $scope.currentQueryBuilder = $.extend(true, {}, $scope.currentQuery.queryBuilder);
    };

    //Change Operator
    $scope.changeOperator = function (vllIndex) {
        var qry = $scope.currentQuery.queryBuilder[vllIndex];
        if (qry) {
            if (qry.operator == "Contains" || qry.operator == "Does Not Contain")
                $scope.setting.valuelist.valueSource[vllIndex] = null;
            else
                $scope.setSource(qry.field, qry.operator, vllIndex, false);
        }

        $scope.setQueryModified(true);
    }

    $scope.setSource = function (field, operator, index, setOperator = true) {
        var valueSource = null;
        var operatorSource = null;

        switch (field) {
            case "Assign":
            case "CreatedBy":
            case "ModifiedBy":
                valueSource = $scope.setting.valuelist.user;
                operatorSource = $scope.setting.valuelist.operatorUser;
                break;
            case "CreatedTime":
            case "ModifiedTime":
            case "LastChangeState":
            case "ActualStartDate":
            case "ActualEndDate":
            case "PlanStartDate":
            case "PlanEndDate":
            case "TargetDate":
            case "LastUpdate":
                valueSource = "DateTime";
                operatorSource = $scope.setting.valuelist.operatorDate;
                break;
            case "Sprint":
                valueSource = $scope.setting.valuelist.sprint;
                operatorSource = $scope.setting.valuelist.operatorIteration;
                break;
            case "Type":
            case "Category":
                valueSource = $scope.setting.valuelist.workItemType;
                operatorSource = $scope.setting.valuelist.operatorUser;
                break;
            case "Area":
                valueSource = $scope.setting.valuelist.area;
                operatorSource = $scope.setting.valuelist.operatorIteration;
                break;
            case "State":
                valueSource = $scope.setting.valuelist.state;
                operatorSource = $scope.setting.valuelist.operatorUser;
                break;
            case "Priority":
                valueSource = $scope.setting.valuelist.priority;
                operatorSource = $scope.setting.valuelist.operatorUser;
                break;
            case "Risk":
                valueSource = $scope.setting.valuelist.risk;
                operatorSource = $scope.setting.valuelist.operatorUser;
                break;
            default:
                valueSource = null;
                operatorSource = $scope.setting.valuelist.operatorUser;
                break;
        }

        if (setOperator) $scope.setting.valuelist.operatorSource[index] = operatorSource;

        //if (valueSource != null) {
        switch (operator) {
            case "Contains":
            case "Does Not Contain":
                $scope.setting.valuelist.valueSource[index] = null;
                break;
            case "= [Field]":
            case "<> [Field]":
            case "> [Field]":
            case "< [Field]":
            case ">= [Field]":
            case "<= [Field]":
                $scope.setting.valuelist.valueSource[index] = $scope.setting.valuelist.vllField;
                break;
            default:
                $scope.setting.valuelist.valueSource[index] = valueSource;
                break;
        }
        //}
    };

    $scope.setQueryModified = function (isModified) {
        if ($scope.currentQuery.IsModified == true && isModified == true) return;

        switch ($scope.currentQuery.parent) {
            case "noneParent":
                $.each($scope.setting.valuelist.noneParent, function (index, val) {
                    if ($scope.currentQuery.id == val.id) {
                        if (isModified == true) {
                            $scope.currentQuery.IsModified = true;
                            val.name = val.name + " *";
                        }
                        else
                            val.name = val.name.replace(" *", "");
                    }
                });
                break;
            case "myFavorites":
                $.each($scope.setting.valuelist.myFavorites, function (index, val) {
                    if ($scope.currentQuery.id == val.id) {
                        if (isModified == true) {
                            $scope.currentQuery.IsModified = true;
                            val.name = val.name + " *";
                        }
                        else
                            val.name = val.name.replace(" *", "");
                    }
                });
                break;
            case "teamFavorites":
                $.each($scope.setting.valuelist.teamFavorites, function (index, val) {
                    if ($scope.currentQuery.id == val.id) {
                        if (isModified == true) {
                            $scope.currentQuery.IsModified = true;
                            val.name = val.name + " *";
                        }
                        else
                            val.name = val.name.replace(" *", "");
                    }
                });
                break;
            case "myQueries":
                $.each($scope.setting.valuelist.myQueries, function (index, val) {
                    if ($scope.currentQuery.id == val.id) {
                        if (isModified == true) {
                            $scope.currentQuery.IsModified = true;
                            val.name = val.name + " *";
                        }
                        else
                            val.name = val.name.replace(" *", "");
                    }
                });
                break;
            case "currentIteration":
                $.each($scope.setting.valuelist.currentIteration, function (index, val) {
                    if ($scope.currentQuery.id == val.id) {
                        if (isModified == true) {
                            $scope.currentQuery.IsModified = true;
                            val.name = val.name + " *";
                        }
                        else
                            val.name = val.name.replace(" *", "");
                    }
                });
                break;
            case "troublesshooting":
                $.each($scope.setting.valuelist.troublesshooting, function (index, val) {
                    if ($scope.currentQuery.id == val.id) {
                        if (isModified == true) {
                            $scope.currentQuery.IsModified = true;
                            val.name = val.name + " *";
                        }
                        else
                            val.name = val.name.replace(" *", "");
                    }
                });
                break;
        }
    };

    // checked Changed
    $scope.checkedChanged = function (data, index) {
        if (data.group) {
            $("#chkGroup_" + index).removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
            data.group = false;
        }
        else {
            $("#chkGroup_" + index).removeClass().addClass("bowtie-icon bowtie-checkbox");
            data.group = true;
        }
    };

    // checked Across Projects
    $scope.checkAcrossProjects = function (data) {
        if (data.acrossProjects) {
            $("#chkAcrossProjects").removeClass().addClass("bowtie-icon bowtie-checkbox-empty");
            data.acrossProjects = false;
        }
        else {
            $("#chkAcrossProjects").removeClass().addClass("bowtie-icon bowtie-checkbox");
            data.acrossProjects = true;
        }
    };

    // change Group Selected Clauses
    $scope.changeGroupSelectedClauses = function () {

    };

    $scope.collapseChild = function (e, args) {
        var dataView = args.grid.dataView;
        if ($(e.target).hasClass("toggle")) {
            var item = dataView.getItem(args.row);
            if (item) {
                if (!item.isCollapsed) {
                    item.isCollapsed = true;
                } else {
                    item.isCollapsed = false;
                }

                dataView.updateItem(item.id, item);
            }
        }
    };

    $scope.collapseAll = function (grid) {
        var array = grid.dataView.getItems().filter(function (x) { return x.hasChild == true; });
        grid.dataView.beginUpdate();
        $.each(array, function (index, item) {
            item.isCollapsed = grid.isShowAll;
            grid.dataView.updateItem(item.id, item);
        });
        grid.dataView.endUpdate();
        grid.invalidate();
        grid.isShowAll = !grid.isShowAll;
    };
}]);