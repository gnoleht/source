var testBuildListSetting = {
    view: {
        module: 'pm',
        formName: 'testBuildList',
        gridName: 'grvWorkItemBuild',
        entityName: 'PM_WorkItem'
    }
};

function testBuildListInitSetting() {
    testBuildListSetting.grid = {
        url: 'api/pm/build/GetBuildWorkItems',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            //headerRowHeight: 0,
            //showHeaderRow: true,
            fullWidthRows: true,
            multiColumnSort: true,
            enableColumnReorder: true,
            enableCellNavigation: true,
            createFooterRow: true,
            showFooterRow: false,
            footerRowHeight: 35,
            filterable: false,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,
            autoHeight: false,
            explicitInitialization: true
        },
        columns: [
            {
                id: 'id', field: 'id', sortable: false, name: "", width: 25, minWidth: 25, maxWidth: 30, filterable: false,
                header: {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-view-list-tree",
                        command: 'collapseAll',
                        showOnHover: false
                    }]
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '';
                }
            },
            {
                id: "name", field: "name", name: testBuildListTranslation.WINAME, width: 800, minWidth: 200, fieldFilter: 'name', dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_40">' + spacer;
                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';

                        } else {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                        }
                    }

                    var sText = capitalizeText(dataContext.type.substring(0, 1));
                    if (sText == "B" || sText == "T")
                        sText += " " + dataContext.no + " - ";
                    else
                        sText += ": ";

                    result = result + '<span class="type_' + dataContext.type.toLowerCase() + '"> ' + sText + value + '</span></div>';
                    return result;
                }
            },
            {
                id: "state", name: testBuildListTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 150, minWidth: 80,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value);
                }
            },
            { id: "modifiedTime", field: "modifiedTime", name: testBuildListTranslation.MODIFIEDTIME, sortable: true, width: 150, formatter: Slick.Formatters.DateTime },
            {
                id: "assign", field: "assign", name: testBuildListTranslation.ASSIGN, sortable: true, dataType: 'select', listType: 'user', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var arrsuser = testBuildListSetting.valuelist.user.filter(function (item) { return item.id == value; });
                    if (arrsuser.length == 0)
                        return "";
                    return arrsuser[0].text;
                }
            }
        ],
        hiddenColumns: [
            {
                id: 'priority', name: testBuildListTranslation.PRIORITY, field: 'priority', sortable: true, dataType: 'select', listName: 'priority', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="priority priority_0' + value.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + value.substring(2, value.length);
                }
            },
            {
                id: "state", field: "state", name: testBuildListTranslation.STATE, width: 130, defaultWidth: 130, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value);
                }
            },
            {
                id: "sprint", field: "sprint", name: testBuildListTranslation.SPRINT, sortable: true, dataType: 'select', listType: 'sprint', width: 130, minWidth: 130,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var arrsprint = testBuildListSetting.valuelist.sprint.filter(function (item) { return item.id == value; });
                    if (arrsprint.length == 0)
                        return "";
                    return arrsprint[0].text;
                }
            },
            { id: "lastChangeState", field: "lastChangeState", name: testBuildListTranslation.LASTCHANGESTATE, sortable: true, dataType: 'datetime', width: 150, formatter: Slick.Formatters.Date },
            { id: "actualStartDate", field: "actualStartDate", name: testBuildListTranslation.ACTUAL_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "actualEndDate", field: "actualEndDate", name: testBuildListTranslation.ACTUAL_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "actualDuration", field: "actualDuration", name: testBuildListTranslation.ACTUAL_DURATION, sortable: true, width: 100 },
            {
                id: "acceptanceCriteria", field: "acceptanceCriteria", name: testBuildListTranslation.ACCEPTANCE_CRITERIA, sortable: true, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: "approved", field: "approved", name: testBuildListTranslation.APPROVE, width: 100, sortable: true,
                formatter: function (r, c, val) {
                    if (val) return testBuildListTranslation.APPROVED;
                    return testBuildListTranslation.NOT_APPROVE;
                }
            },
            { id: "area", field: "area", name: testBuildListTranslation.AREA, sortable: true, width: 100 },
            {
                id: "category", field: "category", name: testBuildListTranslation.TYPE_CATEGORY, sortable: true, width: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
            { id: "originalEstimate", field: "originalEstimate", name: testBuildListTranslation.ORIGINAL_ESTIMATE, sortable: true, width: 100 },
            { id: "remaining", field: "remaining", name: testBuildListTranslation.REMAINING, sortable: true, width: 100 },
            { id: "completed", field: "completed", name: testBuildListTranslation.COMPLETED, sortable: true, width: 100 },
            { id: "planStartDate", field: "planStartDate", name: testBuildListTranslation.PLAN_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "planEndDate", field: "planEndDate", name: testBuildListTranslation.PLAN_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "planDuration", field: "planDuration", name: testBuildListTranslation.PLAN_DURATION, sortable: true, width: 100 },
            { id: "risk", field: "risk", name: testBuildListTranslation.RISK, sortable: true, width: 100 },
            { id: "createdTime", field: "createdTime", name: testBuildListTranslation.CREATEDTIME, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            {
                id: "description", field: "description", name: testBuildListTranslation.DESCRIPTION, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            }
        ]
    };

    testBuildListSetting.options = {
        uploadSetting: []
    };

    testBuildListSetting.valuelist = {
        user: getDataAsync('api/sys/user/getlist')
    };

    testBuildListSetting.readonly = ["name", "buildDate1"];
}