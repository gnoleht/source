//check
var pjCostDetailSetting = {
    view: {
        module: 'pm',
        subModule: 'pj',
        formName: 'pjCostDetail',
        gridName: 'grvPjCostDetail',
    }
};
function pjCostDetailInitSetting() {
    var temp = 0;
    pjCostDetailSetting.grid = {
        url: 'api/pm/pjCostDetail/Get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            headerRowHeight: 0,
            showHeaderRow: true,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 30,

            fullWidthRows: true,
            multiColumnSort: true,
            enableColumnReorder: true,
            enableCellNavigation: true,

            editable: true,
            enableAddRow: true,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: false
        },
        columns: [
            {
                id: 'isCheck', field: 'isCheck', sortable: true,
                name: '',
                width: 30, minWidth: 50, maxWidth: 50, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.parent != "")
                        return "";

                    var icon = dataContext.isCheck ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                    if (dataContext.isCheck) {
                        return '<div style="text-align:-webkit-center"> ' +
                            '<i class="' + icon + ' checkWI" style="cursor:pointer;font-size:17px;width:15.78px"></i >' +
                            '</div> ';
                    }
                    return '<div style="text-align:-webkit-center"> ' +
                        '<i class="' + icon + ' checkWI" style="font-size:18px;width:15.78px"></i >' +
                        '</div> ';
                }
            },
            {
                id: "resourceName", field: "resourceName", name: pjCostDetailTranslation.RESOURCENAME, width: 250, minWidth: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.id == null) { return ""; }
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_40">' + spacer;

                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';
                        } else {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                        }
                        return result + '<span style="padding-left: 2px;"> ' + value + '</span></div>';
                    }
                    //result = result + '<span> ' + value + '</span></div>';
                    result = result + '<span class="type_task"> ' + value + '</span></div>';
                    return result;
                }
            },
            { id: 'groupCost', field: 'groupCost', name: pjCostDetailTranslation.GROUPCOST, width: 100, sortable: true },
            {
                id: 'startDate', field: 'startDate', name: pjCostDetailTranslation.STARTDATE, width: 100, sortable: true, formatter: Slick.Formatters.Date
            },
            {
                id: 'endDate', field: 'endDate', name: pjCostDetailTranslation.ENDDATE, width: 100, sortable: true, formatter: Slick.Formatters.Date
            },
            {
                id: 'costPerHrs', field: 'costPerHrs', name: pjCostDetailTranslation.COSTPERHRS, width: 100, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
                }
            },
            { id: 'hrsPlan', field: 'hrsPlan', name: pjCostDetailTranslation.HRSPLAN, width: 100, sortable: true },
            { id: 'hrsActual', field: 'hrsActual', name: pjCostDetailTranslation.HRSACTUAL, width: 100, sortable: true, hasTotalText: true },
            {
                id: 'hrsApproved', field: 'hrsApproved', name: pjCostDetailTranslation.HRSAPPROVED, sortable: true, width: 120, minWidth: 50,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext == null) { return ""; }
                    if (dataContext.hasChild) { return value; }
                    var result = '<a style="color: #008ccb; font-size: 14px;" class="editHrsApproved"> ' + value + '</a>';
                    return result;
                },
                //editor: Slick.Editors.Integer,
                //cssClass: 'styleCellSlick'
            },
            {
                id: 'costApproved', field: 'costApproved', name: pjCostDetailTranslation.COSTAPPROVED, width: 200, hasTotalCol: true, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
                }

            },

        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            //var i = gridData.length;
            var total = 0;
            $.each(gridData, function (key, value) {
                if (value.isCheck) {
                    total += (parseInt(value.costApproved) || 0);
                }
            });
            var columnElement = grid.getFooterRowColumn("hrsActual");
            $(columnElement).html("<div class='text-right' style='font-weight: bold;'>Total: </div>")
            columnElement = grid.getFooterRowColumn("costApproved");
            $("#totalCostApproved").val(total);
            $(columnElement).html('<div style="font-weight: bold;">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VNĐ' + '</div>');
        },
    };



    pjCostDetailSetting.valuelist = {
        payRangesList: [
            { id: 'Mức 1', text: 'Mức 1' },
            { id: 'Mức 2', text: 'Mức 2' },
            { id: 'Mức 3', text: 'Mức 3' }
        ],
    };

    pjCostDetailSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };

}

//function NumericRangeEditor(args) {
//    var $from, $to;
//    var scope = this;
//    this.init = function () {
//        $from = $("<INPUT type=number style='width:40px' />")
//            .appendTo(args.container)
//            .bind("keydown", scope.handleKeyDown);
//        scope.focus();
//    };   
//    this.init();
//}
