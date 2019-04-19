//check
var sourceControlSetting = null;
function sourceControlInitSetting() {
    var temp = 0;
    sourceControlSetting = {
        view: {
            module: 'pm',
            formName: 'sourceControl',
            //gridName: 'grvRemberArea',
            //entityName: 'PM_RemberAreaView',

            title: memberAreaTranslation.VIEW_TITLE,
            description: memberAreaTranslation.VIEW_DESCRIPTION,
        }
    };
}