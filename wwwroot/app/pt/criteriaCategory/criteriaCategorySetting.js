var criteriaCategorySetting = {
    view: {
        module: 'pt',
        subModule: 'criteria',
        formName: 'criteriaCategory',
        gridName: 'grvCriteriaCategory'
    }
};

function criteriaCategoryInitSetting() {
    criteriaCategorySetting.grid = {
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
                    if (dataContext.indent === 3) return null;
                    return '<button type="button" class="cl_green btn_add_02 addChild"><i class="addChild bowtie-icon bowtie-math-plus-circle-outline"></i></button>';
                }
            },
            {
                id: "name", name: criteriaCategoryTranslation.NAME, field: "name", sortable: false, dataType: 'text', width: 1000,
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
            },
            {
                id: "year", name: criteriaCategoryTranslation.YEAR, field: "year", sortable: false, dataType: 'text', width: 200, editor: Slick.Editors.Text
            }
        ]
    };

    criteriaCategorySetting.gridChild = {
        grvCriteriaCategoryDetail: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                editable: true,
                autoEdit: true,

                allowOrder: true,
                allowFilter: false,
                allowCustom: true,
                allowExport: true,
                allowImport: true,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: "level", name: criteriaCategoryTranslation.LEVEL, field: "level", width: 150, sortable: true, dataType: 'select', listName: 'criteriaLevel',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && criteriaCategorySetting.valuelist.criteriaLevel) {
                            var item = criteriaCategorySetting.valuelist.criteriaLevel.find(x => x.id === parseInt(value));
                            if (item)
                                return '<span class="criteria_level_' + value + '"> ' + item.text + '</span>';
                            return null;
                        }
                    }
                },
                {
                    id: "name", name: criteriaCategoryTranslation.NAME, field: "name", sortable: false, dataType: 'text', width: 900, editor: Slick.Editors.Text
                },
            ]
        }
    };

    criteriaCategorySetting.required = ['name'];
    criteriaCategorySetting.valuelist = {};
    criteriaCategorySetting.options = {
        loadButton: true
    };
    criteriaCategorySetting.validate = {
        name: { required: true }
    };
}