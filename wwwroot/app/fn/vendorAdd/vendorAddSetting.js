var vendorAddSetting = null;
function vendorAddInitSetting() {
    vendorAddSetting = {
        view: {
            module: 'fn',
            formName: 'vendorAdd',
            gridName: 'grvVendor',
            entityName: 'FN_Vendor',
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
                    id: "objectID", field: "objectID", name: vendorAddTranslation.NAME, width: 300, defaultWidth: 300, sortable: false, dataType: 'text'
                },
                {
                    id: 'objectName', field: 'objectName', name: vendorAddTranslation.DESCRIPTION, width: 400, defaultWidth: 400, sortable: true, dataType: 'text'
                }
            ]


        },


        valuelist: {

        },
        options: {
            uploadSetting: [
                {
                    acceptedFiles: 'image/*',
                    maxFiles: 1,
                    elementId: 'imgAvatar',
                }],
        },
        required: [
            "ObjectID", "ObjectName", "PrimaryStreet", "PrimaryProvince", "PrimaryCountry", "TaxCode", "BusinessLicence", "Representative","RepJobTitleID"
        ],

        //text: a-z
        //string: a-z & space
        //number: 0-9
        //phone: 0-9, start with 0, length = 10 or length = 11
        //email: contain one @. @ not start with or end with,
        //required: not allow null
        validate: {
            ObjectID: {  required: true },
            ObjectName: { required: true },
            PrimaryStreet: {  required: true },
            PrimaryProvince: {  required: true },
            PrimaryCountry: {  required: true },
            TaxCode: {  required: true },
            BusinessLicence: {  required: true },
            Representative: {  required: true },
            RepJobTitleID: {  required: true }
        },
        readonly: [
            "createdBy"
        ],
    }
}
//check