var cashReceiptSetting = {
    view: {
        module: 'pos',
        formName: 'cashReceipt',
        gridName: 'grvCashReceipt',
    }
};

function cashReceiptInitSetting() {
    cashReceiptSetting.valuelist = {};

    cashReceiptSetting.grid = {
        url: 'api/pos/cashReceiptDetail/get',

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
            { id: 'cashReason', field: 'cashReason', dataType: 'text', filterable: true, name: cashReceiptTranslation.CASHREASON, width: 300, sortable: true, editor: Slick.Editors.Text },
            {
                id: 'debitAmount', field: 'debitAmount', dataType: 'number', filterable: true, name: cashReceiptTranslation.DEBITAMOUNT, width: 150, sortable: true, editor: Slick.Editors.Text,
                formatter: Slick.Formatters.Money
            },
            {
                id: 'cashReasonId', field: 'cashReasonId', dataType: 'text', filterable: true, name: cashReceiptTranslation.CASHREASONID, width: 200, sortable: true,
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
                total += (parseInt(value.debitAmount) || 0);
            });
            var columnElement = grid.getFooterRowColumn("cashReason");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + cashReceiptTranslation.TOTAL + ": </div>");
            columnElement = grid.getFooterRowColumn("debitAmount");
            $(columnElement).html('<div style="font-weight: bold; float: right">' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div>');
        },
    };

    cashReceiptSetting.gridChild = {
        grvCashReceiptDetail: {
            url: 'api/pos/cashReceiptDetail/get',

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
                {
                    id: 'cashReason', field: 'cashReason', dataType: 'text', name: cashReceiptTranslation.CASHREASON, width: 200, sortable: true,
                    //validator: function (value) {
                    //    if (!value || value == '') {
                    //        showError('Please Fill');
                    //        return { valid: false, msg: 'Please Fill' }
                    //    }
                    //    else return { valid: true, msg: null }

                    //    return {
                    //        valid: true,
                    //        msg: "please fill"
                    //    };
                    //},
                    editor: Slick.Editors.Text
                },
                {
                    id: 'debitAmount', field: 'debitAmount', dataType: 'text', name: cashReceiptTranslation.DEBITAMOUNT, width: 150, sortable: true, opt: { min: 0 },
                    editor: Slick.Editors.Integer,
                    formatter: Slick.Formatters.Money
                },

                {
                    id: 'cashReasonId', field: 'cashReasonId', name: cashReceiptTranslation.CASHREASONID, width: 200, sortable: true, dataType: 'select', listName: 'listItem',
                    editor: Slick.Editors.Combobox,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && cashReceiptSetting.valuelist.listReason) {
                            var item = cashReceiptSetting.valuelist.listReason.find(x => x.id == value);
                            if (item)
                                return item.text;
                            return null
                        }
                    }
                },
            ],
        }
    };

    cashReceiptSetting.required = [
        "docDate", "cashType", "objectName", "docDate", "cashierId", "storeId"
    ];
    cashReceiptSetting.validate = {
        //code: { required: true },
        cashType: { required: true },
        objectName: { required: true },
        docDate: { required: true },
        cashierId: { required: true },
        storeId: { required: true }
    }
}
