﻿var unitOfMeasureSetting = {
    view: {
        module: 'pos',
        formName: 'unitOfMeasure',
        gridName: 'grvUnitOfMeasure',
    }
};

function unitOfMeasureInitSetting() {
    unitOfMeasureSetting.valuelist = {};

    unitOfMeasureSetting.grid = {
        url: 'api/pos/UnitOfMeasure/get',

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
                id: "code", field: "code", name: unitOfMeasureTranslation.CODE, width: 250, defaultWidth: 150, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "name", field: "name", name: unitOfMeasureTranslation.NAME, width: 350, defaultWidth: 150, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "note", field: "note", name: unitOfMeasureTranslation.NOTE, width: 700, defaultWidth: 400, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },
            {
                id: "active", field: "active", name: unitOfMeasureTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            {
                id: "createdBy", field: "createdBy", name: unitOfMeasureTranslation.CREATEDBY, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.user) {
                        return dataContext.user.displayName;
                    }
                    return '';
                }
            },
            {
                id: "createdTime", field: "createdTime", name: unitOfMeasureTranslation.CREATEDTIME, width: 150, defaultWidth: 150, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            },
        ],
    };

    unitOfMeasureSetting.required = ['code', 'name'];

    unitOfMeasureSetting.validate = {
        code: { required: true },
        name: { required: true },
    }
}