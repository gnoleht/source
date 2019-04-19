var moduleSetting = {
    view: {
        module: 'system',
        formName: 'module',
        gridName: 'grvModule',
    }
};

function moduleInitSetting() {
    moduleSetting.valuelist = {};

    moduleSetting.grid = {
        url: 'api/module/get',

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
                    id: 'id1', field: 'id1', name: "", width: 25, defaultWidth: 25, sortable: false, filterable: false,
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
                    id: "id", field: "id", name: moduleTranslation.ID, width: 180, minWidth: 180, sortable: false, fieldFilter: 'id', behavior: "selectAndMove", dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.id == null) { return ""; }

                    var result = '<div class="middle_40">' + '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';

                        } else {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                        }
                    }

                    result = result + '<span class="parent_' + dataContext.id + '"> ' + value + '</span></div>';
                    return result;
                }
            },
            {
                id: "name", field: "name", name: moduleTranslation.NAME, width: 250, defaultWidth: 150, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "parent", field: "parent", name: moduleTranslation.PARENT, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "entity", field: "entity", name: moduleTranslation.ENTITY, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "action", field: "action", name: moduleTranslation.ACTION, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "description", field: "description", name: moduleTranslation.DESCRIPTION, width: 400, defaultWidth: 400, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },
            {
                id: "active", field: "active", name: moduleTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
        ],
    };

    moduleSetting.required = ['id', 'name'];
}
