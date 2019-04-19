
'use strict';
app.register.controller('relatedWorkController', ['$scope', '$location', '$sce', 'authService', '$route', '$window', function ($scope, $location, $sce, authService, $route, $window) {
    $scope.onLoad = function () {
        $scope.grid = null;
        init('relatedWork', $scope, true);


        if ($scope.$parent.setting.valuelist && $scope.$parent.setting.listFilter) {
            $scope.setting.valuelist = $scope.$parent.setting.valuelist;
            $scope.setting.listFilter = $scope.$parent.setting.listFilter;
            relatedWorkSetting.valuelist = $scope.setting.valuelist;
            relatedWorkSetting.listFilter = $scope.setting.listFilter;
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
                },
            });
        }

        $scope.postData('api/pm/workItem/GetListProject', { pid: $scope.params.pid }, function (data) {
            $scope.setting.valuelist.project = data;
        });

        if ($scope.grid != null) {
            $scope.grid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("checkWI")) {
                    var item = $scope.grid.dataView.getItem(args.row);
                    $scope.checkWorkItem(item);
                }
            });
        }
    };

    $scope.getLink = function () {
        var url = 'api/workitem/findlink'; //+ $scope.data.id + '&pid=' + $scope.params.pid;
        var params = { id: $scope.data.id, pid: $scope.params.pid };

        if (!isNullOrEmpty($scope.data.projectId)) {
            params.pjid = $scope.data.projectId;
        }
        else if ($scope.findLink.projectId) {
            params.pjid = $scope.findLink.projectId;
        }
        else if ($scope.params.pjid || $scope.pjid) {
            params.pjid = $scope.pjid ? $scope.pjid : $scope.params.pjid;
        }

        if ($scope.findLink.linkType) {
            $scope.findLink.currentType = angular.copy($scope.findLink.linkType)
            //url = url + '&type=' + $scope.findLink.currentType;
            params.type = $scope.findLink.currentType;
        } else {
            showError('Please choose link type!');
            return;
        }

        if ($scope.findLink.itemType) {
            $scope.findLink.currentItemType = angular.copy($scope.findLink.itemType);
            //url = url + '&itemType=' + $scope.findLink.currentItemType;
            params.itemType = $scope.findLink.currentItemType;
        }
        else {
            showError('Please choose type item!');
            return;
        }

        if ($scope.findLink.titleContains) {
            //url = url + '&titleContains=' + $scope.findLink.titleContains;
            params.titleContains = $scope.findLink.titleContains;
        }

        //relatedWorkSetting.grid.url = url;

        //$scope.post(url, null, function (data) {
        //    if (data) {
        //        $scope.grid.setData(data);
        //    }
        //});
        $scope.postData(url, params, function (data) {
            if (data) {
                $scope.grid.setData(data);
            }
        });
    };

    $scope.checkWorkItem = function (data) {
        if ($scope.findLink.currentType != "parent") {
            data.isCheck = data.isCheck ? !data.isCheck : true;

            if ($scope.findLink.currentType == 'child')
                $scope.data.hasChild = true;
        }
        else {
            var lstData = $scope.grid.dataView.getItems();
            var checkedData = lstData.filter(x => x.isCheck);
            if (checkedData.length > 0) {
                checkedData[0].isCheck = false;
                $scope.grid.dataView.updateItem(checkedData[0].id, checkedData[0]);
            }

            data.isCheck = data.isCheck ? !data.isCheck : true;
            $scope.parentLink = data.isCheck ? data : null;
        }
        $scope.grid.dataView.updateItem(data.id, data);
        $scope.grid.invalidate();
    };

    $scope.saveLink = function () {
        if (!$scope.$parent.relatedList) $scope.$parent.relatedList = {};
        if ($scope.findLink.currentType != "parent") {
            var lstData = $scope.grid.dataView.getItems();
            var selectedData = lstData.filter(x => x.isCheck);
            if (selectedData.length > 0) {
                var relatedTypeItem = $scope.$parent.relatedList[$scope.findLink.currentType] ? $scope.$parent.relatedList[$scope.findLink.currentType] : [];
                var relatedListAdd = [];
                $.each(selectedData, function (index, item) {
                    var hasValue = relatedTypeItem.findIndex(x => x.refRelatedId == item.id);
                    if (hasValue == -1) {
                        var entityType = $scope.setting.valuelist.relatedType.filter(x => x.id == $scope.findLink.currentItemType)[0].entityType;
                        var relatedItem = {
                            relatedId: $scope.data.id,
                            refRelatedId: item.id,
                            type: $scope.findLink.currentType,
                            entityType: entityType,
                            data: item
                        }
                        relatedTypeItem.push(relatedItem);
                        relatedListAdd.push(relatedItem);
                    }
                });
                $scope.$parent.relatedList[$scope.findLink.currentType] = relatedTypeItem;
            }
        }
        else {
            if ($scope.parentLink != null) {
                $scope.data.parent = $scope.parentLink.id;
                $scope.data.parentType = $scope.parentLink.type;
                $scope.$parent.parentData = angular.copy($scope.parentLink);
            }
        }

        if ($scope.$parent.saveRelatde) {
            $scope.$parent.saveRelatde(relatedListAdd);
        }
        
        $scope.$parent.data.changed = true;
        
        $scope.closeAddLink();
    };

    $scope.closeAddLink = function () {
        $('#modal-add-link').modal('hide');
        $scope.grid.setData([]);
    }

}]);
