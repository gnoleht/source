var newsSetting = {
    view: {
        module: 'pt',
        subModule: 'news',
        formName: 'news',
        gridName: 'grvNews',
    }
};

function newsInitSetting() {
    newsSetting.grid = {
        url: 'api/pt/news/get',
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
                id: "title", field: "title", name: newsTranslation.TITLE, width: 300, minWidth: 30, sortable: true
            },
            {
                id: "status", field: "status", name: newsTranslation.STATUS, width: 200, minWidth: 30, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = newsSetting.listFilter.newsStatus[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            },
            {
                id: "categoryRef", field: "categoryRef", name: newsTranslation.CATEGORY, width: 150, minWidth: 30, sortable: true,
                formatter: function (row, cell, value) {
                    return value ? value.name : '';
                }
            },
            {
                id: "describe", field: "describe", name: newsTranslation.DESCRIBE, width: 500, minWidth: 30, sortable: true
            },
            {
                id: "hot", field: "hot", name: newsTranslation.HOTNEWS, width: 200, minWidth: 100, sortable: true,
                formatter: function (row, cell, value) {
                    if (value) return '<i class="bowtie-icon bowtie-pin-pinned-fill red"></i>';
                }
            },
            {
                id: "type", field: "type", name: newsTranslation.TYPE, width: 200, minWidth: 100, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var itemList = newsSetting.listFilter.newsType[value];
                    if (itemList)
                        return gridItemRender(itemList);
                    return value;
                }
            },
            {
                id: "source", field: "source", name: newsTranslation.SOURCE, width: 200, minWidth: 30, sortable: true
            },
        ],
        hiddenColumns: [
            {
                id: "createdTime", field: "createdTime", name: newsTranslation.CREATEDDATE, width: 200, minWidth: 30, sortable: true, dataType: "datetime", formatter: Slick.Formatters.Date
            },
            {
                id: "content", field: "content", name: newsTranslation.CONTENT, width: 300, minWidth: 30, sortable: true
            },
            {
                id: "createdByRef", field: "createdByRef", name: newsTranslation.CREATEDBY, width: 150, minWidth: 30, sortable: true,
                formatter: function (row, cell, value) {
                    return value ? value.displayName : '';
                }
            },
            {
                id: "pictureThumb", field: "pictureThumb", name: newsTranslation.PICTURE, width: 100, minWidth: 30, sortable: true,
                formatter: function (row, cell, value) {
                    if (value && value.length > 10)
                        return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value + '&def=/img/no_avatar.png\')"></span></div>';
                }
            },
            {
                id: "publicationTime", field: "publicationTime", name: newsTranslation.PUBLICATIONTIME, width: 100, minWidth: 30, sortable: true
            },
        ]
    };

    newsSetting.valuelist = {};
    newsSetting.listFilter = {};
    newsSetting.required = ["title", "category", "publicationTime"];

}
