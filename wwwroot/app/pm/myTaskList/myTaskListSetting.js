var myTaskListSetting = {
    view: {
        module: 'pm',
        formName: 'myTaskList',
        gridName: 'grvMyTaskList'
    }
};

function myTaskListInitSetting() {
    myTaskListSetting.grid = {
        url: 'api/pm/myTaskList/get',
        defaultUrl: 'api/pm/myTaskList/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

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
                id: "resourceName", field: "resourceName", name: myTaskListTranslation.RESOURCENAME, width: 700, minWidth: 500, sortable: false, dataType: 'text',
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
                    }
                    if (!dataContext.hasChild)
                        result = result + '<span class="type_' + dataContext.type.toLowerCase() + '"> ' + dataContext.no + ': ' + value + '</span></div>';
                    else
                        result = result + '<span style="padding-left:3px;"> ' + value + '</span></div>';
                    return result;
                }
            },
            {
                id: "originalEstimate", field: "originalEstimate", name: myTaskListTranslation.ORIGINAL_ESTIMATE, width: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + '</span>';
                }
            },
            {
                id: "remaining", field: "remaining", name: myTaskListTranslation.REMAINING, width: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + '</span>';
                }
            },
            {
                id: "completed", field: "completed", name: myTaskListTranslation.COMPLETED, width: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + Math.round(value * 100) / 100 + '</span>';
                }
            },
            {
                id: 'startDate', field: 'startDate', name: myTaskListTranslation.STARTDATE, width: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 2) {
                        if (value != null || value != undefined) {
                            return moment(value).format('DD-MM-YYYY');
                        }
                    }
                }
            },
            {
                id: 'endDate', field: 'endDate', name: myTaskListTranslation.ENDDATE, width: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 2) {
                        if (value != null || value != undefined) {
                            return moment(value).format('DD-MM-YYYY');
                        }
                    }
                }
            },
            {
                id: 'duration', field: 'duration', name: myTaskListTranslation.DURATION, width: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null || value != undefined) {
                        if (value == 0 || value == 1)
                            return value + ' hour';
                        return value + ' hours';
                    }
                }
            },
            {
                id: "state", name: myTaskListTranslation.STATUS, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 2) {
                        return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value);
                    }
                }
            }
        ],
        hiddenColumns: [
            {
                id: "actualStartDate", field: "actualStartDate", name: myTaskListTranslation.ACTUAL_START_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            {
                id: "actualEndDate", field: "actualEndDate", name: myTaskListTranslation.ACTUAL_END_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            { id: "actualDuration", field: "actualDuration", name: myTaskListTranslation.ACTUAL_DURATION, width: 160 },
            {
                id: "approved", field: "approved", name: myTaskListTranslation.APPROVE, width: 100,
                formatter: function (r, c, val) {
                    if (dataContext.indent == 2) {
                        if (val) return myTaskListTranslation.APPROVED;
                        return myTaskListTranslation.NOT_APPROVE;
                    }

                }
            },
            { id: "area", field: "area", name: myTaskListTranslation.AREA, width: 100 },
            {
                id: "category", field: "category", name: myTaskListTranslation.TYPE_CATEGORY, width: 100,
                formatter: function (row, cell, value) {
                    if (dataContext.indent == 2) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                }
            },
            {
                id: "description", field: "description", name: myTaskListTranslation.DESCRIPTION, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: "planStartDate", field: "planStartDate", name: myTaskListTranslation.PLAN_START_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            {
                id: "planEndDate", field: "planEndDate", name: myTaskListTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            { id: "planDuration", field: "planDuration", name: myTaskListTranslation.PLAN_DURATION, width: 160 },
            {
                id: "priority", name: myTaskListTranslation.PRIORITY, field: "priority", sortable: false, dataType: 'select', listName: 'priority', width: 120, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.indent == 2) {
                        return '<span class="priority priority_0' + value.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + value.substring(2, value.length);
                    }
                }
            },
            {
                id: "risk", name: myTaskListTranslation.RISK, field: "risk", sortable: false, dataType: 'select', listName: 'risk', width: 120, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return value;
                }
            },
        ]
    };

    myTaskListSetting.valuelist = {
        myTaskListTaskBug: [
            { "id": "task", "text": "Task" },
            { "id": "bug", "text": "Bug" },
            { "id": "all", "text": "Task & Bug" }
        ]
    };

    myTaskListSetting.options = {
        loadButton: true
    };
}