var vendorSetting = null;
function vendorInitSetting() {
    vendorSetting = {
        view: {
            module: 'fn',
            formName: 'vendor',
            gridName: 'grvObject',
            entityName: 'FN_Vendor',
            title: vendorTranslation.TITLE,
            description: vendorTranslation.NAME,
        },

        grid: {

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
                    id: 'id', field: 'id', name: vendorTranslation.Object_ObjectID, width: 300, defaultWidth: 300, sortable: false, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return ` <div class="td w_30">
                              <p class="m-0 txt_cut"><a href="#" class="link">${dataContext.objectID}</a></p>
                              <p class="m-0">${dataContext.objectName == null ? "" : dataContext.objectName}</p>
                            </div>
                                `
                    }
                },
                {
                    id: "analysisCode1", field: "analysisCode1", name: vendorTranslation.Object_AnalysisCode, width: 200, defaultWidth: 200, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.analysisCode1 == null ? "" : dataContext.analysisCode1}</p>
                              <p class="m-0">${dataContext.analysisCode2 == null ? "" : dataContext.analysisCode2}</p>
                            </div>
                                `;
                    }
                },
                {
                    id: 'representative', field: 'representative', name: vendorTranslation.Object_Representative, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.representative == null ? "" : dataContext.representative}</p>
                              <p class="m-0">${dataContext.repPositionID == null ? "" : dataContext.repPositionID}</p>
                            </div>
                                `;
                    }
                },
                {
                    id: 'active', field: 'active', name: vendorTranslation.Object_Active, width: 300, defaultWidth: 300, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var date = new Date(dataContext.modifiedTime);
                        icon = ""; 
                        if (dataContext.active == 1)
                            icon = "<i class=\"bowtie-icon bowtie-record-fill\"></i>";
                        
                        return ` <div class="td w_30">
                              <p class="m-0"><span class="status status_01" style="color: #30b98f">${icon}
                              </span>${dataContext.active == 1 ? "Đang hoạt động" : "Ngưng hoạt động"}</p>
                              
                              <p class="m-0">${dataContext.modifiedTime == null ? "" : date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</p>
                            </div>
                                `;
                    }
                }
                ,
                {
                    id: 'createdBy', field: 'createdBy', name: vendorTranslation.Object_CreatedBy, width: 200, defaultWidth: 200, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var date = new Date(dataContext.createdTime);
                         return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.createdBy == null ? "" : dataContext.createdBy}</p>
                              <p class="m-0">${dataContext.createdTime == null ? "" : date.getDay() + "/" + (date.getMonth() + 1)+"/"+date.getFullYear()}</p>
                            </div>
                                `;
                    }
                }

            ]


        },
        gridChild: {

            grvObjectContact: {
                options: {
                    rowHeight: 50,
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
                    {
                        id: 'contactName', field: 'contactName', name: vendorTranslation.ObjectContact_ContactName, width: 300, defaultWidth: 200, sortable: false, filterable: false,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return ` <div class="td w_30">
                              <p class="m-0 txt_cut"><a href="#" class="link">${dataContext.contactName == null || dataContext.contactName == undefined ? '' : dataContext.contactName}</a></p>
                              <p class="m-0">${dataContext.positionID == null || dataContext.positionID == undefined ? '' : dataContext.positionID}</p>
                            </div>
                                `
                        }
                    },
                    {
                        id: 'phone', field: 'phone', name: vendorTranslation.ObjectContact_Phone, width: 200, defaultWidth: 200, sortable: false, filterable: false,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.phone == null || dataContext.phone == undefined ? '' : dataContext.phone}</p>
                              <p class="m-0">${dataContext.emailCompany == null || dataContext.emailCompany == undefined ? "" : dataContext.emailCompany}</p>
                            </div>
                                `
                        }
                    },
                ],
            },
            grvObjectCreditLimit: {
                options: {
                    rowHeight: 50,
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
                    {
                        id: 'objectID', field: 'objectID', name: vendorTranslation.ObjectCreditLimit_FromDate, width: 300, defaultWidth: 300, sortable: false, filterable: false,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            var frmDate = new Date(dataContext.fromDate);
                            var toDate = new Date(dataContext.toDate);
                            
                            return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.fromDate == null ? "" : frmDate.getDay() + "/" + (frmDate.getMonth() + 1) + "/" + frmDate.getFullYear() }</p>
                              <p class="m-0">${dataContext.toDate == null ? "" : toDate.getDay() + "/" + (toDate.getMonth() + 1) + "/" + toDate.getFullYear()}</p>
                            </div>
                                `
                        }
                    },
                    {
                        id: 'maxCreditLimit', field: 'maxCreditLimit', name: vendorTranslation.ObjectCreditLimit_MaxCreditLimit, width: 100, defaultWidth: 100, sortable: false, filterable: false,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.maxCreditLimit == null || dataContext.maxCreditLimit == undefined ? '' : dataContext.maxCreditLimit}</p>
                              <p class="m-0">${dataContext.minCreditLimit == null || dataContext.minCreditLimit == undefined ? '' : dataContext.minCreditLimit}</p>
                            </div>
                                `
                        }
                    },
                ],


            },
            grvObjAddress: {
                options: {
                    rowHeight: 50,
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
                    {
                        id: 'id', field: 'id', name: vendorTranslation.ObjAddress_AddressName, width: 200, defaultWidth: 200, sortable: false, filterable: false,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.addressName == null || dataContext.addressName == undefined ? '' : dataContext.addressName}</p>
                              <p class="m-0">${dataContext.address == null || dataContext.address == undefined ? '' : dataContext.address}</p>
                            </div>
                                `
                        }
                    }
                ],


            },

            grvObjBankAccount: {
                options: {
                    rowHeight: 50,
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
                    {
                        id: 'bankAccountID', field: 'bankAccountID', name: vendorTranslation.ObjBankAccount_BankAcc, width: 100, defaultWidth: 100, sortable: false, filterable: false,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.bankAccountID}</p>
                              <p class="m-0">${dataContext.cardHolderName == null || dataContext.cardHolderName == undefined ? '' : dataContext.cardHolderName}</p>
                            </div>
                                `
                        }
                    },
                    {
                        id: 'bankID', field: 'bankID', name: vendorTranslation.ObjBankAccount_BankName, width: 200, defaultWidth: 200, sortable: false, filterable: false,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return ` <div class="td w_30">
                              <p class="m-0 txt_cut">${dataContext.bankID == null || dataContext.bankID == undefined ? '' : dataContext.bankID}</p>
                              <p class="m-0">${dataContext.bankName == null || dataContext.bankName == undefined ? '' : dataContext.bankName}</p>
                            </div>
                                `
                        }
                    },
                ],


            }


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