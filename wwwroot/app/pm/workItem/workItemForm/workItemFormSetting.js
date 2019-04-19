
var workItemFormSetting = {
    view: {
        module: 'pm',
        formName: 'modalWorkItem',
        gridName: 'grvTable',
        entityName: 'PM_WorkItem',
    }
};


function workItemFormInitSetting() {
    workItemFormSetting.valuelist = {};

    workItemFormSetting.listFilter = {};

    workItemFormSetting.gridChild = {
        grvTestSteps: {
            url: '',
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

                enableColumnReorder: false,
                enableCellNavigation: true,
                explicitInitialization: true,

                editable: true,
                enableAddRow: true
            },
            columns: [
                {
                    id: "id", name: "#", field: "id", sortable: false, width: 50, filterable: false, resizable: false, focusable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        dataContext.id = row;
                        return row + 1;
                    }
                },
                { id: "action", name: workItemFormTranslation.ACTION, field: "action", sortable: false, width: 300, editor: Slick.Editors.Text },
                { id: "expectedResults", name: workItemFormTranslation.EXPECTEDRESULTS, field: "expectedResults", sortable: false, width: 300, editor: Slick.Editors.Text },
                { id: "note", field: "note", name: workItemFormTranslation.NOTE, width: 250, editor: Slick.Editors.Text, sortable: false },
            ],
            hiddenColumns: [
                {
                    id: "attachFileName", field: "attachFileName", name: workItemFormTranslation.ATTACHFILEFILENAME, width: 210,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.attachFileName == null) return;
                        url = "api/system/viewFile/" + dataContext.attachFileId + "/" + dataContext.attachFileName;
                        var sData = '<span style="width:100%;float:left;line-height:25px"><a href="' + url + '" target="_blank" style="text-decoration: underline">' + dataContext.attachFileName + '</a></span>';
                        return '<div>' + sData + '</div>';
                    }
                },
                {
                    id: "screenshotName", field: "screenshotName", name: workItemFormTranslation.SCREENSHOTNAME, width: 210,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        url = "api/system/viewFile/" + dataContext.screenshotId + "/" + dataContext.screenshotName;
                        var sData = '<span style="width:100%;float:left;line-height:25px"><a href="' + url + '" target="_blank" style="text-decoration: underline">' + dataContext.screenshotName + '</a></span>';
                        return '<div>' + sData + '</div>';
                    }
                },
                {
                    id: "voiceName", field: "voiceName", name: workItemFormTranslation.VOICENAME, width: 210,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        url = "api/system/viewFile/" + dataContext.voiceId + "/" + dataContext.voiceName;
                        var sData = '<span style="width:100%;float:left;line-height:25px"><a href="' + url + '" target="_blank" style="text-decoration: underline">' + dataContext.voiceName + '</a></span>';
                        return '<div>' + sData + '</div>';
                    }
                },
            ]
        },
    };

    workItemFormSetting.required = {
        requirement: [],
        epic: [],
        function: [],
        userstory: [],
        task: [],
        bug: []
    };

    workItemFormSetting.readonly = ["reason", "actualDuration", "planDuration", "actualStartDate", "actualEndDate"];
}