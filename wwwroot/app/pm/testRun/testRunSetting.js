var testRunSetting = {
    view: {
        module: 'pm',
        formName: 'testRun',
        gridName: 'grvPBL',
        entityName: 'PM_WorkItem'
    }
};

function testRunInitSetting() {
    testRunSetting.grid = {
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
                id: "name", field: "name", name: testRunTranslation.NAME, width: 340, minWidth: 200, fieldFilter: 'name', dataType: 'text',
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

    testRunSetting.gridChild = {
        grvTestPlan: {
            url: 'api/pm/testPlan/getPBL',

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
                multiColumnSort: false,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: "outcome", field: "outcome", name: testRunTranslation.RESULT, width: 180, defaultWidth: 130, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value == null) { return ""; }

                        var spacer = '<span style="display:inline-block;height:1px;width:' + (35 * dataContext.indent + (dataContext.hasChild ? 0 : 40)) + 'px"></span>';
                        var groupText = "";
                        var result = '<div class="middle_40">' + spacer;

                        switch (value) {
                            case "1-Urgent":
                                groupText = '<i class=\"bowtie-icon bowtie-square priority priority_01\" style="display: inline-block;transform: rotate(45deg);padding: 0 5px;"></i>' + testRunTranslation.URGENT;
                                break;
                            case "2-High":
                                groupText = '<i class=\"bowtie-icon bowtie-square priority priority_02\" style="display: inline-block;transform: rotate(45deg);padding: 0 5px;"></i>' + testRunTranslation.HIGH;     
                                break;
                            case "3-Normal":
                                groupText = '<i class=\"bowtie-icon bowtie-square priority priority_03\" style="display: inline-block;transform: rotate(45deg);padding: 0 5px;"></i>' + testRunTranslation.NORMAL;                                
                                break;
                            case "4-Low":
                                groupText = '<i class=\"bowtie-icon bowtie-square priority priority_04\" style="display: inline-block;transform: rotate(45deg);padding: 0 5px;"></i>' + testRunTranslation.LOW;
                                break;
                            default:
                                groupText = '<i class=\"fa fa-circle status_' + value.toLowerCase() + '\"></i>&nbsp;' + testRunSetting.listFilter.testCaseState[toLowerFirstLetter(value)].text; 
                                break;
                        }

                        result = result + groupText + '</div>';
                        return result;
                    }
                },
                {
                    id: "no", field: "no", name: testRunTranslation.NO, sortable: false, filterable: false, width: 70,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value == 0) { return ""; }
                        return value;
                    }
                },
                {
                    id: "name", field: "name", name: testRunTranslation.NAME, width: 700, minWidth: 120, sortable: false, filterable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {                      
                        if (value == null) { return ""; }
                        return value;
                    }
                },
                {
                    id: "createdBy", field: "createdBy", name: testRunTranslation.CREATEDBY, sortable: false, dataType: 'select', listType: 'user', width: 200, minWidth: 80,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var arrsuser = testRunSetting.valuelist.user.filter(function (item) { return item.id == value; });
                        if (arrsuser.length == 0)
                            return "";
                        return arrsuser[0].text;
                    }
                },
                {
                    id: "modifiedBy", field: "modifiedBy", name: testRunTranslation.RUNBY, sortable: false, dataType: 'select', listType: 'user', width: 200, minWidth: 80,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var arrsuser = testRunSetting.valuelist.user.filter(function (item) { return item.id == value; });
                        if (arrsuser.length == 0)
                            return "";
                        return arrsuser[0].text;
                    }
                }
            ],

            hiddenColumns: [
                //{
                //    id: 'priority', name: testRunTranslation.PRIORITY, field: 'priority', sortable: false, dataType: 'select', listName: 'priority', width: 150, minWidth: 100,
                //    formatter: function (row, cell, value, columnDef, dataContext) {
                //        var itemList =  testRunSetting.listFilter.priority[value];
                //        if (itemList)
                //            return gridItemRender(itemList);
                //        return value;
                //    }
                //},
                {
                    id: "sprint", field: "sprint", name: testRunTranslation.SPRINT, sortable: false, dataType: 'select', listType: 'sprint', width: 130, minWidth: 130,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var arrsprint = testRunSetting.valuelist.sprint.filter(function (item) { return item.id == value; });
                        if (arrsprint.length == 0)
                            return "";
                        return arrsprint[0].text;
                    }
                },
                { id: "lastChangeState", field: "lastChangeState", name: testRunTranslation.LASTCHANGESTATE, sortable: false, dataType: 'datetime', width: 150, formatter: Slick.Formatters.Date },
                { id: "actualStartDate", field: "actualStartDate", name: testRunTranslation.ACTUAL_START_DATE, sortable: false, width: 100, formatter: Slick.Formatters.Date },
                { id: "actualEndDate", field: "actualEndDate", name: testRunTranslation.ACTUAL_END_DATE, sortable: false, width: 100, formatter: Slick.Formatters.Date },
                { id: "actualDuration", field: "actualDuration", name: testRunTranslation.ACTUAL_DURATION, sortable: false, width: 100 },
                {
                    id: "acceptanceCriteria", field: "acceptanceCriteria", name: testRunTranslation.ACCEPTANCE_CRITERIA, sortable: false, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                {
                    id: "approved", field: "approved", name: testRunTranslation.APPROVE, width: 100, sortable: false,
                    formatter: function (r, c, val) {
                        if (val) return testRunTranslation.APPROVED;
                        return testRunTranslation.NOT_APPROVE;
                    }
                },
                { id: "area", field: "area", name: testRunTranslation.AREA, sortable: false, width: 100 },
                {
                    id: "category", field: "category", name: testRunTranslation.TYPE_CATEGORY, sortable: false, width: 100,
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                { id: "originalEstimate", field: "originalEstimate", name: testRunTranslation.ORIGINAL_ESTIMATE, sortable: false, width: 100 },
                { id: "remaining", field: "remaining", name: testRunTranslation.REMAINING, sortable: false, width: 100 },
                { id: "completed", field: "completed", name: testRunTranslation.COMPLETED, sortable: false, width: 100 },
                { id: "planStartDate", field: "planStartDate", name: testRunTranslation.PLAN_START_DATE, sortable: false, width: 100, formatter: Slick.Formatters.Date },
                { id: "planEndDate", field: "planEndDate", name: testRunTranslation.PLAN_END_DATE, sortable: false, width: 100, formatter: Slick.Formatters.Date },
                { id: "planDuration", field: "planDuration", name: testRunTranslation.PLAN_DURATION, sortable: false, width: 100 },
                { id: "risk", field: "risk", name: testRunTranslation.RISK, sortable: false, width: 100 },
                { id: "createdTime", field: "createdTime", name: testRunTranslation.CREATEDTIME, sortable: false, width: 100, formatter: Slick.Formatters.Date },
                {
                    id: "description", field: "description", name: testRunTranslation.DESCRIPTION, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                }
            ]
        },

        grvTestResults: {
            url: 'api/pm/testPlan/getTestResults',

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
                allowFilter: false,
                allowCustom: true,
                autoHeight: false,
                explicitInitialization: true
            },

            columns: [
                {
                    id: "name", field: "name", name: testRunTranslation.WINAME, width: 880, minWidth: 200, fieldFilter: 'name', dataType: 'text',
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
                    id: "assign", field: "assign", name: testRunTranslation.ASSIGN, sortable: true, dataType: 'select', listType: 'user', width: 200, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var arrsuser = testRunSetting.valuelist.user.filter(function (item) { return item.id == value; });
                        if (arrsuser.length == 0)
                            return "";
                        return arrsuser[0].text;
                    }
                },
                {
                    id: "state", name: testRunTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 150, minWidth: 80,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = testRunSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                }
            ]
        },

        gridImport: {
            url: 'api/pm/testPlan/getTestPlanImport',
            defaultUrl: 'api/pm/testPlan/getTestPlanImport',

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
                    id: "name", field: "name", name: testRunTranslation.IMPORTNAME, width: 450, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                    id: 'type', name: testRunTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'type', width: 100, minWidth: 60,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return capitalizeText(value);
                        }
                    }
                },
                {
                    id: 'assignRelated', name: testRunTranslation.ASSIGN, field: 'assignRelated', sortable: false, dataType: 'text', width: 220, minWidth: 100, fieldFilter: 'displayName',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return '<a class="editmember"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> ' + value.displayName + '</a>';
                        }
                    }
                },
                {
                    id: "projectRelated", name: testRunTranslation.PROJECT, field: "projectRelated", sortable: false, dataType: 'text', width: 200, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value)
                            return value.name;
                    }
                },
                {
                    id: "state", name: testRunTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 120, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = testRunSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                }
            ]
        }
    };

    testRunSetting.valuelist = {
        user: getDataAsync('api/sys/user/getlist')
    };

    testRunSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar'
            }],
        loadButton: true
    };
}