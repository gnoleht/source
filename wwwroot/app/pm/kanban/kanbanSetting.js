var kanbanSetting = {
    view: {
        module: 'pm',
        subModule: 'pj',
        formName: 'kanban',
        entityName: 'PM_WorkItem',
        //title: sprintTranslation.TITLE,
        // description: sprintTranslation.DESCRIPTION,
    }
};

function kanbanInitSetting() {      
    kanbanSetting.options= {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };    

    kanbanSetting.valuelist = {};
}