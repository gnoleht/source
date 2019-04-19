'use strict';
app.register.controller('businessObjectiveController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
    // register scope
    $scope.titleAdd = "Chi phí mới";
    $scope.actionDetail = null;
    $scope.exeDetail = null;
    $scope.lstYear = [];
    $scope.data = {};
    $scope.type = 0;
    $scope.chartYear = [], $scope.chartCost = [], $scope.chartRevenue = [], $scope.chartPayback = [];
    $scope.barChartData = {};

    $scope.$on('$routeChangeSuccess', function () {
        // $scope.setting.valuelist.timeofproject
        $scope.setting.valuelist.timeofproject = [], $scope.setting.valuelist.timeofinvest = [];

        // loadListYear
        $scope.loadListYear(20);

        // $scope.data
        $scope.data = $scope.envision.businessObjective;
    });

    $scope.onload = function () {
        // resize
        //$(window).resize(function () {
        //    var width = $("#businessObjective").closest('.tab-content').width();
        //    var height = $("#businessObjective").closest('.tab-content').height();

        //    // businessObjective
        //    $("#businessObjective").width(width);
        //    $("#businessObjective").height(height);

        //    // grvBusinessObjectiveCost
        //    $("#grvBusinessObjectiveCost").width(width);

        //    // grvBusinessObjectiveRevenue
        //    $("#grvBusinessObjectiveRevenue").width(width);
        //});

        //$timeout(function () {
        //    $(window).resize();
        //});


        // init
        init('businessObjective', $scope, true, false, false);

        //chart
        $scope.createChart();

        //grid grvBusinessObjectiveCost
        initSlickGrid($scope, 'grvBusinessObjectiveCost');
        if ($scope.grvBusinessObjectiveCost) {
            $scope.grvBusinessObjectiveCost.editAction = function (grid, data) {
                $scope.$applyAsync(function () { $scope.editDetail('cost', grid, data); });
            };
        }

        //grid grvBusinessObjectiveRevenue
        initSlickGrid($scope, 'grvBusinessObjectiveRevenue');
        if ($scope.grvBusinessObjectiveRevenue) {
            $scope.grvBusinessObjectiveRevenue.editAction = function (grid, data) {
                $scope.$applyAsync(function () { $scope.editDetail('revenue', grid, data); });
            };
        }

        // load data
        $scope.loadData();
    };

    //insert new row to cost
    $scope.addDetail = function (category) {
        $scope.titleAdd = envisionTranslation[category.toUpperCase()] + " " + envisionTranslation["NEW"].toLowerCase();
        $scope.detail = {};
        $scope.actionDetail = "add";
        $scope.exeDetail = category;
        callModal('modal-detail');
        $('#txt_quota').focus();
    }

    //edit row to cost
    $scope.editDetail = function (category, grid, data) {
        if (data == null) {
            if (category == "cost")
                data = $scope.grvBusinessObjectiveCost.getCurrentData();
            else
                data = $scope.grvBusinessObjectiveRevenue.getCurrentData();
        }
        if (data == null) {
            showError(envisionTranslation["EER_CHOOSE_EDIT"]);
        }
        else {
            $scope.detail = data;
            $scope.titleAdd = data.quota;
            $scope.actionDetail = "edit";
            $scope.exeDetail = category;
            callModal('modal-detail');
            $('#txt_quota').focus();
        }

    }

    //delete cost
    $scope.deleteDetail = function (category) {
        var grid = {};
        var dataView = {};
        if (category == "cost") {
            grid = $scope.grvBusinessObjectiveCost;
            dataView = $scope.grvBusinessObjectiveCost.dataView;
        }
        else {
            grid = $scope.grvBusinessObjectiveRevenue;
            dataView = $scope.grvBusinessObjectiveRevenue.dataView;
        }
        var selectList = grid.getSelectedRows();
        var item = grid.getDataItem(selectList[0]);
        if (item == undefined || item == null) {
            showError(envisionTranslation["EER_CHOOSE_DELETE"]);
        }
        else {
            $scope.exeDetail = category;
            callModal("modal-confirm");
        }
    }

    // delete
    $scope.delete = function () {
        var userId = $("#teamCapacity .tb_tree-active").attr('data-id');
        if (userId) {
            callModal("modal-confirm");
        }
        else {
            showSuccess(sprintTranslation.ERR_CHOOSE_DELETE);
        }
    }

    // delete
    $scope.deleteData = function () {
        var grid = {};
        var dataView = {};
        if ($scope.exeDetail == "cost") {
            grid = $scope.grvBusinessObjectiveCost;
            dataView = $scope.grvBusinessObjectiveCost.dataView;
        }
        else {
            grid = $scope.grvBusinessObjectiveRevenue;
            dataView = $scope.grvBusinessObjectiveRevenue.dataView;
        }
        var selectList = grid.getSelectedRows();
        var item = grid.getDataItem(selectList[0]);
        dataView.deleteItem(item.id);
        grid.invalidate();

        $scope.save();
        $scope.loadSummary($scope.data.timeOfProject);
    }

    //save Detail
    $scope.saveDetail = function () {
        var temp = checkInputRequired($scope.detail, envisionSetting, envisionTranslation);
        if (temp != true) {
            showError(temp.error);
            return false;
        }
        else {
            var grid = {};
            var dataView = {};
            if ($scope.exeDetail == "cost") {
                grid = $scope.grvBusinessObjectiveCost;
                dataView = $scope.grvBusinessObjectiveCost.dataView;
            }
            else {
                grid = $scope.grvBusinessObjectiveRevenue;
                dataView = $scope.grvBusinessObjectiveRevenue.dataView;
            }
            var obj = $scope.detail;
            obj.price = obj.price.replace(/,/g, "").replace(".00", "");
            if ($scope.actionDetail == "add") {
                var newRow = obj;
                var d = new Date();
                var newId = d.getTime();
                newRow.id = newId;
                dataView.insertItem(0, newRow);
                grid.invalidate();
            }
            else {
                dataView.updateItem(obj.id, obj);
                grid.invalidate();
            }
            $scope.save();
            $scope.loadSummary($scope.data.timeOfProject);
            $('#modal-detail').modal('hide');
        }
    };

    // save
    $scope.save = function () {
        var dataViewCost = $scope.grvBusinessObjectiveCost.dataView;
        $scope.data.cost = JSON.stringify(dataViewCost.getItems());
        var dataViewRevenue = $scope.grvBusinessObjectiveRevenue.dataView;
        $scope.data.revenue = JSON.stringify(dataViewRevenue.getItems());
        $scope.envision.businessObjective = $scope.data;

        $scope.post("api/pm/Envision/Save", JSON.stringify($scope.envision), function (data) {
            $scope.defaultData = data;
            showSuccess(envisionTranslation.SUCCESS_TAB);
        });
    }

    //change view
    $scope.changeView = function () {
        if ($scope.type == 0) {
            $scope.type = 1;
            $("#divTable").css("display", "none");
            $("#divTableHeader").css("display", "none");
            $("#divChart").css("display", "initial");
            $("#iconView").removeClass("bowtie-icon bowtie-chart-column");
            $("#iconView").addClass("bowtie-icon bowtie-table");
        }
        else {
            $scope.type = 0;
            $("#divTable").css("display", "initial");
            $("#divTableHeader").css("display", "initial");
            $("#divChart").css("display", "none");
            $("#iconView").removeClass("bowtie-icon bowtie-table");
            $("#iconView").addClass("bowtie-icon bowtie-chart-column");
        }
    }

    //load list year
    $scope.loadListYear = function (number) {
        var obj;
        for (var i = 1; i <= number; i++) {
            obj = { id: i.toString(), text: i.toString() };
            $scope.setting.valuelist.timeofproject.push(obj);
            $scope.setting.valuelist.timeofinvest.push(obj);
        }
    }

    //load data
    $scope.loadData = function () {
        var numberYear = parseInt($scope.data.timeOfProject);

        if (isNaN(numberYear) || numberYear == 0)
            $("#tbSummary").hide();
        else
            $("#tbSummary").show();

        $scope.createAutoColumn(numberYear);
        $scope.createListYear(numberYear);

        //reset data
        var list = [];
        if ($scope.data.cost != null) list = JSON.parse($scope.data.cost);

        $scope.grvBusinessObjectiveCost.setData([]);
        $scope.grvBusinessObjectiveCost.setData(list);

        var listRe = [];
        if ($scope.data.revenue != null) listRe = JSON.parse($scope.data.revenue);

        $scope.grvBusinessObjectiveRevenue.setData([]);
        $scope.grvBusinessObjectiveRevenue.setData(listRe);

        $scope.data.cost = angular.toJson($scope.grvBusinessObjectiveCost.dataView.getItems());
        $scope.data.revenue = angular.toJson($scope.grvBusinessObjectiveRevenue.dataView.getItems());

        //load summary
        $scope.loadSummary(numberYear);
    }

    // sum total BusinessObjectiveCost
    function sumTotalBusinessObjectiveCost() {
        var arr = [];
        var columnIdx = $scope.grvBusinessObjectiveCost.getColumns().length;
        var hasTxt = false;

        while (columnIdx--) {
            var column = $scope.grvBusinessObjectiveCost.getColumns()[columnIdx];

            if (!column.hasTotalCol) {
                continue;
            }
            var columnId = $scope.grvBusinessObjectiveCost.getColumns()[columnIdx].id;
            var total = 0;
            var i = $scope.grvBusinessObjectiveCost.getDataLength();
            while (i--) {
                var _field = $scope.grvBusinessObjectiveCost.getData().getItems()[i][column.field] ?
                    $scope.grvBusinessObjectiveCost.getData().getItems()[i][column.field].replace(/,/g, '') : 0;
                var _price = $scope.grvBusinessObjectiveCost.getData().getItems()[i]['price'] ?
                    $scope.grvBusinessObjectiveCost.getData().getItems()[i]['price'].replace(/,/g, '') : 0;
                total += (parseFloat(_field) || 0) * (parseFloat(_price) || 0);
            }
            arr.push(total);
        }
        return arr;
    }

    // sum total grvBusinessObjectiveRevenue
    function sumTotalBusinessObjectiveRevenue() {
        var arr = [];
        var columnIdx = $scope.grvBusinessObjectiveRevenue.getColumns().length;
        var hasTxt = false;

        while (columnIdx--) {
            var column = $scope.grvBusinessObjectiveRevenue.getColumns()[columnIdx];
            if (!column.hasTotalCol) {
                continue;
            }
            var columnId = $scope.grvBusinessObjectiveRevenue.getColumns()[columnIdx].id;
            var total = 0;

            var i = $scope.grvBusinessObjectiveRevenue.getDataLength();
            while (i--) {
                var _field = $scope.grvBusinessObjectiveRevenue.getData().getItems()[i][column.field] ?
                    $scope.grvBusinessObjectiveRevenue.getData().getItems()[i][column.field].replace(/,/g, '') : 0;
                var _price = $scope.grvBusinessObjectiveRevenue.getData().getItems()[i]['price'] ?
                    $scope.grvBusinessObjectiveRevenue.getData().getItems()[i]['price'].replace(/,/g, '') : 0;
                total += (parseFloat(_field) || 0) * (parseFloat(_price) || 0);
            }
            arr.push(total);
        }
        return arr;
    }

    //load table summary
    $scope.loadSummary = function (number) {
        //init
        $scope.chartCost = [], $scope.chartRevenue = [], $scope.chartPayback = [], $scope.chartYear = [];

        //grid
        var gridBusinessObjectiveCost = sumTotalBusinessObjectiveCost();
        var gridBusinessObjectiveRevenue = sumTotalBusinessObjectiveRevenue();
        var total, totalRe, totalPay, remain = 0;

        var table = $("#tbSummary").html("");

        var thead = document.createElement('thead');
        table.append(thead);

        var tr = document.createElement('tr');
        thead.appendChild(tr);

        var td = document.createElement('td');
        td.innerHTML = "";

        var tbody = document.createElement('tbody');
        table.append(tbody);

        var tr1 = document.createElement('tr');
        tbody.appendChild(tr1);
        var tdCost = document.createElement('td');

        var tr2 = document.createElement('tr');
        tbody.appendChild(tr2);
        var tdRevenue = document.createElement('td');

        var tr3 = document.createElement('tr');
        tbody.appendChild(tr3);
        var tdPayback = document.createElement('td');

        for (var i = 1; i <= number; i++) {
            //thead
            td = document.createElement('th');
            td.innerHTML = envisionTranslation.YEAR + " " + i.toString();
            td.style = "font-weight:bold;width:200px;";
            tr.appendChild(td);

            //tbody
            tdCost = document.createElement('td');
            total = gridBusinessObjectiveCost[number - i];
            tdCost.innerHTML = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VND';
            tdCost.style = "width:200px;";
            tr1.appendChild(tdCost);
            $scope.chartCost.push(total);

            tdRevenue = document.createElement('td');
            totalRe = gridBusinessObjectiveRevenue[number - i];
            tdRevenue.innerHTML = totalRe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VND';
            tr2.appendChild(tdRevenue);
            $scope.chartRevenue.push(totalRe);

            tdPayback = document.createElement('td');
            totalPay = totalRe - total + remain;
            tdPayback.innerHTML = totalPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VND';
            tr3.appendChild(tdPayback);
            $scope.chartPayback.push(totalPay);

            //remain = totalPay;

            $scope.chartYear.push(envisionTranslation.YEAR + ' ' + i.toString());
        }

        //drawing chart
        $scope.reDrawingChart();
    };

    //change selected select 2
    $scope.changedTimeProject = function () {
        $scope.data.lifeOfProduct = parseInt($scope.data.timeOfProject) - parseInt($scope.data.timeOfInvest);
        $scope.loadData();
    };

    //change selected select 2
    $scope.changedTimeInvest = function () {
        $scope.data.lifeOfProduct = parseInt($scope.data.timeOfProject) - parseInt($scope.data.timeOfInvest);
    };

    //create auto column from select
    $scope.createAutoColumn = function (number) {
        var columns = $scope.grvBusinessObjectiveCost.getColumns();
        var columnsRe = $scope.grvBusinessObjectiveRevenue.getColumns();
        columns.length = 3;
        columnsRe.length = 3;

        if (number > 0) {
            for (var i = 1; i <= number; i++) {
                var obj = { id: "year" + i.toString(), name: "Year " + i.toString(), field: "year" + i.toString(), sortable: true, dataType: 'text', formatter: Slick.Formatters.Number, width: 200, hasTotalCol: true };
                columns.push(obj);
                var objRe = { id: "year" + i.toString(), name: "Year " + i.toString(), field: "year" + i.toString(), sortable: true, dataType: 'text', formatter: Slick.Formatters.Number, width: 200, hasTotalCol: true };
                columnsRe.push(objRe);
            }
            $scope.grvBusinessObjectiveCost.setColumns(columns);
            $scope.grvBusinessObjectiveRevenue.setColumns(columnsRe);
        }
    };

    //create field for modal
    $scope.createListYear = function (number) {
        $scope.lstYear = [];
        for (var i = 1; i <= number; i++) {
            $scope.lstYear.push("year" + i);
        }
    };

    //create chart
    $scope.createChart = function () {
        $scope.barChartData = {
            labels: $scope.chartYear,
            datasets: [{
                label: envisionTranslation.COST_TAB,
                backgroundColor: "#FC4703",
                data: $scope.chartCost
            }, {
                label: envisionTranslation.REVENUE,
                backgroundColor: "#FFE6AA",
                data: $scope.chartRevenue
            }, {
                label: envisionTranslation.PAYBACK,
                backgroundColor: "#A5DFDF",
                data: $scope.chartPayback
            }]

        };

        var ctx = document.getElementById("cvChart").getContext("2d");
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: $scope.barChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'left',
                    verticalAlign: "center",
                },
                title: {
                    display: false,
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function (label, index, labels) {
                                return label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                            },
                            beginAtZero: true,
                            fontSize: 10,
                        },
                    }],
                }

            }
        });
    }

    //redrawing chart
    $scope.reDrawingChart = function () {
        $("#divChart").width("100%");
        $scope.barChartData.labels = $scope.chartYear;
        $scope.barChartData.datasets[0].data = $scope.chartCost;
        $scope.barChartData.datasets[1].data = $scope.chartRevenue;
        $scope.barChartData.datasets[2].data = $scope.chartPayback;
        window.myBar.update();
        window.myBar.resize();
    }

    // refresh
    $scope.refresh = function () {
        // load data
        $scope.loadData();
    }

    //openHistory
    $scope.openHistory = function (e) {
        $scope.postNoAsync("api/pm/envision/GetHistory?id=" + $scope.params.pid, null, function (data) {
            $.each(data, function (index, val) {
                var _data = [];
                var oldObj = JSON.parse(val.oldValue);
                var newObj = JSON.parse(val.newValue);

                if (oldObj.TimeOfProject) {
                    $.each(oldObj, function (key, field) {
                        var oldValue = field;
                        var newValue = newObj[key] == undefined ? 'null' : newObj[key];

                        if (oldValue != newValue) {
                            if (key == "Cost" || key == "Revenue") {
                                var _key = key;
                                var _oldValue = JSON.parse(oldValue);
                                var _newValue = JSON.parse(newValue);
                                if (_oldValue.length > _newValue.length) {
                                    $.each(_oldValue, function (index, val) {
                                        var itemNew = _newValue.find(x => x.id == val.id);
                                        if (itemNew == null) {
                                            $.each(val, function (key, field) {
                                                _data.push({ key: _key + "_" + capitalizeText(key), oldVal: field, newVal: 'null' });
                                            });
                                        }
                                        else {
                                            $.each(val, function (key, field) {
                                                var __oldValue = field;
                                                var __newValue = itemNew[key] == undefined ? 'null' : itemNew[key];
                                                if (__oldValue != __newValue) {
                                                    _data.push({ key: _key + "_" + capitalizeText(key), oldVal: __oldValue, newVal: __newValue });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    $.each(_newValue, function (index, val) {
                                        var itemOld = _oldValue.find(x => x.id == val.id);
                                        if (itemOld == null) {
                                            $.each(val, function (key, field) {
                                                _data.push({ key: _key + "_" + capitalizeText(key), newVal: field, oldVal: 'null' });
                                            });
                                        }
                                        else {
                                            $.each(val, function (key, field) {
                                                var __newValue = field;
                                                var __oldValue = itemOld[key] == undefined ? 'null' : itemOld[key];
                                                if (__oldValue != __newValue) {
                                                    _data.push({ key: _key + "_" + capitalizeText(key), oldVal: __oldValue, newVal: __newValue });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            else {
                                _data.push({ key: key, oldVal: oldValue, newVal: newValue });
                            }
                        }
                    });
                }
                else {
                    $.each(newObj, function (key, field) {
                        var oldValue = oldObj[key] == undefined ? 'null' : oldObj[key];
                        var newValue = field;

                        if (oldValue != newValue) {
                            if (key == "Cost" || key == "Revenue") {
                                var _key = key;
                                var _oldValue = JSON.parse(oldValue);
                                var _newValue = JSON.parse(newValue);
                                if (_oldValue.length > _newValue.length) {
                                    $.each(_oldValue, function (index, val) {
                                        var itemNew = _newValue.find(x => x.id == val.id);
                                        if (itemNew == null) {
                                            $.each(val, function (key, field) {
                                                _data.push({ key: _key + "_" + capitalizeText(key), oldVal: field, newVal: 'null' });
                                            });
                                        }
                                        else {
                                            $.each(val, function (key, field) {
                                                var __oldValue = field;
                                                var __newValue = itemNew[key] == undefined ? 'null' : itemNew[key];
                                                if (__oldValue != __newValue) {
                                                    _data.push({ key: _key + "_" + capitalizeText(key), oldVal: __oldValue, newVal: __newValue });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    $.each(_newValue, function (index, val) {
                                        var itemOld = _oldValue.find(x => x.id == val.id);
                                        if (itemOld == null) {
                                            $.each(val, function (key, field) {
                                                _data.push({ key: _key + "_" + capitalizeText(key), newVal: field, oldVal: 'null' });
                                            });
                                        }
                                        else {
                                            $.each(val, function (key, field) {
                                                var __newValue = field;
                                                var __oldValue = itemOld[key] == undefined ? 'null' : itemOld[key];
                                                if (__oldValue != __newValue) {
                                                    _data.push({ key: _key + "_" + capitalizeText(key), oldVal: __oldValue, newVal: __newValue });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            else {
                                _data.push({ key: key, oldVal: oldValue, newVal: newValue });
                            }
                        }
                    });
                }

                data[index].createdTime = moment(data[index].createdTime).fromNow();
                data[index].Value = _data;
            });
            $scope.history = data;
            $("#popover-history").css({ "top": e.clientY - 170, "left": e.clientX - 600 }).show();
        });
    }

    //closeHistory
    $scope.closeHistory = function () {
        $("#popover-history").hide();
    }
}]);