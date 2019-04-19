//check
'use strict';
app.register.controller('pjCostDetailController', ['$scope', '$rootScope', '$location', 'authService', function ($scope, $rootScope, $location, authService) {
    $scope.authService = authService;
    $scope.initJS = function () {
    }
    $scope.$on('$routeChangeSuccess', function () {
        //init("pjCostDetail", $scope);
        $scope.month = moment($scope.params.time, "MM-YYYY").format("MM-DD-YYYY");
        if ($scope.grid != null) {
            //custom in filter function, data is rowData, return true to show row, false to hide row
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };
            //$scope.grid.loadData(pjCostDetailSetting.grid.url += "?pjid=" + $scope.params.pjid + "&time=" + $scope.params.time);
            $scope.loadData();
        }
        $scope.grid.onClick.subscribe(function (e, args) {
            //hide txtContextHrsApproved + calc + save database
            if ($('#contextHrsApproved').is(":visible")) {
                $scope.actionChangeHrs();
            }


            if ($(e.target).hasClass("toggle")) {
                var item = $scope.grid.dataView.getItem(args.row);
                if (item) {
                    if (!item.isCollapsed) {
                        item.isCollapsed = true;
                    } else {
                        item.isCollapsed = false;
                    }
                    $scope.grid.dataView.updateItem(item.id, item);
                }
                e.stopImmediatePropagation();
            }
            else if ($(e.target).hasClass("editHrsApproved")) {
                var item = $scope.grid.dataView.getItem(args.row);
                if (item) {
                    $scope.data = item;
                    $("#contextHrsApproved").css({ "top": (e.pageY - 25) + "px", "left": (e.pageX + 20) + "px" }).show();
                    $("#txtContextHrsApproved").val(item.hrsApproved);
                    $("#txtContextHrsApproved").data('taskid', item.id);
                    $("#txtContextHrsApproved").focus();
                }
            };

          
            if ($(e.target).hasClass("checkWI")) {
                $scope.UpdateCheck(e, args);
            }
        });

        setSelectedMenu("cost");
    });

    $scope.loadData = function () {
        $scope.post("api/pm/pjCostDetail/Get?pjid=" + $scope.params.pjid + "&time=" + $scope.params.time + "&area=" + $scope.menuParams.area, null, function (data) {
            $.each(data, function (index, item) {
                if (item.hasChild) item.isCollapsed = true;
            });
            $scope.grid.setData(data);
        });
    };
    $scope.actionChangeHrs = function () {
        var taskId = $("#txtContextHrsApproved").data('taskid');
        //var hrsApproved = $("#txtContextHrsApproved")[0].valueAsNumber;
        var hrsApproved = 1.0 * $("#txtContextHrsApproved").val();
        if (hrsApproved == null || isNaN(hrsApproved))
            hrsApproved = 0;
        //calc this row
        var thisItemTask = $scope.grid.dataView.getItems().find(x => x.id == taskId);
        thisItemTask.hrsApproved = hrsApproved;
        thisItemTask.costApproved = hrsApproved * thisItemTask.costPerHrs;
        //get this row root
        var thisItemTaskRoot = $scope.grid.dataView.getItems().find(x => x.id == thisItemTask.parent);

        $scope.post("api/pm/PjCostDetail/UpdateTask?id=" + taskId + "&data=" + hrsApproved, null, function (data) {
            //$scope.refreshFrm();
            //$scope.defaultData = null;
        });

        //thisItemTask.costApproved = thisItemTask.costPerHrs * thisItemTask.hrsApproved;
        $scope.grid.dataView.updateItem(thisItemTask.id, thisItemTask);

        //Parent need update grid
        //var itemRoot = $scope.grid.dataView.getItems().find(x => x.id == args.item.parent);
        if (thisItemTaskRoot != null) {
            var childItemRoot = $scope.grid.dataView.getItems().filter(x => x.parent == thisItemTask.parent);
            thisItemTaskRoot.hrsApproved = 0;
            $.each(childItemRoot, function (index, item) {
                thisItemTaskRoot.hrsApproved = 1 * thisItemTaskRoot.hrsApproved + item.hrsApproved;
            });
            thisItemTaskRoot.costApproved = thisItemTaskRoot.costPerHrs * thisItemTaskRoot.hrsApproved;
            $scope.grid.dataView.updateItem(thisItemTaskRoot.id, thisItemTaskRoot);
        }
        $scope.UpdateCostApproved();
        $("#contextHrsApproved").hide();
    };
    $scope.initInput = function () {
        $("#txtContextHrsApproved").keypress(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {
                $scope.actionChangeHrs();
            }
        });
    };

    $scope.displayTitle = function () {;
        toogleProject(true);
    };
    $scope.displayFunction = function () {
        $scope.button.refresh = false;
        $scope.button.copy = false;
        $scope.button.delete = false;
        $scope.button.edit = false;
        $scope.button.add = false;
    };

    $scope.UpdateCheck = function (e, args) {
        var item = $scope.grid.dataView.getItem(args.row);
        if (item) {
            item.isCheck = item.isCheck ? false : true;
            $scope.postData("api/pm/PjCostDetail/UpdateMembers", { data: JSON.stringify(item), id: $scope.params.pjid, time: $scope.params.time, area: $scope.params.area }, function (data) {

            });

            $scope.grid.dataView.updateItem(item.id, item);
            $scope.grid.invalidate();
            $scope.UpdateCostApproved();
        }

    };
    $scope.save = function () {
        $scope.frmFile.set("data", JSON.stringify($scope.data));
        $scope.postFile("api/pm/PjCostDetail/UpdateTask", $scope.frmFile, function (data) {
            $scope.refreshFrm();
            $scope.defaultData = null;
            $('#modal-detail').modal('hide');
            //$scope.grid.dataView.updateItem(data.id, data);           
            $scope.data.costApproved = $scope.data.costPerHrs * $scope.data.hrsApproved;            
            $scope.post("api/pm/pjCostDetail/Get?pjid=" + $scope.params.pjid + "&pid=" + $scope.params.pid + "&time=" + $scope.params.time, null, function (data) {
                $.each(data, function (index, item) {
                    if (item.hasChild) item.isCollapsed = true;
                });
                $scope.grid.setData(data);
            });
            //$scope.grid.refreshData();
        });
    };
    $scope.ChangeMonth = function () {
        var thisMonth = $("#month").val();
        $location.url("pm/pjCostDetail" + "?pjid=" + $scope.menuParams.pjid + "&time=" + thisMonth + "&area=" + $scope.menuParams.area);
        //$scope.params.time = thisMonth;
        //$scope.loadData();
    };
    $scope.UpdateCostApproved = function (cost) {
        setTimeout(function () {
            var thisVal = $("#totalCostApproved").val();
            $scope.postNoAsync("api/pm/PjCostDetail/UpdateCostApproved?id=" + $scope.params.pjid + "&time=" + $scope.params.time + "&area=" + $scope.params.area + "&cost=" + thisVal, null, function (data) {
            });
        }, 1000);        
    };  
}]);



