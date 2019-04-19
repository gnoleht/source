var companySetting = {
    view: {
        module: 'system',
        formName: 'company',
        gridName: 'grvCompany'
    }
};

function companyInitSetting() {
    companySetting.grid = {
        url: 'api/sys/company/get',
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
            forceFitColumns: true,
            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns: [
            {
                id: 'id', field: 'id', name: "", width: 30, defaultWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value == null || dataContext.type == "4") return "";
                    return '<div style="display:block;text-align:-webkit-center"><i class="bowtie-icon bowtie-math-plus-circle-outline addChild"></i></div>';
                }
            },
            {
                id: "name", field: "name", name: companyTranslation.COMPANYNAME, width: 260, sortable: false, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        var sValue = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        var spacer = '<span style="display:inline-block;height:1px;width:' + (20 * dataContext.indent) + 'px"></span>';
                        var color = "";

                        var itemType = companySetting.valuelist.typeList.filter(function (item) { return item.id === dataContext.type });
                        if (itemType.length > 0) {
                            {
                                var opt = itemType[0].opt;
                                color = opt.color;
                            }
                        }

                        if (dataContext.hasChild) {
                            if (dataContext.isCollapsed) {
                                return spacer + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>' + '<span style="padding-left: 10px; margin-left: 10px;border-left: 4px solid ' + color + '">' + sValue + '</span>';
                            } else
                                return spacer + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>' + '<span style="padding-left: 10px; margin-left: 10px;border-left: 4px solid ' + color + '">' + sValue + '</span>';
                        } else
                            return spacer + '<span style="display:inline-block;height:1px;width:10px"></span>' + '<span style="padding-left: 10px; margin-left: 10px;border-left: 4px solid ' + color + '">' + sValue + '</span>';
                    }
                }
            },
            {
                id: "id", field: "id", name: '', width: 60, minWidth: 30, sortable: false, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<i class="fa fa-user-plus row-icon btnAddUser" title="' + companyTranslation.ADD_NEW_USER + '" style="color: #999"></i>';
                }
            }
        ]
    };

    companySetting.gridChild = {
        grvUserInfo: {
            url: '',
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
                forceFitColumns: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },
            columns: [
                {
                    id: "id", name: companyTranslation.USERID, field: "id", sortable: true, dataType: 'text', width: 200,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + dataContext.avatarThumb + '&def=/img/no_avatar.png\')">' +
                            '</span > <span class="txt_user_tb">' + value + '</span></div > ';
                    }
                },
                { id: "displayName", name: companyTranslation.DISPLAYNAME, field: "displayName", sortable: true, dataType: 'text', width: 350 },
                { id: "email", name: companyTranslation.EMAIL, field: "email", sortable: true, dataType: 'text', width: 300 },
                { id: "phone", name: companyTranslation.PHONE, field: "mobilePhone", sortable: true, dataType: 'text', width: 120 },
                {
                    id: 'createdTime', name: companyTranslation.CREATEDTIME, field: 'createdTime', sortable: false, dataType: 'datetime', width: 120, formatter: Slick.Formatters.Date, cssClass: 'center'
                },
                {
                    id: "id", name: '', field: "id", sortable: false, filterable: false, width: 100,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<i class="bowtie-icon bowtie-edit-outline cl_blue row-icon btnEditUser" title="' + companyTranslation.EDIT_USER + '"></i><i class="bowtie-icon bowtie-edit-delete cl_red row-icon btnRemoveUser" title="' + companyTranslation.DELETE_USER + '"></i>';
                    }
                }
            ],
            hiddenColumns: [
                { id: "firstName", name: companyTranslation.FIRSTNAME, field: "firstName", sortable: true, dataType: 'text', width: 200 },
                { id: "lastName", name: companyTranslation.LASTNAME, field: "lastName", sortable: true, dataType: 'text', width: 200 },
                {
                    id: "lastLogin", name: companyTranslation.LASTLOGIN, field: "lastLogin", sortable: true, dataType: 'datetime', width: 150,
                    formatter: Slick.Formatters.Date
                }
            ]
        }
    };

    companySetting.valuelist = {};
    companySetting.required = ['code', 'name', 'nameEn', 'address', 'tax', 'phone', 'email', 'type'];
    companySetting.readonly = ['directlyUnder'];
    companySetting.options = {
        loadButton: true,
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatarCompany'
            }]
    };

    companySetting.validate = {
        code: { required: true },
        name: { required: true },
        nameEN: { required: true },
        email: { required: true },
        phone: { required: true },
        address: { required: true },
        type: { required: true },
        tax: { required: true }
    };
}