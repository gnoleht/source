var surveySetting = {
    view: {
        module: 'pt',
        subModule: 'survey',
        formName: 'survey',
        gridName: 'grvSurvey'
    }
};

function surveyInitSetting() {
    surveySetting.grid = {
        url: 'api/pt/survey/get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 30,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },

        columns: [
            { id: "name", name: surveyTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 600 },
            {
                id: "responsesInvited", name: surveyTranslation.RESPONSESINVITED, field: "description", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="align-middle">' + dataContext.responses + '/' + dataContext.invited + '</span>';
                }
            },
            { id: "dateUpdated", name: surveyTranslation.DATEUPDATED, field: "dateUpdated", sortable: true, formatter: Slick.Formatters.Date, dataType: 'datetime', width: 200 },
            {
                id: "createdBy", name: surveyTranslation.CREATEDBY, field: "createdBy", sortable: true, dataType: 'text', width: 300
            },
            {
                id: "status", name: surveyTranslation.STATUS, field: "status", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value)
                        return '<span style="padding-left: 15px"><i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value) + '</span>';
                    return null;
                }
            }
        ]
    };

    surveySetting.gridChild = {
        grvSurveyQuestion: {
            url: '',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: true,
                allowFilter: true,
                allowCustom: true,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 30,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: 'id', field: 'id', sortable: false, name: "", width: 25, filterable: false,
                    header: {
                        buttons: [{
                            cssClass: "bowtie-icon bowtie-view-list",
                            command: 'collapseAll',
                            showOnHover: false
                        }]
                    },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '';
                    }
                },
                {
                    id: "name", name: surveyTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 700,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.id === null) { return ""; }
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
                            result = result + '<span class="criteria_level_' + dataContext.level + '"> ' + value + '</span></div>';
                        else
                            result = result + '<span style="padding-left:3px;"> ' + value + '</span></div>';
                        return result;
                    }
                }
            ]
        }
    };

    surveySetting.valuelist = {};
    surveySetting.options = {
        loadButton: true
    };
}