'use strict';
app.register.controller('companyController', ['$scope', '$timeout', function ($scope, $timeout) {
    // route change success
    $scope.regex = /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./1-9]*$/;

    $scope.$on('$routeChangeSuccess', function () {
        var url = 'api/system/getBasicList?name=ComanyType&&language=' + $scope.currentLanguage;
        $scope.postNoAsync(url, null, function (data) {
            $scope.typeList = data;
            $scope.setting.valuelist.type = data;
            $scope.setting.valuelist.typeList = data;
        });

        // user
        if (!$scope.grvUserInfo) {
            initSlickGrid($scope, 'grvUserInfo');
            $scope.grvUserInfo.editAction = function (grid, data) {
                $scope.editUserCompany(data);
            };
        }

        $scope.grvUserInfo.onClick.subscribe(function (e, args) {
            var item = args.grid.dataView.getItem(args.row);
            // edit user company
            if ($(e.target).hasClass("btnEditUser")) {
                $scope.editUserCompany(item);
            }
            // delete user company
            if ($(e.target).hasClass("btnRemoveUser")) {
                $scope.deleteUserCompany(item);
            }
        });

        if ($scope.grid) {
            $scope.grid.customFilter = function (data) {
                if (data.parent == null)
                    return true;

                var parent = $scope.grid.dataView.getItemById(data.parent);
                if (parent == null) {
                    data.isCollapsed = true;
                    return false;
                }

                if (parent.isCollapsed)
                    data.isCollapsed = true;

                return !parent.isCollapsed;
            };

            // load data company
            $scope.loadData();
            $scope.grid.onClick.subscribe(function (e, args) {
                var item = $scope.grid.dataView.getItem(args.row);
                if ($(e.target).hasClass("toggle")) {
                    if (item) {
                        if (!item.isCollapsed)
                            item.isCollapsed = true;
                        else
                            item.isCollapsed = false;
                        $scope.grid.dataView.updateItem(item.id, item);
                    }
                }
                else if ($(e.target).hasClass("addChild")) {
                    $scope.$applyAsync(function () {
                        $scope.parent = item;
                        $scope.setting.valuelist.type = $scope.typeList.filter(x => x.id > item.type);
                        $("#contextMenu").css({ "top": (e.pageY - 60) + "px", "left": (e.pageX - 10) + "px" }).show();
                    });
                }
                else if ($(e.target).hasClass("btnAddUser")) {
                    // add user company
                    $scope.addUserCompany(item);
                }
            });
        }

        // onSelectedRowsChanged
        $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
            $scope.loadUserByCompany();
        });

        $(document).click(function (e) {
            if (!$(e.target).hasClass("addChild"))
                $("#contextMenu").hide();
        });

        $("#company").on('click', function () {
            $("#contextMenu_Company").hide();
        });

        // refresh
        $scope.refresh = function () {
            // load data company
            $scope.loadData();
            // load user by company
            $scope.loadUserByCompany();
        };

        // load user by company
        $scope.loadUserByCompany();

        // resize
        $(window).resize(function (e) {
            if ($scope.grid)
                $scope.grid.resizeCanvas();

            if ($scope.grvUserInfo)
                $scope.grvUserInfo.resizeCanvas();
        });
    });

    // load data company
    $scope.loadData = function () {
        $scope.postData(companySetting.grid.url, null, function (response) {
            $scope.grid.setData(response);
            $scope.grid.invalidate();
        });
    };

    // display function
    $scope.displayFunction = function () {
        $("#btnChangeViewChart").show();
    };

    // change view
    $scope.changeView = function () {
        if ($scope.viewMode != '1') {
            $scope.viewMode = '1';
            $scope.loadChart();
        }
        else {
            $scope.viewMode = '0';
            // load data company
            $scope.loadData();
            // load user by company
            $scope.loadUserByCompany();
            //$(window).resize();
            $timeout(function () { $(window).resize() });
            //$scope.grid.resizeCanvas();
        }
    };

    // load chart
    $scope.loadChart = function () {
        google.charts.load('current', { packages: ["orgchart"] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('string', 'Manager');
            data.addColumn('string', 'ToolTip');

            var rowData = [];
            $scope.postNoAsync('api/sys/company/get', null, function (data) {
                $.each(data, function (index, item) {
                    var row = [{ v: item.id, f: item.name + '<div style="color:red; font-style:italic">' + item.description + '</div>' }, item.parent, ''];
                    rowData.push(row);
                });
            });

            data.addRows(rowData);

            var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
            chart.draw(data, { allowHtml: true });
        }
    };

    //function
    $scope.add = function (type) {
        $('#codeId').prop('readOnly', false);
        $('#codeIdCompany').prop('readOnly', false);
        $scope.data = {};
        $scope.action = 'add';
        // company
        if (type == null) {
            var temp = $("#btnAdd").position();
            var inputSearchWidth = $("#inputSearch").width();
            $("#contextMenu_Company").css({ "top": (temp.top + 40) + "px", "right": (inputSearchWidth + 20) + "px" }).show();
        }
        else {
            if (type == "0")
                $scope.addCompany("cooperation");
            else if (type == "1") {
                if ($scope.parent)
                    $scope.data.parent = $scope.parent.id;
                $scope.addCompany("company");
            }

            else {
                $scope.setting.valuelist.type = $scope.typeList.filter(x => x.id > "1");
                $scope.data.type = type;
                $scope.data.parent = $scope.parent.id;
                $scope.data.indent = $scope.parent.indent + 1;
                $scope.data.directlyUnder = $scope.parent.name;
                // add department
                $scope.actionDepartment = 'add';
                callModal('modal-detail-department');
                $('#codeId').focus();
            }
        }
    };

    // add company
    $scope.addCompany = function (type) {
        if (type == 'company') {
            $scope.TitleCompany = $scope.translation.ADD_NEW + " " + $scope.translation.COMPANY;
            $scope.data.type = "1";
        }
        else {
            $scope.TitleCompany = $scope.translation.ADD_NEW + " " + $scope.translation.COOPERATION;
            $scope.data.type = "0";
        }

        $("#imgAvatarCompany").attr("src", "/img/no-product.jpg");
        $scope.data.createdDate = moment();
        callModal('modal-detail-company');
        $('#code').focus();
    };

    // save company
    $scope.saveCompany = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        $scope.save();
    };

    // save Department
    $scope.saveDepartment = function () {
        if ($scope.data.type != "0" && $scope.data.type != "1")
            $scope.data.nameEN = $scope.data.name;
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        $scope.save();
    };

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) return;
        //$('#codeId').prop('readOnly', true);
       // $('#codeIdCompany').prop('readOnly', true);
        $scope.action = 'edit';
        $scope.data = data;
        if (data.type == "0" || data.type == "1") {
            $scope.TitleCompany = (data.type == "1") ? ($scope.translation.EDIT + " " + $scope.translation.COMPANY)
                : $scope.translation.EDIT + " " + $scope.translation.COOPERATION;

            $("#imgAvatarCompany").attr("src", "/api/system/viewfile?id=" + $scope.data.iconThumb + "&def=/img/no_avatar.png");
            callModal('modal-detail-company');
            $('#code').focus();
        }
        else {
            $scope.actionDepartment = 'edit';
            $scope.setting.valuelist.type = $scope.typeList.filter(x => x.id > "1");
            callModal('modal-detail-department');
            $('#codeId').focus();
        }
    };

    $scope.copy = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null) return;

        $scope.action = 'add';
        $scope.data = $.extend(true, {}, data);
        $scope.data.id = null;
        $scope.data.code = null;

        if (data.type == "0" || data.type == "1") {
            $scope.TitleCompany = (data.type == "1") ? ($scope.translation.ADD_NEW + " " + $scope.translation.COMPANY)
                : $scope.translation.ADD_NEW + " " + $scope.translation.COOPERATION;

            $("#imgAvatarCompany").attr("src", "/api/system/viewfile?id=" + $scope.data.iconThumb + "&def=/img/no_avatar.png");
            callModal('modal-detail-company');
            $('#code').focus();
        }
        else {
            $scope.actionDepartment = 'add';
            $scope.setting.valuelist.type = $scope.typeList.filter(x => x.id > "1");
            callModal('modal-detail-department');
            $('#codeId').focus();
        }
    };

    $scope.save = function () {
        if (!$scope.data) return;
        if ($scope.action == 'add') {
            $scope.frmFile.delete("data");
            $scope.frmFile.append("data", JSON.stringify($scope.data));
            $scope.postFile("api/sys/company/add", $scope.frmFile, function (data) {
                if (data) {
                    // load data company
                    $scope.loadData();
                    // load user by company
                    $scope.loadUserByCompany();
                    $('#modal-detail-company').modal('hide');
                    $('#modal-detail-department').modal('hide');
                }
            });
        }
        else {
            $scope.frmFile.delete("data");
            $scope.frmFile.append("data", JSON.stringify($scope.data));
            $scope.postFile("api/sys/company/update", $scope.frmFile, function (data) {
                if (data) {
                    $scope.grid.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $('#modal-detail-company').modal('hide');
                    $('#modal-detail-department').modal('hide');
                }
            });
        }
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.fladDeleteUserCompany = false;
            $scope.data = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        if ($scope.fladDeleteUserCompany)
            // save delete user company
            $scope.saveDeleteUserCompany();
        else
            $scope.post("api/sys/company/delete", JSON.stringify($scope.data), function (data) {
                if (data) {
                    // load data company
                    $scope.loadData();
                    // set data grv user
                    $scope.grvUserInfo.setData([]);
                    $scope.grvUserInfo.invalidate();
                }
            });
    };

    // config type
    $scope.configType = {
        templateResult: function (data) {
            if (data.element == null) return null;
            var nodeOpt = data.element.attributes.opt;
            if (nodeOpt != null) {
                var opt = JSON.parse(nodeOpt.nodeValue).opt;
                return $('<span style="padding-left: 10px; margin-left: 10px;border-left: 4px solid ' + opt.color + '">' + data.text + '</span>');
            }
        },
        templateSelection: function (data) {
            if (data.element == null) return null;
            var nodeOpt = data.element.attributes.opt;
            if (nodeOpt != null) {
                var opt = JSON.parse(nodeOpt.nodeValue).opt;
                return $('<span style="padding-left: 10px; margin-left: 10px;border-left: 4px solid ' + opt.color + '">' + data.text + '</span>');
            }
        }
    };

    //-------------user company------------
    // load user by company
    $scope.loadUserByCompany = function () {
        var company = $scope.grid.getCurrentData();
        if (!company) {
            company = $scope.grid.dataView.getItem(0);
            $('#grvCompany .slick-row .slick-cell')[0].click();
        }

        if (company) {
            $scope.arrKeys = [];
            $scope.arrKeys.push(company.id);
            $scope.getChild(company.id);

            var params = {
                listId: $scope.arrKeys
            };
            $scope.postData('api/sys/user/GetUserByCompany', params, function (data) {
                if (data) {
                    $scope.grvUserInfo.setData(data);
                    $scope.grvUserInfo.invalidate();
                }
            });
        }
    };

    //Lấy danh sách ID con
    $scope.getChild = function (parentId) {
        $.each($scope.grid.dataView.getItems(), function (index, item) {
            if (item.parent == parentId) {
                $scope.arrKeys.push(item.id);
                $scope.getChild(item.id);
            }
        });
    };

    // add user company
    $scope.addUserCompany = function (company) {
        var data = {};
        $scope.childScope['userForm'].dataAction('add', data, 'company', company.id);
    };

    // edit user company
    $scope.editUserCompany = function (data) {
        var companyId = $scope.grid.getCurrentData().id;
        $scope.childScope['userForm'].dataAction('edit', data, 'company', companyId);
    };

    // delete user company
    $scope.deleteUserCompany = function (data) {
        if (data) {
            var dataCompany = $scope.grid.getCurrentData();
            $scope.arrKeys = [];
            $scope.arrKeys.push(dataCompany.id);
            $scope.getChild(dataCompany.id);

            $scope.data = {
                listIdCompany: $scope.arrKeys,
                userId: data.id
            };

            $scope.fladDeleteUserCompany = true;
            callModal('modal-confirm');
        }
        else
            showError($scope.translation.ERR_DELETE_NULL);
    };

    // save delete user company
    $scope.saveDeleteUserCompany = function () {
        $scope.postData("api/sys/UserCompany/delete", $scope.data, function (data) {
            if (data) {
                // load user by company
                $scope.loadUserByCompany();
            }
        });
    };

    // save user company
    $scope.saveUser = function (action, data) {
        // refresh user company
        //$scope.refreshUserCompany();
        if (action == 'add') {
            $scope.grvUserInfo.dataView.insertItem(0, data);
            $scope.grvUserInfo.invalidate();
        }
        else {
            $scope.grvUserInfo.dataView.updateItem(data.id, data);
            $scope.grvUserInfo.invalidate();
        }
    };
    //-----------end user company-----------
}]);