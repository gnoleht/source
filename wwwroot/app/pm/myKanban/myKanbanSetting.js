var myKanbanSetting = {
    view: {
        module: 'pm',
        formName: 'myKanban'
    },
};
function myKanbanInitSetting() {
    myKanbanSetting.options = {
        uploadSetting: [{
            acceptedFiles: '',
            maxFiles: 1,
            elementId: 'imgAvatar',
        }],
    };

    myKanbanSetting.valuelist = {};

    myKanbanSetting.options = {
        loadButton: true
    }

}
