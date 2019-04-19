var workingdaySetting = {
    view: {
        module: 'pm',
        subModule: 'pj',
        formName: 'workingday'
    }
};

function workingdayInitSetting() {
    workingdaySetting.valuelist = {};
    workingdaySetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar'
            }]
    };
};