var itemGroupSetting = {
    view: {
        module: 'pos',
        formName: 'itemGroup',
        gridName: 'grvItemGroup',
    }
};

function itemGroupInitSetting() {
    itemGroupSetting.valuelist = {};

    itemGroupSetting.grid = {
        url: 'api/pos/itemGroup/get',

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

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns: [
            {
                id: "code", field: "code", name: itemGroupTranslation.CODE, width: 250, defaultWidth: 150, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },        
            {
                id: "name", field: "name", name: itemGroupTranslation.NAME, width: 350, defaultWidth: 150, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "fieldId", field: "fieldId", name: itemGroupTranslation.FIELDID, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.itemField) {
                        return dataContext.itemField.name;
                    }
                    return '';
                }
            },
            { id: 'order', field: 'order', name: itemGroupTranslation.ORDER, width: 100, sortable: true },
            {
                id: "note", field: "note", name: itemGroupTranslation.NOTE, width: 400, defaultWidth: 400, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },         
            {
                id: "active", field: "active", name: itemGroupTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            {
                id: "createdBy", field: "createdBy", name: itemGroupTranslation.CREATEDBY, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.user) {
                        return dataContext.user.displayName;
                    }
                    return '';
                }
            },
            {
                id: "createdTime", field: "createdTime", name: itemGroupTranslation.CREATEDTIME, width: 150, defaultWidth: 150, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            },
        ],
    };


    itemGroupSetting.required = ['code', 'name'];

    itemGroupSetting.validate = {
        code: { required: true },
        name: { required: true },
    }
}