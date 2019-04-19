var functionSetting = {
    view: {
        module: 'system',
        formName: 'function',
        gridName: 'grvFunction',
    }
};

function functionInitSetting() {
    functionSetting.grid = {
        url: 'api/sys/function/get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

            showHeaderRow: true,
            headerRowHeight: 0,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns: [
            {
                id: 'id', field: 'id', name: "", width: 25, defaultWidth: 25, sortable: false, filterable: false,
                header: {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-view-list-tree",
                        command: 'collapseAll',
                        showOnHover: false,
                    }]
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || dataContext.indent == 2) return "";
                    return '<div style="display:block;text-align:-webkit-center"><i class="bowtie-icon bowtie-math-plus-circle-outline addChild"></i></div>';
                }
            },
            {
                id: "name", field: "name", name: functionTranslation.FUNCNAME, width: 350, defaultWidth: 350, sortable: false, behavior: "selectAndMove", dataType: 'text', fieldFilter: keyLang,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value[keyLang] == null || value[keyLang] == "") {
                        if (dataContext.style && dataContext.style.iconThumb && dataContext.style.iconThumb != "")
                            value[keyLang] = "(" + functionTranslation.IMAGE_ROWNAME + ")";
                        else
                            return "";
                    }

                    var sValue = value[keyLang].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (20 * dataContext["indent"]) + 'px"></span>';

                    var color = "#55ACEE";
                    if (dataContext.indent == 1)
                        color = "#F7AA47";
                    var icon = '<div style="border-right:5px solid ' + color + ';margin-left:5px;line-hight:40px;display:inline"></div> &nbsp&nbsp;';
                    if (dataContext.indent == 2)
                        icon = '<i class="' + dataContext.style.icon + '" style="cursor:pointer"></i> &nbsp&nbsp;';

                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            return spacer + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>' + icon + sValue;
                        } else
                            return spacer + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>' + icon + sValue;
                    } else
                        return spacer + '<span style="width:10px;height:1px;display:inline-block"></span>' + icon + sValue;
                }
            },
            {
                id: 'description', field: 'description', name: functionTranslation.FUNCDESCRIPTION, width: 500, defaultWidth: 500, sortable: false, dataType: 'text', fieldFilter: keyLang,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value == undefined || dataContext === undefined) { return ""; }
                    return value[keyLang];
                },
            },
            { id: 'url', field: 'url', name: functionTranslation.URL, width: 150, defaultWidth: 150, sortable: false },
            {
                id: 'style', field: 'style', name: functionTranslation.FUNCCOLOR, width: 150, sortable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value.backColor == null) return "";
                    return '<div style="height:20px;margin-right:20px;margin-top:10px;line-height:20px;background-color:' + value.backColor + ';border:1px solid #ddd;text-align:center">' + value.backColor + '</div>';
                }
            },
            {
                id: 'style', field: 'style', name: functionTranslation.FUNCICON, width: 250, defaultWidth: 250, sortable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value.icon == null) return "";
                    return '<i class="' + value.icon + '">   ' + value.icon + '</i>';
                }
            },
            {
                id: 'style', field: 'style', name: functionTranslation.FUNCCOLOR, width: 1, defaultWidth: 150, sortable: false, cssClass: "hiddenColumn", headerCssClass: "hiddenColumn",
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value.titleColor == null) return "";
                    return '<div style="height:20px;margin-right:20px;margin-top:10px;line-height:20px;background-color:' + value.titleColor + ';border:1px solid #ddd;text-align:center">' + value.titleColor + '</div>';
                }
            },
            {
                id: 'style', field: 'style', name: functionTranslation.FUNCCOLOR, width: 1, defaultWidth: 150, sortable: false, cssClass: "hiddenColumn", headerCssClass: "hiddenColumn",
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || value.descColor == null) return "";
                    return '<div style="height:20px;margin-right:20px;margin-top:10px;line-height:20px;background-color:' + value.descColor + ';border:1px solid #ddd;text-align:center">' + value.descColor + '</div>';
                }
            },
        ],
    };

    functionSetting.valuelist = {
        style: {
            backColor: [
                { id: '#FFF', text: '#FFF' },
                { id: '#3B5998', text: '#3B5998' },
                { id: '#68B828', text: '#68B828' },
                { id: '#7C38BC', text: '#7C38BC' },
                { id: '#0E62C7', text: '#0E62C7' },
                { id: '#F7AA47', text: '#F7AA47' },
                { id: '#FF6264', text: '#FF6264' },
                { id: '#00B19D', text: '#00B19D' },
                { id: '#55ACEE', text: '#55ACEE' },
                { id: '#2C2E2F', text: '#2C2E2F' },
                { id: '#CC3F44', text: '#CC3F44' },
                { id: '#FCD036', text: '#FCD036' },
            ]
        }
    };

    functionSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],

        required: ['name.vn', 'name.en'],
    };
}
