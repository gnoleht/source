var reportDetailSetting = {
    view: {
        module: 'report',
        subModule: 'reportDetail',
        formName: 'reportDetail',
        gridName: 'grvreportDetail',
    }
};

function reportDetailInitSetting() {

    reportDetailSetting.valuelist = {};
    reportDetailSetting.listFilter = {};
    
    reportDetailSetting.grid = {
        url: 'api/pos/reportDetail/get',
        //url:'',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            //allowOrder: true,
            allowFilter: false,
            allowCustom: true,

            autoHeight: false,
            fullWidthRows: true,
            //multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 50
        },

        columns: [
            {
                id: "id", field: "id", name: reportDetailTranslation.NO, width: 40, minWidth: 40, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return dataContext.number;
                }
            },
            {
                id: "relatedItem", field: "relatedItem", name: reportDetailTranslation.ITEMID, width: 100, minWidth: 30, sortable: true, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                            return value.sku;
                        }
                    
                    return "";
                }
            },
            {
                id: "relatedItem", field: "relatedItem", name: reportDetailTranslation.NAME, width: 200, minWidth: 30, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return value.name;
                    }
                    return "";
                }

            },
            //{
            //    id: "itemName", field: "itemName", name: reportDetailTranslation.NAME, width: 200, minWidth: 30, sortable: false, dataType: 'text', filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (value != null) {
            //            //if (dataContext.notes == 'root')
            //            //    return '<p style="font-weight: bold">' + value + '</p>';
            //            //else
            //                return value;
            //        }
            //        return "";
            //    }

            //},
            {
                id: "relatedItem", field: "relatedItem", name: reportDetailTranslation.RELATEDITEM_UMID, width: 80, minWidth: 30, sortable: false, dataType: 'text', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null) {
                        return value.umid;
                    }
                    return "";
                }
            },
            {
                id: "relatedSaleOrder", field: "relatedSaleOrder", name: reportDetailTranslation.CODE, dataType: 'text', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, datatContext) {
                    if (value != null) {
                        return value.code;
                    }
                    return "";
                }
            },
            //{
            //    id: "relatedSaleOrder.docDate", field: "relatedSaleOrder", name: reportDetailTranslation.DATE_SALE, dataType: 'date', width: 150, minWidth: 30, sortable: false, filterable: false,/*formatter: Slick.Formatters.Date,*/
            //    formatter: function (row, cell, value, columnDef, dataContext) {

            //        if (value != null) {
            //            return moment(value.docDate).format("DD/MM/YYYY"); 
            //        }
            //        return "";
            //    }, /*formatter: Slick.Formatters.Date,*/
            //},
            {
                id: "createdTime", field: "createdTime", name: reportDetailTranslation.DATE_SALE, dataType: 'date', width: 150, minWidth: 30, sortable: false, filterable: false,/*formatter: Slick.Formatters.Date,*/
                formatter: function (row, cell, value, columnDef, dataContext) {
                    
                    if (value != null) { 
                        return moment(value).format("DD/MM/YYYY");
                    }
                    return "";
                }
            },
            {
                id: "quantitySale", field: "quantity", name: reportDetailTranslation.QUANTITY_SALE, width: 150, minWidth: 30, sortable: false, dataType: 'number', filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity >= 0 && dataContext.chkPromo == false) {
                            if (value != null) {
                                return parseFloat(dataContext.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }

                    }
                }
            },
            {
                id: "discAmountSale", field: "discAmount", name: reportDetailTranslation.DISC_AMOUNTSALE, dataType: 'number', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity >= 0 && dataContext.chkPromo == false) {
                            if (value != null) {

                                return parseFloat(dataContext.discAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }

                    }
                }
            },
            {
                id: "vatAmountSale", field: "vatAmount", name: reportDetailTranslation.VAT_SALE, dataType: 'text', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity >= 0 && dataContext.chkPromo == false) {
                            if (value != null) {

                                return parseFloat(dataContext.vatAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }
                    }
                }

            },
            {
                id: "sellingAmountSale", field: "sellingAmount", name: reportDetailTranslation.SELLING_AMOUNT_SALE, dataType: 'number', width: 250, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {

                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity >= 0 && dataContext.chkPromo == false) {
                            if (value != null) {

                                return parseFloat(dataContext.sellingAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }

                    }
                }
            },
            {
                id: "quantityReturn", field: "quantity", name: reportDetailTranslation.QUANTITY_RETURN, width: 150, dataType: 'number', minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                   
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity < 0 && dataContext.chkPromo == false) {
                           
                            if (value != null) {
                                return parseFloat(dataContext.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }
                    }
                }
            },
            {
                id: "discAmountReturn", field: "discAmount", name: reportDetailTranslation.DISC_AMOUNTRETURN, dataType: 'text', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                 
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity < 0 && dataContext.chkPromo == false) {
                            
                            if (value != null) {

                                return parseFloat(dataContext.discAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }
                    }
                }
            },
            {
                id: "vatAmountReturn", field: "vatAmount", name: reportDetailTranslation.VAT_RETURN, dataType: 'text', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity < 0 && dataContext.chkPromo == false) {
                            return parseFloat(dataContext.vatAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }

                    }
                }

            },
            {
                id: "sellingAmountReturn", field: "sellingAmount", name: reportDetailTranslation.SELLING_AMOUNTRETURN, dataType: 'number', width: 250, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.quantity < 0 && dataContext.chkPromo == false) {
                            return parseFloat(dataContext.sellingAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        }

                    }
                }
            },
            {
                id: "quantityPromo", field: "quantity", name: reportDetailTranslation.QUANTITY_PROMO, dataType: 'number', width: 150, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                  
                    if (reportDetailSetting.valuelist.listItem) {

                        if (dataContext.chkPromo == true) {
                            if (value != null) {

                                return parseFloat(dataContext.quantity).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                            }
                        }
                    }
                }
            },
           
            {
                id: "relatedSaleOrder", name: "Khách hàng", field: "relatedSaleOrder", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, datatContext) {

                    if (value != null) {
                        return value.relatedGroupCust.CustName;
                    }
                    return "";
                }
            },
        ],
        hiddenColumns: [
            { id: "chkPromo", name: "Thu ngân", field: "chkPromo", sortable: true, dataType: 'text', width: 200 },
            {
                id: "relatedSaleOrder", name: "Khuyến mãi", field: "relatedSaleOrder", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, datatContext) {

                    if (value != null) {
                        return value.cashierId;
                    }
                    return "";
                }
            },
            {
                id: "relatedItem", name: "Ngành hàng", field: "relatedItem", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, datatContext) {

                    if (value != null) {
                        return value.relatedGroup.fieldName;
                    }
                    return "";
                }
            },
            {
                id: "relatedItem", name: "Nhóm hàng", field: "relatedItem", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, datatContext) {

                    if (value != null) {
                        return value.relatedGroup.groupName;
                    }
                    return "";
                }
            },
            {
                id: "relatedSaleOrder", name: "Cửa hàng", field: "relatedSaleOrder", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, datatContext) {

                    if (value != null) {
                        return value.relatedStore.storeName;
                    }
                    return "";
                }
            },
            {
                id: "relatedSaleOrder", name: "Nhóm khách hàng", field: "relatedSaleOrder", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, datatContext) {

                    if (value != null) {
                        return value.relatedGroupCust.groupNameCust;
                    }
                    return "";
                }
            },
            {
                id: "relatedSaleOrder", name: "Loại khách hàng", field: "relatedSaleOrder", sortable: true, dataType: 'text', width: 200,
                formatter: function (row, cell, value, columnDef, datatContext) {

                    if (value != null) {
                        return value.relatedGroupCust.typeNameCust;
                    }
                    return "";
                }
            },
        ],
        //hiddenColumns: [
        //    { id: "notes", name: "Khuyến mãi", field: "notes", sortable: true, dataType: 'text', width: 200 },

        //],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();
            var quantitySale = 0;
            var discAmountSale = 0;
            var vatAmountSale = 0;
            var sellingAmountSale = 0;

            var quantityPromo = 0;

            var quantityReturn = 0;
            var discAmountReturn = 0;
            var vatAmountReturn = 0;
            var sellingAmountReturn = 0;



            $.each(gridData, function (key, value) {
                //số lượng bán
                //if (value.notes == "root") {
                    if (value.quantity >= 0 && value.chkPromo == false) {
                        quantitySale += (parseInt(value.quantity) || 0);
                    }
                    //chiết khấu
                    if (value.quantity >= 0 && value.chkPromo == false) {
                        discAmountSale += (parseInt(value.discAmount) || 0);
                    }
                    //thuế 
                    if (value.quantity >= 0 && value.chkPromo == false) {
                        vatAmountSale += (parseInt(value.vatAmount) || 0);
                    }
                    //thành tiền
                    if (value.quantity >= 0 && value.chkPromo == false) {
                        sellingAmountSale += (parseInt(value.sellingAmount) || 0);
                    }


                    //số lượng trả
                    if (value.quantity < 0 && value.chkPromo == false) {
                        quantityReturn += (parseInt(value.quantity) || 0);
                    }
                    //chiết khấu  
                    if (value.quantity < 0 && value.chkPromo == false) {
                        discAmountReturn += (parseInt(value.discAmount) || 0);
                    }
                    //thuế 
                    if (value.quantity < 0 && value.chkPromo == false) {
                        vatAmountReturn += (parseInt(value.vatAmount) || 0);
                    }
                    //thành tiền
                    if (value.quantity < 0 && value.chkPromo == false) {
                        sellingAmountReturn += (parseInt(value.sellingAmount) || 0);
                    }

                    //số lượng khuyến mãi
                    if (value.chkPromo == true) {
                        quantityPromo += (parseInt(value.quantity) || 0);
                    }
                //}


            });
            var columnElement = grid.getFooterRowColumn("createdTime");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + reportDetailTranslation.TOTAL + ": </div>");

            columnElement = grid.getFooterRowColumn("quantitySale");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + quantitySale.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("discAmountSale");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + discAmountSale.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("vatAmountSale");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + vatAmountSale.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("sellingAmountSale");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + sellingAmountSale.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</div>");

            columnElement = grid.getFooterRowColumn("quantityReturn");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + quantityReturn.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("discAmountReturn");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + discAmountReturn.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("vatAmountReturn");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + vatAmountReturn.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

            columnElement = grid.getFooterRowColumn("sellingAmountReturn");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + sellingAmountReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</div>");

            columnElement = grid.getFooterRowColumn("quantityPromo");
            $(columnElement).html("<div class='text-right' style='font-weight: bold; float: right'>" + quantityPromo.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + "</div>");

        },



    };
}


