'use strict';
app.register.controller('releasePlanningController', ['$scope', 'authService', '$timeout', function($scope, authService, $timeout) {
    //init    
    var preventPopup = false;
    $scope.$on('$routeChangeSuccess', function () {
        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function(data) {
                $.each(data, function(key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
            },
        });

        $scope.setting.valuelist.areas = [];
        $.ajax({
            url: 'api/pm/project/getarea',
            type: 'get',
            data: {
                pjid: $scope.menuParams.pjid
            },
            dataType: 'json',
            cache: false,
            async: false,
            success: function (response) {
                $.each(response.data, function (i, val) {
                    var item = {
                        id: val.id,
                        text: val.name
                    };
                    $scope.setting.valuelist.areas.push(item);
                });
            }
        });

        $scope.grid.onDblClick.subscribe(function(e, args) {
            var cell = $scope.grid.getCellFromEvent(e);
            $scope.grid.setSelectedRows([cell.row]);
            $scope.$applyAsync(function () {
                $scope.editSprint();
            });
        });

        $scope.grid.onClick.subscribe(function(e, args) {
            if ($(e.target).hasClass("checkIsShow")) {
                var data = $scope.grid.dataView.getItem(args.row);
                if (data != null && data.isPlan == true && data.approveStatus != "approved") {
                    data.isShow = !data.isShow;

                    $scope.grid.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $scope.listCheckShow.push(data);
                }
            };
        });

        $scope.refresh = function (callback) {
            $scope.loadData(function () {
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
                if (callback)
                    callback();
            });
        };

        setSelectedMenu("pblEstimating");

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.refresh();
        };

        $scope.refresh();
    });


    $scope.defaultPjMember = [];
    $scope.defaultCapacityList = [];

    $scope.listCheckShow = [];


    $scope.displayFunction = function() {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
        //$("#btnSprintSetting").show();
    };

    $scope.displayTitle = function() {
        toogleProject(true);
    };


    $scope.onLoadModal = function() {
        $(window).resize(function() {
            var height = $("#modal-setting .modal-body-detail").css('max-height');
            var tabHeight = parseInt(height, 10) - 53 - 50 - 25;
            $("#modal-setting .tab-content").height(tabHeight);
        });
    };

    $scope.onload = function () {
        //$(".page-loader").show();
    }


    $scope.loadData = function (callback) {
        var searchValue = $("#inputSearch").val();
        var params = {
            pjid: $scope.params.pjid,
            area: $scope.params.area,
            searchValue: searchValue
        }
        $scope.postDataAsync('api/pm/PlanDetail/Get_Data_Kanban', params, function (data) {
            //if (data.listData == null || data.listData.length == 0) {
            //    $(".page-loader").hide();
            //    return;
            //}

            $scope.data_Kanban = data.listData;
            $scope.TotalSizeKanban = data.totalSizeKanban;
            $scope.data_sprint = data.listSprint;

            $scope.dataUnParent = $scope.data_Kanban.filter(x => x.parent == null).length > 0 ? $scope.data_Kanban.filter(x => x.parent == null)[0].listChild : null;
            $scope.dataHaveParent = $scope.data_Kanban.filter(x => x.parent != null).length > 0 ? $scope.data_Kanban.filter(x => x.parent != null) : null;


            if (callback)
                callback();
        });
    }


    $scope.loadKanbanRelease = function (parentLast, last) {
        if (parentLast == undefined) $(".page-loader").hide();
        if (!parentLast || !last) return;
        $(".column").sortable({
            connectWith: ".column",
            placeholder: "block-placeholder",
            scroll: true,
            cursor: "move",
            remove: function(event, ui) {
                //var a = parseInt($("#" + $(this).data("column")).text());
                //var b = parseInt(ui.item.data("size"));
                //$("#" + $(this).data("column")).text(a - b);
            },
            receive: function (event, ui) {
                var block = null;
                var type = ui.item.data("type");
                var childId = ui.item.data("child");;
                var indexParent = ui.item.data("indexparent");
                var indexChild;
                if (type == 1) {
                    indexChild = $scope.dataUnParent.findIndex(x => x.id == childId);               
                    block = $scope.dataUnParent[indexChild];
                }
                else {
                    indexChild = $scope.dataHaveParent[indexParent].listChild.findIndex(x => x.id == childId);
                    block = $scope.dataHaveParent[indexParent].listChild[indexChild];                                        
                }

                $scope.blockOld = angular.copy(block);

                //var a = parseInt($("#" + $(this).data("column")).text());
                //var b = parseInt(ui.item.data("size"));
                //$("#" + $(this).data("column")).text(a + b);


                block.parent = $(this).data("row");
                block.sprint = $(this).data("column") == "" ? null : $(this).data("column");

                $scope.UpdateOnchangeRelease(block, type, function () {
                    $scope.refresh(function () {
                        ui.item.remove();
                    });
                });


                preventPopup = true;
            }
        }).disableSelection();
        $(".page-loader").hide();
    }

    $scope.UpdateOnchangeRelease = function (block, type, callback) {
        $scope.postDataAsync('api/pj/' + block.type + '/update', { data: JSON.stringify(block)}, function (result) {
            if (callback)
                callback();            
        });
    }

    $scope.blockBox = function(value) {
        if (value == "function")
            return "box_blue";
        else
            return "box_violet";
    }

    $scope.priorityColor = function(value) {
        if (value == "1-Urgent")
            return "priority_urgent";
        else if (value == "2-High")
            return "priority_high";
        else if (value == "3-Normal")
            return "priority_normal";
        else
            return "priority_low";
    }


    $scope.saveWorkItem = function (data) {
        $scope.refresh();
    };

    $scope.addChild = function () {
       // console.log("addChild Release");
    }

    $scope.editblock = function (parentIndex, childId, type) {
        var childIndex;
        if (preventPopup == false || navigator.userAgent.indexOf('Firefox') == -1) {
            var data = {};
            if (type == 1) {
                childIndex = $scope.dataUnParent.findIndex(x => x.id == childId);
                data = $scope.dataUnParent[childIndex];
            }
            else if (type == 2) {
                childIndex = $scope.dataHaveParent[parentIndex].listChild.findIndex(x => x.id == childId);
                data = $scope.dataHaveParent[parentIndex].listChild[childIndex];
            }               
            else
                data = $scope.dataHaveParent[parentIndex].parent;

            if (data == null || data == undefined) {
                showError($scope.translation.ERR_SELECT_DATA_EDIT);
            }
            else {
               // $scope.typeP = type;
                $scope.childScope.workItemForm.dataAction('edit', data, null);
            }         
        } 
        
        preventPopup = false;
    };

    //--------------------------  SPRINT --------------------------------------------------------


    $scope.Load_Data_Sprint = function () {
        var params = {
            pjid: $scope.params.pjid,
            area: $scope.params.area
        };
        $scope.postData("api/pm/Sprint/GetListSprintIsPlan", params, function (data) {
            $scope.dataSprintSetting = data.listData;
            $scope.totalPoint = data.totalPoint;
            $scope.minStartDate = data.minStartDate;
            $scope.maxEndDate = data.maxEndDate;
        });
    }

    $scope.sprintSetting = function () {
        callModal("modal-setting");
        $scope.Load_Data_Sprint();
        $scope.grid.setData($scope.dataSprintSetting);
        var columns = $scope.grid.getColumns();

        var isTotal = false;
        var isStDay = false;
        var isEndDay = false;

        var total = 0;
        var stDay = 15;
        var endDay = 15;

        $.each(columns, function (index, column) {
            if (column.field != "velocity" && !isTotal)
                total += column.width;
            else {
                isTotal = true;
            }

            if (column.field != "startDate" && !isStDay)
                stDay += column.width;
            else {
                isStDay = true;
            }

            if (column.field != "endDate" && !isEndDay)
                endDay += column.width;
            else {
                isEndDay = true;
            }

        });

        $(".footerSprint>span:nth(0)").css("left", total + "px");
        $(".footerSprint>span:nth(1)").css("left", stDay + "px");
        $(".footerSprint>span:nth(2)").css("left", endDay + "px");

        $(window).resize();
    };

    // load pj member
    $scope.loadPjMember = function () {
        $scope.defaultCapacityList = [];
        // load pj member
        $scope.postNoAsync('api/pm/Member/GetList?pjid=' + $scope.params.pjid, null, function (data) {
            $scope.defaultPjMember = data;
            // pjMember
            $.each(data, function (index, obj) {
                $scope.defaultCapacityList.push({
                    UserId: obj.id,
                    Activity: "Deployment",
                    CapacityDays: 9.0,
                    DayOffCount: 0.0,
                    DayOffList: []
                });
            });
        });
    }

    $scope.addSprint = function () {
        $scope.loadPjMember();

        $scope.data = {};
        $scope.action = 'add';
        //$scope.data.CapacityList = $scope.defaultCapacityList;
        // load pj member
        $scope.postNoAsync('api/pm/Member/get?pjid=' + $scope.params.pjid + '&area=' + $scope.params.area + '&module=pj', null, function (data) {
            $scope.data.capacityList = [];
            if (data) {
                // pjMember
                $.each(data, function (index, obj) {
                    $scope.data.capacityList.push({
                        UserId: obj.userId,
                        Activity: "Deployment",
                        CapacityDays: 9.0,
                        DayOffCount: 0.0,
                        DayOffList: []
                    });
                });
            }
        });

        $scope.data.WorkingDayList = [
            {
                "DayId": "monday",
                "Day": "Monday",
                "SelectDay": true,
                "FullDay": 9,
                "Morning": null,
                "Afternoon": null,
                "TotalHours": 9,
                "DayOfWeek": 1
            },
            {
                "DayId": "tuesday",
                "Day": "Tuesday",
                "SelectDay": true,
                "FullDay": 9,
                "Morning": null,
                "Afternoon": null,
                "TotalHours": 9,
                "DayOfWeek": 2
            },
            {
                "DayId": "webnesday",
                "Day": "Webnesday",
                "SelectDay": true,
                "FullDay": 9,
                "Morning": null,
                "Afternoon": null,
                "TotalHours": 9,
                "DayOfWeek": 3
            },
            {
                "DayId": "thursday",
                "Day": "Thursday",
                "SelectDay": true,
                "FullDay": 9,
                "Morning": null,
                "Afternoon": null,
                "TotalHours": 9,
                "DayOfWeek": 4
            },
            {
                "DayId": "friday",
                "Day": "Friday",
                "SelectDay": true,
                "FullDay": 9,
                "Morning": null,
                "Afternoon": null,
                "TotalHours": 9,
                "DayOfWeek": 5
            },
            {
                "DayId": "saturday",
                "Day": "Saturday",
                "SelectDay": false,
                "FullDay": null,
                "Morning": null,
                "Afternoon": null,
                "TotalHours": 0,
                "DayOfWeek": 6
            },
            {
                "DayId": "sunday",
                "Day": "Sunday",
                "SelectDay": false,
                "FullDay": null,
                "Morning": null,
                "Afternoon": null,
                "TotalHours": 0,
                "DayOfWeek": 0
            }
        ];

        $scope.data.WorkingWithbugs = "tasks";
        $scope.data.ApproveStatus = "pending";
        $scope.data.velocity = Math.round($scope.totalPoint / $scope.dataSprintSetting.length);

        var lastItem = $scope.dataSprintSetting[$scope.dataSprintSetting.length - 1];
        if (lastItem) {
            var newStartDate = addWeekdays(lastItem.endDate, 1);
            var newEndDate = addWeekdays(newStartDate, lastItem.workingDays - 1);
            $scope.data.startDate = newStartDate;
            $scope.data.endDate = newEndDate;
            $scope.data.workingDays = lastItem.workingDays;
        }
        callModal('modal-detail-sprint');
        $('#release-name').focus();
    }

    function addWeekdays(date, days) {
        date = moment(date);
        while (days > 0) {
            date = date.add(1, 'days');
            if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
                days -= 1;
            }
        }
        return date;
    }


    $scope.editSprint = function () {
        $scope.listCheckShow = [];
        var data = $scope.grid.getCurrentData();
        if (data == null) {
            showError($scope.translation.ERR_SELECT_DATA_EDIT);
            return;
        }
        if (data.approveStatus == "approved") {
            showWarning($scope.translation.WARNING_APPROVED);
            return;
        }
            

        $scope.action = 'edit';
        $scope.data = angular.copy(data);
        callModal('modal-detail-sprint');
    }



    $scope.refreshSprint = function () {
        $scope.Load_Data_Sprint();
        $scope.grid.setData($scope.dataSprintSetting);
        $scope.refresh();
    }


    $scope.saveSprint = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        $scope.data.productId = $scope.params.pid;
        $scope.data.projectId = $scope.params.pjid;

        $scope.data.startDate = moment($scope.data.startDate).format();
        $scope.data.endDate = moment($scope.data.endDate).format();

        if ($scope.action == 'add') {
            $scope.data.isPlan = true;
            $scope.data.isShow = true;

            // area
            if ($scope.params.area) {
                $scope.data.areas = [];
                $scope.data.areas.push($scope.params.area);
            }

            $scope.postNoAsync("api/pm/Sprint/Add_Sprint", JSON.stringify($scope.data),
                function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail-sprint').modal('hide');


                   $scope.$applyAsync(function () {
                        $scope.Load_Data_Sprint();
                       $scope.grid.setData($scope.dataSprintSetting);

                   });

                },
                function (data) {
                    $scope.refreshFrm(['data']);
                });
        }
        else {
            var params = {
                itemData: $scope.data,
                area: $scope.params.area
            };

            $scope.postData("api/pm/Sprint/Update_Sprint", params,
                function (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail-sprint').modal('hide');

                    $scope.$applyAsync(function () {
                        $scope.Load_Data_Sprint();
                        $scope.grid.setData($scope.dataSprintSetting);
                   });

                },
                function (data) {
                    $scope.refreshFrm(['data']);
                });
        }
    }

    $scope.deleteSprint = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) {
            showError($scope.translation.ERR_SELECT_DATA_DELETE);
            return;
        }
        if (data.approveStatus == "approved") {
            showWarning($scope.translation.WARNING_APPROVED);
            return;
        }


        $scope.dataDelete = data;
        $('#modal-confirm').modal();
    }

    $scope.deleteData = function () {   
        var params = {
            itemData : $scope.dataDelete,
            area : $scope.params.area
        }
        $scope.postData("api/pm/Sprint/Delete_Sprint", params, function (data) {
            $scope.$applyAsync(function () {
                $scope.Load_Data_Sprint();
                $scope.dataSprintSetting = $scope.dataSprintSetting.filter(obj => obj.id != data.id);
                $scope.grid.setData($scope.dataSprintSetting);
                $scope.refresh();
            });
        });
    };


    $scope.saveAndClose = function () {
        if ($scope.data) {
            $scope.postData("api/pm/Sprint/UpdateSprints", { listData: $scope.listCheckShow }, function (data) {
                $scope.listCheckShow = [];
                $scope.refresh();
            });
        }
    }

    $scope.expanded = function (e) {
        $(e.target).parents(".tr").toggleClass("expanded");
    };


    function calculateOffDay(startDate, endDate) {

        var totalOffDay = 0;
        while (startDate < endDate) {
            startDate = startDate.add(1, 'days');
            if (startDate.isoWeekday() == 6 || startDate.isoWeekday() == 7) {
                totalOffDay += 1;
            }
        }
        return totalOffDay;
    }

    $scope.onChangeDate = function () {

        var start_Date = moment($('#startDate').val(), "DD/MM/YYYY");
        var end_Date = moment($('#endDate').val(), "DD/MM/YYYY");

        if ($('#startDate').val() && $('#endDate').val()) {
            if (end_Date >= start_Date) {
                var duration = moment.duration(end_Date.diff(start_Date));
                var totalOffDay = calculateOffDay(start_Date, end_Date);
                $scope.data.workingDays = parseFloat(duration.asDays() + 1 - totalOffDay);
                //$("#release-workingDays").val(duration.asDays() + 1 - totalOffDay);
                $("#btnSaveSprint").removeAttr('disabled');
            }
            else {
                //showError($scope.translation.ERR_DATE);
                $("#btnSaveSprint").attr('disabled', 'disabled');
            }
        }
        else if ($('#startDate').val() == null || $('#endDate').val() == null) {
            //showError($scope.translation.ERR_DATE_NULL);
            $("#btnSaveSprint").attr('disabled', 'disabled');
        }
    }
}]);