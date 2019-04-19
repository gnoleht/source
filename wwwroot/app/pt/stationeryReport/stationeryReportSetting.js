var stationeryReportSetting = {
    view: {
        module: 'pt',
        subModule: 'stationeryReport',
        formName: 'stationeryReport',
        gridName: 'grvStationeryReport',
    }
};

function stationeryReportInitSetting() {

    stationeryReportSetting.grid = {
        url: 'api/pt/stationery/get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            showHeaderRow: true,
            headerRowHeight: 0,
            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 40,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,

            editable: true,
            autoEdit: true,

            fullWidthRows: true,
            multiColumnSort: true,
            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,
        },
        columns: [
            {
                id: "id", field: "id", name: stationeryReportTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return row + 1;
                }
            },
            {
                id: "category", field: "category", name: stationeryReportTranslation.CATEGORY, width: 150, minWidth: 30, sortable: true, dataType: 'select', listName: 'category',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = stationeryReportSetting.listFilter.category[value];
                    if (itemList)
                        return itemList.text;
                    return value;
                }
            },
            {
                id: "name", field: "name", name: stationeryReportTranslation.NAME, width: 360, minWidth: 30, sortable: true
            },
            {
                id: "unit", field: "unit", name: stationeryReportTranslation.UNIT, width: 150, minWidth: 30, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = stationeryReportSetting.listFilter.stationeryUnit[value];
                    if (itemList)
                        return itemList.text;
                    return value;
                }
            },
            {
                id: "quantity", field: "quantity", dataType: 'number', name: stationeryReportTranslation.QUANTITY, width: 100, minWidth: 30, sortable: true, formatter: Slick.Formatters.Number
            },
            {
                id: "cost", field: "cost", name: stationeryReportTranslation.COST, width: 150, minWidth: 30, sortable: true, cssClass: "right", formatter: Slick.Formatters.Money, dataType: 'number',
            },
            {
                id: "percentVAT", field: "percentVAT", name: stationeryReportTranslation.PERCENT_VAT, width: 150, minWidth: 30, sortable: true, cssClass: "right", dataType: 'number',
            },
            {
                id: "prices", field: "prices", name: stationeryReportTranslation.PRICES, width: 250, minWidth: 30, sortable: true, cssClass: "right", dataType: 'number',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    dataContext.prices = dataContext.cost * ((100 + dataContext.percentVAT) / 100) * dataContext.quantity;
                    if (dataContext.prices)
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(dataContext.prices) + '</div>';
                    else
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(0) + '</div>';
                }
            },
            {
                id: "note", field: "note", name: stationeryReportTranslation.NOTE, width: 300, minWidth: 30, sortable: true, editor: Slick.Editors.Text
            },
        ],
        updateFooter: function (grid) {

            var gridData = grid.getData().getItems();
            var total = 0;
            $.each(gridData, function (index, item) {
                total += item.prices ? item.prices : 0;
            });
            var columnElement = grid.getFooterRowColumn("percentVAT");
            $(columnElement).html("<div style='font-weight: bold;font-size:14px;text-align:right;'>" + stationeryReportTranslation.TOTAL + ": </div>");
            columnElement = grid.getFooterRowColumn("prices");
            $(columnElement).html('<div style="font-size:14px;font-weight:bold;text-align:right;padding: 0 10px;">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + stationeryReportTranslation.UNIT_VND + '</div>');
        },
    };
    stationeryReportSetting.valuelist = {};
    stationeryReportSetting.listFilter = {};
    stationeryReportSetting.options = {
        loadButton: true
    };
}
