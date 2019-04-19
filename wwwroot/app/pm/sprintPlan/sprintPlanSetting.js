var sprintPlanSetting = {
    view: {
        module: 'pm',
        formName: 'sprintPlan',
        gridName: 'grvSprintPlan',
    }
};

function sprintPlanInitSetting() {
    sprintPlanSetting.grid = {
        url: 'api/pm/sprint/get',
        defaultUrl: 'api/pm/sprint/get',

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
                id: 'id', field: 'id', sortable: false, name: "", width: 25, minWidth: 25, maxWidth: 25, filterable: false,
                header: {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-view-list",
                        command: 'collapseAll',
                        showOnHover: false,
                    }]
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (sprintPlanSetting) {
                        var isApproveSprint = sprintPlanSetting.isApproveSprint;
                        if (isApproveSprint) {
                            var approveStatus = sprintPlanSetting.approveStatus;
                            if (approveStatus == 'approved') {
                                if (dataContext.type == 'bug' || dataContext.type == 'task') return '';
                                return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                            }
                            else {
                                if (dataContext.type == 'bug') return '';
                                return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                            }
                        }
                        else {
                            if (dataContext.type == 'bug') return '';
                            return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                        }
                    }
                    else {
                        if (dataContext.type == 'bug') return '';
                        return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                    }
                }
            },
            {
                id: "name", field: "name", name: sprintPlanTranslation.NAME, width: 500, minWidth: 200, sortable: false, fieldFilter: 'no;name', dataType: 'text',
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
                id: 'type', name: sprintPlanTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'workItemType', width: 100, minWidth: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        return capitalizeText(value);
                    }
                }
            },
            {
                id: 'assignRelated', name: sprintPlanTranslation.ASSIGN, field: 'assignRelated', dataType: 'text', fieldFilter: 'displayName', sortable: false, width: 200, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value === undefined || value.length <= 0) {
                        return '<a class="editmember link">...</a>';
                    }
                    else {
                        return '<a class="editmember link"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> ' + value.displayName + '</a>';
                    }
                }
            },
            {
                id: "sprintRelated", field: "sprintRelated", name: sprintPlanTranslation.SPRINT, width: 100, sortable: false, dataType: 'text', fieldFilter: 'name', width: 250, minWidth: 100, fieldFilter: 'name',
                formatter: function (r, c, value) {
                    if (value == null || value === undefined || value.length <= 0)
                        return '<a class="editsprint link">...</a>';
                    else
                        return '<a class="editsprint link">' + value.name + '</a>';
                }
            },
            {
                id: 'remaining', name: sprintPlanTranslation.REMAINING, field: 'remaining', sortable: false, dataType: 'number', width: 130, minWidth: 130, cssClass: 'right'
            },
            {
                id: 'completed', name: sprintPlanTranslation.COMPLETED, field: 'completed', sortable: false, dataType: 'number', width: 130, minWidth: 130, cssClass: 'right'
            },
            {
                id: 'actualEndDate', name: sprintPlanTranslation.ACTUAL_END_DATE, field: 'actualEndDate', sortable: false, dataType: 'datetime', width: 180, minWidth: 180, formatter: Slick.Formatters.Date, cssClass: 'center'
            },
            {
                id: "state", name: sprintPlanTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 120, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span style="padding-left: 15px"><i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value) + '</span>';
                }
            },
        ],
        hiddenColumns: [
            { id: "actualStartDate", field: "actualStartDate", name: sprintPlanTranslation.ACTUAL_START_DATE, width: 160, formatter: Slick.Formatters.Date, dataType: 'datetime' },
            { id: "actualDuration", field: "actualDuration", name: sprintPlanTranslation.ACTUAL_DURATION, width: 160 },
            {
                id: "acceptanceCriteria", field: "acceptanceCriteria", name: sprintPlanTranslation.ACCEPTANCE_CRITERIA, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: "approved", field: "approved", name: sprintPlanTranslation.APPROVE, width: 100,
                formatter: function (r, c, val) {
                    if (val) return sprintPlanTranslation.APPROVED;
                    return sprintPlanTranslation.NOT_APPROVE;
                }
            },
            {
                id: "areaRelated", field: "areaRelated", name: sprintPlanTranslation.AREA, width: 100,
                formatter: function (row, cell, value) {
                    return value ? value.name : '';
                }
            },
            {
                id: "category", field: "category", name: sprintPlanTranslation.TYPE_CATEGORY, width: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
            { id: "originalEstimate", field: "originalEstimate", name: sprintPlanTranslation.ORIGINAL_ESTIMATE, width: 100 },
            {
                id: "description", field: "description", name: sprintPlanTranslation.DESCRIPTION, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            { id: "planStartDate", field: "planStartDate", name: sprintPlanTranslation.PLAN_START_DATE, width: 160, formatter: Slick.Formatters.Date },
            { id: "planEndDate", field: "planEndDate", name: sprintPlanTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date },
            { id: "planDuration", field: "planDuration", name: sprintPlanTranslation.PLAN_DURATION, width: 160 },
            { id: "risk", field: "risk", name: sprintPlanTranslation.RISK, width: 100 },
            { id: "size", field: "size", name: sprintPlanTranslation.SIZE, width: 100 },
        ]
    };

    sprintPlanSetting.valuelist = {};

    sprintPlanSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };

    sprintPlanSetting.required = [
        "name", "velocity", "startDate", "endDate", "workingDays"
    ];

    sprintPlanSetting.readonly = ["workingDays"];
};
