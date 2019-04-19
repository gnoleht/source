var queriesSetting = {
    view: {
        module: 'pm',
        formName: 'queries',
        gridName: 'grvWorkItemQueries',
    }
};

function queriesInitSetting() {
    queriesSetting.grid = {
        url: 'api/pm/queries/GetWorkItems',

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
                id: 'id', field: 'id', sortable: false, name: "", width: 25, minWidth: 25, maxWidth: 30, filterable: false,
                header: {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-view-list-tree",
                        command: 'collapseAll',
                        showOnHover: false,
                    }]
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '';
                }
            },
            {
                id: "no", field: "no", name: queriesTranslation.NO, width: 60, defaultWidth: 60, sortable: true, dataType: 'text'
            },
            {
                id: "name", field: "name", name: queriesTranslation.NAME, width: 600, minWidth: 300, sortable: true, fieldFilter: 'no;name', dataType: 'text',
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
                id: 'priority', name: queriesTranslation.PRIORITY, field: 'priority', sortable: true, dataType: 'select', listName: 'priority', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = queriesSetting.listFilter.priority[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            },
            {
                id: "state", field: "state", name: queriesTranslation.STATE, width: 130, defaultWidth: 130, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = queriesSetting.listFilter.state[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            },
            {
                id: 'type', name: queriesTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'workItemType', width: 130, minWidth: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
            {
                id: 'assignRelated', name: queriesTranslation.ASSIGN, field: 'assignRelated', fieldFilter: 'displayName', sortable: false, dataType: 'text', width: 300, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> <span class="txt_user_tb">' + value.displayName + '</span></div>';
                    }
                }
            },
            {
                id: "sprintRelated", field: "sprintRelated", name: queriesTranslation.SPRINT, width: 100, sortable: false, dataType: 'text', width: 350, minWidth: 100, fieldFilter: 'name',
                formatter: function (r, c, val) {
                    if (val) {
                        return val.name;
                    }
                }
            },
            { id: "lastChangeState", field: "lastChangeState", name: queriesTranslation.LASTCHANGESTATE, sortable: true, dataType: 'datetime', width: 150, formatter: Slick.Formatters.Date }
        ],
        hiddenColumns: [
            { id: "actualStartDate", field: "actualStartDate", name: queriesTranslation.ACTUAL_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "actualEndDate", field: "actualEndDate", name: queriesTranslation.ACTUAL_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "actualDuration", field: "actualDuration", name: queriesTranslation.ACTUAL_DURATION, sortable: true, width: 100 },
            {
                id: "acceptanceCriteria", field: "acceptanceCriteria", name: queriesTranslation.ACCEPTANCE_CRITERIA, sortable: true, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: "approved", field: "approved", name: queriesTranslation.APPROVE, width: 100, sortable: true,
                formatter: function (r, c, val) {
                    if (val) return queriesTranslation.APPROVED;
                    return queriesTranslation.NOT_APPROVE;
                }
            },
            {
                id: "areaRelated", field: "areaRelated", name: queriesTranslation.AREA, width: 100, fieldFilter: 'name',
                formatter: function (row, cell, value) {
                    return value ? value.name : '';
                }
            },
            { id: "originalEstimate", field: "originalEstimate", name: queriesTranslation.ORIGINAL_ESTIMATE, sortable: true, width: 100 },
            { id: "remaining", field: "remaining", name: queriesTranslation.REMAINING, sortable: true, width: 100 },
            { id: "completed", field: "completed", name: queriesTranslation.COMPLETED, sortable: true, width: 100 },
            { id: "planStartDate", field: "planStartDate", name: queriesTranslation.PLAN_START_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "planEndDate", field: "planEndDate", name: queriesTranslation.PLAN_END_DATE, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "planDuration", field: "planDuration", name: queriesTranslation.PLAN_DURATION, sortable: true, width: 100 },
            { id: "risk", field: "risk", name: queriesTranslation.RISK, sortable: true, width: 100 },
            { id: "modifiedTime", field: "modifiedTime", name: queriesTranslation.MODIFIEDTIME, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            { id: "createdTime", field: "createdTime", name: queriesTranslation.CREATEDTIME, sortable: true, width: 100, formatter: Slick.Formatters.Date },
            {
                id: "description", field: "description", name: queriesTranslation.DESCRIPTION, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: 'size', name: queriesTranslation.POINT, field: 'size', sortable: false, dataType: 'number', width: 100, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.type == "userstory")
                        return '<a class="editsize">' + value + '</a>';
                    else
                        return value;

                }
            },
            {
                id: "category", field: "category", name: queriesTranslation.TYPE_CATEGORY, width: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
        ]
    };

    queriesSetting.options = {
        loadButton: true
    };

    queriesSetting.valuelist = {
        parentQueries: [
            //{ id: "noneParent", text: "" },
            //{ id: "assignedToMe", text: "Assigned to me" },
            //{ id: "unSaved", text: "Unsaved work items" },
            { id: "myFavorites", text: "My Favorites" },
            { id: "teamFavorites", text: "Team Favorites" },
            { id: "myQueries", text: "My Queries" },
            { id: "currentIteration", text: "Current Iteration" },
            { id: "troublesshooting", text: "Troublesshooting" }
        ],

        vllType: [
            { id: "none", text: "" },
            { id: "and", text: "And" },
            { id: "or", text: "Or" }
        ],

        vllField: [
            //{ id: "AcceptanceCriteria", text: queriesTranslation.ACCEPTANCE_CRITERIA },
            //{ id: "ActualDuration", text: queriesTranslation.ACTUAL_DURATION },
            { id: "ActualEndDate", text: queriesTranslation.ACTUAL_END_DATE },
            { id: "ActualStartDate", text: queriesTranslation.ACTUAL_START_DATE },
            { id: "Assign", text: queriesTranslation.ASSIGN },
            { id: "Area", text: queriesTranslation.AREA },
            { id: "Completed", text: queriesTranslation.COMPLETED },
            { id: "CreatedBy", text: queriesTranslation.CREATEDBY },
            { id: "CreatedTime", text: queriesTranslation.CREATEDTIME },
            { id: "Category", text: queriesTranslation.TYPE_CATEGORY },
            { id: "Description", text: queriesTranslation.DESCRIPTION },
            { id: "LastChangeState", text: queriesTranslation.LASTCHANGESTATE },
            { id: "LastUpdate", text: queriesTranslation.LASTUPDATE },
            { id: "ModifiedBy", text: queriesTranslation.MODIFIEDBY },
            { id: "ModifiedTime", text: queriesTranslation.MODIFIEDTIME },
            { id: "Name", text: queriesTranslation.NAME },
            { id: "No", text: queriesTranslation.NO },
            //{ id: "OriginalEstimate", text: queriesTranslation.ORIGINAL_ESTIMATE },
            //{ id: "PlanDuration", text: queriesTranslation.PLAN_DURATION },
            { id: "PlanEndDate", text: queriesTranslation.PLAN_END_DATE },
            { id: "PlanStartDate", text: queriesTranslation.PLAN_START_DATE },
            { id: "Priority", text: queriesTranslation.PRIORITY },
            //{ id: "Reason", text: queriesTranslation.REASON },
            { id: "Remaining", text: queriesTranslation.REMAINING },
            //{ id: "RequirementSources", text: queriesTranslation.REQUIREMENT },
            //{ id: "Risk", text: queriesTranslation.RISK },
            //{ id: "Size", text: queriesTranslation.SIZE },
            { id: "Sprint", text: queriesTranslation.SPRINT },
            { id: "State", text: queriesTranslation.STATE },
            //{ id: "TargetDate", text: queriesTranslation.TARGET_DATE },
            { id: "Type", text: queriesTranslation.TYPE },
            //{ id: "Version", text: queriesTranslation.VERSION }
        ],

        operatorSource: [],

        operatorUser: [//Assigned To, Created By, Work Item Type, Changed By, State
            { id: "=", text: "=" },
            { id: "<>", text: "<>" },
            { id: ">", text: ">" },
            { id: "<", text: "<" },
            { id: ">=", text: ">=" },
            { id: "<=", text: "<=" },
            { id: "Contains", text: "Contains" },
            { id: "Does Not Contain", text: "Does Not Contain" },
            { id: "In", text: "In" },
            { id: "In Group", text: "In Group" },
            { id: "Not In Group", text: "Not In Group" },
            { id: "Was Ever", text: "Was Ever" },
            //{ id: "= [Field]", text: "= [Field]" },
            //{ id: "<> [Field]", text: "<> [Field]" },
            //{ id: "> [Field]", text: "> [Field]" },
            //{ id: "< [Field]", text: "< [Field]" },
            //{ id: ">= [Field]", text: ">= [Field]" },
            //{ id: "<= [Field]", text: "<= [Field]" }
        ],

        operatorDate: [//Created Date, Changed Date
            { id: "=", text: "=" },
            { id: "<>", text: "<>" },
            { id: ">", text: ">" },
            { id: "<", text: "<" },
            { id: ">=", text: ">=" },
            { id: "<=", text: "<=" },
            { id: "In", text: "In" },
            { id: "Was Ever", text: "Was Ever" },
            //{ id: "= [Field]", text: "= [Field]" },
            //{ id: "<> [Field]", text: "<> [Field]" },
            //{ id: "> [Field]", text: "> [Field]" },
            //{ id: "< [Field]", text: "< [Field]" },
            //{ id: ">= [Field]", text: ">= [Field]" },
            //{ id: "<= [Field]", text: "<= [Field]" }
        ],

        operatorIteration: [//Iteration Path, Area Path
            { id: "Under", text: "Under" },
            { id: "Not Under", text: "Not Under" },
            { id: "=", text: "=" },
            { id: "<>", text: "<>" },
            { id: "In", text: "In" }
        ],

        operatorTitle: [
            { id: "=", text: "=" },
            { id: "<>", text: "<>" },
            { id: ">", text: ">" },
            { id: "<", text: "<" },
            { id: ">=", text: ">=" },
            { id: "<=", text: "<=" },
            { id: "Contains", text: "Contains" },
            { id: "Does Not Contain", text: "Does Not Contain" },
            { id: "Does Not Contain Words", text: "Does Not Contain Words" },
            { id: "In", text: "In" },
            { id: "In Group", text: "In Group" },
            { id: "Not In Group", text: "Not In Group" },
            { id: "Was Ever", text: "Was Ever" },
            //{ id: "= [Field]", text: "= [Field]" },
            //{ id: "<> [Field]", text: "<> [Field]" },
            //{ id: "> [Field]", text: "> [Field]" },
            //{ id: "< [Field]", text: "< [Field]" },
            //{ id: ">= [Field]", text: ">= [Field]" },
            //{ id: "<= [Field]", text: "<= [Field]" }
        ],

        valueSource: [],

        sprint: [{ id: "@CurrentIteration", text: "@CurrentIteration" }],

        workItemType: [
            { id: "", text: "[Any]" },
            { id: "bug", text: "Bug" },
            { id: "epic", text: "Epic" },
            { id: "requirement", text: "Requirement" },
            { id: "issue", text: "Issue" },
            { id: "task", text: "Task" },
            { id: "testCase", text: "Test Case" },
            { id: "userStory", text: "User story" }
        ],

        today: [
            { id: "@Today", text: "@Today" },
            { id: "@Today - 1", text: "@Today - 1" },
            { id: "@Today - 7", text: "@Today - 7" },
            { id: "@Today - 30", text: "@Today - 30" }
        ],

        user: [
            { id: "", text: "" },
            { id: "@Me", text: "@Me" }
        ],
    };
    queriesSetting.listFilter = {};
    queriesSetting.required = ['id', 'name'];

    queriesSetting.readonly = ["oldName"];
}