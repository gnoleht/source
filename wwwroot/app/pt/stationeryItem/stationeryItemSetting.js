var stationeryItemSetting = {
    view: {
        module: 'pt',
        subModule:'stationeryItem',
        formName: 'stationeryItem',
        gridName: 'grvStationeryItem',
    }
};

function stationeryItemInitSetting() {
    stationeryItemSetting.grid = {
        url: 'api/pt/stationeryItem/get',
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
                id: "row", field: "row", name: stationeryItemTranslation.NO, width: 40, minWidth: 40, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return row + 1;
                }
            },
            {
                id: "id", field: "id", name: stationeryItemTranslation.ID, width: 150, minWidth: 30, sortable: true
            },
            {
                id: "name", field: "name", name: stationeryItemTranslation.NAME, width: 300, minWidth: 30, sortable: true
            },
            {
                id: "category", field: "category", name: stationeryItemTranslation.CATEGORY, width: 150, minWidth: 30, sortable: true, dataType: 'select', listName: 'category',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = stationeryItemSetting.listFilter.category[value];
                    if (itemList)
                        return itemList.text;
                    return value;
                }
            },
            {
                id: "unit", field: "unit", name: stationeryItemTranslation.UNIT, width: 150, minWidth: 30, sortable: true, dataType: 'select', listName: 'stationeryUnit',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = stationeryItemSetting.listFilter.stationeryUnit[value];
                    if (itemList)
                        return itemList.text;
                    return value;
                }
            },
            {
                id: "producer", field: "producer", name: stationeryItemTranslation.PRODUCER, width: 150, minWidth: 30, sortable: true
            },
            {
                id: "cost", field: "cost", name: stationeryItemTranslation.COST, width: 150, minWidth: 30, sortable: true, dataType: 'number', formatter: Slick.Formatters.Money
            },
            {
                id: "percentVAT", field: "percentVAT", name: stationeryItemTranslation.PERCENTVAT, width: 150, minWidth: 30, sortable: true, dataType: 'number', formatter: Slick.Formatters.Number
            },
        ],
    };

    stationeryItemSetting.valuelist = {};
    stationeryItemSetting.listFilter = {};
    stationeryItemSetting.required = ["cost","name","category"];
    
}
