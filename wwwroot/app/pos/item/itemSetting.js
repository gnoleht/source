var itemSetting = {
    view: {
        module: 'pos',
        formName: 'item',
        gridName: 'grvItem',
    }
};

function itemInitSetting() {
    itemSetting.valuelist = {};

    itemSetting.grid = {
        url: 'api/pos/Item/get',

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
            { id: 'sku', field: 'sku', name: itemTranslation.SKU, width: 180, sortable: true },
            { id: 'barcode', field: 'barcode', name: itemTranslation.BARCODE, width: 290, sortable: true },
            { id: 'name', field: 'name', name: itemTranslation.NAME, width: 350, sortable: true },
            { id: 'cogs', field: 'cogs', name: itemTranslation.COGS, width: 200, sortable: true, formatter: Slick.Formatters.Money },
            {
                id: 'profitPercent', field: 'profitPercent', name: itemTranslation.PROFITPERCENT, width: 200, sortable: true, dataType: 'number',
                formatter: Slick.Formatters.Number                   
            },
            { id: 'sellPrice', field: 'sellPrice', name: itemTranslation.SELLPRICE, width: 200, sortable: true, formatter: Slick.Formatters.Money },            
        ],
    };

    itemSetting.gridChild = {
        grvAttribute: {
            url: 'api/pos/Item/get',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: true,
                allowFilter: false,
                allowCustom: true,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,

                editable: true,
                enableAddRow: false
            },
            columns: [
                { id: 'name', field: 'name', name: itemTranslation.NAME, width: 250, sortable: true, editor: Slick.Editors.Text  },
                { id: 'sku', field: 'sku', name: itemTranslation.SKU, width: 170, sortable: true  },
                { id: 'barcode', field: 'barcode', name: itemTranslation.BARCODE, width: 160, sortable: true, editor: Slick.Editors.Integer},            
                { id: 'cogs', field: 'cogs', name: itemTranslation.COGS, width: 120, sortable: true, formatter: Slick.Formatters.Number, editor: Slick.Editors.Text },   
                { id: 'profitPercent', field: 'profitPercent', name: itemTranslation.PROFITPERCENT, width: 120, sortable: true, formatter: Slick.Formatters.Number, editor: Slick.Editors.Text },      
                { id: 'sellPrice', field: 'sellPrice', name: itemTranslation.SELLPRICE, width: 120, sortable: true, formatter: Slick.Formatters.Number, editor: Slick.Editors.Text },
                {
                    id: "id", name: itemTranslation.DELETE, field: "id", sortable: false, filterable: false, width: 70,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<i class="bowtie-icon bowtie-edit-delete cl_red row-icon btnRemoveAttribute" title="' + itemTranslation.DELETE + '"></i>';
                    }
                }
            ],
        }
    };

    itemSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgItem',
            }],
    };

    itemSetting.required = [
        "name", "groupId", "sku", "cogs", "codeGroup","nameGroup","umid"
    ];

    itemSetting.validate = {
        name: { required: true },
        groupId: { required: true },
        sku: { required: true },
        cogs: { required: true },
        umid: { required: true },
    }
}