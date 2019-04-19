'use strict';
app.register.controller('autoNumberController', ['$scope', '$timeout', function ($scope, $timeout) {
    //init
    $scope.$on('$routeChangeSuccess', function () {
        //load grid data
        $scope.postData('api/sys/autoNumber/getModule', null, function (data) {
            $scope.setting.valuelist.module = data
        });

        if ($scope.grid != null)
            $scope.grid.loadData();

        $timeout(function () {
            var systemData = [
                { id: 'num|', name: "Số tự động" },
                { id: 'num|00', name: "Số tự động 2 kí tự" },
                { id: 'date|ddMM', name: 'Ngày hiện tại (ddMM)' },
                { id: 'date|ddMMyy', name: 'Ngày hiện tại (ddMMyy)' },
                { id: 'userInfo|userName', name: 'Tài khoản hiện tại (tên đăng nhập)' },
                { id: 'userInfo|displayName', name: 'Tài khoản hiện tại (tên hiển thị)' },
                { id: 'userInfo|firstName', name: 'Tài khoản hiện tại (họ)' },
                { id: 'userInfo|lastName', name: 'Tài khoản hiện tại (tên)' },
                //{ id: 'userInfo|BU', name: 'Tài khoản hiện tại (phòng ban)' },
            ];
            var systemConfig = {
                at: "{",
                data: systemData,
                headerTpl: '<div class="atwho-header">System attribute<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
                insertTpl: '{${id}}',
                displayTpl: "<li class='link'>  ${name}  </li>",
                limit: 10,
                startWithSpace: false,
                suffix: ''
            };

            var inputor = $('#txtFormat').atwho(systemConfig);
            inputor.atwho('run');
        });
    });

    //function
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.step = 1;
        $scope.data.active = true;
        $scope.data.resetRule = 0;

        $scope.defaultData = jQuery.extend(true, {}, $scope.data);
        callModal('modal-detail');
        $('#txtNo').focus();
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) return;


        $scope.action = 'edit';
        $scope.data = jQuery.extend(true, {}, data);
        $scope.defaultData = $.extend(true, {}, $scope.data);

        callModal('modal-detail');


        $timeout(function () {
            if (!$scope.grvCondition)
                initSlickGrid($scope, 'grvCondition');

            $scope.grvCondition.setData(data.condition);
            $scope.moduleChange();
        });

        $('#txtCode').focus();

    };

    $scope.copy = function () {
        if ($scope.grid != null) {
            var data = $scope.grid.getCurrentData();
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }

            $scope.action = 'add';
            $scope.data = $.extend(true, {}, data);
            $scope.data.id = null;
            $scope.defaultData = $.extend(true, {}, $scope.data);

            callModal('modal-detail');
            $('#txtId').focus();
        }
    };

    $scope.save = function () {
        if (!$scope.data) return;
        var lstCondition = $scope.grvCondition.dataView.getItems();
        if (lstCondition.length == 0)
            $scope.data.condition = null;
        else {
            $scope.data.condition = [];
            $.each(lstCondition, function (index, condition) {
                if (condition.field && $scope.data.condition.field != '')
                    $scope.data.condition.push(condition);
            });
        }

        if ($scope.action == 'add') {
            $scope.post("api/sys/autoNumber/add", JSON.stringify($scope.data), function (data) {
                $scope.parent = null;
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
                $scope.grid.invalidate();
            });
        }
        else if ($scope.action == 'edit') {
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.post("api/sys/autoNumber/update", JSON.stringify($scope.data), function (data) {
                $scope.parent = null;
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.updateItem(data.id, data);
                $scope.grid.invalidate();
            });
        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.post("api/sys/autoNumber/remove", JSON.stringify($scope.data), function () {
            $scope.grid.dataView.deleteItem($scope.data.id);
            $scope.grid.invalidate();
            $scope.grid.render();
        });
    };

    $scope.addCondition = function () {
        if ($scope.grvCondition) {
            //var id = $scope.grvCondition.dataView.getItems().length + 1;
            $scope.grvCondition.dataView.addItem({ id: '', field: null, value: null });
        }
    };

    $scope.removeCondition = function () {
        var currentData = $scope.grvCondition.getCurrentData();
        if (currentData) {
            var id = currentData.id;
            $scope.grvCondition.dataView.deleteItem(currentData.id);
            var updateList = $scope.grvCondition.dataView.getItems().filter(x => x.id > id);
            $.each(updateList, function (index, item) {
                var oldId = item.id;
                item.id = item.id + 1;
                $scope.grvCondition.dataView.updateItem(oldId, item);
            });
        };
    }

    $scope.configModule = {
        allowClear: true,
        templateResult: function (state, element) {
            if (!state.id) {
                return state.text;
            }
            if (state.text == '') {
                return null;
            }

            var option = JSON.parse(state.element.attributes.opt.nodeValue);
            return $('<span style="padding-left:' + option.indent + 'px">' + option.text + '</span>');
        }
    }

    $scope.moduleChange = function () {
        var item = $('#vllModule').select2('data')[0];
        var option = JSON.parse(item.element.attributes.opt.nodeValue);

        if (option != null) {
            $scope.postData("api/sys/autoNumber/getEntityProperties", { module: option.module, entityName: option.entity }, function (data) {
                var fieldConfig = {
                    at: "[",
                    data: data,
                    headerTpl: '<div class="atwho-header">Member List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
                    insertTpl: '[${text}]',
                    displayTpl: "<li class='link'>  ${text}  </li>",
                    limit: data.length,
                    startWithSpace: false,
                    suffix: ''
                };

                var inputor = $('#txtFormat').atwho(fieldConfig);
                inputor.atwho('run');

                if ($scope.grvCondition)
                    $scope.grvCondition.setColumnDataSource('field', data);
            });
        }
    };
}]);