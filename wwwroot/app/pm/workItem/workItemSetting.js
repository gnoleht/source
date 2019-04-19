
var workItemSetting = {
    view: {
        page: 'workItem',
        module: 'pm',
        formName: 'workItem',
        gridName: 'grvDataTable',
        entityName: 'PM_WorkItem',
    }
};

var requirementSetting = {
    view: {
        page: 'workItem',
        module: 'pm',
        subModule: 'pm',
        formName: 'requirement',
        gridName: 'grvDataTable',
        entityName: 'PM_WorkItem',
        title: 'PAGE_TITLE_REQUIREMENT'
    }
};
var requirementInitSetting = null;

var epicSetting = {
    view: {
        page: 'workItem',
        module: 'pm',
        subModule: 'pm',
        formName: 'epic',
        gridName: 'grvDataTable',
        entityName: 'PM_WorkItem',
        title: 'PAGE_TITLE_EPIC'
    }
};
var epicInitSetting = null;

var functionSetting = {
    view: {
        page: 'workItem',
        module: 'pm',
        subModule: 'pm',
        formName: 'function',
        gridName: 'grvDataTable',
        entityName: 'PM_WorkItem',
        title: 'PAGE_TITLE_FUNCTION'
    }
};
var functionInitSetting = null;

var userstorySetting = {
    view: {
        page: 'workItem',
        module: 'pm',
        subModule: 'pm',
        formName: 'userstory',
        gridName: 'grvDataTable',
        entityName: 'PM_WorkItem',
        title: 'PAGE_TITLE_USER_STORY'
    }
};
var userstoryInitSetting = null;

function workItemInitSetting() {
    workItemSetting.valuelist = {};
    workItemSetting.listFilter = {};
    workItemSetting.options = { commonForm: true };
    workItemSetting.gridChild = {};

    requirementInitSetting = function () {
        requirementSetting.grid = {
            url: 'api/workItem/get',
            defaultUrl: 'api/user/get',

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
                    id: 'id', field: 'id', name: "", width: 25, minWidth: 25, maxWidth: 30, filterable: false, sortable: false, hideable: false,
                    header: {
                        buttons: [{
                            cssClass: "bowtie-icon bowtie-view-list-tree",
                            command: 'collapseAll',
                            showOnHover: false,
                        }]
                    },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                    }
                },
                {
                    id: "name", field: "name", name: workItemTranslation.NAME, width: 600, minWidth: 200, fieldFilter: 'no;name', dataType: 'text', sortable: false, hideable: false,
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
                    id: 'type', name: workItemTranslation.TYPE, field: 'type', sortable: false, width: 150, minWidth: 100, dataType: 'select', listName: 'workItemType',
                    formatter: function (row, cell, value) {
                        if (value) {
                            return capitalizeText(value);
                        }
                    }
                },
                //{
                //    id: "useCase", name: 'Use Case', field: "useCase", sortable: false, dataType: 'text', width: 100, minWidth: 50, filterable: false,
                //    formatter: function (row, cell, value, columnDef, dataContext) {
                //        var str = ". ...";
                //        if (value != null) str = '<i class="use-case bowtie-icon bowtie-tfvc-branch" aria-hidden="true"></i>';
                //        return '<a href="javascript:;" class="use-case">' + str + '</a>';
                //    }
                //},
                {
                    id: 'priority', name: workItemTranslation.PRIORITY, field: 'priority', sortable: false, dataType: 'select', listName: 'priority', width: 150, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.priority[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },
                {
                    id: 'assignRelated', name: workItemTranslation.ASSIGN, field: 'assignRelated', fieldFilter: 'displayName', sortable: false, dataType: 'text', width: 300, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> <span class="txt_user_tb">' + value.displayName + '</span></div>';
                        }
                    }
                },
                {
                    id: 'personasRelated', name: workItemTranslation.PERSONAS, field: 'personasRelated', fieldFilter: 'name', sortable: false, dataType: 'array', width: 350, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && value.length != 0) {
                            return $.map(value, x => x.name).join(', ');
                        }
                    }
                },
                {
                    id: "state", name: workItemTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 150, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },
            ],
            hiddenColumns: [
                {
                    id: "areaRelated", field: "areaRelated", name: workItemTranslation.AREA, width: 100, fieldFilter: 'name',
                    formatter: function (row, cell, value) {
                        return value ? value.name : '';
                    }
                },
                {
                    id: "category", field: "category", name: workItemTranslation.TYPE_CATEGORY, width: 100,
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                {
                    id: "description", field: "description", name: workItemTranslation.DESCRIPTION, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                { id: "planEndDate", field: "planEndDate", dataType: "datetime", name: workItemTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date },
                { id: "risk", field: "risk", dataType: 'select', listName: 'risk', name: workItemTranslation.RISK, width: 100 },
                { id: "size", field: "size", dataType: 'number', name: workItemTranslation.SIZE, width: 100 },
            ]
        };
        requirementSetting.valuelist = {};
        requirementSetting.listFilter = {};
        requirementSetting.options = {};
    };

    epicInitSetting = function () {

        epicSetting.grid = {
            url: 'api/workItem/Get',
            defaultUrl: 'api/user/get',

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
                    id: 'id', field: 'id', sortable: false, name: "", width: 25, minWidth: 25, maxWidth: 30, filterable: false,
                    header: {
                        buttons: [{
                            cssClass: "bowtie-icon bowtie-view-list-tree",
                            command: 'collapseAll',
                            showOnHover: false,
                        }]
                    },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.type == 'bug') return '';
                        return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                    }
                },

                {
                    id: "name", field: "name", name: workItemTranslation.NAME, width: 750, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                    id: 'type', name: workItemTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'workItemType', width: 200, minWidth: 100,
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                {
                    id: "useCase", name: 'Use Case', field: "useCase", sortable: false, dataType: 'text', width: 100, minWidth: 50, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var str = ". ...";
                        if (value != null) str = '<i class="use-case bowtie-icon bowtie-tfvc-branch" aria-hidden="true"></i>';
                        return '<a href="javascript:;" class="use-case">' + str + '</a>';
                    }
                },
                {
                    id: 'priority', name: workItemTranslation.PRIORITY, field: 'priority', sortable: false, dataType: 'select', listName: 'priority', width: 200, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.priority[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },
                {
                    id: 'assignRelated', name: workItemTranslation.ASSIGN, field: 'assignRelated', fieldFilter: 'displayName', sortable: false, dataType: 'text', width: 350, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> <span class="txt_user_tb">' + value.displayName + '</span></div>';
                        }
                    }
                },
                {
                    id: "state", name: workItemTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 200, minWidth: 150,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },

            ],
            hiddenColumns: [
                {
                    id: "sprintRelated", field: "sprintRelated", name: workItemTranslation.SPRINT, width: 100, sortable: false, dataType: 'text', width: 350, minWidth: 100, fieldFilter: 'name',
                    formatter: function (r, c, val) {
                        if (val) {
                            return val.name;
                        }
                    }
                },
                { id: "actualStartDate", field: "actualStartDate", name: workItemTranslation.ACTUAL_START_DATE, width: 160, dataType: 'datetime', formatter: Slick.Formatters.Date },
                { id: "actualEndDate", field: "actualEndDate", name: workItemTranslation.ACTUAL_END_DATE, width: 160, dataType: 'datetime', formatter: Slick.Formatters.Date },
                { id: "actualDuration", field: "actualDuration", name: workItemTranslation.ACTUAL_DURATION, width: 160 },
                {
                    id: "acceptanceCriteria", field: "acceptanceCriteria", name: workItemTranslation.ACCEPTANCE_CRITERIA, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                {
                    id: "approved", field: "approved", name: workItemTranslation.APPROVE, width: 100,
                    formatter: function (r, c, val) {
                        if (val) return workItemTranslation.APPROVED;
                        return workItemTranslation.NOT_APPROVE;
                    }
                },
                {
                    id: "areaRelated", field: "areaRelated", name: workItemTranslation.AREA, width: 100, fieldFilter: 'name',
                    formatter: function (row, cell, value) {
                        return value ? value.name : '';
                    }
                },
                {
                    id: "category", field: "category", name: workItemTranslation.TYPE_CATEGORY, width: 100, dataType: 'text',
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                { id: "originalEstimate", field: "originalEstimate", name: workItemTranslation.ORIGINAL_ESTIMATE, width: 100 },
                { id: "remaining", field: "remaining", name: workItemTranslation.REMAINING, width: 100 },
                { id: "completed", field: "completed", name: workItemTranslation.COMPLETED, width: 100 },
                {
                    id: "description", field: "description", name: workItemTranslation.DESCRIPTION, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                { id: "planStartDate", field: "planStartDate", dataType: 'datetime', name: workItemTranslation.PLAN_START_DATE, width: 160, formatter: Slick.Formatters.Date },
                { id: "planEndDate", field: "planEndDate", dataType: 'datetime', name: workItemTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date },
                { id: "planDuration", field: "planDuration", name: workItemTranslation.PLAN_DURATION, width: 160 },
                { id: "risk", field: "risk", dataType: 'select', listName: 'risk', name: workItemTranslation.RISK, width: 100 },
                { id: "size", field: "size", dataType: 'number', name: workItemTranslation.SIZE, width: 100 },
            ]
        };

        epicSetting.valuelist = {};
        epicSetting.listFilter = {};
        epicSetting.options = {
            //uploadSetting: [{
            //    acceptedFiles: '',
            //    maxFiles: 1,
            //    elementId: 'imgAvatar',
            //}],
        };
        epicSetting.required = [
            "name"
        ];
        epicSetting.readonly = [
            ""
        ];

    };

    functionInitSetting = function () {
        functionSetting.grid = {
            url: 'api/workItem/Get',
            defaultUrl: 'api/user/get',

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
                    id: 'id', field: 'id', sortable: false, name: "", width: 25, minWidth: 25, maxWidth: 30, filterable: false,
                    header: {
                        buttons: [{
                            cssClass: "bowtie-icon bowtie-view-list-tree",
                            command: 'collapseAll',
                            showOnHover: false,
                        }]
                    },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.type == 'bug') return '';
                        return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                    }
                },

                {
                    id: "name", field: "name", name: workItemTranslation.NAME, width: 750, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                    id: 'type', name: workItemTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'workItemType', width: 200, minWidth: 100,
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                {
                    id: "useCase", name: 'Use Case', field: "useCase", sortable: false, dataType: 'text', width: 100, minWidth: 50, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var str = ". ...";
                        if (value != null) str = '<i class="use-case bowtie-icon bowtie-tfvc-branch" aria-hidden="true"></i>';
                        return '<a href="javascript:;" class="use-case">' + str + '</a>';
                    }
                },
                {
                    id: 'priority', name: workItemTranslation.PRIORITY, field: 'priority', sortable: false, dataType: 'select', listName: 'priority', width: 200, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.priority[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },
                //{
                //    id: 'assign', name: workItemTranslation.ASSIGN, field: 'assign', sortable: false, dataType: 'text', width: 200, minWidth: 100,
                //},
                {
                    id: 'assignRelated', name: workItemTranslation.ASSIGN, field: 'assignRelated', sortable: false, dataType: 'text', width: 350, minWidth: 100, fieldFilter: 'displayName',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {

                            return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> <span class="txt_user_tb">' + value.displayName + '</span></div>';
                        }
                    }
                },
                {
                    id: "state", name: workItemTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 200, minWidth: 150,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },

            ],
            hiddenColumns: [
                {
                    id: "sprintRelated", field: "sprintRelated", name: workItemTranslation.SPRINT, width: 100, sortable: false, dataType: 'text', width: 350, minWidth: 100, fieldFilter: 'name',
                    formatter: function (r, c, val) {
                        if (val) {
                            return val.name;
                        }
                    }
                },
                { id: "actualStartDate", field: "actualStartDate", name: workItemTranslation.ACTUAL_START_DATE, width: 160, dataType: 'datetime', formatter: Slick.Formatters.Date },
                { id: "actualEndDate", field: "actualEndDate", name: workItemTranslation.ACTUAL_END_DATE, width: 160, dataType: 'datetime', formatter: Slick.Formatters.Date },
                { id: "actualDuration", field: "actualDuration", name: workItemTranslation.ACTUAL_DURATION, width: 160 },
                {
                    id: "acceptanceCriteria", field: "acceptanceCriteria", name: workItemTranslation.ACCEPTANCE_CRITERIA, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                {
                    id: "approved", field: "approved", name: workItemTranslation.APPROVE, width: 100,
                    formatter: function (r, c, val) {
                        if (val) return workItemTranslation.APPROVED;
                        return workItemTranslation.NOT_APPROVE;
                    }
                },
                {
                    id: "areaRelated", field: "areaRelated", name: workItemTranslation.AREA, width: 100, fieldFilter: 'name',
                    formatter: function (row, cell, value) {
                        return value ? value.name : '';
                    }
                },
                {
                    id: "category", field: "category", name: workItemTranslation.TYPE_CATEGORY, width: 100, dataType: 'text',
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                { id: "originalEstimate", field: "originalEstimate", name: workItemTranslation.ORIGINAL_ESTIMATE, width: 100 },
                { id: "remaining", field: "remaining", name: workItemTranslation.REMAINING, width: 100 },
                { id: "completed", field: "completed", name: workItemTranslation.COMPLETED, width: 100 },
                {
                    id: "description", field: "description", name: workItemTranslation.DESCRIPTION, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                { id: "planStartDate", field: "planStartDate", dataType: 'datetime', name: workItemTranslation.PLAN_START_DATE, width: 160, formatter: Slick.Formatters.Date },
                { id: "planEndDate", field: "planEndDate", dataType: 'datetime', name: workItemTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date },
                { id: "planDuration", field: "planDuration", name: workItemTranslation.PLAN_DURATION, width: 160 },
                { id: "risk", field: "risk", dataType: 'select', listName: 'risk', name: workItemTranslation.RISK, width: 100 },
                { id: "size", field: "size", dataType: 'number', name: workItemTranslation.SIZE, width: 100 },
            ]
        };
        functionSetting.valuelist = {};
        functionSetting.listFilter = {};
        functionSetting.options = {};
        functionSetting.required = ["name"];
        functionSetting.readonly = [""];
    };

    userstoryInitSetting = function () {

        userstorySetting.grid = {
            url: 'api/workItem/Get',
            defaultUrl: 'api/user/get',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                headerRowHeight: 0,
                showHeaderRow: true,

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
                    id: 'id', field: 'id', sortable: false, name: "", width: 25, minWidth: 25, maxWidth: 30, filterable: false,
                    header: {
                        buttons: [{
                            cssClass: "bowtie-icon bowtie-view-list-tree",
                            command: 'collapseAll',
                            showOnHover: false,
                        }]
                    },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.type == 'bug') return '';
                        return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                    }
                },

                {
                    id: "name", field: "name", name: workItemTranslation.NAME, width: 750, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                    id: 'type', name: workItemTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'workItemType', width: 200, minWidth: 100,
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                {
                    id: "useCase", name: 'Use Case', field: "useCase", sortable: false, dataType: 'text', width: 100, minWidth: 50, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var str = ". ...";
                        if (value != null) str = '<i class="use-case bowtie-icon bowtie-tfvc-branch" aria-hidden="true"></i>';
                        return '<a href="javascript:;" class="use-case">' + str + '</a>';
                    }
                },
                {
                    id: 'priority', name: workItemTranslation.PRIORITY, field: 'priority', sortable: false, dataType: 'select', listName: 'priority', width: 200, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.priority[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },
                //{
                //    id: 'assign', name: workItemTranslation.ASSIGN, field: 'assign', sortable: false, dataType: 'text', width: 200, minWidth: 100,
                //},
                {
                    id: 'assignRelated', name: workItemTranslation.ASSIGN, field: 'assignRelated', sortable: false, dataType: 'text', width: 350, minWidth: 100, fieldFilter: 'displayName',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {

                            return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> <span class="txt_user_tb">' + value.displayName + '</span></div>';
                        }
                    }
                },
                {
                    id: "state", name: workItemTranslation.STATE, field: "state", sortable: false, width: 200, minWidth: 150, dataType: 'select', listName: 'state',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = workItemSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                        return value;
                    }
                },

            ],

            hiddenColumns: [
                {
                    id: "sprintRelated", field: "sprintRelated", name: workItemTranslation.SPRINT, width: 100, sortable: false, dataType: 'text', width: 350, minWidth: 100, fieldFilter: 'name',
                    formatter: function (r, c, val) {
                        if (val) {
                            return val.name;
                        }
                    }
                },
                { id: "actualStartDate", field: "actualStartDate", name: workItemTranslation.ACTUAL_START_DATE, width: 160, dataType: 'datetime', formatter: Slick.Formatters.Date },
                { id: "actualEndDate", field: "actualEndDate", name: workItemTranslation.ACTUAL_END_DATE, width: 160, dataType: 'datetime', formatter: Slick.Formatters.Date },
                { id: "actualDuration", field: "actualDuration", name: workItemTranslation.ACTUAL_DURATION, width: 160 },
                {
                    id: "acceptanceCriteria", field: "acceptanceCriteria", name: workItemTranslation.ACCEPTANCE_CRITERIA, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                {
                    id: "approved", field: "approved", name: workItemTranslation.APPROVE, width: 100,
                    formatter: function (r, c, val) {
                        if (val) return workItemTranslation.APPROVED;
                        return workItemTranslation.NOT_APPROVE;
                    }
                },
                {
                    id: "areaRelated", field: "areaRelated", name: workItemTranslation.AREA, width: 100, fieldFilter: 'name',
                    formatter: function (row, cell, value) {
                        return value ? value.name : '';
                    }
                },
                {
                    id: "category", field: "category", name: workItemTranslation.TYPE_CATEGORY, width: 100, dataType: 'text',
                    formatter: function (row, cell, value) {
                        if (value) {
                            if (value == 'userstory') return "User story";
                            return capitalizeText(value);
                        }
                    }
                },
                { id: "originalEstimate", field: "originalEstimate", name: workItemTranslation.ORIGINAL_ESTIMATE, width: 100 },
                { id: "remaining", field: "remaining", name: workItemTranslation.REMAINING, width: 100 },
                { id: "completed", field: "completed", name: workItemTranslation.COMPLETED, width: 100 },
                {
                    id: "description", field: "description", name: workItemTranslation.DESCRIPTION, width: 100,
                    formatter: function (r, c, val) {
                        if (val)
                            return val.replace(/<(?:.|\n)*?>/g, '');
                    }
                },
                { id: "planStartDate", field: "planStartDate", dataType: 'datetime', name: workItemTranslation.PLAN_START_DATE, width: 160, formatter: Slick.Formatters.Date },
                { id: "planEndDate", field: "planEndDate", dataType: 'datetime', name: workItemTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date },
                { id: "planDuration", field: "planDuration", name: workItemTranslation.PLAN_DURATION, width: 160 },
                { id: "risk", field: "risk", dataType: 'select', listName: 'risk', name: workItemTranslation.RISK, width: 100 },
                { id: "size", field: "size", dataType: 'number', name: workItemTranslation.SIZE, width: 100 },
            ]
        };

        userstorySetting.valuelist = {};
        userstorySetting.listFilter = {};
        userstorySetting.options = {
            //uploadSetting: [{
            //    acceptedFiles: '',
            //    maxFiles: 1,
            //    elementId: 'imgAvatar',
            //}],
        };
        userstorySetting.required = [
            "name"
        ];
        userstorySetting.readonly = [
            ""
        ];

    };

}