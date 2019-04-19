var employeeSetting = {
    view: {
        module: 'pos',
        formName: 'employee',
        gridName: 'grvEmployee',
    }
};

function employeeInitSetting() {
    employeeSetting.valuelist = {};

    employeeSetting.grid = {
        url: 'api/pos/employee/get',

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
            { id: 'code', field: 'code', name: employeeTranslation.CODE, width: 180, sortable: true },
            { id: 'barcode', field: 'barcode', name: employeeTranslation.BARCODE, width: 200, sortable: true },
            { id: 'displayName', field: 'displayName', name: employeeTranslation.DISPLAYNAME, width: 300, sortable: true },
            {
                id: 'gender', field: 'gender', name: employeeTranslation.GENDER, width: 150, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        if (employeeSetting && employeeSetting.valuelist && employeeSetting.valuelist.gender) {
                            var item = employeeSetting.valuelist.gender.find(x => x.id == value).text;

                            if (item)
                                return item;
                        }
                    }                

                    return value;
                }
            },
            { id: 'primaryPhone', field: 'primaryPhone', name: employeeTranslation.PRIMARYPHONE, width: 150, sortable: true },
            { id: 'secondaryStreet', field: 'secondaryStreet', name: employeeTranslation.SECONDARYSTREET, width: 440, sortable: true },
        ],
    };

    employeeSetting.gridChild = {
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
                { id: 'name', field: 'name', name: employeeTranslation.NAME, width: 200, sortable: true, editor: Slick.Editors.Text },
                { id: 'phone', field: 'phone', name: employeeTranslation.PHONE, width: 170, sortable: true, editor: Slick.Editors.Text },
                { id: 'emailContact', field: 'email', name: employeeTranslation.EMAIL, width: 200, sortable: true, editor: Slick.Editors.Text},
                { id: 'relationshipContact', field: 'relationship', name: employeeTranslation.RELATIONSHIP, width: 150, sortable: true, editor: Slick.Editors.Text },
                { id: 'addressContact', field: 'address', name: employeeTranslation.ADDRESS, width: 200, sortable: true, editor: Slick.Editors.Text},
                { id: 'noteContact', field: 'note', name: employeeTranslation.NOTE, width: 200, sortable: true, editor: Slick.Editors.Text },
            ],
            //hiddenColumns: [
            //    { id: 'id', field: 'id', name: employeeTranslation.ID, width: 100, sortable: true, editor: Slick.Editors.Text },
            //]
        }        
    };

    employeeSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],
    };

    employeeSetting.required = [
        "firstName", "lastName", "birthday", "gender", "identificationNo", "identificationDate", "identificationPlace"
    ];

    employeeSetting.validate = {
        firstName: { required: true },      
        lastName: { required: true },      
        birthday: { required: true },      
        gender: { required: true },      
        identificationNo: { required: true },      
        identificationDate: { required: true },      
        identificationPlace: { required: true },      
    }

}
