'use strict';
app.register.controller('basicController', ['$scope', function ($scope) {
    $scope.$on('$routeChangeSuccess', function () {
        //$scope.grid.setColumnComboboxSetting('role', {
        //    addHeader: true,
        //    relateColumn: 'roleObject',
        //    param: { objectId: 'SYSTEM' },
        //    url: 'api/sys/role/getCombobox',
        //});

        $scope.postData('api/sys/role/get', { objectId: 'SYSTEM' }, function (data) {
            $scope.setting.valuelist.role = data.map(function (x) { return { id: x.id, text: x.name, code: x.code, description: x.description } });
            $scope.setting.valuelist.role.splice(0, 0, { id: 'header', disabled: true });
            $scope.grid.setColumnDataSource('role', $scope.setting.valuelist.role);
        });


        $scope.grid.setColumnEditorFormat('role', function (state) {
            if (!state.id) return state.text;

            if (state.id == 'header') {
                var $state = $('<div style="width:fit-content;display:flex;height:30px;border-bottom:1px solid #ddd">'
                    + '<span class="txt_cut" style="width:70px;float:left;line-height:30px;font-weight:600">' + 'Code' + '</span>'
                    + '<span class="txt_cut" style="width:170px;float:left;line-height:30px;font-weight:600" >' + 'Name' + '</span>'
                    + '<span class="txt_cut" style="width:260px;float:left;line-height:30px;font-weight:600">' + 'Description' + '</span></div>');

                return $state;
            }

            var $state = $('<div style="width:fit-content;display:flex;height:30px">'
                + '<span class="txt_cut" style="width:70px;float:left;line-height:30px">' + state.code + '</span>'
                + '<span class="txt_cut" style="width:170px;float:left;line-height:30px" >' + state.text + '</span>'
                + '<span class="txt_cut" style="width:260px;float:left;line-height:30px">' + state.description + '</span></div>');

            return $state;
        });

        $scope.grid.setColumnDataSource('skillDotnet', $scope.setting.valuelist.skill);
        $scope.grid.setColumnDataSource('skillHTML', $scope.setting.valuelist.skill);
        $scope.grid.setColumnDataSource('skillJavascript', $scope.setting.valuelist.skill);

        $scope.refresh = function () {
            if ($scope.grid) {
                $scope.grid.loadData($scope.grid.defaultUrl, $scope.params);
                $scope.grid.dataView.bufferRemoveData = [];

                //$scope.grid.groupDataField({
                //    fieldName: "birthday",
                //    groupFormat: function (group) {
                //        return "Tổng cộng có " + group.count + " nhân viên sinh ngày " + moment(group.value).format('l');
                //    },
                //    sum: [
                //        { field: 'age', column: 'age', formatter: function (group, column) { return "Tổng số tuổi: " + group.sum['age'] } }
                //    ],
                //    //avg: [
                //    //    { field: 'age', formatter: function (value, column) { } }
                //    //]
                //});
            }
        };

        $scope.refresh();

        $scope.grid.editAction = function () {
            $scope.$apply(function () {
                $scope.lstData = $scope.grid.dataView.getItems();
            });

            callModal('modal-detail2');
        };
    });

    $scope.edit = function () {
        $scope.grid.getEditController().commitCurrentEdit();
        $scope.save();
        //var newData = $scope.grid.dataView.getItems().filter(x => x.slickRowState == 'new');
        //var updateData = $scope.grid.dataView.getItems().filter(x => x.slickRowState == 'update');
        //var deleteData = $scope.grid.dataView.bufferRemoveData;
        //var parameter = {
        //    'add': newData,
        //    'update': updateData,
        //    'delete': deleteData
        //}

        //$scope.postData('api/sys/basic/save', parameter, function (data) {
        //    if (data) $scope.refresh();
        //});
    };

    $scope.add = function () {
        var autoNumbers = $scope.params.autoNumber ? $scope.params.autoNumber.filter(x => x.type == "0") : null;
        $scope.postData('api/sys/basic/add', { autoNumbers: autoNumbers }, function (data) {

            data.slickRowState = 'new';
            $scope.grid.dataView.insertItem(0, data);
        });
    };

    $scope.save = function () {
        debugger;
        var currentData = $scope.grid.getCurrentData();
        var autoNumbers = $scope.params.autoNumber ? $scope.params.autoNumber.filter(x => x.type != "0") : null;
        $scope.postData('api/sys/basic/saveOne', { item: currentData, autoNumbers: autoNumbers }, function (data) {
            $scope.refresh();
        });
    }

    $scope.showDetail = function () {
        var currentData = $scope.grid.getCurrentData();
        if (currentData) {
            $scope.data = currentData;
            callModal('modal-detail-permission');
        }
    };

    $scope.delete = function () {
        var currentData = $scope.grid.getCurrentData();
        if (currentData) {
            if (currentData.slickRowState != 'new') {
                $scope.grid.dataView.bufferRemoveData.push(currentData);
            }

            $scope.grid.dataView.deleteItem(currentData.id);
        }
    };

}]);

