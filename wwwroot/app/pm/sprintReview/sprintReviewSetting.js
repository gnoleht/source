var sprintReviewSetting = {
    view: {
        module: 'pm',
        formName: 'sprintReview',
        gridName: 'grvSprintReview',
    }
};


function sprintReviewInitSetting() {
    sprintReviewSetting.grid = {
        url: 'api/pm/sprint/Get',
        defaultUrl: 'api/pm/sprint/Get',

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
                    if (dataContext.type == 'bug') return '';
                    return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                }
            },
            {
                id: "name", field: "name", name: sprintReviewTranslation.NAME, width: 700, minWidth: 200, sortable: false, dataType: 'text', fieldFilter: 'no;name',
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
                id: 'size', name: sprintReviewTranslation.SIZE, field: 'size', sortable: false, dataType: 'text', width: 100, minWidth: 100
            },
            {
                id: 'modifiedTime', name: sprintReviewTranslation.MODIFIEDTIME, field: 'modifiedTime', sortable: false, dataType: 'text', width: 150, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        var date = value.substring(0, 10).split('-');
                        return date[2] + "-" + date[1] + "-" + date[0];
                    }
                    else
                        return "";
                }
            },
            {
                id: 'assignRelated', name: sprintReviewTranslation.ASSIGN, field: 'assignRelated', fieldFilter: 'displayName', sortable: false, dataType: 'text', width: 250, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        return '<span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"></span> ' + value.displayName;
                    }
                }
            },
            {
                id: "state", name: sprintReviewTranslation.STATE, field: "state", sortable: false, dataType: 'select', listName: 'state', width: 120, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = sprintReviewSetting.listFilter.state[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            },
            {
                id: "approved", name: sprintReviewTranslation.APPROVED, field: "approved", sortable: false, filterable: false, dataType: 'text', width: 180, minWidth: 100,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.type == 'userstory') return '';
                    else
                        if (dataContext.state == 'closed') {
                            return '<div style="align-items: center; position: relative; display:flex;" class="middle_40 center">' +
                                '<div class="switch change">' +
                                '<input type="checkbox">' +
                                '<p class="slider mb-0"><span class="text text_release">' + sprintReviewTranslation.ACCEPT + '</span><span class="text text_accept">' + sprintReviewTranslation.REJECT + '</span></p></div>' +
                                '</div>';
                        }
                    return '<div style="align-items: center; position: relative; display:flex;" class="middle_40 center">' +
                        '<div class="switch">' +
                        '<input type="checkbox">' +
                        '<p class="slider mb-0"><span class="text text_release">' + sprintReviewTranslation.ACCEPT + '</span><span class="text text_accept">' + sprintReviewTranslation.REJECT + '</span></p></div>' +
                        '<p class="ip_comment"><span><i class="bowtie-icon bowtie-comment-discussion"></i></span></p></div>';
                }
            },
        ],
        hiddenColumns: [
            { id: "actualStartDate", field: "actualStartDate", name: sprintReviewTranslation.ACTUAL_START_DATE, width: 160, formatter: Slick.Formatters.Date },
            { id: "actualDuration", field: "actualDuration", name: sprintReviewTranslation.ACTUAL_DURATION, width: 160 },
            {
                id: "acceptanceCriteria", field: "acceptanceCriteria", name: sprintReviewTranslation.ACCEPTANCE_CRITERIA, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            {
                id: 'actualEndDate', name: sprintReviewTranslation.ACTUAL_END_DATE, field: 'actualEndDate', sortable: false, dataType: 'text', width: 160, minWidth: 100, formatter: Slick.Formatters.Date
            },
            {
                id: "areaRelated", field: "areaRelated", name: sprintReviewTranslation.AREA, width: 100,
                formatter: function (row, cell, value) {
                    return value ? value.name : '';
                }
            },
            {
                id: "category", field: "category", name: sprintReviewTranslation.TYPE_CATEGORY, width: 100,
                formatter: function (row, cell, value) {
                    if (value) {
                        if (value == 'userstory') return "User story";
                        return capitalizeText(value);
                    }
                }
            },
            {
                id: 'completed', name: sprintReviewTranslation.COMPLETED, field: 'completed', sortable: false, dataType: 'number', width: 150, minWidth: 100,
            },
            { id: "originalEstimate", field: "originalEstimate", name: sprintReviewTranslation.ORIGINAL_ESTIMATE, width: 100 },
            {
                id: "description", field: "description", name: sprintReviewTranslation.DESCRIPTION, width: 100,
                formatter: function (r, c, val) {
                    if (val)
                        return val.replace(/<(?:.|\n)*?>/g, '');
                }
            },
            { id: "planStartDate", field: "planStartDate", name: sprintReviewTranslation.PLAN_START_DATE, width: 160, formatter: Slick.Formatters.Date },
            { id: "planEndDate", field: "planEndDate", name: sprintReviewTranslation.PLAN_END_DATE, width: 160, formatter: Slick.Formatters.Date },
            { id: "planDuration", field: "planDuration", name: sprintReviewTranslation.PLAN_DURATION, width: 160 },
            { id: "risk", field: "risk", name: sprintReviewTranslation.RISK, width: 100 },
            { id: "size", field: "size", name: sprintReviewTranslation.SIZE, width: 100 },
            {
                id: 'remaining', name: sprintReviewTranslation.REMAINING, field: 'remaining', sortable: false, dataType: 'number', width: 150, minWidth: 100,
            },
        ]
    };

    sprintReviewSetting.valuelist = {};

    sprintReviewSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };
};
