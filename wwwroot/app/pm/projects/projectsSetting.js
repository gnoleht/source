var projectsSetting = {
    view: {
        module: 'pm',
        subModule: 'pj',
        formName: 'projects',
        gridName: 'grvProject',
    }
};

function projectsInitSetting() {    

    projectsSetting.valuelist = {

    };

    projectsSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],
    };


    projectsSetting.required = [
        "name", "code", "state", "owner", "sponser"
    ];

    projectsSetting.readonly = [
        "productId"
    ];

    projectsSetting.validate = {
        name: { required: true },
        code: { required: true },
        state: { required: true },
        owner: { required: true },
        sponser: { required: true },
        department: { required: true },
    };
}
