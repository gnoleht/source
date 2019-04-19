'use strict';
app.register.controller('projectsController', ['$scope', '$timeout', 'authService', 'socketService', function ($scope, $timeout, authService, socketService) {
    $scope.stringSearch = '';
    $scope.groupType = "project";

    $scope.$on('$routeChangeSuccess', function () {
        $('#myTab a').on('click', function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        $scope.feedQueue = [];
        $scope.relateData = {};
        $scope.isProduct = true;
        $scope.privateToken = null;

        $scope.authService = authService;
        //toogleMenu(false);
        //activeMenu(false);

        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $scope.privateToken = data.privateToken[0].id;

                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });

                $scope.setting.valuelist.state.splice(4, 1);
            },
        });

        $scope.loadData();

        $scope.loadDataFeed();

        socketService.socket.$on('$message', function incoming(message) {
            var socket = JSON.parse(message);
            if (socket.Event == "newfeed") {
                var obj = JSON.parse(socket.Message);
                if (obj.areaId == 'null') {
                    if (obj.projectId == $scope.projectId) {
                        if (document.activeElement.isContentEditable && document.activeElement.id != "inputor")
                            $scope.feedQueue.push(obj.feedId);
                        else {
                            $scope.postData('api/pm/Feed/GetFeedById', { id: obj.feedId }, function (data) {
                                if (data != null) {
                                    if (data.parentId == null) {
                                        var parentItem = { feed: data, feedReply: [] };
                                        $scope.feeds.unshift(parentItem);
                                    }
                                    else {
                                        var dataParent = $scope.feeds.filter(x => x.feed.id == data.parentId)[0];
                                        dataParent.feedReply.unshift(data);
                                    }
                                }
                            });
                        }
                    }
                    else {
                        var project = $scope.listData.filter(x => x.project.projectOrArea.id == obj.projectId);
                        if (project.length > 0)
                            project[0].project.notification = true;
                    }
                }
                else {
                    if (obj.areaId == $scope.areaId) {
                        if (document.activeElement.isContentEditable && document.activeElement.id != "inputor")
                            $scope.feedQueue.push(obj.feedId);
                        else {
                            $scope.postData('api/pm/Feed/GetFeedById', { id: obj.feedId }, function (data) {
                                if (data != null) {
                                    if (data.parentId == null) {
                                        var parentItem = { feed: data, feedReply: [] };
                                        $scope.feeds.unshift(parentItem);
                                    }
                                    else {
                                        var dataParent = $scope.feeds.filter(x => x.feed.id == data.parentId)[0];
                                        dataParent.feedReply.unshift(data);
                                    }
                                }
                            });
                        }
                    }
                    else {
                        var projects = $scope.listData.filter(x => x.project.projectOrArea.id == obj.projectId);
                        if (projects.length > 0) {
                            var project = projects[0];
                            var areas = project.listAreas.filter(x => x.projectOrArea.id == obj.areaId);
                            if (areas.length > 0)
                                areas[0].notification = true;
                        }
                    }
                }

                $scope.$digest();
            }
        });

        modalPlusEvent('modal-project');

        $timeout(function () {
        });
    });

    $scope.loadDataFeed = function () {
        $scope.feeds = [];
        $scope.feedParent = null;

        $scope.loadFeed();

        $scope.processAtWho();

        $timeout(function () {
            if (!$scope.params.groupId) {
                //$('.content:first').click();
            }
            else {
                $('#project_' + $scope.params.groupId).click();
                var position = $("#feedData").position().top;
                $('#main_project').animate({
                    //scrollTop: position
                }, 300);

                $scope.params.groupId = null;
            }
        }, 0, false);
    }

    $scope.cmbUserId = {
        url: "api/pm/member/getListUserForProject",
        allowClear: true,
    };

    //$scope.createGroupGitlab = function (departmentId) {
    //    var url = "http://172.16.7.65:1212/api/v4/groups?private_token=" + $scope.privateToken;
    //    //var token = "-J2Q3euXzqAWZo3qX_pa";

    //    var codeName = $scope.setting.valuelist.department.find(p => p.id == departmentId).code;
    //    var dataRoot = new Object();
    //    dataRoot.name = codeName;
    //    dataRoot.path = codeName;
    //    $scope.getData(url, function (data, response) {
    //        //if (typeof (response.find(p => p.path == codeName)) === "undefined") {
    //        if (response.find(p => p.path == codeName) != undefined) {
    //            $scope.data.GitlabPath = response.find(p => p.path == codeName).path;
    //            $scope.data.GitlabGroupId = response.find(p => p.path == codeName).id;
    //            return;
    //        }
    //        $scope.postData(url, dataRoot, function (data, response) {
    //            $scope.gitlabGroup = response;
    //            $scope.data.GitlabPath = response.path;
    //            $scope.data.GitlabGroupId = response.id;
    //        });
    //    });

    //};

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.copy = false;
        $scope.button.add = true;
        $scope.button.edit = $scope.groupType == 'project';
        $scope.button.copy = $scope.groupType == 'project';
        $scope.button.delete = $scope.groupType == 'project';
    };

    $scope.loadData = function () {
        $scope.postDataAsync('api/sys/company/GetListForUser', null, function (data) {
            $scope.setting.valuelist.department = data;
        });

        $scope.postDataAsync('api/pm/Product/GetProductByUser', null, function (data) {
            $scope.setting.valuelist.productId = data;
        });

        $scope.postDataAsync('api/sys/User/GetList', null, function (data) {
            $scope.setting.valuelist.owner = data;
            $scope.setting.valuelist.sponser = data;
        });

        $scope.postData('api/pm/Project/GetListProjectArea', { pid: $scope.params.pid }, function (data) {
            $scope.listData = data;
            if ($scope.listData && $scope.listData.length > 0) {
                if ($scope.defaultFirstData == undefined) {
                    if (!$scope.params.pjid)
                        $scope.defaultFirstData = $scope.listData[0].project;
                    else {
                        var lstFilter = $scope.listData.filter(x => x.project.projectOrArea.id == $scope.params.pjid);
                        if (lstFilter.length != 0)
                            $scope.defaultFirstData = lstFilter[0];
                        else
                            $scope.defaultFirstData = $scope.listData[0].project;
                    }
                }

                $scope.projectId = $scope.defaultFirstData.projectOrArea.id;
                $scope.areaId = null;

                $scope.params.pjid = $scope.defaultFirstData.projectOrArea.id;

                setMenu($scope, $scope.defaultFirstData.projectOrArea, 'pj');

                if ($scope.defaultFirstData.projectOrArea.projectType != "2")
                    dislayMenuItem(['personas', 'requirement'], false);
                else
                    dislayMenuItem(['personas', 'requirement'], true);
            }
            else {
                $scope.defaultFirstData = {
                    projectOrArea: { percent: 0 }
                };

                dislayMenuItem(['personas', 'requirement'], false);
            }
        });

        $scope.loadCountData();

        //$scope.postNoAsync('api/pm/Project/List_WorkItem_By_Assign?pid=' + $scope.params["pid"], null, function (data) {
        //    $scope.listWorkItem = data;
        //    $scope.workItem = $scope.listWorkItem[0];
        //});

        //$scope.postNoAsync('api/pm/Project/Statistical_WorkItem?pid=' + $scope.params["pid"], null, function (data) {
        //    $scope.listStatisticalWorkItem = data;
        //});

        //$scope.postNoAsync('api/pm/Project/Statistical_WorkItem_Chart?pid=' + $scope.params["pid"], null, function (data) {
        //    $scope.lstType = data.listtype;
        //    $scope.dataset = data.dataset;
        //});
    }

    $scope.loadCountData = function () {
        $scope.postDataAsync('api/pm/project/countData', { project: $scope.defaultFirstData.projectOrArea }, function (data) {
            $scope.$applyAsync(function () {
                if (data) {
                    $scope.countData = data;
                }
                else {
                    $scope.countData = {
                        sprint: { url: 'javascript:void(0)', count: 0 },
                        epic: { url: 'javascript:void(0)', count: 0 },
                        function: { url: 'javascript:void(0)', count: 0 },
                        userStory: { url: 'javascript:void(0)', count: 0 },
                        task: { url: 'javascript:void(0)', count: 0 },
                        document: { url: 'javascript:void(0)', count: 0 },
                    };
                }

                $timeout(function () {
                    $scope.buildChart("epic", "epic");
                    $scope.buildChart("function", "function");
                    $scope.buildChart("userstory", "userstory");
                    $scope.buildChart("task", "requirement");
                    $scope.buildChart("bug", "document");
                    $scope.buildChart("sprint", "sprint");
                });
            });
        });
    };

    $scope.buildChart = function (type, name) {
        $(".item_" + name).popover({
            title: '<strong>' + capitalizeText(type) + ' Statistical by Status</strong>',
            content: function () {
                var html = '<div style="width:400px"><canvas id="' + type + 'Chart"></canvas></div>';
                return html;
            },
            html: true,
            trigger: 'hover',
            container: $("#panel_PM_02"),
            placement: 'bottom',
            delay: {
                show: "0",
                hide: "0"
            }
        });

        $(".item_" + name).popover().on('shown.bs.popover', function () {
            $scope.postData("api/pm/project/getChartData?type=" + type, { project: $scope.defaultFirstData.projectOrArea }, function (data) {
                if (!data) return;
                var backgroundColor = [];
                var dataSource = [];
                var labels = ["new", "active", "resolved", "closed"];
                if (type === 'sprint') {
                    labels = ["past", "current", "future"];
                    dataSource = [data.past, data.current, data.future];
                    backgroundColor = [
                        '#999999',
                        '#37A5DD',
                        '#30B98F'
                    ];
                }
                else {
                    $.each(labels, function (index, item) {
                        if (data[item])
                            dataSource.push(data[item]);
                        else
                            dataSource.push(0);
                    });
                    backgroundColor = [
                        '#999999',
                        '#37A5DD',
                        '#F8981D',
                        '#30B98F'
                    ];
                }

                var ctx = document.getElementById(type + "Chart");
                var chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: dataSource,
                            backgroundColor: backgroundColor,
                            borderWidth: 0.5
                        }]
                    },
                    options: {
                        events: [],
                        animation: {
                            duration: 500,
                            easing: "easeOutQuart",
                            onComplete: function () {
                                var ctx = this.chart.ctx;
                                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';

                                this.data.datasets.forEach(function (dataset) {
                                    for (var i = 0; i < dataset.data.length; i++) {
                                        if (dataset.data[i] == 0) continue;

                                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                            total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                            mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                            start_angle = model.startAngle,
                                            end_angle = model.endAngle,
                                            mid_angle = start_angle + (end_angle - start_angle) / 2;

                                        var x = mid_radius * Math.cos(mid_angle);
                                        var y = mid_radius * Math.sin(mid_angle);

                                        ctx.fillStyle = '#111';
                                        ctx.fillText(dataset.data[i], model.x + x, model.y + y);

                                        //var percent = String(Math.round(dataset.data[i] * 100 / total));
                                        //if (percent > 3) ctx.fillText(percent + "%", model.x + x, model.y + y);
                                    }
                                });
                            }
                        }
                    }
                });
            });
        });
    };

    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    $scope.loadBarChart = function () {
        var barChartData = {
            labels: $scope.lstType,
            datasets: $scope.dataset
        };

        var ctx = document.getElementById('myChart').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: true,
                    text: ''
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }

    $scope.transparentize = function (color, opacity) {
        var alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return Color(color).alpha(alpha).rgbString();
    }

    $scope.loadAreaChart = function () {
        var data = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets:
                [{
                    backgroundColor: $scope.transparentize(window.chartColors.orange),
                    borderColor: window.chartColors.orange,
                    data: [12, 24, 36, 47],
                    hidden: false,
                    label: 'Closed',
                    fill: true
                },

                {
                    backgroundColor: $scope.transparentize(window.chartColors.green),
                    borderColor: window.chartColors.green,
                    data: [14, 26, 40, 50],
                    hidden: false,
                    label: 'Active',
                    fill: '-1'
                },
                {
                    backgroundColor: $scope.transparentize(window.chartColors.blue),
                    borderColor: window.chartColors.blue,
                    data: [100, 83, 62, 51],
                    hidden: false,
                    label: 'New',
                    fill: '-1'
                },

                {
                    backgroundColor: $scope.transparentize(window.chartColors.red),
                    borderColor: window.chartColors.red,
                    data: [0, 0, 0, 0],
                    hidden: true,
                    label: 'Removed',
                    fill: '-1'
                }
                ]
        };

        var options = {
            maintainAspectRatio: false,
            spanGaps: false,
            elements: {
                line: {
                    tension: 0.000001
                }
            },
            scales: {
                yAxes: [{
                    stacked: true
                }]
            },
            plugins: {
                filler: {
                    propagate: false
                },
                'samples-filler-analyser': {
                    target: 'chart-analyser'
                }
            }
        };

        var chart = new Chart('myChartArea', {
            type: 'line',
            data: data,
            options: options
        });
    }

    $scope.changeProject = function (item, type, projectIndex) {
        if ($scope.defaultFirstData && $scope.defaultFirstData.projectOrArea.id == item.projectOrArea.id) return;
        if (item.notification)
            item.notification = false;

        $scope.defaultFirstData = item;

        $scope.params.pjid = item.projectOrArea.id;

        if (type == "project") {
            $scope.params.area = null;

            $scope.projectId = item.projectOrArea.id;
            $scope.areaId = null;
        }
        else {
            $scope.params.area = item.projectOrArea.id;
            $scope.projectId = $scope.listData[projectIndex].project.projectOrArea.id;
            $scope.areaId = item.projectOrArea.id;
        }

        $scope.projectIndex = projectIndex;

        setMenu($scope, item.projectOrArea, 'pj');

        if (item.projectOrArea.projectType != "2")
            dislayMenuItem(['personas', 'requirement'], false);
        else
            dislayMenuItem(['personas', 'requirement'], true);

        $scope.groupType = type;

        $("#inputor").html('');

        $scope.displayFunction();
        $scope.loadCountData();
        $scope.loadDataFeed();
    };

    $scope.clearHtml = function (note) {
        if (note == null)
            return "";
        return note.replace(/<(.|\n)*?>/g, '');
    };

    //function
    $scope.add = function () {
        $('#projectType').prop('disabled', false);
        $scope.action = "add";
        $scope.data = {};
        $scope.data.reason = "new";
        $scope.data.state = "new";
        $scope.data.priority = "3-Normal";

        $scope.data.projectType = "1";
        $scope.data.description = "";
        $scope.data.parentId = $scope.params.pid;
        $scope.data.owner = null;
        $scope.data.sponser = null;
        $scope.data.isApproveSprint = false;
        $scope.data.type = "project";
        // $(".switch").removeClass('change');
        $scope.data.planStartDate = Date.now();
        $scope.data.planEndDate = Date.now();
        $scope.data.planDuration = 0;

        $scope.attachments = [];
        $scope.listFileRelated = [];
        $scope.listFileUpload = [];
        $scope.folders = [];
        $("#code").prop('disabled', false);
        $("#productId").prop('disabled', false);
        $("#planDuration").prop('disabled', true);

        $scope.defaultData = angular.copy($scope.data);

        $("#imgAvatar").attr("src", "/img/no-product.jpg");
        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
        callModal('modal-project', true, 'project_name');
        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};
    }

    //$(".switch").click(function () {
    //    $(this).toggleClass("change");

    //    var value = ($(".switch input").val() == 'true');
    //    $(".switch input").val(!value);
    //    $scope.data.isApproveSprint = !value;
    //});

    $scope.changeApproveSprint = function (value) {
        $scope.data.isApproveSprint = !value;
    }

    $scope.edit = function (data) {
        if (!$scope.defaultFirstData) return;

        $('#projectType').prop('disabled', true);
        $scope.attachments = [];
        $scope.listFileRelated = [];
        $scope.listFileUpload = [];
        $scope.folders = [];
        $scope.listFileRemove = [];

        $("#code").prop('disabled', true);
        $("#planDuration").prop('disabled', true);
        $("#productId").prop('disabled', true);

        if (data == null || data == undefined) {
            $scope.data = $scope.defaultFirstData.projectOrArea;
            //showError(projectsTranslation.ERROR_TABLE);
        }
        else {
            $scope.data = angular.copy(data);
        }

        //if ($scope.data.isApproveSprint)
        //    $(".switch").addClass('change');
        //else
        //    $(".switch").removeClass('change');

        $scope.action = "edit";
        $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.pictureThumb + "&def=/img/no-product.jpg");

        $scope.defaultData = angular.copy($scope.data);
        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
        callModal('modal-project', true, 'project_name');

        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};
        $scope.getAttachment($scope.data.id);
    };

    $scope.changePlanDate = function () {
        var start_Date = moment($scope.data.planStartDate);
        var end_Date = moment($scope.data.planEndDate);

        if (start_Date && end_Date) {
            if (end_Date >= start_Date) {
                $scope.data.planDuration = end_Date.diff(start_Date, 'days');
                $("#btnSaveAndClose").removeAttr('disabled');
            }
            else {
                $scope.data.planDuration = 0;
                showError($scope.translation.ERR_DATE);
                $("#btnSaveAndClose").attr('disabled', 'disabled');
            }
        }
    };

    $scope.confirmProduct = function () {
        $scope.flagComfirm = true;
        $scope.action = "add";
        $scope.save();
    }

    $scope.checkActive = function (id) {
        if ($scope.defaultFirstData.projectOrArea.id == id)
            return 'active';
        return '';
    }

    $scope.showPercent = function (project) {
        if ($scope.defaultFirstData.projectOrArea.id == project.id)
            return { width: project.percent + "%" };
        return { width: '0%' };
    }

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        //$scope.createGroupGitlab($scope.data.department);

        if ($scope.fileAvatar && $scope.fileAvatar.file) {
            $scope.frmFile.append("file", $scope.fileAvatar.file);
        }

        $scope.buildAttachment();

        if ($scope.action == "add") {
            if (!$scope.data.parentId && !$scope.flagComfirm) {
                $('#modal-confirm-product').modal();
                return;
            }

            $scope.flagComfirm = false;
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.postFile("api/pm/Project/Add", $scope.frmFile, function (data) {
                $scope.defaultData = null;
                $('#modal-project').modal('hide');
                $scope.refreshFrm();
                //$scope.createGroupGitlab($scope.data.department);
                $scope.refresh();
                toogleProject(true, true);

                showSuccess($scope.translation.SUCCESS_ADD);
            });
        }
        else {
            if ($scope.childScope.attachment.listFileRemove !== undefined && $scope.childScope.attachment.listFileRemove.length > 0) {
                $.each($scope.childScope.attachment.listFileRemove, function (index, item) {
                    $scope.frmFile.append("removeFiles", item);
                });
            }
            $scope.frmFile.append("data", JSON.stringify($scope.data));
            if ($scope.data.type == "project") {
                $scope.postFile("api/pm/Project/Update", $scope.frmFile, function (data) {
                    $scope.defaultData = null;
                    $('#modal-project').modal('hide');
                    $scope.refreshFrm();
                    $scope.data = {};
                    $scope.refresh();
                    showSuccess($scope.translation.SUCCESS_EDIT);
                });
            }
            else {
                $scope.postFile("api/pm/Areas/Update", $scope.frmFile, function (data) {
                    $scope.defaultData = null;
                    $('#modal-project').modal('hide');
                    $scope.refreshFrm();
                    $scope.data = {};
                    $scope.refresh();
                    showSuccess($scope.translation.SUCCESS_EDIT);
                });
            }
        }
    };

    $scope.delete = function () {
        var data = $scope.defaultFirstData;
        if (data == null) {
            showError(projectsTranslation["EER_CHOOSE_DELETE"]);
        }
        else {
            $scope.dataDelete = data;
            $('#modal-confirm').modal();
        }
    };

    //config state
    $scope.configState = {
        templateResult: function (data) {
            return $('<span><i class="fa fa-circle status_' + data.id + '"></i>&nbsp;' + data.text + '</span>');
        },
        templateSelection: function (data) {
            return $('<span><i class="fa fa-circle status_' + data.id + '"></i>&nbsp;' + data.text + '</span>');
        }
    }
    //config reason
    $scope.configReason = {
        templateResult: function (data) {
            return $('<span><i class="fa fa-circle reason-' + data.id + '"></i>&nbsp;' + data.text + '</span>');
        },
        templateSelection: function (data) {
            return $('<span><i class="fa fa-circle reason-' + data.id + '"></i>&nbsp;' + data.text + '</span>');
        }
    }

    $scope.deleteData = function () {
        if ($scope.dataDelete.projectOrArea.type == "project") {
            $scope.postData("api/pm/Project/Delete", { project: $scope.dataDelete.projectOrArea }, function (result) {
                if (result) {
                    $scope.refresh();

                    $scope.defaultFirstData = $scope.listData[0].project;

                    setMenu($scope, $scope.defaultFirstData.projectOrArea, 'pj');

                    showSuccess($scope.translation.SUCCESS_DELETE);
                } else {
                    showError($scope.translation.ERROR_DELETE);
                }
            });
        }
        else {
            $scope.postData("api/pm/Areas/Delete", { project: $scope.dataDelete.projectOrArea }, function (result) {
                if (result) {
                    $scope.refresh();

                    $scope.defaultFirstData = $scope.listData[0].project;

                    setMenu($scope, $scope.defaultFirstData.projectOrArea, 'pj');

                    showSuccess($scope.translation.SUCCESS_DELETE);
                } else {
                    showError($scope.translation.ERROR_DELETE);
                }
            });
        }
    };

    $scope.refresh = function () {
        $scope.loadData();
    }

    //Lấy thông tin lịch sử
    $scope.getHistory = function () {
        $scope.post("api/pm/Project/gethistory?id=" + $scope.defaultFirstData.projectOrArea.id, null, function (data) {
            $.each(data, function (index, val) {
                val.oldValue = JSON.parse(val.oldValue);
                val.newValue = JSON.parse(val.newValue);
                var stringcreatedTime = moment(val.createdTime).fromNow();
                val.createdTime = stringcreatedTime;

                if (val.newValue != null) {
                    $.each(val.newValue, function (key, value) {
                        if (val.oldValue[key] == undefined)
                            val.oldValue[key] = '';
                        if (val.newValue[key] != undefined && val.newValue[key] == true) {
                            val.oldValue[key] = false;
                        }
                    });
                }
                if (val.oldValue != null) {
                    $.each(val.oldValue, function (key, value) {
                        if (val.newValue[key] == undefined)
                            val.newValue[key] = '';
                        if (val.oldValue[key] != undefined && val.oldValue[key] == true) {
                            val.newValue[key] = false;
                        }
                    });
                }
            });
            $scope.history = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };

    //Lấy comment theo id
    $scope.getComment = function () {
        $scope.post("api/pm/Project/getcomment?id=" + $scope.defaultFirstData.projectOrArea.id, null, function (data) {
            $.each(data, function (index, item) {
                item.createdTime = moment(item.createdTime).fromNow();
            });
            $scope.discussion = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };
    //Đăng comment theo id
    $scope.postComment = function (comment) {
        if ($scope.defaultFirstData.projectOrArea.id) {
            if (comment && comment.content != "") {
                comment.PMId = $scope.data.id.toString();
                $scope.postNoAsync("api/pm/Project/postcomment", JSON.stringify(comment), function (data) {
                    comment.createdByRelated = $scope.authService.user;
                    comment.createdTime = moment(new Date()).fromNow();
                }, function () { comment = false; });
                return comment;
            }
            else {
                showError("Empty input comment content!");
            }
        }
        else {
            showError();
        }
        return false;
    };

    $scope.collapseButton = function () {
        if ($(".multi-collapse").hasClass('show')) {
            $(".multi-collapse").collapse('hide');
        }
        else {
            $(".multi-collapse").collapse('show');
        }
    };

    $scope.configDepartment = {
        templateResult: function (state, element) {
            if (!state.id) {
                return state.text;
            }
            if (state.text == '') {
                return null;
            }

            var option = JSON.parse(state.element.attributes.opt.value);
            var nodeOpt = option.opt;
            if (nodeOpt != null) {
                return $('<span style="padding-left:' + nodeOpt.indent + 'px">' + state.text + '</span>');
            }
            else
                return state.text;
        },
    };

    $scope.processAtWho = function () {
        $scope.post('api/pm/member/GetList?pjid=' + $scope.projectId, null, function (data) {
            if (data) {
                $scope.users = data;

                var users = $.map($scope.users, function (item, index) {
                    return { 'index': index, 'id': item.id, 'name': item.id + ' - ' + item.text, 'name2': item.text };
                });

                var user_config = {
                    at: "@",
                    data: users,
                    headerTpl: '<div class="atwho-header">Member List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
                    insertTpl: '<b data-userid="${id}" class="link"> @${name2} </b>',
                    displayTpl: "<li class='link'>  ${name}  </li>",
                    limit: users.length
                }

                if ($scope.feedParent == null) {
                    var inputor = $('#inputor').atwho(user_config);
                    inputor.atwho('run');
                }
                else {
                    var inputorReply = $('#inputorReply_' + $scope.feedParent.id).atwho(user_config);
                    inputorReply.atwho('run');
                }
            }
        });

        var workitem_config = {
            at: "#",
            data: null,
            headerTpl: '<div class="atwho-header">Workitem List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
            insertTpl: '<b data-workitemid="${id}" class="link">#${name2}</b>',
            displayTpl: "<li class='link'> ${name}  </li>",
            limit: 10,
            suspendOnComposing: true,
            callbacks: {
                filter: function (query, data, searchKey) {
                    var result = [];

                    $.ajax({
                        url: 'api/pm/Feed/GetWorkitemByQuery?pjid=' + $scope.projectId + '&query=' + query,
                        type: 'POST',
                        cache: false,
                        async: false,
                        success: function (data2) {
                            result = $.map(data2.data, function (item, index) {
                                return { 'index': index, 'id': item.id, 'name': item.no + ' - ' + item.name, 'name2': item.name };
                            });
                        },
                    });

                    return result;
                },
            }
        }

        if ($scope.feedParent == null) {
            var inputor = $('#inputor').atwho(workitem_config);
            inputor.atwho('run');
        }
        else {
            var inputorReply = $('#inputorReply_' + $scope.feedParent.id).atwho(workitem_config);
            inputorReply.atwho('run');
        }

        //$scope.post('api/pm/Feed/GetWorkitemByProject?pjid=' + $scope.groupId, null, function (data) {
        //    $scope.feedWorkitem = data;

        //    var workitems = $.map($scope.feedWorkitem, function (item, index) {
        //        return { 'index': index, 'id': item.id, 'name': item.no + ' - ' + item.name, 'name2': item.type.toUpperCase() + ' ' + item.no + ':  ' + item.name };
        //    });

        //    var workitem_config = {
        //        at: "#",
        //        data: workitems,
        //        headerTpl: '<div class="atwho-header">Workitem List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
        //        insertTpl: '<b data-workitemid="${id}" class="link">#${name2}</b>',
        //        displayTpl: "<li class='link'> ${name}  </li>",
        //        limit: 10,
        //    }

        //    if ($scope.feedParent == null) {
        //        var inputor = $('#inputor').atwho(workitem_config);
        //        inputor.focus().atwho('run');
        //    }
        //    else {
        //        var inputorReply = $('#inputorReply_' + $scope.feedParent.id).atwho(workitem_config);
        //        inputorReply.focus().atwho('run');
        //    }
        //});

        //inputor.on("inserted.atwho", function (event, $li, browser_event) {
        //    var data = $li.data('item-data');
        //});
    };

    $scope.loadFeed = function () {
        var countSkip = $scope.feeds.length;
        var take = 5;
        var group = $scope.groupType == "project" ? $scope.projectId : $scope.areaId;
        $scope.postDataAsync('api/pm/Feed/getFeed', { groupID: group, countSkip: countSkip, take: take }, function (data) {
            $.each(data, function (index, item) {
                item.feed.sendTime = moment(item.feed.createdTime).fromNow();
                //item.feed.createdTime2 = moment(item.feed.createdTime).format("H:mm:ss - DD/MM/YYYY");
                $.each(item.feedReply, function (index2, item2) {
                    item2.sendTime = moment(item2.createdTime).fromNow();
                    //item2.createdTime2 = moment(item2.createdTime).format("H:mm:ss - DD/MM/YYYY");
                });
            });

            $scope.$applyAsync(function () {
                if (!$scope.feeds || $scope.feeds.length == 0)
                    $scope.feeds = data;
                else {
                    $.each(data, function (index, item) {
                        $scope.feeds.push(item);
                    });
                }
            });

            addElementToScope("#contentFeed", $scope);
        });

        $scope.postData('api/pm/Feed/updateReadFeed', { groupId: group });
    };

    $scope.addFeed = function () {
        var content = $("#inputor").html();
        if (content == "") {
            showWarning($scope.translation.WARNING_ADD_FEED);
            return;
        }

        $scope.data.content = content;

        //$scope.data.groupId = $scope.projectId;

        $scope.data.parentId = null;
        $scope.data.groupType = $scope.groupType;

        if ($scope.groupType == "area")
            $scope.data.groupId = $scope.areaId;
        else
            $scope.data.groupId = $scope.projectId;

        $scope.data.userRead = [];

        $scope.buildRelated('new');

        $scope.frmFile.append("data", JSON.stringify($scope.data));
        $scope.frmFile.append("projectId", $scope.projectId);
        $scope.frmFile.append("areaId", $scope.areaId);

        $scope.postFile("api/pm/Feed/add", $scope.frmFile, function (data) {
            var parentItem = { feed: data[0], feedReply: [] };
            $scope.feeds.unshift(parentItem);

            $.each($scope.feeds, function (index, item) {
                item.feed.sendTime = moment(item.feed.createdTime).fromNow();
                //item.feed.createdTime = moment(item.feed.createdTime).format("H:mm:ss - DD/MM/YYYY");
            });

            $("#inputor").html('');

            //showSuccess($scope.translation.SUCCESS_ADD_FEED);
        });
    }

    $scope.addFeedReply = function (feedParent) {
        var contentReply = $('#inputorReply_' + feedParent.id).html();
        if (contentReply == "") {
            showWarning($scope.translation.WARNING_ADD_FEED);
            return;
        }

        $scope.data.content = contentReply;
        //$scope.data.groupId = $scope.projectId;

        $scope.data.groupType = $scope.groupType;

        if ($scope.groupType == "area")
            $scope.data.groupId = $scope.areaId;
        else
            $scope.data.groupId = $scope.projectId;

        $scope.data.userRead = [];

        if (feedParent != null) {
            $scope.data.parentId = feedParent.id;
            $scope.data.refId = feedParent.refId;
            $scope.data.refType = feedParent.refType;
            $scope.data.feedType = feedParent.feedType;
            $scope.data.refEntity = feedParent.refEntity;
        }

        if ($scope.data.parentId)
            $('#inputorReply_' + $scope.data.parentId).text('');

        $scope.buildRelated(feedParent.id);

        $scope.frmFile.append("data", JSON.stringify($scope.data));
        $scope.frmFile.append("dataQueue", JSON.stringify($scope.feedQueue));
        $scope.frmFile.append("areaId", $scope.areaId);
        $scope.frmFile.append("projectId", $scope.projectId);

        $scope.postFile("api/pm/Feed/add", $scope.frmFile, function (datas) {
            $.each(datas, function (index, data) {
                data.sendTime = moment(data.createdTime).fromNow();
                //data.createdTime = moment(data.createdTime).format("DD/MM/YYYY");

                if (index == 0) {
                    var dataParent = $scope.feeds.filter(x => x.feed.id == data.parentId)[0];
                    dataParent.feedReply.unshift(data);
                }
                else {
                    if (data.parentId == null) {
                        var parentItem = { feed: data, feedReply: [] };
                        $scope.feeds.unshift(parentItem);
                    }
                    else {
                        var dataParent = $scope.feeds.filter(x => x.feed.id == data.parentId)[0];
                        dataParent.feedReply.unshift(data);
                    }
                }
            });
        });
    }

    $scope.showReply = function (feed) {
        $('#' + feed.id).slideToggle();
        $scope.feedParent = feed;
        $scope.processAtWho();
    }

    $scope.showNotification = function (status) {
        if (status)
            return "d-block";
        else
            return "d-none";
    }

    $scope.showMore = function () {
        $scope.loadFeed();
    }

    $scope.checkUnread = function (feed) {
        if (feed.userRead.indexOf($scope.authService.user.id) == -1)
            return 'unread';
        return '';
    }

    $scope.saveRelatde = function (dataRelated) {
        if (!$scope.relateData[$scope.feedFocus]) $scope.relateData[$scope.feedFocus] = [];
        $.each(dataRelated, function (index, item) {
            var relateItem = $scope.relateData[$scope.feedFocus].filter(x => x.refRelatedId == item.id);
            if (relateItem.length == 0) {
                $scope.relateData[$scope.feedFocus].push(item);
            }
        });
    }

    $scope.addLink = function (id) {
        $scope.feedFocus = id ? id : 'new';
        callModal('modal-add-link');
        $scope.childScope.relatedWork.findLink = {};
        if ($scope.childScope.relatedWork.grid != null)
            $scope.childScope.relatedWork.grid.setData([]);
    };

    $scope.removeLink = function (id, index) {
        $scope.relateData[id].splice(index, 1)
    };

    $scope.buildRelated = function (id) {
        $scope.frmFile = new FormData();
        if ($scope.relateData[id] && $scope.relateData[id].length > 0) {
            var relatedsBuild = [];
            $.each($scope.relateData[id], function (index, item) {
                relatedsBuild.push(item);
                var refItem = {
                    relatedId: item.refRelatedId,
                    refRelatedId: item.relatedId,
                    type: 'hyperlink',
                    entityType: 'PM_Feed',
                };
                relatedsBuild.push(refItem);
            });

            if (relatedsBuild.length > 0)
                $scope.frmFile.append("addRelatedList", JSON.stringify(relatedsBuild));
            $scope.relateData[id] = [];
        }
    };

    $scope.configPriority = {
        templateResult: function (data) {
            return data.id ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        },
        templateSelection: function (data) {
            return data.id ? $('<span><span class="priority priority_0' + data.id.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + data.text + '</span>') : null;
        }
    };

    //recorder
    $scope.recorder = function () {
        $scope.childScopeRecorder = $scope.childScope.recorder;
        if ($scope.childScopeRecorder)
            $scope.childScopeRecorder.callModal();
    }

    $scope.saveRecorder = function () {
        $scope.childScopeRecorder.hideModal();
    }
}]);