var stateAgenciesSetting = null;
function stateAgenciesInitSetting() {
    stateAgenciesSetting = {
        view: {
            module: 'fn',
            formName: 'stateAgencies',
            gridName: 'grvstateAgencies',
            entityName: 'FN_stateAgencies',

            //title: customerTranslation.TITLE,
            //description: customerTranslation.NAME,
        },

        grid: {
     //       url: 'api/pm/Cost/Get',
          //  defaultUrl: 'api/pm/Cost/Get',

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
                    ],          

        },

        gridChild: {
            grvDetail: {
                url: '',
                defaultUrl: '',

                options: {
                    rowHeight: 40,
                    topPanelHeight: 35,

                    showHeaderRow: true,
                    headerRowHeight: 0,

                    createFooterRow: true,
                    showFooterRow: true,
                    footerRowHeight: 30,

                    autoHeight: false,
                    fullWidthRows: true,
                    multiColumnSort: true,

                    enableColumnReorder: true,
                    enableCellNavigation: true,
                    explicitInitialization: true,
                    filterable: false

                },

                columns: [
                  
                ],

                updateFooter: function (grid) {
                    var columnIdx = grid.getColumns().length;
                    while (columnIdx--) {
                        var column = grid.getColumns()[columnIdx];
                        if (!column.hasTotalCol) {
                            continue;
                        }

                        var columnId = grid.getColumns()[columnIdx].id;
                        var total = 0;

                        var i = grid.getDataLength();
                        while (i--) {
                            total += (parseInt(grid.getData().getItems()[i][column.field]) || 0);
                        };
                        var columnElement = grid.getFooterRowColumn(columnId);
                        $(columnElement).html(stateAgenciesTranslation .TOTAL + ": " + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VNĐ');
                    }
                },
            }
        },

        valuelist: {
            test: [
                {
                    "id": "demo1",
                    "text": "DEMO 1"
                },
                {
                    "id": "demo2",
                    "text": "DEMO 2"
                }
            ],
            category: [
                {
                    "id": "Công tác",
                    "text": "Công tác"
                },
                {
                    "id": "Chi phí nhân sự",
                    "text": "Chi phí nhân sự"
                },
                {
                    "id": "Hợp đồng",
                    "text": "Hợp đồng"
                }
            ],
            state: [
                {
                    "id": "new",
                    "text": "New",
                    "iclass": "state-new"
                },
                {
                    "id": "approved",
                    "text": "Approved",
                    "iclass": "state-active"
                },
                {
                    "id": "rejected",
                    "text": "Rejected",
                    "iclass": "state-resolved"
                },
                {
                    "id": "waittingApprove",
                    "text": "Waitting for Approve",
                    "iclass": "state-closed"
                },
                {
                    "id": "waittingPayment",
                    "text": "Waitting for Payment",
                    "iclass": "state-removed"
                },
                {
                    "id": "payment",
                    "text": "Payment",
                    "iclass": "state-resolved"
                }
            ],
            paymentMethod: [
                {
                    "id": "transfer",
                    "text": "TRANSFER"
                },
                {
                    "id": "cash",
                    "text": "CASH"
                },
            ],
            user: getDataAsync('api/sys/user/getlist')
        },

        options: {

        },
        required: [
            "name", "beneficiaryName", "address", "project", "departmentDebit", "state", "reason"
        ],
        readonly: [
            "createdBy", "project"
        ],
    }
}
//check