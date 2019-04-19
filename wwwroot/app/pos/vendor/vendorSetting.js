var vendorSetting = {
    view: {
        module: 'pos',
        formName: 'vendor',
        gridName: 'grvVendor',
    }
};

function vendorInitSetting() {
    vendorSetting.valuelist = {};

    vendorSetting.grid = {
        url: 'api/pos/vendor/get',

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
            { id: 'code', field: 'code', name: vendorTranslation.CODE, width: 200, sortable: true },
            { id: 'name', field: 'name', name: vendorTranslation.NAME, width: 200, sortable: true },
            { id: 'primaryPhone', field: 'primaryPhone', name: vendorTranslation.PRIMARYPHONE, width: 200, sortable: true },            
            { id: 'primaryStreet', field: 'primaryStreet', name: vendorTranslation.PRIMARYSTREET, width: 400, sortable: true },           
            //{
            //    id: 'kind', field: 'kind', dataType: 'select', listName: 'kind', name: vendorTranslation.KIND, width: 200, sortable: true,
            //    formatter: function (row, cell, value, columnDef, dataContext) {
            //        if (value) {
            //            var checkExist = vendorSetting.valuelist.kind.find(x => x.id == value);
            //            if (checkExist)
            //                return checkExist.text;
            //            else
            //                return '';
            //        }
            //    }
            //},
        ],
    };

    vendorSetting.gridChild = {
        grvContact: {
            url: 'api/pos/contact/get',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: true,
                allowFilter: false,
                allowCustom: true,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true,

                editable: true,
                enableAddRow: false
            },
            columns: [
                { id: 'name', field: 'name', name: vendorTranslation.NAME, minWidth: 200, sortable: true, editor: Slick.Editors.Text },
                { id: 'phone', field: 'phone', name: vendorTranslation.PHONE, width: 200, sortable: true, editor: Slick.Editors.Text },
                { id: 'email', field: 'email', name: vendorTranslation.EMAIL, width: 200, sortable: true, editor: Slick.Editors.Text },
                { id: 'jobTitle', field: 'jobTitle', name: vendorTranslation.JOBTITLE, width: 150, sortable: true, editor: Slick.Editors.Text },
                //{ id: 'address', field: 'address', name: vendorTranslation.ADDRESS, width: 200, sortable: true, editor: Slick.Editors.Text },
                //{ id: 'note', field: 'note', name: vendorTranslation.NOTE, width: 200, sortable: true, editor: Slick.Editors.Text },
                
            ],
        }
    };

    vendorSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatarVendor',
            }],
    };

    vendorSetting.required = [
        "name", "primaryStreet", "primaryPhone"
    ];

    vendorSetting.validate = {
        //code: { required: true },
        name: { required: true },
        primaryStreet: { required: true },
        primaryPhone: { required: true }
    }

}
