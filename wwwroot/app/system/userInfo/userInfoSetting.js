var userInfoSetting = null;
function userInfoInitSetting() {
    userInfoSetting = {
        view: {
            module: 'system',
            formName: 'userInfo',
            gridName: 'grvUserInfo',
            entityName: 'SYS_User',
        },

        grid: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: true,
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

            ],
            hiddenColumns: [
            ]
        },
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