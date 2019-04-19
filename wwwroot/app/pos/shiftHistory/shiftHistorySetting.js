var shiftHistorySetting = {
    view: {
        module: 'pos',
        formName: 'shiftHistory',
        gridName: 'grvShiftHistory',
    }
};

function shiftHistoryInitSetting() {
    shiftHistorySetting.valuelist = {};

    shiftHistorySetting.grid = {
        url: 'api/pos/ShiftHistory/get',

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
            {
                id: "cashierId", field: "cashierId", name: shiftHistoryTranslation.CASHIERID, width: 250, defaultWidth: 150, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.cashierRelated) {
                        return dataContext.cashierRelated.displayName;
                    }
                    return '';
                }

            },
            {
                id: "workDate", field: "workDate", name: shiftHistoryTranslation.WORKDATE, width: 200, defaultWidth: 200, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            }, 
            {
                id: "timeLogin", field: "timeLogin", name: shiftHistoryTranslation.TIMELOGIN, width: 200, defaultWidth: 200, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            }, 
            {
                id: "timeLogout", field: "timeLogout", name: shiftHistoryTranslation.TIMELOGOUT, width: 200, defaultWidth: 200, sortable: true, dataType: 'datetime', formatter: Slick.Formatters.Date
            }, 
            {
                id: "receiverId", field: "receiverId", name: shiftHistoryTranslation.RECEIVERID, width: 250, defaultWidth: 150, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext && dataContext.receiverRelated) {
                        return dataContext.receiverRelated.displayName;
                    }
                    return '';
                }

            },
            {
                id: "startCash", field: "startCash", name: shiftHistoryTranslation.STARTCASH, width: 200, defaultWidth: 150, sortable: true, dataType: 'text', formatter: Slick.Formatters.Money,

            },
            {
                id: "endCash", field: "endCash", name: shiftHistoryTranslation.ENDCASH, width: 200, defaultWidth: 150, sortable: true, dataType: 'text', formatter: Slick.Formatters.Money,
            },
            {
                id: "note", field: "note", name: shiftHistoryTranslation.NOTE, width: 290, defaultWidth: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null) return "";
                    return value.replace(/<(.|\n)*?>/g, '');
                }
            },          
            //{
            //    id: "createdBy", field: "createdBy", name: shiftHistoryTranslation.CREATEDBY, width: 250, defaultWidth: 250, sortable: true, dataType: 'text',
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (dataContext && dataContext.user) {
            //            return dataContext.user.displayName;
            //        }
            //        return '';
            //    }
            //},
            //{
            //    id: "createdTime", field: "createdTime", name: shiftHistoryTranslation.CREATEDTIME, width: 140, defaultWidth: 140, sortable: true, dataType: 'text', formatter: Slick.Formatters.Date
            //},
        ],
    };

    shiftHistorySetting.required = ['code', 'name'];

    shiftHistorySetting.validate = {
        code: { required: true },
        name: { required: true },
    }
}