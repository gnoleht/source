var contactSetting = {
    view: {
        module: 'pos',
        formName: 'contact',
        gridName: 'grvcontact',
    }
};

function contactInitSetting() {
    contactSetting.valuelist = {};

    contactSetting.grid = {
        url: 'api/pos/contact/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns: [
            { id: 'code', field: 'code', name: contactTranslation.CODE, width: 100, sortable: true },
            { id: 'name', field: 'name', name: contactTranslation.NAME, width: 100, sortable: true },
            { id: 'details.sKU', field: 'details.sKU', name: contactTranslation.DETAILS.SKU, width: 100, sortable: true },
            { id: 'details.price', field: 'details.price', name: contactTranslation.DETAILS.PRICE, width: 100, sortable: true },
            { id: 'details.sysDate', field: 'details.sysDate', name: contactTranslation.DETAILS.SYSDATE, width: 100, sortable: true },
            { id: 'note', field: 'note', name: contactTranslation.NOTE, width: 100, sortable: true },
            { id: 'active', field: 'active', name: contactTranslation.ACTIVE, width: 100, sortable: true },
            { id: 'storeId', field: 'storeId', name: contactTranslation.STOREID    , width: 100, sortable: true },
            {
                id: 'sysDate', field: 'sysDate', name: contactTranslation.SYSDATE, width: 100, sortable: true, formatter: Slick.Formatters.Date
            },
        ],
    };

    contactSetting.validate = {
        code: { required: true },
        name: { required: true },
        "user.email": { format: "email", required: true },
        beneficiaryName: { required: true },
        address: { required: true },
        state: { required: true },
        reason: { required: true },
    }
}
