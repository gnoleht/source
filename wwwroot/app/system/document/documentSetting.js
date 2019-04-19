var documentSetting = {
    view: {
        module: 'system',
        formName: 'document',
        gridName: 'grvFolder',
    }
};

function documentInitSetting() {
    documentSetting.grid = {
        url: 'api/sys/document/getFolder',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,
            headerHeight: 0,

            allowOrder: false,
            allowFilter: true,
            allowCustom: false,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: false,

            enableColumnReorder: false,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns: [
            {
                id: "text", field: "text", name: documentTranslation.FILENAME, sortable: false, filterable: false, dataType: 'text', width: 330, minWidth: 330,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_40">' + spacer;
                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';

                        } else {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                        }
                    }
                    result = result + '<span class="folder_item"> <i class="bowtie-icon bowtie-folder" style="margin-left:5px;margin-right:5px"></i>' + value + '</span></div>';
                    return result;
                }
            }
        ],
        hiddenColumns: []
    };

    documentSetting.valuelist = {
        entityType: [
            {
                "id": "PM_WorkItem",
                "text": "Work item"
            },
            {
                "id": "PM_Cost",
                "text": "Cost"
            }
        ],
        workItemType: [
            {
                "id": "requirement",
                "text": "Requirement"
            },
            {
                "id": "epic",
                "text": "Epic"
            },
            {
                "id": "function",
                "text": "Function"
            },
            {
                "id": "userstory",
                "text": "User story"
            },
            {
                "id": "task",
                "text": "Task"
            },
            {
                "id": "bug",
                "text": "Bug"
            }
        ],
        status: [
            { 'id': 'new', 'text': documentTranslation.NEW },
            { 'id': 'pending', 'text': documentTranslation.PENDING },
            { 'id': 'rejected', 'text': documentTranslation.REJECTED },
            { 'id': 'approved', 'text': documentTranslation.APPROVED },
        ],
    };

    documentSetting.options = {
        fileColor: {
            '.xls': '#2ECC40',
            '.xlsx': '#2ECC40',
            '.doc': '#0074D9',
            '.docx': '#0074D9',
            '.ppt': '#FF4136',
            '.pptx': '#FF4136',
            '.pdf': '#FF4136',
            '.zip': '#FFDC00',
            '.rar': '#FFDC00',
            '.7z': '#FFDC00',
            '.txt': '#85144b',
            '.file': '#FF851B',
            '.png': '#00B19D',
            '.jpg': '#00B19D',
            '.ico': '#00B19D',
        },

        fileIcon: {
            '.xls': 'fa fa-file-excel-o',
            '.xlsx': 'fa fa-file-excel-o',
            '.doc': 'fa fa-file-word-o',
            '.docx': 'fa fa-file-word-o',
            '.ppt': 'fa fa-file-powerpoint-o',
            '.pptx': 'fa fa-file-powerpoint-o',
            '.pdf': 'fa-file-pdf-o',
            '.zip': 'fa fa-file-archive-o',
            '.rar': 'fa fa-file-archive-o',
            '.7z': 'fa fa-file-archive-o',
            '.txt': 'fa fa-file-text-o',
            '.png': 'fa fa-file-image-o',
            '.jpg': 'fa fa-file-image-o',
            '.ico': 'fa fa-file-image-o',
            '.file': 'fa fa-file-o'
        },
    };

    documentSetting.gridChild = {
        grvDocument: {
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
                    id: "name", field: "name", name: documentTranslation.FILENAME, sortable: true, dataType: 'text', width: 400, minWidth: 200,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var imageUrl = '/images/file.ico';
                        if (dataContext.fileExtension == ".doc" || dataContext.fileExtension == ".docx" || dataContext.fileExtension == ".dotx")
                            imageUrl = '/images/ic_word.png';
                        else if (dataContext.fileExtension == ".xls" || dataContext.fileExtension == ".xlsx" || dataContext.fileExtension == ".xltx" || dataContext.fileExtension == ".csv")
                            imageUrl = '/images/ic_excel.png';
                        else if (dataContext.fileExtension == ".ppt" || dataContext.fileExtension == ".pptx")
                            imageUrl = '/images/ic_ppt.png';
                        else if (dataContext.fileExtension == ".7z" || dataContext.fileExtension == ".zip" || dataContext.fileExtension == ".rar")
                            imageUrl = '/images/ic_rar.png';
                        else if (dataContext.fileExtension == ".png" || dataContext.fileExtension == ".jpg" || dataContext.fileExtension == ".jpeg"
                            || dataContext.fileExtension == ".gip" || dataContext.fileExtension == ".bmp" || dataContext.fileExtension == ".tif" || dataContext.fileExtension == ".ico")
                            imageUrl = '/images/ic_img.png';
                        else if (dataContext.fileExtension == ".txt" || dataContext.fileExtension == ".json" || dataContext.fileExtension == ".js"
                            || dataContext.fileExtension == ".html" || dataContext.fileExtension == ".cs" || dataContext.fileExtension == ".css")
                            imageUrl = '/images/ic_txt.png';
                        else {
                            var fileExtension = dataContext.fileExtension.replace('.', 'ic_');
                            imageUrl = '/images/' + fileExtension + ".png";
                        }

                        return '<div class="middle_40"><span class="img_user_tb img_over" style="border-radius:0; background-color: transparent; background-size:contain; background-repeat:no-repeat; border:0; background-image: url(\'' + imageUrl + '\')">' +
                            '</span> <span class="txt_user_tb">' + value + '</span></div > ';
                    }
                },
                {
                    id: "version", field: "version", name: documentTranslation.VERSION, sortable: true, dataType: 'number', width: 100, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var checkIcon = "";
                        var checkColor = "";
                        var checkTitile = "";

                        if (dataContext.checkOutStatus == "0" || dataContext.checkOutStatus == null || dataContext.checkOutStatus == "") {
                            checkIcon = "fa fa-unlock-alt";
                            checkColor = "#b3b3b3";
                            checkTitile = documentTranslation.CHECKSTATUS_PUBLIC;
                        }
                        else if (dataContext.checkOutBy == documentSetting.options.userId) {
                            checkIcon = "fa fa-check";
                            checkColor = "#6eb7f7";
                            checkTitile = documentTranslation.CHECKSTATUS_PRIVATE;
                        }
                        else {
                            checkIcon = "fa fa-lock";
                            checkColor = "#f59590";
                            checkTitile = documentTranslation.CHECKSTATUS_CHECKBY + dataContext.checkOutBy;
                        }

                        var number = parseFloat(Math.round(value * 100) / 100).toFixed(2);
                        return number + '&nbsp;&nbsp;<i class="' + checkIcon + '" style="color:' + checkColor + '" title="' + checkTitile + '"></i>';
                    }
                },
                {
                    //"new","pending","rejected","approved"
                    id: "status", field: "status", name: documentTranslation.STATUS, sortable: true, dataType: 'select', listName: 'status', width: 150, minWidth: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && documentSetting && documentSetting.valuelist && documentSetting.valuelist.status) {
                            var filter = documentSetting.valuelist.status.filter(x => x.id == value);
                            if (filter.length > 0)
                                return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + filter[0].text;
                        }

                        return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + value;
                    }
                },
                {
                    id: "modifiedByUserRelated", field: "modifiedByUserRelated", sortable: true, name: documentTranslation.MODIFIED, filterable: false, dataType: 'text', fieldFilter: 'displayName', width: 300, minWidth: 150,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value == null) return "";

                        var date = new Date(dataContext.modifiedTime);
                        return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + value.avatarThumb + '&def=/img/no_avatar.png\')"> </span > ' +
                            '<span class="txt_user_tb">' + value.displayName + '</span>' +
                            '<span class="txt_user_tb">&nbsp;&nbsp;(' + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) + ')</span>' +
                            '</div > ';
                    }
                },
            ],
            hiddenColumns: [
                { id: "note", field: "note", name: documentTranslation.NOTE, width: 250 },
            ]
        },

        grvHistory: {
            url: 'api/pm/document/getHistory',
            options: {
                rowHeight: 50,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,
            },
            columns: [
                {
                    id: "version", field: "version", name: documentTranslation.FILENAME, width: 400,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        url = "api/system/viewFile?id=" + dataContext.fileId;
                        var sData = '<span style="width:100%;float:left;line-height:25px"><a href="' + url + '" target="_blank" style="text-decoration: underline">' + dataContext.name + '</a></span>';
                        var sVersion = '<span style="width:100%;float:left;line-height:25px">' + documentTranslation.VERSION + ': ' + value.toFixed(2) + '</span>';
                        return '<div>' + sData + sVersion + '</div>';
                    }
                },
                {
                    id: "by", field: "by", name: documentTranslation.MODIFIEDBY, width: 200,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var sUser = '<span style="width:100%;float:left;line-height:25px"><i class="fa fa-user" style="width:14px;text-align:center;margin-right:5px"></i>' + value + '</span>';
                        var sDateTime = '<span style="width:100%;float:left;line-height:25px"><i class="fa fa-clock-o" style="margin-right:5px"></i>' + dataContext.on + '</span>';
                        return '<div>' + sUser + sDateTime + '</div>';
                    }
                },
                {
                    id: "status", field: "status", name: documentTranslation.STATUS, width: 150,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && documentSetting && documentSetting.valuelist && documentSetting.valuelist.status) {
                            var filter = documentSetting.valuelist.status.filter(x => x.id == value);
                            if (filter.length > 0)
                                return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + filter[0].text;
                        }

                        return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + value;
                    }
                },
                { id: "note", field: "note", name: documentTranslation.NOTE, width: 200 },
            ],
        },

        gridWorkItemLink: {
            url: 'api/pm/document/findDocumentLink',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: true,
                allowCustom: false,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                forceFitColumns: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },
            columns: [
                {
                    id: "id", field: "id", width: 30, filterable: false, dataType: 'boolen', fieldFilter: 'isCheck',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = dataContext.isCheck ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                        return '<div style="text-align:-webkit-center"> ' +
                            '<i class="' + icon + ' checkWI" style="cursor:pointer;font-size:17px;width:15.78px"></i >' +
                            '</div> ';
                    }
                },
                {
                    id: "name", field: "name", name: "Title", width: 450, filterable: true, dataType: 'text', fieldFilter: 'no;name',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.no)
                            return '<span class="type_' + dataContext.type + '"> ' + dataContext.no + ': ' + value + '</span>';
                        else
                            return '<span class="type_' + dataContext.type + '"> ' + value + '</span>';
                    }
                },
                {
                    id: "state", name: "State", field: "state", width: 100, filterable: true, dataType: 'select', listName: 'state',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<i class=\"fa fa-circle status_' + value + '\"></i>&nbsp;' + capitalizeText(value);
                    }
                }

            ],
        }
    };

    documentSetting.required = ["folder", "folder.text"];

    documentSetting.readonly = ["fileName"];
};