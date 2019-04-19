//plan setting
var planSetting = {
    view: {
        module: 'pm',
        formName: 'plan',
        gridName: 'grvPlan',
    }
};
function planInitSetting() {

    planSetting.valuelist = {};

    planSetting.listFilter = {};

    planSetting.options = {
        uploadSetting: [{
            acceptedFiles: '',
            maxFiles: 1,
            elementId: 'imgAvatar',
        }],
        loadButton: true
    };
    planSetting.required = ["name"];
    planSetting.readonly = [];

    planSetting.grid = {
        url: 'api/pm/plan/get',
        defaultUrl: 'api/user/get',

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
                        cssClass: "bowtie-icon bowtie-view-list",
                        command: 'collapseAll',
                        showOnHover: false,
                    }]
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.type == "bug") return null;
                    return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                }
            },

            {
                id: "name", field: "name", name: planTranslation.NAME, width: 600, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                id: 'type', name: planTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', width: 150, minWidth: 100, listName: 'workItemType',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        return capitalizeText(value);
                    }
                }
            },
            {
                id: 'size', name: planTranslation.POINT, field: 'size', sortable: false, dataType: 'number', width: 100, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.type == "userstory")
                        return '<a class="editsize">' + value + '</a>';
                    else
                        return value;

                }
            },
            {
                id: 'assignRelated', name: planTranslation.ASSIGN, field: 'assignRelated', sortable: false, dataType: 'text', width: 250, minWidth: 100, fieldFilter: 'displayName',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value === undefined || value.length <= 0) {
                        return '<a class="editmember">...</a>';
                    }
                    else {
                        return '<a class="editmember"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> ' + value.displayName + '</a>';
                    }
                }
            },
            {
                id: 'sprintRelated', name: planTranslation.SPRINT, field: 'sprintRelated', fieldFilter:'name', sortable: false, dataType: 'text', width: 200, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value === undefined || value.length <= 0)
                        return '<a class="editsprint">...</a>';
                    else
                        return '<a class="editsprint">' + value.name + '</a>';
                }
            },
            {
                id: 'endDate', field: 'endDate', name: planTranslation.FINISHDATE, width: 200, minWidth: 100, sortable: false, formatter: Slick.Formatters.Date
            },
            {
                id: "state", name: planTranslation.STATE, field: "state", sortable: false, dataType: 'select', width: 150, minWidth: 100, listName: 'state',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (planSetting && planSetting.listFilter && planSetting.listFilter.state) {
                        var itemList = planSetting.listFilter.state[value];
                        if (itemList)
                            return gridItemRender(itemList);
                    }

                    return value;
                }
            },
        ],
        hiddenColumns: [
            {
                id: "actualStartDate", field: "actualStartDate", dataType: 'datetime', name: planTranslation.ACTUAL_START_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            {
                id: "actualEndDate", field: "actualEndDate", dataType: 'datetime', name: planTranslation.ACTUAL_END_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            { id: "actualDuration", field: "actualDuration", name: planTranslation.ACTUAL_DURATION, width: 160 },
            {
                id: "acceptanceCriteria", field: "acceptanceCriteria", name: planTranslation.ACCEPTANCE_CRITERIA, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: "approved", field: "approved", name: planTranslation.APPROVE, width: 100,
                formatter: function (r, c, val) {
                    if (val) return planTranslation.APPROVED;
                    return planTranslation.NOT_APPROVE;
                }
            },
            {
                id: "areaRelated", field: "areaRelated", name: planTranslation.AREA, width: 100, fieldFilter: 'name',
                formatter: function (row, cell, value) {
                    return value ? value.name : '';
                }
            },
            {
                id: "category", field: "category", name: planTranslation.TYPE_CATEGORY, width: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
            { id: "originalEstimate", field: "originalEstimate", name: planTranslation.ORIGINAL_ESTIMATE, width: 100 },
            { id: "remaining", field: "remaining", name: planTranslation.REMAINING, width: 100 },
            { id: "completed", field: "completed", name: planTranslation.COMPLETED, width: 100 },
            {
                id: "description", field: "description", name: planTranslation.DESCRIPTION, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: "planStartDate", field: "planStartDate", dataType: 'datetime', name: planTranslation.PLAN_START_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            {
                id: "planEndDate", field: "planEndDate", dataType: 'datetime', name: planTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date
            },
            { id: "planDuration", field: "planDuration", name: planTranslation.PLAN_DURATION, width: 160 },
            { id: "risk", field: "risk", dataType: 'select', listName: 'risk', name: planTranslation.RISK, width: 100 },
        ]
    };

    planSetting.gridChild = {
        gridImport: {
            url: 'api/pm/plan/',
            defaultUrl: 'api/pm/plan/',

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
                forceFitColumns: true,
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
                    id: "name", field: "name", name: planTranslation.NAME, width: 450, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                    id: 'type', name: planTranslation.TYPE, field: 'type', sortable: false, dataType: 'select', listName: 'workItemType', width: 100, minWidth: 60,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return capitalizeText(value);
                        }
                    }
                },
                {
                    id: 'assignRelated', name: planTranslation.ASSIGN, field: 'assignRelated', sortable: false, dataType: 'text', width: 220, minWidth: 100, fieldFilter: 'displayName',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            return '<a class="editmember"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> ' + value.displayName + '</a>';
                        }
                    }
                },
                {
                    id: "projectRelated", name: planTranslation.PROJECT, field: "projectRelated", sortable: false, dataType: 'text', width: 200, minWidth: 100, fieldFilter: 'name',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value)
                            return value.name;
                    }
                },
                {
                    id: "state", name: planTranslation.STATE, field: "state", sortable: false, dataType: 'select', width: 150, minWidth: 100, listName: 'state',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (planSetting && planSetting.listFilter && planSetting.listFilter.state) {
                            var itemList = planSetting.listFilter.state[value];
                            if (itemList)
                                return gridItemRender(itemList);
                        }

                        return value;
                    }
                },
            ],
        },
    };
}