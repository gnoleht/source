
var userSetting = {
    view: {
        module: 'system',
        formName: 'user',
        gridName: 'grvUser',
    },
};

function userInitSetting() {
    userSetting.grid = {
        url: 'api/sys/user/get',
        defaultUrl: 'api/sys/user/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,
            tableName: "SYS_User",

            allowOrder: false,
            allowFilter: false,
            allowCustom: true,
            allowExport: false,
            allowImport: false,

            autoHeight: true,
            fullWidthRows: false,
            multiColumnSort: true,

            enableColumnReorder: false,
            enableCellNavigation: false,
            explicitInitialization: false
        },

        columns: [
            {
                id: "id", name: userTranslation.ID, field: "id", sortable: true, dataType: 'text', width: 200, defaultWidth: 200
                , formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + dataContext.avatarThumb + '&def=/img/no_avatar.png\')">' +
                        '</span > <span class="txt_user_tb">' + value + '</span></div > ';
                }
            },
            { id: "displayName", name: userTranslation.DISPLAYNAME, field: "displayName", sortable: true, dataType: 'text', width: 350 },
            { id: "email", name: userTranslation.EMAIL, field: "email", sortable: true, dataType: 'text', width: 200 },
            {
                id: "createdTime", name: userTranslation.CREATEDTIME, field: "createdTime", sortable: true, dataType: 'datetime', width: 150,
                formatter: Slick.Formatters.Date
            },
        ],
        hiddenColumns: [
            { id: "firstName", name: userTranslation.FIRSTNAME, field: "firstName", sortable: true, dataType: 'text', width: 200 },
            { id: "lastName", name: userTranslation.LASTNAME, field: "lastName", sortable: true, dataType: 'text', width: 200 },
        ]
    };

    userSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],

        required: ['id', 'email', 'password', 'passConfirm'],
    };

    userSetting.valuelist = {
        operatorText: [
            { id: 'CT', text: 'Chứa trong' },
            { id: 'EQ', text: 'Bằng với' },
            { id: 'SW', text: 'Bắt đầu' },
            { id: 'EW', text: 'Kết thúc' },
        ],
        operatorNum: [
            { id: '==', text: '==' },
            { id: '!=', text: '!=' },
            { id: '>=', text: '>=' },
            { id: '<=', text: '<=' },
        ],
    };

    userSetting.required = ["id", "firstName", "lastName", "email"];

    //text: a-z
    //string: a-z & space
    //number: 0-9
    //phone: 0-9, start with 0, length = 10 or length = 11
    //email: contain one @. @ not start with or end with,
    //required: not allow null
    userSetting.validate = {
        id: { format: "text", required: true },
        firstName: { required: true },
        lastName: { required: true },
        email: { format: "email", required: true },
        mobilePhone: { format: "phone", required: false },
    }
}
