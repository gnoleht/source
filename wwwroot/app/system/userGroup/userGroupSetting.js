var userGroupSetting = null;
function userGroupInitSetting() {
    userGroupSetting = {
        view: {
            module: 'system',
            formName: 'userGroup',
            gridName: 'grvUserGroup',
            entityName: 'SYS_Group',

            title: userGroupTranslation.VIEW_TITLE,
            description: userGroupTranslation.VIEW_DESCRIPTION,
        },

        grid: {
            url: 'api/group/GetUserGroup',
            defaultUrl: 'api/group/GetUserGroup',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                showHeaderRow: false,
                headerRowHeight: 0,
                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                leaveSpaceForNewRows: false,
                explicitInitialization: true,

                dbClickEdit: false,
            },
            columns: [
                {
                    id: "userName", field: 'userName', name: userGroupTranslation.NAME, width: 400, minWidth: 50, filterable: false, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<img src="/api/system/viewfile?id=' + dataContext.userAvatar + '&def=/img/no_avatar.png" alt="user-image" style="width:30px;height:30px"> &nbsp &nbsp' + value;
                    }
                },
                {
                    id: "id", field: 'id', name: '', width: 50, minWidth: 50, filterable: false, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<span style="float:right" onclick="userGroupSetting.options.scope.delete(\'' + value + '\',\'' + dataContext.userId + '\',\'' + dataContext.userName + '\',\'' + dataContext.userAvatar + '\')"><i class="fa fa-close"></i></span>';
                    },
                }
            ],
        },

        valuelist: {},
        options: {},
    }
}
