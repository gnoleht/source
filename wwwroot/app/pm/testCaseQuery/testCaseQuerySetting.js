var testCaseQuerySetting = {
    view: {
        module: 'pm',
        subModule: 'pm',
        formName: 'function',
        gridName: 'grvTestCaseQuery',
        entityName: 'PM_TestCaseQuery'
    }
};

function testCaseQueryInitSetting() {
    testCaseQuerySetting.grid = {
        url: 'api/pm/build/GetBuildWorkItems',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
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
                id: "name", field: "name", name: testCaseQueryTranslation.NAME, width: 800, minWidth: 200, fieldFilter: 'name', dataType: 'text',
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
                id: "createdBy", field: "createdBy", name: testCaseQueryTranslation.CREATEDBY, sortable: true, dataType: 'select', listType: 'user', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var arrsuser = testCaseQuerySetting.valuelist.user.filter(function (item) { return item.id == value; });
                    if (arrsuser.length == 0)
                        return "";
                    return arrsuser[0].text;
                }
            },
            {
                id: "state", name: testCaseQueryTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 150, minWidth: 80,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = dataContext.type == 'testCase' ? testCaseQuerySetting.listFilter.testCaseState[value] : testCaseQuerySetting.listFilter.state[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            },
            { id: "modifiedTime", field: "modifiedTime", name: testCaseQueryTranslation.MODIFIEDTIME, sortable: true, width: 150, formatter: Slick.Formatters.DateTime },
            {
                id: "assign", field: "assign", name: testCaseQueryTranslation.ASSIGN, sortable: true, dataType: 'select', listType: 'user', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var arrsuser = testCaseQuerySetting.valuelist.user.filter(function (item) { return item.id == value; });
                    if (arrsuser.length == 0)
                        return "";
                    return arrsuser[0].text;
                }
            }
        ],
        hiddenColumns: [
            {
                id: 'priority', name: testCaseQueryTranslation.PRIORITY, field: 'priority', sortable: true, dataType: 'select', listName: 'priority', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="priority priority_0' + value.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + value.substring(2, value.length);
                }
            },
            {
                id: "sprint", field: "sprint", name: testCaseQueryTranslation.SPRINT, sortable: true, dataType: 'select', listType: 'sprint', width: 130, minWidth: 130,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var arrsprint = testCaseQuerySetting.valuelist.sprint.filter(function (item) { return item.id == value; });
                    if (arrsprint.length == 0)
                        return "";
                    return arrsprint[0].text;
                }
            },
            { id: "lastChangeState", field: "lastChangeState", name: testCaseQueryTranslation.LASTCHANGESTATE, sortable: true, dataType: 'datetime', width: 150, formatter: Slick.Formatters.Date },
            { id: "actualStartDate", field: "actualStartDate", name: testCaseQueryTranslation.ACTUAL_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "actualEndDate", field: "actualEndDate", name: testCaseQueryTranslation.ACTUAL_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "actualDuration", field: "actualDuration", name: testCaseQueryTranslation.ACTUAL_DURATION, sortable: true, width: 100 },
            {
                id: "acceptanceCriteria", field: "acceptanceCriteria", name: testCaseQueryTranslation.ACCEPTANCE_CRITERIA, sortable: true, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: "approved", field: "approved", name: testCaseQueryTranslation.APPROVE, width: 100, sortable: true,
                formatter: function (r, c, val) {
                    if (val) return testCaseQueryTranslation.APPROVED;
                    return testCaseQueryTranslation.NOT_APPROVE;
                }
            },
            //{ id: "area", field: "area", name: testCaseQueryTranslation.AREA, sortable: true, width: 100 },
            {
                id: "areaRelated", field: "areaRelated", name: testCaseQueryTranslation.AREA, width: 100, fieldFilter: 'name',
                formatter: function (row, cell, value) {
                    return value ? value.name : '';
                }
            },
            {
                id: "category", field: "category", name: testCaseQueryTranslation.TYPE_CATEGORY, sortable: true, width: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
            { id: "originalEstimate", field: "originalEstimate", name: testCaseQueryTranslation.ORIGINAL_ESTIMATE, sortable: true, width: 100 },
            { id: "remaining", field: "remaining", name: testCaseQueryTranslation.REMAINING, sortable: true, width: 100 },
            { id: "completed", field: "completed", name: testCaseQueryTranslation.COMPLETED, sortable: true, width: 100 },
            { id: "planStartDate", field: "planStartDate", name: testCaseQueryTranslation.PLAN_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "planEndDate", field: "planEndDate", name: testCaseQueryTranslation.PLAN_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "planDuration", field: "planDuration", name: testCaseQueryTranslation.PLAN_DURATION, sortable: true, width: 100 },
            { id: "risk", field: "risk", name: testCaseQueryTranslation.RISK, sortable: true, width: 100 },
            { id: "createdTime", field: "createdTime", name: testCaseQueryTranslation.CREATEDTIME, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            {
                id: "description", field: "description", name: testCaseQueryTranslation.DESCRIPTION, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            }
        ]
    };

    testCaseQuerySetting.valuelist = {
        user: getDataAsync('api/sys/user/getlist')
    };

    testCaseQuerySetting.listFilter = {};

    testCaseQuerySetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar'
            }]
    };
}