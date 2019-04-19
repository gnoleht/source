var testRunFormSetting = {
};

function testRunFormInitSetting() {
    testRunFormSetting.gridChild = {
        grvTestResults: {
            url: 'api/pm/testPlan/GetTestResults',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: false,
                allowFilter: true,
                allowCustom: false,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                forceFitColumns: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },
            columns: [
                { id: "action", field: "action", name: testRunFormTranslation.ACTION, sortable: true, width: 100 },
                { id: "expectedResults", field: "expectedResults", name: testRunFormTranslation.EXPECTEDRESULTS, sortable: true, width: 100 }
            ]
        }
    };

    testRunFormSetting.view = {};
    testRunFormSetting.valuelist = {};
    testRunFormSetting.listFilter = {};
    testRunFormSetting.options = {};
    testRunFormSetting.readonly = [];

    testRunFormSetting.required = {
        requirement: [],
        epic: [],
        function: [],
        userstory: [],
        task: [],
        bug: []
    };
}