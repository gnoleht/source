var languageSettingSetting = {
    view: {
        module: 'system',
        formName: 'languageSetting',
    }
};

function languageSettingInitSetting() {
    languageSettingSetting.gridChild = {
        grvLanguageSetting: {
            url: '',
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
                editable: true
            },

            columns: [
                { id: "name", name: languageSettingTranslation.NAME, field: "name", sortable: true, dataType: 'text', width: 230 },
                { id: "default", name: languageSettingTranslation.DEFAULT, field: "default", sortable: true, dataType: 'text', width: 360 },
                { id: "custom", name: languageSettingTranslation.CUSTOM, field: "custom", sortable: true, dataType: 'text', width: 360, editor: Slick.Editors.Text }
            ]
        }
    };
}
