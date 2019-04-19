var roleSetting = {
    view: {
        module: 'system',
        formName: 'role',
        gridName: 'grvRole',
    }
};

function roleInitSetting() {
    roleSetting.grid = {
        url: 'api/sys/role/get',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: false,
            headerHeight: 0,

            allowOrder: false,
            allowFilter: true,
            allowCustom: true,

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
                id: "code", field: "code", name: roleTranslation.NAME, width: 290, minWidth: 50, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    //return firstCharImage(value) + '<span>' + value + ': ' + dataContext.name + '</span>';
                    return firstCharImage(value) + '<span>' + dataContext.name + '</span>';
                }
            },
            //{
            //    id: "id", field: "id", name: '', width: 60, minWidth: 60, sortable: false, filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        return '<i title="' + roleTranslation.BTN_ADD_USER + '" class="fa fa-user-plus row-icon cl_light_blue btnAddUser"></i>';
            //    }
            //},
        ],
    };

    roleSetting.gridChild = {
        grvUserRole: {
            url: '',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                showHeaderRow: true,
                headerRowHeight: 0,

                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },
            columns: [
                {
                    id: "id", name: roleTranslation.USERID, field: "id", sortable: true, dataType: 'text', width: 200,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + dataContext.avatarThumb + '&def=/img/no_avatar.png\')">' +
                            '</span > <span class="txt_user_tb">' + value + '</span></div > ';
                    }
                },
                { id: "displayName", name: roleTranslation.DISPLAYNAME, field: "displayName", sortable: true, dataType: 'text', width: 420 },
                { id: "email", name: roleTranslation.EMAIL, field: "email", sortable: true, dataType: 'text', width: 380 },
                { id: "phone", name: roleTranslation.PHONE, field: "mobilePhone", sortable: true, dataType: 'text', width: 160 },
                {
                    id: 'createdTime', name: roleTranslation.CREATEDTIME, field: 'createdTime', sortable: false, dataType: 'datetime', width: 160, formatter: Slick.Formatters.Date, cssClass: 'center'
                },
                {
                    id: "id", name: '', field: "id", sortable: false, filterable: false, width: 90, minWidth: 90,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<i title="' + roleTranslation.BTN_EDIT_USER + '" class="bowtie-icon bowtie-edit-outline cl_blue row-icon btnEditUser"></i><i title="' + roleTranslation.BTN_REMOVE_USER + '" class="bowtie-icon bowtie-edit-delete cl_red row-icon btnRemoveUser"></i>';
                    }
                },
            ]
        },
        grvPermissions: {
            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: false,
                headerHeight: 0,

                allowOrder: false,
                allowFilter: true,
                allowCustom: true,

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
                    id: "id", field: "id", name: '', width: 200, minWidth: 50, sortable: false, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.id == null) { return ""; }
                        var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                        var result = '<div class="middle_40" style="display:flex;align-items:center">' + spacer;
                        var icon = dataContext.hasPermission ? '<i class="bowtie-icon bowtie-tag-fill" style="width:20px;line-height: 40px;"></i>' : '';
                        if (dataContext.hasChild) {
                            if (dataContext.isCollapsed) {
                                result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';

                            } else {
                                result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                            }
                        }
                        result = result + '<span style="margin-left:5px;width:100%">' + dataContext.name + '</span>' + icon + '</div>';
                        return result;
                    }
                }
            ],
        },
        grvAction: {
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: false,

                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: false,
                enableCellNavigation: true,
                explicitInitialization: true,

                forceFitColumns: true,
            },
            columns: [
                {
                    id: "key", name: roleTranslation.LEVEL, field: "key", sortable: false, filterable: false, resizable: false, dataType: 'text', width: 150,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value == "99") return "Personal";
                        if (value == "4") return "Group";
                        if (value == "3") return "Business unit";
                        if (value == "2") return "Branch";
                        if (value == "1") return "Company";

                        return value;
                    }
                },
                {
                    id: "all", name: roleTranslation.ALL, field: "all", sortable: false, filterable: false, resizable: false, width: 150, cssClass: "center",
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        value = dataContext.read && dataContext.create && dataContext.update && dataContext.delete;
                        dataContext.all = value;
                        var icon = value ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                        return '<div style="text-align:-webkit-center"> ' +
                            '<i class="' + icon + ' check-' + columnDef.id + '" style="cursor:pointer"></i >' +
                            '</div> ';
                    }
                },
                {
                    id: "active", name: roleTranslation.ACTIVE, field: "read", sortable: false, filterable: false, resizable: false, width: 200, cssClass: "center", colType: 'method',
                    formatter: Slick.Formatters.CheckBox
                },
                {
                    id: "read", name: roleTranslation.READ, field: "read", sortable: false, filterable: false, resizable: false, width: 150, cssClass: "center", colType: 'function',
                    formatter: Slick.Formatters.CheckBox
                },
                {
                    id: "read2", name: roleTranslation.READ, field: "read", sortable: false, filterable: false, resizable: false, width: 150, cssClass: "center", colType: 'field',
                    formatter: Slick.Formatters.CheckBox
                },
                {
                    id: "create", name: roleTranslation.CREATE, field: "create", sortable: false, filterable: false, resizable: false, width: 150, cssClass: "center", colType: 'function',
                    formatter: Slick.Formatters.CheckBox
                },
                {
                    id: "update", name: roleTranslation.UPDATE, field: "update", sortable: false, filterable: false, resizable: false, width: 150, cssClass: "center", colType: 'function',
                    formatter: Slick.Formatters.CheckBox
                },
                {
                    id: "update2", name: roleTranslation.UPDATE, field: "update", sortable: false, filterable: false, resizable: false, width: 150, cssClass: "center", colType: 'field',
                    formatter: Slick.Formatters.CheckBox
                },
                {
                    id: "delete", name: roleTranslation.DELETE, field: "delete", sortable: false, filterable: false, resizable: false, width: 150, cssClass: "center", colType: 'function',
                    formatter: Slick.Formatters.CheckBox
                }
            ]
        }
    };

    roleSetting.valuelist = {};

    roleSetting.validate = {
        code: { required: true },
        name: { required: true },
    }
}
