var cashPaymentSetting = {
    view: {
        module: 'pos',
        formName: 'cashPayment',
        gridName: 'grvCashPayment',
    }
};

function cashPaymentInitSetting() {
    cashPaymentSetting.valuelist = {};

    cashPaymentSetting.grid = {
        url: 'api/pos/cashPaymentDetail/get',

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

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 50
        },
        columns: [
            { id: 'cashReason', field: 'cashReason', dataType: 'text', filterable: true, name: cashPaymentTranslation.CASHREASON, width: 300, sortable: true, editor: Slick.Editors.Text },
            {
                id: 'creditAmount', field: 'creditAmount', dataType: 'number', filterable: true, name: cashPaymentTranslation.CREDITAMOUNT, width: 150, sortable: true, editor: Slick.Editors.Text,
                formatter: Slick.Formatters.Money
            },
            {
                id: 'cashReasonId', field: 'cashReasonId', dataType: 'text', filterable: true, name: cashPaymentTranslation.CASHREASONID, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.cashReasonRelated != null)
                        return dataContext.cashReasonRelated.name;
                    return null;
                }
            },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            //var i = gridData.length;
            var total = 0;
            $.each(gridData, function (key, value) {
                total += (parseInt(value.creditAmount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("cashReason");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + cashPaymentTranslation.TOTAL + ": </div>");
            columnElement = grid.getFooterRowColumn("creditAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');
        },
    };

    cashPaymentSetting.gridChild = {
        grvCashPaymentDetail: {
            url: 'api/pos/cashPaymentDetail/get',

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
                autoEdit: true,
                enableAddRow: false,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 50
            },
            columns: [
                { id: 'cashReason', field: 'cashReason', dataType: 'text', name: cashPaymentTranslation.CASHREASON, width: 300, sortable: true, editor: Slick.Editors.Text },
                {
                    id: 'creditAmount', field: 'creditAmount', dataType: 'text', name: cashPaymentTranslation.CREDITAMOUNT, width: 300, sortable: true, editor: Slick.Editors.Integer, opt: { min: 0 },
                    formatter: Slick.Formatters.Money
                },
                //{
                //    id: 'cashReasonId', field: 'cashReasonId', dataType: 'text', name: cashPaymentTranslation.CASHREASONID, width: 400, sortable: true
                //},
                {
                    id: 'cashReasonId', field: 'cashReasonId', name: cashPaymentTranslation.CASHREASONID, width: 400, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && cashPaymentSetting.valuelist.listReason) {
                            var item = cashPaymentSetting.valuelist.listReason.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null
                        }
                    }
                },
            ],
        }
    };

    cashPaymentSetting.required = [
        "docDate", "cashType", "objectName", "docDate", "cashierId", "storeId"
    ];
    cashPaymentSetting.validate = {
        //vendorId: { required: true },
        cashType: { required: true },
        objectName: { required: true },
        docDate: { required: true },
        cashierId: { required: true },
        storeId: { required: true }
    }
    cashPaymentSetting.readonly = [
        "vendorName"
    ];
    //vendorName
}
