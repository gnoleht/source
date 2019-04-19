var storeSetting = {
    view: {
        module: 'pos',
        formName: 'store',
        gridName: 'grvstore',
    }
};

function storeInitSetting() {
    storeSetting.valuelist = {};

    storeSetting.grid = {
        url: 'api/pos/store/get',

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
            { id: 'code', field: 'code', name: storeTranslation.CODE, width: 250, minwidth:250, sortable: true },
            { id: 'name', field: 'name', name: storeTranslation.NAME, width: 350, sortable: true },
            {
                id: 'type', field: 'type', name: storeTranslation.TYPE, width: 250, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        if (storeSetting && storeSetting.valuelist && storeSetting.valuelist.storeType) {
                            var itemList = storeSetting.valuelist.storeType.find(x => x.id == value).text;

                            if (itemList)
                                return itemList;
                        }
                    }

                    return value;
                }
            },
            { id: 'primaryStreet', field: 'primaryStreet', name: storeTranslation.PRIMARYSTREET, width: 450, sortable: true },           
            {
                id: "active", field: "active", name: storeTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
                minWidth: 70, maxWidth: 150, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
            {
                id: "createdBy", field: "createdBy", name: storeTranslation.CREATEDBY, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.user) {
                        return dataContext.user.displayName;
                    }
                    return '';
                }
            },
            {
                id: "createdTime", field: "createdTime", name: storeTranslation.CREATEDTIME, width: 150, defaultWidth: 150, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            },
        ],
    };

    storeSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgLogo',
            }],
    };

    storeSetting.required = [
        "name", "code",
    ];

    storeSetting.validate = {
        code: { required: true },
        name: { required: true },      
    }

}
