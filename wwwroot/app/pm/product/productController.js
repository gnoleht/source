'use strict';
app.register.controller('productController', ['$scope', '$location', '$route', '$timeout', 'authService', function ($scope, $location, $route, $timeout, authService) {
    // Page load before
    $scope.$on('$routeChangeSuccess', function () {
        $scope.isProduct = true;
        $scope.authService = authService;
        SetPerfectScroll("main_product");

        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });

                $scope.setting.valuelist.state.splice(4, 1);
            },
        });

        $scope.postNoAsync('api/sys/company/getListForUser', null, function (data) {
            $scope.setting.valuelist.department = data;
        });


        $scope.postNoAsync('api/sys/user/getList', null, function (data) {
            $scope.setting.valuelist.owner = data;
            $scope.setting.valuelist.sponser = data;
        });

        //productSetting.valuelist = $scope.setting.valuelist;

        $scope.loadData();

        modalPlusEvent('modal-product');
    });

    $scope.cmbUserId = {
        url: "api/pm/member/getListUserForProject",
        allowClear: true,
    };

    $scope.loadData = function () {
        $scope.postNoAsync('api/pm/Product/GetListProductProject', null, function (data) {
            $scope.listData = data;
            if ($scope.listData && $scope.listData.length > 0) {
                if (!$scope.params.pid)
                    $scope.defaultFirstData = $scope.listData[0];
                else {
                    var lstFilter = $scope.listData.filter(x => x.product.id == $scope.params.pid);
                    if (lstFilter.length != 0)
                        $scope.defaultFirstData = lstFilter[0];
                    else
                        $scope.defaultFirstData = $scope.listData[0];
                }

                setMenu($scope, $scope.defaultFirstData.product, 'pm');
            }
            else {
                $scope.defaultFirstData = {
                    product: { percent: 0 }

                };

            }
        });


        $scope.postNoAsync('api/pm/Product/List_WorkItem_By_Assign', null, function (data) {
            $scope.listWorkItem = data;
        });


        $scope.postNoAsync('api/pm/Product/Statistical_WorkItem', null, function (data) {
            $scope.listStatisticalWorkItem = data;
        });

        $scope.postNoAsync('api/pm/Product/Statistical_WorkItem_Chart', null, function (data) {
            $scope.lstType = data.listtype;
            $scope.dataset = data.dataset;
        });

        $scope.postNoAsync('api/pm/Product/Statistical_WorkItem_Cumulative', null, function (data) {
            $scope.listStatisticalWorkItemCumulative = data;
        });

        if ($scope.defaultFirstData == null) return;

        $scope.loadCountData();
        $scope.loadBarChart();
        $scope.loadAreaChart();
    }

    $scope.checkActive = function (id) {
        if ($scope.defaultFirstData.product.id == id)
            return 'active';
        return '';
    }


    $scope.showPercent = function (product) {
        if ($scope.defaultFirstData.product.id == product.id)
            return { width: product.percent + "%" };
        return { width: '0%' };
    }


    $scope.loadCountData = function () {
        $scope.postData('api/pm/Product/CountData', { product: $scope.defaultFirstData.product }, function (data) {
            if (data) {
                $scope.countData = data;
            }
            else {
                $scope.countData = {
                    project: { url: 'javascript:void(0)', count: 0 },
                    requirement: { url: 'javascript:void(0)', count: 0 },
                    epic: { url: 'javascript:void(0)', count: 0 },
                    function: { url: 'javascript:void(0)', count: 0 },
                    userStory: { url: 'javascript:void(0)', count: 0 },
                    document: { url: 'javascript:void(0)', count: 0 },
                };
            }

        });
    };

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.copy = false;
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

    $scope.loadBarChart = function (data) {
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
                    data: [0, 40, 62, 70],
                    hidden: false,
                    label: 'Closed',
                    fill: true
                },

                {
                    backgroundColor: $scope.transparentize(window.chartColors.green),
                    borderColor: window.chartColors.green,
                    data: [50, 62, 70, 80],
                    hidden: false,
                    label: 'Active',
                    fill: '-1'
                },
                {
                    backgroundColor: $scope.transparentize(window.chartColors.blue),
                    borderColor: window.chartColors.blue,
                    data: [80, 75, 50, 30],
                    hidden: false,
                    label: 'New',
                    fill: '-1'
                },

                {
                    backgroundColor: $scope.transparentize(window.chartColors.red),
                    borderColor: window.chartColors.red,
                    data: [0, 3, 6, 8],
                    hidden: false,
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



    $scope.changeProduct = function (item) {
        if ($scope.defaultFirstData && $scope.defaultFirstData.product.id == item.product.id) return;
        $scope.defaultFirstData = item;
        $(".time_percent span").css("width", item.product.percent + "%");
        $(".product").removeClass("active");
        $('#' + item.product.id).addClass("active");

        $scope.params.pid = item.product.id;
        $scope.params.pjid = null;

        $scope.loadCountData();

        setMenu($scope, item.product, 'pm');
    };


    $scope.changeWorkItem = function (item) {
        //$(".workitem").removeClass("active");
        //$('#' + item.id).addClass("active");
    };

    $scope.clearHtml = function (note) {
        if (note == null)
            return "";
        return note.replace(/<(.|\n)*?>/g, '');
    };



    //function
    $scope.add = function () {
        $scope.action = "add";
        $scope.data = {};
        $scope.data.reason = "new";
        $scope.data.state = "new";
        $scope.data.description = "";

        $scope.data.owner = null;
        $scope.data.sponser = null;
        $scope.data.type = "product";

        $scope.attachments = [];
        $scope.listFileRelated = [];
        $scope.listFileUpload = [];
        $scope.folders = [];
        $("#code").prop('disabled', false);

        $scope.defaultData = angular.copy($scope.data);

        $("#imgAvatar").attr("src", "/img/no-product.jpg");
        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
        callModal('modal-product', true, 'product_name');
        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};
    }

    $scope.edit = function (data) {
        if (!$scope.defaultFirstData) return;

        $scope.listFileRelated = [];
        $scope.listFileUpload = [];
        $scope.folders = [];
        $scope.listFileRemove = [];
        $("#code").prop('disabled', true);


        if (data == null || data == undefined) {
            $scope.data = $scope.defaultFirstData.product;
            //showError(productTranslation.ERROR_TABLE);
        }
        else {
            $scope.data = angular.copy(data);
        }

        $scope.action = "edit";
        $("#imgAvatar").attr("src", "/api/system/viewfile?id=" + $scope.data.pictureThumb + "&def=/img/no-product.jpg");

        $scope.defaultData = angular.copy($scope.data);
        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
        callModal('modal-product', true, 'product_name');
        $scope.frmFile = new FormData();
        $scope.fileAvatar = {};

        $scope.getAttachment($scope.data.id);
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.fileAvatar && $scope.fileAvatar.file) {
            $scope.frmFile.append("file", $scope.fileAvatar.file);
        }

        $scope.buildAttachment();

        if ($scope.action == "add") {
            //$scope.frmFile.delete("data");
            $scope.frmFile.append("data", JSON.stringify($scope.data));

            $scope.postFile("api/pm/Product/Add", $scope.frmFile, function (data) {
                $scope.defaultData = null;
                $('#modal-product').modal('hide');
                $scope.refreshFrm();

                if (data.product.sponser == $scope.authService.user.id || data.product.owner == $scope.authService.user.id) {

                    $scope.$applyAsync(function (e) {
                        $scope.listData.push(data)
                    });

                    showSuccess($scope.translation.SUCCESS_ADD);
                    toogleProduct(true, true);
                }

            }, function (data) {
                $scope.refreshFrm(["data"]);
            });

        }
        else {
            if ($scope.childScope.attachment.listFileRemove !== undefined && $scope.childScope.attachment.listFileRemove.length > 0) {
                $.each($scope.childScope.attachment.listFileRemove, function (index, item) {
                    $scope.frmFile.append("removeFiles", item);
                });
            }

            //$scope.frmFile.delete("data");
            $scope.frmFile.append("data", JSON.stringify($scope.data));


            $scope.postFile("api/pm/product/update", $scope.frmFile, function (data) {
                $scope.defaultData = null;
                $('#modal-product').modal('hide');
                $scope.refreshFrm();
                $scope.data = {};

                $scope.$applyAsync(function (e) {
                    if (data.product.state == "removed") {
                        var index = $scope.defaultFirstData.index;
                        $scope.listData = $scope.listData.filter(obj => obj.index != index);

                        $scope.defaultFirstData = $scope.listData[0];

                        $(".product").removeClass("active");
                        $('#' + $scope.defaultFirstData.product.id).addClass("active");
                        $scope.params.pid = $scope.defaultFirstData.product.id;
                        setMenu($scope, $scope.defaultFirstData.product, 'pm');
                    }
                    else {
                        var index = $scope.defaultFirstData.index;
                        $scope.defaultFirstData = $scope.listData[index];

                        $scope.defaultFirstData.product = data.product;
                        $scope.defaultFirstData.document.count = data.document;
                    }
                });

                showSuccess($scope.translation.SUCCESS_EDIT);

            }, function (data) {
                $scope.refreshFrm(["data"]);
            });
        }
    };

    $scope.delete = function () {
        var data = $scope.defaultFirstData;
        if (data == null) {
            showError(productTranslation["EER_CHOOSE_DELETE"]);
        }
        else {
            $scope.dataDelete = data;
            $('#modal-confirm').modal();
        }
    };
    //config state
    $scope.configState = {
        templateResult: function (data) {
            return $('<span><i class="fa fa-circle status_' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        },
        templateSelection: function (data) {
            return $('<span><i class="fa fa-circle status_' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        }
    }
    //config reason
    $scope.configReason = {
        templateResult: function (data) {
            return $('<span><i class="fa fa-circle reason-' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        },
        templateSelection: function (data) {
            return $('<span><i class="fa fa-circle reason-' + data.text.toLowerCase() + '"></i>&nbsp;' + data.text + '</span>');
        }
    }

    $scope.deleteData = function () {
        if ($scope.dataDelete != null) {
            $scope.post("api/pm/Product/Delete", JSON.stringify($scope.dataDelete.product), function (result) {
                if (result) {
                    $scope.$applyAsync(function (e) {
                        var index = $scope.dataDelete.index;
                        $scope.listData = $scope.listData.filter(obj => obj.index != index);

                        $scope.defaultFirstData = $scope.listData[0];

                        $(".product").removeClass("active");
                        $('#' + $scope.defaultFirstData.product.id).addClass("active");
                        $scope.params.pid = $scope.defaultFirstData.product.id;
                        setMenu($scope, $scope.defaultFirstData.product, 'pm');
                    });
                    showSuccess($scope.translation.SUCCESS_DELETE);
                }
                else {
                    showError($scope.translation.ERROR_DELETE);
                }
            });
        }
    };

    $scope.refresh = function () {
        $scope.loadData();
    }

    $scope.editWorkItem = function (data) {
        //if (data == null || data == undefined) {
        //    showError($scope.translation.ERR_SELECT_DATA_EDIT);
        //}
        //else {
        //    $scope.action = 'edit';
        //    var childScope = $scope.childScope["workItemForm"];
        //    if (childScope)
        //        childScope.dataAction($scope.action, data);
        //}
    }

    $scope.saveWorkItem = function (data) {
        $.each($scope.listWorkItem, function (index, workItem) {
            if (workItem.id == data.id) {
                $scope.$applyAsync(function () {
                    $scope.listWorkItem[index] = data;
                    return false;
                });
            }
        });
    };

    //Lấy thông tin lịch sử
    $scope.getHistory = function () {
        $scope.post("api/pm/Product/gethistory?id=" + $scope.defaultFirstData.product.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].oldValue = JSON.parse(val.oldValue);
                data[index].newValue = JSON.parse(val.newValue);
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.history = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };

    //Lấy comment theo id
    $scope.getComment = function () {
        $scope.post("api/pm/Product/getcomment?id=" + $scope.defaultFirstData.product.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.discussion = data;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    };
    //Đăng comment theo id
    $scope.postComment = function (comment) {
        if ($scope.defaultFirstData.product.id) {
            if (comment) {
                comment.PMId = $scope.data.id.toString();
                $scope.postNoAsync("api/pm/Product/postcomment", JSON.stringify(comment), function (data) {
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

}]);



