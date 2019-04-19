'use strict';
app.register.controller('kanbanController', ['$scope', '$location', '$window', '$timeout', function ($scope, $location, $window, $timeout) {
    $scope.kanban = {};
    $scope.collapse = [];
    $scope.isOpen = true;
    $scope.groupKanban = "1";
    var preventPopup = false;
    $scope.list1 = [];
    $scope.list2 = [];

    $scope.$on('$routeChangeSuccess', function () {
        if ($scope.menuParams.area)
            $scope.areaUrl = "&area=" + $scope.menuParams.area;
        else
            $scope.areaUrl = '';

        if ($scope.menuParams.spr)
            $scope.sprUrl = "&spr=" + $scope.menuParams.spr;
        else
            $scope.sprUrl = '';

        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
            },
        });

        $timeout(function () {
            $scope.loadData();
            $scope.totalRemaining();
            setSelectedMenu("sprintPlan");
        }, 100);

        $.ajax({
            url: '/app/pm/workItemReasons.json',
            async: false,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $scope.workItemReasons = data;
            },
        });

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.refresh();
        };

        $(document).click(function (e) {
            if (!$(e.target).hasClass("btn_kanban"))
                $("#contextMenuTB").hide();
        });
    });

    $scope.onLoad = function () {
        $(".page-loader").show();
    };


    $scope.loadData = function (callback) {
        var searchValue = $("#inputSearch").val();
        if (searchValue == undefined) searchValue = null;

        var params = {
            pid: $scope.params.pid,
            pjid: $scope.params.pjid,
            area: $scope.params.area,
            spr: $scope.params.spr,
            groupType: $scope.groupKanban,
            searchValue: searchValue
        }

        //var url = 'api/pm/Sprint/Get_Data_Kanban?pid=' + $scope.params.pid + '&pjid=' + $scope.params.pjid + '&area='+ $scope.params.area +'&spr=' + $scope.params.spr + '&groupType=' + $scope.groupKanban + '&searchValue=' + searchValue;
        $scope.postData('api/pm/Sprint/Get_Data_Kanban', params, function (data) {
            if (data == null || data.length == 0) {
                $(".page-loader").hide();
                return;
            }

            $scope.splitData(data);

            if (callback)
                callback();
        });
        $(".page-loader").hide();
    }

    $scope.checkApprove = function () {
        var url = 'api/pm/Sprint/CheckSprintApprove?pjid=' + $scope.params.pjid + '&spr=' + $scope.params.spr;
        $scope.post(url, null, function (data) {
            $scope.approveStatus = data;
            if ($scope.groupKanban != "1")
                $scope.button.add = data;
        });

    }

    $scope.totalRemaining = function (callback) {
        var url = 'api/pm/Sprint/Get_Total_Remaining?pjid=' + $scope.params.pjid + '&spr=' + $scope.params.spr + '&area=' + $scope.params.area;
        $scope.post(url, null, function (data) {
            $scope.total_Remaining = data;

            if (callback != null)
                callback();
        });
    }


    $scope.loadKanbanColumn = function (parentLast, last) {
        if (!parentLast && !last) return;
        $('.column').sortable({
            connectWith: '.column',
            placeholder: "block-placeholder",
            scroll: true,
            cursor: "move",
            remove: function (event, ui) {
                var block = null;
                var childId = null;
                var indexChild = 0;
                var indexParent = 0;
                var type = ui.item.data("type");

                if (type == 1) {
                    childId = ui.item.data("childid");
                    indexChild = $scope.list1.listTaskBug.findIndex(x => x.id == childId);
                    block = $scope.list1.listTaskBug[indexChild];
                }
                else if (type == 2) {
                    childId = ui.item.data("childid");
                    indexParent = ui.item.data("indexparent");

                    indexChild = $scope.list2[indexParent].listTaskBug.findIndex(x => x.id == childId);
                    block = $scope.list2[indexParent].listTaskBug[indexChild];
                }
                else {
                    indexParent = ui.item.data("indexparent");
                    block = $scope.list2[parentIndex].parent;
                }

                var oldRemnaining = parseInt($("#" + $(this).data("column")).text());
                var newRemnaining = block.remaining;
                $("#" + $(this).data("column")).text(oldRemnaining - newRemnaining);

            },
            receive: function (event, ui) {
                var block = null;
                var childId = null;
                var indexChild = 0;
                var indexParent = 0;
                var type = ui.item.data("type");

                if (type == 1) {
                    childId = ui.item.data("childid");
                    indexChild = $scope.list1.listTaskBug.findIndex(x => x.id == childId);
                    block = $scope.list1.listTaskBug[indexChild];
                }
                else if (type == 2) {
                    childId = ui.item.data("childid");
                    indexParent = ui.item.data("indexparent");

                    indexChild = $scope.list2[indexParent].listTaskBug.findIndex(x => x.id == childId);
                    block = $scope.list2[indexParent].listTaskBug[indexChild];
                }
                else {
                    indexParent = ui.item.data("indexparent");
                    block = $scope.list2[parentIndex].parent;
                }


                if ($scope.approveStatus == false) {
                    showWarning($scope.translation.ERR_APPROVED);
                    ui.sender.sortable("cancel");

                    preventPopup = true;
                    return;
                }


                //if (block.approved) {
                //    showWarning($scope.translation.ERR_APPROVED);
                //    ui.sender.sortable("cancel");

                //    preventPopup = true;
                //    return;
                //}

                var colState = $(this).data("column");
                if (block.state != colState) {
                    var reasonState = $scope.workItemReasons[block.type][block.state][colState];
                    block.reason = reasonState ? reasonState[0] : null;
                    block.state = colState;
                }

                var assign = $(this).data("assign");
                if (assign == '')
                    assign = null;

                if ($scope.groupKanban == "0")
                    block.parent = $(this).data("parentid");
                else
                    block.assign = assign;

                if (assign == null) {
                    block.assign = null;
                    block.assignRelated = null;
                }

                var oldRemnaining = parseInt($("#" + $(this).data("column")).text());
                var newRemnaining = block.remaining;
                $("#" + $(this).data("column")).text(oldRemnaining + newRemnaining);

                $scope.UpdateOnchange(block, type, function () {
                    $scope.refresh(function () {
                        ui.item.remove();
                    });
                });


                preventPopup = true;
            },
            cancel: ".btn_kanban",
        }).disableSelection();


        //$(".page-loader").hide();

    }

    $scope.gotoAnchor = function (x) {
        var position = 0;
        if (x != 'unassign') {
            position = $("#unassign").outerHeight();
            $.each($scope.list2, function (index, item) {
                if (item.parent.assign != x)
                    position += $("#" + item.parent.assign).outerHeight() + 2;
                else
                    return false;
            });
        }

        $('.body_kanban').animate({
            scrollTop: position
        }, 500);

        $scope.currentPeople = x;
    };

    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;

        $scope.checkApprove();
    };

    $scope.displayTitle = function () {
        toogleProject(true);
        toogleSprint(true);
    };

    $scope.ChangeGroupBy = function () {
        //$scope.collapse = [];
        $scope.refresh();

        if ($scope.groupKanban == "0") {
            $scope.button.add = true;
        }
        else {
            $scope.button.add = false;
        }
    }


    $scope.UpdateOnchange = function (block, type, callback) {
        $scope.postData('api/pj/' + block.type + '/update', { data: JSON.stringify(block) }, function (result) {
            if (callback)
                callback();
        });
    }

    $scope.addTaskBug = function (e) {
        $scope.parenttb = $(e.target).data("parenttb");
        $scope.assigntb = $(e.target).data("assigntb");

        if (($(window).height() - e.pageY) <= 130) {
            $("#contextMenuTB").css({ "top": (e.pageY - 60) + "px", "left": (e.pageX + 20) + "px" }).show();
        }
        else {
            $("#contextMenuTB").css({ "top": (e.pageY + 15) + "px", "left": (e.pageX + 20) + "px" }).show();
        }

    }

    $scope.add = function (typeAdd) {
        $scope.action = 'add';
        $scope.listFileUpload = [];
        $scope.data = {};
        $scope.attachments = [];

        $scope.data.state = 'new';
        $scope.data.priority = '3-Normal';
        $scope.data.risk = 'Medium';
        $scope.data.type = 'userstory';
        $scope.data.size = '0';
        $scope.data.reason = 'new';
        $scope.data.version = 'Ver 1.0';

        if ($scope.params.spr == null || $scope.params.spr == "undefied" || $scope.params.spr == "") {
            $scope.postNoAsync('api/pm/Sprint/CurrentSprint?pjid=' + $scope.params.pjid, null, function (data) {
                if (data) {
                    $scope.params.spr = data.id;
                }
            });
        }

        $scope.data.sprint = $scope.params.spr;
        $scope.parentItem = null;//noparent                

        if (typeAdd != null) {
            var parentID = $scope.groupKanban == "0" ? $scope.parenttb : $scope.assigntb;
            var parent = null
            $scope.postData('api/WorkItem/GetWorkItemById', { id: parentID }, function (data) {
                parent = data;
            });
            if (parent) {
                $scope.data.parent = parent.id;
                $scope.data.parentType = parent.type;
                $scope.parentItem = parent;
            }
            $scope.data.type = typeAdd;
            $("#contextMenuTB").hide();
        }
        $scope.childScope.workItemForm.dataAction('add', $scope.data, $scope.parentItem);
    }

    $scope.refresh = function (callback) {
        var top = $('.body_kanban').scrollTop();
        $scope.loadData(function () {
            $scope.totalRemaining(function () {
                $scope.$digest();

                $('.body_kanban').animate({
                    scrollTop: top
                }, 0);

                if (callback) callback();
            });
        });
    };



    $scope.splitData = function (data) {
        if ($scope.groupKanban == "0") {
            $scope.list1 = data.filter(x => x.parent == null)[0];
            $scope.list2 = data.filter(x => x.parent != null);
        }
        else {
            $scope.list1 = data.filter(x => x.parent == null || x.parent.assign == null || x.parent.assign == '')[0];
            $scope.list2 = data.filter(x => x.parent != null && x.parent.assign != null && x.parent.assign != '');
        }
    };

    $scope.blockBox = function (value) {
        if (value == "task")
            return "box_yellow";
        else
            return "box_red";
    }

    $scope.editblock = function (parentIndex, childId, type) {
        var childIndex;
        if (preventPopup == false || navigator.userAgent.indexOf('Firefox') == -1) {
            var data = {};

            if (type == 1) {
                childIndex = $scope.list1.listTaskBug.findIndex(x => x.id == childId);
                data = $scope.list1.listTaskBug[childIndex];
            }
            else if (type == 2) {
                childIndex = $scope.list2[parentIndex].listTaskBug.findIndex(x => x.id == childId);
                data = $scope.list2[parentIndex].listTaskBug[childIndex];
            }
            else {
                data = $scope.list2[parentIndex].parent;
            }

            $scope.action = 'edit';

            if (data == null || data == undefined) {
                showError($scope.translation.ERR_SELECT_DATA_EDIT);
            }
            else {
                $scope.childScope.workItemForm.dataAction('edit', data);
            }
        }

        preventPopup = false;
    };



    $scope.saveWorkItem = function (data) {
        $scope.refresh();
    };

    $scope.expanded = function (e) {
        var parentId = $(e.target).parents(".tr")[0].id;
        var index = $scope.collapse.indexOf(parentId);
        if (index !== -1) {
            $scope.collapse.splice(index, 1);

            //var style = $(e.target).parents(".tr")[0].querySelector(".parent");
            //$(style).css("display", "contents");
        }
        else {
            $scope.collapse.push(parentId);

            //var style = $(e.target).parents(".tr")[0].querySelector(".box_expanded");
            //$(style).css("display", "contents");
        }

    };

    $scope.expandedAll = function () {
        if ($scope.isOpen) {
            if ($scope.groupKanban == "1")
                $scope.collapse.push("unassign");
            else
                $scope.collapse.push("unparent");
            if ($scope.list2) {
                $.each($scope.list2, function (index, item) {
                    if ($scope.groupKanban == "1")
                        $scope.collapse.push(item.parent.assign);
                    else
                        $scope.collapse.push(item.parent.id);
                });
            }
        }
        else {
            $scope.collapse = [];
        }

        $scope.isOpen = !$scope.isOpen;
    };

    $scope.priorityStyle = function (item) {
        return "priority_0" + item.priority.substring(0, 1);
    }

}]);
