var pblEstimatingSetting = {
    view: {
        module: 'pm',
        subModule: 'pj',
        formName: 'pblEstimating',
        entityName: 'PM_WorkItem',
        //title: sprintTranslation.TITLE,
        // description: sprintTranslation.DESCRIPTION,
    },
};

function pblEstimatingInitSetting() {
    pblEstimatingSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };

    pblEstimatingSetting.valuelist = {};
}