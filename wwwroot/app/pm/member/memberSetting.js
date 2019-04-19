var memberSetting = {
    view: {
        module: 'pm',
        subModule: 'pj',
        formName: 'member',
        gridName: 'grvMember',
        entityName: 'PM_Member',
    }
};
function memberInitSetting() {
    memberSetting.grid = {
        url: 'api/pm/member/get',
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

            {

                id: 'searchValue', field: "searchValue", name: memberTranslation.NAME, width: 300, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || dataContext == null) return "";
                    if (dataContext.user == null)
                        return dataContext.userId + " - Not exist in System User";
                    if (dataContext.user != null)
                        return '<span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + dataContext.user.avatarThumb + '&def=/img/no_avatar.png\')"></span>' + dataContext.user.firstName + ', ' + dataContext.user.lastName;
                    return "";
                }
            },
            {
                id: 'projectArea', field: 'projectArea', name: memberTranslation.PROJECTAREA, width: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.relatedProjectAreas == null || dataContext.relatedProjectAreas.length < 1)
                        return '...';
                    else {
                        var stringValue = "";

                        if (dataContext.relatedProjectAreas.length > 1) {
                            stringValue += memberSetting.valuelist.projectArea.filter(function (item) { return item.id === value[0]; })[0].text + ' +' + (dataContext.relatedProjectAreas.length - 1);
                        }
                        else {
                            stringValue += memberSetting.valuelist.projectArea.filter(function (item) { return item.id === value[0]; })[0].text;
                        }

                        //memberSetting.valuelist.currentRoles = value;
                        return '<a class="showAreas link">' + stringValue + '</a>';
                    }
                }
            },
            {
                id: 'role', field: 'role', cssClass: "color-blue", name: memberTranslation.JOBTITLE, width: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.role == null || dataContext.role.length < 1)
                        return '...';
                    else {
                        var stringValue = "";

                        if (dataContext.role.length > 1) {
                            stringValue += memberSetting.valuelist.roleFull.filter(function (item) { return item.id === value[0]; })[0].text + ' +' + (dataContext.role.length - 1);
                        }
                        else {
                            stringValue += memberSetting.valuelist.roleFull.filter(function (item) { return item.id === value[0]; })[0].text;
                        }

                        //memberSetting.valuelist.currentRoles = value;
                        return '<a class="showRoles link">' + stringValue + '</a>';
                    }
                }
            },
            { id: 'workPhone', field: 'workPhone', name: memberTranslation.WORKPHONE, width: 200, sortable: true },
            {
                id: 'user.mobilePhone', field: 'user.mobilePhone', name: memberTranslation.MOBILEPHONE, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.user == null)
                        return "Not exist in System User";
                    return dataContext.user.mobilePhone;
                }
            },
            {
                id: 'user.email', field: 'email', cssClass: "color-blue", name: memberTranslation.WORKEMAIL, width: 200,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.user == null)
                        return "Not exist in System User";
                    return dataContext.user.email;
                }
            },

            { id: 'payRanges', field: 'payRanges', cssClass: "color-blue", name: memberTranslation.PAYRANGES, width: 200, sortable: true },
            { id: 'userId', field: 'userId', cssClass: "color-blue", name: memberTranslation.USERID, width: 200 },
            {
                id: 'user.birthDay', name: memberTranslation.BIRTHDAY, field: "user.birthDay", sortable: true, dataType: "text", width: 100, minWidth: 50, formatter: Slick.Formatters.Date,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.user == null)
                        return "Not exist in System User";
                    if (dataContext.user.birthDay != null) {
                        var birthDay = moment(dataContext.user.birthDay).format('DD/MM/YYYY')
                        return birthDay;
                    }
                    return "";
                }
            }
        ],

    };



    memberSetting.valuelist = {
        currentRoles: [],
        payRanges: [
            { id: 'Mức 1', text: 'Mức 1' },
            { id: 'Mức 2', text: 'Mức 2' },
            { id: 'Mức 3', text: 'Mức 3' }
        ],
        testArray01: [
            { id: '1', text: 'demo content 1' },
            { id: '2', text: 'demo content 2' },
            { id: '3', text: 'demo content 3' }
        ],
    };

    memberSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],
    };
    memberSetting.readonly = [
        "office"
    ];
    memberSetting.validate = {
        userId: { required: true },
        "user.firstName": { required: true },
        "user.lastName": { required: true },
        "user.email": { format: "email", required: true },
        workPhone: { format: "phone" },
        "user.mobilePhone": { format: "phone" },
    };

}
