var vendorViewSetting = null;
function vendorViewInitSetting() {
    vendorViewSetting = {
        view: {
            module: 'fn',
            formName: 'vendorView',
            gridName: 'grvVendor',
            entityName: 'FN_Vendor',

            //title: vendorViewTranslation.TITLE,
            //description: vendorViewTranslation.NAME,
        },

        grid: {
            url: 'api/fn/basicObject/get',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: true,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 30,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: 'id', field: 'id', name: "", width: 50, defaultWidth: 50, sortable: false, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value == null || dataContext.type == "4") return "";
                        return '<div style="display:block;text-align:-webkit-center"><i class="bowtie-icon bowtie-math-plus-circle-outline addChild"></i></div>';
                    }
                },
                {
                    id: "objectID", field: "objectID", name: vendorViewTranslation.NAME, width: 300, defaultWidth: 300, sortable: false, dataType: 'text'
                },
                {
                    id: 'objectName', field: 'objectName', name: vendorViewTranslation.DESCRIPTION, width: 400, defaultWidth: 400, sortable: true, dataType: 'text'
                }
            ]


        },
      

        valuelist: {
        
        },

        options: {

        },
        required: [
          
        ],
        readonly: [
            "createdBy"
        ],
    }
}
//check