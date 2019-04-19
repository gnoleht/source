var customerSetting = {
    view: {
        module: 'pos',
        formName: 'customer',
        gridName: 'grvCustomer',
    }
};

function customerInitSetting() {
    customerSetting.valuelist = {};

    customerSetting.grid = {
        url: 'api/pos/customer/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: false,
            allowFilter: false,
            allowCustom: true,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns: [
            //{
            //    id: "id", name: '', field: "id", sortable: true, dataType: 'text', filterable: false, width: 100, defaultWidth: 100
            //    , formatter: function (row, cell, value, columnDef, dataContext) {
            //        return '<div class="middle_40"><span class="img_user_tb img_over" style="background-image: url(\'/api/system/viewfile?id=' + dataContext.avatar + '&def=/img/no_avatar.png\')">' +
            //            '</span > </div> ';
            //    }
            //},
            { id: 'code', field: 'code', name: customerTranslation.CODE, dataType: 'text', minWidth: 200, sortable: true },
            { id: 'name', field: 'name', name: customerTranslation.NAME, width: 300, sortable: true, dataType: 'text' },
            { id: 'primaryPhone', field: 'primaryPhone', name: customerTranslation.PRIMARYPHONE, width: 300, sortable: true, dataType: 'text' },
            { id: 'primaryStreet', field: 'primaryStreet', name: customerTranslation.PRIMARYSTREET, width: 300, sortable: true, dataType: 'text' },
            
            {
                id: 'gender', field: 'gender', dataType: 'select', listName: 'gender', name: customerTranslation.GENDER, width: 100, sortable: true,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value) {
                            var checkExist = customerSetting.valuelist.gender.find(x => x.id == value);
                            if (checkExist)
                                return checkExist.text;
                            else
                                return '';
                    }
                }
            },           
            //{
            //    id: 'custGroupRelated', field: 'custGroupRelated', dataType: 'text', fieldFilter: 'name', name: customerTranslation.GROUPID, width: 300, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (dataContext.custGroupRelated) {
            //            return dataContext.custGroupRelated.name;
            //        }

            //        return value;
            //    }
            //},
            //{
            //    id: 'custTypeRelated', field: 'custTypeRelated', dataType: 'text', fieldFilter: 'name', name: customerTranslation.TYPEID, width: 300, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (dataContext.custTypeRelated) {
            //            return dataContext.custTypeRelated.name;
            //        }
            //        return value;
            //    }
            //},
            //{
            //    id: "active", field: "active", name: customerTranslation.ACTIVE, sortable: true, width: 100, defaultWidth: 100, cssClass: 'center',
            //    minWidth: 70, maxWidth: 150, filterable: false,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        var icon = dataContext.active ? "bowtie-checkbox" : "bowtie-checkbox-empty";
            //        return '<span> ' +
            //            '<i class="checkActive bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
            //            '</span> ';
            //    }
            //},
        ]
    };
    customerSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],
    };
    customerSetting.required = [
        "name", "primaryPhone", "kind", "gender", "primaryStreet"
    ];

    customerSetting.validate = {
        name: { required: true },
        primaryPhone: { required: true },
        gender: { required: true },
        //code: { required: true },
        //storeId: { required: true },
        kind: { required: true },
        primaryStreet: { required: true },
    };
}