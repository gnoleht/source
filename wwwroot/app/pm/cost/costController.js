'use strict';
app.register.controller('costController', ['$scope', '$location', 'authService', '$timeout', function ($scope, $location, authService, $timeout) {

    $scope.idx = 0;
    $scope.authService = authService;
    //check
    $scope.listDetail = [];
    $scope.listRelated = [];
    $scope.attachments = [];
    $scope.listRelatedRemove = [];
    $scope.currentListRelated = [];

    $scope.actionDetail = null;
    $scope.table_detail = null;
    $scope.paymentProgress = {};

    $scope.listFileRemove = [];
    $scope.listFileUpload = [];
    $scope.project = {};

    $scope.onload = function () {
        modalPlusEvent('modal-cost');
    };



    $scope.$on('$routeChangeSuccess', function () {

        $('#modal-cost').on('shown.bs.modal', function () {
            $scope.modalDialogWidth = $(this).find('.modal-dialog').outerWidth(true);
        });

        $(window).resize(function (e) {
            $scope.modalDialogWidth = $('#modal-cost .modal-dialog').outerWidth(true);

            //$('#cost #grvDetail').height(210);
            $('#cost #grvDetail').width($scope.modalDialogWidth);

            if ($scope.grvDetail)
                $scope.grvDetail.resizeCanvas();
        });

        $(window).resize();

        $("#cost").on('click', function () {
            $("#cost-context-menu").hide();
            $("#cost-progress-context").hide();
        });
        //init('cost', $scope);
        $scope.params.time = moment(new Date()).format("MM-YYYY");
        $scope.setting.options.pid = $scope.menuParams.pid;
        $scope.setting.options.pjid = $scope.menuParams.pjid;
        $scope.postNoAsync('api/sys/user/getlist', null, function (data) {
            $scope.setting.valuelist.user = data;
        });
        $scope.grid.loadData(costSetting.grid.url += "?pid=" + $scope.params.pid + "&pjid=" + $scope.params.pjid + "&module=" + $scope.params.module + "&area=" + $scope.params.area);
        $scope.data.test = "demo2";
        $.ajax({
            url: '/app/pm/valuelist.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
                $scope.setting.valuelist.state = [
                    {
                        "id": "new",
                        "text": "New",
                        "class": "status_new",
                        "icon": "fa fa-circle"
                    },
                    {
                        "id": "active",
                        "text": "Active",
                        "class": "status_active",
                        "icon": "fa fa-circle"
                    },
                    {
                        "id": "resolved",
                        "text": "Resolved",
                        "class": "status_resolved",
                        "icon": "fa fa-circle"
                    },
                    {
                        "id": "closed",
                        "text": "Closed",
                        "class": "status_closed",
                        "icon": "fa fa-circle"
                    },
                    {
                        "id": "approved",
                        "text": "Approved",
                        "class": "state_approved"
                    },
                    {
                        "id": "removed",
                        "text": "Removed",
                        "class": "status_removed",
                        "icon": "fa fa-circle"
                    }
                ];
            },
        });
        //load list Areas
        $scope.postNoAsync('api/pm/member/getListAreaByObjectId?id=' + $scope.params.pjid, null, function (data) {
            $scope.setting.valuelist.area = data;
        });

        $('#btnScreenAlt').on('click', function () {
            if ($('#dialog-modal').hasClass('modal-medium')) {
                $('#dialog-modal').toggleClass('modal-medium modal-full');
                $("i", this).removeClass().addClass("bowtie-icon bowtie-view-full-screen-exit");
            }
            else {
                $('#dialog-modal').toggleClass('modal-full modal-medium');
                $("i", this).removeClass().addClass("bowtie-icon bowtie-view-full-screen");
            };
        });

        $scope.attachments = [];
        setSelectedMenu("cost");

    });


    $scope.displayTitle = function () {
        $scope.button.print = true;
        if ($scope.params.module == 'pm') {
            toogleProduct(true);
            $scope.translation['PROJECT'] = $scope.translation['PRODUCT'];
            if ($scope.params.area) {
                toogleArea(true);
            }
        }
        else if ($scope.params.module == 'pj') {
            toogleProject(true);
            $scope.button.viewProgress = true;
            if ($scope.params.area) {
                toogleArea(true);
            }
        }
    };

    $scope.displayFunction = function () {
        // $("#btn_getPaymentProgress").css('display', 'block');
        $scope.button.copy = false;

        //$("#btnPrint").show();
        //$("#btnViewProgress").show();
    };

    $scope.reLoad = function () {
        $scope.attachments = [];
        $scope.listRequirement = null;
        $scope.listFunction = null;
        $scope.childs = [];
        $scope.childsFunction = [];
        $scope.listRelatedRemove = [];
        $scope.currentListRelated = [];
        $scope.listRelated = [];
    };

    $scope.reLoadDetail = function () {
        $scope.detail = null;
        $scope.actionDetail = "add";
    };
    //function
    $scope.add = function () {
        var temp = $("#btnAdd").position();
        var inputSearchWidth = $("#inputSearch").width();
        if ($scope.params.module == 'pm') {
            $scope.addOtherCost();
        }
        else {
            var otherCost = costTranslation.OTHER_COST;
            var staffCost = costTranslation.STAFF_COST;

            if ($("#cost-context-menu").css("display") == "block")
                $("#cost-context-menu").hide();
            else
                $("#cost-context-menu").css({ "top": (temp.top + 30) + "px", "right": (inputSearchWidth + 60) + "px" }).show();

        }
    };
    $scope.viewProgress = function () {
        //var temp = $("#btnViewProgress").position();
        var inputSearchWidth = $("#inputSearch").width();
        if ($("#cost-progress-context").css("display") == "block")
            $("#cost-progress-context").hide();
        else {
            $scope.postData('api/pm/project/getById', { id: $scope.params.module == "pm" ? $scope.params.pid : $scope.params.pjid }, function (data) {
                $scope.project.contractValue = data.contractValue;
                //sum costPlanning
                $scope.postNoAsync("api/pm/PlanDetail/GetCostPlanning" + '?pjid=' + $scope.params.pjid, null, function (data) {
                    $scope.project.costPlan = data.total;
                });
                $scope.project.actualRevenue = 0;
                var thisGridData = $scope.grid.dataView.getItems();
                var thisActualRevenue = thisGridData.filter(function (item) { return item.category == "contract"; });
                $.each(thisActualRevenue, function (key, value) {
                    $scope.project.actualRevenue += value.sum;
                });

                $scope.project.actualExpenditure = 0;
                var thisGridData = $scope.grid.dataView.getItems();
                var thisActualExpenditure = thisGridData.filter(function (item) { return item.category != "contract"; });
                $.each(thisActualExpenditure, function (key, value) {
                    $scope.project.actualExpenditure += -(value.sum);
                });


                //Draw css 
                var maxProjectCost = Math.max($scope.project.contractValue, $scope.project.costPlan, $scope.project.actualRevenue, $scope.project.actualExpenditure);
                var tempCalcPer = $scope.project.contractValue / maxProjectCost * 100;
                $("#contractValue").css({ "width": tempCalcPer + "%" });
                $("#contractValue").attr("aria-valuenow", tempCalcPer);
                tempCalcPer = $scope.project.costPlan / maxProjectCost * 100;
                $("#costPlan").css({ "width": tempCalcPer + "%" });
                $("#costPlan").attr("aria-valuenow", tempCalcPer);

                tempCalcPer = $scope.project.actualRevenue / maxProjectCost * 100;
                $("#actualRevenue").css({ "width": tempCalcPer + "%" });
                $("#actualRevenue").attr("aria-valuenow", tempCalcPer);

                tempCalcPer = $scope.project.actualExpenditure / maxProjectCost * 100;
                $("#actualExpenditure").css({ "width": tempCalcPer + "%" });
                $("#actualExpenditure").attr("aria-valuenow", tempCalcPer);
            });


            //show 
            $("#cost-progress-context").css({ "top": "92px", "right": (inputSearchWidth + 60) + "px" }).show();


        }
    };
    $scope.print = function () {

        var data = $scope.grid.getCurrentData();
        if (data == null || data == undefined) {
            showError(costTranslation.ERROR_PRINT);
            return;
        }
        $scope.data = $.extend(true, {}, data);
        if ($scope.data.departmentDebit == null || $scope.data.departmentDebit == "") {
            //get departmentDebit
            var tempProjectId = $scope.params.module == "pm" ? $scope.params.pid : $scope.params.pjid;
            $scope.postNoAsync('api/pm/cost/getProjectDetail?id=' + tempProjectId, null, function (data) {
                if (data == null || data.departmentRelated == null) {
                    showError($scope.translation.ERR_DEPARTMENTDEBIT);
                    return;
                } else {
                    $scope.data.departmentDebit = data.department;
                    $scope.data.departmentRelated = {};
                    $scope.data.departmentRelated = data.departmentRelated;
                }
            });
        }

        var params = { objectId: $scope.data.id };
        $scope.postData('api/pm/document/getAttachment', params, function (dataAttach) {
            $scope.data.attachments = {};
            $scope.data.attachments = dataAttach;
        });
        $scope.data.dateSign = new Date();
        $scope.data.sumTotal = 0;
        $scope.data.sumTotalChar = '';
        for (var i = 0; i < $scope.data.details.length; i++) {
            $scope.data.sumTotal += $scope.data.details[i].price * $scope.data.details[i].qty;

        }
        $scope.data.sumTotalChar = ReadTextFromNumber($scope.data.sumTotal);
        //callModal('modal-print');

        $('#printArea').printThis({
            importCSS: false,
        });
    };

    $scope.addOtherCost = function () {
        $scope.reLoad();

        $scope.action = "add";
        $scope.data = {};
        $scope.data.state = 'new';
        $scope.data.reason = 'new';
        $scope.data.paymentMethod = 'transfer';
        $scope.data.bankName = 'Vietcombank';
        $scope.data.category = 'business';


        $scope.data.area = $scope.params.area;

        $scope.data.createdBy = authService.user.displayName;
        //get departmentDebit
        var tempProjectId = $scope.params.module == "pm" ? $scope.params.pid : $scope.params.pjid;
        $scope.postNoAsync('api/pm/cost/getProjectDetail?id=' + tempProjectId, null, function (data) {
            if (data == null || data.departmentRelated == null) {
                showError($scope.translation.ERR_DEPARTMENTDEBIT);
                return;
            } else {
                $scope.data.departmentDebit = data.department;
                $scope.data.departmentRelated = {};
                $scope.data.departmentRelated = data.departmentRelated;
            }
        });
        $scope.data.projectCode = {};
        $scope.data.projectCode.code = $scope.params.module == 'pm' ? $scope.menuParams.pid : $scope.menuParams.pjid;
        $scope.data.productCode = {};
        $scope.data.productCode.code = $scope.params.module == 'pm' ? $scope.menuParams.pid : $scope.menuParams.pjid;

        $scope.listDetail = [];
        $scope.discussion = [];
        $scope.history = [];
        $scope.defaultData = $.extend(true, {}, $scope.data);
        $("#divCreatedBy").css("display", "none");
        if ($scope.grvDetail == null)
            initSlickGrid($scope, 'grvDetail');
        var dataView = $scope.grvDetail.dataView;
        dataView.beginUpdate();
        dataView.getItems().length = 0;
        dataView.endUpdate();
        var html = "<p style='color:black;margin-top:20px;font-weight:400;'>" + costTranslation.IN_WORDS + ": " + ReadTextFromNumber(0) + "</p>"
        $("#totalDetail").html(html);

        $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
        $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");

        callModal('modal-cost', true, 'txtNamePS');

        $timeout(function () {
            $(window).resize();
        });

        $scope.attachments = [];
        $scope.listFileRelated = [];
        $scope.listFileUpload = [];
        $scope.folders = [];
        $scope.listFileRemove = [];
        $scope.relatedList = {};
    }

    $scope.addData = function () {
        $scope.data.details = $scope.grvDetail.dataView.getItems();

        $scope.data.productId = $scope.params.pid;
        $scope.data.projectId = $scope.params.pjid;


        if ($scope.data.bankName != null) {
            $scope.data.transfer = 1;
            $scope.data.cash = 0;
        }
        else {
            $scope.data.transfer = 0;
            $scope.data.cash = 1;
        }

        //$scope.frmFile.delete("data");
        $scope.frmFile.append("data", JSON.stringify($scope.data));

        $scope.buildAttachment();
        $scope.buildRelated();

        $scope.postFile("api/pm/Cost/Add", $scope.frmFile, function (data) {
            $scope.defaultData = null;
            if (data.state != "removed")
                $scope.grid.dataView.insertItem(0, data);
            $scope.grid.invalidate();
            $scope.grid.render();
            $('#modal-cost').modal('hide');
            $scope.data = null;
            $scope.listRelated = [];
            $scope.listRelatedRemove = [];
            $scope.refreshFrm(["data", "file", "relate"]);
        }, function (data) {
            $scope.refreshFrm(["data", "file", "relate"]);
        });

    };

    $scope.addDetail = function () {
        $scope.detail = {};
        var date = new Date();
        var val = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        $("#targetdate").text(val);
        $("#targetdate").val(val);
        $scope.detail.qty = 0;
        $scope.detail.price = 0;
        $scope.actionDetail = "add";
        callModal('modal-detail');
        $("#txt_name").focus();
    }

    $scope.addDetailExe = function () {
        if (checkValidate("#txt_name", costTranslation.ERROR_NAME)) return;
        if (checkValidate("#txt_invoiceNo", costTranslation.ERROR_INVOICENO)) return;
        if (checkValidate("#txtPrice", costTranslation.ERROR_PRICE)) return;
        if (checkValidate("#txtQty", costTranslation.ERROR_QTY)) return;
        //	return;
        //else {
        //$scope.detail.amount = $scope.convertInputMask($("#txtAmount").text());
        //$scope.detail.price = $scope.convertInputMask($scope.detail.price);

        $scope.detail.invoiceNo = ($("#txt_invoiceNo").val() != "" ? $("#txt_invoiceNo").val() : "");
        var newRow = $scope.detail, newId = $scope.grvDetail.dataView.getLength();
        //newRow.amount = newRow.price * newRow.qty;
        newRow.id = newId + 1;
        $scope.grvDetail.dataView.insertItem(0, newRow);
        $scope.grvDetail.invalidate();
        //$scope.listDetail.push($scope.detail);
        $('#modal-detail').modal('hide');
    }

    $scope.edit = function () {
        var data = $scope.grid.getCurrentData();
        if (data == null || data == undefined) {
            showError(costTranslation.ERROR_TABLE);
            return;
        }
        if (data.type == 1) return;
        else {
            $scope.action = "edit";
            $scope.data = $.extend(true, {}, data);
            if ($scope.data.departmentDebit == null || $scope.data.departmentDebit == "") {
                //get departmentDebit
                var tempProjectId = $scope.params.module == "pm" ? $scope.params.pid : $scope.params.pjid;
                $scope.postNoAsync('api/pm/cost/getProjectDetail?id=' + tempProjectId, null, function (data) {
                    if (data == null || data.departmentRelated == null) {
                        showError($scope.translation.ERR_DEPARTMENTDEBIT);
                        return;
                    } else {
                        $scope.data.departmentDebit = data.department;
                        $scope.data.departmentRelated = {};
                        $scope.data.departmentRelated = data.departmentRelated;
                    }
                });
            }


            if ($scope.data.transfer == 1) {
                $("#txtTransfer").prop("checked", true);
                $scope.payMth = 'transfer';
            }
            else {
                $scope.payMth = 'cash';
                $("#txtCash").prop("checked", true);
            }
            $("#divCreatedBy").css("display", "block");
            $scope.loadTableDetail($scope.data.details);
            $scope.defaultData = $.extend(true, {}, $scope.data);

            $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
            $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
            callModal('modal-cost', true, 'txtNamePS');

            $scope.reLoad();

            $scope.getHistory();
            $scope.getComment();

            $scope.relatedList = {};
            //$scope.getListRequirement("get");

            $scope.listFileRelated = [];
            $scope.listFileUpload = [];
            $scope.folders = [];
            $scope.listFileRemove = [];
            $scope.listChildRemove = [];

            $scope.GetRelatedWork();
            $scope.getAttachment($scope.data.id);
        }
    };

    $scope.editDetail = function () {
        var item = getItemSelected("grvDetail");
        if (item == null || item == undefined) {
            showError(costTranslation.ERROR_TABLE);
        }
        else {
            $scope.actionDetail = "edit";
            $scope.detail = item;
            callModal('modal-detail');
            $("#txt_name").focus();
        }
    };

    $scope.editData = function () {

        $scope.data.details = $scope.grvDetail.dataView.getItems();
        $scope.data.productId = $scope.params.pid;

        if ($scope.data.bankName != null) {
            $scope.data.transfer = 1;
            $scope.data.cash = 0;
        }
        else {
            $scope.data.transfer = 0;
            $scope.data.cash = 1;
        }
        //$scope.frmFile.delete("data");
        $scope.frmFile.append("data", JSON.stringify($scope.data));
        $scope.buildAttachment();
        $scope.buildRelated();
        $scope.postFile("api/pm/Cost/Update", $scope.frmFile, function (data) {
            //$scope.postData("api/pm/Cost/Update", { data: JSON.stringify($scope.data) }, function (data) {
            $scope.defaultData = null;
            if (data.state != "removed")
                $scope.grid.dataView.updateItem(data.id, data);
            else
                $scope.grid.dataView.deleteItem(data.id);
            $scope.grid.invalidate();
            $scope.grid.render();
            $('#modal-cost').modal('hide');
            $scope.data = null;
            $scope.listRelated = [];
            $scope.listRelatedRemove = [];
            $scope.refreshFrm(["data", "fileUploads", "relate", "relRemove"]);
        }, function (data) {
            $scope.refreshFrm(["data", "fileUploads", "relate", "relRemove"]);
        });
    };

    $scope.copy = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null || data == undefined) {
            showError(costTranslation.ERROR_TABLE);
            return;
        }

        $scope.action = 'add';
        $scope.data = $.extend(true, {}, data);
        $scope.data.id = null;
        $scope.defaultData = $.extend(true, {}, $scope.data);

        $("#divCreatedBy").css("display", "none");

        if ($scope.grvDetail == null)
            initSlickGrid($scope, 'grvDetail');
        var dataView = $scope.grvDetail.dataView;

        dataView.beginUpdate();
        dataView.getItems().length = 0;
        dataView.endUpdate();
        var html = "<p style='color:black;margin-top:20px;font-weight:400;'>" + costTranslation.IN_WORDS + ": " + ReadTextFromNumber(0) + "</p>"
        $("#totalDetail").html(html);

        $scope.getHistory();
        $scope.getComment();
        $scope.GetRelatedWork();

        callModal('modal-cost');
        $("#txtNamePS").focus();
    };

    $scope.updateDetail = function () {
        //$scope.detail.amount = $scope.convertInputMask($("#txtAmount").text());
        //$scope.detail.price = $scope.convertInputMask($scope.detail.price);
        $scope.grvDetail.dataView.updateItem($scope.detail.id, $scope.detail);
        $scope.grvDetail.invalidate();
        $('#modal-detail').modal('hide');
        var test = $scope.data;
    };
    //save
    $scope.save = function () {

        if ($scope.data.paymentMethod == 'transfer') {
            if (!$scope.data.bankName || $scope.data.bankName == "") {
                showError(costTranslation.ERROR_FIELD + costTranslation.BANKNAME.toLowerCase());
                $("#bankName").attr("required", "required");
                $("#bankName").focus();
                return false;
            }
            if (!$scope.data.bankBranch || $scope.data.bankBranch == "") {
                showError(costTranslation.ERROR_FIELD + costTranslation.BANKBRANCH.toLowerCase());
                $("#bankBranch").attr("required", "required");
                $("#bankBranch").focus();
                return false;
            }
            if (!$scope.data.bankNo || $scope.data.bankNo == "") {
                showError(costTranslation.ERROR_FIELD + costTranslation.BANKNO.toLowerCase());
                $("#bankNo").attr("required", "required");
                $("#bankNo").focus();
                return false;
            }
        }

        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        $scope.frmFile = new FormData();
        if ($scope.action == "add")
            $scope.addData();
        else
            $scope.editData();
    }

    $scope.GetRelatedWork = function () {
        $scope.childScope.relatedWork.relatedList = {};
        $scope.postNoAsync('api/workitem/GetRelatedWork?id=' + $scope.data.id, null, function (data) {
            if (data.relateds != null && data.relateds.length > 0) {
                $.each(data.relateds, function (index, item) {
                    $scope.relatedList[item.type] = $scope.relatedList[item.type] == undefined ? [] : $scope.relatedList[item.type];
                    $scope.relatedList[item.type].push(item);
                });
            }
        });
    };

    //save detail
    $scope.saveDetail = function () {
        if ($scope.actionDetail == "add")
            $scope.addDetailExe();
        else
            $scope.updateDetail();
    }
    //hiển thị modal xóa
    $scope.delete = function () {
        var cost = $scope.grid.getCurrentData();
        if (cost == undefined || cost == null) {
            showError(costTranslation["EER_CHOOSE_DELETE"]);
        }
        else {
            $scope.data = cost;
            $('#modal-confirm').modal();
        }
    };
    //hiển thị modal xóa detail
    $scope.deleteDetail = function () {
        var item = getItemSelected("grvDetail");
        if (item == undefined || item == null) {
            showError(costTranslation["EER_CHOOSE_DELETE"]);
        }
        else {
            $('#modal-confirmDetail').modal();
        }
    };

    $scope.deleteDetailExe = function () {
        //$scope.listDetail.splice($.inArray($scope.listDetail[$scope.idx], $scope.listDetail), 1);
        var item = getItemSelected("grvDetail");
        $scope.grvDetail.dataView.deleteItem(item.id);
        $scope.grvDetail.invalidate();
    };
    //xóa
    $scope.deleteData = function () {
        var cost = $scope.grid.getCurrentData();
        $scope.post("api/pm/Cost/Delete", JSON.stringify(cost),
            function (data) {
                //$scope.table.row('.selected').remove().draw(false);
                $scope.grid.dataView.deleteItem($scope.data.id);
                $scope.grid.invalidate();
                $scope.reLoad();
            },
            function (data) {
            },
        );
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

    //Lấy comment theo id
    $scope.getComment = function () {
        $scope.post("api/pm/Cost/getComment?id=" + $scope.data.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.discussion = data;
            $scope.$digest();
        });
    };
    //Đăng comment theo id
    $scope.postComment = function (comment) {
        if ($scope.data.id) {
            if (comment && !isNullOrEmpty(comment.content)) {
                comment.PMId = $scope.data.id.toString();
                $scope.postNoAsync("api/pm/Cost/postComment", JSON.stringify(comment), function (data) {
                    comment.createdByRelated = $scope.authService.user;
                    var thisTime = new Date();
                    //comment.createdTime = moment(data.createdTime).fromNow();
                    comment.createdTime = moment(thisTime).fromNow();
                }, function () { comment = false; });
                return comment;
            }
            else {
                showWarning("Empty input comment content!");
            }
        }
        else {
            showError();
        }
        return false;
    };

    //Lấy thông tin lịch sử của cost	
    $scope.getHistory = function () {
        $scope.post("api/pm/Cost/getHistory?id=" + $scope.data.id, null, function (data) {
            $.each(data, function (index, val) {
                data[index].oldValue = JSON.parse(val.oldValue);
                data[index].newValue = JSON.parse(val.newValue);
                data[index].createdTime = moment(data[index].createdTime).fromNow();
            });
            $scope.history = data;
            $scope.$apply();
        });
    };


    //Lấy danh sách related
    function getlistRelated(list, type) {
        $scope.post("api/pm/Cost/getRelated?id=" + $scope.data.id, null, function (data) {
            $scope.currentListRelated = data;
            $.each(data, function (index, val) {
                var item = list.find(x => x.id == val.functionId && val.functionType == type);
                if (item != null) {
                    if (type == "Requirement") {
                        $scope.childs.push(item);
                        $scope.listRequirement = $.grep(list, function (val) {
                            return val != item;
                        });
                        list = $scope.listRequirement;
                    }
                    if (type == "Function") {
                        $scope.childsFunction.push(item);
                        $scope.listFunction = $.grep(list, function (val) {
                            return val != item;
                        });
                        list = $scope.listFunction;
                    }
                }
            })
        });
    };
    //xoa related work
    $scope.removeRelated = function (item) {
        $("#" + item.id).remove();
        if (item.type == "Requirement") {
            var obj = $scope.currentListRelated.find(x => x.functionId == item.id);
            if (obj != null)
                $scope.listRelatedRemove.push(obj);
            else {
                $scope.listRelated = $.grep($scope.listRelated, function (val) {
                    return val.functionId != item.id;
                })
            }
            $scope.listRequirement.push(item);
            $scope.childs = $.grep($scope.childs, function (val) {
                return val != item;
            })
        }
        if (item.type == "Functional") {
            var obj = $scope.currentListRelated.find(x => x.functionId == item.id);
            if (obj != null)
                $scope.listRelatedRemove.push(obj);
            else {
                $scope.listRelated = $.grep($scope.listRelated, function (val) {
                    return val.functionId != item.id;
                })
            }
            $scope.listFunction.push(item);
            $scope.childsFunction = $.grep($scope.childsFunction, function (val) {
                return val != item;
            })
        }
    }
    //get Payment Progress
    $scope.getPaymentProgress = function () {
        var contractValue = 0, plannedCost = 0, actualReceived = 0, actualCost = 0;
        var cost = $scope.grid.dataView.getItems();
        var array = [];
        $scope.post("api/pm/Envision/GetBusinessObjective?pid=" + $scope.params.pid, null, function (data) {
            actualCost = sumPaymentProgress(JSON.parse(data.cost), data.timeOfProject);
            actualReceived = sumPaymentProgress(JSON.parse(data.revenue), data.timeOfProject);
            $.each(cost, function (inx, val) {
                if (val.sum > 0)
                    contractValue += val.sum;
                else
                    plannedCost += (0 - val.sum);
            });
            $scope.paymentProgressList = [{ "id": contractValue, "val": "contractValue", "percent": 0 }, { "id": plannedCost, "val": "plannedCost", "percent": 0 }, { "id": actualCost, "val": "actualCost", "percent": 0 }, { "id": actualReceived, "val": "actualReceived", "percent": 0 }];
            $scope.paymentProgressList.sort(function (x, y) {
                return x.id - y.id;
            });

            $scope.paymentProgressList[3].percent = 100;
            $scope.paymentProgressList[2].percent = parseFloat($scope.paymentProgressList[2].id / $scope.paymentProgressList[3].id).toFixed(2) * 100;
            $scope.paymentProgressList[1].percent = parseFloat($scope.paymentProgressList[1].id / $scope.paymentProgressList[3].id).toFixed(2) * 100;
            $scope.paymentProgressList[0].percent = parseFloat($scope.paymentProgressList[0].id / $scope.paymentProgressList[3].id).toFixed(2) * 100;

            $.each($scope.paymentProgressList, function (inx, val) {
                if (val.val == "contractValue") {
                    $scope.paymentProgress.contractValue = val.id.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " VND";
                    $scope.paymentProgress.percentContractValue = val.percent;
                }
                if (val.val == "plannedCost") {
                    $scope.paymentProgress.plannedCost = val.id.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " VND";
                    $scope.paymentProgress.percentPlannedCost = val.percent;
                }
                if (val.val == "actualCost") {
                    $scope.paymentProgress.actualCost = val.id.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " VND";
                    $scope.paymentProgress.percentActualCost = val.percent;
                }
                if (val.val == "actualReceived") {
                    $scope.paymentProgress.actualReceived = val.id.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " VND";
                    $scope.paymentProgress.percentActualReceived = val.percent;
                }
            })
        });
        $('#toggleInfo').toggle();
    }
    //add child
    $scope.addChild = function (item, index) {
        var obj = { pmId: $scope.data.id, functionId: item.id, functionType: "Requirement" };
        $scope.listRelated.push(obj);
        $scope.childs.push(item);
        $scope.listRequirement.splice(index, 1);
    };
    //Lấy danh sách function
    $scope.getListFunction = function (type) {
        if (type == "get") {
            if ($scope.listFunction === null || $scope.listFunction === undefined) {
                $scope.post("api/function/Get?pid=" + $scope.params.pid, null, function (data) {
                    $scope.listFunction = data;
                    getlistRelated(data, "Function");
                });
            }
        }
        else {
            if ($scope.listFunction.length == 0)
                showError($scope.translation.ERR_NOT_ITEM);
        }
    };
    //add child function
    $scope.addChildFunction = function (item, index) {
        var obj = { pmId: $scope.data.id, functionId: item.id, functionType: "Function" };
        $scope.listRelated.push(obj);
        $scope.childsFunction.push(item);
        $scope.listFunction.splice(index, 1);
    }
    //sum payment progress
    function sumPaymentProgress(data, count) {
        var result = 0, year = 0;
        $.each(data, function (inx, val) {
            for (var i = 1; i <= count; i++) {
                if (val["year" + i] == "" || val["year" + i] == undefined)
                    val["year" + i] = 0;
                year += parseInt(val["year" + i]);
            }
            result += parseFloat(val.price) * year;
        })
        return result;
    }
    //load table detail
    $scope.loadTableDetail = function (data) {
        if ($scope.grvDetail == null) {
            initSlickGrid($scope, 'grvDetail');
            if ($scope.grvDetail)
                $scope.grvDetail.editAction = function () {
                    $scope.$applyAsync(function () { $scope.editDetail(); });
                };
        }

        $("#grvDetail .slick-headerrow").css("display", "none");
        if (data != null) {
            $.each(data, function (index, item) { item.id = index.toString() });
            //$scope.listDetail = data;
            $scope.grvDetail.setData(data);
            $scope.grvDetail.resizeCanvas();
        }

        //display slick grid with modal
        //$('#modal-cost').one('shown.bs.modal', function (e) { grid.resizeCanvas(); });
    }
    //get item selected 
    function getItemSelected(grv) {
        var grid = $scope[grv];
        var dataView = $scope[grv + "DataView"];
        var selectList = grid.getSelectedRows();
        var item = grid.getDataItem(selectList[0]);
        return item;
    }
    //covert float
    function convertString(str) {
        if (str == null || str == 0)
            return 0;
        return str.toString().replace(/,/g, '').split('.')[0];
    }
    // Kiểm tra trường hợp lệ
    function checkValidate(ele, strError) {
        var varName = $(ele).val();
        if (!varName) {
            $(ele).attr("placeholder", costTranslation.ERROR_INPUT);
            $(ele).focus();
            showError(strError);
            return true;
        }
        else {
            $(ele).removeAttr("placeholder");
            return false;
        }
    }
    //check length of input
    $scope.checkLength = function (event, ele, le) {
        if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
            event.preventDefault();
        }
        var count = $(ele).val();
        if (count.length > le) {
            showError(costTranslation.ERROR_LENGTH + (le + 1) + " " + costTranslation.CHARACTER);
            $(ele).val(count.substring(0, le));
        }

    }

    $scope.collapseButton = function () {
        if ($(".multi-collapse").hasClass('show')) {
            $(".multi-collapse").collapse('hide');
        }
        else {
            $(".multi-collapse").collapse('show');
        }

    };


}]);