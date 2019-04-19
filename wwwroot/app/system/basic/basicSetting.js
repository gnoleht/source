var basicSetting = {};

function basicInitSetting() {
    basicSetting.view = {
        module: 'system',
        formName: 'basic',
        gridName: 'grvBasic',
    };

    basicSetting.valuelist = {
        skill: [
            { id: '1', text: { vn: 'Rất yếu', en: 'Very poor' }, class: "status_new", icon: "fa fa-circle" },
            { id: '2', text: { vn: 'Yếu', en: 'Poor' }, class: "status_active", icon: "fa fa-circle" },
            { id: '3', text: { vn: 'TB', en: 'Medium' }, class: "status_resolved", icon: "fa fa-circle" },
            { id: '4', text: { vn: 'Khá', en: 'Good' }, class: "status_closed", icon: "fa fa-circle" },
            { id: '5', text: { vn: 'Tốt', en: 'Excellent' }, class: "status_removed", icon: "fa fa-circle" },
        ]
    };

    basicSetting.grid = {
        url: 'api/sys/basic/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            editable: true,
            autoEdit: true,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,
            allowExport: true,
            allowImport: true,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true,

            dataItemColumnValueExtractor: Slick.Editors.ObjectValue
        },
        columns: [
            {
                id: "name", name: "Name", field: "name", dataType: 'text', width: 200, sortable: true,
                editor: Slick.Editors.Text
            },
            {
                id: "age", name: "Age", field: "age", dataType: 'number', width: 100, opt: { min: 15, max: 100 },
                editor: Slick.Editors.Integer,
                formatter: Slick.Formatters.Number,
                groupTotalsFormatter: Slick.Formatters.AvgTotal
            },
            {
                id: "birthday", name: "Birthday", field: "birthday", dataType: 'datetime', width: 200,
                editor: Slick.Editors.Date,
                formatter: Slick.Formatters.Date
            },
            {
                id: "role", name: "Role", field: "role", dataType: 'select', listName: 'role', width: 200,
                editor: Slick.Editors.Combobox,
                formatter: function (row, cell, value, columnDef, dataContext) {                    
                    if (dataContext.roleObject) return dataContext.roleObject.name;
                    return value;
                }
            },
            {
                id: "role2", name: "Role description", field: "role", dataType: 'text', width: 300,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.roleObject) return dataContext.roleObject.description;

                    return value;
                }
            },
            {
                id: "active", name: "Active", field: "active", dataType: 'boolen', width: 130,
                editor: Slick.Editors.Checkbox,
                formatter: Slick.Formatters.CheckBox
            },
            {
                id: "skillDotnet", name: "Dot net", field: "skills.dotnet", dataType: 'select', listName: 'skill', width: 130,
                editor: Slick.Editors.Combobox,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        var filter = basicSetting.valuelist.skill.find(x => x.id == value);
                        if (filter) return filter.text[keyLang];
                        else
                            return value;
                    }

                    return value;
                }
            },
            {
                id: "skillHTML", name: "HTML", field: "skills.html", dataType: 'select', listName: 'skill', width: 130,
                editor: Slick.Editors.Combobox,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        var filter = basicSetting.valuelist.skill.find(x => x.id == value);
                        if (filter) return filter.text[keyLang];
                        else
                            return value;
                    }

                    return "";
                }
            },
            {
                id: "skillJavascript", name: "Javascript", field: "skills.javascript", dataType: 'select', listName: 'skill', width: 150,
                editor: Slick.Editors.Combobox,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        var filter = basicSetting.valuelist.skill.find(x => x.id == value);
                        if (filter) return filter.text[keyLang];
                        else
                            return value;
                    }

                    return "";
                }
            }
        ],
        hiddenColumns: []
    };

    basicSetting.options = {
        loadButton: true
    };
}