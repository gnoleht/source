var autoNumberSetting = {
    view: {
        module: 'system',
        formName: 'autoNumber',
        gridName: 'grvAutoNumber',
        entityName: 'SYS_AutoNumber'
    }
};

function autoNumberInitSetting() {
    autoNumberSetting.valuelist = {
        resetRule: [
            { 'id': 0, 'text': autoNumberTranslation.vllRESETRULE.NEVER },
            { 'id': 1, 'text': autoNumberTranslation.vllRESETRULE.DAY },
            { 'id': 2, 'text': autoNumberTranslation.vllRESETRULE.MONTH },
            { 'id': 3, 'text': autoNumberTranslation.vllRESETRULE.YEAR }
        ],

        //date: [
        //    { 'id': 'yy', 'text': 'yy' },
        //    { 'id': 'yyMM', 'text': 'yyMM' },
        //    { 'id': 'yyMMdd', 'text': 'yyMMdd' },
        //    { 'id': 'MM', 'text': 'MM' },
        //    { 'id': 'MMyy', 'text': 'MMyy' },
        //    { 'id': 'ddMM', 'text': 'ddMM' },
        //    { 'id': 'ddMMyy', 'text': 'ddMMyy' }
        //],
        type: [
            { 'id': '0', 'text': 'On add' },
            { 'id': '1', 'text': 'On save' },
        ]
    };

    autoNumberSetting.grid = {
        url: 'api/sys/autoNumber/get',

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
                id: "code", field: "code", name: autoNumberTranslation.NO, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
            },
            {
                id: "description", field: "description", name: autoNumberTranslation.DESCRIPTION, width: 450, defaultWidth: 350, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "format", field: "format", name: autoNumberTranslation.FORMAT, width: 350, defaultWidth: 350, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
                    return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
                }
            },
            {
                id: "step", field: "step", name: autoNumberTranslation.STEP, width: 150, defaultWidth: 150, hasTextTotal: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<span class="center" style="display:block;">' + value + '</span>';
                }
            },
            //{
            //    id: "num", field: "num", name: autoNumberTranslation.NUM, width: 150, defaultWidth: 150, sortable: true, dataType: 'text',
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        var sValue = value != null ? value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
            //        return '<span style="display:inline-block;height:1px;width:10px"></span>' + sValue;
            //    }
            //},
            //{
            //    id: "date", field: "date", name: autoNumberTranslation.DATE, sortable: true, dataType: 'select', listType: 'date', width: 150, minWidth: 150,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        return '<i class=\"fa fa-cogs date_' + value + '\"></i>&nbsp;' + value;
            //    }
            //},
            {
                id: "resetRule", field: "resetRule", name: autoNumberTranslation.RESETRULE, sortable: true, dataType: 'select', listType: 'resetRule', width: 150, minWidth: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var createRule = autoNumberSetting.valuelist.resetRule.filter(function (item) { return item.id == value; });
                    if (createRule.length == 0)
                        return "";
                    return '<i class=\"fa fa-life-ring resetRule_' + value + '\"></i>&nbsp;' + createRule[0].text;
                }
            },
            {
                id: "module", field: "module", name: autoNumberTranslation.MODULE, sortable: true, dataType: 'select', listType: 'module', width: 150, minWidth: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<i class=\"fa fa-cogs module_' + value + '\"></i>&nbsp;' + value;
                }
            },
            {
                id: "active", field: "active", name: autoNumberTranslation.ACTIVE, sortable: true, width: 150, defaultWidth: 150, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
        ]
    };

    autoNumberSetting.required = ['code', 'format'];

    autoNumberSetting.gridChild = {
        grvCondition: {
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                showHeaderRow: true,
                headerRowHeight: 0,

                editable: true,
                autoEdit: true,

                allowOrder: false,
                allowFilter: false,
                allowCustom: false,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: false,
                //forceFitColumns: true,

                enableColumnReorder: false,
                enableCellNavigation: true,
                explicitInitialization: true,


            },
            columns: [
                {
                    id: "id", field: "field", name: "#", focusable: false, width: 45, formatter: function (row, cell, value, columnDef, dataContext) {
                        dataContext.id = row;
                        return row;
                    }
                },
                {
                    id: "field", field: "field", name: "Field", width: 300, dataType: 'text',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return value;
                    },
                },
                {
                    id: "value", field: "value", name: "Value", width: 310, dataType: 'text',
                    editor: Slick.Editors.Text
                }
            ]
        }
    }
}