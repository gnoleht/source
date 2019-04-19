'use strict';
app.register.controller('pblEstimatingController', ['$scope', '$timeout', function ($scope, $timeout) {
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
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
            }
        });

        //$(window).resize(function () {
        //    var height = $("#pblEstimating .white_box").height();
        //    $("#pblEstimating #tab-content").height(height - 55);
        //});
        //$(window).resize();

       

        setSelectedMenu("pblEstimating");

        $scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;
            $scope.refresh();
        };

        $scope.loadData();
    });

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

            $scope.$applyAsync(function () {
                $scope.dataUnParent = $scope.data_Kanban.filter(x => x.parent == null).length > 0 ? $scope.data_Kanban.filter(x => x.parent == null)[0].listChild : null;
                $scope.dataHaveParent = $scope.data_Kanban.filter(x => x.parent != null).length > 0 ? $scope.data_Kanban.filter(x => x.parent != null) : null;
            });

            if (callback)
                callback();
        });
    }

    $scope.loadKanbanPBL = function (parentLast, last) {
        if (!parentLast || !last) return;
        $(".columnPBL").sortable({
            connectWith: ".columnPBL",
            placeholder: "block-placeholder",
            scroll: true,
            cursor: "move",
            receive: function (event, ui) {
                var block = null;
                var type = ui.item.data("typepbl");
                var childId = ui.item.data("childpbl");;
                var indexParent = ui.item.data("indexparentpbl");
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

                //var a = $(this).data("columnpbl");
                //var b = ui.sender.data("columnpbl");
                //var totalSize = $(".sizePointPBL").text();
                //$(".sizePointPBL").text(totalSize - b + a);

                block.parent = $(this).data("rowpbl");
                block.size = parseInt($(this).data("columnpbl"));

                $scope.UpdateOnchange_PBL(block, type, function () {
                    $scope.refresh(function () {
                        ui.item.remove();
                    });
                });

                preventPopup = true;
            }
        }).disableSelection();

        //$(".page-loader").hide();
    }

    $scope.UpdateOnchange_PBL = function (block, type, callback) {
        $scope.postDataAsync('api/pj/' + block.type + '/update', { data: JSON.stringify(block)} , function (data) {
            if (callback) callback();         
        });
    }


    $scope.blockBox = function (value) {
        if (value == "function")
            return "box_blue";
        else
            return "box_violet";
    }


    $scope.priorityColorPBL = function (value) {
        if (value == "1-Urgent")
            return "priority_urgent";
        else if (value == "2-High")
            return "priority_high";
        else if (value == "3-Normal")
            return "priority_normal";
        else
            return "priority_low";
    }

    $scope.displayFunction = function () {
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    $scope.displayTitle = function () {
        toogleProject(true);
    };

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

    $scope.saveWorkItem = function (data) {
        $scope.refresh();
        //if ($scope.typeP != 3) {
        //    var found = false;
        //    $.each($scope.data_Kanban, function (index, parentItem) {
        //        if (found) return false;
        //        $.each(parentItem.listChild, function (indexChild, item) {
        //            if (item.id == data.id) {
        //                // $scope.$applyAsync(function () {
        //                $scope.data_Kanban[index].listChild[indexChild] = data;
        //                // });

        //                found = true;
        //                return false;
        //            }
        //        });
        //    });
        //}
        //else {
        //    var found = false;
        //    $.each($scope.data_Kanban, function (index, parentItem) {
        //        if (found) return false;
        //        if (parentItem.parent.id == data.id) {
        //            // $scope.$applyAsync(function () {
        //            $scope.data_Kanban[index].parent = data;
        //            // });

        //            found = true;
        //            return false;
        //        }
        //    });
        //}
    };


    $scope.addChild = function () {
        // console.log("addChild PBL");
    }

    //$scope.refresh = function () {

    //    $scope.loadData();
    //}

    $scope.refresh = function (callback) {
        $scope.loadData(function () {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
            if (callback)
                callback();
        });
    };

    $scope.expanded = function (e) {
        $(e.target).parents(".tr").toggleClass("expanded");
    };

}]);
