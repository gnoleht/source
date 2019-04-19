var envisionConfigSetting = {
    view: {
        module: 'pm',
        formName: 'envisionConfig',
        gridName: 'grvEnvisionConfig',
        EntityName: 'PM_EnvisionBasic',
        title: envisionConfigTranslation.PAGE_TITLE,
        description: envisionConfigTranslation.PAGE_DESCRIPTION,
    }
};
function envisionConfigInitSetting() {

    envisionConfigSetting.grid = {
        url: 'api/envisionConfig/get',
        defaultUrl: 'api/envisionConfig/get',

        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 30,

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns:
            [

                { id: "type", name: envisionConfigTranslation.TYPE, field: "type", sortable: true, dataType: 'type', width: 350 },

                { id: "title", name: envisionConfigTranslation.TITLE, field: "title", sortable: true, dataType: 'type', width: 350 },
                { id: "description", name: envisionConfigTranslation.DESCRIPTION, field: "description", sortable: true, dataType: 'type', width: 350 },
            ]

    };


    envisionConfigSetting.options = {};


    envisionConfigSetting.valuelist = {
        role: [
            { id: 'site', text: envisionConfigTranslation.SITE, },

        ],
        selectTypeOption: { id: 'site', text: envisionConfigTranslation.SITE }
    };
}