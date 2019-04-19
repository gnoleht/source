var sprintReportSetting = {
    view: {
        module: 'pm',
        formName: 'sprintReport',
        gridName: 'grvSprintReport',
    }
};

function sprintReportInitSetting() {
    sprintReportSetting.valuelist = {};

    sprintReportSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],
    };
};