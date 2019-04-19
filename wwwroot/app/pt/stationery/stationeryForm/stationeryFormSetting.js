
var stationeryFormSetting = {
    view: {
        gridName: 'grvStationeryForm',
    }
};


function stationeryFormInitSetting() {

    stationeryFormSetting.grid = {
        //url: 'api/pt/stationery/get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,
            showHeaderRow: true,
            headerRowHeight: 0,
            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 30,

            editable: true,
            autoEdit: true,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,

            fullWidthRows: true,
            multiColumnSort: true,
            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,
        },
        columns: [
            {
                id: "id", field: "id", name: stationeryFormTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //return '<span>' + (row + 1) + ' <i title="' + stationeryFormTranslation.BTN_REMOVE_ITEM + '" class="bowtie-icon bowtie-edit-delete row-icon cl_red btnRemoveItem"></i></span>';
                    return  row + 1;
                }
            },
            {
                id: "name", field: "name", name: stationeryFormTranslation.NAME, width: 200, minWidth: 30, sortable: true
            },
            {
                id: "unit", field: "unit", name: stationeryFormTranslation.UNIT, width: 100, minWidth: 30, sortable: true, dataType: 'select', listName: 'stationeryUnit',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = stationeryFormSetting.listFilter.stationeryUnit[value];
                    if (itemList)
                        return itemList.text;
                    return value;
                }
            },
            {
                id: "quantity", field: "quantity", dataType: 'number', name: stationeryFormTranslation.QUANTITY, width: 100, minWidth: 30, sortable: true,
                editor: Slick.Editors.Integer,
                formatter: Slick.Formatters.Number
            },
            {
                id: "cost", field: "cost", name: stationeryFormTranslation.COST, width: 100, minWidth: 30, sortable: true, dataType: 'number',
                formatter: Slick.Formatters.Money
            },
            {
                id: "prices", field: "prices", name: stationeryFormTranslation.PRICES, width: 170, minWidth: 30, sortable: true, dataType: 'number',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    dataContext.prices = dataContext.quantity * dataContext.cost;

                    if (dataContext.prices)
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(dataContext.prices) + '</div>';
                    else
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(0) + '</div>';
                }
            },
            {
                id: "pricesVAT", field: "pricesVAT", name: stationeryFormTranslation.PRICES_VAT, width: 170, minWidth: 30, sortable: true, dataType: 'number',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    dataContext.pricesVAT = dataContext.prices * (100 + dataContext.percentVAT) / 100;

                    if (dataContext.pricesVAT)
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(dataContext.pricesVAT) + '</div>';
                    else
                        return '<div style="width:100%;text-align:right">' + accounting.formatMoney(0) + '</div>';
                }
            },
            {
                id: "note", field: "note", name: stationeryFormTranslation.NOTE, width: 200, minWidth: 30, sortable: true,
                editor: Slick.Editors.Text
            },
        ],
        HiddenColumn: [
            {
                id: "category", field: "category", name: stationeryFormTranslation.CATEGORY, width: 150, minWidth: 30, sortable: true, dataType: 'select', listName: 'category',
            },
            {
                id: "percentVAT", field: "percentVAT", name: stationeryFormTranslation.PERCENT_VAT, width: 100, minWidth: 30, sortable: true,
                formatter: Slick.Formatters.Number
            }
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var total = 0;
            var totalVAT = 0;
            $.each(gridData, function (index, item) {
                total += item.prices ? item.prices : 0;
                totalVAT += item.pricesVAT ? item.pricesVAT : 0;
            });
            var columnElement = grid.getFooterRowColumn("cost");
            $(columnElement).html("<div style='font-weight: bold;font-size:12px;text-align:right;'>" + stationeryFormTranslation.TOTAL + ": </div>");
            columnElement = grid.getFooterRowColumn("prices");
            $(columnElement).html('<div style="font-size:12px;font-weight:bold;text-align:right;padding: 0 10px;">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + stationeryFormTranslation.UNIT_VND + '</div>');
            columnElement = grid.getFooterRowColumn("pricesVAT");
            $(columnElement).html('<div style="font-size:12px;font-weight:bold;text-align:right;padding: 0 10px;">' + totalVAT.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + stationeryFormTranslation.UNIT_VND + '</div>');
        },
    };

    stationeryFormSetting.gridChild = {
        grvItem: {
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: true,
                allowCustom: true,

                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,
            },
            columns: [
                {
                    id: "selected", field: "selected", name: '', sortable: true, filterable: false, width: 50, cssClass: "center",
                    formatter: Slick.Formatters.CheckBox
                },
                { id: "id", field: "id", name: stationeryFormTranslation.CODE, sortable: true, width: 100, cssClass: "center" },
                { id: "name", field: "name", name: stationeryFormTranslation.NAME, sortable: true, width: 300 },
                {
                    id: "unit", field: "unit", name: stationeryFormTranslation.UNIT, width: 200, dataType: 'select', listName: 'stationeryUnit',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var itemList = stationeryFormSetting.listFilter.stationeryUnit[value];
                        if (itemList)
                            return itemList.text;
                        return value;
                    }
                },
                { id: "cost", field: "cost", name: stationeryFormTranslation.COST, width: 250, formatter: Slick.Formatters.Money, dataType: 'number' },
               
            ],
            HiddenColumn: [
                { id: "percentVAT", field: "percentVAT", name: stationeryFormTranslation.PERCENT_VAT, width: 100, cssClass: "center" },
                { id: "producer", field: "producer", name: stationeryFormTranslation.PRODUCER, width: 200 },
            ]
        },
    };

    stationeryFormSetting.valuelist = {};

    stationeryFormSetting.listFilter = {};

    stationeryFormSetting.required = {
        requirement: [],
        epic: [],
        function: [],
        userstory: [],
        task: [],
        bug: []
    };

    stationeryFormSetting.readonly = ["createdBy", "department", "company"];
}