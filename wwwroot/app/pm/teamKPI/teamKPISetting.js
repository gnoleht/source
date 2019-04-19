var teamKPISetting = {
    view: {
        module: 'pm',
        formName: 'teamKPI',
        gridName: 'grvKPI',
        entityName: ''
    }
};

function teamKPIInitSetting() {
    teamKPISetting.grid = {
        url: 'api/pm/teamKPI/get',
        defaultUrl: 'api/pm/teamKPI/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,
            allowExport: true,

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
                id: 'id', field: 'id', sortable: false, name: "", width: 25, minWidth: 25, maxWidth: 25, filterable: false,
                header: {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-view-list",
                        command: 'collapseAll',
                        showOnHover: false,
                    }]
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '';
                }
            },
            {
                id: "name", field: "name", name: teamKPITranslation.NAME, width: 600, minWidth: 200, sortable: false, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.id == null) { return ""; }
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_40">' + spacer;
                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed)
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';
                        else
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                    }
                    if (!dataContext.hasChild)
                        result = result + '<span class="type_' + dataContext.type.toLowerCase() + '"> ' + dataContext.no + ': ' + value + '</span></div>';
                    else
                        result = result + '<span style="padding-left:3px;"> ' + value + '</span></div>';
                    return result;
                }
            },
            {
                id: 'sumTaskNew', field: 'sumTaskNew', name: teamKPITranslation.SUMTASKNEW, width: 52, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + value + '</span>';
                    else if (value == 1)
                        return '<span class="center" style="display:block;">x</span>';
                    return '';
                }
            },
            {
                id: 'sumTaskActive', field: 'sumTaskActive', name: teamKPITranslation.SUMTASKACTIVE, width: 67, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + value + '</span>';
                    else if (value == 1)
                        return '<span class="center" style="display:block;">x</span>';
                    return '';
                }
            },
            {
                id: 'sumTaskClosed', field: 'sumTaskClosed', name: teamKPITranslation.SUMTASKCLOSED, width: 67, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + value + '</span>';
                    else if (value == 1)
                        return '<span class="center" style="display:block;">x</span>';
                    return '';
                }
            },
            {
                id: 'sumTaskResolved', field: 'sumTaskResolved', name: teamKPITranslation.SUMTASKRESOLVED, width: 67, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + value + '</span>';
                    else if (value == 1)
                        return '<span class="center" style="display:block;">x</span>';
                    return '';
                }
            },
            {
                id: 'avgTaskCompleted', field: 'avgTaskCompleted', name: teamKPITranslation.AVGTASKCOMPLETED, width: 80, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + "%" + '</span>';
                    return '';
                }
            },
            {
                id: 'originalEstimate', field: 'originalEstimate', name: teamKPITranslation.ORIGINALESTIMATE, width: 83, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + '</span>';
                }
            },
            {
                id: 'remaining', field: 'remaining', name: teamKPITranslation.REMAINING_WORK, width: 94, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + '</span>';
                }
            },
            {
                id: 'completed', field: 'completed', name: teamKPITranslation.COMPLETED_WORK, width: 93, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + '</span>';
                }
            },
            {
                id: 'originalCompleted', field: 'originalCompleted', name: teamKPITranslation.ORIGINAL_COMPLETED, width: 150, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + '</span>';
                }
            },
            {
                id: 'capacity', field: 'capacity', name: teamKPITranslation.CAPACITY, width: 93, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + value + '</span>';
                }
            },
            {
                id: 'workLate', field: 'workLate', name: teamKPITranslation.WORKLATE, width: 93, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + value + '</span>';
                    return '';
                }
            },
            {
                id: 'efforfCompleted', field: 'efforfCompleted', name: teamKPITranslation.EFFORFCOMPLETED, width: 83, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + "%" + '</span>';
                    return '';
                }
            },
            {
                id: 'kpi', field: 'kpi', name: teamKPITranslation.KPI, width: 74, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 0)
                        return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + "%" + '</span>';
                    return '';
                }
            }
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems().filter(x => x.indent == 0);
            var totalNew = 0;
            var totalActive = 0;
            var totalClosed = 0;
            var totalOriginalEstimate = 0;
            var totalRemaining = 0;
            var totalCompleted = 0;
            var originalCompleted = 0;
            var workLate = 0;
            var totalkpi = 0;
            var totalEfforfCompleted = 0;
            var totalAvgTaskCompleted = 0;

            $.each(gridData, function (key, value) {
                totalNew += (parseInt(value.sumTaskNew) || 0);
                totalActive += (parseInt(value.sumTaskActive) || 0);
                totalClosed += (parseInt(value.sumTaskClosed) || 0);
                totalAvgTaskCompleted += (parseFloat(value.avgTaskCompleted) || 0);
                totalOriginalEstimate += (parseFloat(value.originalEstimate) || 0);
                totalRemaining += (parseFloat(value.remaining) || 0);
                totalCompleted += (parseFloat(value.completed) || 0);
                originalCompleted += (parseFloat(value.originalCompleted) || 0);
                workLate += (parseInt(value.workLate) || 0);
                totalEfforfCompleted += (parseFloat(value.efforfCompleted) || 0);
                totalkpi += (parseFloat(value.kpi) || 0);
            });

            totalAvgTaskCompleted = gridData.length == 0 ? 0 : totalAvgTaskCompleted / gridData.filter(x => x.indent == 0).length;
            totalEfforfCompleted = gridData.length == 0 ? 0 : totalEfforfCompleted / gridData.filter(x => x.indent == 0).length;
            totalkpi = gridData.length == 0 ? 0 : totalkpi / gridData.filter(x => x.indent == 0).length;

            var columnElement = grid.getFooterRowColumn("name");
            $(columnElement).html("<div class='text-right'>" + teamKPITranslation.TOTAL + ": </div>");

            columnElement = grid.getFooterRowColumn("sumTaskNew");
            $(columnElement).html(totalNew);

            columnElement = grid.getFooterRowColumn("sumTaskActive");
            $(columnElement).html(totalActive);

            columnElement = grid.getFooterRowColumn("sumTaskClosed");
            $(columnElement).html(totalClosed);

            columnElement = grid.getFooterRowColumn("avgTaskCompleted");
            $(columnElement).html(Math.round(totalAvgTaskCompleted * 100) / 100 + "%");

            columnElement = grid.getFooterRowColumn("originalEstimate");
            $(columnElement).html(Math.round(totalOriginalEstimate * 100) / 100);

            columnElement = grid.getFooterRowColumn("remaining");
            $(columnElement).html(Math.round(totalRemaining * 100) / 100);

            columnElement = grid.getFooterRowColumn("completed");
            $(columnElement).html(Math.round(totalCompleted * 100) / 100);

            columnElement = grid.getFooterRowColumn("originalCompleted");
            $(columnElement).html(Math.round(originalCompleted * 100) / 100);

            columnElement = grid.getFooterRowColumn("workLate");
            $(columnElement).html(workLate);

            columnElement = grid.getFooterRowColumn("efforfCompleted");
            $(columnElement).html(Math.round(totalEfforfCompleted * 100) / 100 + "%");

            columnElement = grid.getFooterRowColumn("kpi");
            $(columnElement).html(Math.round(totalkpi * 100) / 100 + "%");
        }
    };

    teamKPISetting.valuelist = {
        myTaskListTaskBug: [
            { "id": "task", "text": "Task" },
            { "id": "bug", "text": "Bug" },
            { "id": "all", "text": "Task & Bug" }
        ]
    };
};