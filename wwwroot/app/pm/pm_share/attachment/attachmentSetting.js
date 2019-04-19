var attachmentSetting = {
    view:{
        gridName: 'grvDocument',
        entityName: 'SYS_Document',
    }
};

function attachmentInitSetting() {
    attachmentSetting.valuelist = {
        status: [
            { 'id': '0', 'text': attachmentTranslation.REJECTED },
            { 'id': '1', 'text': attachmentTranslation.PENDING },
            { 'id': '2', 'text': attachmentTranslation.APPROVED },
        ],
    };
    attachmentSetting.options = {};
    attachmentSetting.grid = {
        url: 'api/pm/document/get',
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
            {
                id: "id", field: "id", name: '', width: 50, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.isCheck ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                    return '<div style="text-align:-webkit-center"> ' +
                        '<i class="' + icon + ' checkItem" style="cursor:pointer;font-size:17px;width:15.78px"></i >' +
                        '</div> ';
                }
            },
            {
                id: "name", field: "name", name: attachmentTranslation.FILENAME, dataType: 'text', width: 450,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var imageUrl = '/images/file.ico';

                    if (dataContext.fileExtension == ".doc" || dataContext.fileExtension == ".docx")
                        imageUrl = '/images/ic_word.png';
                    else if (dataContext.fileExtension == ".xls" || dataContext.fileExtension == ".xlsx")
                        imageUrl = '/images/ic_excel.png';
                    else if (dataContext.fileExtension == ".ppt" || dataContext.fileExtension == ".pptx")
                        imageUrl = '/images/ic_pdf.png';
                    else if (dataContext.fileExtension == ".png" || dataContext.fileExtension == ".jpg")
                        imageUrl = '/images/ic_img.png';
                    else if (dataContext.fileExtension == ".txt")
                        imageUrl = '/images/ic_text.png';
                    else if (dataContext.fileExtension == ".iso")
                        imageUrl = '/images/ic_iso.png';
                    else if (dataContext.fileExtension == ".exe")
                        imageUrl = '/images/ic_exe.png';
                    else if (dataContext.fileExtension == ".mp3")
                        imageUrl = '/images/ic_mp3.png';
                    else if (dataContext.fileExtension == ".mp4" || dataContext.fileExtension == ".avi")
                        imageUrl = '/images/ic_mp4.png';
                    else if (dataContext.fileExtension == ".rar")
                        imageUrl = '/images/ic_rar.png';
                    else if (dataContext.fileExtension == ".zip")
                        imageUrl = '/images/ic_zip.png';

                    return '<div class="middle_40"><span class="img_user_tb img_over" style="border-radius:0;background-color:transparent;border:0">' +
                        '<img src="' + imageUrl + '" alt="img user" style="border-radius:0; max-width: 25px;"></span> <span class="txt_user_tb">' + value + '</span></div > ';
                }
            },
            {
                id: "version", field: "version", name: attachmentTranslation.VERSION, dataType: 'text', width: 150,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var checkIcon = "";
                    var checkColor = "";
                    var checkTitile = "";

                    if (dataContext.checkOutStatus == "0" || dataContext.checkOutStatus == null || dataContext.checkOutStatus == "") {
                        checkIcon = "fa fa-unlock-alt";
                        checkColor = "#b3b3b3";
                        checkTitile = attachmentTranslation.CHECKSTATUS_PUBLIC;
                    }
                    else if (dataContext.checkOutBy == attachmentSetting.options.userId) {
                        checkIcon = "fa fa-check";
                        checkColor = "#6eb7f7";
                        checkTitile = attachmentTranslation.CHECKSTATUS_PRIVATE;
                    }
                    else {
                        checkIcon = "fa fa-lock";
                        checkColor = "#f59590";
                        checkTitile = attachmentTranslation.CHECKSTATUS_CHECKBY + dataContext.checkOutBy;
                    }

                    return value + '&nbsp;&nbsp;<i class="' + checkIcon + '" style="color:' + checkColor + '" title="' + checkTitile + '"></i>';
                }
            },
        ],
        hiddenColumns: [
            { id: "category", field: "category", name: attachmentTranslation.CATEGORY, width: 100 },
            { id: "note", field: "note", name: attachmentTranslation.NOTE, width: 250 },
        ]
    };
}