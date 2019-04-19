var productSetting = {
    view: {
        module: 'pm',
        subModule: 'pm',
        formName: 'product',
        entityName: 'PM_Product',
    }
};

function productInitSetting() {
    productSetting.valuelist = {};

    productSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatar',
            }],
    };

    productSetting.required = [
        "name", "code", "state", "owner", "sponser"
    ];

    productSetting.validate = {
        name: { required: true },
        code: { required: true },
        state: { required: true },
        owner: { required: true },
        sponser: { required: true },
    };
}
