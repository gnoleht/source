var testPlanSetting = {
    view: {
        module: 'pm',
        formName: 'testPlan',
        gridName: 'grvPBL',
        entityName: 'PM_WorkItem'
    }
};

function testPlanInitSetting() {
    testPlanSetting.grid = {
        url: 'api/pm/testPlan/getPBL',

        defaultUrl: 'api/pm/testPlan/getPBL',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: false,
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
                id: "name", field: "name", name: testPlanTranslation.NAME, width: 340, minWidth: 200, fieldFilter: 'name', dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_40" title="' + value + '">' + spacer;
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
            }
        ]
    };

    testPlanSetting.gridChild = {
        grvTestPlan: {
            url: 'api/pm/testPlan/GetPBL',

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
                { id: "no", field: "no", name: testPlanTranslation.NO, sortable: true, filterable: false, width: 80 },
                {
                    id: "name", field: "name", name: testPlanTranslation.NAME, width: 800, minWidth: 120, sortable: true, filterable: true, dataType: 'text',
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
                        result = result + '<span class="type_' + dataContext.type.toLowerCase() + '"> ' + value + '</span></div>';
                        return result;
                    }
                },
                {
                    id: "createdByRef", field: "createdByRef", name: testPlanTranslation.CREATEDBY, sortable: true, width: 250, minWidth: 100, dataType: 'text', fieldFilter: 'displayName',
                    formatter: function (row, cell, value) {
                        return value ? value.displayName : '';
                    }
                },
                {
                    id: "modifiedByRef", field: "modifiedByRef", name: testPlanTranslation.RUNBY, sortable: true, width: 250, minWidth: 100, dataType: 'text', fieldFilter: 'displayName',
                    formatter: function (row, cell, value) {
                        return value ? value.displayName : '';
                    }
                }
            ],

            hiddenColumns: [
                {
                    id: 'priority', name: testPlanTranslation.PRIORITY, field: 'priority', sortable: true, dataType: 'select', listName: 'priority', width: 150, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<span class="priority priority_0' + value.substring(0, 1) + '"><i class="bowtie-icon bowtie-square"></i></span>&nbsp; ' + value.substring(2, value.length);
                    }
                },
                {
                    id: "state", field: "state", name: testPlanTranslation.STATE, width: 130, defaultWidth: 130, sortable: true, dataType: 'select', listName: 'testCaseState',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = testPlanSetting.listFilter.testCaseState[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },
                {
                    id: "sprintRelated", field: "sprint", name: testPlanTranslation.SPRINT, sortable: true, width: 130, minWidth: 130, filterable: false,
                    formatter: function (row, cell, value) {
                        return value ? value.name : '';
                    }
                },
                { id: "lastChangeState", field: "lastChangeState", name: testPlanTranslation.LASTCHANGESTATE, sortable: true, dataType: 'datetime', width: 150, formatter: Slick.Formatters.Date },
                { id: "actualStartDate", field: "actualStartDate", name: testPlanTranslation.ACTUAL_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
                { id: "actualEndDate", field: "actualEndDate", name: testPlanTranslation.ACTUAL_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
                { id: "actualDuration", field: "actualDuration", name: testPlanTranslation.ACTUAL_DURATION, sortable: true, width: 100 },
                {
                    id: "acceptanceCriteria", field: "acceptanceCriteria", name: testPlanTranslation.ACCEPTANCE_CRITERIA, sortable: true, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                {
                    id: "approved", field: "approved", name: testPlanTranslation.APPROVE, width: 100, sortable: true,
                    formatter: function (r, c, val) {
                        if (val) return testPlanTranslation.APPROVED;
                        return testPlanTranslation.NOT_APPROVE;
                    }
                },
                { id: "area", field: "area", name: testPlanTranslation.AREA, sortable: true, width: 100 },
                {
                    id: "category", field: "category", name: testPlanTranslation.TYPE_CATEGORY, sortable: true, width: 100,
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                { id: "originalEstimate", field: "originalEstimate", name: testPlanTranslation.ORIGINAL_ESTIMATE, sortable: true, width: 100 },
                { id: "remaining", field: "remaining", name: testPlanTranslation.REMAINING, sortable: true, width: 100 },
                { id: "completed", field: "completed", name: testPlanTranslation.COMPLETED, sortable: true, width: 100 },
                { id: "planStartDate", field: "planStartDate", name: testPlanTranslation.PLAN_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
                { id: "planEndDate", field: "planEndDate", name: testPlanTranslation.PLAN_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
                { id: "planDuration", field: "planDuration", name: testPlanTranslation.PLAN_DURATION, sortable: true, width: 100 },
                { id: "risk", field: "risk", name: testPlanTranslation.RISK, sortable: true, width: 100 },
                { id: "createdTime", field: "createdTime", name: testPlanTranslation.CREATEDTIME, sortable: true, width: 100, formatter: Slick.Formatters.Date },
                {
                    id: "description", field: "description", name: testPlanTranslation.DESCRIPTION, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                }
            ]
        },

        grvTestResults: {
            url: 'api/pm/testPlan/GetTestResults',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: false,
                allowCustom: true,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                forceFitColumns: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: 'outcome', field: 'outcome', sortable: false, name: testPlanTranslation.OUTCOME, width: 100, minWidth: 100, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = value == 'Passed' ? "bowtie-check" : value == 'Failed' ? "bowtie-math-multiply" : "bowtie-pause";
                        return '<span style="display: flex; align-items: center"> ' +
                            '<i class="mr_10 checkIsShow bowtie-icon ' + icon + '"></i>' + testPlanSetting.listFilter.testCaseState[toLowerFirstLetter(value)].text + '</span> ';
                    }
                },
                {
                    id: "buildName", field: "buildName", name: testPlanTranslation.BUILDNAME, width: 270, minWidth: 100, sortable: true, dataType: 'text'
                },
                {
                    id: "buildDate", field: "buildDate", name: testPlanTranslation.BUILDDATE, width: 150, minWidth: 100, sortable: true, formatter: Slick.Formatters.Date
                },
                {
                    id: "runByRef", field: "runByRef", name: testPlanTranslation.RUNBY, sortable: true, width: 150, minWidth: 100,
                    formatter: function (row, cell, value) {
                        return value ? value.displayName : '';
                    }
                },
                {
                    id: "runDate", field: "runDate", name: testPlanTranslation.RUNDATE, width: 150, minWidth: 100, sortable: true, formatter: Slick.Formatters.Date
                }
            ],

            hiddenColumns: [
                { id: "action", field: "action", name: testPlanTranslation.ACTION, sortable: true, width: 100 },
                { id: "expectedResults", field: "expectedResults", name: testPlanTranslation.EXPECTEDRESULTS, sortable: true, width: 100 }
            ]
        },

        gridImport: {
            url: 'api/pm/testPlan/getTestSuiteImport',

            defaultUrl: 'api/pm/testPlan/getTestSuiteImport',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
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
                    id: 'id', field: 'id', name: "", width: 35, minWidth: 35, maxWidth: 35, filterable: false, sortable: false, hideable: false,
                    header: {
                        buttons: [{
                            cssClass: "bowtie-icon bowtie-checkbox-empty",
                            command: 'checkAll',
                            showOnHover: false,
                        }]
                    },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = dataContext.isCheck ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                        return '<span> ' +
                            '<i class="' + icon + ' checkWI" style="cursor:pointer"></i >' +
                            '</span> ';
                    }
                },
                {
                    id: "name", field: "name", name: testPlanTranslation.IMPORTNAME, width: 450, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                        result = result + '<span class="type_' + dataContext.type.toLowerCase() + '"> ' + dataContext.no + ': ' + value + '</span></div>';
                        return result;
                    }
                },
                {
                    id: 'type', name: testPlanTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'workItemType', width: 100, minWidth: 60,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return capitalizeText(value);
                        }
                    }
                },
                {
                    id: 'assignRelated', name: testPlanTranslation.ASSIGN, field: 'assignRelated', sortable: false, dataType: 'text', width: 220, minWidth: 100, fieldFilter: 'displayName',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return '<a class="editmember"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> ' + value.displayName + '</a>';
                        }
                    }
                },
                {
                    id: "projectRelated", name: testPlanTranslation.PROJECT, field: "projectRelated", sortable: false, filterable: false, dataType: 'text', width: 200, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value)
                            return value.name;
                    }
                },
                {
                    id: "state", name: testPlanTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 120, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = testPlanSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                }
            ]
        }
    };

    testPlanSetting.valuelist = {};
    testPlanSetting.listFilter = {};

    testPlanSetting.options = {
        uploadSetting: []
    };
}