var myBonusSetting = {
    view: {
        module: 'pm',
        formName: 'myBonus',
        gridName: 'grvKPI',
        entityName: ''
    }
};
function myBonusInitSetting() {

    myBonusSetting.grid = {
        url: 'api/pm/myBonus/get',
        defaultUrl: 'api/pm/myBonus/get',

        options: {
            rowHeight: 50,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 30,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },

        columns: [
            {
                id: "resourceName", field: "resourceName", name: myBonusTranslation.RESOURCENAME, width: 500, minWidth: 200, sortable: false, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.id == null) { return ""; }
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_50">' + spacer;
                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';
                        } else {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                        }
                    }
                    if (!dataContext.hasChild)
                        result = result + '<span class="type_' + dataContext.type.toLowerCase() + '"> ' + value + '</span></div>';
                    else
                        result = result + '<span style="padding-left:3px;"> ' + value + '</span></div>';
                    return result;
                }
            },
            {
                id: "state", name: myBonusTranslation.STATUS, field: "state", sortable: false, dataType: 'text', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 1) {
                        return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value);
                    }
                }
            },
            {
                id: 'originalEstimate', field: 'originalEstimate', name: myBonusTranslation.ORIGINALESTIMATE, width: 150, hasTextTotal: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + value + '</span>';
                }
            },
            {
                id: 'remaining', field: 'remaining', name: myBonusTranslation.REMAINING_WORK, width: 150, hasTextTotal: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + value + '</span>';
                }
            },
            {
                id: 'completed', field: 'completed', name: myBonusTranslation.COMPLETED_WORK, width: 180, hasTextTotal: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + value + '</span>';
                }
            },
            {
                id: 'totalEfforfDone', field: 'totalEfforfDone', name: myBonusTranslation.TOTAL_EFFORF_DONE, width: 150, hasTextTotal: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.parent == null) {
                        return '<span class="center" style="display:block;">' + value + '</span>';
                    }
                }
            }
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var totalOriginalEstimate = 0, totalRemaining = 0, totalCompleted = 0;

            $.each(gridData, function (key, value) {
                if (value.hasChild) {
                    totalOriginalEstimate += (parseInt(value.originalEstimate) || 0);
                    totalRemaining += (parseInt(value.remaining) || 0);
                    totalCompleted += (parseInt(value.completed) || 0);
                }
            });
            var columnElement = grid.getFooterRowColumn("state");
            $(columnElement).html("<div class='text-right'>" + myBonusTranslation.TOTAL + ": </div>")

            columnElement = grid.getFooterRowColumn("originalEstimate");
            $(columnElement).html(totalOriginalEstimate);

            columnElement = grid.getFooterRowColumn("remaining");
            $(columnElement).html(totalRemaining);

            columnElement = grid.getFooterRowColumn("completed");
            $(columnElement).html(totalCompleted);
        },
    };

    myBonusSetting.options = {};

    myBonusSetting.valuelist = {
    };

    myBonusSetting.required = [
    ];

    myBonusSetting.readonly = [
    ];
}