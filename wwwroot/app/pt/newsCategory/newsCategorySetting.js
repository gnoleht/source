var newsCategorySetting = {
    view: {
        module: 'pt',
        subModule:'newsCategory',
        formName: 'newsCategory',
        gridName: 'grvNewsCategory',
    }
};

function newsCategoryInitSetting() {
    newsCategorySetting.grid = {
        url: 'api/pt/newsCategory/get',
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
                id: "name", field: "name", name: newsCategoryTranslation.NAME, width: 400, minWidth: 30, sortable: true
            },
            {
                id: "description", field: "description", name: newsCategoryTranslation.DESCRIPTION, width: 700, minWidth: 30, sortable: true
            },
            {
                id: "note", field: "note", name: newsCategoryTranslation.NOTE, width: 400, minWidth: 30, sortable: true
            },
            {
                id: "createdTime", field: "createdTime", name: newsCategoryTranslation.CREATEDDATE, width: 200, minWidth: 30, sortable: true, dataType: "datetime", formatter: Slick.Formatters.Date
            },
        ],
    };

    newsCategorySetting.valuelist = {};
    newsCategorySetting.listFilter = {};
    newsCategorySetting.required = ["name"];
    
}
