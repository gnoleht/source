var groupSetting = null;
function groupInitSetting() {
    groupSetting = {
        view: {
            module: 'system',
            formName: 'group',
            gridName: 'grvUser',
            entityName: 'SYS_Group',

            title: groupTranslation.VIEW_TITLE,
            description: groupTranslation.VIEW_DESCRIPTION,
        },

        grid: {},

        gridChild: {
            grvUser: {
                url: 'api/user/get',
                defaultUrl: 'api/user/get',

                options: {
                    rowHeight: 40,
                    topPanelHeight: 35,

                    showHeaderRow: true,
                    headerRowHeight: 0,

                    allowOrder: true,
                    allowFilter: true,
                    allowCustom: true,

                    //forceFitColumns:true,

                    autoHeight: false,
                    fullWidthRows: true,
                    multiColumnSort: true,

                    enableColumnReorder: true,
                    enableCellNavigation: true,
                    explicitInitialization: true
                },

                columns: [
                    {
                        id: "id", name: groupTranslation.ID, field: "id", sortable: true, dataType: 'text', width: 300, defaultWidth: 300
                        , formatter: function (row, cell, value, columnDef, dataContext) {
                            return '<img src="/api/system/viewfile?id=' + dataContext.avatarThumb + '&def=/img/no_avatar.png" style="width:30px;height:30px;margin-bottom:5px"> &nbsp;' + value;
                        }
                    },
                    { id: "displayName", name: groupTranslation.DISPLAY_NAME, field: "displayName", sortable: true, dataType: 'type', width: 350, defaultWidth: 350 },
                    { id: "email", name: groupTranslation.EMAIL, field: "email", sortable: true, dataType: 'number', width: 300, defaultWidth: 300 },
                    {
                        id: "createdTime", name: groupTranslation.CREATEDTIME, field: "createdTime", sortable: true, dataType: 'datetime', width: 200, defaultWidth: 200,
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            var date = new Date(value);
                            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                        },
                    },
                ],
            },
            grvRole: {
                url: 'api/Role/Get',
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
                        id: "name", field: "name", name: groupTranslation.NAME, width: 300, minWidth: 30, sortable: true, dataType: 'text',
                        formatter: function (row, cell, value, columnDef, dataContext) {
                            return '<img src="/api/system/viewfile?id=' + dataContext.iconThumb + '&def=/img/no_avatar.png" style="width:30px;height:30px;margin-bottom:5px"> &nbsp;' + value;
                        }
                    },
                    { id: "displayName", name: groupTranslation.DISPLAY_NAME, field: "displayName", sortable: true, dataType: 'type', width: 350, defaultWidth: 350 },
                    { id: 'description', field: 'description', name: groupTranslation.DESCRIPTION, width: 600, minWidth: 50, sortable: true, dataType: 'text' }
                ],
            },
        },

        valuelist: {},

        options: {
            uploadSetting: [
                {
                    acceptedFiles: 'image/*',
                    maxFiles: 1,
                    elementId: 'imgAvatar',
                }],
        },
    }
}
