//check
var resourcePlanningSetting = {
    view: {
        module: 'pm',
        formName: 'resourcePlanning',
        gridName: 'grvResourcePlanning',
    }
};
function resourcePlanningInitSetting() {
    resourcePlanningSetting.grid = {
        url: 'api/pm/planDetail/getResourcePlanning',
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
            explicitInitialization: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 50

        },
        columns: [
            {
                id: "name", field: "name", name: resourcePlanningTranslation.NAME, width: 200, sortable: true, dataType: 'text'
            },
            {
                id: "role", field: "role", name: resourcePlanningTranslation.ROLE, width: 200, sortable: true, dataType: 'text',
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value && resourcePlanningSetting.valuelist) {
                        var thisRole = resourcePlanningSetting.valuelist.role.filter(function (item) { return item.id === value; });
                        return thisRole.length > 0 ? thisRole[0].text : "";
                    }
                    else
                        return "";
                }
            },
            {
                id: 'costGroup', field: 'costGroup', name: resourcePlanningTranslation.COSTGROUP, width: 200, sortable: true, dataType: 'text', hasBorder: true, hasName: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value && resourcePlanningSetting && resourcePlanningSetting.valuelist && resourcePlanningSetting.valuelist.costGroup) {
                        var thisCostGroup = resourcePlanningSetting.valuelist.costGroup.filter(function (item) { return item.id === value; });
                        return thisCostGroup.length > 0 ? thisCostGroup[0].text : "";
                    }
                    else
                        return "";
                }
            },
            {
                id: 'costPerMonth', field: 'costPerMonth', name: resourcePlanningTranslation.COSTPERMONTH, sortable: true, width: 200, minWidth: 50, hasTotalCol: true, hasBorder: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value != null)
                        return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    else
                        return 0;
                }
            },

            { id: 'mobilePhone', field: 'mobilePhone', name: resourcePlanningTranslation.MOBILEPHONE, width: 200, sortable: true },
            {
                id: 'workEmail', field: 'workEmail', name: resourcePlanningTranslation.WORKEMAIL, width: 200, sortable: true,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '<a style="color: #23527c" href="#">' + (value ? value : "") + '</a>';
                }
            },
            {
                id: 'startDate', field: 'startDate', name: resourcePlanningTranslation.STARTDATE, width: 200, sortable: true, formatter: Slick.Formatters.Date

            },
            {
                id: 'endDate', field: 'endDate', name: resourcePlanningTranslation.ENDDATE, dataType: "datetime", width: 200, sortable: true, formatter: Slick.Formatters.Date

            },
            { id: 'training', field: 'training', name: resourcePlanningTranslation.TRAINING, width: 200, sortable: true },

        ],
        updateFooter: function (grid) {
            if (!grid.dataView) return;

            var columnIdx = grid.getColumns().length;
            var columnElement;
            while (columnIdx--) {
                var column = grid.getColumns()[columnIdx];


                if (column.hasTotalCol) {
                    var columnId = grid.getColumns()[columnIdx].id;
                    var total = 0;

                    var length = grid.dataView.getLength();
                    while (length--) {
                        var data = grid.dataView.getItem(length);
                        total += (parseInt(data[column.field]) || 0);
                    }

                    columnElement = grid.getFooterRowColumn(columnId);
                }


                if (column.hasName) {
                    var columnId = grid.getColumns()[columnIdx].id;
                    columnElement = grid.getFooterRowColumn(columnId);
                    $(columnElement).html("<div class='text-right' style='font-weight: bold;'>" + resourcePlanningTranslation.CALCTOTAL + ": </div>");
                }
                if (column.hasTotalCol) {
                    var columnId = grid.getColumns()[columnIdx].id;
                    columnElement = grid.getFooterRowColumn(columnId);
                    $(columnElement).html(total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VNĐ');
                }
                if (column.hasUnit) {
                    var columnId = grid.getColumns()[columnIdx].id;
                    columnElement = grid.getFooterRowColumn(columnId);
                    $(columnElement).html("<p class='p-color-gray border-top text-left'>/ " + resourcePlanningTranslation.MONTH + "</p>");
                }
            }
        },
    };



    resourcePlanningSetting.valuelist = {
        role: [
            { "id": "scrummaster", "text": "Scrum Master" },
            { "id": "dev", "text": "Dev" },
            { "id": "productowner", "text": "Product Owner" },
            { "id": "ba", "text": "BA" }
        ],
        costGroup: [
            { "id": "h1", "text": "Scrum Master", "cost": 2000000 },
            { "id": "ba2", "text": "Dev", "cost": 3000000 },
            { "id": "productowner", "text": "Product Owner", "cost": 1000000 },
            { "id": "ba", "text": "BA", "cost": 3000000 }
        ],

    };

    resourcePlanningSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };
    resourcePlanningSetting.required = [
        "name", "role", "costGroup", "costPerMonth", "mobilePhone", "startDate", "endDate"
    ];

    resourcePlanningSetting.validate = {
        name: { required: true },
        role: { required: true },
        costGroup: { required: true },
        costPerMonth: { required: true },
        mobilePhone: { format: "phone", required: true },
        startDate: { required: true },
        endDate: { required: true },


    };


}
