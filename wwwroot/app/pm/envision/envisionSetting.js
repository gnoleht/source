var envisionSetting = {
    view: {
        module: 'pm',
        formName: 'envision',
        gridName: 'grvEnvision',
        entityName: 'PM_Envision'
    }
};

function envisionInitSetting() {
    envisionSetting.gridChild = {
        grvBusinessObjectiveCost: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                allowOrder: false,
                allowFilter: true,
                allowCustom: true,

                showHeaderRow: true,
                headerRowHeight: 0,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 40,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                leaveSpaceForNewRows: false,
                explicitInitialization: true,
                filterable: false,
            },

            columns: [
                { id: 'quota', name: envisionTranslation.QUOTA, field: "quota", sortable: true, dataType: "text", editor: Slick.Editors.Text, width: 200, minWidth: 50 },
                { id: 'unit', name: envisionTranslation.UNIT, field: "unit", sortable: true, dataType: "text", editor: Slick.Editors.Text, width: 100, minWidth: 50 },
                {
                    id: 'price', name: envisionTranslation.PRICE, field: "price", sortable: true, filterable: false, dataType: "number", editor: Slick.Editors.Float, width: 200, minWidth: 50, hasTextTotal: true,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value !== null)
                            return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        else
                            return 0;
                    }
                }
            ],

            updateFooter: function (grvBusinessObjectiveCost) {
                var columnIdx = grvBusinessObjectiveCost.getColumns().length;
                var hasTxt = false;

                while (columnIdx--) {
                    var column = grvBusinessObjectiveCost.getColumns()[columnIdx];

                    if (column.hasTextTotal && !hasTxt) {
                        var columnElement = grvBusinessObjectiveCost.getFooterRowColumn(grvBusinessObjectiveCost.getColumns()[columnIdx].id);
                        $(columnElement).html(envisionTranslation.TOTAL);
                        hasTxt = true;
                    }

                    if (!column.hasTotalCol) {
                        continue;
                    }

                    var columnId = grvBusinessObjectiveCost.getColumns()[columnIdx].id;
                    var total = 0;

                    var i = grvBusinessObjectiveCost.getDataLength();
                    while (i--) {
                        var _field = grvBusinessObjectiveCost.getData().getItems()[i][column.field] ?
                            grvBusinessObjectiveCost.getData().getItems()[i][column.field].replace(/,/g, '') : 0;
                        var _price = grvBusinessObjectiveCost.getData().getItems()[i]['price'] ?
                            grvBusinessObjectiveCost.getData().getItems()[i]['price'].replace(/,/g, '') : 0;
                        total += (parseFloat(_field) || 0) * (parseFloat(_price) || 0);
                    }
                    var _columnElement = grvBusinessObjectiveCost.getFooterRowColumn(columnId);
                    $(_columnElement).html(total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VND');
                }
            }
        },
        grvBusinessObjectiveRevenue: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                allowOrder: false,
                allowFilter: true,
                allowCustom: true,

                showHeaderRow: true,
                headerRowHeight: 0,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 40,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                leaveSpaceForNewRows: false,
                explicitInitialization: true,
                filterable: false,
            },

            columns: [
                { id: 'quota', name: envisionTranslation.QUOTA, field: "quota", sortable: true, dataType: "text", editor: Slick.Editors.Text, width: 200, minWidth: 50 },
                { id: 'unit', name: envisionTranslation.UNIT, field: "unit", sortable: true, dataType: "text", editor: Slick.Editors.Text, width: 100, minWidth: 50 },
                {
                    id: 'price', name: envisionTranslation.PRICE, field: "price", filterable: false, sortable: true, dataType: "text", formatter: Slick.Formatters.Number, width: 200, minWidth: 50, hasTextTotal: true
                }
            ],

            updateFooter: function (grvBusinessObjectiveRevenue) {
                var columnIdx = grvBusinessObjectiveRevenue.getColumns().length;
                var hasTxt = false;

                while (columnIdx--) {
                    var column = grvBusinessObjectiveRevenue.getColumns()[columnIdx];

                    if (column.hasTextTotal && !hasTxt) {
                        var columnElement = grvBusinessObjectiveRevenue.getFooterRowColumn(grvBusinessObjectiveRevenue.getColumns()[columnIdx].id);
                        $(columnElement).html(envisionTranslation.TOTAL);
                        hasTxt = true;
                    }

                    if (!column.hasTotalCol) {
                        continue;
                    }

                    var columnId = grvBusinessObjectiveRevenue.getColumns()[columnIdx].id;
                    var total = 0;

                    var i = grvBusinessObjectiveRevenue.getDataLength();
                    while (i--) {
                        var _field = grvBusinessObjectiveRevenue.getData().getItems()[i][column.field] ?
                            grvBusinessObjectiveRevenue.getData().getItems()[i][column.field].replace(/,/g, '') : 0;
                        var _price = grvBusinessObjectiveRevenue.getData().getItems()[i]['price'] ?
                            grvBusinessObjectiveRevenue.getData().getItems()[i]['price'].replace(/,/g, '') : 0;
                        total += (parseFloat(_field) || 0) * (parseFloat(_price) || 0);
                    }
                    var _columnElement = grvBusinessObjectiveRevenue.getFooterRowColumn(columnId);
                    $(_columnElement).html(total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VND');
                }
            }
        }
    };

    envisionSetting.valuelist = {};
    envisionSetting.options = {};

    envisionSetting.required = [
        "quota", "unit", "price"
    ];
}