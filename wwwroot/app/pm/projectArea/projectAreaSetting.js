//check
var projectAreaSetting = null;
function projectAreaInitSetting() {
    var temp = 0;
    projectAreaSetting = {
        view: {
            module: 'pj',
            formName: 'projectArea',
            gridName: 'grvProjectArea',
            entityName: 'PM_ProjectAreaView',

            title: projectAreaTranslation.VIEW_TITLE,
            description: projectAreaTranslation.VIEW_DESCRIPTION,
        },
        grid: {
            url: 'api/pm/projectArea/Get',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                headerRowHeight: 0,
                showHeaderRow: true,

                allowOrder: false,
                allowFilter: true,
                allowCustom: true,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 30,

                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: true,
                enableCellNavigation: true,

            },
            columns: [
                {
                    id: "name", field: "name", name: projectAreaTranslation.NAME, width: 200, sortable: true, dataType: 'text'
                },
                //{
                //    id: "projectId", field: "projectId", name: projectAreaTranslation.PROJECT, width: 200, sortable: true, dataType: 'text',
                //    formatter: function (row, cell, value, columnDef, dataContext) {
                //            return dataContext.project.code;
                        

                //    }
                //},
                {
                    id: "description", field: "description", name: projectAreaTranslation.DESCRIPTION, width: 200, sortable: true, dataType: 'text'
                },
            ],
            
        },



        valuelist: {            
            costGroup: [
                { "id": "h1", "text": "Scrum Master", "cost": 2000000 },
                { "id": "ba2", "text": "Dev", "cost": 3000000 },
                { "id": "productowner", "text": "Product Owner", "cost": 1000000 },
                { "id": "ba", "text": "BA", "cost": 3000000 }
            ],

        },

        options: {
            uploadSetting: [
                {
                    acceptedFiles: 'image/*',
                    maxFiles: 2,
                    elementId: 'imgAvatar',
                }],
        },
        required: [
            "name"
        ],

        validate: {
            name: { required: true },
        }
    }
}
